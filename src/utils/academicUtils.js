// Utilidades de cálculo académico, correlatividades y exportación

export function isSubjectApproved(status) {
  return status === "aprobada" || status === "promocionada";
}

export function isSubjectAvailable(subject, allSubjects) {
  if (isSubjectApproved(subject.status)) return false;
  if (!subject.prerequisites || subject.prerequisites.length === 0) return true;

  // Una materia está disponible para cursar si todas sus correlativas están regularizadas o aprobadas
  return subject.prerequisites.every((prereqId) => {
    const prereq = allSubjects.find((s) => s.id === prereqId);
    if (!prereq) return true;
    return (
      prereq.status === "aprobada" ||
      prereq.status === "promocionada" ||
      prereq.status === "regular"
    );
  });
}

export function isSubjectUnlockedForExam(subject, allSubjects) {
  if (isSubjectApproved(subject.status)) return true;
  if (!subject.prerequisites || subject.prerequisites.length === 0) return true;

  // Para rendir examen final, las correlativas deben estar aprobadas o promocionadas
  return subject.prerequisites.every((prereqId) => {
    const prereq = allSubjects.find((s) => s.id === prereqId);
    if (!prereq) return true;
    return isSubjectApproved(prereq.status);
  });
}

export function getPrerequisiteDetails(subject, allSubjects) {
  if (!subject.prerequisites || subject.prerequisites.length === 0) {
    return [];
  }
  return subject.prerequisites.map((prereqId) => {
    const found = allSubjects.find((s) => s.id === prereqId);
    return {
      id: prereqId,
      name: found ? found.name : prereqId,
      code: found ? found.code : "",
      status: found ? found.status : "pendiente",
      isMet: found
        ? found.status === "aprobada" ||
          found.status === "promocionada" ||
          found.status === "regular"
        : false,
      isFullyApproved: found ? isSubjectApproved(found.status) : false
    };
  });
}

export function getUnlockedBySubject(subjectId, allSubjects) {
  return allSubjects.filter(
    (s) => s.prerequisites && s.prerequisites.includes(subjectId)
  );
}

export function calculateAcademicStats(career) {
  const subjects = career?.subjects || [];
  const total = subjects.length;

  if (total === 0) {
    return {
      total: 0,
      approved: 0,
      promoted: 0,
      regular: 0,
      inProgress: 0,
      pending: 0,
      disapproved: 0,
      percentage: 0,
      totalCredits: 0,
      earnedCredits: 0,
      creditsPercentage: 0,
      totalHours: 0,
      earnedHours: 0,
      gpaWithoutFails: "0.00",
      gpaWithFails: "0.00",
      gradeDistribution: {},
      availableCount: 0,
      yearStats: []
    };
  }

  let approvedCount = 0;
  let promotedCount = 0;
  let regularCount = 0;
  let inProgressCount = 0;
  let pendingCount = 0;
  let disapprovedCount = 0;
  let availableCount = 0;

  let totalCredits = 0;
  let earnedCredits = 0;
  let totalHours = 0;
  let earnedHours = 0;

  let sumGradesWithoutFails = 0;
  let countGradesWithoutFails = 0;
  let sumGradesWithFails = 0;
  let countGradesWithFails = 0;

  const gradeDistribution = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    6: 0, 7: 0, 8: 0, 9: 0, 10: 0
  };

  // Por año
  const yearsMap = {};

  subjects.forEach((subj) => {
    const cred = Number(subj.credits) || 0;
    const hrs = Number(subj.hours) || 0;
    totalCredits += cred;
    totalHours += hrs;

    if (!yearsMap[subj.year]) {
      yearsMap[subj.year] = { year: subj.year, total: 0, approved: 0 };
    }
    yearsMap[subj.year].total += 1;

    const isPassed = isSubjectApproved(subj.status);

    if (subj.status === "aprobada") approvedCount++;
    else if (subj.status === "promocionada") promotedCount++;
    else if (subj.status === "regular") regularCount++;
    else if (subj.status === "cursando") inProgressCount++;
    else if (subj.status === "desaprobada") disapprovedCount++;
    else pendingCount++;

    if (isPassed) {
      earnedCredits += cred;
      earnedHours += hrs;
      yearsMap[subj.year].approved += 1;
    }

    if (isSubjectAvailable(subj, subjects) && !isPassed && subj.status !== "cursando") {
      availableCount++;
    }

    const numGrade = Number(subj.grade);
    if (!isNaN(numGrade) && numGrade > 0) {
      const rounded = Math.round(numGrade);
      if (rounded >= 1 && rounded <= 10) {
        gradeDistribution[rounded] = (gradeDistribution[rounded] || 0) + 1;
      }

      if (isPassed) {
        sumGradesWithoutFails += numGrade;
        countGradesWithoutFails++;
      }
      sumGradesWithFails += numGrade;
      countGradesWithFails++;
    }
  });

  const totalPassed = approvedCount + promotedCount;
  const percentage = total > 0 ? ((totalPassed / total) * 100).toFixed(1) : 0;
  const creditsPercentage =
    totalCredits > 0 ? ((earnedCredits / totalCredits) * 100).toFixed(1) : 0;

  const gpaWithoutFails =
    countGradesWithoutFails > 0
      ? (sumGradesWithoutFails / countGradesWithoutFails).toFixed(2)
      : "—";

  const gpaWithFails =
    countGradesWithFails > 0
      ? (sumGradesWithFails / countGradesWithFails).toFixed(2)
      : "—";

  const yearStats = Object.values(yearsMap).sort((a, b) => a.year - b.year);

  return {
    total,
    approved: approvedCount,
    promoted: promotedCount,
    totalPassed,
    regular: regularCount,
    inProgress: inProgressCount,
    pending: pendingCount,
    disapproved: disapprovedCount,
    availableCount,
    percentage: Number(percentage),
    totalCredits,
    earnedCredits,
    creditsPercentage: Number(creditsPercentage),
    totalHours,
    earnedHours,
    gpaWithoutFails,
    gpaWithFails,
    gradesCount: countGradesWithoutFails,
    gradeDistribution,
    yearStats
  };
}

export function exportToJson(data, filename = "mi_carrera_backup.json") {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
