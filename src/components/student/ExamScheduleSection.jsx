import React, { useState } from 'react';
import {
  CalendarDays,
  Search,
  Download,
  Printer,
  AlertCircle,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import Button from '../ui/Button';
import { branches, semesters, validateEnrollmentNumber } from '../../config/academics';
import { studentService } from '../../services/studentService';

export function ExamScheduleSection({ prefillEnrollment = '', prefillBranch = 'ai-data-science', prefillSemester = '4' }) {
  const [enrollmentInput, setEnrollmentInput] = useState(prefillEnrollment);
  const [selectedBranch, setSelectedBranch] = useState(prefillBranch);
  const [selectedSemester, setSelectedSemester] = useState(prefillSemester);
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [lastQueryBranchName, setLastQueryBranchName] = useState('');
  const [lastQuerySemester, setLastQuerySemester] = useState('');

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const validation = validateEnrollmentNumber(enrollmentInput);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    const branchObj = branches.find((b) => b.id === selectedBranch);
    const branchName = branchObj ? branchObj.name : selectedBranch;

    setLoading(true);
    setHasSearched(true);
    setLastQueryBranchName(branchName);
    setLastQuerySemester(selectedSemester);

    try {
      const result = await studentService.getExamSchedule({
        branch: selectedBranch,
        semester: selectedSemester,
      });
      setScheduleData(result);
    } catch {
      setScheduleData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Generates a mock printable PDF blob download for the schedule
    const content = `HR UNIVERSITY - OFFICIAL EXAMINATION TIMETABLE
Branch: ${lastQueryBranchName}
Semester: ${lastQuerySemester}
Session: Spring End-Semester Examinations 2027

Timetable:
${(scheduleData?.timetable || []).map((t) => `${t.date} (${t.day}) | ${t.time} | ${t.code}: ${t.name} | Venue: ${t.venue} | Type: ${t.type}`).join('\n')}

Issued by: Office of Controller of Examinations, HR University`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HRU_Exam_Schedule_${selectedBranch}_Sem${selectedSemester}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="exam-schedule" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-hru-gold/30 bg-hru-gold/10 text-hru-gold font-mono text-xs uppercase tracking-widest mb-3">
              <CalendarDays className="w-3.5 h-3.5" />
              Examination Timetable Desk
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              A) UPCOMING SEMESTER EXAM SCHEDULE
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Enter your student enrollment number, program branch, and semester to view verified exam timetables, seating venues, and defense jury slots.
            </p>
          </div>
        </div>

        {/* Lookup Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Enrollment Number */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-app-muted mb-2">
                Enrollment Number <span className="text-[#FF7A59]">*</span>
              </label>
              <input
                type="text"
                required
                value={enrollmentInput}
                onChange={(e) => {
                  setEnrollmentInput(e.target.value.toUpperCase());
                  if (validationError) setValidationError('');
                }}
                placeholder="e.g. HRU24AI108"
                className={`w-full bg-[#0A0B1E] border ${
                  validationError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-white/15 focus:border-hru-gold'
                } rounded-xl px-4 py-3 text-sm text-white font-mono placeholder:text-app-muted focus:outline-none transition-colors uppercase`}
              />
            </div>

            {/* Branch Dropdown */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-app-muted mb-2">
                Program / Branch <span className="text-[#FF7A59]">*</span>
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-[#0A0B1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-hru-gold focus:outline-none transition-colors"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Dropdown */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-app-muted mb-2">
                Semester (1-8) <span className="text-[#FF7A59]">*</span>
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-[#0A0B1E] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-hru-gold focus:outline-none transition-colors"
              >
                {semesters.map((s) => (
                  <option key={s.value} value={s.value}>
                    Semester {s.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="gold"
                size="md"
                disabled={loading}
                className="w-full justify-center h-[46px]"
                icon={<Search className="w-4 h-4" />}
              >
                {loading ? 'Searching...' : 'View Schedule'}
              </Button>
            </div>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </form>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/10 animate-pulse">
            <div className="h-6 bg-white/10 rounded-lg w-1/3 mb-4" />
            <div className="h-10 bg-white/5 rounded-xl w-full" />
            <div className="h-10 bg-white/5 rounded-xl w-full" />
            <div className="h-10 bg-white/5 rounded-xl w-full" />
          </div>
        )}

        {/* Results / Empty State */}
        {!loading && hasSearched && (
          <div>
            {scheduleData && scheduleData.timetable && scheduleData.timetable.length > 0 ? (
              <div className="space-y-6">
                {/* Meta details header & Action buttons */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0A0B1E] border border-white/15">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-lg text-white">
                        {scheduleData.branchName} • Semester {scheduleData.semester}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        PUBLISHED
                      </span>
                    </div>
                    <span className="text-xs font-mono text-app-muted block">
                      {scheduleData.examSession} • Published on {scheduleData.publishedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={handlePrint}
                      icon={<Printer className="w-3.5 h-3.5" />}
                    >
                      Print
                    </Button>
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={handleDownloadPDF}
                      icon={<Download className="w-3.5 h-3.5" />}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>

                {/* Timetable Table */}
                <div className="overflow-x-auto rounded-2xl border border-white/15 bg-[#0A0B1E]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-app-muted font-mono text-[11px] uppercase tracking-wider">
                        <th className="py-3.5 px-4 font-bold">Date & Day</th>
                        <th className="py-3.5 px-4 font-bold">Time Slot</th>
                        <th className="py-3.5 px-4 font-bold">Subject Code & Course Title</th>
                        <th className="py-3.5 px-4 font-bold">Exam Type</th>
                        <th className="py-3.5 px-4 font-bold">Seating Venue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-white font-mono">
                      {scheduleData.timetable.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                            <span className="block">{item.date}</span>
                            <span className="text-[11px] text-[#FFC53D] font-normal">{item.day}</span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-neutral-300">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-hru-gold" />
                              {item.time}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold text-[#2DD4BF] mr-2">
                              {item.code}
                            </span>
                            <span className="font-heading font-bold text-sm text-white">
                              {item.name}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-neutral-200">
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-app-muted">
                              <MapPin className="w-3.5 h-3.5 text-[#FF7A59]" />
                              {item.venue}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-app-muted flex items-start sm:items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                  <span>
                    Hall entry gates open 30 minutes before schedule. Physical student ID card and verified Hall Ticket are mandatory for entry.
                  </span>
                </div>
              </div>
            ) : (
              /* Friendly Empty State */
              <div className="text-center py-12 px-6 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/20 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-app-muted">
                  <Calendar className="w-6 h-6 text-hru-gold" />
                </div>
                <h3 className="font-heading font-black text-lg text-white">
                  Schedule Not Published Yet
                </h3>
                <p className="text-xs sm:text-sm text-app-muted max-w-md mx-auto leading-relaxed">
                  Exam schedule for <strong className="text-white">{lastQueryBranchName} Semester {lastQuerySemester}</strong> has not been published yet. Please check back soon or keep an eye on university circulars.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-3 py-1 rounded-full border border-[#2DD4BF]/20">
                    Expected Notification: 2-3 weeks prior to commencement
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default ExamScheduleSection;
