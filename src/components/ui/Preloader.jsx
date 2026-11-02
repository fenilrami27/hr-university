import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function Preloader({ onComplete }) {
  // Check if ?nointro is requested via URL query string
  const isNoIntro = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).has('nointro') ||
    new URLSearchParams(window.location.search).get('intro') === 'false'
  );

  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState('initial'); // 'initial' | 'gliding' | 'revealing' | 'done'
  const [, setHasIntroVideo] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoRef = useRef(null);
  const completedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setPhase('done');
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    if (onComplete) onComplete();
  }, [onComplete]);

  // If nointro is active, complete immediately
  useEffect(() => {
    if (isNoIntro) {
      handleFinish();
    }
  }, [isNoIntro, handleFinish]);

  useEffect(() => {
    if (isNoIntro) return;

    // Lock scroll during preloader
    document.body.style.overflow = 'hidden';

    // 3-second absolute failsafe: even if any script hangs, preloader MUST finish
    const failsafeTimeout = setTimeout(() => {
      handleFinish();
    }, 3000);

    // Fast 0.5s fade for prefers-reduced-motion
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        handleFinish();
      }, 500);
      return () => {
        clearTimeout(timer);
        clearTimeout(failsafeTimeout);
        document.body.style.overflow = '';
      };
    }

    const startTime = performance.now();
    let animFrame;
    let lastUpdate = 0;

    const tick = (now) => {
      const elapsed = now - startTime;

      // Phase 1: 0 to 400ms (count 0 -> ~40 in center)
      if (elapsed < 400) {
        setPhase('initial');
        if (now - lastUpdate > 30) {
          const p1 = elapsed / 400;
          setCount(Math.min(Math.round(p1 * 40), 40));
          lastUpdate = now;
        }
      }
      // Phase 2: 400ms to 1100ms (counter glides to bottom & counts 40 -> 100)
      else if (elapsed < 1100) {
        setPhase('gliding');
        if (now - lastUpdate > 30) {
          const p2 = (elapsed - 400) / 700;
          const currentCount = Math.min(Math.round(40 + p2 * 60), 100);
          setCount(currentCount);
          lastUpdate = now;
        }
      }
      // Phase 3: 1100ms to 1400ms (reveal / split curtain)
      else if (elapsed < 1400) {
        setPhase('revealing');
        setCount(100);
      } else {
        handleFinish();
        return;
      }

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(failsafeTimeout);
      document.body.style.overflow = '';
    };
  }, [isNoIntro, prefersReducedMotion, handleFinish]);

  if (isNoIntro) {
    return null;
  }

  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        onAnimationComplete={handleFinish}
        className="fixed inset-0 z-[100000] bg-[#0A0B1E] flex items-center justify-center text-white pointer-events-none"
      >
        <span className="font-heading text-2xl font-bold tracking-widest text-hru-gold">
          HR UNIVERSITY
        </span>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[100000] bg-[#0A0B1E] text-white select-none overflow-hidden flex flex-col justify-between hru-preloader-failsafe"
          style={{
            animation: 'hruHardPreloaderTimeout 6s forwards',
          }}
        >
          {/* Film Grain Texture inside preloader */}
          <div className="film-grain opacity-[0.05]" />

          {/* Top Bar: Brand Identifier + Skip Button */}
          <div className="relative z-20 flex items-center justify-between p-6 sm:p-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#5B5BF0] via-[#8B5CF6] to-[#22D3EE] flex items-center justify-center font-bold text-xs text-white">
                HRU
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#A4A8C4]">
                CAMPUS OS // V3.2
              </span>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="px-4 py-1.5 rounded-full border border-white/20 hover:border-hru-gold text-xs font-mono uppercase tracking-wider text-white hover:text-hru-gold transition-colors backdrop-blur-md bg-white/10 cursor-pointer shadow-lg active:scale-95"
            >
              Skip Intro ➔
            </button>
          </div>

          {/* Central Middle Area */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center px-4">
            {phase === 'initial' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="text-[12rem] sm:text-[18rem] md:text-[22rem] font-black font-heading leading-none tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white via-[#F4F5FB] to-white/20">
                  {count}
                </div>
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-hru-gold -mt-6 sm:-mt-10">
                  CALIBRATING QUANTUM CAMPUS
                </div>
              </motion.div>
            )}

            {(phase === 'gliding' || phase === 'revealing') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7, filter: 'blur(16px)' }}
                animate={{
                  opacity: 1,
                  scale: phase === 'revealing' ? 3.5 : 1,
                  filter: 'blur(0px)',
                }}
                transition={{
                  duration: phase === 'revealing' ? 0.8 : 1.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex flex-col items-center justify-center"
              >
                <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-3xl overflow-hidden border border-white/10 bg-[#12142B]/80 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                  <video
                    ref={videoRef}
                    src="/videos/intro.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-20 filter brightness-110"
                    onError={() => setHasIntroVideo(false)}
                    onLoadedData={() => setHasIntroVideo(true)}
                  />

                  <div className="absolute inset-0 bg-gradient-to-tr from-[#5B5BF0]/40 via-[#8B5CF6]/30 to-[#22D3EE]/30 animate-pulse" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,197,61,0.18),transparent_60%)]" />

                  <svg
                    width="220"
                    height="120"
                    viewBox="0 0 220 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                  >
                    <defs>
                      <linearGradient id="introAurora" x1="0" y1="0" x2="220" y2="120" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#5B5BF0" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#22D3EE" />
                      </linearGradient>
                    </defs>

                    <motion.text
                      x="110"
                      y="80"
                      fill="url(#introAurora)"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeDasharray="400"
                      initial={{ strokeDashoffset: 400, fillOpacity: 0 }}
                      animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
                      transition={{ duration: 2.2, ease: 'easeInOut' }}
                      fontSize="64"
                      fontWeight="900"
                      fontFamily="'Space Grotesk', sans-serif"
                      textAnchor="middle"
                      letterSpacing="4"
                    >
                      HRU
                    </motion.text>
                  </svg>

                  <motion.div
                    animate={{ x: [-200, 400] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex items-center gap-2 font-mono text-xs text-[#A4A8C4] uppercase tracking-widest"
                >
                  <span className="w-2 h-2 rounded-full bg-hru-gold animate-ping" />
                  <span>HR UNIVERSITY BRAND ESSENCE</span>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Bottom Bar: Glided Counter & Progress Indicator */}
          <div className="relative z-20 p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="font-heading font-black text-3xl sm:text-4xl text-hru-gold tabular-nums">
                {count}%
              </div>
              <div className="text-left">
                <div className="text-xs font-mono uppercase tracking-widest text-white">
                  Loading campus environment
                </div>
                <div className="text-[10px] font-mono text-[#A4A8C4]">
                  STUDIOS • RESEARCH LABS • VENTURE FUND
                </div>
              </div>
            </div>

            <div className="w-full sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#5B5BF0] via-[#8B5CF6] to-hru-gold"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>

          <style>{`
            @keyframes hruHardPreloaderTimeout {
              0%, 90% { opacity: 1; pointer-events: auto; }
              100% { opacity: 0; pointer-events: none; visibility: hidden; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Preloader;
