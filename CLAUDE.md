# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React + Vite flow diagram app (`@xyflow/react`). JavaScript only, no TypeScript. No test suite.

- Dev server: `npm run dev`
- Lint: `npm run lint` (ESLint flat config in `eslint.config.js`)
- Build: `npm run build`

## Architecture

All diagram data lives in `src/data/roadmapData.js` — the `SECTIONS` array. Layout is computed in `src/lib/computeLayout.js`. Node components are in `src/components/nodes/`.

**Section types:**
- `id: 'torre1'` → snake/serpiente layout (horizontal grid, 4 columns)
- All other sections → vertical column layout, positioned automatically by `getVerticalX()` — do NOT add them to a hardcoded map

**Item types inside a section's `items` array:**
- `{ type: 'activity', id, concurrencia, actividad, sistema, modulo, info, metodo, identificacion, seguimiento, highlight }`
- `{ type: 'branch', id, label, centerNext, centerCount, paths: [{ label, activities: [...] }] }`

## Critical gotchas

**Duplicate IDs crash the diagram silently.** Every activity `id` must be unique across ALL sections and ALL branch paths. Check before adding.

**CELL_H must stay in sync.** `const CELL_H` in `computeLayout.js` and `height` in `ActivityNode.jsx` must always be the same value (currently `100`). If you change one, change both.

**`centerCount` on branches.** After a branch, the next N activities are centered vertically under the join node. Set `centerCount: N` on the branch object. If you add or remove post-branch activities, update this number.

**Vertical section order = array order.** Sections before `torre1` in the array appear to its left; sections after appear to its right. The X position is calculated automatically.

## Edge system

- `straightEdge(src, tgt, sourceHandle, targetHandle)` — straight line, for aligned handles
- `stepEdge(src, tgt, extra?)` — bezier curve, for non-aligned positions (branches, joins)

## Data conventions

- `identificacion`: comma-separated string, e.g. `'Esperas, Reprocesos'`
- `highlight: true` = orange card background ("Actividades no correspondientes")
- ID naming: prefix + number matching the section (`t1_01`, `ad_1`, `cfg_01`, etc.)
- Empty `identificacion` = `''` (not `null`)
