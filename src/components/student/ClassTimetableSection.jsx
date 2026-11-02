import React, { useState } from 'react';
import { Clock, Search, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { branches, semesters } from '../../config/academics';
import { studentService } from '../../services/studentService';

export function ClassTimetableSection({ prefillBranch = 'ai-data-science', prefillSemester = '4' }) {
  const [selectedBranch, setSelectedBranch] = useState(prefillBranch);
  const [selectedSemester, setSelectedSemester] = useState(prefillSemester);
  const [loading, setLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);
  const [timetableData, setTimetableData] = useState(null);
  const [queryBranchName, setQueryBranchName] = useState('');
  const [querySemester, setQuerySemester] = useState('');

  const handleQuery = async (e) => {
    e.preventDefault();
    const branchObj = branches.find((b) => b.id === selectedBranch);
    setQueryBranchName(branchObj ? branchObj.name : selectedBranch);
    setQuerySemester(selectedSemester);
    setLoading(true);
    setHasQueried(true);

    try {
      const data = await studentService.getClassTimetable({
        branch: selectedBranch,
        semester: selectedSemester,
      });
      setTimetableData(data);
    } catch {
      setTimetableData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="class-timetable" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A78BFA]/40 bg-[#A78BFA]/10 text-[#A78BFA] font-mono text-xs uppercase tracking-widest mb-3">
              <Clock className="w-3.5 h-3.5" />
              Instructional Sprints
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              3. CLASS & STUDIO TIMETABLE
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Weekly class schedules, instructor office hours, lab reservations, and collaborative sprint slots.
            </p>
          </div>
        </div>

        <form onSubmit={handleQuery} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-xs font-mono uppercase text-app-muted mb-2">
              Branch / Department
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-[#0A0B1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-hru-gold focus:outline-none"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-app-muted mb-2">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full bg-[#0A0B1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-hru-gold focus:outline-none"
            >
              {semesters.map((s) => (
                <option key={s.value} value={s.value}>Semester {s.value}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={loading}
              className="w-full justify-center h-[46px]"
              icon={<Search className="w-4 h-4" />}
            >
              {loading ? 'Fetching...' : 'Show Timetable'}
            </Button>
          </div>
        </form>

        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 bg-white/5 rounded-2xl w-full" />
            <div className="h-20 bg-white/5 rounded-2xl w-full" />
          </div>
        )}

        {!loading && hasQueried && (
          <div>
            {timetableData && timetableData.schedule ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0A0B1E] border border-white/10 text-xs font-mono">
                  <span className="text-white font-bold">
                    Section {timetableData.section} • 5-Day Weekly Studio Schedule
                  </span>
                  <span className="text-emerald-400">
                    Active AY 2026/27
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-3.5">
                  {timetableData.schedule.map((dayPlan, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#0A0B1E] border border-white/10 space-y-3 flex flex-col justify-between"
                    >
                      <div className="pb-2 border-b border-white/10">
                        <span className="font-heading font-black text-sm text-[#FFC53D] uppercase">
                          {dayPlan.day}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-grow">
                        {dayPlan.slots.map((slot, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1"
                          >
                            <span className="text-[10px] font-mono text-[#2DD4BF] block font-bold">
                              {slot.time}
                            </span>
                            <span className="font-heading font-bold text-xs text-white block leading-snug">
                              {slot.course}
                            </span>
                            <div className="flex items-center justify-between text-[10px] font-mono text-app-muted pt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5 text-[#FF7A59]" />
                                {slot.room}
                              </span>
                              <span className="text-neutral-400">
                                {slot.faculty}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-6 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/20 space-y-2">
                <Clock className="w-8 h-8 text-app-muted mx-auto" />
                <h3 className="font-heading font-bold text-white text-base">Class Timetable Not Uploaded</h3>
                <p className="text-xs text-app-muted max-w-sm mx-auto">
                  The weekly timetable for <strong className="text-white">{queryBranchName} Semester {querySemester}</strong> is currently being drafted by the department academic coordinator.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default ClassTimetableSection;
