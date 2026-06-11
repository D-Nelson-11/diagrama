# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React + Vite flow diagram app (`@xyflow/react`). JavaScript only, no TypeScript. No test suite.

- Dev server: `npm run dev`
- Lint: `npm run lint` (ESLint flat config in `eslint.config.js`)
- Build: `npm run build`

## Architecture

Diagram structure lives in `src/data/roadmapData.js` — the `SECTIONS` array (section metadata only, items start empty). Dynamic data comes pre-parsed from the workapp backend (`VITE_SHEETS_API_URL` in `.env`). Layout is computed in `src/lib/computeLayout.js`. Node components are in `src/components/nodes/`.

**Data flow:**
1. App loads → fetches `{VITE_SHEETS_API_URL}/tabs` → every sheet tab starting with `Flujo` in the whitelisted spreadsheets becomes a UI tab automatically (`loadTabs`/`buildTab` in `App.jsx`)
2. Per-tab fetch to `VITE_SHEETS_API_URL` + `?id=<spreadsheet>&tab=<tabName>` → returns `{ sections: [...] }` in sheet order
3. `mergeSheetData()` in `App.jsx` merges items into base sections and auto-creates unknown ones
4. Sync button re-fetches the active tab; each tab caches after first load
5. Optional per-tab customization in `TAB_OVERRIDES` (`App.jsx`, keyed by trimmed sheet tab name): `label`, `base` (default `[]`), `allSnake` (default `true`). The legacy `Flujo de proceso` tab uses `base: SECTIONS` + `allSnake: false`.

**Section types:**
- `layout: 'snake'` (or legacy `id: 'torre1'`) → snake/serpiente layout (horizontal grid, 4 columns). Multiple snake sections per tab are allowed.
- All other sections → vertical column layout.
- Sections are placed sequentially left-to-right in array order, each advancing the X cursor by its REAL rendered width (min `ROW_W` for snake / `V_COL_W` for vertical) plus a gap (`computeLayout()`). Do NOT hardcode X positions.
- Tabs default to `allSnake: true` (ALL auto-created sheet sections render as snake); override per tab in `TAB_OVERRIDES` (`App.jsx`).

**Static sections (hardcoded in `roadmapData.js`, NOT from sheet):**
- `Entradas`, `Configuracion`

**Dynamic sections (items come from Google Sheets) — AUTO-GENERATED:**
- Any `## Name` marker in a sheet creates its section automatically: id = slug of the name (`slugify` in the backend parser), label = the name, color cycles `AUTO_COLORS`, sheet order = diagram order, first section becomes the snake anchor if none exists.
- NO code changes needed to add a section to a sheet. `SECTION_MAP` in the backend parser only pins legacy ids for the proceso sheet (`Torre` → `torre1`, etc.).
- To customize an auto section (subtitle, color, layout): add an entry with the same id to the tab's base array in `roadmapData.js` (e.g. `MARITIMO_SECTIONS`) — base metadata wins, items still come from the sheet. Base sections render first (leftmost), then sheet-only sections in sheet order.
- Tab `proceso` base: `SECTIONS` (includes static `Entradas`/`Configuracion` + the 6 sheet sections). Tab `maritimo` base: `MARITIMO_SECTIONS` (empty — fully auto).

**Item types inside a section's `items` array:**
- `{ type: 'activity', id, concurrencia, actividad, sistema, modulo, info, metodo, identificacion, seguimiento, highlight }`
- `{ type: 'branch', id, label, centerNext, centerCount, paths: [{ label, concurrencia, activities: [...] }] }`
- A path's `activities` array may contain a nested `{ type: 'branch', paths: [...] }` (sub-branch, ONE nesting level). It renders as fork dot → sub-paths → join dot inside the path (`renderPath` in `computeLayout.js`). Sub-branch cards use a contrasting color from the section's (`SUB_BRANCH_COLOR` map in `computeLayout.js`).

## Google Sheets integration

- The parser and the Google credentials live in the **workapp backend** (NestJS): `workapp/server/src/flujo-diagrama/flujo-diagrama.service.ts`. This repo is PUBLIC (GitHub Pages) — never commit credentials here.
- Endpoint: `GET /api/flujo-sheets?id=<spreadsheetId>&tab=<tabName>` on the Azure backend; the URL is set via `VITE_SHEETS_API_URL` in `.env` (must stay pointed at Azure — `npm run build` reads it; local override goes in `.env.development.local`, gitignored).
- The backend only validates that `id` is in its `ALLOWED_SPREADSHEET_IDS` whitelist — tabs are free. `GET {endpoint}/tabs` lists tabs starting with `Flujo` across whitelisted spreadsheets.
- All flujo endpoints require an `x-api-key` header (guard in the backend; key from `FLUJO_API_KEY` env or its private fallback). The front asks the user for the key on first load, stores it in `localStorage` (`flujo-api-key`), and re-prompts on 401. NEVER hardcode the key in this repo — it's public.
- **Adding a new flow = create a sheet tab whose name starts with `Flujo` in one of the whitelisted spreadsheets. That's it — no code, no deploys.** A backend deploy is only needed for a brand-new spreadsheet FILE (one-line whitelist addition) or parser changes.
- Legacy mode `?sheet=<key>` still works against the backend `SHEETS` map (kept for backwards compat).
- `TAB_OVERRIDES` in `App.jsx` customizes label/base/allSnake per sheet tab name. Tab `key` = slug of the sheet tab name (used for caching and saved node positions).
- API response format: `{ sections: [{ id, label, items }] }` (sheet order preserved). `mergeSheetData` in App.jsx also accepts the legacy `{ id: items }` map for backwards compat.

**Sheet structure — column headers (detected by name, order-independent):**
`Concurrencia | Actividad | Sistema | Modulo | Metodo | Identificación | Seguimiento | Información Actual | Acción a tomar | Resaltado`

**Sheet markers (go in column A):**
- `## SectionName` — section separator (auto-creates the section; `SECTION_MAP` in the backend parser only overrides legacy ids). Data rows BEFORE the first `##` marker go to an auto-created fallback section named after the sheet tab.
- `[RAMA: label]` — opens a branch
- `[RUTA: label]` — starts a path within the branch
- `[SUBRUTA: label]` — starts a sub-path inside the current path (ONE nesting level). Consecutive `[SUBRUTA:]`s in the same path fan out from the same fork; `[/SUBRUTA]` closes the sub-path. An activity row at path level after `[/SUBRUTA]` goes below the sub-join; a later `[SUBRUTA:]` then starts a NEW fork.
- `[/RAMA]` — closes the branch
- `[RUTA:]`/`[SUBRUTA:]` rows MAY carry the first activity of the path in the same row (columns B+); the parser blanks `concurrencia` for those. `## SectionName`/`[RAMA:]` rows must be alone.
- `Resaltado` column: any non-empty value → `highlight: true` (orange card)

## Critical gotchas

**Duplicate IDs crash the diagram silently.** Every activity `id` must be unique across ALL sections and ALL branch paths. Check before adding.

**CELL_H must stay in sync.** `const CELL_H` in `computeLayout.js` and `height` in `ActivityNode.jsx` must always be the same value (currently `100`). If you change one, change both.

**`centerCount` on branches.** After a branch, the next N activities are centered vertically under the join node. Set `centerCount: N` on the branch object. If you add or remove post-branch activities, update this number.

**Section order = array order.** Sections render left-to-right in array order; X positions are calculated automatically by the cursor in `computeLayout()`. Spacing between snake sections is `SNAKE_GAP_TO_SNAKE` (160px).

**Edge IDs reset once per `computeLayout` call.** `_eid` resets in `computeLayout()`, NOT inside `snakeLayout()`. Never move the reset back into `snakeLayout` — it causes duplicate edge keys across sections.

**Branch path distribution.** Paths are distributed by their REAL width (`pathWidth`): if they fit in the grid they stretch to fill it, otherwise they pack with a minimum gap, centered, and may stick out of the grid — `computeLayout()` sizes each section by its actual bounds so neighbors never overlap.

**Mini-snakes in paths are DISABLED.** Paths (rutas/sub-rutas) always render as vertical columns. The 2-column serpentine mechanism still exists behind `PATH_SNAKE_MIN` in `computeLayout.js` (set to `Infinity`; set a number like 4 to re-enable).

## Edge system

- `straightEdge(src, tgt, sourceHandle, targetHandle)` — straight line, for aligned handles
- `stepEdge(src, tgt, extra?)` — bezier curve, for non-aligned positions (branches, joins)

## Data conventions

- `identificacion`: comma-separated string, e.g. `'Esperas, Reprocesos'`
- `highlight: true` = orange card background ("Actividades no correspondientes")
- ID naming for sheet-generated activities: `{prefix}_{nn}` (e.g. `t1_01`, `ad_01`)
- ID naming for branch activities: `{prefix}_br{branchN}_p{pathN}_{nn}`; sub-branch activities: `{prefix}_br{branchN}_p{pathN}_sb{subPathN}_{nn}`
- Empty `identificacion` = `''` (not `null`)
