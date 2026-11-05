import React from 'react';
import { 
  GraduationCap, 
  LayoutGrid, 
  BarChart3, 
  CalendarCheck, 
  FileText, 
  Download, 
  Upload, 
  PlusCircle, 
  Moon, 
  Sun,
  Printer
} from 'lucide-react';
import { exportToJson } from '../utils/academicUtils';

export default function Navbar({
  careers,
  currentCareerId,
  onSelectCareer,
  onNewCareer,
  activeView,
  setActiveView,
  theme,
  setTheme,
  onImportClick,
  currentCareer
}) {
  const handleExport = () => {
    if (currentCareer) {
      const filename = `${currentCareer.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_backup.json`;
      exportToJson(currentCareer, filename);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <header className="top-nav glass-panel" role="banner">
      <div className="brand-section">
        <div className="brand-logo" aria-hidden="true">
          <GraduationCap size={26} />
        </div>
        <div>
          <h1 className="brand-title">GraduPath</h1>
          <p className="brand-subtitle">Seguimiento y Malla Curricular Universitaria</p>
        </div>
      </div>

      <nav className="view-tabs" aria-label="Vistas principales">
        <button
          id="tab-malla"
          className={`tab-btn ${activeView === 'malla' ? 'active' : ''}`}
          onClick={() => setActiveView('malla')}
        >
          <LayoutGrid size={16} />
          <span>Malla Curricular</span>
        </button>
        <button
          id="tab-metricas"
          className={`tab-btn ${activeView === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveView('analytics')}
        >
          <BarChart3 size={16} />
          <span>Analítica & Métricas</span>
        </button>
        <button
          id="tab-planificador"
          className={`tab-btn ${activeView === 'planner' ? 'active' : ''}`}
          onClick={() => setActiveView('planner')}
        >
          <CalendarCheck size={16} />
          <span>Planificador Cursada</span>
        </button>
        <button
          id="tab-reporte"
          className={`tab-btn ${activeView === 'transcript' ? 'active' : ''}`}
          onClick={() => setActiveView('transcript')}
        >
          <FileText size={16} />
          <span>Ficha Académica</span>
        </button>
      </nav>

      <div className="nav-actions">
        <div className="career-select-wrapper">
          <select
            id="career-selector"
            className="career-select"
            value={currentCareerId}
            onChange={(e) => onSelectCareer(e.target.value)}
            title="Seleccionar carrera"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          id="btn-nueva-carrera"
          className="btn btn-secondary"
          onClick={onNewCareer}
          title="Crear nueva carrera"
        >
          <PlusCircle size={15} />
          <span>Nueva Carrera</span>
        </button>

        <button
          id="btn-exportar-json"
          className="btn btn-secondary btn-icon"
          onClick={handleExport}
          title="Exportar respaldo JSON"
        >
          <Download size={16} />
        </button>

        <label
          htmlFor="file-import-input"
          className="btn btn-secondary btn-icon"
          title="Importar respaldo JSON"
          style={{ margin: 0, cursor: 'pointer' }}
        >
          <Upload size={16} />
          <input
            id="file-import-input"
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={onImportClick}
          />
        </label>

        <button
          id="btn-imprimir"
          className="btn btn-secondary btn-icon"
          onClick={handlePrint}
          title="Imprimir ficha académica"
        >
          <Printer size={16} />
        </button>

        <button
          id="btn-tema"
          className="btn btn-secondary btn-icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
