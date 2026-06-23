import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useFetch } from "../hooks/useFetch";
import { api } from "../api/client";
import EstadoError from "./EstadoError";
import { BloqueSkeleton } from "./Skeletons";
import { IconoGrafico } from "./Icons";
import "./EstadisticasEconomia.css";

// Paleta para las barras por fuente (se cicla si hubiera más fuentes).
// La primera coincide con el acento de marca, el resto la complementa.
const PALETA = ["#b3121e", "#0891b2", "#92400e", "#16a34a", "#1d4ed8", "#be185d"];

// Devuelve los colores de los gráficos según el tema actual, para que ejes y
// tooltips se lean bien tanto en claro como en oscuro.
function coloresGrafico(tema) {
  return tema === "dark"
    ? { eje: "#8b8b93", grid: "#2a2a30", area: "#ff8a80", tooltipBg: "#18181b", tooltipBorde: "#38383f", texto: "#f4f4f5" }
    : { eje: "#6b6f76", grid: "#e7e2d6", area: "#b3121e", tooltipBg: "#ffffff", tooltipBorde: "#cdc4b3", texto: "#1b1916" };
}

// Formatea "2026-06-13" -> "13 jun" para el eje X del gráfico temporal.
function diaCorto(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

// Sección de analítica de la categoría economía (GET /estadisticas).
// Muestra un KPI con el total, barras por fuente, área de volumen por día
// y las palabras económicas más frecuentes.
export default function EstadisticasEconomia({ refreshKey, tema }) {
  const { data, cargando, error, recargar } = useFetch(
    () => api.estadisticas("economía"),
    [refreshKey]
  );

  const C = coloresGrafico(tema);

  return (
    <section className="stats" aria-label="Estadísticas de economía">
      <div className="stats__head">
        <div>
          <span className="eyebrow">
            <IconoGrafico width={14} height={14} aria-hidden="true" /> Analítica · Economía
          </span>
          <h2 className="section-title">Estadísticas de Economía</h2>
        </div>
      </div>

      {error ? (
        <EstadoError mensaje={error} onReintentar={recargar} />
      ) : cargando ? (
        <Cargando />
      ) : (
        <div className="stats__grid">
          {/* KPI total */}
          <div className="card stat-kpi">
            <span className="stat-kpi__label">Noticias de economía</span>
            <span className="stat-kpi__num">{data.total}</span>
            <span className="stat-kpi__pie">
              {rangoFechas(data.por_dia)}
            </span>
          </div>

          {/* Barras: noticias por fuente */}
          <div className="card stat-panel">
            <h3 className="stat-panel__title">Por fuente</h3>
            {data.por_fuente.length === 0 ? (
              <p className="stat-panel__vacio">Sin datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={data.por_fuente} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={C.grid} />
                  <XAxis dataKey="fuente" tick={{ fill: C.eje, fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: C.eje, fontSize: 12 }} tickLine={false} axisLine={false} width={36} />
                  <Tooltip cursor={{ fill: C.grid, opacity: 0.4 }} content={<TooltipPro colores={C} sufijo="noticias" />} />
                  <Bar dataKey="cantidad" radius={[6, 6, 0, 0]} maxBarSize={64}>
                    {data.por_fuente.map((_, i) => (
                      <Cell key={i} fill={PALETA[i % PALETA.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Área: volumen de noticias en el tiempo */}
          <div className="card stat-panel stat-panel--ancho">
            <h3 className="stat-panel__title">Volumen por día</h3>
            {data.por_dia.length === 0 ? (
              <p className="stat-panel__vacio">Sin datos de fechas</p>
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={data.por_dia} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.area} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={C.area} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={C.grid} />
                  <XAxis dataKey="dia" tickFormatter={diaCorto} tick={{ fill: C.eje, fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={20} />
                  <YAxis allowDecimals={false} tick={{ fill: C.eje, fontSize: 12 }} tickLine={false} axisLine={false} width={36} />
                  <Tooltip content={<TooltipPro colores={C} sufijo="noticias" formateaEtiqueta={diaCorto} />} />
                  <Area type="monotone" dataKey="cantidad" stroke={C.area} strokeWidth={2.5} fill="url(#gradVol)" dot={{ r: 3, fill: C.area }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Palabras económicas top */}
          <div className="card stat-panel stat-panel--full">
            <h3 className="stat-panel__title">Palabras económicas top</h3>
            {data.palabras_top.length === 0 ? (
              <p className="stat-panel__vacio">Sin datos</p>
            ) : (
              <ul className="palabras">
                {data.palabras_top.map((p, i) => {
                  const max = data.palabras_top[0].veces || 1;
                  const ancho = (p.veces / max) * 100;
                  return (
                    <li key={p.palabra} className="palabra">
                      <span className="palabra__rank">{i + 1}</span>
                      <span className="palabra__texto">{p.palabra}</span>
                      <span className="palabra__barra">
                        <span className="palabra__relleno" style={{ width: `${ancho}%` }} />
                      </span>
                      <span className="palabra__veces">{p.veces}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// Tooltip personalizado, coherente con el diseño de la app.
function TooltipPro({ active, payload, label, colores, sufijo = "", formateaEtiqueta }) {
  if (!active || !payload || !payload.length) return null;
  const etiqueta = formateaEtiqueta ? formateaEtiqueta(label) : label;
  return (
    <div
      style={{
        background: colores.tooltipBg,
        border: `1px solid ${colores.tooltipBorde}`,
        borderRadius: "var(--radius-md)",
        padding: "8px 12px",
        boxShadow: "var(--shadow-md)",
        color: colores.texto,
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{etiqueta}</div>
      <div style={{ color: colores.area, fontWeight: 600 }}>
        {payload[0].value} {sufijo}
      </div>
    </div>
  );
}

// Devuelve un texto tipo "13 jun – 19 jun" con el rango cubierto por los datos.
function rangoFechas(porDia) {
  if (!porDia || porDia.length === 0) return "Acumulado";
  const ini = diaCorto(porDia[0].dia);
  const fin = diaCorto(porDia[porDia.length - 1].dia);
  return ini === fin ? ini : `${ini} – ${fin}`;
}

// Skeleton de toda la sección mientras cargan las estadísticas.
function Cargando() {
  return (
    <div className="stats__grid">
      <div className="card stat-kpi">
        <BloqueSkeleton width={120} height={14} />
        <BloqueSkeleton width={90} height={48} style={{ marginTop: 14 }} />
        <BloqueSkeleton width={100} height={12} style={{ marginTop: 12 }} />
      </div>
      <div className="card stat-panel">
        <BloqueSkeleton width={120} height={16} />
        <BloqueSkeleton height={170} radius={12} style={{ marginTop: 16 }} />
      </div>
      <div className="card stat-panel stat-panel--ancho">
        <BloqueSkeleton width={120} height={16} />
        <BloqueSkeleton height={170} radius={12} style={{ marginTop: 16 }} />
      </div>
      <div className="card stat-panel stat-panel--full">
        <BloqueSkeleton width={160} height={16} />
        <BloqueSkeleton height={120} radius={12} style={{ marginTop: 16 }} />
      </div>
    </div>
  );
}
