import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * High-performance, zero-latency custom cursor.
 * - Hardware-accelerated direct DOM transforms (zero React re-render lag).
 * - Instant 1:1 physical mouse tracking on inner dot.
 * - Buttery-smooth, responsive spring-less lerp on outer follower ring.
 * - Touch & mobile safe: completely disabled on coarse pointer / touch devices.
 * - Respects prefers-reduced-motion.
 */
export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const containerRef = useRef(null);

  const [hasPointer, setHasPointer] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  const prefersReducedMotion = usePrefersReducedMotion();

  // Watch for device pointer capability changes (e.g., hybrid laptops)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    const handleMqlChange = (e) => setHasPointer(e.matches);
    mql.addEventListener('change', handleMqlChange);

    return () => mql.removeEventListener('change', handleMqlChange);
  }, []);

  useEffect(() => {
    if (!hasPointer || prefersReducedMotion) return;

    let rafId = null;
    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHovered = false;
    let isClicking = false;

    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    const containerEl = containerRef.current;

    if (!dotEl || !ringEl || !containerEl) return;

    // Animation frame loop for outer follower ring
    const render = () => {
      if (isVisible) {
        // Snappy lerp (0.42 factor = 95% settlement in ~4 frames at 60fps, 2 frames at 120fps)
        const factor = 0.42;
        ringX += (targetX - ringX) * factor;
        ringY += (targetY - ringY) * factor;

        // Instant zero-lag 1:1 tracking for the precision dot
        dotEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${
          isHovered ? 0 : isClicking ? 0.75 : 1
        })`;

        // Fluid, responsive follower ring
        ringEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
          isHovered ? 1.55 : isClicking ? 0.85 : 1
        })`;
      }

      rafId = requestAnimationFrame(render);
    };

    const updateDot = () => {
      dotEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${
        isHovered ? 0 : isClicking ? 0.75 : 1
      })`;
    };

    const handlePointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = targetX;
        ringY = targetY;
        containerEl.style.opacity = '1';
      }

      updateDot();
    };

    const handlePointerDown = () => {
      isClicking = true;
      updateDot();
    };

    const handlePointerUp = () => {
      isClicking = false;
      updateDot();
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, label, .cursor-pointer, [data-cursor-hover], summary'
      );
      isHovered = !!interactive;

      if (isHovered) {
        ringEl.style.backgroundColor = 'rgba(255, 197, 61, 0.16)';
        ringEl.style.borderColor = '#FFC53D';
      } else {
        ringEl.style.backgroundColor = 'transparent';
        ringEl.style.borderColor = 'var(--hru-gold, #FFC53D)';
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      containerEl.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible = true;
      containerEl.style.opacity = '1';
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId = requestAnimationFrame(render);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [hasPointer, prefersReducedMotion]);

  if (!hasPointer || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="hru-custom-cursor fixed inset-0 pointer-events-none z-[999999] opacity-0 transition-opacity duration-150 select-none"
      aria-hidden="true"
    >
      {/* Outer fluid follower ring */}
      <div
        ref={ringRef}
        className="hru-cursor-ring absolute top-0 left-0 w-8 h-8 rounded-full border border-hru-gold mix-blend-difference will-change-transform pointer-events-none transition-[background-color,border-color] duration-150 ease-out"
        style={{
          boxShadow: '0 0 14px rgba(255, 197, 61, 0.22)',
        }}
      />

      {/* Inner zero-latency precise center dot */}
      <div
        ref={dotRef}
        className="hru-cursor-dot absolute top-0 left-0 w-2 h-2 rounded-full bg-hru-gold shadow-gold-glow will-change-transform pointer-events-none"
      />
    </div>
  );
}

export default CustomCursor;
