import { Handle, Position } from '@xyflow/react';
import { PHASE_COLORS } from '../../data/roadmapData';

function getVariant(c) {
  const k = (c ?? '').toLowerCase().trim();
  if (k === 'siempre') return 'always';
  if (k === 'eventual') return 'eventual';
  return 'step';
}

const DOT = { always: '#2563eb', eventual: '#d97706', step: '#c9cdd8' };
const BADGE = {
  always:   { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  eventual: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  step:     { bg: '#f0f2f5', color: '#8b92a5', border: '#e2e5ec' },
};

const HS = { opacity: 0, width: 6, height: 6 };

export default function ActivityNode({ data }) {
  const { item, sectionColor, onSelect, selectedId } = data;
  const col = PHASE_COLORS[sectionColor] ?? PHASE_COLORS.blue;
  const v = getVariant(item.concurrencia);
  const bs = BADGE[v];
  const sel = selectedId === item.id;
  const bg = item.highlight ? '#FCC3B3' : 'white';

  return (
    <div
      onClick={() => onSelect?.(item)}
      style={{
        width: 200, height: 100,
        padding: '8px 11px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        background: bg,
        border: `1.5px solid ${sel ? col.c : '#d1d5db'}`,
        borderLeft: `3px solid ${col.c}`,
        borderRadius: 6,
        boxShadow: sel ? `0 0 0 3px ${col.bg}` : '0 1px 3px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        display: 'flex', alignItems: 'flex-start', gap: 8,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        opacity: data.dimmed ? 0.14 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {data.step != null && (
        <span style={{ position: 'absolute', bottom: 3, right: 7, fontSize: 8.5, fontWeight: 700, color: '#b3b9c6', lineHeight: 1 }}>
          {data.step}
        </span>
      )}

      <Handle type="target" id="top"       position={Position.Top}    style={HS} />
      <Handle type="target" id="left-in"   position={Position.Left}   style={HS} />
      <Handle type="target" id="right-in"  position={Position.Right}  style={HS} />
      <Handle type="source" id="bottom"    position={Position.Bottom} style={HS} />
      <Handle type="source" id="right-out" position={Position.Right}  style={HS} />
      <Handle type="source" id="left-out"  position={Position.Left}   style={HS} />

      <div style={{ width: 7, height: 7, borderRadius: '50%', background: DOT[v], flexShrink: 0, marginTop: 3 }} />

      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div style={{
          fontSize: 11, fontWeight: 500, color: '#111827', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.actividad}
        </div>
        <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 4, marginTop: 4, overflow: 'hidden' }}>
          {item.sistema && (
            <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
              {item.sistema}
            </span>
          )}
          <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, fontWeight: 500, background: bs.bg, color: bs.color, border: `1px solid ${bs.border}`, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {item.concurrencia}
          </span>
        </div>
        {(item.metodo || item.identificacion || item.seguimiento) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 3 }}>
            {item.metodo && (
              <span style={{ fontSize: 8, padding: '1px 4px', borderRadius: 3, background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', whiteSpace: 'nowrap' }}>
                {item.metodo}
              </span>
            )}
            {item.identificacion && item.identificacion.split(',').map(v => v.trim()).filter(Boolean).map(id => (
              <span key={id} style={{ fontSize: 8, padding: '1px 4px', borderRadius: 3, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', whiteSpace: 'nowrap' }}>
                {id}
              </span>
            ))}
            {item.seguimiento && (
              <span style={{ fontSize: 8, padding: '1px 4px', borderRadius: 3, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', whiteSpace: 'nowrap' }}>
                {item.seguimiento}
              </span>
            )}
          </div>
        )}
      </div>

      {item.info && (
        <button
          onClick={e => { e.stopPropagation(); onSelect?.(item); }}
          style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid #e5e7eb', color: '#9ca3af', cursor: 'pointer', padding: 0, marginTop: 1 }}
        >
          <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
            <ellipse cx="10" cy="10" rx="8" ry="5.5" stroke="currentColor" strokeWidth="1.6"/>
            <circle cx="10" cy="10" r="2" fill="currentColor"/>
          </svg>
        </button>
      )}
    </div>
  );
}
