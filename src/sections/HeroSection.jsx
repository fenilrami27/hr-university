import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Play,
  Sparkles,
  Cpu,
  Rocket,
  ShieldCheck,
  Globe2,
  Layers,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { SplitTextReveal } from '../components/ui/Reveal';
import VideoModal from '../components/ui/VideoModal';
import Doodle from '../components/ui/Doodle';
import mediaRegistry from '../data/media';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function HeroSection() {
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const reel = mediaRegistry.heroReel;
  const currentClip = reel[activeClipIndex];
  const videoRef = useRef(null);

  // Single clean timeout for clip transition: advances once every 5.5s (Zero 50ms re-render hammering)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const duration = currentClip.duration || 5500;
    const timer = setTimeout(() => {
      setActiveClipIndex((current) => (current + 1) % reel.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [activeClipIndex, prefersReducedMotion, reel.length, currentClip.duration]);

  const handleSelectClip = (index) => {
    setActiveClipIndex(index);
  };

  return (
    <>
      <section className="relative min-h-[100svh] h-[100svh] w-full flex items-center justify-center overflow-hidden pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-[#0A0B1E]">
        {/* Background Hero Reel (Crossfading clips with Ken Burns zoom) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            {!videoError && !prefersReducedMotion ? (
              <motion.div
                key={currentClip.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Slow Ken Burns Zoom Effect (1.00 to 1.08) */}
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.08 }}
                  transition={{ duration: 6, ease: 'easeOut' }}
                  className="w-full h-full"
                >
                  <video
                    ref={videoRef}
                    src={currentClip.video}
                    poster={currentClip.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onError={() => setVideoError(true)}
                    className="w-full h-full object-cover filter brightness-[0.40] contrast-105"
                  />
                </motion.div>
              </motion.div>
            ) : (
              /* Fallback Poster Image with Soft Ambient Aurora Glow */
              <motion.div
                key="poster-fallback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={currentClip.poster}
                  alt={currentClip.title}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-[0.36]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Left-to-Right Midnight Gradient & Bottom Blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B1E] via-[#0A0B1E]/75 to-[#0A0B1E]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B1E] via-[#0A0B1E]/50 to-transparent" />
          <div className="absolute inset-0 bg-[#5B5BF0]/5 mix-blend-color" />
        </div>

        {/* Ambient Multi-Spectral Depth Glows & Orbital Pattern Behind Hero */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden select-none">
          {/* Subtle Rotating Orbital Geometry Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-25">
            <svg
              className={`w-full h-full ${prefersReducedMotion ? '' : 'animate-spin'}`}
              style={{ animationDuration: '140s' }}
              viewBox="0 0 800 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Orbital Ring */}
              <circle cx="400" cy="400" r="380" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="6 14" />
              {/* Mid Orbital Ring */}
              <circle cx="400" cy="400" r="280" stroke="rgba(255,197,61,0.15)" strokeWidth="1" strokeDasharray="16 24" />
              {/* Inner Focus Ring */}
              <circle cx="400" cy="400" r="180" stroke="rgba(91,91,240,0.2)" strokeWidth="1.2" />

              {/* Orbital Nodes */}
              <circle cx="400" cy="20" r="4" fill="#FFC53D" />
              <circle cx="680" cy="400" r="3.5" fill="#22D3EE" />
              <circle cx="400" cy="780" r="4.5" fill="#8B5CF6" />
              <circle cx="120" cy="400" r="3.5" fill="#FF7A59" />

              {/* Compass Tick Crosshairs */}
              <line x1="400" y1="5" x2="400" y2="25" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <line x1="400" y1="775" x2="400" y2="795" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <line x1="5" y1="400" x2="25" y2="400" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              <line x1="775" y1="400" x2="795" y2="400" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Layered Ambient Light Flares */}
          <div className="absolute top-1/4 -left-20 w-[600px] h-[550px] bg-[#5B5BF0]/16 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-[500px] bg-[#22D3EE]/14 rounded-full blur-[150px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-[#FFC53D]/10 rounded-full blur-[160px]" />

          {/* Floating Stardust Motility Particles */}
          {!prefersReducedMotion && (
            <div className="absolute inset-0">
              {[
                { top: '20%', left: '15%', delay: 0, color: '#FFC53D' },
                { top: '35%', left: '85%', delay: 1.2, color: '#22D3EE' },
                { top: '70%', left: '22%', delay: 2.1, color: '#8B5CF6' },
                { top: '80%', left: '78%', delay: 0.8, color: '#FF7A59' },
                { top: '25%', left: '70%', delay: 1.8, color: '#C6FF3D' },
                { top: '65%', left: '12%', delay: 2.7, color: '#2DD4BF' },
              ].map((pt, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -25, 0],
                    opacity: [0.3, 0.9, 0.3],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    delay: pt.delay,
                    ease: 'easeInOut',
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    top: pt.top,
                    left: pt.left,
                    backgroundColor: pt.color,
                    boxShadow: `0 0 10px 2px ${pt.color}`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Institutional HUD Perimeter Stamps (Coordinates & Telemetry) */}
        <div className="absolute inset-x-8 top-28 hidden 2xl:flex items-center justify-between pointer-events-none select-none z-10 text-[10px] font-mono tracking-widest text-[#A4A8C4]/40">
          <span>// HRU.ACAD.OS v4.2 // 23.0225° N, 72.5714° E</span>
          <span>// H100 GPU BAY // 512 NODES ONLINE</span>
        </div>
        <div className="absolute inset-x-8 bottom-8 hidden 2xl:flex items-center justify-between pointer-events-none select-none z-10 text-[10px] font-mono tracking-widest text-[#A4A8C4]/40">
          <span>// PEDAGOGY: 100% STUDIO // ZERO EXAMS</span>
          <span>// MERIT FUND: &gt;90% FELLOWSHIP RATE</span>
        </div>

        {/* 4-Quadrant Flank Telemetry Glass Chips */}
        {/* Top-Right: 512x H100 Supercluster */}
        <div className="absolute top-36 right-6 lg:right-16 hidden md:block z-10 pointer-events-none">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="p-3.5 px-4 rounded-2xl bg-[#12142B]/85 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3 hover:border-white/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-hru-indigo/20 border border-hru-indigo/40 text-hru-indigo flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A4A8C4]">
                  Supercomputing Grid
                </span>
              </div>
              <div className="text-xs font-bold text-white">512x H100 GPU Nodes</div>
              <div className="text-[10px] font-mono text-emerald-400">3.2 PFLOPS FP8 // 94.2% Load</div>
            </div>
          </motion.div>
        </div>

        {/* Top-Left: ₹50 Cr Dedicated Seed Fund */}
        <div className="absolute top-36 left-6 lg:left-16 hidden md:block z-10 pointer-events-none">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="p-3.5 px-4 rounded-2xl bg-[#12142B]/85 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3 hover:border-white/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-hru-gold/20 border border-hru-gold/40 text-hru-gold flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A4A8C4]">
                Venture Syndicate
              </div>
              <div className="text-xs font-bold text-white">₹50 Cr Dedicated Seed Fund</div>
              <div className="text-[10px] font-mono text-hru-gold">24 Cohort Startups Backed</div>
            </div>
          </motion.div>
        </div>

        {/* Bottom-Left: 100% Studio Building */}
        <div className="absolute bottom-32 left-6 lg:left-16 hidden md:block z-10 pointer-events-none">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="p-3.5 px-4 rounded-2xl bg-[#12142B]/85 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3 hover:border-white/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A4A8C4]">
                Studio Pedagogy
              </div>
              <div className="text-xs font-bold text-white">100% Studio Building</div>
              <div className="text-[10px] font-mono text-emerald-300">0 Rote Exams • 1:6 Fellow Ratio</div>
            </div>
          </motion.div>
        </div>

        {/* Bottom-Right: Global Residencies */}
        <div className="absolute bottom-32 right-6 lg:right-16 hidden md:block z-10 pointer-events-none">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="p-3.5 px-4 rounded-2xl bg-[#12142B]/85 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3 hover:border-white/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A4A8C4]">
                Global Residencies
              </div>
              <div className="text-xs font-bold text-white">Tokyo • Berlin • SF • BLR</div>
              <div className="text-[10px] font-mono text-cyan-300">18 ECTS Credits Transfer</div>
            </div>
          </motion.div>
        </div>

        {/* Center Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Active Reel Scene Badge Chip */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-xs uppercase px-4 py-1.5 rounded-full border border-hru-gold/40 bg-hru-gold/15 text-hru-gold backdrop-blur-md shadow-gold-glow flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HRU Reel // Scene: <strong>{currentClip.label}</strong></span>
            </span>
          </div>

          {/* Word-by-Word Headline Reveal */}
          <div className="relative">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight leading-[1.02] text-white mb-6">
              <SplitTextReveal
                text="THE BORDERLESS UNIVERSITY FOR NEXT-WAVE BUILDERS."
                wordClassName="text-white hover:text-hru-gold transition-colors duration-200"
                delay={0.15}
              />
            </h1>

            {/* Hand-drawn scribble underline doodle */}
            <div className="absolute -bottom-2 right-12 hidden sm:block">
              <Doodle type="underline" width={180} height={20} color="var(--hru-gold)" />
            </div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-2xl text-base sm:text-lg md:text-xl text-[#CBD0E6] leading-relaxed mb-8"
          >
            Replace passive rote lectures with venture-scale studio building. Master artificial intelligence, spatial computing, synthetic biology, and algorithmic finance.
          </motion.p>

          {/* Instagram-Story-Style Progress Pips */}
          <div className="flex items-center justify-center gap-2.5 mb-8 w-full max-w-md">
            {reel.map((clip, idx) => {
              const isActive = idx === activeClipIndex;
              const isPast = idx < activeClipIndex;

              return (
                <button
                  key={clip.id}
                  type="button"
                  onClick={() => handleSelectClip(idx)}
                  className="flex-1 group py-2 focus:outline-none cursor-pointer"
                  aria-label={`Jump to ${clip.label} reel`}
                >
                  <div className="h-1 rounded-full bg-white/20 overflow-hidden relative">
                    {isActive ? (
                      <motion.div
                        key={`pip-active-${activeClipIndex}`}
                        className="h-full bg-hru-gold"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : (currentClip.duration || 5500) / 1000,
                          ease: 'linear',
                        }}
                      />
                    ) : (
                      <div
                        className={`h-full ${isPast ? 'bg-hru-gold w-full' : 'w-0'}`}
                      />
                    )}
                  </div>
                  <span className={`text-[10px] font-mono uppercase tracking-wider block text-center mt-1.5 transition-colors ${
                    isActive ? 'text-hru-gold font-bold' : 'text-[#A4A8C4] group-hover:text-white'
                  }`}>
                    {clip.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <Button
              to="/admissions"
              variant="gold"
              size="lg"
              magnetic
              className="w-full sm:w-auto shadow-gold-glow"
              icon={<ArrowUpRight className="w-5 h-5" />}
            >
              Apply for 2026 Cohort
            </Button>

            <Button
              variant="glass"
              size="lg"
              className="w-full sm:w-auto border-white/20 hover:border-white/40"
              onClick={() => setModalOpen(true)}
              icon={<Play className="w-4 h-4 text-hru-gold fill-hru-gold" />}
              iconPosition="left"
            >
              Take a Campus Tour
            </Button>
          </motion.div>

          {/* Bottom Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#CBD0E6]"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-hru-gold" />
              Global ECTS Credit Transfer Compatible
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span>Zero Standardized Testing</span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="text-hru-gold font-bold">Over 90% Merit Fellowship Rate</span>
          </motion.div>
        </div>
      </section>

      {/* Video Modal Player */}
      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoSrc="/videos/hero/hero-1.mp4"
        title="HR University — Silicon Campus Virtual Walkthrough"
      />
    </>
  );
}

export default HeroSection;
