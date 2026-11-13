import { useEffect, useRef } from 'react';
import { media } from '../../data/projects.js';
import { markIntroSeen, useIntro } from '../../lib/intro.jsx';
import { clamp01, prefersReducedMotion, trackScroll } from '../../lib/scroll.js';
import { HeaderBar } from '../Header.jsx';
import { Lockup } from '../Logo.jsx';

// "Scroll to come in": a light page with a laptop, a tablet and a phone.
// The laptop screen is the real hero, drawn small. Scrolling pushes the camera
// into that screen until it fills the viewport, and the site takes over.
//
// Layout and the starting pose are pure CSS (.intro-* in index.css); this
// component only maps scroll position to the zoom.
export default function IntroStage({ children }) {
  const { setIntroActive } = useIntro();
  const stageRef = useRef(null);
  const stickyRef = useRef(null);
  const sceneRef = useRef(null);
  const screenRef = useRef(null);
  const chromeRef = useRef(null);
  const tabletRef = useRef(null);
  const phoneRef = useRef(null);
  const tween = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    const sticky = stickyRef.current;

    if (prefersReducedMotion()) {
      // CSS has already laid the page out without the intro.
      markIntroSeen();
      setIntroActive(false);
      return undefined;
    }
    setIntroActive(true);

    const readPose = () => {
      const style = getComputedStyle(stage);
      const number = (name, fallback) => {
        const value = parseFloat(style.getPropertyValue(name));
        return Number.isFinite(value) ? value : fallback;
      };
      return { s0: number('--s0', 0.5), ty0: number('--ty0', 0), r0: number('--r0', 0) };
    };
    let pose = readPose();
    const onResize = () => {
      pose = readPose();
    };
    window.addEventListener('resize', onResize);

    let entered = null;
    const stop = trackScroll(stage, (rect) => {
      const distance = stage.offsetHeight - sticky.offsetHeight;
      const p = distance > 0 ? clamp01(-rect.top / distance) : 1;
      const e = p * p * (3 - 2 * p); // ease in and out of the push
      const done = p >= 0.999;

      // Exponential zoom reads as a constant-speed camera move.
      sceneRef.current.style.transform = done
        ? 'none'
        : `translate3d(0, ${((1 - e) * pose.ty0 * sticky.offsetHeight).toFixed(2)}px, 0) scale(${Math.pow(pose.s0, 1 - e).toFixed(5)})`;
      screenRef.current.style.borderRadius = done ? '0px' : `${((1 - e) * pose.r0 * window.innerWidth).toFixed(2)}px`;

      const chrome = clamp01(1 - p * 3.2);
      chromeRef.current.style.opacity = chrome.toFixed(3);
      chromeRef.current.style.visibility = chrome === 0 ? 'hidden' : 'visible';

      // the two side devices drift outwards a little faster than the zoom
      tabletRef.current.style.transform = `translate3d(${(-e * 50).toFixed(2)}%, ${(e * 12).toFixed(2)}%, 0)`;
      phoneRef.current.style.transform = `translate3d(${(e * 90).toFixed(2)}%, ${(e * 18).toFixed(2)}%, 0)`;

      if (done !== entered) {
        entered = done;
        stage.dataset.entered = String(done);
        setIntroActive(!done);
        if (done) markIntroSeen();
      }
    });

    return () => {
      stop();
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(tween.current);
      setIntroActive(false);
    };
  }, [setIntroActive]);

  const endOfIntro = () => stageRef.current.offsetHeight - stickyRef.current.offsetHeight + 1;
  const isEntered = () => stageRef.current?.dataset.entered === 'true';

  // Plays the scroll for people who click or press Enter instead of scrolling.
  const comeIn = ({ focusHeader = false } = {}) => {
    if (isEntered() || prefersReducedMotion()) return;
    cancelAnimationFrame(tween.current);
    const from = window.scrollY;
    const to = endOfIntro();
    const start = performance.now();
    const duration = 1500;

    const cancel = () => cancelAnimationFrame(tween.current);
    window.addEventListener('wheel', cancel, { passive: true, once: true });
    window.addEventListener('touchstart', cancel, { passive: true, once: true });

    const step = (now) => {
      const t = clamp01((now - start) / duration);
      window.scrollTo(0, from + (to - from) * t);
      if (t < 1) {
        tween.current = requestAnimationFrame(step);
        return;
      }
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      if (focusHeader) document.querySelector('.site-header a')?.focus({ preventScroll: true });
    };
    tween.current = requestAnimationFrame(step);
  };

  // Keyboard focus landing inside the small screen: skip straight to the site.
  const onFocusCapture = () => {
    if (isEntered() || prefersReducedMotion()) return;
    cancelAnimationFrame(tween.current);
    window.scrollTo(0, endOfIntro());
  };

  return (
    <div ref={stageRef} className="intro-stage">
      <div ref={stickyRef} className="intro-sticky">
        <div className="intro-bg intro-only" aria-hidden="true" />

        <div ref={chromeRef} className="intro-chrome intro-only">
          <div className="wrap flex h-[4.5rem] items-center justify-between lg:h-[5.5rem]">
            <Lockup tone="dark" />
            <p className="hidden text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-ink/70 sm:block">
              Digital • Design • Experience
            </p>
          </div>
          <button type="button" className="intro-hint" onClick={(event) => comeIn({ focusHeader: event.detail === 0 })}>
            <span className="hint-mouse">Scroll to come in</span>
            <span className="hint-touch">Swipe up to come in</span>
            <span className="intro-hint-line" aria-hidden="true" />
          </button>
        </div>

        <div ref={sceneRef} className="intro-scene">
          <div ref={tabletRef} className="intro-device intro-tablet intro-only" aria-hidden="true">
            <img src={media.introTablet} alt="" width="1200" height="750" decoding="async" />
          </div>
          <div className="intro-floor intro-only" aria-hidden="true" />
          <div className="intro-base intro-only" aria-hidden="true" />
          <div className="intro-bezel intro-only" aria-hidden="true" />

          {/* Clicking the small screen is a pointer shortcut; the hint button above is the accessible control. */}
          <div ref={screenRef} className="intro-screen" onClick={() => comeIn()} onFocusCapture={onFocusCapture}>
            <div className="header-replica intro-only" aria-hidden="true" inert>
              <HeaderBar decorative />
            </div>
            {children}
          </div>

          <div ref={phoneRef} className="intro-device intro-phone intro-only" aria-hidden="true">
            <img src={media.introPhone} alt="" width="390" height="844" decoding="async" />
          </div>
        </div>
      </div>
    </div>
  );
}
