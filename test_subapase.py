import psycopg2
from config import DATABASE_URL as url

try:
    conexion = psycopg2.connect(url)
    cursor = conexion.cursor()
    cursor.execute("SELECT count(*) FROM noticias;")
    print("✅ Conexión exitosa. Filas:", cursor.fetchone()[0])
    conexion.close()
except Exception as e:
    print("❌ Error:", e)