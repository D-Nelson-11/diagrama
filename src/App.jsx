import { useState, useCallback, useEffect, useRef } from 'react';
import FlowDiagram from './components/FlowDiagram';
import DetailPanel from './components/DetailPanel';
import TimelinePage from './components/TimelinePage';
import { SECTIONS } from './data/roadmapData';

const SHEETS_API = import.meta.env.VITE_SHEETS_API_URL || '/api/sheets';
const API_KEY_STORAGE = 'flujo-api-key';

// Las tabs se descubren solas: el backend lista las pestañas de los spreadsheets
// permitidos que empiezan con 'Flujo' (GET {SHEETS_API}/tabs) y cada una se vuelve
// una tab de la app. Agregar una pestaña al sheet = tab nueva, sin tocar código.
//
// Personalización opcional por nombre de pestaña (trim aplicado). Defaults:
// label = nombre de la pestaña, base = [], allSnake = true.
const TAB_OVERRIDES = {
  'Flujo de proceso': {
    label: 'Flujo de Torre Marítimo',
    base: SECTIONS,        // incluye las secciones estáticas Entradas/Configuracion
    allSnake: false,       // layout legacy: torre1 snake + columnas verticales
  },
};

// 'Flujo de proceso Terestre' → 'flujo_de_proceso_terestre' (key estable por tab)
const slugify = (s) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

function buildTab({ id, tab }) {
  const o = TAB_OVERRIDES[tab.trim()] || {};
  return {
    key:      slugify(tab),
    label:    o.label ?? tab.trim(),
    base:     o.base ?? [],
    allSnake: o.allSnake ?? true,
    sheetId:  id,
    sheetTab: tab,
  };
}

const AUTO_COLORS = ['blue', 'teal', 'amber', 'purple'];

function mergeSheetData(base, data, allSnake = false) {
  // Formato nuevo: { sections: [{ id, label, items }] }. Formato viejo (workapp): { id: items }
  const sheetSections = Array.isArray(data.sections)
    ? data.sections
    : Object.entries(data).map(([id, items]) => ({ id, label: id, items }));

  const byId = new Map(sheetSections.map(s => [s.id, s]));

  // Secciones definidas en código: conservan metadata y posición, toman items del sheet
  const merged = base.map(sec =>
    byId.has(sec.id) ? { ...sec, items: byId.get(sec.id).items } : sec
  );

  // Secciones nuevas del sheet → se crean automáticamente en el orden del sheet.
  // Si no hay sección serpiente todavía, la primera nueva es el ancla.
  const known = new Set(base.map(s => s.id));
  let hasSnake = merged.some(s => s.layout === 'snake' || s.id === 'torre1');
  for (const s of sheetSections) {
    if (known.has(s.id)) continue;
    merged.push({
      id: s.id,
      label: s.label,
      subtitle: '',
      phase: merged.length + 1,
      color: AUTO_COLORS[merged.length % AUTO_COLORS.length],
      ...(allSnake || !hasSnake ? { layout: 'snake' } : {}),
      items: s.items,
    });
    hasSnake = true;
  }
  return merged;
}

// Página activa según el hash de la URL (#/tiempo → línea de tiempo; lo demás → flujos)
const pageFromHash = () => (window.location.hash === '#/tiempo' ? 'tiempo' : 'flujos');

function App() {
  const [page, setPage]           = useState(pageFromHash);
  const [selected, setSelected]   = useState(null);
  const [tabs, setTabs]           = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [sectionsByTab, setSectionsByTab] = useState({});
  const [syncing, setSyncing]     = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [panelView, setPanelView] = useState('resumen');  // tab del panel lateral
  const [sistemaFilter, setSistemaFilter] = useState(null);  // atenúa actividades de otros sistemas
  const [responsableFilter, setResponsableFilter] = useState(null);  // atenúa actividades de otros responsables
  // Clave de acceso: el backend la exige (x-api-key); se guarda en el navegador
  const [apiKey, setApiKey]     = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState(null);
  const loadedTabs = useRef(new Set());

  // Clave rechazada por el backend → se borra y se vuelve a pedir
  const invalidateKey = useCallback(() => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
    setKeyInput('');
    setKeyError('Clave incorrecta');
  }, []);

  // Al seleccionar una tarjeta, el panel brinca a Detalle (se puede regresar a Resumen)
  const onSelect = useCallback((item) => {
    setSelected(item);
    setPanelView('detalle');
  }, []);

  const handleSync = useCallback(async (tabDef) => {
    setSyncing(true);
    setSyncError(null);
    try {
      const sep   = SHEETS_API.includes('?') ? '&' : '?';
      const query = `id=${encodeURIComponent(tabDef.sheetId)}&tab=${encodeURIComponent(tabDef.sheetTab)}`;
      const res = await fetch(`${SHEETS_API}${sep}${query}`, { headers: { 'x-api-key': apiKey } });
      if (res.status === 401) { invalidateKey(); return; }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSectionsByTab(prev => ({ ...prev, [tabDef.key]: mergeSheetData(tabDef.base, data, tabDef.allSnake) }));
      loadedTabs.current.add(tabDef.key);
    } catch (e) {
      setSyncError(e.message);
    } finally {
      setSyncing(false);
    }
  }, [apiKey, invalidateKey]);

  // Descubrir las tabs desde el backend y cargar la primera
  const loadTabs = useCallback(async () => {
    try {
      const res = await fetch(`${SHEETS_API}/tabs`, { headers: { 'x-api-key': apiKey } });
      if (res.status === 401) { invalidateKey(); return; }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const built = (data.tabs || []).map(buildTab);
      setSyncError(null);
      setTabs(built);
      setSectionsByTab(Object.fromEntries(built.map(t => [t.key, t.base])));
      if (built.length) {
        setActiveTab(built[0].key);
        handleSync(built[0]);
      }
    } catch (e) {
      setSyncError(e.message);
    }
  }, [handleSync, apiKey, invalidateKey]);

  const switchTab = useCallback((tabDef) => {
    if (tabDef.key === activeTab) return;
    setActiveTab(tabDef.key);
    setSelected(null);
    setPanelView('resumen');
    setSistemaFilter(null);
    setResponsableFilter(null);
    setSyncError(null);
    if (!loadedTabs.current.has(tabDef.key)) handleSync(tabDef);
  }, [activeTab, handleSync]);

  // Descubrimiento inicial de tabs (fetch legítimo en mount; la regla marca el setState síncrono interno)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (apiKey) loadTabs(); }, [apiKey, loadTabs]);

  // Navegación entre páginas vía hash (funciona en GitHub Pages sin router)
  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const activeDef = tabs.find(t => t.key === activeTab);

  // ── Página de línea de tiempo (datos estáticos, no requiere clave) ──
  if (page === 'tiempo') return <TimelinePage />;

  // ── Pantalla de clave de acceso ──
  if (!apiKey) {
    const submitKey = (e) => {
      e.preventDefault();
      const v = keyInput.trim();
      if (!v) return;
      localStorage.setItem(API_KEY_STORAGE, v);
      setKeyError(null);
      setApiKey(v);
    };
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form
          onSubmit={submitKey}
          style={{ background: 'white', border: '1px solid #e2e5ec', borderRadius: 12, padding: '28px 32px', width: 320, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', textAlign: 'center' }}
        >
          <div className="logo" style={{ marginBottom: 6 }}>VESTA</div>
          <div style={{ fontSize: 12, color: '#8b92a5', marginBottom: 16 }}>
            Ingrese la clave de acceso para ver los flujos
          </div>
          <input
            type="text"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            placeholder="Clave de acceso"
            autoFocus
            style={{ width: '100%', padding: '8px 10px', fontSize: 13, border: '1px solid #d6dae3', borderRadius: 6, outline: 'none', fontFamily: 'inherit' }}
          />
          {keyError && <div style={{ color: '#b91c1c', fontSize: 11, marginTop: 8 }}>{keyError}</div>}
          <button
            type="submit"
            style={{ width: '100%', marginTop: 12, padding: '8px 0', fontSize: 13, fontWeight: 600, color: 'white', background: '#1a1e2e', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <header>
        <div className="logo">VESTA</div>
        <div className="flow-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`flow-tab${t.key === activeTab ? ' active' : ''}`}
              onClick={() => switchTab(t)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="header-right">
          <button
            className="sync-btn"
            onClick={() => { window.location.hash = '#/tiempo'; }}
            title="Línea de tiempo del proceso"
          >
            ◷ Línea de tiempo
          </button>
          <span className="header-tag">Flujo operativo · Importaciones</span>
          <button
            className="sync-btn"
            onClick={() => (activeDef ? handleSync(activeDef) : loadTabs())}
            disabled={syncing}
            title={syncError ? `Error: ${syncError}` : 'Sincronizar con Google Sheets'}
          >
            {syncing ? 'Sincronizando…' : syncError ? '⚠ Reintentar' : '↻ Sincronizar'}
          </button>
        </div>
      </header>
      <div className="diagram-page">
        <div className="flow-canvas">
          {activeDef && (
            <FlowDiagram
              key={activeTab}
              tab={activeTab}
              onSelect={onSelect}
              selectedId={selected?.id}
              sections={sectionsByTab[activeTab] ?? activeDef.base}
              sistemaFilter={sistemaFilter}
              responsableFilter={responsableFilter}
            />
          )}
        </div>
        <div className="side-panel">
          <DetailPanel
            selected={selected}
            sections={activeDef ? (sectionsByTab[activeTab] ?? activeDef.base) : []}
            view={panelView}
            onViewChange={setPanelView}
            sistemaFilter={sistemaFilter}
            onSistemaFilter={setSistemaFilter}
            responsableFilter={responsableFilter}
            onResponsableFilter={setResponsableFilter}
          />
        </div>
      </div>
    </>
  );
}

export default App;
