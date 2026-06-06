export const PHASE_COLORS = {
  blue: { c: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', accent: '#1d4ed8' },
  teal: { c: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', accent: '#0e7490' },
  amber: { c: '#b45309', bg: '#fffbeb', border: '#fde68a', accent: '#92400e' },
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
      { type: 'activity', id: 'ent_1', concurrencia: 'Siempre', actividad: 'Orden de compra',          sistema: 'Correo', modulo: 'Correo', info: '' },
      { type: 'activity', id: 'ent_2', concurrencia: 'Siempre', actividad: 'Documentos de despacho',   sistema: 'Correo', modulo: 'Correo', info: '' },
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
      { type: 'activity', id: 'cfg_01', concurrencia: 'Siempre', actividad: 'Crear Rutas', sistema: 'App configuraciones', modulo: 'Crear Rutas', info: '1. CREACION DE SITIOS EN PERSONAS\n2. CREACION DE SITIOS EN ANALISIS DE RED\n3. CREACIÓN DE SITIO EN SEGUIMIENTO (ADUANA)\n4. CREACIÓN DE SITIO ORIGEN Y DESTINO EN TORRE * SI APLICA\n5. CREACIÓN DE SEGMENTOS\n6. ESQUEMAS (SELLOS)\n7. CATEGORIA\n8. CRITERIO DE SO, HR, AFORO, PERMISOS, GENERACION DE DOCS\n9. CONFIGURACIÓN INTRANSIT\n10. EVENTOS\n11. ALERTAS\n12. GESTIONES RELEVANTES' },
      { type: 'activity', id: 'cfg_02', concurrencia: 'Siempre', actividad: 'Crear Skus', sistema: 'App configuraciones', modulo: 'Crear Skus', info: '1. SKU CLIENTE\n2. SKU PROVEEDOR\n3. TIPO EMBALAJE\n4. RELACIÓN\n5. PARTIDA ARANCELARIA' },
      { type: 'activity', id: 'cfg_03', concurrencia: 'Siempre', actividad: 'Intransit', sistema: 'App configuraciones', modulo: 'Intransit', info: '1. RELACION ENTRE CLIENTE PROVEEDOR\n2. CREACIÓN DE LA DISTRIBUCIÓN\n3. AGREGAR SITIOS AL PROVEEDOR\n4. DENOMINACIÓN\n5. CREAR RESPONSABLES EN PERSONAS\n6. RELACIÓN DE LOS RESPONSABLES EN LOS SITIOS\n7. ASIGNAR ORIGEN A DESPACHADOR\n8. RELACIONAR ESPECIALISTA/GESTOR AL PROVEEDOR\n9. CREACIÓN DE USUARIO AL DESPACHADOR\n10. ASIGNAR FLOTA' },
      { type: 'activity', id: 'cfg_04', concurrencia: 'Siempre', actividad: 'Matriz', sistema: 'App configuraciones', modulo: 'Matriz', info: '1. CREACION DE HOJA DE RUTA\n2. CREACION DE SALES ORDER\n3. CREACIÓN DE SOLICITUD DE AFORO *SI APLICA\n4. CREACIÓN DE PERMISOS (FITO Y ZOO) *SI APLICA\n5. CREACION DE GENERACIÓN DE DOCUMENTOS *SI APLICA\n6. CREACIÓN DE FACTURA COMERCIAL\n7. CREACIÓN DE LINEA MATERIAL' },
      { type: 'activity', id: 'cfg_05', concurrencia: 'Siempre', actividad: 'Negociaciones', sistema: 'App configuraciones', modulo: 'Negociaciones', info: '1. CREACIÓN DE CLIENTES\n2. CREACIÓN DE PROVEEDORES\n3. CREACION DE NEGOCIACIONES\n4. CREACIÓN DE COMPONENTES\n5. CREACIÓN DE CRITERIOS\n6. CREACION DE MATERIALES\n7. ASIGNAR MATERIALES A COMPONENTES' },
      { type: 'activity', id: 'cfg_06', concurrencia: 'Siempre', actividad: 'Cronómetros', sistema: 'App configuraciones', modulo: 'Cronómetros', info: '1. CREACION DE NEGOCIACIONES\n2. CREACION DE COMPONENTES\n3. CREACIÓN DE CRITERIOS\n4. CREACION DE MATERIAL\n5. CREACIÓN DE ESCALA DE MATERIAL\n6. CREACION DEL CRONOMETRO EN ANALISIS DE RED\n7. CREACIÓN DE PROVEEDORES Y CLIENTES POR TENANT\n8. ASIGNAR OFICIAL DE PAGO Y OFICIAL DE SOLICITUD DE PAGO\n9. ASIGNAR DIVISA AL PROVEEDOR\n10. CREAR DETALLE DE NEGOCIACIÓN\n11. CREAR MATERIAL PROVEEDOR\n12. ASIGNAR MATERIAL SEGMENTO AL MATERIAL PROVEEDOR' },
    ]
  },
  {
    id: 'torre1',
    label: 'Torre',
    subtitle: 'Seguimiento de Origen',
    phase: 3,
    color: 'blue',
    items: [
      { type: 'activity', id: 't1_01', concurrencia: 'Siempre',   actividad: 'Confirmar recepción de OC con proveedor',                              sistema: 'Correo',         modulo: 'Correo',                    metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Monitoreo',             info: 'Correo de confirmación y retroalimentación. Solicitar estandarización del asunto.' },
      { type: 'activity', id: 't1_02', concurrencia: 'Siempre',   actividad: 'Ingreso de orden de compra',                                            sistema: 'Portal cliente', modulo: 'Crear orden de compra',      metodo: 'Manual', identificacion: '',                  seguimiento: 'Ejecución',             info: '#documento, cliente, proveedor, organización, fecha doc., imt, centro, área de compras, responsable de compras, resp. compra, condición pago, fecha correo.' },
      { type: 'activity', id: 't1_03', concurrencia: 'Eventual',  actividad: 'Creación de nuevo proveedor',                                           sistema: 'Portal cliente', modulo: 'Crear orden de compra',      metodo: 'Manual', identificacion: '',                  seguimiento: 'Ejecución y Monitoreo', info: 'Creación de nuevos proveedores (RTN, Id fiscal, razón social, etc.).' },
      { type: 'activity', id: 't1_04', concurrencia: 'Siempre',   actividad: 'Creación del despacho',                                                 sistema: 'Portal cliente', modulo: 'Programación Despacho P2P',  metodo: 'Manual', identificacion: '',                  seguimiento: 'Ejecución',             info: 'Ingreso de fechas (ETD, ETA, Requerida).' },
      { type: 'activity', id: 't1_05', concurrencia: 'Siempre',   actividad: 'Seguimiento cumplimiento de fechas para despachos requeridos por el cliente', sistema: 'Correo',  modulo: 'Correo',                    metodo: 'Manual', identificacion: '',                  seguimiento: 'Ejecución y Monitoreo', info: 'Consultas con el proveedor sobre la entrega del producto. Si no aplica: se realiza un análisis de desabastecimiento de atrasos y se realizan propuestas de cambio de modalidad (aéreo-marítimo). Se escala a código rojo.' },
      { type: 'activity', id: 't1_06', concurrencia: 'Siempre',   actividad: 'Cotización flete Vesta',                                                sistema: 'Link',           modulo: 'Link',                      metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Ejecución y Monitoreo', info: 'Creación de solicitud de pricing en Link, llenado de información.', highlight: true },
      { type: 'activity', id: 't1_07', concurrencia: 'Siempre',   actividad: 'Validar ruta ofertada para análisis de riesgos',                        sistema: 'Correo',         modulo: 'Correo',                    metodo: 'Manual', identificacion: 'Esperas, Reprocesos', seguimiento: 'Ejecución',             info: 'Solicitud de ruta cotizada para análisis de cada puerto por congestionamiento y aumento del tiempo ofertado.', highlight: true },
      { type: 'activity', id: 't1_08', concurrencia: 'Siempre',   actividad: 'Elección de tarifa por cliente (Vesta vs Proveedor)',                   sistema: 'Correo',         modulo: 'Correo',                    metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Monitoreo',             info: 'Informan de proceder o solicitan cambio de negociación.' },
      {
        type: 'branch',
        id: 'branch_tarifa',
        label: 'Tipo de tarifa',
        paths: [
          {
            label: 'Si viene con Vesta',
            concurrencia: '1',
            activities: [
              { id: 'tv_1', concurrencia: '1', metodo: 'Manual', identificacion: 'Reprocesos', seguimiento: 'Ejecución y Monitoreo', actividad: 'Tarifa Vesta', sistema: 'Correo', modulo: 'Correo', info: 'Confirmamos tarifa marítima y solicitud de Booking con la fecha requerida de despacho y documentos originales. Elección de naviera para la salida del producto. Recibimos Booking y damos seguimiento de carga en Origen, compartiendo al equipo marítimo y aéreo la documentación completa del despacho. Validamos seguimiento al tránsito (marítimo-aéreo).' },
            ]
          },
          {
            label: 'Si viene con Proveedor',
            concurrencia: '2',
            activities: [
              { id: 'tp_1', concurrencia: '2', metodo: 'Manual', identificacion: 'Esperas', seguimiento: 'Monitoreo', actividad: 'Tarifa Proveedor', sistema: 'Correo', modulo: 'Correo', info: 'Solicitamos al proveedor el Booking y documentos originales de la carga. Recibimos Booking y damos seguimiento de carga en Origen.' },
            ]
          }
        ]
      },
      { type: 'activity', id: 't1_09', concurrencia: 'Eventual', metodo: 'Manual', identificacion: 'Esperas', seguimiento: 'Ejecución y Monitoreo', actividad: 'Solicitud de CMP si aplica', sistema: 'Hoja de Ruta', modulo: 'Hoja de Ruta', info: 'El especialista realiza la solicitud de constancia de Materia Prima en hoja de ruta.' },
      { type: 'activity', id: 't1_10',   concurrencia: 'Eventual', metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución',             actividad: 'Cargar la Factura',                              sistema: 'Intransit',    modulo: 'Intransit',    info: 'Ingreso de la Factura en el sistema.' },
      { type: 'activity', id: 't1_11',   concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución',             actividad: 'Creación de Gestión y HR',                       sistema: 'Intransit',    modulo: 'Intransit',    info: 'Creación de la gestión y hoja de ruta en el sistema Intransit.' },
      { type: 'activity', id: 't1_11_1', concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución',             actividad: 'Creación de unidad Motriz',                      sistema: 'Intransit',    modulo: 'Intransit',    info: 'Ingresar la información en sistema de la unidad Motriz.' },
      { type: 'activity', id: 't1_12',   concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución',             actividad: 'Sello de sitio',                                 sistema: 'PC/Intransit', modulo: 'PC/Intransit', info: 'Los especialistas realizan el sello de sitios de origen y la recolecta.' },
      { type: 'activity', id: 't1_13',   concurrencia: 'Siempre',  metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Ejecución',             actividad: 'Envío de avance de aforo',                       sistema: 'Correo',       modulo: 'Correo',       info: 'Se envía el avance de aforo que contiene el cuadro informativo del producto de importación, así como todos sus documentos en adjunto.', highlight: true },
      { type: 'activity', id: 't1_14',   concurrencia: 'Siempre',  metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Ejecución y Monitoreo', actividad: 'Solicitud de carga de documentos',               sistema: 'Correo',       modulo: 'Correo',       info: 'Solicitud de carga de documentos en HR al equipo de digitalización.', highlight: true },
      { type: 'activity', id: 't1_14_1', concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución',             actividad: 'Carga de documentos en HR',                      sistema: 'Correo',       modulo: 'Correo',       info: 'El equipo de digitalización sube el documento en Hoja de Ruta.' },
      { type: 'activity', id: 't1_15',   concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución',             actividad: 'Crear checklist en sistema',                     sistema: 'Hoja de Ruta', modulo: 'Hoja de Ruta', info: 'Crear Checklist de documentos en sistema.' },
      { type: 'activity', id: 't1_15_1', concurrencia: 'Siempre',  metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Ejecución y Monitoreo', actividad: 'Solicitud de permisos Fitosanitario y Zoosanitario', sistema: 'Hoja de Ruta', modulo: 'Hoja de Ruta', info: 'El sistema se realiza desde matriz solo para Dinant.', highlight: true },
      { type: 'activity', id: 't1_16',   concurrencia: 'Siempre',  metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Ejecución',             actividad: 'Revisión de documentos',                         sistema: 'Correo',       modulo: 'Correo',       info: 'Los especialistas de torre revisan documentos sin intervención de UAD.', highlight: true },
      { type: 'activity', id: 't1_17',   concurrencia: 'Siempre',  metodo: 'Manual', identificacion: 'Reprocesos, Esperas', seguimiento: 'Ejecución',            actividad: 'Solicitud cambio en documentación',              sistema: 'Correo',       modulo: 'Correo',       info: 'Los especialistas solicitan al proveedor los cambios necesarios en base al recausa Art. 323 y 324.' },
      {
        type: 'branch',
        id: 'branch_di',
        label: 'Solicitud de DI',
        centerNext: true,
        paths: [
          {
            label: 'Si está certificado',
            concurrencia: '1',
            activities: [
              { id: 'di_1', concurrencia: '1', metodo: 'Manual', identificacion: '',        seguimiento: 'Control',   actividad: 'Si está certificado',   sistema: 'Correo', modulo: 'Correo', info: 'Se solicita a Centralización vía correo.' },
            ]
          },
          {
            label: 'Sino está certificado',
            concurrencia: '2',
            activities: [
              { id: 'di_2', concurrencia: '2', metodo: 'Manual', identificacion: 'Esperas', seguimiento: 'Ejecución', actividad: 'Sino está certificado', sistema: 'HR',     modulo: 'HR',     info: 'Se solicita por el HR para que UAD la llene.' },
            ]
          }
        ]
      },
      { type: 'activity', id: 't1_18', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Esperas', seguimiento: 'Control', actividad: 'Arribo de la unidad', sistema: 'Correo', modulo: 'Correo', info: 'Confirmación de arribo.' },
      {
        type: 'branch',
        id: 'branch_manifiesto',
        label: 'Tipo de embarque — Manifiesto',
        centerCount: 3,
        paths: [
          {
            label: 'Si viene con Vesta',
            concurrencia: '1',
            activities: [
              { id: 'mv_a',  concurrencia: 'A',   metodo: 'Manual', identificacion: 'Reprocesos, Esperas', seguimiento: 'Ejecución',  actividad: 'Solicitud de manifiesto',                      sistema: 'Correo',    modulo: 'Correo',    info: 'Envío de correo a unidad M&A para que se envíe el manifiesto de carga.', highlight: true },
              { id: 'mv_a1', concurrencia: 'A.1', metodo: 'Manual', identificacion: 'Reprocesos, Esperas', seguimiento: 'Monitoreo',  actividad: 'Solicitud de manifiesto (M&A → Naviera)',       sistema: 'Correo',    modulo: 'Correo',    info: 'Solicitud del manifiesto por la unidad M&A con la naviera.', highlight: true },
              { id: 'mv_b',  concurrencia: 'B',   metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución',  actividad: 'Cargar Manifiesto a HR',                        sistema: 'HR',        modulo: 'HR',        info: 'Subir el Manifiesto en Hoja de Ruta.', highlight: true },
              { id: 'mv_c',  concurrencia: 'C',   metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Monitoreo',  actividad: 'Revisión de manifiesto',                        sistema: 'HR Aduana', modulo: 'HR Aduana', info: 'La unidad de aduana hace la revisión del manifiesto, hace observaciones y solicita cambio de la info.', highlight: true },
              { id: 'mv_d',  concurrencia: 'D',   metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Ejecución',  actividad: 'Presentación manifiesto a M&A',                 sistema: 'Correo',    modulo: 'Correo',    info: 'Se envía un correo a la unidad M&A para que proceda con la presentación del manifiesto.', highlight: true },
              { id: 'mv_d1', concurrencia: 'D.1', metodo: 'Manual', identificacion: 'Reprocesos, Esperas', seguimiento: 'Monitoreo', actividad: 'Presentación manifiesto (M&A → Naviera)',       sistema: 'Correo',    modulo: 'Correo',    info: 'M&A le indica a la naviera que proceda con la presentación del manifiesto.', highlight: true },


              { id: 'mv_e',  concurrencia: 'E',   metodo: 'Manual', identificacion: 'Esperas, Reprocesos',                   seguimiento: 'Ejecución',  actividad: 'Confirmación de presentación del manifiesto',   sistema: 'Correo',    modulo: 'Correo',    info: 'Naviera confirma a M&A sobre la presentación del manifiesto.', highlight: true },

              { id: 'mv_e1', concurrencia: 'E.1', metodo: 'Manual', identificacion: '',                   seguimiento: 'Monitoreo',  actividad: 'Confirmación del Manifiesto',      sistema: 'Correo',    modulo: 'Correo',    info: 'M&A nos confirma sobre la presentación del manifiesto.', highlight: true },
            ]
          },
          {
            label: 'Si viene con Proveedor',
            concurrencia: '2',
            activities: [
              { id: 'mp_a', concurrencia: 'A', metodo: 'Manual', identificacion: 'Esperas', seguimiento: 'Monitoreo',  actividad: 'Solicitud de manifiesto',                     sistema: 'Correo',    modulo: 'Correo',    info: 'Envío directo de la solicitud a Navieros.', highlight: true },
              { id: 'mp_b', concurrencia: 'B', metodo: 'Manual', identificacion: '',        seguimiento: 'Ejecución', actividad: 'Cargar Manifiesto a HR',                       sistema: 'HR',        modulo: 'HR',        info: 'Subir el Manifiesto en Hoja de Ruta.', highlight: true },
              { id: 'mp_c', concurrencia: 'C', metodo: 'Manual', identificacion: '',        seguimiento: 'Monitoreo', actividad: 'Revisión de manifiesto',                       sistema: 'HR Aduana', modulo: 'HR Aduana', info: 'La unidad de aduana hace la revisión del manifiesto, hace observaciones y solicita cambio de la info.', highlight: true },
              { id: 'mp_d', concurrencia: 'D', metodo: 'Manual', identificacion: '',        seguimiento: 'Monitoreo', actividad: 'Presentación manifiesto a la naviera',          sistema: 'Correo',    modulo: 'Correo',    info: 'Le indican directamente a la naviera que proceda con la presentación del manifiesto.', highlight: true },
              { id: 'mp_e', concurrencia: 'E', metodo: 'Manual', identificacion: '',        seguimiento: 'Monitoreo', actividad: 'Confirmación de presentación del manifiesto',   sistema: 'Correo',    modulo: 'Correo',    info: 'Naviera confirma la presentación del manifiesto.', highlight: true },
            ]
          }
        ]
      },
      { type: 'activity', id: 't1_19', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Ejecución',  actividad: 'Envío de documentos originales a la aduana',          sistema: 'Correo',      modulo: 'Correo',      info: 'Se envía correo al equipo de digitalización para preparación de documentación de envío.', highlight: true },
      { type: 'activity', id: 't1_20', concurrencia: 'Siempre', metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución',  actividad: 'Solicitud de última milla',                           sistema: 'Ultima Milla', modulo: 'Ultima Milla', info: 'Se realiza solicitud en última milla de la recolecta y entrega de documentos originales a la aduana correspondiente.', highlight: true },
      { type: 'activity', id: 't1_21', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Esperas, Reprocesos', seguimiento: 'Monitoreo',  actividad: 'Seguimiento de entrega de carga y documentación',     sistema: 'Ultima Milla', modulo: 'Ultima Milla', info: 'Seguimiento del estado de entrega de la carga y documentación.', highlight: true },
    ]
  },
  {
    id: 'aduana',
    label: 'Aduana',
    subtitle: 'Proceso Aduanero',
    phase: 4,
    color: 'teal',
    items: [
      { type: 'activity', id: 'ad_1', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Reprocesos, Esperas', seguimiento: 'Ejecución', actividad: 'Solicitud de liquidación',                    sistema: 'Correo',        modulo: 'Correo',        info: 'Se envía a liquidar el equipo de torre con el equipo de centralización: ETA, Manifiesto en plataforma, adjuntando originales, vapor y viaje.', highlight: true },
      { type: 'activity', id: 'ad_2', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Monitoreo', actividad: 'Recepción de correlativo',                   sistema: 'Correo',        modulo: 'Correo',        info: 'El equipo de centralización comparte el correlativo e informa de liquidado el trámite.' },
      { type: 'activity', id: 'ad_3', concurrencia: 'Siempre', metodo: 'Manual', identificacion: '',                   seguimiento: 'Monitoreo', actividad: 'Seguimiento de Selectividad',                sistema: 'Portal cliente', modulo: 'Portal cliente', info: 'Equipo operativo da selectividad y se visualiza en PC por parte de los Especialistas.' },
      { type: 'activity', id: 'ad_4', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Reprocesos, Esperas', seguimiento: 'Ejecución', actividad: 'Llenado de carta de liberación para naviera', sistema: 'Correo',        modulo: 'Correo',        info: 'Llenado de carta liberación de la naviera incluye, N° BL, dirección a entregar, n° contenedor.' },
      { type: 'activity', id: 'ad_5', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Monitoreo', actividad: 'Liberación de Naviera',                      sistema: 'Correo',        modulo: 'Correo',        info: 'Se solicita a la naviera la liberación del contenedor adjuntando documentación requerida incluyendo el levante de la mercancía.' },
      { type: 'activity', id: 'ad_6', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Reprocesos, Doble Digitación, Esperas', seguimiento: 'Monitoreo', actividad: 'Confirmación Cargos adicionales', sistema: 'Correo', modulo: 'Correo', info: 'Confirmar al equipo de Facturación los cargos adicionales para que se proceda a facturar.' },
    ]
  },
  {
    id: 'transporte',
    label: 'Transporte',
    subtitle: 'Coordinación Merchant',
    phase: 5,
    color: 'amber',
    items: [
      { type: 'activity', id: 'tr_1', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Ejecución',             actividad: 'Solicitud del GatePass',                        sistema: 'Correo / WhatsApp',    modulo: 'Correo / WhatsApp',    info: 'Comparte la HR al equipo operativo con el horario solicitado por el cliente.' },
      { type: 'activity', id: 'tr_2', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Ejecución',             actividad: 'Solicitud de movimiento Merchant',              sistema: 'Tracking Terrestre',   modulo: 'Tracking Terrestre',   info: 'El especialista crea la solicitud para la asignación de la unidad.' },
      { type: 'activity', id: 'tr_3', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Esperas, Reprocesos', seguimiento: 'Ejecución y Monitoreo', actividad: 'Correo coordinación Merchant',                  sistema: 'Correo',               modulo: 'Correo',               info: 'Envío de correo con cuadro informativo de la solicitud de la coordinación.', highlight: true },
      { type: 'activity', id: 'tr_4', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Monitoreo',             actividad: 'Sello de salida Aduana',                        sistema: 'PC / Intransit',       modulo: 'PC / Intransit',       info: 'Se realiza el sello de salida aduana destino.' },
      { type: 'activity', id: 'tr_5', concurrencia: 'Siempre', metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución',             actividad: 'Aviso entrega a planta',                        sistema: 'Correo',               modulo: 'Correo',               info: 'Se envía documentación completa y el cuadro resumen de ingreso de la unidad a destino.' },
      { type: 'activity', id: 'tr_6', concurrencia: 'Siempre', metodo: 'Manual', identificacion: 'Esperas, Reprocesos', seguimiento: 'Monitoreo',             actividad: 'Seguimiento de entrega de producto en planta',  sistema: 'Correo / WhatsApp',    modulo: 'Correo / WhatsApp',    info: 'Se consulta el status de las unidades para mantener informadas a las plantas sobre el reporte de la unidad.', highlight: true },
    ]
  },
  {
    id: 'torre2',
    label: 'Torre',
    subtitle: 'Cierre del Embarque',
    phase: 6,
    color: 'purple',
    items: [
      { type: 'activity', id: 't2_1', concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución', actividad: 'Cierre del embarque',                              sistema: 'Correo',                          modulo: 'Correo',                          info: 'Se envía boleta de entrada de vacío a las navieras, para revisar costos fuera de la operación: Demoras, daños, y retornos de garantía.' },
      { type: 'activity', id: 't2_2', concurrencia: 'Eventual', metodo: 'Manual', identificacion: 'Esperas',            seguimiento: 'Ejecución', actividad: 'Disputa de costos',                                 sistema: 'Correo / Sistema externo naviera', modulo: 'Correo / Sistema externo naviera', info: 'Se apertura línea de disputa de los costos que no deben ser cobrados al cliente.' },
      { type: 'activity', id: 't2_3', concurrencia: 'Siempre',  metodo: 'Manual', identificacion: 'Esperas, Reprocesos', seguimiento: 'Ejecución', actividad: 'Verificación de estadias para liquidación Merchant', sistema: 'En Excel',                        modulo: 'En Excel',                        info: 'Se llena el excel para verificación de costos con el equipo terrestre que den el VoBo para la liquidación, se envía a la persona encargada de la liquidación.', highlight: true },
      { type: 'activity', id: 't2_4', concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',                   seguimiento: 'Ejecución', actividad: 'Análisis de resultados',                            sistema: 'Correo',                          modulo: 'Correo',                          info: 'Se informa de los costos que incurre el trámite y se solicita VoBo si aplica. Si se gana una disputa se informa del logro obtenido.' },
    ]
  },
  {
    id: 'ActividadesSiempre',
    label: 'Actividades  del proceso',
    subtitle: 'Actividades durante el proceso',
    phase: 7,
    color: 'orange',
    items: [
      { type: 'activity', id: 'aa_1', concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',           seguimiento: 'Ejecución', actividad: 'Notas de los despachos',       sistema: 'Portal cliente /Intransit', modulo: 'Portal cliente /Intransit', info: 'Notas ingresadas en sistema sobre alguna situación en el despacho.' },
      { type: 'activity', id: 'aa_2', concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',           seguimiento: 'Ejecución', actividad: 'Nota en las gestiones',         sistema: 'Portal cliente /Intransit', modulo: 'Portal cliente /Intransit', info: 'Notas ingresadas en sistema sobre alguna situación en las gestiones.' },
      { type: 'activity', id: 'aa_3', concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',           seguimiento: 'Ejecución', actividad: 'Evento',                        sistema: 'Portal cliente /Intransit', modulo: 'Portal cliente /Intransit', info: 'Ingreso de eventos que afecten el trámite.' },
      { type: 'activity', id: 'aa_4', concurrencia: 'Siempre',  metodo: 'Manual', identificacion: '',           seguimiento: 'Ejecución', actividad: 'Alertas',                       sistema: 'Portal cliente /Intransit', modulo: 'Portal cliente /Intransit', info: 'Ingreso de Alertas que afecten el trámite.' },
      { type: 'activity', id: 'aa_5', concurrencia: 'Eventual', metodo: 'Manual', identificacion: 'Reprocesos', seguimiento: 'Ejecución', actividad: 'Actualización ETA',             sistema: 'Portal cliente /Intransit', modulo: 'Portal cliente /Intransit', info: 'Actualización de ETA para situaciones de cambio en el ETA por Roleos, Atrasos.' },

      { type: 'activity', id: 'aa_6', concurrencia: 'Eventual', metodo: 'Manual', identificacion: 'Reprocesos',           seguimiento: 'Ejecución', actividad: 'Actualizar fecha de despachos', sistema: 'Portal cliente /Intransit', modulo: 'Portal cliente /Intransit', info: 'Actualización de las fechas para situaciones de cambio en el ETA por Roleos, Atrasos.' },
    ]
  },
  {
    id: 'Reporteria',
    label: 'Salida',
    subtitle: 'Control y seguimiento',
    phase: 8,
    color: 'teal',
    items: [
      { type: 'activity', id: 'rep_1', concurrencia: 'Siempre', actividad: 'Control de trámites por especialistas', sistema: 'Drive', modulo: 'Drive', info: 'Llevan control manual el ingreso de la HR y estatus de cómo se encuentra.',  },
      { type: 'activity', id: 'rep_2', concurrencia: 'Siempre', actividad: 'Control programación del cliente', sistema: 'Drive', modulo: 'Drive', info: 'Control de cumplimiento de despachos.' },
      { type: 'activity', id: 'rep_3', concurrencia: 'Siempre', actividad: 'Seguimientos con aduanas y equipos claves', sistema: 'WhatsApp', modulo: 'WhatsApp', info: '52 grupos de control de trámite.' },
      { type: 'activity', id: 'rep_4', concurrencia: 'Siempre', actividad: 'Control de multas', sistema: 'Drive', modulo: 'Drive', info: 'Control de Multas cobradas al cliente, con sus causas.' },
      { type: 'activity', id: 'rep_5', concurrencia: 'Siempre', actividad: 'Control de Demoras', sistema: 'Drive', modulo: 'Drive', info: 'Control de Demora cobradas al cliente, con sus causas.' },
      { type: 'activity', id: 'rep_6', concurrencia: 'Siempre', actividad: 'Control de Códigos Rojos', sistema: 'Drive', modulo: 'Drive', info: 'Control de Códigos Rojos cobrados al cliente, con sus causas.' },
    ]
  },
];
