import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Save, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  ArrowRight,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STATUS_CONFIG } from '../data/defaultCareers';
import { 
  getPrerequisiteDetails, 
  getUnlockedBySubject, 
  isSubjectApproved 
} from '../utils/academicUtils';

export default function SubjectModal({
  subject,
  allSubjects,
  careerYears = 5,
  isOpen,
  onClose,
  onSave,
  onDelete
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    year: 1,
    term: 1,
    credits: 6,
    hours: 80,
    status: 'pendiente',
    grade: '',
    date: '',
    notes: '',
    prerequisites: []
  });

  const [prereqSearch, setPrereqSearch] = useState('');

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name || '',
        code: subject.code || '',
        year: subject.year || 1,
        term: subject.term || 1,
        credits: subject.credits || 6,
        hours: subject.hours || 80,
        status: subject.status || 'pendiente',
        grade: subject.grade !== null && subject.grade !== undefined ? subject.grade : '',
        date: subject.date || '',
        notes: subject.notes || '',
        prerequisites: subject.prerequisites ? [...subject.prerequisites] : []
      });
    } else {
      setFormData({
        name: '',
        code: '',
        year: 1,
        term: 1,
        credits: 6,
        hours: 80,
        status: 'pendiente',
        grade: '',
        date: '',
        notes: '',
        prerequisites: []
      });
    }
  }, [subject]);

  if (!isOpen) return null;

  const isEditing = Boolean(subject && subject.id);

  // Correlativas actuales y su estado
  const currentPrereqDetails = getPrerequisiteDetails(
    { ...subject, prerequisites: formData.prerequisites },
    allSubjects
  );

  // Materias que desbloquea (si es edición)
  const unlockedSubjects = isEditing
    ? getUnlockedBySubject(subject.id, allSubjects)
    : [];

  const handleStatusChange = (newStatus) => {
    setFormData((prev) => {
      const updated = { ...prev, status: newStatus };
      if (!isSubjectApproved(newStatus) && newStatus !== 'desaprobada') {
        // Si ya no está aprobada, limpiar o mantener nota opcional
      }
      return updated;
    });
  };

  const handleTogglePrerequisite = (candidateId) => {
    setFormData((prev) => {
      const exists = prev.prerequisites.includes(candidateId);
      return {
        ...prev,
        prerequisites: exists
          ? prev.prerequisites.filter((id) => id !== candidateId)
          : [...prev.prerequisites, candidateId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const numericGrade = formData.grade !== '' ? Number(formData.grade) : null;
    const isNowPassed = isSubjectApproved(formData.status);
    const wasPassedBefore = subject ? isSubjectApproved(subject.status) : false;

    // Disparar festejo de confetti si aprobó la materia
    if (isNowPassed && !wasPassedBefore) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback silencioso
      }
    }

    onSave({
      ...(subject || {}),
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      year: Number(formData.year),
      term: Number(formData.term),
      credits: Number(formData.credits) || 0,
      hours: Number(formData.hours) || 0,
      status: formData.status,
      grade: numericGrade,
      date: formData.date || null,
      notes: formData.notes.trim(),
      prerequisites: formData.prerequisites
    });
  };

  // Filtrar posibles materias para correlativas (excluyendo a sí misma)
  const candidatePrereqs = allSubjects.filter(
    (s) => !subject || s.id !== subject.id
  ).filter((s) => 
    prereqSearch === '' || 
    s.name.toLowerCase().includes(prereqSearch.toLowerCase()) || 
    (s.code && s.code.toLowerCase().includes(prereqSearch.toLowerCase()))
  );

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content glass-panel">
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {isEditing ? 'Editar Materia' : 'Nueva Materia'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {isEditing ? formData.code || 'Configurar detalles académicos' : 'Agregar asignatura al plan de estudio'}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-icon"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal-body">
            {/* Nombre y Código */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="subject-name-input">Nombre de la Asignatura *</label>
                <input
                  id="subject-name-input"
                  type="text"
                  required
                  placeholder="Ej: Sistemas Operativos"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject-code-input">Código</label>
                <input
                  id="subject-code-input"
                  type="text"
                  placeholder="Ej: CS05"
                  className="form-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
            </div>

            {/* Año, Cuatrimestre, Créditos, Horas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="subject-year-select">Año</label>
                <select
                  id="subject-year-select"
                  className="form-select"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                >
                  {Array.from({ length: careerYears }, (_, i) => i + 1).map((y) => (
                    <option key={y} value={y}>{y}º Año</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject-term-select">Cuatrimestre</label>
                <select
                  id="subject-term-select"
                  className="form-select"
                  value={formData.term}
                  onChange={(e) => setFormData({ ...formData, term: Number(e.target.value) })}
                >
                  <option value={1}>1º Cuatrimestre</option>
                  <option value={2}>2º Cuatrimestre</option>
                  <option value={0}>Anual</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject-credits-input">Créditos</label>
                <input
                  id="subject-credits-input"
                  type="number"
                  min="0"
                  max="50"
                  className="form-input"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject-hours-input">Horas Cátedra</label>
                <input
                  id="subject-hours-input"
                  type="number"
                  min="0"
                  max="400"
                  className="form-input"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                />
              </div>
            </div>

            {/* Selector de Estado */}
            <div className="form-group">
              <label className="form-label">Estado de Cursada</label>
              <div className="status-pill-grid">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                  const isSelected = formData.status === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`status-pill-btn ${isSelected ? 'selected' : ''}`}
                      style={{
                        borderColor: isSelected ? cfg.color : undefined,
                        color: isSelected ? cfg.color : undefined
                      }}
                      onClick={() => handleStatusChange(key)}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: cfg.color
                        }}
                      />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calificación y Fecha */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="subject-grade-input">
                  Calificación (1 - 10)
                </label>
                <input
                  id="subject-grade-input"
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  placeholder="Ej: 8"
                  className="form-input"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject-date-input">
                  Fecha de Aprobación
                </label>
                <input
                  id="subject-date-input"
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {/* Correlatividades Previas */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="form-label">
                  Correlatividades Requeridas ({formData.prerequisites.length})
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Materias necesarias para cursar/rendir
                </span>
              </div>

              <input
                type="text"
                placeholder="Filtrar materias para correlativa..."
                className="form-input"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', marginBottom: '0.5rem' }}
                value={prereqSearch}
                onChange={(e) => setPrereqSearch(e.target.value)}
              />

              <div
                style={{
                  maxHeight: '140px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  background: 'var(--bg-main)'
                }}
              >
                {candidatePrereqs.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                    No se encontraron materias
                  </div>
                ) : (
                  candidatePrereqs.map((candidate) => {
                    const isChecked = formData.prerequisites.includes(candidate.id);
                    return (
                      <label
                        key={candidate.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          background: isChecked ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                          fontSize: '0.8rem',
                          userSelect: 'none'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePrerequisite(candidate.id)}
                          style={{ accentColor: 'var(--accent-primary)' }}
                        />
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                          {candidate.code || '—'}
                        </span>
                        <span style={{ flex: 1, color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {candidate.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: isSubjectApproved(candidate.status) ? '#10b981' : 'var(--text-muted)' }}>
                          {isSubjectApproved(candidate.status) ? '✓ Aprobada' : candidate.status}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Materias que desbloquea (Informativo) */}
            {unlockedSubjects.length > 0 && (
              <div 
                style={{ 
                  background: 'rgba(245, 158, 11, 0.08)', 
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.35rem' }}>
                  Desbloquea las siguientes {unlockedSubjects.length} materias:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {unlockedSubjects.map((s) => (
                    <span 
                      key={s.id} 
                      style={{ 
                        fontSize: '0.72rem', 
                        padding: '0.15rem 0.45rem', 
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notas Personales */}
            <div className="form-group">
              <label className="form-label" htmlFor="subject-notes-textarea">
                Apuntes & Notas del Estudiante
              </label>
              <textarea
                id="subject-notes-textarea"
                rows={2}
                placeholder="Observaciones, bibliografía recomendada, horario de cursada..."
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ color: 'var(--accent-rose)', marginRight: 'auto' }}
                onClick={() => {
                  if (window.confirm(`¿Estás seguro de eliminar "${subject.name}"?`)) {
                    onDelete(subject.id);
                  }
                }}
              >
                <Trash2 size={16} />
                <span>Eliminar</span>
              </button>
            )}

            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" id="btn-guardar-materia" className="btn btn-primary">
              <Save size={16} />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Asignatura'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
