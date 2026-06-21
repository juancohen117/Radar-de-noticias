import { useFetch } from "../hooks/useFetch";
import { api } from "../api/client";
import NewsCard from "./NewsCard";
import { CardSkeleton } from "./Skeletons";
import EstadoError from "./EstadoError";
import EstadoVacio from "./EstadoVacio";
import { IconoNoticias } from "./Icons";
import "./NewsFeed.css";

// Feed principal de noticias en tarjetas.
// Se vuelve a pedir cada vez que cambian la categoría, la fuente o refreshKey
// (botón "Actualizar" / auto-refresh). Maneja carga, error y vacío.
export default function NewsFeed({ categoria, fuente, refreshKey }) {
  const { data: noticias, cargando, error, recargar } = useFetch(
    () => api.noticias({ categoria, fuente }),
    [categoria, fuente, refreshKey]
  );

  return (
    <section className="feed" aria-label="Noticias">
      <div className="feed__head">
        <div>
          <span className="eyebrow">
            <IconoNoticias width={14} height={14} aria-hidden="true" /> Feed
          </span>
          <h2 className="section-title">Últimas noticias</h2>
        </div>
        {!cargando && !error && noticias && (
          <span className="feed__count">
            {noticias.length} {noticias.length === 1 ? "noticia" : "noticias"}
          </span>
        )}
      </div>

      {error ? (
        <EstadoError mensaje={error} onReintentar={recargar} />
      ) : cargando ? (
        <div className="feed__grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : noticias.length === 0 ? (
        <EstadoVacio mensaje="No hay noticias para esta combinación de filtros. Prueba con otra categoría o fuente." />
      ) : (
        <div className="feed__grid aparece">
          {noticias.map((n) => (
            <NewsCard key={n.id} noticia={n} />
          ))}
        </div>
      )}
    </section>
  );
}
