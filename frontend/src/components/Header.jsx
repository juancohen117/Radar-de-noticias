import { IconoRefrescar } from "./Icons";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

// Cabecera fija (sticky) con el nombre del producto, subtítulo y controles globales:
// hora de última actualización, botón "Actualizar" y el toggle de tema.
export default function Header({
  onRefrescar,
  actualizando,
  ultimaActualizacion,
  tema,
  onCambiarTema,
}) {
  return (
    <header className="app-header">
      <div className="container app-header__inner">
        {/* Marca: logo "radar" + nombre + subtítulo */}
        <div className="brand">
          <span className="brand__logo" aria-hidden="true">
            <span className="brand__dot" />
          </span>
          <div>
            <h1 className="brand__title">Radar de Noticias</h1>
            <p className="brand__subtitle">
              Agregador en tiempo real · detección de tendencias
            </p>
          </div>
        </div>

        {/* Controles a la derecha */}
        <div className="app-header__controls">
          {ultimaActualizacion && (
            <span className="actualizado" title="Última actualización">
              <span className="actualizado__dot" />
              {ultimaActualizacion}
            </span>
          )}
          <button
            className="btn"
            onClick={onRefrescar}
            disabled={actualizando}
            aria-label={actualizando ? "Actualizando noticias" : "Actualizar noticias"}
          >
            <IconoRefrescar
              aria-hidden="true"
              className={actualizando ? "girando" : ""}
            />
            <span className="btn__texto" aria-hidden="true">
              {actualizando ? "Actualizando…" : "Actualizar"}
            </span>
          </button>
          <ThemeToggle tema={tema} onCambiar={onCambiarTema} />
        </div>
      </div>
    </header>
  );
}
