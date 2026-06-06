---
name: add-section
description: Add a new section to the flow diagram in src/data/roadmapData.js. Use when the user wants to add a new column/section with activities.
disable-model-invocation: true
---

The user wants to add a new section to the diagram. Arguments: $ARGUMENTS

Follow these steps:

1. Read `src/data/roadmapData.js` to understand the current SECTIONS array and the last used IDs.

2. Ask the user (if not already provided in $ARGUMENTS):
   - Section name (label) and subtitle
   - Color: `blue`, `teal`, `amber`, or `purple`
   - Where it should appear: before `torre1` (left side) or after which existing section (right side)
   - Activities to include (or start empty)

3. Choose an ID prefix for activities (e.g., section `Facturacion` → prefix `fac_`).

4. Verify no ID conflicts with existing activities across ALL sections and branch paths.

5. Insert the section object in the correct position in the SECTIONS array:
   - Sections before `torre1` appear to its LEFT
   - Sections after `torre1` appear to its RIGHT, ordered by array position
   - Do NOT add to any hardcoded X position map — `getVerticalX()` handles it automatically

6. Section template:
```js
{
  id: 'SectionId',
  label: 'Label',
  subtitle: 'Subtitle',
  phase: N,
  color: 'blue|teal|amber|purple',
  items: [
    { type: 'activity', id: 'pfx_01', concurrencia: 'Siempre', actividad: '...', sistema: '...', modulo: '...', info: '' },
  ]
}
```

7. Confirm the section renders correctly by noting that `getVerticalX()` in `computeLayout.js` will position it automatically.
