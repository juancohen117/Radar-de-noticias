import { IconoAlerta, IconoRefrescar } from "./Icons";
import "./estados.css";

// Mensaje de error claro cuando la API no responde (típicamente: backend apagado).
// Ofrece un botón para reintentar la petición que falló.
export default function EstadoError({ mensaje, onReintentar }) {
  return (
    <div className="estado estado--error" role="alert">
      <span className="estado__icono" aria-hidden="true">
        <IconoAlerta width={26} height={26} />
      </span>
      <h3 className="estado__titulo">No se pudieron cargar los datos</h3>
      <p className="estado__texto">{mensaje}</p>
      <p className="estado__hint">
        Revisa que el backend esté corriendo en <code>:8000</code>.
      </p>
      {onReintentar && (
        <button className="btn btn--primary" onClick={onReintentar}>
          <IconoRefrescar width={16} height={16} aria-hidden="true" />
          Reintentar
        </button>
      )}
    </div>
  );
}
