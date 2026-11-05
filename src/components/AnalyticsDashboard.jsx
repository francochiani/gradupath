import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Award, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';
import { STATUS_CONFIG } from '../data/defaultCareers';

export default function AnalyticsDashboard({ stats, career }) {
  // Encontrar el valor máximo para normalizar las barras del histograma
  const gradeCounts = Object.values(stats.gradeDistribution || {});
  const maxGradeCount = Math.max(...gradeCounts, 1);

  // Estimación de tiempo restante (asumiendo ritmo estándar de 4-6 materias por año)
  const remainingSubjects = stats.total - stats.totalPassed;
  const estimatedSemestersLeft = Math.ceil(remainingSubjects / 3);

  // Eficiencia académica
  const totalAttempted = stats.totalPassed + stats.regular + stats.disapproved;
  const efficiency = totalAttempted > 0 
    ? Math.round((stats.totalPassed / totalAttempted) * 100) 
    : 100;

  return (
    <div className="analytics-view">
      {/* Tarjetas de Proyección & Ritmo */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.5rem', 
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          borderLeft: '4px solid var(--accent-emerald)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Tiempo Estimado
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              ~{estimatedSemestersLeft} cuatrimestres
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Restan {remainingSubjects} asignaturas
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8'
            }}
          >
            <Flame size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Efectividad Académica
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {efficiency}% de éxito
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {stats.promoted} promocionadas directamente
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}
          >
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Carga Horaria
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {stats.earnedHours} / {stats.totalHours} hs
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {stats.creditsPercentage}% completado en horas
            </div>
          </div>
        </div>
      </div>

      {/* Grid con Gráfico de Calificaciones y Avance por Año */}
      <div className="charts-grid">
        {/* Distribución de Calificaciones (Histograma 1-10) */}
        <div className="glass-panel chart-panel">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Distribución de Notas Obtenidas</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Frecuencia de calificaciones (1 a 10)
              </p>
            </div>
            <span 
              style={{ 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.8rem', 
                background: 'rgba(255,255,255,0.06)', 
                padding: '0.2rem 0.5rem', 
                borderRadius: 'var(--radius-sm)' 
              }}
            >
              Promedio: {stats.gpaWithoutFails}
            </span>
          </div>

          <div className="grades-chart-container">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((note) => {
              const count = stats.gradeDistribution[note] || 0;
              const heightPercent = maxGradeCount > 0 ? (count / maxGradeCount) * 100 : 0;
              const isPassing = note >= (career?.minGradeToPass || 4);

              return (
                <div key={note} className="grade-bar-wrapper">
                  <span className="grade-bar-count">
                    {count > 0 ? count : ''}
                  </span>
                  <div
                    className="grade-bar"
                    style={{
                      height: `${Math.max(heightPercent, 4)}%`,
                      background: isPassing
                        ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(180deg, #f43f5e 0%, #e11d48 100%)'
                    }}
                    title={`Nota ${note}: ${count} ${count === 1 ? 'materia' : 'materias'}`}
                  />
                  <span 
                    className="grade-bar-label"
                    style={{ color: isPassing ? 'var(--text-primary)' : 'var(--accent-rose)' }}
                  >
                    {note}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Aplazos (&lt; {career?.minGradeToPass || 4})</span>
            <span>Aprobadas ({career?.minGradeToPass || 4} - 6)</span>
            <span>Sobresalientes (7 - 10)</span>
          </div>
        </div>

        {/* Avance por Año de Carrera */}
        <div className="glass-panel chart-panel">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Progreso por Año de Carrera</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Porcentaje de materias aprobadas en cada ciclo
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {career?.years || 5} Años totales
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '0.5rem' }}>
            {stats.yearStats.map((item) => {
              const pct = item.total > 0 ? Math.round((item.approved / item.total) * 100) : 0;
              const isCompleted = item.approved === item.total && item.total > 0;

              return (
                <div key={item.year}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {item.year}º Año
                      {isCompleted && <CheckCircle size={14} color="#10b981" />}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      <strong>{item.approved}</strong> / {item.total} ({pct}%)
                    </span>
                  </div>

                  <div className="progress-container" style={{ height: '8px' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: isCompleted
                          ? 'linear-gradient(90deg, #10b981, #34d399)'
                          : 'var(--accent-primary-gradient)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Estado Desglosado de Asignaturas */}
      <div className="glass-panel chart-panel">
        <h3 className="chart-title" style={{ marginBottom: '1.25rem' }}>
          Desglose Global de Estados
        </h3>

        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '1rem' 
          }}
        >
          <StatusCountCard 
            label="Aprobadas (Final)" 
            count={stats.approved} 
            color="#10b981" 
            sub="Rendidas con examen final" 
          />
          <StatusCountCard 
            label="Promocionadas" 
            count={stats.promoted} 
            color="#06b6d4" 
            sub="Aprobadas directamente" 
          />
          <StatusCountCard 
            label="Regularizadas" 
            count={stats.regular} 
            color="#a855f7" 
            sub="Cursada aprobada, final pendiente" 
          />
          <StatusCountCard 
            label="En Cursada" 
            count={stats.inProgress} 
            color="#38bdf8" 
            sub="Matriculado este ciclo" 
          />
          <StatusCountCard 
            label="Pendientes" 
            count={stats.pending} 
            color="#64748b" 
            sub="Aún no iniciadas" 
          />
          <StatusCountCard 
            label="Desaprobadas" 
            count={stats.disapproved} 
            color="#f43f5e" 
            sub="Aplazos o recursadas" 
          />
        </div>
      </div>
    </div>
  );
}

function StatusCountCard({ label, count, color, sub }) {
  return (
    <div 
      style={{ 
        background: 'var(--bg-main)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 'var(--radius-md)', 
        padding: '1rem',
        borderLeft: `3px solid ${color}`
      }}
    >
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color, margin: '0.2rem 0' }}>{count}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sub}</div>
    </div>
  );
}
