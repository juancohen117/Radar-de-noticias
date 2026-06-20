import { useState, useEffect } from "react";

// Hook reutilizable para consumir la API.
// Centraliza el patrón "cargando / datos / error" que se repite en cada sección
// y expone `recargar()` para volver a pedir los datos a demanda.
//
//   const { data, cargando, error, recargar } = useFetch(() => api.noticias(), [filtros]);
//
// `fetcher` es una función que devuelve una promesa.
// `deps` controla cuándo se vuelve a ejecutar (filtros, botón de actualizar, etc.).
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  // Contador interno: al incrementarlo forzamos una recarga (botón "Reintentar").
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // `activo` evita actualizar el estado si el componente se desmontó o si los
    // filtros cambiaron antes de que llegara la respuesta (evita race conditions).
    let activo = true;
    // Mostramos el estado de carga al (re)ejecutar. Es el patrón clásico de
    // fetching: el linter avisa por el setState en el efecto, pero aquí es
    // intencional (queremos el skeleton cada vez que cambian los filtros).
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setCargando(true);
    setError(null);

    fetcher()
      .then((datos) => activo && setData(datos))
      .catch((e) =>
        activo && setError(e.message || "No se pudo conectar con la API")
      )
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
    // `fetcher` se recrea en cada render, por eso dependemos de `deps` + `tick`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const recargar = () => setTick((t) => t + 1);

  return { data, cargando, error, recargar };
}
