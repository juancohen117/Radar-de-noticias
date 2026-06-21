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
    <div className="pills" role="group" aria-label="Filtrar por categoría">
      <button
        type="button"
        aria-pressed={!valor}
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
            type="button"
            aria-pressed={activa}
            className={`pill ${activa ? "pill--activo" : ""}`}
            // Cuando está activa la teñimos con el color de su categoría.
            // Los colores de categoría están elegidos para mantener AA con
            // texto blanco en ambos temas (a diferencia de --accent, que en
            // oscuro es claro y usa --on-accent en vez de blanco fijo).
            style={
              activa
                ? {
                    background: colorCategoria(c),
                    borderColor: "transparent",
                    color: "#fff",
                  }
                : { "--cat": colorCategoria(c) }
            }
            onClick={() => onCambiar(c)}
          >
            <span
              className="pill__punto"
              aria-hidden="true"
              style={{ background: colorCategoria(c) }}
            />
            {c}
          </button>
        );
      })}
    </div>
  );
}
