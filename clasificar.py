import psycopg2
from config import DATABASE_URL as url


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


def clasificar(texto):
    texto = texto.lower()
    for categoria, palabras in CATEGORIAS.items():
        for palabra in palabras:
            if palabra in texto:
                return categoria
    return "general"   


conexion = psycopg2.connect(url)
cursor = conexion.cursor()

cursor.execute("SELECT id, titulo FROM noticias")
filas = cursor.fetchall()

actualizadas = 0
for id_noticia, titulo in filas:
    categoria = clasificar(titulo)
    cursor.execute(
        "UPDATE noticias SET categoria = %s WHERE id = %s",
        (categoria, id_noticia)
    )
    actualizadas += 1

conexion.commit()
conexion.close()
print(f"Se clasificaron {actualizadas} noticias ✅")