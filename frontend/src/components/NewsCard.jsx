import { colorCategoria } from "../utils/categorias";
import { formatearFecha, tiempoRelativo } from "../utils/fecha";
import { IconoEnlace } from "./Icons";
import "./NewsCard.css";

// Tarjeta de una noticia: badge de categoría con color, título, fuente, fecha
// y un "Leer más" que abre el enlace original en otra pestaña.
// El color de la categoría se pasa por la variable CSS --cat para teñir el badge
// y la línea de acento superior de la tarjeta.
export default function NewsCard({ noticia }) {
  const { titulo, enlace, fecha, fuente, categoria } = noticia;
  const relativo = tiempoRelativo(fecha);

  return (
    <article
      className="news-card"
      style={{ "--cat": colorCategoria(categoria) }}
    >
      <div className="news-card__top">
        <span className="badge">{categoria || "general"}</span>
        {relativo && <span className="news-card__rel">{relativo}</span>}
      </div>

      <h3 className="news-card__title">{titulo}</h3>

      <div className="news-card__foot">
        <div className="news-card__meta">
          <span className="news-card__source">{fuente}</span>
          {fecha && <span className="news-card__date">{formatearFecha(fecha)}</span>}
        </div>
        <a
          className="news-card__link"
          href={enlace}
          target="_blank"
          rel="noopener noreferrer"
        >
          Leer más <IconoEnlace aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
