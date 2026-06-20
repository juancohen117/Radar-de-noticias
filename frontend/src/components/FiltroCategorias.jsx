import { colorCategoria } from "../utils/categorias";
import "./Filtros.css";

// Filtro por categoría en forma de píldoras.
// Se puebla desde GET /categorias. Incluye una opción "Todas" (valor "").
// `valor` es la categoría seleccionada; `onCambiar` la actualiza en el padre.
export default function FiltroCategorias({ categorias = [], valor, onCambiar, cargando }) {
  if (cargando) {
    // Mientras llega la lista, mostramos píldoras "fantasma".
    return (
      <div className="pills">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="skeleton"
            style={{ width: 80, height: 32, borderRadius: 999 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="pills" role="tablist" aria-label="Filtrar por categoría">
      <button
        role="tab"
        aria-selected={!valor}
        className={`pill ${!valor ? "pill--activo" : ""}`}
        onClick={() => onCambiar("")}
      >
        Todas
      </button>

      {categorias.map((c) => {
        const activa = valor === c;
        return (
          <button
            key={c}
            role="tab"
            aria-selected={activa}
            className={`pill ${activa ? "pill--activo" : ""}`}
            // Cuando está activa la teñimos con el color de su categoría.
            style={
              activa
                ? { background: colorCategoria(c), borderColor: "transparent" }
                : { "--cat": colorCategoria(c) }
            }
            onClick={() => onCambiar(c)}
          >
            <span
              className="pill__punto"
              style={{ background: colorCategoria(c) }}
            />
            {c}
          </button>
        );
      })}
    </div>
  );
}
