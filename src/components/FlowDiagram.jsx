import { useState, useCallback, useMemo, useEffect } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Panel, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SECTIONS as DEFAULT_SECTIONS, PHASE_COLORS } from '../data/roadmapData';
import { computeLayout } from '../lib/computeLayout';
import ActivityNode from './nodes/ActivityNode';
import SectionHeaderNode from './nodes/SectionHeaderNode';
import DecisionNode from './nodes/DecisionNode';
import JoinNode from './nodes/JoinNode';
import SectionBgNode from './nodes/SectionBgNode';

const nodeTypes = {
  activity:      ActivityNode,
  sectionHeader: SectionHeaderNode,
  decision:      DecisionNode,
  joinNode:      JoinNode,
  sectionBg:     SectionBgNode,
};

// Color de cada nodo en el minimapa, por fase
const miniMapColor = (n) => {
  if (n.type === 'sectionBg') return (PHASE_COLORS[n.data?.color] ?? PHASE_COLORS.blue).bg;
  if (n.type === 'activity')  return (PHASE_COLORS[n.data?.sectionColor] ?? PHASE_COLORS.blue).border;
  return '#d1d5db';
};

export default function FlowDiagram({ onSelect, selectedId, sections = DEFAULT_SECTIONS, tab = 'default', sistemaFilter = null }) {
  const [collapsed, setCollapsed] = useState(new Set());

  // Posiciones movidas a mano, persistidas en localStorage por pestaña
  const storageKey = `flow-positions:${tab}`;
  const [overrides, setOverrides] = useState(() => {
    try {
      return new Map(Object.entries(JSON.parse(localStorage.getItem(storageKey)) || {}));
    } catch {
      return new Map();
    }
  });

  const toggleCollapse = useCallback((sectionId) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  }, []);

  const layout = useMemo(() => computeLayout(sections, collapsed), [sections, collapsed]);

  const baseNodes = useMemo(() =>
    layout.nodes.map(n => ({
      ...n,
      data: {
        ...n.data,
        onSelect,
        selectedId,
        onToggle: n.data.sectionId ? () => toggleCollapse(n.data.sectionId) : undefined,
        // Filtro por sistema: atenúa las actividades que no coinciden
        dimmed: !!sistemaFilter && n.type === 'activity' &&
                (n.data.item?.sistema || '').trim() !== sistemaFilter,
      },
    })),
    [layout, onSelect, selectedId, toggleCollapse, sistemaFilter]
  );

  // React Flow maneja el drag internamente; al recalcular el layout se
  // re-aplican las posiciones guardadas encima de las calculadas
  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);

  useEffect(() => {
    setNodes(baseNodes.map(n => ({ ...n, position: overrides.get(n.id) || n.position })));
  }, [baseNodes, overrides, setNodes]);

  // Al soltar un nodo se persisten las posiciones de todo lo arrastrado
  const onNodeDragStop = useCallback((_, __, draggedNodes) => {
    setOverrides(prev => {
      const next = new Map(prev);
      for (const n of draggedNodes) next.set(n.id, n.position);
      try { localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(next))); } catch { /* storage lleno/bloqueado */ }
      return next;
    });
  }, [storageKey]);

  const restoreLayout = useCallback(() => {
    setOverrides(new Map());
    try { localStorage.removeItem(storageKey); } catch { /* */ }
  }, [storageKey]);

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
      onNodesChange={onNodesChange}
      onNodeDragStop={onNodeDragStop}
      fitView
      fitViewOptions={{ padding: 0.08, minZoom: 0.15 }}
      minZoom={0.08}
      maxZoom={2}
      nodesDraggable
      nodesConnectable={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#c7cdd9" gap={24} size={1} />
      <Controls showInteractive={false} style={{ bottom: 16, left: 16 }} />
      <MiniMap
        position="bottom-left"
        pannable
        zoomable
        nodeColor={miniMapColor}
        nodeStrokeWidth={0}
        style={{ marginLeft: 56, width: 180, height: 120 }}
      />
      {overrides.size > 0 && (
        <Panel position="top-right">
          <button
            onClick={restoreLayout}
            title="Regresa todos los nodos a su posición original"
            style={{ background: 'white', borderRadius: 8, padding: '7px 12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 11, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
          >
            ⟲ Restaurar posiciones
          </button>
        </Panel>
      )}
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
