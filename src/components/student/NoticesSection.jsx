import React, { useState, useEffect } from 'react';
import { BellRing, Search, Download, Pin } from 'lucide-react';
import { studentService } from '../../services/studentService';

export function NoticesSection() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const categories = ['All', 'Examinations', 'Academic', 'Venture & Aid', 'Campus & Hostel'];

  useEffect(() => {
    let ignore = false;
    studentService.getNotices({ search, category, date: dateFilter })
      .then((data) => {
        if (!ignore) {
          setNotices(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setNotices([]);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [category, search, dateFilter]);

  return (
    <section id="notices" className="mb-20 scroll-mt-32">
      <div className="p-6 sm:p-10 rounded-3xl bg-app-surface1 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF7A59]/40 bg-[#FF7A59]/10 text-[#FF7A59] font-mono text-xs uppercase tracking-widest mb-3">
              <BellRing className="w-3.5 h-3.5" />
              Circular Dispatch
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              1. NOTICES & OFFICIAL CIRCULARS
            </h2>
            <p className="text-xs sm:text-sm text-app-muted mt-1 max-w-xl">
              Filter official university circulars, academic orders, fee alerts, and examination regulations.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-app-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notices, exams, GPU..."
              className="w-full bg-[#0A0B1E] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-app-muted focus:border-hru-gold focus:outline-none"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0A0B1E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-hru-gold focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Notice Categories' : c}</option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date (e.g. Oct 2026)"
              className="w-full bg-[#0A0B1E] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-app-muted focus:border-hru-gold focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Notices Content */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-16 bg-white/5 rounded-2xl w-full" />
            <div className="h-16 bg-white/5 rounded-2xl w-full" />
          </div>
        ) : notices.length > 0 ? (
          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0A0B1E] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    {n.pinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#FFC53D]/20 text-[#FFC53D] px-2 py-0.5 rounded-full border border-[#FFC53D]/30">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                      {n.category}
                    </span>
                    <span className="text-xs font-mono text-app-muted">
                      {n.date}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      ✦ {n.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-sm sm:text-base text-white group-hover:text-hru-gold transition-colors">
                    {n.title}
                  </h3>
                  <p className="text-xs text-app-muted leading-relaxed line-clamp-2">
                    {n.summary}
                  </p>
                </div>

                <a
                  href={`#download-${n.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading circular document: ${n.title} (${n.fileSize})`);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white text-xs font-mono flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-hru-gold" />
                  <span>PDF ({n.fileSize})</span>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 rounded-2xl bg-[#0A0B1E] border border-dashed border-white/20 space-y-2">
            <BellRing className="w-8 h-8 text-app-muted mx-auto" />
            <h3 className="font-heading font-bold text-white text-base">No Circulars Published</h3>
            <p className="text-xs text-app-muted max-w-sm mx-auto">
              No recent notifications match your filter criteria. New administrative circulars are uploaded on weekdays by 05:00 PM.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default NoticesSection;
