import React, { useState, useMemo } from 'react';
import { 
  CalendarCheck, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  Sparkles, 
  HelpCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  isSubjectApproved, 
  isSubjectAvailable, 
  getPrerequisiteDetails 
} from '../utils/academicUtils';

export default function SemesterPlanner({
  career,
  onBatchUpdateStatus
}) {
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [showBlocked, setShowBlocked] = useState(false);

  const subjects = career?.subjects || [];

  // Materias disponibles para cursar (prerrequisitos cumplidos y no aprobadas)
  const availableSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const isPassed = isSubjectApproved(s.status);
      const isCurrent = s.status === 'cursando';
      return !isPassed && !isCurrent && isSubjectAvailable(s, subjects);
    });
  }, [subjects]);

  // Materias bloqueadas por correlativas pendientes
  const blockedSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const isPassed = isSubjectApproved(s.status);
      const isCurrent = s.status === 'cursando';
      return !isPassed && !isCurrent && !isSubjectAvailable(s, subjects);
    });
  }, [subjects]);

  // Materias en la canasta del cuatrimestre seleccionado
  const plannedSubjects = useMemo(() => {
    return subjects.filter((s) => selectedSubjectIds.includes(s.id));
  }, [subjects, selectedSubjectIds]);

  // Métricas de carga horaria y créditos
  const totalPlannedHours = plannedSubjects.reduce((acc, s) => acc + (Number(s.hours) || 80), 0);
  const totalPlannedCredits = plannedSubjects.reduce((acc, s) => acc + (Number(s.credits) || 6), 0);
  const weeklyHoursEst = Math.round(totalPlannedHours / 16); // 16 semanas por cuatrimestre típico

  const handleTogglePlan = (id) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleConfirmEnrollment = () => {
    if (selectedSubjectIds.length === 0) return;

    if (
      window.confirm(
        `¿Deseas marcar ${selectedSubjectIds.length} materias como "Cursando" en tu malla curricular?`
      )
    ) {
      onBatchUpdateStatus(selectedSubjectIds, 'cursando');
      setSelectedSubjectIds([]);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }
  };

  // Nivel de exigencia
  let workloadBadge = { label: 'Carga Liviana', color: '#10b981', tip: 'Ideal si trabajas full-time' };
  if (weeklyHoursEst > 24) {
    workloadBadge = { label: 'Carga Exigente', color: '#f43f5e', tip: 'Requiere dedicación casi exclusiva' };
  } else if (weeklyHoursEst >= 16) {
    workloadBadge = { label: 'Carga Equilibrada', color: '#38bdf8', tip: 'Ritmo universitario estándar' };
  }

  return (
    <div className="planner-view">
      {/* Intro Banner */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.25rem 1.5rem', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarCheck size={22} color="var(--accent-primary)" />
            <span>Simulador de Inscripción de Cuatrimestre</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Selecciona las asignaturas que deseas cursar el próximo período según tus correlativas aprobadas.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔓 {availableSubjects.length} materias habilitadas para cursar
          </span>
        </div>
      </div>

      <div className="planner-grid">
        {/* Columna Izquierda: Materias Habilitadas */}
        <div className="glass-panel planner-pool">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Materias Habilitadas</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Cumplen todas las correlativas requeridas
              </p>
            </div>
            <span 
              style={{ 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                padding: '0.2rem 0.6rem', 
                borderRadius: 'var(--radius-full)', 
                background: 'rgba(56, 189, 248, 0.15)', 
                color: '#38bdf8' 
              }}
            >
              {availableSubjects.length} Disponibles
            </span>
          </div>

          {availableSubjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Sparkles size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
              <p>¡No tienes materias disponibles pendientes!</p>
              <p style={{ fontSize: '0.75rem' }}>Revisa materias en curso o rinde finales pendientes.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {availableSubjects.map((s) => {
                const isSelected = selectedSubjectIds.includes(s.id);
                return (
                  <div 
                    key={s.id} 
                    className="planner-item interactive-card"
                    style={{
                      borderColor: isSelected ? 'var(--accent-primary)' : undefined,
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : undefined
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span className="code-pill">{s.code || 'MAT'}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {s.year}º Año • {s.term === 1 ? '1º Cuat.' : s.term === 2 ? '2º Cuat.' : 'Anual'}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {s.credits || 6} créditos • {s.hours || 80} hs cuatrimestrales
                      </div>
                    </div>

                    <button
                      className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', flexShrink: 0 }}
                      onClick={() => handleTogglePlan(s.id)}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 size={14} color="#10b981" />
                          <span>Agregada</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Agregar</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Toggle para ver materias bloqueadas */}
          {blockedSubjects.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'space-between' }}
                onClick={() => setShowBlocked(!showBlocked)}
              >
                <span>🔒 Ver {blockedSubjects.length} materias bloqueadas</span>
                <span>{showBlocked ? '▲ Ocultar' : '▼ Mostrar'}</span>
              </button>

              {showBlocked && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {blockedSubjects.map((s) => {
                    const prereqDetails = getPrerequisiteDetails(s, subjects);
                    const missing = prereqDetails.filter((p) => !p.isMet);

                    return (
                      <div 
                        key={s.id} 
                        style={{ 
                          padding: '0.65rem 0.85rem', 
                          borderRadius: 'var(--radius-sm)', 
                          background: 'rgba(0,0,0,0.2)',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600 }}>{s.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{s.year}º Año</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', marginTop: '0.25rem' }}>
                          Falta: {missing.map((m) => m.name).join(', ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columna Derecha: Canasta del Cuatrimestre */}
        <div className="glass-panel planner-basket" style={{ borderTop: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Mi Cuatrimestre Simulado</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Plan de cursada proyectado
              </p>
            </div>

            <div 
              style={{ 
                padding: '0.25rem 0.65rem', 
                borderRadius: 'var(--radius-full)', 
                background: `${workloadBadge.color}22`,
                color: workloadBadge.color,
                fontSize: '0.75rem',
                fontWeight: 700,
                border: `1px solid ${workloadBadge.color}44`
              }}
              title={workloadBadge.tip}
            >
              {workloadBadge.label}
            </div>
          </div>

          {/* Resumen de Carga */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '0.75rem', 
              background: 'var(--bg-main)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MATERIAS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {plannedSubjects.length}
              </div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>HS SEMANALES</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                ~{weeklyHoursEst} hs
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CRÉDITOS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {totalPlannedCredits}
              </div>
            </div>
          </div>

          {/* Lista de Seleccionadas */}
          {plannedSubjects.length === 0 ? (
            <div 
              style={{ 
                border: '2px dashed var(--border-subtle)', 
                borderRadius: 'var(--radius-md)', 
                padding: '3rem 1.5rem', 
                textAlign: 'center', 
                color: 'var(--text-muted)' 
              }}
            >
              <CalendarCheck size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
              <p style={{ fontWeight: 600 }}>Tu canasta está vacía</p>
              <p style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                Haz clic en "+ Agregar" en las materias disponibles a la izquierda para armar tu plan.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {plannedSubjects.map((s) => (
                <div 
                  key={s.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.9rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {s.credits || 6} créditos • {s.hours || 80} hs totales
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary btn-icon"
                    style={{ width: 32, height: 32, color: 'var(--accent-rose)' }}
                    onClick={() => handleTogglePlan(s.id)}
                    title="Quitar del plan"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  id="btn-confirmar-inscripcion"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                  onClick={handleConfirmEnrollment}
                >
                  <Sparkles size={18} />
                  <span>Confirmar Inscripción ({plannedSubjects.length} Materias)</span>
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Pasará automáticamente el estado de estas materias a "Cursando".
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
