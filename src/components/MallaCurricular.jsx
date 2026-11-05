import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  HelpCircle, 
  Check, 
  Lock, 
  Unlock, 
  ArrowRight,
  Info
} from 'lucide-react';
import { STATUS_CONFIG } from '../data/defaultCareers';
import { 
  isSubjectApproved, 
  isSubjectAvailable, 
  getUnlockedBySubject 
} from '../utils/academicUtils';

export default function MallaCurricular({
  career,
  onSelectSubject,
  onNewSubject
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [inspectedSubjectId, setInspectedSubjectId] = useState(null);

  const subjects = career?.subjects || [];

  // Correlativas inspeccionadas
  const inspectedData = useMemo(() => {
    if (!inspectedSubjectId) return null;
    const target = subjects.find((s) => s.id === inspectedSubjectId);
    if (!target) return null;

    const prereqIds = new Set(target.prerequisites || []);
    const unlockedSubjects = getUnlockedBySubject(target.id, subjects);
    const unlockedIds = new Set(unlockedSubjects.map((s) => s.id));

    return {
      targetId: target.id,
      targetName: target.name,
      prereqIds,
      unlockedIds
    };
  }, [inspectedSubjectId, subjects]);

  // Filtrado de materias
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subj) => {
      // Búsqueda por texto
      const matchesSearch =
        searchTerm === '' ||
        subj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subj.code && subj.code.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Filtro por estado
      if (statusFilter === 'todos') return true;
      if (statusFilter === 'disponibles') {
        return isSubjectAvailable(subj, subjects);
      }
      if (statusFilter === 'aprobadas') {
        return isSubjectApproved(subj.status);
      }
      return subj.status === statusFilter;
    });
  }, [subjects, searchTerm, statusFilter]);

  // Agrupación por Año y Cuatrimestre
  const yearGroups = useMemo(() => {
    const totalYears = career?.years || 5;
    const groups = [];

    for (let y = 1; y <= totalYears; y++) {
      const yearSubjects = filteredSubjects.filter((s) => Number(s.year) === y);
      const term1 = yearSubjects.filter((s) => Number(s.term) === 1);
      const term2 = yearSubjects.filter((s) => Number(s.term) === 2);
      const annual = yearSubjects.filter((s) => !s.term || Number(s.term) === 0);

      groups.push({
        year: y,
        term1,
        term2,
        annual,
        totalSubjects: yearSubjects.length
      });
    }

    return groups;
  }, [filteredSubjects, career?.years]);

  return (
    <div className="malla-view">
      {/* Barra de herramientas y filtros */}
      <div className="malla-header-bar glass-panel" style={{ padding: '1rem 1.25rem' }}>
        <div className="filter-group">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '0.8rem', color: 'var(--text-muted)' }} 
            />
            <input
              id="search-malla-input"
              type="text"
              placeholder="Buscar materia o código..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-legend">
            <button
              className={`legend-badge ${statusFilter === 'todos' ? 'active' : ''}`}
              style={{
                background: statusFilter === 'todos' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: statusFilter === 'todos' ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}
              onClick={() => setStatusFilter('todos')}
            >
              Todas
            </button>

            <button
              className={`legend-badge ${statusFilter === 'disponibles' ? 'active' : ''}`}
              style={{
                background: statusFilter === 'disponibles' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.06)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)'
              }}
              onClick={() => setStatusFilter(statusFilter === 'disponibles' ? 'todos' : 'disponibles')}
            >
              <Unlock size={11} />
              <span>Habilitadas hoy</span>
            </button>

            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const isSelected = statusFilter === key;
              return (
                <button
                  key={key}
                  className="legend-badge"
                  style={{
                    background: isSelected ? cfg.color : cfg.badgeBg,
                    color: isSelected ? '#ffffff' : cfg.textColor,
                    border: `1px solid ${cfg.badgeBorder}`
                  }}
                  onClick={() => setStatusFilter(isSelected ? 'todos' : key)}
                >
                  <span className="legend-dot" style={{ background: isSelected ? '#fff' : cfg.color }} />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          id="btn-agregar-materia"
          className="btn btn-primary"
          onClick={onNewSubject}
        >
          <Plus size={16} />
          <span>Agregar Materia</span>
        </button>
      </div>

      {/* Banner de ayuda contextual cuando se inspecciona una materia */}
      {inspectedData && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '0.75rem 1.25rem', 
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderLeft: '4px solid var(--accent-primary)',
            background: 'rgba(99, 102, 241, 0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
            <Info size={18} color="var(--accent-primary)" />
            <span>
              Inspeccionando correlativas de: <strong>{inspectedData.targetName}</strong>
            </span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, marginLeft: '0.5rem' }}>
              ● Requisitos previos ({inspectedData.prereqIds.size})
            </span>
            <span style={{ color: 'var(--accent-amber)', fontWeight: 600, marginLeft: '0.5rem' }}>
              ● Materias que desbloquea ({inspectedData.unlockedIds.size})
            </span>
          </div>

          <button
            className="btn btn-secondary"
            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
            onClick={() => setInspectedSubjectId(null)}
          >
            Limpiar selección
          </button>
        </div>
      )}

      {/* Columnas por año */}
      <div className="years-columns-container">
        {yearGroups.map((group) => (
          <div key={group.year} className="year-column">
            <div className="year-header">
              <div className="year-title">
                <span>{group.year}º Año</span>
              </div>
              <span className="year-badge">
                {group.totalSubjects} {group.totalSubjects === 1 ? 'materia' : 'materias'}
              </span>
            </div>

            {/* 1º Cuatrimestre */}
            {group.term1.length > 0 && (
              <div className="term-section">
                <div className="term-title">1º Cuatrimestre</div>
                <div className="subjects-list">
                  {group.term1.map((subj) => (
                    <SubjectCard
                      key={subj.id}
                      subject={subj}
                      allSubjects={subjects}
                      inspectedData={inspectedData}
                      onInspect={(id) => setInspectedSubjectId(id === inspectedSubjectId ? null : id)}
                      onClick={() => onSelectSubject(subj)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2º Cuatrimestre */}
            {group.term2.length > 0 && (
              <div className="term-section">
                <div className="term-title">2º Cuatrimestre</div>
                <div className="subjects-list">
                  {group.term2.map((subj) => (
                    <SubjectCard
                      key={subj.id}
                      subject={subj}
                      allSubjects={subjects}
                      inspectedData={inspectedData}
                      onInspect={(id) => setInspectedSubjectId(id === inspectedSubjectId ? null : id)}
                      onClick={() => onSelectSubject(subj)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Anuales */}
            {group.annual.length > 0 && (
              <div className="term-section">
                <div className="term-title">Anual</div>
                <div className="subjects-list">
                  {group.annual.map((subj) => (
                    <SubjectCard
                      key={subj.id}
                      subject={subj}
                      allSubjects={subjects}
                      inspectedData={inspectedData}
                      onInspect={(id) => setInspectedSubjectId(id === inspectedSubjectId ? null : id)}
                      onClick={() => onSelectSubject(subj)}
                    />
                  ))}
                </div>
              </div>
            )}

            {group.totalSubjects === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Sin materias con el filtro aplicado
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
  allSubjects,
  inspectedData,
  onInspect,
  onClick
}) {
  const statusCfg = STATUS_CONFIG[subject.status] || STATUS_CONFIG.pendiente;
  const isApproved = isSubjectApproved(subject.status);
  const isAvailable = isSubjectAvailable(subject, allSubjects);
  const prereqCount = subject.prerequisites ? subject.prerequisites.length : 0;

  // Clases dinámicas según inspección de correlativas
  let inspectClass = '';
  let badgeHighlight = null;

  if (inspectedData) {
    if (inspectedData.targetId === subject.id) {
      inspectClass = 'is-active-inspect';
    } else if (inspectedData.prereqIds.has(subject.id)) {
      inspectClass = 'is-prerequisite';
      badgeHighlight = 'Requisito de cursada';
    } else if (inspectedData.unlockedIds.has(subject.id)) {
      inspectClass = 'is-unlocked-by';
      badgeHighlight = 'Habilitada por esta';
    } else {
      inspectClass = 'is-dimmed';
    }
  }

  return (
    <article
      id={`subject-card-${subject.id}`}
      className={`subject-card ${inspectClass}`}
      onClick={onClick}
      onMouseEnter={() => {
        // En desktop, activa la inspección al pasar el mouse para una experiencia ultra interactiva
        if (!inspectedData) onInspect(subject.id);
      }}
      onMouseLeave={() => {
        if (inspectedData && inspectedData.targetId === subject.id) {
          onInspect(null);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${subject.name}, estado: ${statusCfg.label}`}
    >
      <div className="card-top">
        <span className="code-pill">{subject.code || 'MAT'}</span>

        <span
          className="status-badge"
          style={{
            background: statusCfg.badgeBg,
            borderColor: statusCfg.badgeBorder,
            color: statusCfg.textColor
          }}
        >
          {statusCfg.label}
        </span>
      </div>

      <h3 className="subject-name">{subject.name}</h3>

      {badgeHighlight && (
        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: inspectClass === 'is-prerequisite' ? 'var(--accent-cyan)' : 'var(--accent-amber)',
            marginBottom: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <ArrowRight size={12} />
          <span>{badgeHighlight}</span>
        </div>
      )}

      <div className="card-bottom">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span>{subject.credits || 6} créditos</span>
          {subject.hours && <span>• {subject.hours} hs</span>}
        </div>

        {subject.grade !== null && subject.grade !== undefined && subject.grade > 0 ? (
          <div className="grade-badge" title="Calificación final">
            {subject.grade}
          </div>
        ) : (
          <div className="prereq-indicator" style={{ color: isAvailable ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
            {isApproved ? (
              <Check size={14} color="#10b981" />
            ) : isAvailable ? (
              <>
                <Unlock size={12} />
                <span>Disponible</span>
              </>
            ) : prereqCount > 0 ? (
              <>
                <Lock size={12} />
                <span>{prereqCount} correlat.</span>
              </>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}
