# Radar de Noticias

Radar de Noticias reúne en un solo lugar lo que están publicando varios medios colombianos. Cada cierto tiempo revisa los feeds RSS de las fuentes configuradas, guarda lo nuevo, lo clasifica por tema y calcula qué palabras se están mencionando más en los titulares. Todo eso se muestra en una página web que se actualiza sola.

Lo armé como proyecto académico para practicar desarrollo full-stack de punta a punta: desde traer y procesar los datos hasta presentarlos en una interfaz cuidada.

## Qué hace

- Recoge noticias automáticamente cada 15 minutos de El Tiempo, Google Noticias, La FM y Portafolio.
- Clasifica cada noticia por categoría (deportes, economía, política, judicial, tecnología…) según palabras clave del titular.
- Detecta tendencias mostrando las palabras más repetidas del momento.
- Ordena el feed por fecha de publicación, con filtros por categoría y por fuente que se pueden combinar.
- Incluye un panel de estadísticas de economía con gráficos.

## Stack

El backend está hecho en Python con FastAPI. Lee los RSS con feedparser, programa la recolección con APScheduler y se conecta a una base de datos PostgreSQL (en Supabase) mediante psycopg2.

El frontend está hecho con React y Vite, y usa Recharts para las gráficas.

## Cómo está organizado

Son dos aplicaciones separadas que se comunican por HTTP. El backend recoge, clasifica, guarda y sirve los datos a través de una API REST; el frontend consume esa API y la presenta. Tenerlas separadas permite trabajarlas y desplegarlas de forma independiente.

## Cómo correrlo

Necesitas Python 3, Node.js y una base de datos PostgreSQL.

**Backend**

```bash
git clone https://github.com/juancohen117/Radar-de-noticias.git
cd Radar-de-noticias

python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

pip install -r requirements.txt
```

Antes de arrancar, crea un archivo `.env` en la raíz con la conexión a tu base de datos:

```
DATABASE_URL=postgresql://usuario:contraseña@host:5432/postgres
```

El `.env` no está en el repositorio a propósito, porque contiene credenciales; debes crearlo tú. Luego levanta el servidor:

```bash
uvicorn main:app --reload
```

Queda corriendo en http://localhost:8000.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Queda corriendo en http://localhost:5173.

## API

- `GET /noticias` — noticias, con filtros opcionales `categoria` y `fuente`.
- `GET /tendencias` — palabras más mencionadas en los titulares.
- `GET /categorias` y `GET /fuentes` — valores disponibles para los filtros.
- `GET /estadisticas` — métricas de una categoría: total, por fuente, por día y palabras más frecuentes.
- `GET /actualizar` — dispara una recolección manual sin esperar al temporizador.

## Estado

En desarrollo. El backend ya está funcional —recolección, clasificación, tendencias y API—; el siguiente paso es rediseñar la interfaz.
