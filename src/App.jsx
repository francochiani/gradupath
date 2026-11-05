import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';
import MallaCurricular from './components/MallaCurricular';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SemesterPlanner from './components/SemesterPlanner';
import AcademicTranscript from './components/AcademicTranscript';
import SubjectModal from './components/SubjectModal';
import CareerModal from './components/CareerModal';
import { DEFAULT_CAREERS } from './data/defaultCareers';
import { calculateAcademicStats } from './utils/academicUtils';

const STORAGE_KEY_CAREERS = 'gradupath_careers_v1';
const STORAGE_KEY_ACTIVE = 'gradupath_active_career_id';
const STORAGE_KEY_THEME = 'gradupath_theme';

export default function App() {
  // Inicialización de carreras desde LocalStorage
  const [careers, setCareers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAREERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored careers:', e);
    }
    return DEFAULT_CAREERS;
  });

  // Carrera activa
  const [currentCareerId, setCurrentCareerId] = useState(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE);
    if (savedId && careers.some((c) => c.id === savedId)) return savedId;
    return careers[0]?.id || 'ing-informatica';
  });

  // Tema visual (dark / light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  });

  // Vista activa
  const [activeView, setActiveView] = useState('malla');

  // Modales
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);

  // Guardar en LocalStorage cada vez que cambien las carreras
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CAREERS, JSON.stringify(careers));
    } catch (e) {
      console.error('Error saving careers to localStorage:', e);
    }
  }, [careers]);

  // Guardar carrera activa
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE, currentCareerId);
  }, [currentCareerId]);

  // Aplicar tema en el DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Carrera actual seleccionada
  const currentCareer = useMemo(() => {
    return careers.find((c) => c.id === currentCareerId) || careers[0];
  }, [careers, currentCareerId]);

  // Estadísticas calculadas
  const stats = useMemo(() => {
    return calculateAcademicStats(currentCareer);
  }, [currentCareer]);

  // Crear o actualizar materia
  const handleSaveSubject = (savedSubject) => {
    setCareers((prevCareers) => {
      return prevCareers.map((c) => {
        if (c.id !== currentCareerId) return c;

        const exists = c.subjects.some((s) => s.id === savedSubject.id);
        let updatedSubjects;

        if (exists) {
          updatedSubjects = c.subjects.map((s) =>
            s.id === savedSubject.id ? savedSubject : s
          );
        } else {
          // Nueva materia
          const newId = `sub-${Date.now()}`;
          updatedSubjects = [...c.subjects, { ...savedSubject, id: newId }];
        }

        return { ...c, subjects: updatedSubjects };
      });
    });

    setIsSubjectModalOpen(false);
    setEditingSubject(null);
  };

  // Eliminar materia y limpiar referencias en correlativas
  const handleDeleteSubject = (subjectId) => {
    setCareers((prevCareers) => {
      return prevCareers.map((c) => {
        if (c.id !== currentCareerId) return c;

        const filtered = c.subjects
          .filter((s) => s.id !== subjectId)
          .map((s) => ({
            ...s,
            prerequisites: s.prerequisites
              ? s.prerequisites.filter((pId) => pId !== subjectId)
              : []
          }));

        return { ...c, subjects: filtered };
      });
    });

    setIsSubjectModalOpen(false);
    setEditingSubject(null);
  };

  // Actualización en lote (por ejemplo, desde el planificador de cuatrimestre)
  const handleBatchUpdateStatus = (subjectIds, newStatus) => {
    setCareers((prevCareers) => {
      return prevCareers.map((c) => {
        if (c.id !== currentCareerId) return c;

        const updatedSubjects = c.subjects.map((s) => {
          if (subjectIds.includes(s.id)) {
            return { ...s, status: newStatus };
          }
          return s;
        });

        return { ...c, subjects: updatedSubjects };
      });
    });
  };

  // Crear nueva carrera
  const handleCreateCareer = (newCareer) => {
    setCareers((prev) => [...prev, newCareer]);
    setCurrentCareerId(newCareer.id);
  };

  // Importar carrera desde JSON
  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.name || !Array.isArray(data.subjects)) {
          alert('El archivo JSON no tiene un formato válido de carrera.');
          return;
        }

        const importedCareer = {
          ...data,
          id: `carrera-imp-${Date.now()}`
        };

        setCareers((prev) => [...prev, importedCareer]);
        setCurrentCareerId(importedCareer.id);
        alert(`¡Carrera "${importedCareer.name}" importada exitosamente!`);
      } catch (err) {
        alert('Error al leer o procesar el archivo JSON.');
      }
    };
    reader.readAsText(file);
    // Limpiar input file para permitir seleccionar el mismo archivo
    e.target.value = '';
  };

  return (
    <div className="app-container">
      {/* Barra de navegación superior */}
      <Navbar
        careers={careers}
        currentCareerId={currentCareerId}
        onSelectCareer={setCurrentCareerId}
        onNewCareer={() => setIsCareerModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        setTheme={setTheme}
        onImportClick={handleImportJson}
        currentCareer={currentCareer}
      />

      {/* Resumen de Métricas Clave */}
      <StatsSummary
        stats={stats}
        careerName={currentCareer?.name}
        university={currentCareer?.university}
      />

      {/* Vistas Principales */}
      <main id="main-content">
        {activeView === 'malla' && (
          <MallaCurricular
            career={currentCareer}
            onSelectSubject={(subject) => {
              setEditingSubject(subject);
              setIsSubjectModalOpen(true);
            }}
            onNewSubject={() => {
              setEditingSubject(null);
              setIsSubjectModalOpen(true);
            }}
          />
        )}

        {activeView === 'analytics' && (
          <AnalyticsDashboard
            stats={stats}
            career={currentCareer}
          />
        )}

        {activeView === 'planner' && (
          <SemesterPlanner
            career={currentCareer}
            onBatchUpdateStatus={handleBatchUpdateStatus}
          />
        )}

        {activeView === 'transcript' && (
          <AcademicTranscript
            career={currentCareer}
            stats={stats}
            onSelectSubject={(subject) => {
              setEditingSubject(subject);
              setIsSubjectModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Modal de Asignatura */}
      <SubjectModal
        subject={editingSubject}
        allSubjects={currentCareer?.subjects || []}
        careerYears={currentCareer?.years || 5}
        isOpen={isSubjectModalOpen}
        onClose={() => {
          setIsSubjectModalOpen(false);
          setEditingSubject(null);
        }}
        onSave={handleSaveSubject}
        onDelete={handleDeleteSubject}
      />

      {/* Modal de Crear Carrera */}
      <CareerModal
        isOpen={isCareerModalOpen}
        onClose={() => setIsCareerModalOpen(false)}
        onCreateCareer={handleCreateCareer}
        defaultTemplates={DEFAULT_CAREERS}
      />
    </div>
  );
}
