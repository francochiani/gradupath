import React, { useState } from 'react';
import { X, Plus, GraduationCap, Copy, BookOpen } from 'lucide-react';

export default function CareerModal({
  isOpen,
  onClose,
  onCreateCareer,
  defaultTemplates = []
}) {
  const [mode, setMode] = useState('template'); // 'template' | 'custom'
  const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplates[0]?.id || '');

  const [formData, setFormData] = useState({
    name: '',
    university: '',
    degree: 'Grado (5 Años)',
    years: 5,
    totalCredits: 240,
    minGradeToPass: 4,
    promotionGrade: 7
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'template') {
      const template = defaultTemplates.find((t) => t.id === selectedTemplateId);
      if (!template) return;

      const newId = `carrera-${Date.now()}`;
      const clonedCareer = {
        ...template,
        id: newId,
        name: `${template.name} (Copia)`,
        // Clonar materias profundamente
        subjects: template.subjects.map((s) => ({
          ...s,
          id: `${s.id}-${Date.now().toString().slice(-4)}`
        }))
      };

      onCreateCareer(clonedCareer);
      onClose();
    } else {
      if (!formData.name.trim()) return;

      const newCareer = {
        id: `carrera-${Date.now()}`,
        name: formData.name.trim(),
        university: formData.university.trim() || 'Mi Universidad',
        degree: formData.degree.trim() || 'Grado',
        years: Number(formData.years) || 5,
        totalCredits: Number(formData.totalCredits) || 200,
        minGradeToPass: Number(formData.minGradeToPass) || 4,
        promotionGrade: Number(formData.promotionGrade) || 7,
        subjects: []
      };

      onCreateCareer(newCareer);
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content glass-panel" style={{ maxWidth: '520px' }}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <GraduationCap size={22} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Gestionar / Crear Carrera</h2>
            </div>
            <button type="button" className="btn btn-secondary btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="modal-body">
            {/* Selector de Modo */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
              <button
                type="button"
                className={`btn ${mode === 'template' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                onClick={() => setMode('template')}
              >
                Plantilla Predefinida
              </button>
              <button
                type="button"
                className={`btn ${mode === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, fontSize: '0.8rem', padding: '0.5rem' }}
                onClick={() => setMode('custom')}
              >
                Crear desde Cero
              </button>
            </div>

            {mode === 'template' ? (
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">Seleccionar Plantilla con Malla Completa</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.35rem' }}>
                  {defaultTemplates.map((tpl) => (
                    <label
                      key={tpl.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: selectedTemplateId === tpl.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                        background: selectedTemplateId === tpl.id ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-main)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                          type="radio"
                          name="templateSelect"
                          checked={selectedTemplateId === tpl.id}
                          onChange={() => setSelectedTemplateId(tpl.id)}
                          style={{ accentColor: 'var(--accent-primary)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{tpl.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {tpl.subjects.length} materias • {tpl.years} años • {tpl.university}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="new-career-name">Nombre de la Carrera *</label>
                  <input
                    id="new-career-name"
                    type="text"
                    required
                    placeholder="Ej: Licenciatura en Biotecnología"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="new-career-uni">Universidad / Institución</label>
                  <input
                    id="new-career-uni"
                    type="text"
                    placeholder="Ej: UBA / UTN / UNAM"
                    className="form-input"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-career-years">Años de Duración</label>
                    <select
                      id="new-career-years"
                      className="form-select"
                      value={formData.years}
                      onChange={(e) => setFormData({ ...formData, years: Number(e.target.value) })}
                    >
                      {[2, 3, 4, 5, 6].map((y) => (
                        <option key={y} value={y}>{y} Años</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="new-career-credits">Créditos Totales</label>
                    <input
                      id="new-career-credits"
                      type="number"
                      className="form-input"
                      value={formData.totalCredits}
                      onChange={(e) => setFormData({ ...formData, totalCredits: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-career-min-pass">Nota Mínima Aprobación</label>
                    <input
                      id="new-career-min-pass"
                      type="number"
                      min="1"
                      max="10"
                      className="form-input"
                      value={formData.minGradeToPass}
                      onChange={(e) => setFormData({ ...formData, minGradeToPass: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="new-career-promo">Nota para Promoción</label>
                    <input
                      id="new-career-promo"
                      type="number"
                      min="1"
                      max="10"
                      className="form-input"
                      value={formData.promotionGrade}
                      onChange={(e) => setFormData({ ...formData, promotionGrade: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" id="btn-crear-carrera-submit" className="btn btn-primary">
              <Plus size={16} />
              <span>{mode === 'template' ? 'Cargar Plantilla' : 'Crear Plan de Estudio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
