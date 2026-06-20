// Iconos SVG inline.
// Los definimos a mano (sin librería de iconos) para no sumar dependencias y
// que hereden el color del texto con `currentColor`. Todos aceptan props extra
// (className, width, etc.) para reutilizarlos en cualquier tamaño.

const base = {
  viewBox: "0 0 24 24",
  width: 18,
  height: 18,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconoRefrescar = (props) => (
  <svg {...base} {...props}>
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </svg>
);

export const IconoSol = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const IconoLuna = (props) => (
  <svg {...base} {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const IconoEnlace = (props) => (
  <svg {...base} width={14} height={14} {...props}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

export const IconoTendencia = (props) => (
  <svg {...base} {...props}>
    <path d="M3 17l6-6 4 4 7-7" />
    <path d="M17 8h4v4" />
  </svg>
);

export const IconoGrafico = (props) => (
  <svg {...base} {...props}>
    <path d="M3 3v18h18" />
    <rect x="7" y="11" width="3" height="6" rx="1" />
    <rect x="13" y="7" width="3" height="10" rx="1" />
  </svg>
);

export const IconoNoticias = (props) => (
  <svg {...base} {...props}>
    <path d="M4 5h11a1 1 0 0 1 1 1v12a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z" />
    <path d="M16 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2" />
    <path d="M8 9h4M8 13h4M8 17h2" />
  </svg>
);

export const IconoAlerta = (props) => (
  <svg {...base} {...props}>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
  </svg>
);

export const IconoVacio = (props) => (
  <svg {...base} {...props}>
    <path d="M3 7l9-4 9 4-9 4-9-4z" />
    <path d="M3 7v10l9 4 9-4V7" />
    <path d="M12 11v10" />
  </svg>
);
