import { AnimatePresence, motion, useInView } from "framer-motion";
import { Bot, Database, FileKey2, GitCommit, KeyRound, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { cn } from "@/lib/utils";
import { Counter, Reveal, SectionHeader, Spotlight, Tilt } from "./primitives";

/* ---------------- Score ---------------- */
/* Category weights match Security Posture engine in CNAPP docs */
const categories = [
  { k: "Infrastructure Posture (CSPM)", v: 72 },
  { k: "Identity & Access (CIEM)", v: 68 },
  { k: "Vulnerability & Workload (CWPP)", v: 61 },
  { k: "Data Protection (DSPM)", v: 81 },
  { k: "Exposure", v: 74 },
];
const providerScores = [
  { k: "AWS", v: 74 },
  { k: "Azure", v: 69 },
  { k: "GCP", v: 77 },
];
const history = Array.from({ length: 12 }, (_, i) => ({
  w: `W${i + 1}`,
  score: Math.round(64 + i * 1.2 + Math.sin(i) * 2.5),
}));

export function Score() {
  const [view, setView] = useState<"category" | "provider">("category");
  const [pick, setPick] = useState<number | null>(null);
  const data = view === "category" ? categories : providerScores;
  const score = pick !== null ? data[pick]!.v : 78;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const arc = 260;
  const r = 120;
  const c = (arc / 360) * 2 * Math.PI * r;

  return (
    <section id="score" className="bg-background py-28 md:py-36">
      <div className="container-site grid grid-cols-12 gap-10">
        <SectionHeader
          className="col-span-12 lg:col-span-5"
          eyebrow="Contextual security score"
          title="Understand Your Security Posture. Know What Needs Attention."
          highlight={["Needs", "Attention."]}
          body="A 0–100 security index from the Security Posture module — weighted across CSPM, CIEM, CWPP, DSPM, and exposure, with provider breakdown and history."
        />
        <div className="col-span-12 grid grid-cols-12 gap-6 lg:col-span-7">
          <div className="col-span-12 flex flex-col items-center rounded-xl border border-border bg-alt p-6 sm:col-span-6">
            <svg ref={ref} viewBox="0 0 300 260" className="w-full max-w-xs">
              <g transform="translate(150 150) rotate(140)">
                <circle
                  r={r}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="14"
                  strokeDasharray={`${c} 999`}
                  strokeLinecap="round"
                />
                <motion.circle
                  r={r}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${c} 999`}
                  initial={{ strokeDashoffset: c }}
                  animate={inView ? { strokeDashoffset: c * (1 - score / 100) } : {}}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </g>
              <text
                x="150"
                y="150"
                textAnchor="middle"
                fontSize="64"
                fontWeight="600"
                fill="var(--ink)"
              >
                {score}
              </text>
              <text
                x="150"
                y="178"
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill="var(--muted-foreground)"
              >
                {pick !== null ? data[pick]!.k.toUpperCase() : "OVERALL POSTURE"}
              </text>
            </svg>
            <div className="mt-2 grid w-full grid-cols-2 gap-3 text-center">
              <div className="rounded-md bg-background p-3">
                <div className="text-xl font-semibold text-ink">
                  <Counter to={128} />
                </div>
                <div className="text-xs text-muted-foreground">open findings</div>
              </div>
              <div className="rounded-md bg-background p-3">
                <div className="text-xl font-semibold text-ink">
                  <Counter to={14} />
                </div>
                <div className="text-xs text-muted-foreground">critical assets</div>
              </div>
            </div>
          </div>
          <div className="col-span-12 rounded-xl border border-border p-6 sm:col-span-6">
            <div className="mb-5 flex rounded-md bg-alt p-1 text-xs font-semibold">
              {(["category", "provider"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setView(v);
                    setPick(null);
                  }}
                  className={cn(
                    "flex-1 rounded px-3 py-1.5 capitalize transition-colors",
                    view === v ? "bg-background text-primary shadow-soft" : "text-muted-foreground",
                  )}
                >
                  By {v}
                </button>
              ))}
            </div>
            <ul className="space-y-3">
              {data.map((d, i) => (
                <li key={d.k}>
                  <button
                    onMouseEnter={() => setPick(i)}
                    onMouseLeave={() => setPick(null)}
                    onClick={() => setPick(i)}
                    className="w-full text-left"
                  >
                    <div className="flex justify-between text-sm">
                      <span className={cn(pick === i ? "text-primary" : "text-ink")}>{d.k}</span>
                      <span className="font-mono tabular-nums text-muted-foreground">{d.v}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-alt">
                      <motion.div
                        key={view}
                        className={cn(
                          "h-full rounded-full",
                          pick === i ? "bg-signal" : "bg-primary/70",
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${d.v}%` }}
                        transition={{ duration: 0.8, delay: i * 0.06 }}
                      />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 rounded-xl border border-border p-6">
            <div className="mb-2 flex justify-between text-xs">
              <span className="font-semibold text-ink">Historical trend</span>
              <span className="font-mono text-muted-foreground">illustrative · 12 weeks</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <XAxis
                    dataKey="w"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "var(--primary)" }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- DSPM / AI-SPM ---------------- */
const stores = [
  { k: "customer-db", t: "Database", tags: ["PII", "Financial"], icon: Database },
  { k: "exports-bucket", t: "Object storage", tags: ["PII"], icon: Database },
  { k: "train-data-bkt", t: "Training bucket", tags: ["AI", "PII"], icon: Bot },
  { k: "vector-index", t: "Vector database", tags: ["AI"], icon: Database },
  { k: "repo / .env", t: "LLM API key exposure", tags: ["Secret"], icon: KeyRound },
];
const ids = ["analyst-role", "ml-pipeline", "svc-exporter"];

export function DataSecurity() {
  const [s, setS] = useState(0);
  return (
    <section id="data" className="section-dark relative overflow-hidden py-28 md:py-36">
      <Spotlight />
      <div className="container-site relative grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-5">
          <SectionHeader
            dark
            eyebrow="DSPM & AI-SPM"
            title="Know Where Sensitive Data Lives. Understand Who Can Access It."
            highlight={["Sensitive", "Data"]}
          />
          <Reveal delay={0.1}>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 text-sm text-on-dark-muted">
              {[
                "Sensitive data discovery",
                "PII & financial classification",
                "Database & object storage profiling",
                "Access governance",
                "LLM API key exposure",
                "AI model & training bucket security",
                "Vector database visibility",
                "OWASP Top 10 for LLMs benchmarks",
              ].map((x) => (
                <li key={x} className="flex gap-2 border-t border-line-dark pt-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan" />
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <Tilt max={4}>
            <div className="rounded-xl border border-line-dark bg-surface p-5 md:p-8">
              <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-on-dark-muted">
                <span>Identity → data access map</span>
                <span className="text-electric">illustrative</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1.4fr] items-center gap-4">
                <div className="space-y-3">
                  {ids.map((id, i) => {
                    const lit = (s + i) % 2 === 0 || i === s % 3;
                    return (
                      <div
                        key={id}
                        className={cn(
                          "rounded-md border px-3 py-2.5 font-mono text-[11px] transition-colors",
                          lit
                            ? "border-electric/50 text-on-dark"
                            : "border-line-dark text-on-dark-muted",
                        )}
                      >
                        {id}
                      </div>
                    );
                  })}
                </div>
                <svg viewBox="0 0 60 200" className="h-48 w-12">
                  {[30, 100, 170].map((y1) =>
                    [20, 60, 100, 140, 180].map((y2, j) => (
                      <path
                        key={`${y1}-${y2}`}
                        d={`M0 ${y1} C 30 ${y1}, 30 ${y2}, 60 ${y2}`}
                        fill="none"
                        stroke={j === s ? "var(--cyan)" : "var(--line-dark)"}
                        strokeWidth={j === s ? 1.5 : 1}
                        className={j === s ? "flow-line" : ""}
                      />
                    )),
                  )}
                </svg>
                <div className="space-y-2">
                  {stores.map((st, i) => (
                    <button
                      key={st.k}
                      onMouseEnter={() => setS(i)}
                      onClick={() => setS(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-all",
                        s === i
                          ? "border-cyan/60 bg-cyan/10"
                          : "border-line-dark hover:border-electric/40",
                      )}
                    >
                      <st.icon className="h-4 w-4 shrink-0 text-electric" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-mono text-[11px] text-on-dark">{st.k}</div>
                        <div className="text-[10px] text-on-dark-muted">{st.t}</div>
                      </div>
                      <div className="hidden gap-1 sm:flex">
                        {st.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-primary/30 px-1.5 py-0.5 font-mono text-[9px] text-on-dark"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={s}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 border-t border-line-dark pt-4 text-sm text-on-dark-muted"
                >
                  <span className="text-on-dark">{stores[s]!.k}</span> —{" "}
                  {stores[s]!.t.toLowerCase()} classified as {stores[s]!.tags.join(" + ")}.
                  Effective permissions show which identities can reach it.
                </motion.p>
              </AnimatePresence>
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Shift-left ---------------- */
const termLines = [
  { t: '$ git commit -m "add payments bucket"', c: "text-ink" },
  { t: "› pre-commit: cnapp-cli scanning IaC + secrets…", c: "text-muted-foreground" },
  { t: "✗ main.tf:14  storage bucket allows public read", c: "text-sev-critical" },
  { t: "✗ config.ts:3  hard-coded API key detected", c: "text-sev-critical" },
  { t: "› SBOM: 214 components analyzed", c: "text-muted-foreground" },
  { t: "$ cnapp-cli scan --upload", c: "text-ink" },
  { t: "✓ results uploaded → Shift-Left console", c: "text-primary" },
];

export function ShiftLeft() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setN((v) => (v >= termLines.length ? v : v + 1)), 550);
    return () => clearInterval(id);
  }, [inView]);
  const flow = [
    { k: "IDE", d: "VS Code extension · JetBrains plugin", i: FileKey2 },
    { k: "Git hooks", d: "Pre-commit / pre-push scanning", i: GitCommit },
    { k: "cnapp-cli", d: "IaC, secrets & SBOM scans", i: Terminal },
    { k: "GitHub / GitLab", d: "PR & CLI scan history in console", i: GitCommit },
  ];
  return (
    <section id="shiftleft" className="bg-alt py-28 md:py-36">
      <div className="container-site">
        <SectionHeader
          eyebrow="Shift-left security"
          title="Bring Security Closer to Development."
          highlight={["Development."]}
          body="Scans run in the developer workflow and upload their results to the console — so issues are caught before they reach the cloud."
        />
        <div className="mt-14 grid grid-cols-12 gap-8">
          <div
            ref={ref}
            className="col-span-12 overflow-hidden rounded-xl border border-border bg-background shadow-soft lg:col-span-7"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
              <Terminal className="h-3.5 w-3.5" /> developer terminal · illustrative
            </div>
            <div className="min-h-[260px] p-5 font-mono text-[12.5px] leading-7">
              {termLines.slice(0, n).map((l) => (
                <motion.div
                  key={l.t}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={l.c}
                >
                  {l.t}
                </motion.div>
              ))}
              <span className="live-dot inline-block h-4 w-2 translate-y-0.5 bg-primary" />
            </div>
          </div>
          <ol className="relative col-span-12 lg:col-span-5">
            <span className="absolute bottom-6 left-[19px] top-6 w-px bg-border" />
            {flow.map((f, i) => (
              <Reveal key={f.k} delay={i * 0.1}>
                <li className="relative flex gap-5 py-4">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-background text-primary">
                    <f.i className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-semibold text-ink">{f.k}</div>
                    <div className="text-sm text-muted-foreground">{f.d}</div>
                  </div>
                </li>
              </Reveal>
            ))}
            <Reveal delay={0.4}>
              <li className="relative flex gap-5 py-4">
                <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy font-mono text-[10px] text-electric">
                  SP
                </span>
                <div>
                  <div className="font-semibold text-ink">Septer console</div>
                  <div className="text-sm text-muted-foreground">
                    Shift-left findings alongside cloud risk
                  </div>
                </div>
              </li>
            </Reveal>
          </ol>
        </div>
      </div>
    </section>
  );
}
