import React, { useState } from 'react';
import { CreditCard, Search, Receipt } from 'lucide-react';
import Button from '../ui/Button';
import { validateEnrollmentNumber } from '../../config/academics';
import { studentService } from '../../services/studentService';

export function FeesSection({ prefillEnrollment = '' }) {
  const [enrollmentInput, setEnrollmentInput] = useState(prefillEnrollment);
  const [loading, setLoading] = useState(false);
  const [hasQueried, setHasQueried] = useState(false);
  const [feeData, setFeeData] = useState(null);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    const validation = validateEnrollmentNumber(enrollmentInput);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    setLoading(true);
    setHasQueried(true);
    try {
      const data = await studentService.getFeeDetails({ enrollmentNo: validation.value });
      setFeeData(data);
    } catch {
      setFeeData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="fees" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFC53D]/40 bg-[#FFC53D]/10 text-[#FFC53D] font-mono text-xs uppercase tracking-widest mb-3">
              <CreditCard className="w-3.5 h-3.5" />
              Bursar & Accounts Registry
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              6. FEE DETAILS, PAYMENT STATUS & RECEIPTS
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Inspect semester tuition clearance, computing facility fees, official payment receipts, and download bursar vouchers.
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
              {loading ? 'Checking...' : 'View Fee Ledger'}
            </Button>
          </div>
          {validationError && (
            <div className="mt-3 text-xs font-mono text-rose-400">
              {validationError}
            </div>
          )}
        </form>

        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 bg-white/5 rounded-2xl w-full" />
            <div className="h-20 bg-white/5 rounded-2xl w-full" />
          </div>
        )}

        {!loading && hasQueried && (
          <div>
            {feeData ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#0A0B1E] border border-white/10 gap-3">
                  <div>
                    <span className="font-heading font-black text-lg text-white">
                      {feeData.studentName} ({feeData.enrollmentNo})
                    </span>
                    <span className="text-xs font-mono text-app-muted block">
                      Semester {feeData.currentSemester} • Academic Year {feeData.academicYear}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ALL DUES CLEARED ({feeData.overallStatus})
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0A0B1E]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-app-muted border-b border-white/10">
                      <tr>
                        <th className="py-3 px-4">Transaction Ref</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Particulars</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-white">
                      {feeData.transactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4 text-[#FFC53D] font-bold">{tx.id}</td>
                          <td className="py-3 px-4 text-app-muted">{tx.date}</td>
                          <td className="py-3 px-4 font-sans font-medium text-white">{tx.description}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-400">{tx.amount}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => alert(`Downloading verified receipt: ${tx.receiptNo}`)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-hru-gold text-[11px] font-mono cursor-pointer"
                            >
                              <Receipt className="w-3 h-3" />
                              <span>{tx.receiptNo}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-6 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/20 space-y-2">
                <CreditCard className="w-8 h-8 text-app-muted mx-auto" />
                <h3 className="font-heading font-bold text-white text-base">No Fee Records Found</h3>
                <p className="text-xs text-app-muted max-w-sm mx-auto">
                  No payment entries or invoices found for this enrollment ID. Contact the bursar office at finance@hru.ac.in for inquiries.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeesSection;
