import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word headline reveal */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  highlight,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  highlight?: string[] | undefined;
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={cn("tracking-tight", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.045 }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className={cn(
              "inline-block",
              highlight?.some((h) => w.replace(/[.,]/g, "") === h) && "text-signal",
            )}
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: { y: "0%", opacity: 1, transition: { duration: 0.75, ease } },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </MotionTag>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  body,
  dark,
  center,
  highlight,
  className,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  dark?: boolean;
  center?: boolean;
  highlight?: string[];
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      <Reveal>
        <div
          className={cn(
            "eyebrow flex items-center gap-3",
            center && "justify-center",
            dark && "text-electric",
          )}
        >
          <span className="h-px w-8 bg-current opacity-60" />
          {eyebrow}
        </div>
      </Reveal>
      <SplitHeading
        text={title}
        highlight={highlight}
        className={cn(
          "mt-5 text-4xl font-semibold leading-[1.05] md:text-5xl lg:text-[3.5rem]",
          dark ? "text-on-dark" : "text-ink",
        )}
      />
      {body && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-6 text-lg leading-relaxed",
              dark ? "text-on-dark-muted" : "text-muted-foreground",
            )}
          >
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function Counter({
  to,
  duration = 1.8,
  decimals = 0,
  className,
}: {
  to: number;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const c = animate(0, to, { duration, ease, onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, duration, reduce]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {val.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 150, damping: 18 });
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Spotlight following the cursor inside dark sections */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ref.current!.style.setProperty("--sx", `${e.clientX - r.left}px`);
      ref.current!.style.setProperty("--sy", `${e.clientY - r.top}px`);
      ref.current!.style.opacity = "1";
    };
    const onLeave = () => (ref.current!.style.opacity = "0");
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
        className,
      )}
      style={{
        background:
          "radial-gradient(520px circle at var(--sx) var(--sy), color-mix(in oklab, var(--electric) 14%, transparent), transparent 60%)",
      }}
    />
  );
}

export function SeverityDot({ sev }: { sev: "critical" | "high" | "medium" | "low" | "neutral" }) {
  const map = {
    critical: "bg-sev-critical",
    high: "bg-sev-high",
    medium: "bg-sev-medium",
    low: "bg-sev-low",
    neutral: "bg-sev-neutral",
  };
  return <span className={cn("inline-block h-1.5 w-1.5 rounded-full", map[sev])} />;
}
