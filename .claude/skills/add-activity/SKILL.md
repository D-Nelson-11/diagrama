---
name: add-activity
description: Add one or more activities to an existing section in src/data/roadmapData.js. Use when the user wants to add nodes/cards to the diagram.
disable-model-invocation: true
---

The user wants to add activities to the diagram. Arguments: $ARGUMENTS

Follow these steps:

1. Read `src/data/roadmapData.js` to see the current state of the target section.

2. Identify the target section from $ARGUMENTS. If unclear, ask which section.

3. Determine the next available ID by finding the highest existing numeric suffix for that section's prefix (e.g., if `ad_5` exists, next is `ad_6`).

4. **Check for duplicate IDs** — search ALL sections and branch paths before assigning any ID.

5. Collect the activity data needed. Required fields:
   - `actividad` — display name
   - `concurrencia` — `'Siempre'`, `'Eventual'`, or a step number like `'1'`
   - `sistema` — system name
   - `modulo` — module (often same as sistema)
   - `info` — detail text shown in the side panel

   Optional fields:
   - `metodo` — e.g. `'Manual'`
   - `identificacion` — comma-separated string: `'Esperas'`, `'Reprocesos'`, `'Doble Digitación'`, etc.
   - `seguimiento` — `'Ejecución'`, `'Monitoreo'`, `'Ejecución y Monitoreo'`, or `'Control'`
   - `highlight: true` — orange card background (use for "Actividades no correspondientes")

6. If the activity goes inside a branch path, identify which `branch.paths[N].activities` array to append to.

7. If adding after a branch in `torre1` (snake layout) that uses `centerCount`, check if the count needs updating.

8. Insert the activity in the correct position in the `items` array (or branch path activities array).

9. Report what was added and remind the user to verify in the browser that no layout issues appeared.
