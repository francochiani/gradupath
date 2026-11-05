import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  Search, 
  CheckCircle, 
  Download, 
  Filter,
  GraduationCap
} from 'lucide-react';
import { STATUS_CONFIG } from '../data/defaultCareers';
import { isSubjectApproved } from '../utils/academicUtils';

export default function AcademicTranscript({
  career,
  stats,
  onSelectSubject
}) {
  const [filterStatus, setFilterStatus] = useState('todos');
  const [query, setQuery] = useState('');

  const subjects = career?.subjects || [];

  const filtered = subjects.filter((s) => {
    const matchesQuery = 
      query === '' ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(query.toLowerCase()));
    
    if (!matchesQuery) return false;
    if (filterStatus === 'todos') return true;
    if (filterStatus === 'aprobadas') return isSubjectApproved(s.status);
    return s.status === filterStatus;
  });

  // Ordenar por Año ascendente y Cuatrimestre ascendente
  const sorted = [...filtered].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return (a.term || 0) - (b.term || 0);
  });

  return (
    <div className="transcript-view">
      {/* Encabezado formal de la Ficha */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '2rem', 
          marginBottom: '2rem',
          borderTop: '5px solid var(--accent-primary)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              <GraduationCap size={28} />
              <span style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ficha Académica y Analítico de Cursada
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.2rem 0' }}>
              {career?.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {career?.university || 'Universidad'} • {career?.degree || 'Grado Universitario'}
            </p>
          </div>

          <div className="no-print" style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              id="btn-imprimir-transcript"
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              <Printer size={16} />
              <span>Imprimir / Descargar PDF</span>
            </button>
          </div>
        </div>

        {/* Datos Resumen del Estudiante */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '1.25rem', 
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              PROMEDIO SIN APLAZOS
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>
              {stats.gpaWithoutFails}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              PROMEDIO CON APLAZOS
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {stats.gpaWithFails}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              MATERIAS APROBADAS
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              {stats.totalPassed} / {stats.total} ({stats.percentage}%)
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              CRÉDITOS ACUMULADOS
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#06b6d4' }}>
              {stats.earnedCredits} / {stats.totalCredits}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              FECHA DE EMISIÓN
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de la tabla (solo en pantalla, oculto en impresión) */}
      <div className="no-print glass-panel" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.8rem', color: 'var(--text-muted)' }} />
          <input
            id="filter-transcript-input"
            type="text"
            placeholder="Filtrar por nombre o código en el listado..."
            className="search-input"
            style={{ width: '100%' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          id="status-transcript-select"
          className="form-select"
          style={{ width: 'auto' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="todos">Todos los Estados</option>
          <option value="aprobadas">Solo Aprobadas / Promocionadas</option>
          <option value="cursando">En Cursada</option>
          <option value="regular">Regularizadas</option>
          <option value="pendiente">Pendientes</option>
          <option value="desaprobada">Desaprobadas</option>
        </select>
      </div>

      {/* Tabla de Asignaturas */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0.5rem' }}>
        <table 
          style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            textAlign: 'left',
            fontSize: '0.85rem'
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>AÑO / CUAT.</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>CÓDIGO</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>ASIGNATURA</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>CRÉD.</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>ESTADO</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>NOTA</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>FECHA</th>
              <th className="no-print" style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700 }}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.pendiente;
              const isPassed = isSubjectApproved(s.status);

              return (
                <tr 
                  key={s.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {s.year}º - {s.term === 1 ? '1C' : s.term === 2 ? '2C' : 'Anual'}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="code-pill">{s.code || '—'}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                    {s.name}
                    {s.notes && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '0.15rem' }}>
                        {s.notes}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                    {s.credits || 6}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      className="status-badge"
                      style={{
                        background: cfg.badgeBg,
                        borderColor: cfg.badgeBorder,
                        color: cfg.textColor
                      }}
                    >
                      {cfg.label}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {s.grade !== null && s.grade !== undefined && s.grade > 0 ? (
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontWeight: 700, 
                          color: isPassed ? '#10b981' : 'var(--accent-rose)',
                          fontSize: '0.95rem' 
                        }}
                      >
                        {s.grade}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {s.date || '—'}
                  </td>
                  <td className="no-print" style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => onSelectSubject(s)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No se encontraron materias con el filtro aplicado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
