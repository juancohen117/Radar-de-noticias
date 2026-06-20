// Cliente central de la API.
// La URL base sale de una variable de entorno de Vite (VITE_API_URL) y, si no
// está definida, cae a localhost:8000. Así todo el frontend pega contra un solo lugar.
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper genérico: arma la URL con sus parámetros, hace fetch y parsea JSON.
// Lanza un error claro si la respuesta no es OK para que la UI lo pueda mostrar.
async function getJSON(path, params = {}) {
  const url = new URL(path, API);
  // Solo agregamos parámetros que tengan valor (categoria/fuente son opcionales).
  Object.entries(params).forEach(([clave, valor]) => {
    if (valor) url.searchParams.set(clave, valor);
  });

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`La API respondió ${res.status} en ${path}`);
  }
  return res.json();
}

// Un objeto con un método por endpoint del backend. Mantiene los componentes
// limpios: en vez de fetch("...") sueltos, llaman api.noticias(), api.tendencias(), etc.
export const api = {
  noticias: ({ categoria, fuente } = {}) =>
    getJSON("/noticias", { categoria, fuente }),
  categorias: () => getJSON("/categorias"),
  fuentes: () => getJSON("/fuentes"),
  tendencias: () => getJSON("/tendencias"),
  estadisticas: (categoria = "economía") =>
    getJSON("/estadisticas", { categoria }),
};

export { API };
