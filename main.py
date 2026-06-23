from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from collections import Counter
import psycopg2
import feedparser
import re
from config import DATABASE_URL as url
from datetime import datetime, timezone
import calendar

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


FUENTES = [
    ("Google Noticias", "https://news.google.com/rss?hl=es-419&gl=CO&ceid=CO:es-419"),
    ("El Tiempo", "https://www.eltiempo.com/rss/colombia.xml"),
    ("El Tiempo", "https://www.eltiempo.com/rss/economia.xml"),
    ("El Tiempo", "https://www.eltiempo.com/rss/tecnosfera.xml"),
    ("El Tiempo", "https://www.eltiempo.com/rss/deportes.xml"),
    ("La FM", "https://www.lafm.com.co/rss/actualidad.xml"),
    ("Portafolio", "https://www.portafolio.co/rss/economia.xml"),
]

CATEGORIAS = {
    "deportes": ["fútbol", "gol", "partido", "liga", "selección", "mundial",
                "ciclismo", "vuelta", "dimayor", "campeón", "nairo"],
    "economía": ["dólar", "peso colombiano", "inflación", "banco", "banrep",
                "economía", "mercado", "precio", "tasas", "bolsa", "empleo",
                "salario", "impuesto"],
    "política": ["petro", "gobierno", "congreso", "senado", "presidente",
                "elecciones", "ministro", "reforma", "constituyente", "cepeda"],
    "judicial": ["corte", "fiscalía", "capturado", "homicidio", "policía",
                "eln", "disidencias", "narcotráfico", "crimen", "captura"],
    "tecnología": ["tecnología", "inteligencia artificial", "celular",
                "software", "spacex", "android", "iphone"],
    "entretenimiento": ["shakira", "música", "cine", "película", "concierto",
                        "cantante", "artista"],
}

STOPWORDS = {
    "de","la","el","en","y","a","los","del","se","las","por","un","para",
    "con","no","una","su","al","es","lo","como","más","pero","sus","le","ya",
    "o","este","esta","entre","cuando","muy","sin","sobre","también","hasta",
    "hay","donde","tras","que","fue","ser","son","está","están","tiene","años",
    "ante","desde","contra","sino","cada","qué","cómo"
}


def clasificar(texto):
    texto = texto.lower()
    for categoria, palabras in CATEGORIAS.items():
        for palabra in palabras:
            if palabra in texto:
                return categoria
    return "general"

def parsear_fecha(entrada):
    # feedparser ya intenta parsear la fecha del RSS y la deja en 'published_parsed'.
    t = entrada.get("published_parsed") or entrada.get("updated_parsed")
    if not t:
        return None  # si no hay fecha, guardamos NULL (vacío)
    # 'published_parsed' viene en horario UTC; calendar.timegm lo respeta bien.
    return datetime.fromtimestamp(calendar.timegm(t), tz=timezone.utc)

def extraer_imagen(entrada):
    # 1. Media RSS (media:content / media:thumbnail) — lo más común.
    for clave in ("media_content", "media_thumbnail"):
        medios = entrada.get(clave)
        if medios and medios[0].get("url"):
            return medios[0]["url"]
    # 2. Enclosures (adjuntos tipo imagen).
    for enlace in entrada.get("links", []):
        if enlace.get("rel") == "enclosure" and "image" in enlace.get("type", ""):
            if enlace.get("href"):
                return enlace["href"]
    # 3. Una <img> dentro del resumen HTML.
    coincidencia = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', entrada.get("summary", ""))
    if coincidencia:
        return coincidencia.group(1)
    return None  # sin imagen



def actualizar_noticias():
    conexion = psycopg2.connect(url)
    conexion.autocommit = True
    cursor = conexion.cursor()
    procesadas = 0
    for fuente, feed_url in FUENTES:
        try:
            feed = feedparser.parse(feed_url)
        except Exception as e:
            print(f"[!] No se pudo leer la fuente {fuente}: {e}")
            continue
        for entrada in feed.entries:
            titulo = entrada.get("title")
            enlace = entrada.get("link")
            if not titulo or not enlace:
                continue
            try:
                categoria = clasificar(titulo)
                cursor.execute(
                    """
                    INSERT INTO noticias (titulo, enlace, fecha, fuente, resumen, categoria, fecha_pub, imagen)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (enlace) DO UPDATE
                        SET imagen = EXCLUDED.imagen
                        WHERE noticias.imagen IS NULL AND EXCLUDED.imagen IS NOT NULL
                    """,
                    (titulo, enlace, entrada.get("published", ""),
                    fuente, entrada.get("summary", ""), categoria,
                    parsear_fecha(entrada), extraer_imagen(entrada))
                )
                procesadas += cursor.rowcount
            except Exception as e:
                print(f"[!] Error con una noticia de {fuente}: {e}")
    conexion.close()
    print(f"[Actualización] {procesadas} procesadas")
    return procesadas


@app.get("/")
def inicio():
    return {"mensaje": "El servidor esta funcionando"}

@app.get("/actualizar")
def actualizar_ahora():
    nuevas = actualizar_noticias()
    return {"mensaje": "Recolección completada", "nuevas": nuevas}

@app.get("/noticias")
def obtener_noticias(categoria: str = None, fuente: str = None):
    conexion = psycopg2.connect(url)
    cursor = conexion.cursor()

    consulta = "SELECT id, titulo, enlace, fecha, fuente, categoria, imagen, resumen FROM noticias"
    condiciones = []
    valores = []

    if categoria:
        condiciones.append("categoria = %s")
        valores.append(categoria)
    if fuente:
        condiciones.append("fuente = %s")
        valores.append(fuente)

    if condiciones:
        consulta += " WHERE " + " AND ".join(condiciones)

    consulta += " ORDER BY fecha_pub DESC NULLS LAST, id DESC"

    cursor.execute(consulta, valores)
    filas = cursor.fetchall()
    conexion.close()

    return [
        {"id": f[0], "titulo": f[1], "enlace": f[2],
        "fecha": f[3], "fuente": f[4], "categoria": f[5],
        "imagen": f[6], "resumen": f[7]}
        for f in filas
    ]


@app.get("/tendencias")
def obtener_tendencias():
    conexion = psycopg2.connect(url)
    cursor = conexion.cursor()
    cursor.execute("SELECT titulo FROM noticias")
    titulos = cursor.fetchall()
    conexion.close()
    contador = Counter()
    for (titulo,) in titulos:
        palabras = re.findall(r"[a-záéíóúñü]+", titulo.lower())
        for palabra in palabras:
            if len(palabra) > 3 and palabra not in STOPWORDS:
                contador[palabra] += 1
    top = contador.most_common(10)
    return [{"palabra": palabra, "veces": veces} for palabra, veces in top]

@app.get("/categorias")
def obtener_categorias():
    conexion = psycopg2.connect(url)
    cursor = conexion.cursor()
    cursor.execute("SELECT DISTINCT categoria FROM noticias WHERE categoria IS NOT NULL ORDER BY categoria")
    filas = cursor.fetchall()
    conexion.close()
    return [f[0] for f in filas]


@app.get("/fuentes")
def obtener_fuentes():
    conexion = psycopg2.connect(url)
    cursor = conexion.cursor()
    cursor.execute("SELECT DISTINCT fuente FROM noticias WHERE fuente IS NOT NULL ORDER BY fuente")
    filas = cursor.fetchall()
    conexion.close()
    return [f[0] for f in filas]

@app.get("/estadisticas")
def obtener_estadisticas(categoria: str = "economía"):
    conexion = psycopg2.connect(url)
    cursor = conexion.cursor()

    cursor.execute("SELECT COUNT(*) FROM noticias WHERE categoria = %s", (categoria,))
    total = cursor.fetchone()[0]

    cursor.execute(
        """
        SELECT fuente, COUNT(*)
        FROM noticias
        WHERE categoria = %s
        GROUP BY fuente
        ORDER BY COUNT(*) DESC
        """,
        (categoria,)
    )
    por_fuente = [{"fuente": f[0], "cantidad": f[1]} for f in cursor.fetchall()]


    cursor.execute(
        """
        SELECT DATE(creado_en) AS dia, COUNT(*)
        FROM noticias
        WHERE categoria = %s
        GROUP BY dia
        ORDER BY dia
        """,
        (categoria,)
    )
    por_dia = [{"dia": str(f[0]), "cantidad": f[1]} for f in cursor.fetchall()]

    cursor.execute("SELECT titulo FROM noticias WHERE categoria = %s", (categoria,))
    titulos = cursor.fetchall()
    conexion.close()

    contador = Counter()
    for (titulo,) in titulos:
        palabras = re.findall(r"[a-záéíóúñü]+", titulo.lower())
        for palabra in palabras:
            if len(palabra) > 3 and palabra not in STOPWORDS:
                contador[palabra] += 1
    palabras_top = [{"palabra": p, "veces": v} for p, v in contador.most_common(10)]

    return {
        "categoria": categoria,
        "total": total,
        "por_fuente": por_fuente,
        "por_dia": por_dia,
        "palabras_top": palabras_top,
    }