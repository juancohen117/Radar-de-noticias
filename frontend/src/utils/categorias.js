// Colores por categoría.
// Dan coherencia visual: el mismo color en el badge de la tarjeta, en las píldoras
// de filtro y en los gráficos. Si llega una categoría no prevista, generamos un
// color estable a partir de su nombre (hash -> tono HSL) para que no quede gris.

const COLORES = {
  deportes: "#16a34a",      // verde
  economía: "#d97706",      // ámbar
  economia: "#d97706",
  política: "#2563eb",      // azul
  politica: "#2563eb",
  judicial: "#dc2626",      // rojo
  tecnología: "#0891b2",    // cian
  tecnologia: "#0891b2",
  entretenimiento: "#db2777", // rosa
  general: "#64748b",       // gris azulado
};

export function colorCategoria(categoria = "") {
  const clave = categoria.toLowerCase().trim();
  if (COLORES[clave]) return COLORES[clave];

  // Color determinístico para categorías desconocidas.
  let hash = 0;
  for (let i = 0; i < clave.length; i++) {
    hash = clave.charCodeAt(i) + ((hash << 5) - hash);
  }
  const tono = Math.abs(hash) % 360;
  return `hsl(${tono} 60% 45%)`;
}
