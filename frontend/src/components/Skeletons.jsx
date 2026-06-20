// Skeletons de carga: ocupan el mismo espacio que el contenido real para que la
// interfaz no "salte" cuando llegan los datos. Usan la clase .skeleton (shimmer)
// definida en index.css.

// Placeholder de una tarjeta de noticia.
export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="skeleton" style={{ width: 84, height: 22, borderRadius: 999 }} />
      <div className="skeleton" style={{ width: "100%", height: 16, marginTop: 16 }} />
      <div className="skeleton" style={{ width: "85%", height: 16, marginTop: 8 }} />
      <div className="skeleton" style={{ width: "55%", height: 16, marginTop: 8 }} />
      <div className="skeleton" style={{ width: 120, height: 13, marginTop: 18 }} />
    </div>
  );
}

// Bloque genérico reutilizable (para gráficos, listas de tendencias, etc.).
export function BloqueSkeleton({ height = 16, width = "100%", radius = 8, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}
