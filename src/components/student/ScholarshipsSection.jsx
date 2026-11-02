import React, { useState } from 'react';
import { GraduationCap, Search } from 'lucide-react';
import Button from '../ui/Button';
import { validateEnrollmentNumber } from '../../config/academics';
import { studentService } from '../../services/studentService';

export function ScholarshipsSection({ prefillEnrollment = '' }) {
  const [enrollmentInput, setEnrollmentInput] = useState(prefillEnrollment);
  const [loading, setLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);
  const [scholarshipData, setScholarshipData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateEnrollmentNumber(enrollmentInput);
    if (!validation.valid) return;

    setLoading(true);
    setHasQueried(true);
    try {
      const data = await studentService.getScholarships({ enrollmentNo: validation.value });
      setScholarshipData(data);
    } catch {
      setScholarshipData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="scholarships" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-[#2DD4BF] font-mono text-xs uppercase tracking-widest mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              Fellowship Cell
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              7. SCHOLARSHIPS & FINANCIAL AID
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Inspect active tuition waivers, venture grants, research fellowships, and review renewal benchmarks.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row items-end gap-3 max-w-lg">
            <div className="w-full">
              <label className="block text-xs font-mono uppercase text-app-muted mb-2">
                Enrollment Number
              </label>
              <input
                type="text"
                required
                value={enrollmentInput}
                onChange={(e) => setEnrollmentInput(e.target.value.toUpperCase())}
                placeholder="e.g. HRU24AI108"
                className="w-full bg-[#0A0B1E] border border-white/15 focus:border-hru-gold rounded-xl px-4 py-3 text-sm text-white font-mono uppercase focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={loading}
              className="h-[46px] shrink-0"
              icon={<Search className="w-4 h-4" />}
            >
              {loading ? 'Checking...' : 'Check Status'}
            </Button>
          </div>
        </form>

        {loading && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 animate-pulse space-y-3">
            <div className="h-6 bg-white/10 rounded w-1/3" />
            <div className="h-16 bg-white/5 rounded w-full" />
          </div>
        )}

        {!loading && hasQueried && (
          <div>
            {scholarshipData && scholarshipData.activeScholarship ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12142B] to-[#0A0B1E] border border-[#2DD4BF]/40 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-mono text-[#2DD4BF] font-bold uppercase tracking-wider block">
                      AWARDED FELLOWSHIP
                    </span>
                    <h3 className="font-heading font-black text-xl text-white mt-1">
                      {scholarshipData.activeScholarship.name}
                    </h3>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {scholarshipData.activeScholarship.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-app-muted block uppercase text-[10px]">Tuition Benefit</span>
                    <span className="text-base text-white font-bold block mt-1">{scholarshipData.activeScholarship.waiverPercent}</span>
                    <span className="text-emerald-400 text-[11px] mt-0.5 block">{scholarshipData.activeScholarship.annualBenefit}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-app-muted block uppercase text-[10px]">Renewal Benchmark</span>
                    <span className="text-white font-bold block mt-1">{scholarshipData.activeScholarship.cgpaRequirement}</span>
                    <span className="text-app-muted text-[11px] mt-0.5 block">Audit Cycle: Every June</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-app-muted block uppercase text-[10px]">Next Evaluation</span>
                    <span className="text-[#FFC53D] font-bold block mt-1">{scholarshipData.activeScholarship.nextRenewalDate}</span>
                    <span className="text-app-muted text-[11px] mt-0.5 block">Automated Senate Review</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-6 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/20 space-y-2">
                <GraduationCap className="w-8 h-8 text-app-muted mx-auto" />
                <h3 className="font-heading font-bold text-white text-base">No Active Scholarship on File</h3>
                <p className="text-xs text-app-muted max-w-sm mx-auto">
                  No ongoing financial fellowship attached to this enrollment ID. Merit grant applications reopen at the start of each semester.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default ScholarshipsSection;
