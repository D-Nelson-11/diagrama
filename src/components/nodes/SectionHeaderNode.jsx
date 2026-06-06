import { Handle, Position } from '@xyflow/react';
import { PHASE_COLORS } from '../../data/roadmapData';

const HS = { opacity: 0, width: 6, height: 6 };

export default function SectionHeaderNode({ data }) {
  const col = PHASE_COLORS[data.color] ?? PHASE_COLORS.blue;

  return (
    <div
      onClick={() => data.onToggle?.()}
      style={{
        width: data.headerWidth ?? 200,
        padding: '11px 16px',
        background: data.collapsed ? col.bg : 'white',
        border: `1.5px solid ${col.border}`,
        borderTop: `4px solid ${col.c}`,
        borderRadius: 8,
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <Handle type="target" id="top"    position={Position.Top}    style={HS} />
      <Handle type="source" id="bottom" position={Position.Bottom} style={{...HS, left: 100}} />

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: col.c, fontWeight: 600 }}>
          Fase {data.phase}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{data.label}</div>
        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 1 }}>{data.subtitle}</div>
      </div>
      <span style={{ fontSize: 10, color: col.c, fontWeight: 600, flexShrink: 0 }}>
        {data.collapsed ? '▼' : '▲'}
      </span>
    </div>
  );
}
