import { useState } from "react";
import Prism from "@/components/ui/Prism";

type AnimationMode = "3drotate" | "hover" | "rotate";

export function HeroVisual() {
  const [mode, setMode] = useState<AnimationMode>("3drotate");

  return (
    <div className="group relative aspect-square w-full overflow-hidden rounded-sm border border-hairline bg-card/30 backdrop-blur-[2px] transition-colors hover:border-accent/40">
      <Prism
        key={mode}
        animationType={mode}
        timeScale={0.5}
        height={4.8}
        baseWidth={4.1}
        scale={2.6}
        hueShift={-0.8416}
        colorFrequency={0.6}
        noise={0.4}
        glow={1.1}
        suspendWhenOffscreen={true}
      />

      {/* Interactive mode selector overlay */}
      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-sm border border-hairline/60 bg-background/80 p-1 backdrop-blur-md transition-opacity duration-300">
        {(["3drotate", "hover", "rotate"] as const).map((animType) => (
          <button
            key={animType}
            type="button"
            onClick={() => setMode(animType)}
            className={`px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors ${
              mode === animType
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={`Set animation mode to ${animType}`}
          >
            {animType === "3drotate" ? "3D" : animType}
          </button>
        ))}
      </div>
    </div>
  );
}
