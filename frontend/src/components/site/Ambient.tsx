import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Custom cursor: small dot + trailing glow ring that grows over interactive elements. */
export function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30 });
  const ry = useSpring(y, { stiffness: 350, damping: 30 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a,button,[role=tab],[data-cursor]"));
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("has-cursor");
    };
  }, [reduce, x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-electric/60 bg-electric/10 glow-blue"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: hover ? 44 : 26, height: hover ? 44 : 26, opacity: hover ? 1 : 0.7 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-primary"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
    </>
  );
}

/** Lightweight canvas network of drifting nodes. Pauses offscreen. */
export function NetworkField({ className, dark }: { className?: string; dark?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0,
      h = 0,
      raf = 0,
      visible = true;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const count = window.innerWidth < 768 ? 22 : 48;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00025,
    }));
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const style = getComputedStyle(document.documentElement);
    const col = (
      dark ? style.getPropertyValue("--electric") : style.getPropertyValue("--primary")
    ).trim();
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
        }
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        const pi = pts[i]!;
        for (let j = i + 1; j < pts.length; j++) {
          const pj = pts[j]!;
          const dx = (pi.x - pj.x) * w,
            dy = (pi.y - pj.y) * h;
          const d = Math.hypot(dx, dy);
          if (d < 150) {
            ctx.globalAlpha = (1 - d / 150) * (dark ? 0.25 : 0.14);
            ctx.strokeStyle = col;
            ctx.beginPath();
            ctx.moveTo(pi.x * w, pi.y * h);
            ctx.lineTo(pj.x * w, pj.y * h);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = dark ? 0.6 : 0.35;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(pi.x * w, pi.y * h, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [dark, reduce]);
  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none", className)} />;
}
