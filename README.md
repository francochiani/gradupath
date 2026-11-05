# GraduPath 🎓

**GraduPath** es una aplicación web interactiva y moderna para el seguimiento, planificación y analítica de planes de estudio universitarios.

Diseñada para estudiantes que quieren tener control total sobre su avance académico, visualizar correlatividades de forma dinámica y simular sus próximas inscripciones de cursada.

---

## ✨ Características Principales

- **🗺️ Malla Curricular Interactiva con Grafo de Correlatividades:**
  - Visualización por Años y Cuatrimestres (1º, 2º y Anual).
  - Al pasar el cursor sobre cualquier materia, se destacan sus **requisitos previos** (en cian) y las materias que **desbloquea a futuro** (en ámbar).
  - Filtros en vivo por estado (*Aprobadas*, *Cursando*, *Regularizadas*, *Pendientes*, *Habilitadas para cursar*).

- **📊 Analítica y Métricas Académicas:**
  - Cálculo automático de **Promedio con Aplazos** y **Promedio sin Aplazos**.
  - Avance porcentual de la carrera, horas cursadas y créditos acumulados.
  - Histograma interactivo de distribución de calificaciones (1 a 10).
  - Estimación de tiempo para graduación según el ritmo de materias.

- **🎯 Simulador de Inscripción & Planificador de Cuatrimestre:**
  - Detección inteligente de materias que cumplan todas las correlativas requeridas.
  - Canasta interactiva para planificar el próximo ciclo lectivo con cálculo de carga horaria semanal estimada (*Carga liviana*, *equilibrada* o *exigente*).
  - Acción en lote para matricularse automáticamente a las asignaturas elegidas.

- **📋 Ficha Académica & Analítico Imprimible:**
  - Resumen formal imprimible con fecha de emisión, métricas y tabla detallada de asignaturas.
  - Optimizado para imprimir directamente o exportar a PDF (`Ctrl + P`).

- **💾 Gestión Flexible y Respaldo Local:**
  - Persistencia automática en el navegador (`localStorage`), sin necesidad de registrarse.
  - Soporte multi-carrera (incluye plantillas de ejemplo listas para usar).
  - Exportación e importación completa mediante archivos JSON.
  - Modo Oscuro y Modo Claro.

---

## 🚀 Tecnologías

- **React 19**
- **Vite**
- **Lucide React** (Iconografía)
- **Canvas Confetti** (Animaciones de aprobación)
- **CSS3 Moderno** (Glassmorphism, CSS Custom Properties y diseño responsive)

---

## 🛠️ Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/francochiani/gradupath.git
   cd gradupath
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los archivos estáticos listos para desplegar quedarán generados en la carpeta `dist/`.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
