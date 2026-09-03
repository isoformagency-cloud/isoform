import { useEffect, useRef, useState } from "react";
import { useMediaUrl } from "@/lib/media";
import { initGsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type MediaImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  ratio?: string;
  priority?: boolean;
  reveal?: boolean;
};

/**
 * Resolves a stored media reference and reveals it with a mask animation.
 * Falls back to a quiet placeholder frame when no media exists yet.
 */
export function MediaImage({
  src,
  alt,
  className,
  ratio = "4 / 3",
  priority = false,
  reveal = true,
}: MediaImageProps) {
  const url = useMediaUrl(src);
  const [loaded, setLoaded] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el || !reveal || prefersReducedMotion()) return;
    const { gsap } = initGsap();
    const ctx = gsap.context(() => {
      gsap.from(el, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reveal]);

  return (
    <div
      ref={frame}
      className={cn("relative overflow-hidden bg-secondary", className)}
      style={{ aspectRatio: ratio }}
    >
      {url ? (
        <img
          src={url}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out",
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]",
          )}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="eyebrow">No media</span>
        </div>
      )}
    </div>
  );
}
