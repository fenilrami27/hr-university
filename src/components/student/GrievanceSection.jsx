import React, { useState, useEffect, useCallback } from 'react';
import { LifeBuoy, Send, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import { studentService } from '../../services/studentService';

export function GrievanceSection() {
  const [category, setCategory] = useState('IT & Lab Access');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [submitting, setSubmitting] = useState(false);
  const [newTicket, setNewTicket] = useState(null);
  const [tickets, setTickets] = useState([]);

  const loadTickets = useCallback(async () => {
    const list = await studentService.getGrievances();
    setTickets(list || []);
  }, []);

  useEffect(() => {
    let mounted = true;
    studentService.getGrievances().then((list) => {
      if (mounted) setTickets(list || []);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setNewTicket(null);
    try {
      const res = await studentService.submitGrievance({
        category,
        subject,
        description,
        priority,
      });
      if (res.success) {
        setNewTicket(res.record);
        setSubject('');
        setDescription('');
        await loadTickets();
      }
    } catch {
      alert('Error registering support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="grievance" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#F472B6]/40 bg-[#F472B6]/10 text-[#F472B6] font-mono text-xs uppercase tracking-widest mb-3">
              <LifeBuoy className="w-3.5 h-3.5" />
              Student Ombudsman & Support Cell
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              13. STUDENT GRIEVANCE & HELP DESK
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Lodge confidential support tickets regarding examinations, lab hardware allocations, hostel facilities, or administrative matters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-6 p-6 rounded-2xl bg-[#0A0B1E] border border-white/10 space-y-4">
            <h3 className="font-heading font-black text-base text-white">
              Create New Help Ticket
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-hru-gold focus:outline-none"
                >
                  <option value="IT & Lab Access">IT & GPU Supercomputing Access</option>
                  <option value="Examination & Marks">Examination & Marksheet Cell</option>
                  <option value="Hostel & Dining">Hostel & Dining Facilities</option>
                  <option value="Fee & Accounts">Fee Verification & Accounts</option>
                  <option value="Academic Advisory">Academic Advisory & Mentorship</option>
                  <option value="Anti-Harassment Cell">Confidential Redressal Cell</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-hru-gold focus:outline-none"
                >
                  <option value="Normal">Normal (24-48 business hours)</option>
                  <option value="Urgent">Urgent (Same-day review)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                Issue Summary / Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief title of the issue..."
                className="w-full bg-white/5 border border-white/15 focus:border-hru-gold rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-app-muted mb-1.5">
                Detailed Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue with relevant lab pod, transaction, or course details..."
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
              {submitting ? 'Lodging Ticket...' : 'Generate Support Ticket'}
            </Button>

            {newTicket && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-xs font-mono space-y-1">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Ticket Registered: {newTicket.ticketId}</span>
                </div>
                <p className="text-neutral-300 text-[11px]">
                  Your query has been queued for immediate review. Assigned to: {newTicket.category}.
                </p>
              </div>
            )}
          </form>

          {/* Ticket Tracking View */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-mono uppercase text-app-muted font-bold block">
              Active & Resolved Tickets
            </span>

            {tickets.length > 0 ? (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div
                    key={t.ticketId}
                    className="p-5 rounded-2xl bg-[#0A0B1E] border border-white/10 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#FFC53D]">{t.ticketId}</span>
                      <span className="text-app-muted">{t.date}</span>
                    </div>

                    <h4 className="font-heading font-black text-sm text-white">
                      {t.subject}
                    </h4>

                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
                        {t.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        t.status.includes('Resolved') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#FF7A59]/20 text-[#FF7A59]'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    {t.resolution && (
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] font-mono text-neutral-300">
                        <strong className="text-emerald-400 block mb-0.5">Response:</strong>
                        {t.resolution}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/15 text-center text-xs font-mono text-app-muted">
                No active help tickets on record. All systems operational.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GrievanceSection;
