import { Handle, Position } from '@xyflow/react';
import { PHASE_COLORS } from '../../data/roadmapData';

const HS = { opacity: 0, width: 6, height: 6 };

export default function DecisionNode({ data }) {
  const col = PHASE_COLORS[data.color] ?? PHASE_COLORS.blue;
  return (
    <div style={{
      width: 200, padding: '7px 12px',
      background: col.bg, border: `1.5px dashed ${col.border}`,
      borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <Handle type="target" id="top"    position={Position.Top}    style={HS} />
      <Handle type="source" id="bottom" position={Position.Bottom} style={HS} />
      <span style={{ fontSize: 11, color: col.c }}>⬦</span>
      <span style={{ fontSize: 9, fontWeight: 600, color: col.c, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {data.label}
      </span>
    </div>
  );
}
