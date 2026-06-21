from config import DATABASE_URL as url
import psycopg2

conexion = psycopg2.connect(url)
cursor = conexion.cursor()
cursor.execute("SELECT count(*) FROM noticias WHERE imagen IS NOT NULL")
con_imagen = cursor.fetchone()[0]
cursor.execute("SELECT count(*) FROM noticias")
total = cursor.fetchone()[0]
cursor.execute("SELECT fuente, imagen FROM noticias WHERE imagen IS NOT NULL LIMIT 3")
ejemplos = cursor.fetchall()
conexion.close()

print(f"{con_imagen} de {total} noticias tienen imagen")
for fuente, img in ejemplos:
    print(f"- [{fuente}] {img[:70]}")