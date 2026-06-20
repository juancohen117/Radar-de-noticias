// Utilidades de fecha.
// Las fechas vienen de feeds RSS en formatos variados (RFC 822, ISO, etc.).
// Intentamos parsearlas y mostrarlas bonito; si no se puede, devolvemos el texto
// original para no romper la tarjeta.

export function formatearFecha(fecha) {
  if (!fecha) return "";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha; // formato raro -> lo dejamos tal cual
  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Tiempo relativo corto ("hace 3 h") para reforzar la sensación de "tiempo real".
export function tiempoRelativo(fecha) {
  if (!fecha) return "";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "";

  const seg = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seg < 0) return ""; // fecha futura: no mostramos nada
  if (seg < 60) return "ahora";
  const min = Math.floor(seg / 60);
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const dias = Math.floor(h / 24);
  if (dias < 30) return `hace ${dias} d`;
  return ""; // muy viejo: nos quedamos solo con la fecha formateada
}

// Hora corta "HH:MM" para mostrar la última actualización del dashboard.
export function horaActual() {
  return new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
