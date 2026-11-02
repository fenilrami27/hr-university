import React, { useState } from 'react';
import {
  Award,
  Search,
  Download,
  Printer,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import Button from '../ui/Button';
import { branches, semesters, validateEnrollmentNumber } from '../../config/academics';
import { studentService } from '../../services/studentService';

export function ResultsSection({ prefillEnrollment = '', prefillBranch = 'ai-data-science', prefillSemester = '4' }) {
  const [enrollmentInput, setEnrollmentInput] = useState(prefillEnrollment);
  const [selectedBranch, setSelectedBranch] = useState(prefillBranch);
  const [selectedSemester, setSelectedSemester] = useState(prefillSemester);
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [lastQueryBranchName, setLastQueryBranchName] = useState('');
  const [lastQuerySemester, setLastQuerySemester] = useState('');

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
      const result = await studentService.getResult({
        enrollmentNo: validation.value,
        branch: selectedBranch,
        semester: selectedSemester,
      });
      setResultData(result);
    } catch {
      setResultData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarksheet = () => {
    if (!resultData) return;
    const content = `HR UNIVERSITY - PROVISIONAL STATEMENT OF GRADES
Enrollment No: ${resultData.enrollmentNo}
Student Name: ${resultData.studentName}
Degree: ${resultData.degree}
Branch: ${resultData.branchName}
Semester: ${resultData.semester} (${resultData.examSession})
Declaration Date: ${resultData.declarationDate}

SUBJECT BREAKDOWN:
${resultData.subjects.map((s) => `${s.code} - ${s.name} | Credits: ${s.credits} | Marks: ${s.total}/100 | Grade: ${s.grade} (GP: ${s.gradePoint})`).join('\n')}

SUMMARY:
Total Credits: ${resultData.totalCredits}
Semester Grade Point Average (SGPA): ${resultData.sgpa}
Cumulative Grade Point Average (CGPA): ${resultData.cgpa}
Result: ${resultData.status} - ${resultData.division}

Disclaimer: This online result is for information only; the official marksheet with tamper-evident seal is issued by the university.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HRU_Marksheet_${selectedBranch}_Sem${selectedSemester}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="results" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-[#2DD4BF] font-mono text-xs uppercase tracking-widest mb-3">
              <Award className="w-3.5 h-3.5" />
              Official Examination Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              B) SEMESTER EXAMINATION RESULTS
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Access declared semester examination results, subject-wise credits, grade point evaluations, and download provisional statements of grades.
            </p>
          </div>
        </div>

        {/* Lookup Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
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

            <div>
              <Button
                type="submit"
                variant="gold"
                size="md"
                disabled={loading}
                className="w-full justify-center h-[46px]"
                icon={<Search className="w-4 h-4" />}
              >
                {loading ? 'Checking...' : 'Check Result'}
              </Button>
            </div>
          </div>

          {validationError && (
            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </form>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 animate-pulse">
            <div className="h-10 bg-white/10 rounded-lg w-1/2 mb-4" />
            <div className="h-16 bg-white/5 rounded-xl w-full" />
            <div className="h-32 bg-white/5 rounded-xl w-full" />
          </div>
        )}

        {/* Result Card or Empty State */}
        {!loading && hasSearched && (
          <div>
            {resultData ? (
              <div className="space-y-6">
                {/* Scorecard Header with Student Name, SGPA, Status */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#12142B] to-[#0A0B1E] border border-white/15 shadow-xl space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl sm:text-2xl font-black font-heading text-white">
                          {resultData.studentName}
                        </span>
                        <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {resultData.status}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-app-muted">
                        Enrollment: <strong className="text-white">{resultData.enrollmentNo}</strong> • {resultData.branchName} • Semester {resultData.semester}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
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
                        onClick={handleDownloadMarksheet}
                        icon={<Download className="w-3.5 h-3.5" />}
                      >
                        Download Marksheet
                      </Button>
                    </div>
                  </div>

                  {/* Highlights Metric Tiles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[11px] font-mono uppercase text-app-muted block">SGPA (Semester)</span>
                      <span className="text-2xl font-black font-heading text-[#FFC53D]">{resultData.sgpa}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[11px] font-mono uppercase text-app-muted block">Cumulative CGPA</span>
                      <span className="text-2xl font-black font-heading text-[#2DD4BF]">{resultData.cgpa}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[11px] font-mono uppercase text-app-muted block">Credits Earned</span>
                      <span className="text-2xl font-black font-heading text-white">{resultData.totalCredits}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[11px] font-mono uppercase text-app-muted block">Academic Classification</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 block mt-1.5">{resultData.division}</span>
                    </div>
                  </div>
                </div>

                {/* Subject-Wise Grade Table */}
                <div className="overflow-x-auto rounded-2xl border border-white/15 bg-[#0A0B1E]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-app-muted text-[11px] uppercase tracking-wider">
                        <th className="py-3.5 px-4 font-bold">Course Code & Subject Title</th>
                        <th className="py-3.5 px-4 font-bold text-center">Credits</th>
                        <th className="py-3.5 px-4 font-bold text-center">Internal (30)</th>
                        <th className="py-3.5 px-4 font-bold text-center">External (70)</th>
                        <th className="py-3.5 px-4 font-bold text-center">Total (100)</th>
                        <th className="py-3.5 px-4 font-bold text-center">Grade</th>
                        <th className="py-3.5 px-4 font-bold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-white">
                      {resultData.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold text-[#FFC53D] mr-2">
                              {sub.code}
                            </span>
                            <span className="font-heading font-bold text-sm text-white">
                              {sub.name}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center text-neutral-300">{sub.credits}</td>
                          <td className="py-3.5 px-4 text-center text-neutral-300">{sub.internal}</td>
                          <td className="py-3.5 px-4 text-center text-neutral-300">{sub.external}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-white">{sub.total}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-white/10 text-emerald-400">
                              {sub.grade}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="text-xs font-bold text-emerald-400">
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mandatory Disclaimer Box */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono text-app-muted flex items-start gap-3">
                  <ShieldAlert className="w-4 h-4 text-[#FFC53D] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-white">Disclaimer:</strong> The online result published above is provisional and intended for immediate information of students only. The official authenticated physical marksheet with security hologram is issued by the Examination Cell of HR University.
                  </p>
                </div>
              </div>
            ) : (
              /* Friendly Empty State */
              <div className="text-center py-12 px-6 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/20 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-app-muted">
                  <Award className="w-6 h-6 text-[#2DD4BF]" />
                </div>
                <h3 className="font-heading font-black text-lg text-white">
                  Result Has Not Been Declared Yet
                </h3>
                <p className="text-xs sm:text-sm text-app-muted max-w-md mx-auto leading-relaxed">
                  The examination evaluation for <strong className="text-white">{lastQueryBranchName} Semester {lastQuerySemester}</strong> is currently underway or has not been uploaded to the registry.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-app-muted bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    Results are published within 30 days of last paper completion.
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

export default ResultsSection;
