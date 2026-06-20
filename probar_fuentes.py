# probar_fuentes.py — prueba varios feeds RSS de una y dice cuáles sirven.
import feedparser

# Candidatas a probar. Puedes agregar o quitar las que quieras.
CANDIDATAS = [
    ("La FM",                  "https://www.lafm.com.co/rss/actualidad.xml"),
    ("El Espectador",          "https://www.elespectador.com/rss.xml"),
    ("Teleantioquia",          "https://www.teleantioquia.co/noticias/feed"),
    ("Portafolio",             "https://www.portafolio.co/rss/economia.xml"),
    ("El Tiempo - Economía",   "https://www.eltiempo.com/rss/economia.xml"),
    ("El Tiempo - Tecnosfera", "https://www.eltiempo.com/rss/tecnosfera.xml"),
]

for nombre, url in CANDIDATAS:
    feed = feedparser.parse(url)
    n = len(feed.entries)
    estado = "✅ SIRVE" if n > 0 else "❌ vacío"
    print(f"{estado}  ({n} entradas)  {nombre}")
    print(f"          {url}")
    if n > 0:
        print(f"          ej: {feed.entries[0].title[:70]}")
    print()