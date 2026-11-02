// HR University Student Portal Service Layer
// Clean abstraction layer for all academic, exam, result, and student records.
// In production, these methods map directly to REST/GraphQL backend endpoints.
// Local demo data is ONLY enabled when import.meta.env.VITE_USE_DEMO_DATA === 'true'.
// IMPORTANT: Never log or expose enrollment numbers or dates of birth.

import {
  DEMO_CONFIG,
  demoExamSchedule,
  demoResult,
  demoNotices,
  demoCalendar,
  demoTimetable,
  demoHallTicket,
  demoSyllabus,
  demoFees,
  demoScholarships,
  demoAttendance,
  demoCertificates,
  demoPlacements,
  demoFacilities,
  demoGrievances,
  demoDownloads,
} from '../data/studentDemoData';

const delay = (ms = 20) => new Promise((resolve) => setTimeout(resolve, Math.min(ms, 20)));

const isDemoActive = () => {
  return import.meta.env.VITE_USE_DEMO_DATA === 'true';
};

// In-memory session store for client-side forms
const sessionStore = {
  grievances: [...demoGrievances],
  certificates: [...demoCertificates],
  reEvaluations: [],
};

export const studentService = {
  // Check if demo data mode is globally enabled
  isDemoMode: () => isDemoActive(),

  // Get demo credential hints (only returned if demo mode is enabled)
  getDemoCredentials: () => {
    if (!isDemoActive()) return null;
    return {
      branchId: DEMO_CONFIG.branchId,
      branchName: DEMO_CONFIG.branchName,
      semester: DEMO_CONFIG.semester,
      enrollmentNo: DEMO_CONFIG.enrollmentNo,
      dob: DEMO_CONFIG.dob,
    };
  },

  // A) Exam Schedule
  getExamSchedule: async ({ branch, semester }) => {
    await delay(300);
    if (!isDemoActive()) {
      return null; // Empty by default
    }
    if (branch === DEMO_CONFIG.branchId && String(semester) === String(DEMO_CONFIG.semester)) {
      return demoExamSchedule;
    }
    return null; // Not published for other branches/semesters in demo
  },

  // B) Results
  getResult: async ({ enrollmentNo, branch, semester }) => {
    await delay(350);
    if (!isDemoActive()) {
      return null;
    }
    const cleanEnrollment = (enrollmentNo || '').trim().toUpperCase();
    if (
      cleanEnrollment === DEMO_CONFIG.enrollmentNo &&
      branch === DEMO_CONFIG.branchId &&
      String(semester) === String(DEMO_CONFIG.semester)
    ) {
      return demoResult;
    }
    return null; // Not declared yet
  },

  // C1) Notices & Circulars
  getNotices: async ({ search = '', category = 'All', date = '' } = {}) => {
    await delay(200);
    if (!isDemoActive()) {
      return [];
    }
    let list = [...demoNotices];
    if (category && category !== 'All') {
      list = list.filter((n) => n.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
    }
    if (date) {
      list = list.filter((n) => n.date.toLowerCase().includes(date.toLowerCase()));
    }
    return list;
  },

  // C2) Academic Calendar
  getAcademicCalendar: async () => {
    await delay(200);
    if (!isDemoActive()) {
      return [];
    }
    return demoCalendar;
  },

  // C3) Class Timetable
  getClassTimetable: async ({ branch, semester }) => {
    await delay(250);
    if (!isDemoActive()) {
      return null;
    }
    if (branch === DEMO_CONFIG.branchId && String(semester) === String(DEMO_CONFIG.semester)) {
      return demoTimetable;
    }
    return null;
  },

  // C4) Hall Ticket / Admit Card
  getHallTicket: async ({ enrollmentNo, dob }) => {
    await delay(350);
    if (!isDemoActive()) {
      return null;
    }
    const cleanEnrollment = (enrollmentNo || '').trim().toUpperCase();
    if (cleanEnrollment === DEMO_CONFIG.enrollmentNo && dob === DEMO_CONFIG.dob) {
      return demoHallTicket;
    }
    return null;
  },

  // C5) Syllabus & Material
  getSyllabusAndMaterial: async ({ branch, semester, subject = '' } = {}) => {
    await delay(200);
    if (!isDemoActive()) {
      return [];
    }
    if (branch === DEMO_CONFIG.branchId && String(semester) === String(DEMO_CONFIG.semester)) {
      if (subject) {
        return demoSyllabus.filter((s) => s.code === subject || s.name.toLowerCase().includes(subject.toLowerCase()));
      }
      return demoSyllabus;
    }
    return [];
  },

  // C6) Fee Details
  getFeeDetails: async ({ enrollmentNo }) => {
    await delay(250);
    if (!isDemoActive()) {
      return null;
    }
    const cleanEnrollment = (enrollmentNo || '').trim().toUpperCase();
    if (cleanEnrollment === DEMO_CONFIG.enrollmentNo) {
      return demoFees;
    }
    return null;
  },

  // C7) Scholarships & Financial Aid
  getScholarships: async ({ enrollmentNo }) => {
    await delay(200);
    if (!isDemoActive()) {
      return null;
    }
    const cleanEnrollment = (enrollmentNo || '').trim().toUpperCase();
    if (cleanEnrollment === DEMO_CONFIG.enrollmentNo) {
      return demoScholarships;
    }
    return null;
  },

  // C8) Attendance
  getAttendance: async ({ enrollmentNo }) => {
    await delay(250);
    if (!isDemoActive()) {
      return null;
    }
    const cleanEnrollment = (enrollmentNo || '').trim().toUpperCase();
    if (cleanEnrollment === DEMO_CONFIG.enrollmentNo) {
      return demoAttendance;
    }
    return null;
  },

  // C9) Re-evaluation / Supplementary Form Submission
  submitReEvaluation: async ({ _enrollmentNo, subjectCode, type, reason }) => {
    await delay(300);
    const submissionId = `REV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const record = {
      id: submissionId,
      subjectCode,
      type,
      reason,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Application Received & Under Audit',
      fee: type === 'Re-evaluation' ? '₹750' : '₹500',
    };
    sessionStore.reEvaluations.unshift(record);
    return { success: true, record };
  },

  getReEvaluations: async () => {
    await delay(150);
    if (!isDemoActive() && sessionStore.reEvaluations.length === 0) {
      return [];
    }
    return sessionStore.reEvaluations;
  },

  // C10) Certificates & Forms
  getCertificates: async ({ _enrollmentNo } = {}) => {
    await delay(200);
    if (!isDemoActive() && sessionStore.certificates.length === demoCertificates.length) {
      return [];
    }
    return sessionStore.certificates;
  },

  submitCertificateRequest: async ({ type, purpose, urgency }) => {
    await delay(300);
    const refNo = `HRU/${type.slice(0, 3).toUpperCase()}/2026/${Math.floor(100 + Math.random() * 900)}`;
    const record = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      purpose,
      urgency,
      requestDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: urgency === 'Tatkal / Priority (24h)' ? 'Processing (Priority)' : 'Submitted for Verification',
      refNo,
    };
    sessionStore.certificates.unshift(record);
    return { success: true, record };
  },

  // C11) Placements & Internships
  getPlacements: async () => {
    await delay(200);
    if (!isDemoActive()) {
      return [];
    }
    return demoPlacements;
  },

  // C12) Campus Facilities (Library, Hostel, Transport)
  getCampusFacilities: async () => {
    await delay(200);
    if (!isDemoActive()) {
      return null;
    }
    return demoFacilities;
  },

  // C13) Grievance / Help Desk
  getGrievances: async () => {
    await delay(200);
    if (!isDemoActive() && sessionStore.grievances.length === demoGrievances.length) {
      return [];
    }
    return sessionStore.grievances;
  },

  submitGrievance: async ({ category, subject, description, priority }) => {
    await delay(300);
    const ticketId = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const record = {
      ticketId,
      category,
      subject,
      description,
      priority,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Open - Assigned to Support Cell',
      resolution: 'Ticket acknowledged by campus help desk. Expected turnaround: 24-48 business hours.',
    };
    sessionStore.grievances.unshift(record);
    return { success: true, record };
  },

  // C14) Important Downloads & Quick Links
  getDownloads: async () => {
    await delay(150);
    if (!isDemoActive()) {
      return [];
    }
    return demoDownloads;
  },
};

export default studentService;
