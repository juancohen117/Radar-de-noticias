import "./Filtros.css";

// Filtro por fuente como dropdown (select nativo, estilizado).
// Se puebla desde GET /fuentes y se combina con la categoría seleccionada.
export default function FiltroFuentes({ fuentes = [], valor, onCambiar, cargando }) {
  return (
    <label className="select" title="Filtrar por fuente">
      <span className="select__label">Fuente</span>
      <div className="select__box">
        <select
          className="select__input"
          value={valor}
          onChange={(e) => onCambiar(e.target.value)}
          disabled={cargando}
        >
          <option value="">Todas las fuentes</option>
          {fuentes.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        {/* Flechita del dropdown */}
        <svg
          className="select__chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </label>
  );
}
