import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Preloader from './components/ui/Preloader';
import TimedEnquiryPopup from './components/ui/TimedEnquiryPopup';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy-loaded routes for 60fps performance
const HomePage = lazy(() => import('./pages/HomePage'));
const DepartmentsPage = lazy(() => import('./pages/DepartmentsPage'));
const DepartmentDetailPage = lazy(() => import('./pages/DepartmentDetailPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const CampusPage = lazy(() => import('./pages/CampusPage'));
const ResearchPage = lazy(() => import('./pages/ResearchPage'));
const PlacementsPage = lazy(() => import('./pages/PlacementsPage'));
const ScholarshipsPage = lazy(() => import('./pages/ScholarshipsPage'));
const AdmissionsPage = lazy(() => import('./pages/AdmissionsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PortalPage = lazy(() => import('./pages/PortalPage'));
const StudentUpdatesPage = lazy(() => import('./pages/StudentUpdatesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Route Suspense Fallback
function PageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-hru-gold/20 border-t-hru-gold animate-spin" />
      <span className="font-mono text-xs uppercase tracking-widest text-app-muted">
        STREAMING CAMPUS ASSETS...
      </span>
    </div>
  );
}

export function App() {
  const [hasLoaded, setHasLoaded] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('nointro') || params.get('intro') === 'false') return true;
      try {
        return sessionStorage.getItem('hru_preloader_seen') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  const handlePreloaderComplete = () => {
    setHasLoaded(true);
    try {
      sessionStorage.setItem('hru_preloader_seen', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <ErrorBoundary name="Application Root Wrapper">
      {/* Signature Motion: Preloader counter 0 to 100 with wipe up */}
      {!hasLoaded && (
        <ErrorBoundary name="Preloader" fallback={null}>
          <Preloader onComplete={handlePreloaderComplete} />
        </ErrorBoundary>
      )}

      <BrowserRouter>
        {/* Timed Enquiry Popup (60-second rule, tracks active tab time) */}
        <ErrorBoundary name="Timed Enquiry Popup" fallback={null}>
          <TimedEnquiryPopup canStart={hasLoaded} />
        </ErrorBoundary>

        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="departments/:slug" element={<DepartmentDetailPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:slug" element={<EventDetailPage />} />
              <Route path="programs" element={<ProgramsPage />} />
              <Route path="campus" element={<CampusPage />} />
              <Route path="research" element={<ResearchPage />} />
              <Route path="placements" element={<PlacementsPage />} />
              <Route path="scholarships" element={<ScholarshipsPage />} />
              <Route path="admissions" element={<AdmissionsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="portal" element={<PortalPage />} />
              <Route path="student-updates" element={<StudentUpdatesPage />} />
              <Route path="404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
