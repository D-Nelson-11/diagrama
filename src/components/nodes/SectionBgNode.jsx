import { PHASE_COLORS } from '../../data/roadmapData';

// Banda de fondo que agrupa visualmente una fase (no interactiva, detrás de todo)
export default function SectionBgNode({ data }) {
  const col = PHASE_COLORS[data.color] ?? PHASE_COLORS.blue;
  return (
    <div
      style={{
        width: data.width,
        height: data.height,
        background: col.bg,
        opacity: 0.45,
        border: `1.5px solid ${col.border}`,
        borderRadius: 18,
        pointerEvents: 'none',
      }}
    />
  );
}
