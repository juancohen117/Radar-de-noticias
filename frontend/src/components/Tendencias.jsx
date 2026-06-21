import { useFetch } from "../hooks/useFetch";
import { api } from "../api/client";
import EstadoError from "./EstadoError";
import EstadoVacio from "./EstadoVacio";
import { BloqueSkeleton } from "./Skeletons";
import { IconoTendencia } from "./Icons";
import "./Tendencias.css";

// Sección de tendencias: las palabras más repetidas en los titulares (GET /tendencias).
// Cada palabra es una píldora cuyo tamaño e intensidad de color crecen con su
// frecuencia ("veces"), tipo nube de palabras pero ordenada y legible.
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
        <div className="tendencias__nube">
          {Array.from({ length: 9 }).map((_, i) => (
            <BloqueSkeleton key={i} width={70 + (i % 4) * 26} height={34} radius={999} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EstadoVacio mensaje="Aún no hay tendencias." />
      ) : (
        <Nube palabras={data} />
      )}
    </section>
  );
}

// Renderiza las píldoras escaladas por frecuencia.
// El texto se mantiene siempre en --text (nunca blanco condicional): así el
// contraste no depende de qué tan "intensa" se vea la píldora, ni del tema.
function Nube({ palabras }) {
  const maximo = Math.max(...palabras.map((p) => p.veces));
  const minimo = Math.min(...palabras.map((p) => p.veces));
  const rango = Math.max(1, maximo - minimo);

  return (
    <div className="tendencias__nube">
      {palabras.map((p, i) => {
        // escala 0..1 según la frecuencia relativa
        const escala = (p.veces - minimo) / rango;
        // tamaño de fuente entre 0.82rem y 1.45rem
        const fontSize = 0.82 + escala * 0.63;
        // El relleno se mezcla con --surface-2 (no con "transparent"), así el
        // resultado siempre queda dentro de un rango de contraste seguro,
        // independiente del tema. El borde sí escala con más fuerza para
        // reforzar la sensación de intensidad sin tocar el texto.
        const relleno = 8 + escala * 14;
        const borde = 20 + escala * 60;
        return (
          <span
            key={p.palabra}
            className="trend"
            style={{
              fontSize: `${fontSize}rem`,
              background: `color-mix(in srgb, var(--accent) ${relleno}%, var(--surface-2))`,
              borderColor: `color-mix(in srgb, var(--accent) ${borde}%, var(--border))`,
            }}
            // El #1 más mencionado se resalta un poco
            data-top={i === 0 ? "1" : undefined}
          >
            {p.palabra}
            <b className="trend__veces">{p.veces}</b>
          </span>
        );
      })}
    </div>
  );
}
