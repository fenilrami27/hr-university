import React, { useState, useEffect, useCallback } from 'react';
import { FileBadge, Send, Download, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import { studentService } from '../../services/studentService';

export function CertificatesSection({ prefillEnrollment = '' }) {
  const [certType, setCertType] = useState('Bonafide Certificate');
  const [purpose, setPurpose] = useState('');
  const [urgency, setUrgency] = useState('Standard (3-5 business days)');
  const [certificates, setCertificates] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const loadCertificates = useCallback(async () => {
    const data = await studentService.getCertificates({ _enrollmentNo: prefillEnrollment });
    setCertificates(data || []);
  }, [prefillEnrollment]);

  useEffect(() => {
    let ignore = false;
    studentService.getCertificates({ _enrollmentNo: prefillEnrollment }).then((data) => {
      if (!ignore) setCertificates(data || []);
    });
    return () => {
      ignore = true;
    };
  }, [prefillEnrollment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    try {
      const res = await studentService.submitCertificateRequest({
        type: certType,
        purpose,
        urgency,
      });
      if (res.success) {
        setSuccess(`Request registered successfully under Ref: ${res.record.refNo}. Track below.`);
        setPurpose('');
        await loadCertificates();
      }
    } catch {
      alert('Error registering certificate request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="certificates" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#A78BFA]/40 bg-[#A78BFA]/10 text-[#A78BFA] font-mono text-xs uppercase tracking-widest mb-3">
              <FileBadge className="w-3.5 h-3.5" />
              Registrar Desk
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              10. CERTIFICATES & FORM REQUESTS
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Request digital bonafide certificates, no-objection certificates (NOC), transfer certificates (TC), migration documents, and student ID reissue.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Request Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-6 p-6 rounded-2xl bg-[#0A0B1E] border border-white/10 space-y-4">
            <h3 className="font-heading font-black text-base text-white">
              Request New Document
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                Certificate Type
              </label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-hru-gold focus:outline-none"
              >
                <option value="Bonafide Certificate">Bonafide Certificate (Education/Visa)</option>
                <option value="Hackathon NOC">Hackathon & Conference NOC</option>
                <option value="Transfer Certificate">Transfer Certificate (TC)</option>
                <option value="Migration Certificate">Migration Certificate</option>
                <option value="ID Card Replacement">Smart ID Card Reissue / Replacement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                Processing Priority
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-hru-gold focus:outline-none"
              >
                <option value="Standard (3-5 business days)">Standard Processing (3-5 Days, Free)</option>
                <option value="Tatkal / Priority (24h)">Tatkal Priority (24h Expedited, ₹250)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                Purpose / Addressing Authority
              </label>
              <textarea
                rows={2}
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Passport office verification, National hackathon team entry..."
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
              {submitting ? 'Lodging Request...' : 'Submit Request'}
            </Button>

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}
          </form>

          {/* Active Documents List */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-mono uppercase text-app-muted font-bold block">
              Requested Documents Status
            </span>

            {certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-[#0A0B1E] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-black text-sm text-white">
                          {cert.type}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
                          {cert.refNo}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-app-muted block">
                        Requested: {cert.requestDate} • Status: <strong className="text-emerald-400">{cert.status}</strong>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Downloading verified digital certificate: ${cert.refNo}`)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-hru-gold transition-colors shrink-0"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/15 text-center text-xs font-mono text-app-muted">
                No active document issuance requests on record.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CertificatesSection;
