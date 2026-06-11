import { PHASE_COLORS } from '../data/roadmapData';

// Aplana las actividades de una ruta, incluyendo sub-ramas anidadas
function collectPathActivities(path, out) {
  for (const a of path.activities) {
    if (a.type === 'branch') a.paths.forEach(p => collectPathActivities(p, out));
    else out.push(a);
  }
}

function getSectionColor(sections, itemId) {
  for (const sec of sections) {
    const acts = [];
    for (const item of sec.items) {
      if (item.type === 'activity') acts.push(item);
      if (item.type === 'branch') item.paths.forEach(p => collectPathActivities(p, acts));
    }
    if (acts.some(a => a.id === itemId)) return sec.color;
  }
  return 'blue';
}

function getAllActivities(sections) {
  const all = [];
  for (const sec of sections) {
    for (const item of sec.items) {
      if (item.type === 'activity') all.push(item);
      if (item.type === 'branch') item.paths.forEach(p => collectPathActivities(p, all));
    }
  }
  return all;
}

function StatCard({ label, value, color = '#6b7280', bg = '#f9fafb' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: bg, borderRadius: 6, border: '1px solid #e5e7eb' }}>
      <span style={{ fontSize: 11, color: '#374151' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function StatsPanel({ sections, sistemaFilter, onSistemaFilter }) {
  const all = getAllActivities(sections);
  const total = all.length;

  // Conteo por sistema (normalizado con trim), de mayor a menor
  const porSistema = {};
  for (const a of all) {
    const s = (a.sistema || '').trim();
    if (s) porSistema[s] = (porSistema[s] || 0) + 1;
  }
  const sistemas = Object.entries(porSistema).sort((a, b) => b[1] - a[1]);
  const manual      = all.filter(a => a.metodo === 'Manual').length;
  const esperas     = all.filter(a => a.identificacion?.includes('Esperas')).length;
  const reprocesos  = all.filter(a => a.identificacion?.includes('Reprocesos')).length;
  const ejecucion   = all.filter(a => a.seguimiento === 'Ejecución').length;
  const monitoreo   = all.filter(a => a.seguimiento === 'Monitoreo').length;
  const ejMon       = all.filter(a => a.seguimiento === 'Ejecución y Monitoreo').length;
  const control     = all.filter(a => a.seguimiento === 'Control').length;
  const noCorr      = all.filter(a => a.highlight).length;

  const S = { fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, marginTop: 14 };

  return (
    <div style={{ padding: '16px 14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Resumen del proceso</div>
      <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 16 }}>{total} actividades en total</div>

      <StatCard label="Actividades no correspondientes" value={noCorr} color="#c2410c" bg="#fff7ed" />

      <div style={S}>Método</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <StatCard label="Manual" value={manual} color="#374151" />
      </div>

      <div style={S}>Sistema</div>
      <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6 }}>
        Clic en un sistema para filtrarlo en el diagrama; clic de nuevo para quitar el filtro.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {sistemas.map(([name, count]) => {
          const active = sistemaFilter === name;
          return (
            <button
              key={name}
              onClick={() => onSistemaFilter?.(active ? null : name)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 10px', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
                background: active ? '#eff6ff' : '#f9fafb',
                border: `1px solid ${active ? '#93c5fd' : '#e5e7eb'}`,
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              <span style={{ fontSize: 11, color: active ? '#1d4ed8' : '#374151', fontWeight: active ? 600 : 400, textAlign: 'left' }}>
                {name}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: active ? '#1d4ed8' : '#6b7280' }}>{count}</span>
            </button>
          );
        })}
      </div>

      <div style={S}>Identificación</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <StatCard label="Esperas"    value={esperas}    color="#1d4ed8" bg="#eff6ff" />
        <StatCard label="Reprocesos" value={reprocesos} color="#c2410c" bg="#fff7ed" />
      </div>

      <div style={S}>Seguimiento</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <StatCard label="Ejecución"            value={ejecucion} color="#166534" bg="#f0fdf4" />
        <StatCard label="Monitoreo"            value={monitoreo} color="#0e7490" bg="#ecfeff" />
        <StatCard label="Ejecución y Monitoreo" value={ejMon}    color="#6d28d9" bg="#f5f3ff" />
        {control > 0 && <StatCard label="Control" value={control} color="#374151" />}
      </div>
    </div>
  );
}

function CardDetail({ selected, sections }) {
  const color = getSectionColor(sections, selected.id);
  const col = PHASE_COLORS[color] ?? PHASE_COLORS.blue;
  const v = (selected.concurrencia ?? '').toLowerCase().trim();
  const isAlways = v === 'siempre';
  const isEventual = v === 'eventual';

  return (
    <div className="detail-content" key={selected.id}>
      <div className="detail-top" style={{ borderTopColor: col.c }}>
        <span
          className="detail-badge"
          style={isAlways
            ? { background: col.bg, color: col.c, border: `1px solid ${col.border}` }
            : isEventual
            ? { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }
            : { background: '#f1f3f7', color: '#52596e', border: '1px solid #e2e5ec' }
          }
        >
          {isAlways ? 'Siempre' : isEventual ? 'Eventual' : `Paso ${selected.concurrencia}`}
        </span>
        <h3 className="detail-title">{selected.actividad}</h3>

        <div className="detail-fields">
          {selected.sistema && (
            <div className="detail-field">
              <span className="detail-field-label">Sistema</span>
              <span className="detail-field-value" style={{ color: col.c }}>{selected.sistema}</span>
            </div>
          )}
          {selected.modulo && selected.modulo !== selected.sistema && (
            <div className="detail-field">
              <span className="detail-field-label">Módulo</span>
              <span className="detail-field-value">{selected.modulo}</span>
            </div>
          )}
          {selected.metodo && (
            <div className="detail-field">
              <span className="detail-field-label">Método</span>
              <span className="detail-field-value">{selected.metodo}</span>
            </div>
          )}
          {selected.identificacion && (
            <div className="detail-field">
              <span className="detail-field-label">Identificación</span>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {selected.identificacion.split(',').map(v => v.trim()).filter(Boolean).map(id => (
                  <span key={id} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 500 }}>
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}
          {selected.seguimiento && (
            <div className="detail-field">
              <span className="detail-field-label">Seguimiento</span>
              <span className="detail-field-value" style={{ color: '#166534', fontWeight: 500 }}>{selected.seguimiento}</span>
            </div>
          )}
        </div>
      </div>

      {selected.info && (
        <div className="detail-info">
          <div className="detail-info-label">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
              <ellipse cx="10" cy="10" rx="8" ry="5.5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="2" fill="currentColor"/>
            </svg>
            Información actual
          </div>
          <p className="detail-info-text">{selected.info}</p>
        </div>
      )}
    </div>
  );
}

const panelTabStyle = (active) => ({
  flex: 1,
  padding: '6px 0',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 6,
  border: `1px solid ${active ? '#d6dae3' : 'transparent'}`,
  background: active ? '#eef1f5' : 'transparent',
  color: active ? '#111827' : '#8b92a5',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.15s, color 0.15s',
});

export default function DetailPanel({ selected, sections = [], view = 'resumen', onViewChange, sistemaFilter = null, onSistemaFilter }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', gap: 5, padding: '10px 12px', borderBottom: '1px solid #e2e5ec', flexShrink: 0 }}>
        <button style={panelTabStyle(view === 'resumen')} onClick={() => onViewChange?.('resumen')}>
          Resumen
        </button>
        <button style={panelTabStyle(view === 'detalle')} onClick={() => onViewChange?.('detalle')}>
          Detalle
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {view === 'resumen' ? (
          <StatsPanel sections={sections} sistemaFilter={sistemaFilter} onSistemaFilter={onSistemaFilter} />
        ) : selected ? (
          <CardDetail selected={selected} sections={sections} />
        ) : (
          <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 12, color: '#8b92a5' }}>
            Hacé clic en una actividad del diagrama para ver su detalle.
          </div>
        )}
      </div>
    </div>
  );
}
