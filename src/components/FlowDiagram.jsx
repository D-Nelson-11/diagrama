import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SECTIONS } from '../data/roadmapData';
import { computeLayout } from '../lib/computeLayout';
import ActivityNode from './nodes/ActivityNode';
import SectionHeaderNode from './nodes/SectionHeaderNode';
import DecisionNode from './nodes/DecisionNode';
import JoinNode from './nodes/JoinNode';

const nodeTypes = {
  activity:      ActivityNode,
  sectionHeader: SectionHeaderNode,
  decision:      DecisionNode,
  joinNode:      JoinNode,
};

export default function FlowDiagram({ onSelect, selectedId }) {
  const [collapsed, setCollapsed] = useState(new Set());

  const toggleCollapse = useCallback((sectionId) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  }, []);

  const layout = useMemo(() => computeLayout(SECTIONS, collapsed), [collapsed]);

  const nodes = useMemo(() =>
    layout.nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        onSelect,
        selectedId,
        onToggle: n.data.sectionId ? () => toggleCollapse(n.data.sectionId) : undefined,
      },
    })),
    [layout, onSelect, selectedId, toggleCollapse]
  );

  const onNodeClick = useCallback((_, node) => {
    if (node.type === 'activity' && node.data?.item) {
      onSelect(node.data.item);
    }
  }, [onSelect]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={layout.edges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      fitView
      fitViewOptions={{ padding: 0.08, minZoom: 0.15 }}
      minZoom={0.08}
      maxZoom={2}
      nodesDraggable={false}
      nodesConnectable={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#dde1e8" gap={24} size={1} />
      <Controls showInteractive={false} style={{ bottom: 16, left: 16 }} />
      <Panel position="bottom-right">
        <div style={{ background: 'white', borderRadius: 8, padding: '10px 14px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minWidth: 200 }}>
          <div style={{ fontWeight: 700, color: '#374151', marginBottom: 8, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Leyenda</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 18, height: 12, borderRadius: 3, background: '#FCC3B3', border: '1px solid #f9a48b', flexShrink: 0 }} />
              <span style={{ color: '#6b7280' }}>Actividades no correspondientes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
              <span style={{ color: '#6b7280' }}>Siempre</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706', flexShrink: 0 }} />
              <span style={{ color: '#6b7280' }}>Eventual</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9cdd8', flexShrink: 0 }} />
              <span style={{ color: '#6b7280' }}>Paso específico</span>
            </div>
          </div>
        </div>
      </Panel>
    </ReactFlow>
  );
}
