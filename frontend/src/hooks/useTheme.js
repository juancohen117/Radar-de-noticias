import { useState, useEffect } from "react";

// Maneja el tema claro/oscuro.
// Arranca según la preferencia del sistema operativo del usuario.
// Nota: por requisito del proyecto NO usamos localStorage, así que la elección
// no persiste si se recarga la página (vuelve a la preferencia del sistema).
export function useTheme() {
  const [tema, setTema] = useState(() =>
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  // Reflejamos el tema en el <html> con un atributo; el CSS hace el resto.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  const alternar = () => setTema((t) => (t === "dark" ? "light" : "dark"));

  return { tema, alternar };
}
