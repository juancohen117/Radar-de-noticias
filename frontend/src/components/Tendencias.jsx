import { useFetch } from "../hooks/useFetch";
import { api } from "../api/client";
import EstadoError from "./EstadoError";
import EstadoVacio from "./EstadoVacio";
import { BloqueSkeleton } from "./Skeletons";
import { IconoTendencia } from "./Icons";
import "./Tendencias.css";

// Sección de tendencias: las palabras más repetidas en los titulares (GET /tendencias).
// Lista ordenada por ranking, con una barra sutil que crece según la frecuencia
// relativa de cada palabra (nada de burbujas de colores).
export default function Tendencias({ refreshKey }) {
  const { data, cargando, error, recargar } = useFetch(
    () => api.tendencias(),
    [refreshKey]
  );

  return (
    <section className="card tendencias" aria-label="Tendencias">
      <div className="tendencias__head">
        <span className="eyebrow">
          <IconoTendencia width={14} height={14} aria-hidden="true" /> En tendencia
        </span>
        <h2 className="section-title">Lo más mencionado</h2>
        <p className="tendencias__sub">Palabras top en los titulares</p>
      </div>

      {error ? (
        <EstadoError mensaje={error} onReintentar={recargar} />
      ) : cargando ? (
        <div className="tendencias__lista">
          {Array.from({ length: 8 }).map((_, i) => (
            <BloqueSkeleton key={i} height={32} radius={6} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EstadoVacio mensaje="Aún no hay tendencias." />
      ) : (
        <Lista palabras={data} />
      )}
    </section>
  );
}

// Ranking con barra de intensidad: el ancho de la barra es relativo a la
// palabra más mencionada, así la diferencia entre puestos se lee de un vistazo.
function Lista({ palabras }) {
  const maximo = Math.max(...palabras.map((p) => p.veces));

  return (
    <ol className="tendencias__lista">
      {palabras.map((p, i) => (
        <li
          key={p.palabra}
          className="trend-item"
          data-top={i === 0 ? "1" : undefined}
        >
          <span className="trend-item__rank" aria-hidden="true">{i + 1}</span>
          <div className="trend-item__cuerpo">
            <span className="trend-item__palabra">{p.palabra}</span>
            <span className="trend-item__barra">
              <span
                className="trend-item__relleno"
                style={{ width: `${(p.veces / maximo) * 100}%` }}
              />
            </span>
          </div>
          <span className="trend-item__veces">{p.veces}</span>
        </li>
      ))}
    </ol>
  );
}
