import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import CountUp from '../components/ui/CountUp';
import { Users, BookOpen, Globe2, TrendingUp, ArrowUpRight } from 'lucide-react';

export function StatsSection() {
  const cardRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const stats = [
    {
      id: 'students',
      value: 999,
      suffix: '+',
      label: 'Future Builders',
      sublabel: 'Undergrad & Master Fellows',
      description: 'Active engineers, researchers, and creators collaborating from all corners of India and abroad.',
      badge: '✦ +34% YoY ADMITS',
      gradient: 'from-[#FFC53D] via-[#FF9E4A] to-[#FF7A59]',
      glowColor: 'rgba(255, 122, 89, 0.35)',
      darkText: true,
      textColor: 'text-[#0A0B1E]',
      mutedTextColor: 'text-[#0A0B1E]/80',
      badgeBg: 'bg-[#0A0B1E]/15 text-[#0A0B1E] border-[#0A0B1E]/20',
      icon: Users,
      iconBg: 'bg-[#0A0B1E]/15 text-[#0A0B1E]',
      photo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
      photoAlt: 'HRU students collaborating on campus',
      confettiColors: ['#FFC53D', '#FF7A59', '#FFAA33', '#FFFFFF'],
    },
    {
      id: 'programs',
      value: 120,
      suffix: '+',
      label: 'Accredited Programs',
      sublabel: 'Degree & Studio Fellowships',
      description: 'Studio sprints, deep-tech specializations, and interdisciplinary AI minors with zero legacy exams.',
      badge: '⚡ STUDIO SPRINTS',
      gradient: 'from-[#5B5BF0] via-[#38BDF8] to-[#22D3EE]',
      glowColor: 'rgba(91, 91, 240, 0.4)',
      darkText: false,
      textColor: 'text-white',
      mutedTextColor: 'text-white/85',
      badgeBg: 'bg-white/15 text-white border-white/25',
      icon: BookOpen,
      iconBg: 'bg-white/15 text-white',
      photo: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
      photoAlt: 'High-tech academic library and labs',
      confettiColors: ['#5B5BF0', '#22D3EE', '#38BDF8', '#FFFFFF'],
    },
    {
      id: 'countries',
      value: 50,
      suffix: '+',
      label: 'Global Nationalities',
      sublabel: 'Diverse Peer Cohorts',
      description: 'A borderless student body co-founding startups and co-authoring high-impact research papers.',
      badge: '🌍 RESIDENCIES ACTIVE',
      gradient: 'from-[#22D3EE] via-[#2DD4BF] to-[#14B8A6]',
      glowColor: 'rgba(45, 212, 191, 0.4)',
      darkText: true,
      textColor: 'text-[#0A0B1E]',
      mutedTextColor: 'text-[#0A0B1E]/80',
      badgeBg: 'bg-[#0A0B1E]/15 text-[#0A0B1E] border-[#0A0B1E]/20',
      icon: Globe2,
      iconBg: 'bg-[#0A0B1E]/15 text-[#0A0B1E]',
      photo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      photoAlt: 'Diverse student group on university lawns',
      confettiColors: ['#22D3EE', '#2DD4BF', '#0D9488', '#FFFFFF'],
    },
    {
      id: 'placements',
      value: 98,
      suffix: '%',
      label: 'Venture & Career Rate',
      sublabel: '₹14.5 LPA Average Package',
      description: 'Graduates placed across top Indian and global hubs: Bengaluru, Pune, Hyderabad, and Silicon Valley.',
      badge: '🚀 ₹1.2 CR TOP OFFER',
      gradient: 'from-[#F472B6] via-[#FB7185] to-[#FF7A59]',
      glowColor: 'rgba(244, 114, 182, 0.4)',
      darkText: true,
      textColor: 'text-[#0A0B1E]',
      mutedTextColor: 'text-[#0A0B1E]/80',
      badgeBg: 'bg-[#0A0B1E]/15 text-[#0A0B1E] border-[#0A0B1E]/20',
      icon: TrendingUp,
      iconBg: 'bg-[#0A0B1E]/15 text-[#0A0B1E]',
      photo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
      photoAlt: 'Graduation celebration and commencement',
      confettiColors: ['#F472B6', '#FF7A59', '#FB7185', '#FFFFFF'],
    },
  ];

  const chips = [
    { text: '999+ Builders', color: 'bg-[#FFC53D]/15 text-[#FFC53D] border-[#FFC53D]/30', thumb: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=100&q=80' },
    { text: '120+ Studio Tracks', color: 'bg-[#22D3EE]/15 text-[#22D3EE] border-[#22D3EE]/30', thumb: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=100&q=80' },
    { text: '₹14.5 LPA Avg CTC', color: 'bg-[#C6FF3D]/15 text-[#A3E635] border-[#C6FF3D]/30', thumb: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=100&q=80' },
    { text: '50+ Global Nationalities', color: 'bg-[#2DD4BF]/15 text-[#2DD4BF] border-[#2DD4BF]/30', thumb: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=100&q=80' },
    { text: '₹50 Cr Venture Grants', color: 'bg-[#F472B6]/15 text-[#F472B6] border-[#F472B6]/30', thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=100&q=80' },
    { text: '18 Active Patents', color: 'bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30', thumb: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=100&q=80' },
  ];

  const handleConfetti = (idx) => {
    const el = cardRefs[idx]?.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    try {
      confetti({
        particleCount: 26,
        spread: 60,
        origin: { x, y },
        colors: stats[idx].confettiColors,
        ticks: 200,
        gravity: 1.1,
        scalar: 0.8,
        disableForReducedMotion: true,
      });
    } catch {
      // Fallback if canvas is unavailable
    }
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Pop Blobs & Faint Grid */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FFC53D]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-[420px] h-[420px] bg-[#22D3EE]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-[380px] h-[380px] bg-[#F472B6]/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Marquee Strip Above with Chips & Thumbnails */}
      <div className="mb-12 overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 py-2">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="inline-flex gap-4 whitespace-nowrap"
        >
          {[...chips, ...chips, ...chips].map((chip, idx) => (
            <div
              key={idx}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium backdrop-blur-md shadow-sm ${chip.color}`}
            >
              <img
                src={chip.thumb}
                alt=""
                className="w-4 h-4 rounded-full object-cover border border-white/30"
                loading="lazy"
              />
              <span>{chip.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 4 Colorful Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.id}
              ref={cardRefs[idx]}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="relative rounded-3xl overflow-hidden p-6 sm:p-7 flex flex-col justify-between group shadow-xl transition-all duration-300"
              style={{
                boxShadow: `0 14px 38px -8px ${stat.glowColor}`,
              }}
            >
              {/* Card Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} transition-transform duration-700 group-hover:scale-105`}
              />

              {/* Light film grain overlay on card */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay bg-black" />

              {/* Corner Arch-Masked Peeking Photo */}
              <div className="absolute -top-4 -right-4 w-32 h-36 rounded-b-[40px] rounded-tl-[40px] overflow-hidden border-2 border-white/30 shadow-lg transform rotate-6 transition-all duration-500 group-hover:rotate-0 group-hover:scale-110 pointer-events-none">
                <img
                  src={stat.photo}
                  alt={stat.photoAlt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Card Top Row: Colored Icon & Sticker Badge */}
              <div className="relative z-10 flex items-start justify-between mb-8 pr-16">
                <div
                  className={`w-12 h-12 rounded-2xl ${stat.iconBg} backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-sm`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              {/* Card Middle: Huge CountUp Number and Labels */}
              <div className="relative z-10 mb-4">
                <span
                  className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md mb-2 shadow-xs ${stat.badgeBg}`}
                >
                  {stat.badge}
                </span>

                <div
                  className={`text-5xl sm:text-6xl font-black font-heading tracking-tight leading-none ${stat.textColor} flex items-baseline drop-shadow-xs`}
                >
                  <CountUp
                    to={stat.value}
                    suffix={stat.suffix}
                    duration={2000}
                    className="font-black"
                    onComplete={() => handleConfetti(idx)}
                  />
                </div>

                <h3
                  className={`text-lg font-black font-heading mt-2 ${stat.textColor}`}
                >
                  {stat.label}
                </h3>
                <p className={`text-[11px] font-mono tracking-wide ${stat.mutedTextColor}`}>
                  {stat.sublabel}
                </p>
              </div>

              {/* Card Description */}
              <p
                className={`relative z-10 text-xs sm:text-sm leading-relaxed mt-2 ${stat.mutedTextColor}`}
              >
                {stat.description}
              </p>

              {/* Card Footer Row */}
              <div
                className={`relative z-10 mt-6 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono font-semibold ${stat.mutedTextColor}`}
              >
                <span>VERIFIED 2026/27</span>
                <span className="inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  EXPLORE <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default StatsSection;
