import React from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  TrendingUp,
  Unlock
} from 'lucide-react';

export default function StatsSummary({ stats, careerName, university }) {
  return (
    <section className="stats-grid" aria-label="Resumen de rendimiento académico">
      {/* Progreso de la carrera */}
      <div className="glass-panel stat-card" style={{ '--card-accent': '#6366f1' }}>
        <div className="stat-icon">
          <Award size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-label">Avance de Carrera</div>
          <div className="stat-value">{stats.percentage}%</div>
          <div className="progress-container">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.percentage}%` }}
              role="progressbar"
              aria-valuenow={stats.percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <div className="stat-sub">
            {stats.totalPassed} de {stats.total} materias aprobadas
          </div>
        </div>
      </div>

      {/* Promedio General */}
      <div className="glass-panel stat-card" style={{ '--card-accent': '#10b981' }}>
        <div className="stat-icon">
          <TrendingUp size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-label">Promedio General</div>
          <div className="stat-value">
            {stats.gpaWithoutFails}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.35rem' }}>
              / 10
            </span>
          </div>
          <div className="stat-sub">
            Con aplazos: <strong style={{ color: 'var(--text-primary)' }}>{stats.gpaWithFails}</strong> ({stats.gradesCount} notas)
          </div>
        </div>
      </div>

      {/* Créditos y Horas */}
      <div className="glass-panel stat-card" style={{ '--card-accent': '#06b6d4' }}>
        <div className="stat-icon">
          <BookOpen size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-label">Créditos Acumulados</div>
          <div className="stat-value">
            {stats.earnedCredits}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.35rem' }}>
              / {stats.totalCredits}
            </span>
          </div>
          <div className="stat-sub">
            {stats.creditsPercentage}% créditos • {stats.earnedHours} hs cursadas
          </div>
        </div>
      </div>

      {/* Cursada & Habilitadas */}
      <div className="glass-panel stat-card" style={{ '--card-accent': '#a855f7' }}>
        <div className="stat-icon">
          <Sparkles size={24} />
        </div>
        <div className="stat-content">
          <div className="stat-label">En Curso & Disponibles</div>
          <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{stats.inProgress} cursando</span>
          </div>
          <div className="stat-sub" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
            <span>🟣 {stats.regular} regularizadas</span>
            <span>🔓 {stats.availableCount} disponibles</span>
          </div>
        </div>
      </div>
    </section>
  );
}
