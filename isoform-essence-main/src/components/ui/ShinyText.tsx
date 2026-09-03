import { useState, useCallback, useEffect, useRef, type FC } from 'react';
import './ShinyText.css';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  delay?: number;
}

export const ShinyText: FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 2.5,
  className = '',
  color = '#111111',
  shineColor = '#c86536',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const directionRef = useRef(direction === 'left' ? 1 : -1);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  const animationDuration = speed * 1000;
  const delayDuration = delay * 1000;

  useEffect(() => {
    directionRef.current = direction === 'left' ? 1 : -1;
    elapsedRef.current = 0;
  }, [direction]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      if (entry) {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          lastTimeRef.current = null;
          if (!rafRef.current && !disabled && !isPaused) {
            rafRef.current = requestAnimationFrame(update);
          }
        } else {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
          }
          lastTimeRef.current = null;
        }
      }
    }, { rootMargin: '80px 0px' });

    io.observe(el);

    const update = (time: number) => {
      if (!isVisibleRef.current || disabled || isPaused) {
        rafRef.current = 0;
        lastTimeRef.current = null;
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const deltaTime = Math.min(time - lastTimeRef.current, 100);
      lastTimeRef.current = time;
      elapsedRef.current += deltaTime;

      let p = 0;
      if (yoyo) {
        const cycleDuration = animationDuration + delayDuration;
        const fullCycle = cycleDuration * 2;
        const cycleTime = elapsedRef.current % fullCycle;

        if (cycleTime < animationDuration) {
          const raw = (cycleTime / animationDuration) * 100;
          p = directionRef.current === 1 ? raw : 100 - raw;
        } else if (cycleTime < cycleDuration) {
          p = directionRef.current === 1 ? 100 : 0;
        } else if (cycleTime < cycleDuration + animationDuration) {
          const reverseTime = cycleTime - cycleDuration;
          const raw = 100 - (reverseTime / animationDuration) * 100;
          p = directionRef.current === 1 ? raw : 100 - raw;
        } else {
          p = directionRef.current === 1 ? 0 : 100;
        }
      } else {
        const cycleDuration = animationDuration + delayDuration;
        const cycleTime = elapsedRef.current % cycleDuration;

        if (cycleTime < animationDuration) {
          const raw = (cycleTime / animationDuration) * 100;
          p = directionRef.current === 1 ? raw : 100 - raw;
        } else {
          p = directionRef.current === 1 ? 100 : 0;
        }
      }

      if (spanRef.current) {
        spanRef.current.style.backgroundPosition = `${150 - p * 2}% center`;
      }

      rafRef.current = requestAnimationFrame(update);
    };

    if (!disabled && !isPaused && isVisibleRef.current) {
      rafRef.current = requestAnimationFrame(update);
    }

    return () => {
      io.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      lastTimeRef.current = null;
    };
  }, [disabled, isPaused, animationDuration, delayDuration, yoyo]);

  const gradientStyle = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 40%, ${shineColor} 50%, ${color} 60%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundPosition: '150% center'
  };

  return (
    <span
      ref={spanRef}
      className={`shiny-text ${className}`.trim()}
      style={gradientStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </span>
  );
};

export default ShinyText;
