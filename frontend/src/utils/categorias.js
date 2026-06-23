// Colores por categoría.
// Dan coherencia visual: el mismo color en el kicker de la tarjeta, en las píldoras
// de filtro y en los gráficos. Si llega una categoría no prevista, generamos un
// color estable a partir de su nombre (hash -> tono HSL) para que no quede gris.
//
// Tonos elegidos (y verificados) para que el texto blanco de la píldora activa
// de filtro mantenga contraste AA (>= 4.5:1) sobre el color sólido.

const COLORES = {
  deportes: "#15803d",      // verde
  economía: "#92400e",      // ámbar
  economia: "#92400e",
  política: "#1d4ed8",      // azul
  politica: "#1d4ed8",
  judicial: "#b91c1c",      // rojo
  tecnología: "#0e7490",    // cian
  tecnologia: "#0e7490",
  entretenimiento: "#be185d", // rosa
  general: "#475569",       // gris azulado
};

export function colorCategoria(categoria = "") {
  const clave = categoria.toLowerCase().trim();
  if (COLORES[clave]) return COLORES[clave];

  // Color determinístico para categorías desconocidas (saturación y luz bajas
  // a propósito, para que el texto blanco encima siga cumpliendo AA).
  let hash = 0;
  for (let i = 0; i < clave.length; i++) {
    hash = clave.charCodeAt(i) + ((hash << 5) - hash);
  }
  const tono = Math.abs(hash) % 360;
  return `hsl(${tono} 55% 32%)`;
}
