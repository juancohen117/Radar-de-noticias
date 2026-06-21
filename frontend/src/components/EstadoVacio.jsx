import { IconoVacio } from "./Icons";
import "./estados.css";

// Estado vacío: no hubo error, pero la consulta no devolvió resultados
// (por ejemplo, un filtro de categoría + fuente sin coincidencias).
export default function EstadoVacio({ mensaje = "No hay resultados." }) {
  return (
    <div className="estado">
      <span className="estado__icono estado__icono--neutro" aria-hidden="true">
        <IconoVacio width={26} height={26} />
      </span>
      <p className="estado__texto">{mensaje}</p>
    </div>
  );
}
