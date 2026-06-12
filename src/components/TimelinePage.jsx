import { TIMELINE } from '../data/timelineData';

// Paleta de barras estilo "step up timeline" (cicla si hay más etapas que colores)
const BAR_COLORS = ['#5d8a3c', '#45b08c', '#d8546c', '#cc5212', '#b8a23d'];
const RISE = 46; // cuánto sube cada paso respecto al anterior (px)

const duracion = (periodo) => {
  const m = periodo.match(/(\d+)\s*[-–]\s*(\d+)/);
  return m ? `${Number(m[2]) - Number(m[1])} días` : '';
};

function TimelinePage() {
  return (
    <div className="timeline-page">
      <div className="tl-topbar">
        <div className="tl-logo">VESTA</div>
        <button className="tl-back" onClick={() => { window.location.hash = '#/'; }}>
          ← Volver a los flujos
        </button>
      </div>

      <div className="tl-header">
        <h1 className="tl-title">Línea de Tiempo del Proceso</h1>
        <div className="tl-rule" />
        <div className="tl-subtitle">
          Duración estimada de cada etapa del proceso de importación · 60 días en total
        </div>
      </div>

      <div className="tl-scroll">
        <div className="tl-steps">
          {TIMELINE.map((item, i) => (
            <div key={item.periodo} className="tl-step" style={{ marginBottom: i * RISE }}>
              {i > 0 && (
                <svg className="tl-arrow" width="70" height="64" viewBox="0 0 70 64">
                  <path
                    d="M6 56 C 22 30, 42 16, 60 11"
                    fill="none" stroke="#a8a18b" strokeWidth="1.5"
                    strokeDasharray="4 4" strokeLinecap="round"
                  />
                  <path
                    d="M53 8 l8 3 -4 7"
                    fill="none" stroke="#a8a18b" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              )}
              <div className="tl-period">{item.periodo}</div>
              <div className="tl-bar" style={{ background: BAR_COLORS[i % BAR_COLORS.length] }} />
              <div className="tl-name">{item.actividad}</div>
              <div className="tl-desc">Duración estimada: {duracion(item.periodo)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimelinePage;
