import os
from dotenv import load_dotenv

load_dotenv()  # lee el archivo .env y carga sus variables al entorno

DATABASE_URL = os.getenv("DATABASE_URL")

# Si falta, que falle de una con un mensaje claro
if not DATABASE_URL:
    raise RuntimeError("Falta DATABASE_URL en el archivo .env")