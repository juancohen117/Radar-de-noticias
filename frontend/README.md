# Radar de Noticias — Frontend

Dashboard de un agregador de noticias en tiempo real con detección de tendencias.
React + Vite, gráficos con Recharts y CSS moderno (modo claro/oscuro, responsive).

## Cómo correrlo

> El backend (FastAPI) debe estar corriendo en **http://localhost:8000**.
> Vite arranca en **http://localhost:5173**, que es el único origen permitido por el
> CORS del backend. Si el 5173 está ocupado, libéralo antes de arrancar.

```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:5173
```

La URL del backend se configura en `.env`:

```
VITE_API_URL=http://localhost:8000
```

## Estructura

```
src/
├── api/
│   └── client.js              # Cliente único de la API (un método por endpoint)
├── hooks/
│   ├── useFetch.js            # Hook de fetching: cargando / datos / error / recargar
│   └── useTheme.js            # Modo claro/oscuro (sin localStorage)
├── utils/
│   ├── categorias.js          # Color por categoría (badges, píldoras, gráficos)
│   └── fecha.js               # Formato de fecha y "hace X min"
├── components/
│   ├── Header.jsx             # Cabecera: marca + actualizar + tema
│   ├── ThemeToggle.jsx        # Botón claro/oscuro
│   ├── FiltroCategorias.jsx   # Píldoras desde /categorias
│   ├── FiltroFuentes.jsx      # Dropdown desde /fuentes
│   ├── NewsCard.jsx           # Tarjeta de noticia
│   ├── NewsFeed.jsx           # Feed (consume /noticias con los filtros)
│   ├── Tendencias.jsx         # Nube de palabras desde /tendencias
│   ├── EstadisticasEconomia.jsx  # KPI + gráficos (Recharts) desde /estadisticas
│   ├── Skeletons.jsx          # Placeholders de carga
│   ├── EstadoError.jsx        # Error claro + reintentar
│   └── EstadoVacio.jsx        # Sin resultados
└── App.jsx                    # Orquesta filtros, auto-refresh y layout
```

## Comandos

| Comando           | Qué hace                          |
| ----------------- | --------------------------------- |
| `npm run dev`     | Servidor de desarrollo (HMR)      |
| `npm run build`   | Build de producción en `dist/`    |
| `npm run preview` | Sirve el build de producción      |
| `npm run lint`    | ESLint                            |
