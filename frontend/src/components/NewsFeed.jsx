import { useFetch } from "../hooks/useFetch";
import { api } from "../api/client";
import NewsCard from "./NewsCard";
import { CardSkeleton } from "./Skeletons";
import EstadoError from "./EstadoError";
import EstadoVacio from "./EstadoVacio";
import { IconoNoticias } from "./Icons";
import "./NewsFeed.css";

// Feed principal de noticias, distribuido en tres escalas editoriales.
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
        <FeedEditorial noticias={noticias} />
      )}
    </section>
  );
}

// Reparte el feed en tres tamaños de tarjeta, al estilo de una portada
// editorial (BBC Mundo: destacada + secundarias en "L", y debajo una grilla):
// 1. Hero: la noticia más reciente CON imagen (el orden ya viene de la API
//    por fecha_pub desc, así que basta tomar la primera que tenga `imagen`).
//    Si ninguna tiene imagen, la más reciente hace de hero en su versión
//    solo-texto: la sección principal nunca se queda vacía.
// 2. Mediana: las siguientes 4, en una rejilla 2x2 junto al hero (con
//    miniatura si hay), formando el bloque principal en forma de "L".
// 3. Normal: el resto, en una grilla uniforme de 3 columnas tipo "más noticias".
function FeedEditorial({ noticias }) {
  const indiceHero = noticias.findIndex((n) => n.imagen);
  const hero = indiceHero === -1 ? noticias[0] : noticias[indiceHero];
  const resto = noticias.filter((n) => n.id !== hero.id);
  const medianas = resto.slice(0, 4);
  const grilla = resto.slice(4);

  return (
    <div className="feed__editorial aparece">
      <div className="feed__bloque-l">
        <NewsCard noticia={hero} variant="hero" />

        {medianas.length > 0 && (
          <div className="feed__medianas">
            {medianas.map((n) => (
              <NewsCard key={n.id} noticia={n} variant="mediana" />
            ))}
          </div>
        )}
      </div>

      {grilla.length > 0 && (
        <div className="feed__grilla-wrap">
          <h3 className="feed__grilla-title">Más noticias</h3>
          <div className="feed__grilla">
            {grilla.map((n) => (
              <NewsCard key={n.id} noticia={n} variant="normal" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
