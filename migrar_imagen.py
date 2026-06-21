from config import DATABASE_URL as url
import psycopg2

conexion = psycopg2.connect(url)
cursor = conexion.cursor()
cursor.execute("ALTER TABLE noticias ADD COLUMN IF NOT EXISTS imagen TEXT")
conexion.commit()
conexion.close()
print("✅ Columna 'imagen' lista")