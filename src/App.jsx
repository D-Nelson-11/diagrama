import { useState, useCallback } from 'react';
import FlowDiagram from './components/FlowDiagram';
import DetailPanel from './components/DetailPanel';

function App() {
  const [selected, setSelected] = useState(null);
  const onSelect = useCallback((item) => setSelected(item), []);

  return (
    <>
      <header>
        <div className="logo">VESTA</div>
        <div className="header-right">
          <span className="header-tag">Flujo operativo · Importaciones</span>
        </div>
      </header>
      <div className="diagram-page">
        <div className="flow-canvas">
          <FlowDiagram onSelect={onSelect} selectedId={selected?.id} />
        </div>
        <div className="side-panel">
          <DetailPanel selected={selected} />
        </div>
      </div>
    </>
  );
}

export default App;
