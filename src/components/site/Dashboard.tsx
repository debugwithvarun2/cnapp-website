/**
 * Marketing hero console — full CNAPP login showcase at design size,
 * fluid-scaled to the host width so the product layout stays intact.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LoginMockConsole } from "./login-console/LoginMockConsole";
import "./login-console/login-console.css";

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 820;

export function Dashboard({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      if (w < 40) return;
      // Fit design canvas to host; never upscale past 1 so UI stays crisp.
      setScale(Math.max(0.32, Math.min(1, w / DESIGN_WIDTH)));
    };

    update();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(update);
    });
    ro.observe(el);
    window.addEventListener("orientationchange", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const frameW = DESIGN_WIDTH * scale;
  const frameH = DESIGN_HEIGHT * scale;

  return (
    <div
      ref={hostRef}
      className={cn("relative z-20 w-full", className)}
      aria-label="Septer console preview"
    >
      <div
        className="relative mx-auto max-w-full overflow-hidden rounded-xl border border-white/10 bg-[#0B1220] shadow-dash"
        style={{ width: frameW, height: frameH }}
      >
        <div
          className="origin-top-left will-change-transform"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
          }}
        >
          <LoginMockConsole
            accent="var(--brand-primary)"
            width={DESIGN_WIDTH}
            height={DESIGN_HEIGHT}
          />
        </div>
      </div>
      <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        Illustrative demonstration data
      </p>
    </div>
  );
}

export function Signal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="none" aria-hidden>
      <path
        d="M4 16a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".55"
      />
      <path d="M8 16a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.8" fill="currentColor" />
    </svg>
  );
}
