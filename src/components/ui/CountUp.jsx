import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

// Exponential ease out for high-impact cinematic deceleration
function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function CountUp({
  to = 100,
  from = 0,
  duration = 2000,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
  threshold = 0.2,
  onComplete,
  replayTrigger,
  replayOnClick = true,
  formatEnIn = true,
}) {
  const [currentValue, setCurrentValue] = useState(from);
  const elementRef = useRef(null);
  const textRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals]
  );

  const formatValue = useCallback(
    (val) => {
      const formatted = formatEnIn ? formatter.format(val) : val.toLocaleString();
      return `${prefix}${formatted}${suffix}`;
    },
    [formatEnIn, formatter, prefix, suffix]
  );

  const startAnimation = useCallback(() => {
    if (prefersReducedMotion) {
      setCurrentValue(to);
      if (textRef.current) {
        textRef.current.textContent = formatValue(to);
      }
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
      return;
    }

    isAnimatingRef.current = true;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const rawVal = from + (to - from) * easedProgress;

      const currentNum = decimals > 0 ? Number(rawVal.toFixed(decimals)) : Math.round(rawVal);

      // Direct DOM update: 0 React re-renders during high-frequency animation loop
      if (textRef.current) {
        textRef.current.textContent = formatValue(currentNum);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        isAnimatingRef.current = false;
        setCurrentValue(to);
        if (textRef.current) {
          textRef.current.textContent = formatValue(to);
        }
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    };

    requestAnimationFrame(step);
  }, [to, from, duration, decimals, prefersReducedMotion, formatValue]);

  // Initial IntersectionObserver trigger
  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          startAnimation();
        }
      },
      { threshold }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [startAnimation, threshold]);

  // Replay when replayTrigger changes
  useEffect(() => {
    if (replayTrigger !== undefined && hasAnimatedRef.current) {
      if (textRef.current) textRef.current.textContent = formatValue(from);
      setCurrentValue(from);
      startAnimation();
    }
  }, [replayTrigger, from, startAnimation, formatValue]);

  const handleClick = (e) => {
    if (replayOnClick && !isAnimatingRef.current) {
      e.stopPropagation();
      if (textRef.current) textRef.current.textContent = formatValue(from);
      setCurrentValue(from);
      startAnimation();
    }
  };

  const finalFormatted = formatEnIn
    ? formatter.format(to)
    : to.toLocaleString();

  return (
    <span
      ref={elementRef}
      onClick={handleClick}
      className={`tabular-nums inline-block select-none ${replayOnClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
      aria-label={`${prefix}${finalFormatted}${suffix}`}
      title={replayOnClick ? 'Click to replay counter' : undefined}
    >
      <span ref={textRef}>
        {formatValue(currentValue)}
      </span>
    </span>
  );
}

export default CountUp;
