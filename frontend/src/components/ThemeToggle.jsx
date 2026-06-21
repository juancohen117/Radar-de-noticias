import { IconoSol, IconoLuna } from "./Icons";

// Botón para alternar entre modo claro y oscuro.
// Recibe el tema actual y la función para cambiarlo desde el hook useTheme.
export default function ThemeToggle({ tema, onCambiar }) {
  const esOscuro = tema === "dark";
  return (
    <button
      className="btn btn--icon"
      onClick={onCambiar}
      aria-label={esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={esOscuro ? "Modo claro" : "Modo oscuro"}
    >
      {esOscuro ? <IconoSol aria-hidden="true" /> : <IconoLuna aria-hidden="true" />}
    </button>
  );
}
