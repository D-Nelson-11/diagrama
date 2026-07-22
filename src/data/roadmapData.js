export const PHASE_COLORS = {
  blue:   { c: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', accent: '#1d4ed8' },
  teal:   { c: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', accent: '#0e7490' },
  amber:  { c: '#b45309', bg: '#fffbeb', border: '#fde68a', accent: '#92400e' },
  purple: { c: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', accent: '#6d28d9' },
};

export const SECTIONS = [
  {
    id: 'Entradas',
    label: 'Entradas',
    subtitle: 'Documentos de entrada',
    phase: 1,
    color: 'teal',
    items: [
      { type: 'activity', id: 'ent_1', concurrencia: 'Siempre', actividad: 'Orden de compra',           sistema: 'Correo', modulo: 'Correo', info: '' },
      { type: 'activity', id: 'ent_2', concurrencia: 'Siempre', actividad: 'Documentos de despacho',    sistema: 'Correo', modulo: 'Correo', info: '' },
      { type: 'activity', id: 'ent_3', concurrencia: 'Siempre', actividad: 'Instrucciones de clientes', sistema: 'Correo', modulo: 'Correo', info: '' },
    ]
  },
  {
    id: 'Configuracion',
    label: 'Configuración',
    subtitle: 'Configuraciones del sistema',
    phase: 2,
    color: 'purple',
    items: [
      { type: 'activity', id: 'cfg_01', concurrencia: 'Siempre', actividad: 'Crear Rutas',   sistema: 'App configuraciones', modulo: 'Crear Rutas',   info: '1. CREACION DE SITIOS EN PERSONAS\n2. CREACION DE SITIOS EN ANALISIS DE RED\n3. CREACIÓN DE SITIO EN SEGUIMIENTO (ADUANA)\n4. CREACIÓN DE SITIO ORIGEN Y DESTINO EN TORRE * SI APLICA\n5. CREACIÓN DE SEGMENTOS\n6. ESQUEMAS (SELLOS)\n7. CATEGORIA\n8. CRITERIO DE SO, HR, AFORO, PERMISOS, GENERACION DE DOCS\n9. CONFIGURACIÓN INTRANSIT\n10. EVENTOS\n11. ALERTAS\n12. GESTIONES RELEVANTES' },
      { type: 'activity', id: 'cfg_02', concurrencia: 'Siempre', actividad: 'Crear Skus',    sistema: 'App configuraciones', modulo: 'Crear Skus',    info: '1. SKU CLIENTE\n2. SKU PROVEEDOR\n3. TIPO EMBALAJE\n4. RELACIÓN\n5. PARTIDA ARANCELARIA' },
      { type: 'activity', id: 'cfg_03', concurrencia: 'Siempre', actividad: 'Intransit',     sistema: 'App configuraciones', modulo: 'Intransit',     info: '1. RELACION ENTRE CLIENTE PROVEEDOR\n2. CREACIÓN DE LA DISTRIBUCIÓN\n3. AGREGAR SITIOS AL PROVEEDOR\n4. DENOMINACIÓN\n5. CREAR RESPONSABLES EN PERSONAS\n6. RELACIÓN DE LOS RESPONSABLES EN LOS SITIOS\n7. ASIGNAR ORIGEN A DESPACHADOR\n8. RELACIONAR ESPECIALISTA/GESTOR AL PROVEEDOR\n9. CREACIÓN DE USUARIO AL DESPACHADOR\n10. ASIGNAR FLOTA' },
      { type: 'activity', id: 'cfg_04', concurrencia: 'Siempre', actividad: 'Matriz',        sistema: 'App configuraciones', modulo: 'Matriz',        info: '1. CREACION DE HOJA DE RUTA\n2. CREACION DE SALES ORDER\n3. CREACIÓN DE SOLICITUD DE AFORO *SI APLICA\n4. CREACIÓN DE PERMISOS (FITO Y ZOO) *SI APLICA\n5. CREACION DE GENERACIÓN DE DOCUMENTOS *SI APLICA\n6. CREACIÓN DE FACTURA COMERCIAL\n7. CREACIÓN DE LINEA MATERIAL' },
      { type: 'activity', id: 'cfg_05', concurrencia: 'Siempre', actividad: 'Negociaciones', sistema: 'App configuraciones', modulo: 'Negociaciones', info: '1. CREACIÓN DE CLIENTES\n2. CREACIÓN DE PROVEEDORES\n3. CREACION DE NEGOCIACIONES\n4. CREACIÓN DE COMPONENTES\n5. CREACIÓN DE CRITERIOS\n6. CREACION DE MATERIALES\n7. ASIGNAR MATERIALES A COMPONENTES' },
      { type: 'activity', id: 'cfg_06', concurrencia: 'Siempre', actividad: 'Cronómetros',   sistema: 'App configuraciones', modulo: 'Cronómetros',   info: '1. CREACION DE NEGOCIACIONES\n2. CREACION DE COMPONENTES\n3. CREACIÓN DE CRITERIOS\n4. CREACION DE MATERIAL\n5. CREACIÓN DE ESCALA DE MATERIAL\n6. CREACION DEL CRONOMETRO EN ANALISIS DE RED\n7. CREACIÓN DE PROVEEDORES Y CLIENTES POR TENANT\n8. ASIGNAR OFICIAL DE PAGO Y OFICIAL DE SOLICITUD DE PAGO\n9. ASIGNAR DIVISA AL PROVEEDOR\n10. CREAR DETALLE DE NEGOCIACIÓN\n11. CREAR MATERIAL PROVEEDOR\n12. ASIGNAR MATERIAL SEGMENTO AL MATERIAL PROVEEDOR' },
    ]
  },
  {
    id: 'torre1',
    label: 'Torre',
    subtitle: 'Seguimiento de Origen',
    phase: 3,
    color: 'blue',
    items: []
  },
  {
    id: 'aduana',
    label: 'Aduana',
    subtitle: 'Proceso Aduanero',
    phase: 4,
    color: 'teal',
    items: []
  },
  {
    id: 'transporte',
    label: 'Transporte',
    subtitle: 'Coordinación Merchant',
    phase: 5,
    color: 'amber',
    items: []
  },
  {
    id: 'torre2',
    label: 'Torre',
    subtitle: 'Cierre del Embarque',
    phase: 6,
    color: 'purple',
    items: []
  },
  {
    id: 'Reporteria',
    label: 'Salida',
    subtitle: 'Control y seguimiento',
    phase: 7,
    color: 'teal',
    items: []
  },
];

// Las demás tabs (marítimo, terrestre, las que se agreguen al sheet) se generan
// 100% automáticas: secciones desde los marcadores '## Nombre', en el orden del
// sheet. Para personalizar una sección (subtitle, color, layout), agregar un array
// base en TAB_OVERRIDES (App.jsx) con el id que genera el parser
// (slug del nombre: '## UAD' → 'uad') — su metadata tendrá prioridad.
