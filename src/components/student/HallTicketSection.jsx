import React, { useState } from 'react';
import { Ticket, Search, Download, Printer, AlertCircle, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import { validateEnrollmentNumber } from '../../config/academics';
import { studentService } from '../../services/studentService';

export function HallTicketSection({ prefillEnrollment = '', prefillDob = '' }) {
  const [enrollmentInput, setEnrollmentInput] = useState(prefillEnrollment);
  const [dobInput, setDobInput] = useState(prefillDob);
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const validation = validateEnrollmentNumber(enrollmentInput);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    if (!dobInput) {
      setValidationError('Date of Birth is required to verify identity.');
      return;
    }

    setLoading(true);
    setHasQueried(true);

    try {
      const data = await studentService.getHallTicket({
        enrollmentNo: validation.value,
        dob: dobInput,
      });
      setTicketData(data);
    } catch {
      setTicketData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="hall-ticket" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#F472B6]/40 bg-[#F472B6]/10 text-[#F472B6] font-mono text-xs uppercase tracking-widest mb-3">
              <Ticket className="w-3.5 h-3.5" />
              Examination Entry Pass
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              4. HALL TICKET & ADMIT CARD
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Download and verify your digital hall ticket. Required for all theoretical, practical, and jury capstone examinations.
            </p>
          </div>
        </div>

        {/* Auth Verification Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-mono uppercase text-app-muted mb-2">
                Enrollment Number <span className="text-[#FF7A59]">*</span>
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

            <div>
              <label className="block text-xs font-mono uppercase text-app-muted mb-2">
                Date of Birth <span className="text-[#FF7A59]">*</span>
              </label>
              <input
                type="date"
                required
                value={dobInput}
                onChange={(e) => setDobInput(e.target.value)}
                className="w-full bg-[#0A0B1E] border border-white/15 focus:border-hru-gold rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none"
              />
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
                {loading ? 'Authenticating...' : 'Fetch Hall Ticket'}
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

        {loading && (
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded-lg w-1/3" />
            <div className="h-24 bg-white/5 rounded-xl w-full" />
          </div>
        )}

        {!loading && hasQueried && (
          <div>
            {ticketData ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12142B] to-[#0A0B1E] border-2 border-[#F472B6]/40 shadow-2xl space-y-6">
                {/* Admit Card Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-[#F472B6] font-bold uppercase tracking-widest block">
                      OFFICIAL ADMIT CARD // SPRING 2027
                    </span>
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                      {ticketData.studentName}
                    </h3>
                    <p className="text-xs font-mono text-app-muted">
                      Enrollment: <strong className="text-white">{ticketData.enrollmentNo}</strong> • Roll: <strong className="text-[#FFC53D]">{ticketData.examRollNo}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="glass" size="sm" onClick={handlePrint} icon={<Printer className="w-3.5 h-3.5" />}>
                      Print Pass
                    </Button>
                    <Button variant="gold" size="sm" onClick={handlePrint} icon={<Download className="w-3.5 h-3.5" />}>
                      Download Pass
                    </Button>
                  </div>
                </div>

                {/* Exam Center & Status Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-app-muted block uppercase text-[10px]">Examination Center</span>
                    <span className="text-white font-bold block mt-1">{ticketData.center}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-app-muted block uppercase text-[10px]">Reporting Windows</span>
                    <span className="text-white font-bold block mt-1">{ticketData.reportingTime}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-app-muted block uppercase text-[10px]">Verification Protocol</span>
                    <span className="text-emerald-400 font-bold block mt-1">{ticketData.verifiedStatus}</span>
                  </div>
                </div>

                {/* Authorized Papers Table */}
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-app-muted border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Subject Code & Paper</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Time</th>
                        <th className="py-2.5 px-3 text-center">Desk Seat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-white">
                      {ticketData.papers.map((p, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-bold">
                            <span className="text-[#FFC53D] mr-2">{p.code}</span>
                            {p.name}
                          </td>
                          <td className="py-2.5 px-3">{p.date}</td>
                          <td className="py-2.5 px-3">{p.time}</td>
                          <td className="py-2.5 px-3 text-center text-[#2DD4BF] font-black">{p.seat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Security Hologram & Instructions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono text-app-muted">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Cryptographically verified QR token attached. Tampering invalidates candidature.</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 font-mono text-[10px] text-neutral-300">
                    TOKEN: SHA256-HRU-2027-EXAM-VERIFIED
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-6 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/20 space-y-2">
                <Ticket className="w-8 h-8 text-app-muted mx-auto" />
                <h3 className="font-heading font-bold text-white text-base">Hall Ticket Not Generated Yet</h3>
                <p className="text-xs text-app-muted max-w-sm mx-auto">
                  No admit card record found for the provided credentials. Hall tickets are typically generated 7-10 days before exams upon fee and attendance clearance.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default HallTicketSection;
