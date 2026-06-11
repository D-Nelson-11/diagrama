import { Handle, Position } from '@xyflow/react';

const HS = { opacity: 0, width: 4, height: 4 };

export default function JoinNode({ data }) {
  return (
    <div style={{ width: 4, height: 4, borderRadius: '50%', background: data?.color || '#9ca3af' }}>
      <Handle type="target" id="top"    position={Position.Top}    style={HS} />
      <Handle type="source" id="bottom" position={Position.Bottom} style={HS} />
    </div>
  );
}
