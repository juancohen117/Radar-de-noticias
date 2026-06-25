import { useState } from "react";
import { colorCategoria } from "../utils/categorias";
import { formatearFecha, tiempoRelativo } from "../utils/fecha";
import { IconoEnlace } from "./Icons";
import "./NewsCard.css";

// Entidades HTML más comunes en los <summary> de RSS (feedparser ya decodifica
// la mayoría, pero algunas fuentes dejan entidades crudas).
const ENTIDADES = { amp: "&", quot: '"', apos: "'", "#39": "'", lt: "<", gt: ">", nbsp: " " };

// Los <summary> de RSS suelen traer HTML (a veces hasta un <img>). Para el
// "dek" del hero solo queremos texto plano y corto: nunca usamos
// dangerouslySetInnerHTML con contenido externo.
function limpiarResumen(html, maxLen = 170) {
  if (!html) return "";
  const sinTags = html.replace(/<[^>]*>/g, " ");
  const sinEntidades = sinTags.replace(
    /&(#?\w+);/g,
    (coincide, clave) => ENTIDADES[clave.toLowerCase()] ?? coincide
  );
  const texto = sinEntidades.replace(/\s+/g, " ").trim();
  if (texto.length <= maxLen) return texto;
  return `${texto.slice(0, maxLen).replace(/\s+\S*$/, "")}…`;
}

// Tarjeta de una noticia, en tres tamaños editoriales:
// - "hero": la noticia destacada principal (imagen grande + titular grande),
//   a la izquierda del bloque en "L".
// - "mediana": las 4 tarjetas de la rejilla 2x2 a la derecha del hero.
// - "normal" (por defecto): la grilla de 3 columnas con el resto de noticias.
// La imagen es opcional (~15% de las noticias la tienen): si no hay, o si
// falla la carga, la tarjeta cae con elegancia a su versión solo-texto.
export default function NewsCard({ noticia, variant = "normal" }) {
  const { titulo, enlace, fecha, fuente, categoria, imagen, resumen } = noticia;
  const [imgError, setImgError] = useState(false);

  const relativo = tiempoRelativo(fecha);
  const tieneImagen = Boolean(imagen) && !imgError;
  const esHero = variant === "hero";
  const esMediana = variant === "mediana";
  const Titulo = esHero ? "h2" : "h3";

  const claseImagen = esHero
    ? "news-card__media--hero"
    : esMediana
    ? "news-card__media--mediana"
    : "news-card__media--normal";

  return (
    <article
      className={`news-card news-card--${variant} ${!tieneImagen && esHero ? "news-card--hero-texto" : ""}`}
      style={{ "--cat": colorCategoria(categoria) }}
    >
      {tieneImagen && (
        <a
          className={`news-card__media ${claseImagen}`}
          href={enlace}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={imagen}
            alt={titulo}
            loading={esHero ? "eager" : "lazy"}
            onError={() => setImgError(true)}
          />
        </a>
      )}

      <div className="news-card__body">
        <span className="kicker">{categoria || "general"}</span>

        <Titulo className={`news-card__title news-card__title--${variant}`}>
          <a href={enlace} target="_blank" rel="noopener noreferrer">
            {titulo}
          </a>
        </Titulo>

        {esHero && resumen && (
          <p className="dek news-card__dek">{limpiarResumen(resumen)}</p>
        )}

        <div className="news-card__meta">
          <span className="news-card__source">{fuente}</span>
          {fecha && <span className="news-card__date">{formatearFecha(fecha)}</span>}
          {relativo && <span className="news-card__rel">{relativo}</span>}
        </div>

        {(esHero || esMediana) && (
          <a
            className="news-card__link"
            href={enlace}
            target="_blank"
            rel="noopener noreferrer"
          >
            Leer más <IconoEnlace aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
