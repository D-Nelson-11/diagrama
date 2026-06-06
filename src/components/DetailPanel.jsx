import { SECTIONS, PHASE_COLORS } from '../data/roadmapData';

function getSectionColor(itemId) {
  for (const sec of SECTIONS) {
    for (const item of sec.items) {
      if (item.type === 'activity' && item.id === itemId) return sec.color;
      if (item.type === 'branch') {
        for (const path of item.paths) {
          if (path.activities.some(a => a.id === itemId)) return sec.color;
        }
      }
    }
  }
  return 'blue';
}

function getAllActivities() {
  const all = [];
  for (const sec of SECTIONS) {
    for (const item of sec.items) {
      if (item.type === 'activity') all.push(item);
      if (item.type === 'branch') {
        for (const path of item.paths) all.push(...path.activities);
      }
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

function StatsPanel() {
  const all = getAllActivities();
  const total = all.length;
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
    <div style={{ padding: '16px 14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', overflowY: 'auto', height: '100%' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Resumen del proceso</div>
      <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 16 }}>{total} actividades en total</div>

      <StatCard label="Actividades no correspondientes" value={noCorr} color="#c2410c" bg="#fff7ed" />

      <div style={S}>Método</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <StatCard label="Manual" value={manual} color="#374151" />
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

export default function DetailPanel({ selected }) {
  if (!selected) {
    return <StatsPanel />;
  }

  const color = getSectionColor(selected.id);
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
