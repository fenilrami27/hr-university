import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Send, CheckCircle2, FileSearch, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { validateEnrollmentNumber } from '../../config/academics';
import { studentService } from '../../services/studentService';

export function ReEvaluationSection({ prefillEnrollment = '' }) {
  const [enrollmentInput, setEnrollmentInput] = useState(prefillEnrollment);
  const [subjectCode, setSubjectCode] = useState('AI-401');
  const [requestType, setRequestType] = useState('Re-evaluation');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [pastRequests, setPastRequests] = useState([]);

  const loadRequests = useCallback(async () => {
    const list = await studentService.getReEvaluations();
    setPastRequests(list || []);
  }, []);

  useEffect(() => {
    let ignore = false;
    studentService.getReEvaluations().then((list) => {
      if (!ignore) setPastRequests(list || []);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateEnrollmentNumber(enrollmentInput);
    if (!validation.valid) return;

    setSubmitting(true);
    setSuccessMessage(null);
    try {
      const res = await studentService.submitReEvaluation({
        enrollmentNo: validation.value,
        subjectCode,
        type: requestType,
        reason,
      });
      if (res.success) {
        setSuccessMessage(`Application ${res.record.id} lodged successfully. Scrutiny report will be updated within 14 business days.`);
        setReason('');
        await loadRequests();
      }
    } catch {
      alert('Failed to submit application. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="re-evaluation" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF7A59]/40 bg-[#FF7A59]/10 text-[#FF7A59] font-mono text-xs uppercase tracking-widest mb-3">
              <RotateCcw className="w-3.5 h-3.5" />
              Examination Scrutiny Cell
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              9. RE-EVALUATION & SUPPLEMENTARY (ATKT)
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Apply for answer script re-totaling, certified evaluation copies, or register for upcoming supplementary (ATKT) examination slots.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 rounded-2xl bg-[#0A0B1E] border border-white/10 space-y-4">
            <h3 className="font-heading font-black text-base text-white flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-hru-gold" />
              Lodge New Scrutiny or ATKT Application
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                  Enrollment Number
                </label>
                <input
                  type="text"
                  required
                  value={enrollmentInput}
                  onChange={(e) => setEnrollmentInput(e.target.value.toUpperCase())}
                  placeholder="e.g. HRU24AI108"
                  className="w-full bg-white/5 border border-white/15 focus:border-hru-gold rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                  Course Subject Code
                </label>
                <input
                  type="text"
                  required
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AI-401"
                  className="w-full bg-white/5 border border-white/15 focus:border-hru-gold rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                Service Type
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-hru-gold focus:outline-none"
              >
                <option value="Re-evaluation">Full Script Re-evaluation (₹750/paper)</option>
                <option value="Certified Copy">Certified Digital Copy of Answer Book (₹500/paper)</option>
                <option value="Supplementary ATKT">Supplementary (ATKT) Exam Registration (₹1000/paper)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                Grounds for Scrutiny / Justification
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Mention specific questions, totaling discrepancies, or semester context..."
                className="w-full bg-white/5 border border-white/15 focus:border-hru-gold rounded-xl p-3 text-xs text-white placeholder:text-app-muted focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={submitting}
              className="w-full justify-center"
              icon={<Send className="w-4 h-4" />}
            >
              {submitting ? 'Submitting Form...' : 'Submit & Pay Scrutiny Fee'}
            </Button>

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}
          </form>

          {/* Past Lodged Applications */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-mono uppercase text-app-muted font-bold block">
              Active Scrutiny Applications
            </span>

            {pastRequests.length > 0 ? (
              <div className="space-y-3">
                {pastRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl bg-[#0A0B1E] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#FFC53D]">{req.id}</span>
                      <span className="text-app-muted">{req.date}</span>
                    </div>
                    <div className="text-xs text-white font-bold">
                      {req.subjectCode} • {req.type} ({req.fee})
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                      <Clock className="w-3 h-3" />
                      <span>{req.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/15 text-center text-xs font-mono text-app-muted">
                No re-evaluation or ATKT applications filed this semester.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReEvaluationSection;
