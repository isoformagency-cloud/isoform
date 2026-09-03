import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import gsap from "gsap";

import cottageWarm from "@/assets/gallery-dining.jpg";
import lounge from "@/assets/about-lobby.jpg";
import cottageNeon from "@/assets/gallery-pool.jpg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wings Resort — Heritage Stays in the Ooty Mist" },
      {
        name: "description",
        content:
          "A premium hillside retreat in Ooty. Wooden cottages, A-frame chalets and heritage suites wrapped in pine mist and warm hospitality.",
      },
      { property: "og:title", content: "Wings Resort — Heritage Stays in the Ooty Mist" },
      {
        property: "og:description",
        content:
          "A premium hillside retreat in Ooty. Wooden cottages, A-frame chalets and heritage suites wrapped in pine mist and warm hospitality.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar transparentOnTop={true} />
      <HeroScrollSequence />
      <About />
      <RoomJourneyScrollSequence />
      <Footer />
    </div>
  );
}

const TOTAL_FRAMES = 150;

function getFrameUrl(index: number) {
  const frameNum = String(index + 1).padStart(3, "0");
  return `/sequence/ezgif-frame-${frameNum}.png`;
}

// Helper to render text with split character spans
function SplitTextElements({
  text,
  className = "",
  tag = "h1",
}: {
  text: string;
  className?: string;
  tag?: "h1" | "h2" | "p";
}) {
  const words = text.split(" ");
  const Tag = tag as any;

  return (
    <Tag className={`${className} perspective-1000 overflow-visible`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.26em] overflow-visible">
          {word.split("").map((char, cIdx) => (
            <span
              key={cIdx}
              className="gsap-char inline-block will-change-transform opacity-0"
              style={{ display: "inline-block" }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}

function HeroScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const phase3Ref = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Preload frames
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        const targetIndex = Math.round(targetFrameRef.current);
        if (i === targetIndex || (i === 0 && lastDrawnFrameRef.current === -1)) {
          drawFrame(targetIndex);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    function getLoadedImage(targetIndex: number) {
      const imgs = imagesRef.current;
      if (imgs[targetIndex] && imgs[targetIndex].complete && imgs[targetIndex].naturalWidth > 0) {
        return { img: imgs[targetIndex], index: targetIndex };
      }
      for (let i = targetIndex - 1; i >= 0; i--) {
        if (imgs[i] && imgs[i].complete && imgs[i].naturalWidth > 0) {
          return { img: imgs[i], index: i };
        }
      }
      for (let i = targetIndex + 1; i < TOTAL_FRAMES; i++) {
        if (imgs[i] && imgs[i].complete && imgs[i].naturalWidth > 0) {
          return { img: imgs[i], index: i };
        }
      }
      return null;
    }

    function drawFrame(frameIndex: number) {
      if (!canvas || !ctx) return;
      const result = getLoadedImage(frameIndex);
      if (!result) return;
      const { img, index: actualIndex } = result;

      if (actualIndex === lastDrawnFrameRef.current) return;

      const dpr = window.devicePixelRatio || 1;
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      if (canvas.width !== canvasWidth * dpr || canvas.height !== canvasHeight * dpr) {
        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvasWidth / canvasHeight;
      let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

      if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();

      lastDrawnFrameRef.current = actualIndex;
    }

    function updateScrollTarget() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;

      if (totalScrollableHeight <= 0) {
        targetFrameRef.current = 0;
        targetProgressRef.current = 0;
        return;
      }

      const scrolledDistance = -rect.top;
      const fraction = Math.min(1, Math.max(0, scrolledDistance / totalScrollableHeight));
      targetProgressRef.current = fraction;
      targetFrameRef.current = fraction * (TOTAL_FRAMES - 1);
    }

    // Direct GSAP DOM character updater (Zero React re-renders for buttery 120fps motion)
    function updateTextOverlays(prog: number) {
      // Calculate Phase Progresses
      const p1Prog = prog < 0.18 ? 1 : Math.max(0, 1 - (prog - 0.18) / 0.1);

      const p2Prog =
        prog < 0.26
          ? 0
          : prog < 0.38
          ? (prog - 0.26) / 0.12
          : prog < 0.56
          ? 1
          : Math.max(0, 1 - (prog - 0.56) / 0.1);

      const p3Prog =
        prog < 0.64
          ? 0
          : prog < 0.78
          ? (prog - 0.64) / 0.14
          : 1;

      // --- Update Phase 1 ---
      if (phase1Ref.current) {
        if (p1Prog > 0.001) {
          phase1Ref.current.style.display = "block";
          const chars = phase1Ref.current.querySelectorAll(".gsap-char");
          chars.forEach((char, index) => {
            const charDelay = index * 0.014;
            const charProg = Math.min(1, Math.max(0, (p1Prog - charDelay * 0.3) / (1 - charDelay * 0.3)));

            gsap.set(char, {
              y: (1 - charProg) * 30,
              opacity: Math.min(1, charProg * 2.2),
              filter: `blur(${(1 - charProg) * 10}px)`,
              rotateX: (1 - charProg) * -32,
              scale: 0.9 + charProg * 0.1,
              transformOrigin: "50% 100%",
              force3D: true,
            });
          });

          // Non-split elements in phase 1
          const sub = phase1Ref.current.querySelector(".gsap-sub");
          if (sub) {
            gsap.set(sub, {
              opacity: p1Prog,
              y: (1 - p1Prog) * -12,
            });
          }
          const desc = phase1Ref.current.querySelector(".gsap-desc");
          if (desc) {
            gsap.set(desc, {
              opacity: p1Prog,
              y: (1 - p1Prog) * 18,
              filter: `blur(${(1 - p1Prog) * 8}px)`,
            });
          }
          const cta = phase1Ref.current.querySelector(".gsap-cta");
          if (cta) {
            gsap.set(cta, {
              opacity: p1Prog,
              y: (1 - p1Prog) * 22,
            });
          }
        } else {
          phase1Ref.current.style.display = "none";
        }
      }

      // --- Update Phase 2 ---
      if (phase2Ref.current) {
        if (p2Prog > 0.001) {
          phase2Ref.current.style.display = "block";
          const chars = phase2Ref.current.querySelectorAll(".gsap-char");
          chars.forEach((char, index) => {
            const charDelay = index * 0.016;
            const charProg = Math.min(1, Math.max(0, (p2Prog - charDelay * 0.35) / (1 - charDelay * 0.35)));

            gsap.set(char, {
              y: (1 - charProg) * 34,
              opacity: Math.min(1, charProg * 2.2),
              filter: `blur(${(1 - charProg) * 12}px)`,
              rotateX: (1 - charProg) * -35,
              scale: 0.88 + charProg * 0.12,
              transformOrigin: "50% 100%",
              force3D: true,
            });
          });

          const sub = phase2Ref.current.querySelector(".gsap-sub");
          if (sub) {
            gsap.set(sub, {
              opacity: p2Prog,
              y: (1 - p2Prog) * -12,
            });
          }
          const desc = phase2Ref.current.querySelector(".gsap-desc");
          if (desc) {
            gsap.set(desc, {
              opacity: p2Prog,
              y: (1 - p2Prog) * 18,
              filter: `blur(${(1 - p2Prog) * 8}px)`,
            });
          }
        } else {
          phase2Ref.current.style.display = "none";
        }
      }

      // --- Update Phase 3 ---
      if (phase3Ref.current) {
        if (p3Prog > 0.001) {
          phase3Ref.current.style.display = "block";
          const chars = phase3Ref.current.querySelectorAll(".gsap-char");
          chars.forEach((char, index) => {
            const charDelay = index * 0.018;
            const charProg = Math.min(1, Math.max(0, (p3Prog - charDelay * 0.35) / (1 - charDelay * 0.35)));

            gsap.set(char, {
              y: (1 - charProg) * 34,
              opacity: Math.min(1, charProg * 2.2),
              filter: `blur(${(1 - charProg) * 12}px)`,
              rotateX: (1 - charProg) * -35,
              scale: 0.88 + charProg * 0.12,
              transformOrigin: "50% 100%",
              force3D: true,
            });
          });

          const sub = phase3Ref.current.querySelector(".gsap-sub");
          if (sub) {
            gsap.set(sub, {
              opacity: p3Prog,
              y: (1 - p3Prog) * -12,
            });
          }
          const desc = phase3Ref.current.querySelector(".gsap-desc");
          if (desc) {
            gsap.set(desc, {
              opacity: p3Prog,
              y: (1 - p3Prog) * 18,
              filter: `blur(${(1 - p3Prog) * 8}px)`,
            });
          }
          const cta = phase3Ref.current.querySelector(".gsap-cta");
          if (cta) {
            gsap.set(cta, {
              opacity: p3Prog,
              y: (1 - p3Prog) * 22,
            });
          }
        } else {
          phase3Ref.current.style.display = "none";
        }
      }
    }

    let animationId: number;
    function startLoop() {
      function animate() {
        // Ultra-smooth Lerp physics (0.09 factor) for buttery inertia
        const frameDiff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(frameDiff) > 0.001) {
          currentFrameRef.current += frameDiff * 0.09;
        } else {
          currentFrameRef.current = targetFrameRef.current;
        }

        const progDiff = targetProgressRef.current - currentProgressRef.current;
        if (Math.abs(progDiff) > 0.0001) {
          currentProgressRef.current += progDiff * 0.09;
        } else {
          currentProgressRef.current = targetProgressRef.current;
        }

        const frameToDraw = Math.round(currentFrameRef.current);
        const clampedFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, frameToDraw));
        drawFrame(clampedFrame);

        updateTextOverlays(currentProgressRef.current);

        animationId = requestAnimationFrame(animate);
      }
      animationId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      lastDrawnFrameRef.current = -1;
      updateScrollTarget();
    };

    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("resize", handleResize);

    updateScrollTarget();
    startLoop();

    return () => {
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-[350vh] w-full bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none z-10" />

        <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 pt-32 text-white">
          {/* Phase 1 Overlay: Main Hero */}
          <div ref={phase1Ref} className="pointer-events-auto">
            <p className="gsap-sub text-xs uppercase tracking-[0.4em] text-white/80">
              Nilgiris · Est. 2011
            </p>

            <SplitTextElements
              text="A quiet heritage stay wrapped in the Ooty mist."
              tag="h1"
              className="mt-4 max-w-4xl font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl text-white"
            />

            <p className="gsap-desc mt-6 max-w-xl text-lg text-white/85">
              Wooden cottages, A-frame chalets and hillside suites, hand-tended by a family that has
              hosted travellers here for three generations.
            </p>

            <div className="gsap-cta mt-10 flex flex-wrap gap-4">
              <Link
                to="/book"
                className="rounded-full bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-xl active:scale-95"
              >
                Check availability
              </Link>
              <Link
                to="/rooms"
                className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
              >
                Explore rooms
              </Link>
            </div>
          </div>

          {/* Phase 2 Overlay: Lobby & Architecture */}
          <div ref={phase2Ref} className="pointer-events-auto" style={{ display: "none" }}>
            <p className="gsap-sub text-xs uppercase tracking-[0.4em] text-secondary font-semibold">
              Step Inside
            </p>

            <SplitTextElements
              text="The Grand Lobby & Fireside Hearth."
              tag="h2"
              className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl md:text-6xl text-white"
            />

            <p className="gsap-desc mt-5 max-w-xl text-lg text-white/90 leading-relaxed">
              Hand-carved timber, double-height triangular windows, and warm hearth light designed
              for cool Nilgiri evenings.
            </p>
          </div>

          {/* Phase 3 Overlay: Transition to Grounds */}
          <div ref={phase3Ref} className="pointer-events-auto" style={{ display: "none" }}>
            <p className="gsap-sub text-xs uppercase tracking-[0.4em] text-secondary font-semibold">
              Explore Wings Resort
            </p>

            <SplitTextElements
              text="Your Sanctuary in the Hills."
              tag="h2"
              className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl md:text-6xl text-white"
            />

            <p className="gsap-desc mt-5 max-w-xl text-lg text-white/90 leading-relaxed">
              Scroll down to discover our pinewood accommodations, organic dining, and garden grounds.
            </p>

            <div className="gsap-cta mt-8">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground shadow-lg transition-all hover:bg-secondary/90 active:scale-95"
              >
                <span>Reserve Your Stay</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="grid gap-16 md:grid-cols-2 md:items-center">
        <div className="reveal">
          <p className="text-xs uppercase tracking-[0.35em] text-secondary">Our House</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-primary leading-tight">
            Rooted in the hills, restored with care.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Wings Resort sits above a sloping tea estate, ten minutes from Ooty lake. The main house
            is heritage stone; the cottages are hand-built pinewood — every plank cut, cured and
            joined on site.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Mornings begin with filter coffee on the verandah and end with a bonfire under the
            eucalyptus. It is the kind of place where the phone signal fades and no one minds.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              ["12", "Rooms & cottages"],
              ["3", "Acres of garden"],
              ["4.9", "Guest rating"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl text-primary">{n}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {l}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-secondary transition-colors shadow-sm"
            >
              <span>View Accommodations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <span>View Property</span>
            </Link>
          </div>
        </div>

        <div className="reveal grid grid-cols-2 gap-4">
          <img
            src={lounge}
            alt="Wings Resort lounge with triangular gable window"
            className="col-span-2 aspect-[4/3] w-full rounded-2xl object-cover shadow-md"
          />
          <img
            src={cottageWarm}
            alt="Wooden cottage lit at dusk"
            className="aspect-square w-full rounded-2xl object-cover shadow-md"
          />
          <img
            src={cottageNeon}
            alt="Cottage exterior at night with coloured lights"
            className="aspect-square w-full rounded-2xl object-cover shadow-md"
          />
        </div>
      </div>
    </section>
  );
}

function getFrameUrl2(index: number) {
  const frameNum = String(index + 1).padStart(3, "0");
  return `/sequence-2/ezgif-frame-${frameNum}.png`;
}

function RoomJourneyScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl2(i);
      img.onload = () => {
        const targetIndex = Math.round(targetFrameRef.current);
        if (i === targetIndex || (i === 0 && lastDrawnFrameRef.current === -1)) {
          drawFrame(targetIndex);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    function getLoadedImage(targetIndex: number) {
      const imgs = imagesRef.current;
      if (imgs[targetIndex] && imgs[targetIndex].complete && imgs[targetIndex].naturalWidth > 0) {
        return { img: imgs[targetIndex], index: targetIndex };
      }
      for (let i = targetIndex - 1; i >= 0; i--) {
        if (imgs[i] && imgs[i].complete && imgs[i].naturalWidth > 0) {
          return { img: imgs[i], index: i };
        }
      }
      for (let i = targetIndex + 1; i < TOTAL_FRAMES; i++) {
        if (imgs[i] && imgs[i].complete && imgs[i].naturalWidth > 0) {
          return { img: imgs[i], index: i };
        }
      }
      return null;
    }

    function drawFrame(frameIndex: number) {
      if (!canvas || !ctx) return;
      const result = getLoadedImage(frameIndex);
      if (!result) return;
      const { img, index: actualIndex } = result;

      if (actualIndex === lastDrawnFrameRef.current) return;

      const dpr = window.devicePixelRatio || 1;
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      if (canvas.width !== canvasWidth * dpr || canvas.height !== canvasHeight * dpr) {
        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvasWidth / canvasHeight;
      let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

      if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      ctx.restore();

      lastDrawnFrameRef.current = actualIndex;
    }

    function updateScrollTarget() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;

      if (totalScrollableHeight <= 0) {
        targetFrameRef.current = 0;
        targetProgressRef.current = 0;
        return;
      }

      const scrolledDistance = -rect.top;
      const fraction = Math.min(1, Math.max(0, scrolledDistance / totalScrollableHeight));
      targetProgressRef.current = fraction;
      targetFrameRef.current = fraction * (TOTAL_FRAMES - 1);
    }

    function updateTextOverlays(prog: number) {
      const p1Prog = prog < 0.25 ? 1 : Math.max(0, 1 - (prog - 0.25) / 0.15);
      const p2Prog = prog < 0.42 ? 0 : Math.min(1, (prog - 0.42) / 0.22);

      if (phase1Ref.current) {
        if (p1Prog > 0.001) {
          phase1Ref.current.style.display = "block";
          const chars = phase1Ref.current.querySelectorAll(".gsap-char");
          chars.forEach((char, index) => {
            const charDelay = index * 0.014;
            const charProg = Math.min(1, Math.max(0, (p1Prog - charDelay * 0.3) / (1 - charDelay * 0.3)));

            gsap.set(char, {
              y: (1 - charProg) * 30,
              opacity: Math.min(1, charProg * 2.2),
              filter: `blur(${(1 - charProg) * 10}px)`,
              rotateX: (1 - charProg) * -32,
              scale: 0.9 + charProg * 0.1,
              transformOrigin: "50% 100%",
              force3D: true,
            });
          });

          const sub = phase1Ref.current.querySelector(".gsap-sub");
          if (sub) {
            gsap.set(sub, { opacity: p1Prog, y: (1 - p1Prog) * -12 });
          }
          const desc = phase1Ref.current.querySelector(".gsap-desc");
          if (desc) {
            gsap.set(desc, { opacity: p1Prog, y: (1 - p1Prog) * 18, filter: `blur(${(1 - p1Prog) * 8}px)` });
          }
        } else {
          phase1Ref.current.style.display = "none";
        }
      }

      if (phase2Ref.current) {
        if (p2Prog > 0.001) {
          phase2Ref.current.style.display = "block";
          const chars = phase2Ref.current.querySelectorAll(".gsap-char");
          chars.forEach((char, index) => {
            const charDelay = index * 0.016;
            const charProg = Math.min(1, Math.max(0, (p2Prog - charDelay * 0.35) / (1 - charDelay * 0.35)));

            gsap.set(char, {
              y: (1 - charProg) * 34,
              opacity: Math.min(1, charProg * 2.2),
              filter: `blur(${(1 - charProg) * 12}px)`,
              rotateX: (1 - charProg) * -35,
              scale: 0.88 + charProg * 0.12,
              transformOrigin: "50% 100%",
              force3D: true,
            });
          });

          const sub = phase2Ref.current.querySelector(".gsap-sub");
          if (sub) {
            gsap.set(sub, { opacity: p2Prog, y: (1 - p2Prog) * -12 });
          }
          const desc = phase2Ref.current.querySelector(".gsap-desc");
          if (desc) {
            gsap.set(desc, { opacity: p2Prog, y: (1 - p2Prog) * 18, filter: `blur(${(1 - p2Prog) * 8}px)` });
          }
          const cta = phase2Ref.current.querySelector(".gsap-cta");
          if (cta) {
            gsap.set(cta, { opacity: p2Prog, y: (1 - p2Prog) * 22 });
          }
        } else {
          phase2Ref.current.style.display = "none";
        }
      }
    }

    let animationId: number;
    function startLoop() {
      function animate() {
        const frameDiff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(frameDiff) > 0.001) {
          currentFrameRef.current += frameDiff * 0.09;
        } else {
          currentFrameRef.current = targetFrameRef.current;
        }

        const progDiff = targetProgressRef.current - currentProgressRef.current;
        if (Math.abs(progDiff) > 0.0001) {
          currentProgressRef.current += progDiff * 0.09;
        } else {
          currentProgressRef.current = targetProgressRef.current;
        }

        const frameToDraw = Math.round(currentFrameRef.current);
        const clampedFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, frameToDraw));
        drawFrame(clampedFrame);

        updateTextOverlays(currentProgressRef.current);

        animationId = requestAnimationFrame(animate);
      }
      animationId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      lastDrawnFrameRef.current = -1;
      updateScrollTarget();
    };

    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("resize", handleResize);

    updateScrollTarget();
    startLoop();

    return () => {
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-[350vh] w-full bg-black border-t border-white/10">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 pointer-events-none z-10" />

        <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 pt-32 text-white">
          {/* Phase 1 Overlay: Corridor Walkthrough */}
          <div ref={phase1Ref} className="pointer-events-auto">
            <p className="gsap-sub text-xs uppercase tracking-[0.4em] text-secondary font-semibold">
              Passage to Tranquility
            </p>

            <SplitTextElements
              text="Crafted from Native Nilgiri Pine."
              tag="h2"
              className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl md:text-6xl text-white"
            />

            <p className="gsap-desc mt-5 max-w-xl text-lg text-white/90 leading-relaxed">
              Walk through hand-fitted timber corridors designed to buffer the mountain chill and embrace warm natural sunlight.
            </p>
          </div>

          {/* Phase 2 Overlay: Bedroom Climax + CTA */}
          <div ref={phase2Ref} className="pointer-events-auto" style={{ display: "none" }}>
            <p className="gsap-sub text-xs uppercase tracking-[0.4em] text-secondary font-semibold">
              Your Private Sanctuary
            </p>

            <SplitTextElements
              text="The Master Pinewood Chalet."
              tag="h2"
              className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-5xl md:text-6xl text-white"
            />

            <p className="gsap-desc mt-5 max-w-xl text-lg text-white/90 leading-relaxed">
              Pre-heated feather beds, panoramic mountain views, and quiet nights wrapped in the hillside mist.
            </p>

            <div className="gsap-cta mt-8">
              <Link
                to="/rooms"
                className="inline-flex items-center gap-3 rounded-full bg-secondary px-8 py-4 text-base font-semibold text-secondary-foreground shadow-2xl transition-all hover:bg-secondary/90 hover:scale-105 active:scale-95"
              >
                <span>Explore Our Rooms</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
