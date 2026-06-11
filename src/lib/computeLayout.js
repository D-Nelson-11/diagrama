import { PHASE_COLORS } from '../data/roadmapData.js';

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

// Secciones verticales
const V_COL_W = 240;
const V_GAP   = 60;

// Espacio horizontal después de una sección snake
const SNAKE_GAP_TO_SNAKE = 160;  // snake → snake (varias serpientes seguidas)
const SNAKE_GAP_TO_VCOL  = 80;   // snake → columna vertical

const isSnake = (s) => s.layout === 'snake' || s.id === 'torre1';

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

// ── Render de rutas de una rama ───────────────────────────────
const PATH_GAP = 28;   // espacio vertical entre actividades dentro de una ruta

// Color de las sub-ramas: contraste fijo respecto al color de la sección
const SUB_BRANCH_COLOR = { blue: 'purple', teal: 'amber', amber: 'teal', purple: 'blue' };

// Etiqueta de ruta sobre el primer edge. Con colorKey (sub-rutas) usa la paleta
// de la sub-rama en lugar del gris por defecto.
const pathLabelExtra = (label, colorKey = null) => {
  if (!label) return {};
  const col = colorKey ? PHASE_COLORS[colorKey] : null;
  return {
    label,
    labelStyle: { fontSize: 9, fill: col ? col.accent : '#6b7280', fontWeight: col ? 600 : 400, fontFamily: 'inherit' },
    labelBgStyle: { fill: col ? col.bg : '#f9fafb', fillOpacity: 0.95 },
    labelBgPadding: [3, 6], labelBgBorderRadius: 3,
  };
};

// Apila las actividades de una ruta en X fija. Soporta sub-ramas anidadas
// ({ type: 'branch' } dentro de activities): fork → sub-rutas → join.
// Devuelve { pp, py }: último nodo conectado y siguiente Y libre.
// Mini-serpiente en rutas: con PATH_SNAKE_MIN actividades o más, la ruta se pinta
// en 2 columnas. Desactivada (Infinity) — el zigzag dentro de una ruta compite con
// la serpiente de la sección; para reactivarla, poner un número (ej. 4).
const PATH_SNAKE_MIN = Infinity;

const pathCols = (p) => {
  const n = p.activities.filter(a => a.type !== 'branch').length;
  return n >= PATH_SNAKE_MIN ? 2 : 1;
};
const pathWidth = (p) => {
  const c = pathCols(p);
  return c * CELL_W + (c - 1) * GAP_X;
};

function renderPath(path, x, startY, fromId, section, nodes, edges, color = section.color, labelColor = null) {
  const cols  = pathCols(path);
  const cx    = x + CELL_W / 2;
  // Columnas centradas en el eje de la ruta
  const W     = cols * CELL_W + (cols - 1) * GAP_X;
  const colXs = Array.from({ length: cols }, (_, i) => cx - W / 2 + i * (CELL_W + GAP_X));

  let pp    = fromId;
  let rowY  = startY;   // Y de la fila actual de la mini-serpiente
  let endY  = startY;   // Y libre debajo de lo último pintado
  let first = true;
  let n     = 0;        // celda dentro de la mini-serpiente
  let prevN = -1;

  for (const act of path.activities) {
    if (act.type === 'branch') {
      // ── Sub-rama dentro de la ruta ──
      const forkId   = `fork-${act.id}`;
      const joinId   = `join-${act.id}`;
      const subColor = SUB_BRANCH_COLOR[color] || 'purple';
      const subHex   = PHASE_COLORS[subColor].c;

      nodes.push({ id: forkId, type: 'joinNode', position: { x: cx - 2, y: endY }, data: { color: subHex } });
      edges.push(stepEdge(pp, forkId, first ? pathLabelExtra(path.label, labelColor) : {}));

      // Reparto horizontal según el ancho real de cada sub-ruta (puede ser serpiente)
      const widths = act.paths.map(pathWidth);
      const spread = widths.reduce((a, b) => a + b, 0) + (act.paths.length - 1) * PATH_GAP;
      const subY   = endY + 12 + PATH_GAP;
      let subMaxY  = subY;
      let sx       = cx - spread / 2;

      act.paths.forEach((sub, si) => {
        const subCx = sx + widths[si] / 2;
        const r = renderPath(sub, subCx - CELL_W / 2, subY, forkId, section, nodes, edges, subColor, subColor);
        edges.push(stepEdge(r.pp, joinId, r.pp === forkId ? pathLabelExtra(sub.label, subColor) : {}));
        subMaxY = Math.max(subMaxY, r.py);
        sx += widths[si] + PATH_GAP;
      });

      nodes.push({ id: joinId, type: 'joinNode', position: { x: cx - 2, y: subMaxY }, data: { color: subHex } });
      pp    = joinId;
      endY  = subMaxY + 12 + PATH_GAP;
      // La mini-serpiente arranca de nuevo debajo del join
      rowY  = endY;
      n     = 0;
      prevN = -1;
      first = false;

    } else {
      const row = Math.floor(n / cols);
      const col = n % cols;
      const ltr = row % 2 === 0;
      if (col === 0 && n > 0) rowY += CELL_H + PATH_GAP;  // nueva fila
      const ax = colXs[ltr ? col : cols - 1 - col];

      nodes.push({ id: act.id, type: 'activity', position: { x: ax, y: rowY }, data: { item: act, sectionColor: color } });

      if (prevN === -1) {
        // Desde la decisión / fork / join: curva con la etiqueta de la ruta
        edges.push(stepEdge(pp, act.id, first ? pathLabelExtra(path.label, labelColor) : {}));
      } else if (cols === 1) {
        edges.push(stepEdge(pp, act.id));
      } else if (Math.floor(prevN / cols) === row) {
        // Misma fila de la mini-serpiente: flecha horizontal
        edges.push(ltr
          ? straightEdge(pp, act.id, 'right-out', 'left-in')
          : straightEdge(pp, act.id, 'left-out', 'right-in'));
      } else {
        // Giro de fila: vertical exacto (mismo X)
        edges.push(straightEdge(pp, act.id, 'bottom', 'top'));
      }

      pp    = act.id;
      prevN = n;
      n++;
      endY  = rowY + CELL_H + PATH_GAP;
      first = false;
    }
  }

  return { pp, py: endY };
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
  let stepNum         = 0;  // número de paso dentro de la fase (secuencia principal)

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

      nodes.push({ id: item.id, type: 'activity', position: { x: nodeX, y: nodeY }, data: { item, sectionColor: section.color, step: ++stepNum } });

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

      // Reparto según el ancho real de cada ruta (pueden ser mini-serpientes).
      // Si caben en el grid se estiran para llenarlo; si no, gap mínimo centrado.
      const widths = item.paths.map(pathWidth);
      const sumW   = widths.reduce((a, b) => a + b, 0);
      const k      = item.paths.length;
      const gap    = k > 1 ? Math.max(PATH_GAP, (ROW_W - sumW) / (k - 1)) : 0;
      let px       = ROW_W / 2 - (sumW + (k - 1) * gap) / 2;
      const pathX  = widths.map(w => { const c = px + w / 2; px += w + gap; return c - CELL_W / 2; });
      let maxY = pathStartY;

      item.paths.forEach((path, pi) => {
        const r = renderPath(path, pathX[pi], pathStartY, decId, section, nodes, edges);
        // Ruta vacía: la etiqueta va sobre el edge directo decision → join
        edges.push(stepEdge(r.pp, joinId, r.pp === decId ? pathLabelExtra(path.label) : {}));
        maxY = Math.max(maxY, r.py);
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
  let stepNum = 0;

  for (const item of section.items) {
    if (item.type === 'activity') {
      nodes.push({ id: item.id, type: 'activity', position: { x: cx - CELL_W / 2, y }, data: { item, sectionColor: section.color, step: ++stepNum } });
      edges.push(straightEdge(prev, item.id, 'bottom', 'top'));
      prev = item.id;
      y   += CELL_H + CONN_H;

    } else if (item.type === 'branch') {
      const decId  = `dec-${item.id}`;
      const joinId = `join-${item.id}`;

      nodes.push({ id: decId, type: 'decision', position: { x: cx - DEC_W / 2, y }, data: { label: item.label, color: section.color } });
      edges.push(straightEdge(prev, decId, 'bottom', 'top'));
      y += DEC_H + CONN_H;

      // Reparto según el ancho real de cada ruta, centrado en la columna
      const widths = item.paths.map(pathWidth);
      const spread = widths.reduce((a, b) => a + b, 0) + (item.paths.length - 1) * PATH_GAP;
      let px       = cx - spread / 2;
      const pathX  = widths.map(w => { const c = px + w / 2; px += w + PATH_GAP; return c - CELL_W / 2; });
      let maxY = y;

      item.paths.forEach((path, pi) => {
        const r = renderPath(path, pathX[pi], y, decId, section, nodes, edges);
        edges.push(stepEdge(r.pp, joinId, r.pp === decId ? pathLabelExtra(path.label) : {}));
        maxY = Math.max(maxY, r.py);
      });

      nodes.push({ id: joinId, type: 'joinNode', position: { x: cx - 2, y: maxY }, data: {} });
      y    = maxY + 12 + CONN_H;
      prev = joinId;
    }
  }

  return { nodes, edges };
}

// ── Export ───────────────────────────────────────────────────
// Las secciones se colocan secuencialmente de izquierda a derecha en el orden
// del array, cada una según su ancho REAL (las ramas anchas pueden sobresalir
// del grid). Puede haber varias secciones snake en el mismo tab.
const NODE_W = { activity: CELL_W, decision: DEC_W, sectionHeader: CELL_W, joinNode: 4 };
const NODE_H = { activity: CELL_H, decision: DEC_H, sectionHeader: SEC_H, joinNode: 4 };
// Aire entre el contenido y la banda de fondo de la fase.
// Las columnas verticales van a 60px una de otra — pad chico para que las bandas no se toquen.
const BG_PAD_SNAKE = 28;
const BG_PAD_VCOL  = 14;

export function computeLayout(sections, collapsed) {
  _eid = 0;
  const allNodes = [];
  const allEdges = [];
  let x = 0;

  sections.forEach((section, i) => {
    const isCollapsed = collapsed.has(section.id);
    const snake  = isSnake(section);
    const result = snake
      ? snakeLayout(section, isCollapsed)
      : verticalLayout(section, 0, isCollapsed);

    // Bounds reales de la sección
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const n of result.nodes) {
      const w = n.data?.headerWidth ?? NODE_W[n.type] ?? CELL_W;
      const h = NODE_H[n.type] ?? CELL_H;
      minX = Math.min(minX, n.position.x);
      maxX = Math.max(maxX, n.position.x + w);
      minY = Math.min(minY, n.position.y);
      maxY = Math.max(maxY, n.position.y + h);
    }
    const shift = x - minX;
    if (shift !== 0) for (const n of result.nodes) n.position.x += shift;

    const width = Math.max(maxX - minX, snake ? ROW_W : V_COL_W);

    // Banda de fondo que agrupa visualmente la fase (detrás de nodos y flechas)
    const pad = snake ? BG_PAD_SNAKE : BG_PAD_VCOL;
    allNodes.push({
      id: `bg-${section.id}`, type: 'sectionBg',
      position: { x: x - pad, y: minY - pad },
      data: { width: width + pad * 2, height: (maxY - minY) + pad * 2, color: section.color },
      zIndex: -1, draggable: false, selectable: false,
    });

    allNodes.push(...result.nodes);
    allEdges.push(...result.edges);

    const next = sections[i + 1];
    x += width + (snake ? (next && isSnake(next) ? SNAKE_GAP_TO_SNAKE : SNAKE_GAP_TO_VCOL) : V_GAP);
  });

  return { nodes: allNodes, edges: allEdges };
}
