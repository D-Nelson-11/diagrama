import { SECTIONS } from '../data/roadmapData';

// ── Dimensiones (deben coincidir con los estilos del nodo) ────
const CELL_W  = 200;
const CELL_H  = 100;
const GAP_X   = 28;    // espacio entre columnas (donde va la flecha)
const ROW_GAP = 44;    // espacio vertical entre filas de serpiente
const CONN_H  = 28;    // conector vertical header→actividad o join→actividad
const SEC_H   = 66;
const DEC_W   = 200;
const DEC_H   = 38;
const CELLS   = 4;

// Ancho total del grid de 4 columnas
const ROW_W = CELLS * CELL_W + (CELLS - 1) * GAP_X;  // 884px

// X de cada columna del grid (para alinear branches)
const COL_X = Array.from({ length: CELLS }, (_, i) => i * (CELL_W + GAP_X));
// COL_X = [0, 228, 456, 684]

// Secciones verticales a la derecha
const V_COL_W = 240;
const V_GAP   = 60;
const V_START = ROW_W + 80;

function getVerticalX(sections, sectionId) {
  const torreIdx = sections.findIndex(s => s.id === 'torre1');
  const sIdx     = sections.findIndex(s => s.id === sectionId);

  if (sIdx < torreIdx) {
    // Secciones antes de torre1 → columnas a la izquierda (X negativa)
    const dist = torreIdx - sIdx;
    return -(dist * (V_COL_W + V_GAP));
  }
  // Secciones después de torre1 → columnas a la derecha
  const rightIdx = sIdx - torreIdx - 1;
  return V_START + rightIdx * (V_COL_W + V_GAP);
}

// ── Edge helpers ──────────────────────────────────────────────
const ES = { stroke: '#374151', strokeWidth: 1.5 };
const EM = { type: 'arrowclosed', color: '#374151', width: 11, height: 11 };

let _eid = 0;
const eid = () => `e${++_eid}`;

// Flecha recta (misma fila o giro vertical perfecto)
function straightEdge(src, tgt, sh, th, extra = {}) {
  return { id: eid(), source: src, target: tgt, type: 'straight', sourceHandle: sh, targetHandle: th, style: ES, markerEnd: EM, ...extra };
}

// Flecha bezier para nodos con distinto X/Y (curva suave natural)
function stepEdge(src, tgt, extra = {}) {
  return { id: eid(), source: src, target: tgt, type: 'default', style: ES, markerEnd: EM, ...extra };
}

// ── Snake helpers ─────────────────────────────────────────────
function snakePos(n, startY, yShift) {
  const row = Math.floor(n / CELLS);
  const col = n % CELLS;
  const ltr = row % 2 === 0;
  const x   = ltr ? COL_X[col] : COL_X[CELLS - 1 - col];
  const y   = startY + yShift + row * (CELL_H + ROW_GAP);
  return { x, y, row, ltr };
}

function snakeHandles(fromN, toN) {
  const rA = Math.floor(fromN / CELLS);
  const rB = Math.floor(toN   / CELLS);
  if (rA === rB) {
    // misma fila: horizontal
    return rA % 2 === 0
      ? { sh: 'right-out', th: 'left-in'  }   // →
      : { sh: 'left-out',  th: 'right-in' };   // ←
  }
  // giro de fila: vertical exacto (mismo X)
  return { sh: 'bottom', th: 'top' };
}

// ── Layout SERPIENTE (Torre 1) ────────────────────────────────
function snakeLayout(section, collapsed) {
  _eid = 0;
  const nodes = [];
  const edges = [];
  const secId  = `sec-${section.id}`;
  const startY = SEC_H + CONN_H;

  nodes.push({
    id: secId, type: 'sectionHeader',
    position: { x: 0, y: 0 },
    data: { label: section.label, subtitle: section.subtitle, phase: section.phase, color: section.color, sectionId: section.id, collapsed, headerWidth: ROW_W },
  });

  if (collapsed) return { nodes, edges };

  let count           = 0;
  let yShift          = 0;
  let prev            = secId;
  let prevN           = -1;
  let centerRemaining = 0;  // cuántas actividades seguidas van centradas bajo el join
  let centerYBase     = null;
  let prevWasCentered = false;

  for (const item of section.items) {
    if (item.type === 'activity') {
      const pos       = snakePos(count, startY, yShift);
      const isCentered = centerRemaining > 0;

      let nodeX, nodeY;
      if (isCentered) {
        nodeX       = ROW_W / 2 - CELL_W / 2;
        centerYBase = centerYBase === null ? pos.y : centerYBase + CELL_H + CONN_H;
        nodeY       = centerYBase;
        centerRemaining--;
      } else {
        nodeX       = pos.x;
        nodeY       = pos.y;
        centerYBase = null;
      }

      nodes.push({ id: item.id, type: 'activity', position: { x: nodeX, y: nodeY }, data: { item, sectionColor: section.color } });

      if (prevN === -1) {
        edges.push(isCentered
          ? straightEdge(prev, item.id, 'bottom', 'top')
          : stepEdge(prev, item.id));
      } else if (isCentered && prevWasCentered) {
        // Secuencia centrada → recta vertical entre ellas
        edges.push(straightEdge(prev, item.id, 'bottom', 'top'));
      } else {
        const { sh, th } = snakeHandles(prevN, count);
        edges.push(straightEdge(prev, item.id, sh, th));
      }

      prevWasCentered = isCentered;
      prev  = item.id;
      prevN = count;
      count++;

    } else if (item.type === 'branch') {
      // ── Bloque de bifurcación ──────────────────────────────
      const lastRow = Math.floor(Math.max(count - 1, 0) / CELLS);
      const decY    = startY + yShift + lastRow * (CELL_H + ROW_GAP) + CELL_H + 32;

      const decId  = `dec-${item.id}`;
      const joinId = `join-${item.id}`;

      nodes.push({
        id: decId, type: 'decision',
        position: { x: ROW_W / 2 - DEC_W / 2, y: decY },
        data: { label: item.label, color: section.color },
      });
      // Conexión previa → decision: ángulo recto porque pueden tener X distinto
      edges.push(stepEdge(prev, decId));

      const pathStartY = decY + DEC_H + 32;

      // Las dos rutas se alinean con columna 0 y columna 3 del grid
      const pathX = [COL_X[0], COL_X[CELLS - 1]];   // [0, 684]
      let maxY = pathStartY;

      item.paths.forEach((path, pi) => {
        let pp = decId;
        let py = pathStartY;

        path.activities.forEach(act => {
          nodes.push({
            id: act.id, type: 'activity',
            position: { x: pathX[pi], y: py },
            data: { item: act, sectionColor: section.color },
          });
          // step para que vayan en ángulos rectos desde/hacia la decisión
          edges.push(stepEdge(pp, act.id,
            pp === decId ? {
              label: path.label,
              labelStyle: { fontSize: 9, fill: '#6b7280', fontFamily: 'inherit' },
              labelBgStyle: { fill: '#f9fafb', fillOpacity: 0.95 },
              labelBgPadding: [3, 6], labelBgBorderRadius: 3,
            } : {}
          ));
          pp = act.id;
          py += CELL_H + 28;
        });

        edges.push(stepEdge(pp, joinId));
        maxY = Math.max(maxY, py);
      });

      // Join centrado debajo de las dos ramas
      nodes.push({
        id: joinId, type: 'joinNode',
        position: { x: ROW_W / 2 - 2, y: maxY },
        data: {},
      });

      prev            = joinId;
      prevN           = -1;
      prevWasCentered = false;
      centerRemaining = item.centerCount ?? (item.centerNext ? 1 : 0);
      centerYBase     = null;

      // Ajustar yShift para que la próxima fila del snake empiece después del join
      // Forzar LTR (fila par) después del branch para que empiece desde la izquierda
      const nextRow    = (lastRow + 1) % 2 === 0 ? lastRow + 1 : lastRow + 2;
      const branchEnd  = maxY + 12 + CONN_H;
      const nextNatY   = startY + yShift + nextRow * (CELL_H + ROW_GAP);
      yShift += branchEnd - nextNatY;

      // Alinear count al inicio de la siguiente fila LTR
      count = nextRow * CELLS;
    }
  }

  return { nodes, edges };
}

// ── Layout VERTICAL (Aduana, Transporte, Torre 2) ─────────────
function verticalLayout(section, colX, collapsed) {
  const nodes = [];
  const edges = [];
  const cx    = colX + V_COL_W / 2;
  const secId = `sec-${section.id}`;

  nodes.push({
    id: secId, type: 'sectionHeader',
    position: { x: cx - CELL_W / 2, y: 0 },
    data: { label: section.label, subtitle: section.subtitle, phase: section.phase, color: section.color, sectionId: section.id, collapsed },
  });

  if (collapsed) return { nodes, edges };

  let y    = SEC_H + CONN_H;
  let prev = secId;

  for (const item of section.items) {
    if (item.type === 'activity') {
      nodes.push({ id: item.id, type: 'activity', position: { x: cx - CELL_W / 2, y }, data: { item, sectionColor: section.color } });
      edges.push(straightEdge(prev, item.id, 'bottom', 'top'));
      prev = item.id;
      y   += CELL_H + CONN_H;

    } else if (item.type === 'branch') {
      const decId  = `dec-${item.id}`;
      const joinId = `join-${item.id}`;

      nodes.push({ id: decId, type: 'decision', position: { x: cx - DEC_W / 2, y }, data: { label: item.label, color: section.color } });
      edges.push(straightEdge(prev, decId, 'bottom', 'top'));
      y += DEC_H + CONN_H;

      const pathX = [colX + 2, colX + V_COL_W / 2 + 4];
      let maxY = y;

      item.paths.forEach((path, pi) => {
        let pp = decId; let py = y;
        path.activities.forEach(act => {
          nodes.push({ id: act.id, type: 'activity', position: { x: pathX[pi], y: py }, data: { item: act, sectionColor: section.color } });
          edges.push(stepEdge(pp, act.id));
          pp = act.id; py += CELL_H + CONN_H;
        });
        edges.push(stepEdge(pp, joinId));
        maxY = Math.max(maxY, py);
      });

      nodes.push({ id: joinId, type: 'joinNode', position: { x: cx - 2, y: maxY }, data: {} });
      y    = maxY + 12 + CONN_H;
      prev = joinId;
    }
  }

  return { nodes, edges };
}

// ── Export ───────────────────────────────────────────────────
export function computeLayout(sections, collapsed) {
  const allNodes = [];
  const allEdges = [];

  for (const section of sections) {
    const isCollapsed = collapsed.has(section.id);
    const result = section.id === 'torre1'
      ? snakeLayout(section, isCollapsed)
      : verticalLayout(section, getVerticalX(sections, section.id), isCollapsed);

    allNodes.push(...result.nodes);
    allEdges.push(...result.edges);
  }

  return { nodes: allNodes, edges: allEdges };
}
