import { useState, useEffect, useCallback } from "react";
import { useTheme } from "./hooks/useTheme";
import { useFetch } from "./hooks/useFetch";
import { api } from "./api/client";
import { horaActual } from "./utils/fecha";

import Header from "./components/Header";
import FiltroCategorias from "./components/FiltroCategorias";
import FiltroFuentes from "./components/FiltroFuentes";
import NewsFeed from "./components/NewsFeed";
import Tendencias from "./components/Tendencias";
import EstadisticasEconomia from "./components/EstadisticasEconomia";

import "./App.css";

// Cada cuántos milisegundos se refresca solo el dashboard (2 minutos).
const AUTO_REFRESH_MS = 2 * 60 * 1000;

export default function App() {
  const { tema, alternar } = useTheme();

  // Filtros activos (se combinan entre sí).
  const [categoria, setCategoria] = useState("");
  const [fuente, setFuente] = useState("");

  // refreshKey: al cambiar, todas las secciones vuelven a pedir datos.
  const [refreshKey, setRefreshKey] = useState(0);
  const [actualizando, setActualizando] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(horaActual());

  // Listas para poblar los filtros (categorías y fuentes vienen del backend).
  const { data: categorias, cargando: cargandoCats } = useFetch(
    () => api.categorias(),
    [refreshKey]
  );
  const { data: fuentes, cargando: cargandoFuentes } = useFetch(
    () => api.fuentes(),
    [refreshKey]
  );

  // Dispara una recarga global y registra la hora.
  const refrescar = useCallback(() => {
    setActualizando(true);
    setRefreshKey((k) => k + 1);
    setUltimaActualizacion(horaActual());
    // Pequeño feedback visual del spinner (la recarga real es casi inmediata).
    setTimeout(() => setActualizando(false), 700);
  }, []);

  // Auto-refresh cada par de minutos.
  useEffect(() => {
    const id = setInterval(refrescar, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [refrescar]);

  return (
    <>
      <Header
        onRefrescar={refrescar}
        actualizando={actualizando}
        ultimaActualizacion={ultimaActualizacion}
        tema={tema}
        onCambiarTema={alternar}
      />

      <main className="container layout">
        {/* Barra de filtros: categorías (píldoras) + fuente (dropdown), combinables */}
        <div className="toolbar card">
          <FiltroCategorias
            categorias={categorias || []}
            valor={categoria}
            onCambiar={setCategoria}
            cargando={cargandoCats}
          />
          <div className="toolbar__sep" />
          <FiltroFuentes
            fuentes={fuentes || []}
            valor={fuente}
            onCambiar={setFuente}
            cargando={cargandoFuentes}
          />
        </div>

        {/* Columna principal (feed) + barra lateral (tendencias) */}
        <div className="grid-principal">
          <div className="col-main">
            <NewsFeed
              categoria={categoria}
              fuente={fuente}
              refreshKey={refreshKey}
            />
          </div>
          <aside className="col-aside">
            <Tendencias refreshKey={refreshKey} />
          </aside>
        </div>

        {/* Analítica de economía (ancho completo) */}
        <EstadisticasEconomia refreshKey={refreshKey} tema={tema} />
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            <strong>Radar de Noticias</strong> · Fuentes: El Tiempo y Google
            Noticias · Hecho con React + Recharts
          </p>
        </div>
      </footer>
    </>
  );
}
