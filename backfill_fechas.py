# backfill_fechas.py — se corre UNA vez para rellenar fecha_pub de las noticias viejas.
from config import DATABASE_URL as url
from email.utils import parsedate_to_datetime
import psycopg2

conexion = psycopg2.connect(url)
cursor = conexion.cursor()

# Noticias que aún no tienen fecha_pub pero sí tienen texto en 'fecha'.
cursor.execute("SELECT id, fecha FROM noticias WHERE fecha_pub IS NULL AND fecha <> ''")
filas = cursor.fetchall()

actualizadas = 0
fallidas = 0
for id_noticia, fecha_texto in filas:
    try:
        # parsedate_to_datetime entiende el formato de fecha que usan los RSS.
        fecha_real = parsedate_to_datetime(fecha_texto)
        cursor.execute(
            "UPDATE noticias SET fecha_pub = %s WHERE id = %s",
            (fecha_real, id_noticia)
        )
        actualizadas += 1
    except Exception:
        fallidas += 1  # si alguna fecha viene rara, la saltamos sin romper todo

conexion.commit()
conexion.close()
print(f"✅ {actualizadas} fechas convertidas, {fallidas} no se pudieron parsear")