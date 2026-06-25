# Radar de Noticias

Radar de Noticias reúne en un solo lugar lo que están publicando varios medios colombianos. Cada cierto tiempo revisa los feeds RSS de las fuentes configuradas, guarda lo nuevo, lo clasifica por tema y calcula qué palabras se están mencionando más en los titulares. Todo eso se muestra en una página web que se actualiza sola.

Lo armé como proyecto académico para practicar desarrollo full-stack de punta a punta: desde traer y procesar los datos hasta presentarlos en una interfaz cuidada y dejar el proyecto desplegado en la nube.

**Ver en vivo:** https://radar-de-noticias-3lmv.vercel.app

## Qué hace

- Recoge noticias automáticamente de El Tiempo, Google Noticias, La FM y Portafolio.
- Clasifica cada noticia por categoría (deportes, economía, política, judicial, tecnología…) según palabras clave del titular.
- Detecta tendencias mostrando las palabras más repetidas del momento.
- Ordena el feed por fecha de publicación, con una noticia destacada y filtros por categoría y fuente combinables.
- Incluye un panel de estadísticas de economía con gráficos.

## Stack

El backend está hecho en Python con FastAPI. Lee los RSS con feedparser, programa la recolección con APScheduler y se conecta a una base de datos PostgreSQL (en Supabase) mediante psycopg2.

El frontend está hecho con React y Vite, y usa Recharts para las gráficas.

## Arquitectura de despliegue

El proyecto está repartido en tres servicios, cada uno en la plataforma que mejor le conviene:

- **Frontend → Vercel.** El sitio en React/Vite se publica como estático en Vercel, que es ideal para frontends y redespliega solo con cada push a `main`.
- **Backend → Render.** La API de FastAPI corre como web service en Render, un host que mantiene el proceso vivo (a diferencia de las plataformas serverless, que no encajan con un servidor que debe estar siempre disponible).
- **Base de datos → Supabase.** La base PostgreSQL está alojada en Supabase, en la nube.

El frontend (en Vercel) consume la API del backend (en Render) mediante la variable de entorno `VITE_API_URL`; el backend consulta la base de datos (en Supabase) mediante `DATABASE_URL`. Las dos partes se comunican por HTTP, con CORS configurado en el backend para aceptar el dominio del frontend.

Como el plan gratuito de Render suspende el servicio tras un rato de inactividad, la recolección automática se dispara con un programador externo que invoca el endpoint `/actualizar` periódicamente, en lugar de depender solo del temporizador interno del proceso.

Flujo general:

```
Navegador → Frontend (Vercel) → API (Render) → Base de datos (Supabase)
```

## Cómo correrlo localmente

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

Queda corriendo en http://localhost:5173. Para que apunte a tu backend local, crea un archivo `.env` dentro de `frontend/` con:

```
VITE_API_URL=http://localhost:8000
```

## API

- `GET /noticias` — noticias, con filtros opcionales `categoria` y `fuente`.
- `GET /tendencias` — palabras más mencionadas en los titulares.
- `GET /categorias` y `GET /fuentes` — valores disponibles para los filtros.
- `GET /estadisticas` — métricas de una categoría: total, por fuente, por día y palabras más frecuentes.
- `GET /actualizar` — dispara una recolección manual sin esperar al temporizador.

## Estado

Desplegado y funcional. Backend, frontend y base de datos están en línea; el feed se actualiza con nuevas noticias de las fuentes configuradas.
