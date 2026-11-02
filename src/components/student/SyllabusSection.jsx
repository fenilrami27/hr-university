import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Search, Download, FileText } from 'lucide-react';
import Button from '../ui/Button';
import { branches, semesters } from '../../config/academics';
import { studentService } from '../../services/studentService';

export function SyllabusSection({ prefillBranch = 'ai-data-science', prefillSemester = '4' }) {
  const [selectedBranch, setSelectedBranch] = useState(prefillBranch);
  const [selectedSemester, setSelectedSemester] = useState(prefillSemester);
  const [subjectQuery, setSubjectQuery] = useState('');
  const [syllabusList, setSyllabusList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleQuery = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    try {
      const data = await studentService.getSyllabusAndMaterial({
        branch: selectedBranch,
        semester: selectedSemester,
        subject: subjectQuery,
      });
      setSyllabusList(data || []);
    } catch {
      setSyllabusList([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBranch, selectedSemester, subjectQuery]);

  useEffect(() => {
    // Initial fetch if demo mode is enabled
    if (!studentService.isDemoMode()) return;
    let ignore = false;
    studentService.getSyllabusAndMaterial({
      branch: selectedBranch,
      semester: selectedSemester,
      subject: subjectQuery,
    }).then((data) => {
      if (!ignore) {
        setSyllabusList(data || []);
      }
    }).catch(() => {
      if (!ignore) {
        setSyllabusList([]);
      }
    });
    return () => {
      ignore = true;
    };
  }, [selectedBranch, selectedSemester, subjectQuery]);

  return (
    <section id="syllabus" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C6FF3D]/40 bg-[#C6FF3D]/10 text-[#C6FF3D] font-mono text-xs uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Curriculum & Open Resources
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              5. SYLLABUS, STUDY MATERIAL & PYQS
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Download approved course syllabi, lecture slide decks, Jupyter notebook labs, and previous 3 years examination papers (PYQs).
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <form onSubmit={handleQuery} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
          <div>
            <label className="block text-xs font-mono uppercase text-app-muted mb-2">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-[#0A0B1E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-hru-gold focus:outline-none"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-app-muted mb-2">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full bg-[#0A0B1E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-hru-gold focus:outline-none"
            >
              {semesters.map((s) => (
                <option key={s.value} value={s.value}>Semester {s.value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-app-muted mb-2">Filter Course Code</label>
            <input
              type="text"
              value={subjectQuery}
              onChange={(e) => setSubjectQuery(e.target.value)}
              placeholder="e.g. AI-401"
              className="w-full bg-[#0A0B1E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-app-muted focus:border-hru-gold focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={loading}
              className="w-full justify-center h-[42px] text-xs"
              icon={<Search className="w-4 h-4" />}
            >
              {loading ? 'Searching...' : 'Search Materials'}
            </Button>
          </div>
        </form>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 bg-white/5 rounded-2xl w-full" />
            <div className="h-32 bg-white/5 rounded-2xl w-full" />
          </div>
        ) : syllabusList.length > 0 ? (
          <div className="space-y-6">
            {syllabusList.map((course, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#0A0B1E] border border-white/10 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#C6FF3D]/20 text-[#C6FF3D] border border-[#C6FF3D]/30 mr-2">
                      {course.code}
                    </span>
                    <span className="text-xs font-mono text-app-muted">
                      {course.credits} Credits • Core Studio Subject
                    </span>
                    <h3 className="font-heading font-black text-lg sm:text-xl text-white mt-1">
                      {course.name}
                    </h3>
                  </div>

                  <a
                    href="#download-syllabus"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading full syllabus document for ${course.code}`);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-hru-gold" />
                    <span>Download Syllabus (PDF)</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Modules */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase text-[#FFC53D] font-bold block">
                      Core Syllabus Modules
                    </span>
                    <ul className="space-y-1.5 text-xs text-neutral-300 font-mono">
                      {course.modules.map((mod, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-1.5">
                          <span className="text-hru-gold font-bold">›</span>
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Previous Year Papers */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase text-[#2DD4BF] font-bold block">
                      Previous Year Papers (PYQs)
                    </span>
                    <ul className="space-y-1.5">
                      {course.pyqs.map((pyq, pIdx) => (
                        <li key={pIdx}>
                          <a
                            href="#pyq"
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Downloading PYQ: ${pyq}`);
                            }}
                            className="text-xs font-mono text-white hover:text-hru-gold flex items-center gap-1.5 transition-colors"
                          >
                            <FileText className="w-3 h-3 text-[#2DD4BF]" />
                            <span>{pyq}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Study Material */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase text-[#F472B6] font-bold block">
                      Lecture Slides & Lab Kits
                    </span>
                    <ul className="space-y-1.5">
                      {course.materials.map((mat, matIdx) => (
                        <li key={matIdx}>
                          <a
                            href="#mat"
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Downloading Study Material: ${mat}`);
                            }}
                            className="text-xs font-mono text-white hover:text-hru-gold flex items-center gap-1.5 transition-colors"
                          >
                            <Download className="w-3 h-3 text-[#F472B6]" />
                            <span>{mat}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/20 space-y-2">
            <BookOpen className="w-8 h-8 text-app-muted mx-auto" />
            <h3 className="font-heading font-bold text-white text-base">No Syllabus Files Found</h3>
            <p className="text-xs text-app-muted max-w-sm mx-auto">
              Syllabus documents and question paper archives for this selection have not been uploaded to the public repository.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SyllabusSection;
