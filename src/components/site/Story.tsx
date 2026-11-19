import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Bot,
  Boxes,
  Code2,
  Database,
  Fingerprint,
  Layers,
  Radar,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Signal } from "./Dashboard";
import { Reveal, SectionHeader, Spotlight } from "./primitives";

/* ---------------- Challenge ---------------- */
const problems = [
  {
    k: "Disconnected security tools",
    d: "Posture, workload, identity and data tools each hold a partial view of the same cloud.",
  },
  {
    k: "Agent management overhead",
    d: "Installing and maintaining full host agents across every workload slows coverage.",
  },
  {
    k: "High volumes of isolated alerts",
    d: "Findings arrive without relationships, so teams triage noise instead of risk.",
  },
  {
    k: "Limited risk context",
    d: "A single misconfiguration rarely tells you whether sensitive data is actually reachable.",
  },
  {
    k: "Manual remediation workflows",
    d: "Fixes move through tickets and consoles without controlled approval or audit.",
  },
];

export function Challenge() {
  const [active, setActive] = useState(0);
  return (
    <section id="challenge" className="relative bg-background py-28 md:py-36">
      <div className="container-site grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-5">
          <SectionHeader
            eyebrow="The challenge"
            title="Cloud Security Shouldn't Be Fragmented."
            highlight={["Fragmented."]}
            body="Security teams protecting multi-cloud environments typically stitch together separate tools. Each adds data — none adds context."
          />
          <Reveal delay={0.2} className="mt-10 hidden lg:block">
            <FragmentDiagram active={active} />
          </Reveal>
        </div>
        <ol className="col-span-12 lg:col-span-6 lg:col-start-7">
          {problems.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.06}>
              <li
                onMouseEnter={() => setActive(i)}
                className="group relative grid cursor-default grid-cols-[56px_1fr] gap-4 border-t border-border py-7 last:border-b"
              >
                <span
                  className={cn(
                    "font-mono text-sm transition-colors",
                    active === i ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  0{i + 1}
                </span>
                <div>
                  <h3
                    className={cn(
                      "text-xl font-semibold transition-colors md:text-2xl",
                      active === i ? "text-ink" : "text-ink/70",
                    )}
                  >
                    {p.k}
                  </h3>
                  <p className="mt-2 max-w-lg text-muted-foreground">{p.d}</p>
                </div>
                <motion.span
                  className="absolute left-0 top-0 h-px bg-primary"
                  animate={{ width: active === i ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FragmentDiagram({ active }: { active: number }) {
  const pts: [number, number][] = [
    [40, 40],
    [220, 30],
    [300, 140],
    [150, 190],
    [20, 150],
  ];
  return (
    <svg viewBox="0 0 340 230" className="w-full max-w-md">
      {pts.map(([x, y], i) => (
        <g key={i}>
          <motion.line
            x1={170}
            y1={110}
            x2={x + 20}
            y2={y + 14}
            stroke="var(--primary)"
            strokeDasharray="3 5"
            animate={{ opacity: active === i ? 0.9 : 0.15 }}
          />
          <motion.rect
            x={x}
            y={y}
            width="40"
            height="28"
            rx="4"
            fill="var(--background)"
            stroke={active === i ? "var(--primary)" : "var(--border)"}
            animate={{ y: active === i ? y - 4 : y }}
          />
          <text
            x={x + 20}
            y={y + 18}
            textAnchor="middle"
            fontSize="9"
            fontFamily="var(--font-mono)"
            fill="var(--muted-foreground)"
          >
            0{i + 1}
          </text>
        </g>
      ))}
      <circle
        cx="170"
        cy="110"
        r="18"
        fill="var(--alt)"
        stroke="var(--border)"
        strokeDasharray="2 3"
      />
      <text x="170" y="114" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">
        ?
      </text>
    </svg>
  );
}

/* ---------------- Pillars ---------------- */
const pillars = [
  {
    k: "CSPM",
    n: "Cloud Security Posture Management",
    d: "Continuously verifies cloud resource configurations against security benchmarks and best practices.",
    i: ShieldCheck,
  },
  {
    k: "CWPP",
    n: "Cloud Workload Protection Platform",
    d: "Analyzes the software stack inside VMs and containers for CVEs, runtime threats, and SideScan hits.",
    i: Boxes,
  },
  {
    k: "CIEM",
    n: "Cloud Infrastructure Entitlement Mgmt.",
    d: "Analyzes IAM users, roles, and policies to detect excessive, unused, or dangerous effective permissions.",
    i: Fingerprint,
  },
  {
    k: "DSPM",
    n: "Data Security Posture Management",
    d: "Discovers, catalogs, and classifies sensitive data across structured and unstructured cloud storage.",
    i: Database,
  },
  {
    k: "AI-SPM",
    n: "AI Security Posture Management",
    d: "Protects ML pipelines, LLM deployments, training datasets, and exposed API keys.",
    i: Bot,
  },
  {
    k: "ASPM",
    n: "Application & API Security Posture",
    d: "Discovers API gateway routes, shadow APIs, and sensitive URL parameters against OpenAPI schemas.",
    i: Layers,
  },
  {
    k: "CDR",
    n: "Cloud Detection & Response",
    d: "Maps cloud audit and runtime detections to MITRE ATT&CK techniques and containment playbooks.",
    i: Radar,
  },
  {
    k: "SOAR",
    n: "Security Orchestration, Automation & Response",
    d: "Generates step-by-step remediation playbooks with two-person approval for sensitive fixes.",
    i: Workflow,
  },
  {
    k: "Shift-Left",
    n: "Developer Security Integration",
    d: "Enforces IaC, secrets, and SBOM checks in CLI, git hooks, and IDE plugins before deploy.",
    i: Code2,
  },
];

export function Pillars() {
  const [sel, setSel] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20%" });
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!inView || !auto) return;
    const id = setInterval(() => setSel((s) => (s + 1) % 9), 2600);
    return () => clearInterval(id);
  }, [inView, auto]);

  const R = 200;
  const P = pillars[sel]!;
  return (
    <section id="platform" className="section-dark relative overflow-hidden py-28 md:py-36">
      <div className="grid-lines-dark absolute inset-0" />
      <Spotlight />
      <div className="container-site relative">
        <SectionHeader
          dark
          eyebrow="Unified CNAPP"
          title="One Platform. A Connected View of Cloud Risk."
          highlight={["Connected"]}
          body="Nine interlocking security pillars feed one shared asset graph, so a finding in one domain gains context from every other."
        />
        <div ref={ref} className="mt-16 grid grid-cols-12 items-center gap-10">
          <div className="col-span-12 lg:col-span-7">
            <div
              className="relative mx-auto aspect-square w-full max-w-[560px]"
              onMouseLeave={() => setAuto(true)}
            >
              <svg viewBox="-260 -260 520 520" className="absolute inset-0 h-full w-full">
                <circle r={R} fill="none" stroke="var(--line-dark)" />
                <circle r={R * 0.55} fill="none" stroke="var(--line-dark)" strokeDasharray="2 6" />
                {pillars.map((_, i) => {
                  const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
                  const x = Math.cos(a) * R,
                    y = Math.sin(a) * R;
                  return (
                    <g key={i}>
                      <line x1="0" y1="0" x2={x} y2={y} stroke="var(--line-dark)" />
                      <line
                        x1={x}
                        y1={y}
                        x2="0"
                        y2="0"
                        stroke="var(--electric)"
                        strokeWidth={sel === i ? 2 : 1}
                        strokeOpacity={sel === i ? 1 : 0.25}
                        className="flow-line"
                      />
                    </g>
                  );
                })}
              </svg>
              {/* core */}
              <div className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-electric/30 bg-surface">
                <div className="absolute inset-0 rounded-full bg-electric/10 live-dot" />
                <div className="relative text-center">
                  <Signal className="mx-auto h-7 w-7 text-electric" />
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-on-dark">
                    Intelligence
                  </div>
                  <div className="font-mono text-[9px] text-on-dark-muted">asset graph</div>
                </div>
              </div>
              {pillars.map((p, i) => {
                const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
                const left = 50 + (Math.cos(a) * R * 100) / 520;
                const top = 50 + (Math.sin(a) * R * 100) / 520;
                return (
                  <button
                    key={p.k}
                    onMouseEnter={() => {
                      setAuto(false);
                      setSel(i);
                    }}
                    onFocus={() => setSel(i)}
                    onClick={() => setSel(i)}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    className={cn(
                      "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border px-2.5 py-2 text-xs font-semibold transition-all duration-300 sm:px-3",
                      sel === i
                        ? "scale-110 border-electric bg-primary text-primary-foreground glow-blue"
                        : "border-line-dark bg-surface text-on-dark hover:border-electric/50",
                    )}
                  >
                    <p.i className="hidden h-3.5 w-3.5 sm:block" />
                    {p.k}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={sel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="border-l border-electric/40 pl-8"
              >
                <div className="font-mono text-sm text-electric">0{sel + 1} / 09</div>
                <h3 className="mt-3 text-4xl font-semibold text-on-dark">{P.k}</h3>
                <div className="mt-1 text-on-dark-muted">{P.n}</div>
                <p className="mt-6 text-lg leading-relaxed text-on-dark">{P.d}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-10 flex gap-1.5 pl-8">
              {pillars.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show ${pillars[i]!.k}`}
                  onClick={() => {
                    setAuto(false);
                    setSel(i);
                  }}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    sel === i ? "w-8 bg-electric" : "w-3 bg-line-dark",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SideScan ---------------- */
const steps = [
  {
    k: "Snapshot creation",
    d: "An out-of-band storage snapshot of the workload's disk is created — nothing is installed on the host.",
  },
  {
    k: "Read-only isolated analysis",
    d: "The snapshot is mounted read-only inside a dedicated, isolated analysis environment.",
  },
  {
    k: "OS package manifest extraction",
    d: "Installed OS packages are extracted and matched against known vulnerabilities.",
  },
  {
    k: "YARA malware rule inspection",
    d: "The filesystem is inspected with YARA rules for webshells, miners and trojans.",
  },
  {
    k: "Windows Defender signature checks",
    d: "On Windows workloads, Defender threat signatures are checked against the volume.",
  },
  {
    k: "Snapshot cleanup",
    d: "After analysis the snapshot is removed and findings flow into the platform.",
  },
];

export function SideScan() {
  const [s, setS] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setS((v) => (v + 1) % steps.length), 2400);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section id="sidescan" className="relative bg-alt py-28 md:py-36">
      <div className="container-site">
        <div className="grid grid-cols-12 gap-10">
          <SectionHeader
            className="col-span-12 lg:col-span-6"
            eyebrow="Agentless SideScanning"
            title="Deep Workload Visibility Without Full Host Agents."
            highlight={["Without"]}
          />
          <Reveal delay={0.1} className="col-span-12 self-end lg:col-span-5 lg:col-start-8">
            <p className="text-lg leading-relaxed text-muted-foreground">
              SideScan inspects volumes and disks from a snapshot, out-of-band. Package, malware and
              signature hits are written back as findings — without deploying a full host agent
              fleet.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="mt-16 grid grid-cols-12 gap-8">
          {/* illustration */}
          <div className="col-span-12 overflow-hidden rounded-xl border border-border bg-background p-6 shadow-soft lg:col-span-7 md:p-10">
            <svg viewBox="0 0 640 300" className="w-full">
              <defs>
                <marker
                  id="arr"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--primary)" />
                </marker>
              </defs>
              {/* workload */}
              <g>
                <rect
                  x="20"
                  y="90"
                  width="130"
                  height="120"
                  rx="8"
                  fill="var(--alt)"
                  stroke="var(--border)"
                />
                <text
                  x="85"
                  y="80"
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  fill="var(--muted-foreground)"
                >
                  CLOUD WORKLOAD
                </text>
                {[0, 1, 2].map((r) => (
                  <rect
                    key={r}
                    x="38"
                    y={108 + r * 30}
                    width="94"
                    height="18"
                    rx="3"
                    fill="var(--background)"
                    stroke="var(--border)"
                  />
                ))}
                <text
                  x="85"
                  y="200"
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--muted-foreground)"
                >
                  no agent installed
                </text>
              </g>
              {/* snapshot */}
              <motion.g animate={{ opacity: s >= 0 ? 1 : 0.3 }}>
                <line
                  x1="150"
                  y1="150"
                  x2="225"
                  y2="150"
                  stroke="var(--primary)"
                  strokeWidth="1.5"
                  className="flow-line"
                  markerEnd="url(#arr)"
                />
                <motion.g animate={{ opacity: s === 5 ? 0.25 : 1 }}>
                  <rect
                    x="230"
                    y="115"
                    width="80"
                    height="70"
                    rx="6"
                    fill="var(--background)"
                    stroke="var(--primary)"
                    strokeDasharray={s === 5 ? "4 4" : "0"}
                  />
                  <ellipse cx="270" cy="128" rx="26" ry="6" fill="none" stroke="var(--primary)" />
                  <ellipse
                    cx="270"
                    cy="150"
                    rx="26"
                    ry="6"
                    fill="none"
                    stroke="var(--primary)"
                    opacity=".6"
                  />
                  <ellipse
                    cx="270"
                    cy="170"
                    rx="26"
                    ry="6"
                    fill="none"
                    stroke="var(--primary)"
                    opacity=".3"
                  />
                </motion.g>
                <text
                  x="270"
                  y="105"
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  fill="var(--muted-foreground)"
                >
                  SNAPSHOT
                </text>
              </motion.g>
              {/* sandbox */}
              <line
                x1="310"
                y1="150"
                x2="365"
                y2="150"
                stroke="var(--primary)"
                strokeWidth="1.5"
                className="flow-line"
                markerEnd="url(#arr)"
              />
              <rect x="370" y="60" width="150" height="180" rx="8" fill="var(--navy)" />
              <text
                x="445"
                y="50"
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill="var(--muted-foreground)"
              >
                ISOLATED ANALYSIS
              </text>
              <clipPath id="sb">
                <rect x="370" y="60" width="150" height="180" rx="8" />
              </clipPath>
              <g clipPath="url(#sb)">
                <rect
                  x="370"
                  y="60"
                  width="150"
                  height="40"
                  className="scan-sweep"
                  fill="var(--electric)"
                  opacity=".15"
                />
              </g>
              {["read-only mount", "pkg manifest", "YARA rules", "Defender sigs"].map((t, i) => (
                <g key={t}>
                  <rect
                    x="384"
                    y={78 + i * 38}
                    width="122"
                    height="26"
                    rx="4"
                    fill="var(--surface)"
                    stroke={s === i + 1 ? "var(--electric)" : "var(--line-dark)"}
                  />
                  <circle
                    cx="396"
                    cy={91 + i * 38}
                    r="3"
                    fill={s > i ? "var(--cyan)" : "var(--line-dark)"}
                  />
                  <text
                    x="406"
                    y={95 + i * 38}
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    fill="var(--on-dark)"
                  >
                    {t}
                  </text>
                </g>
              ))}
              {/* findings */}
              <line
                x1="520"
                y1="150"
                x2="560"
                y2="150"
                stroke="var(--primary)"
                strokeWidth="1.5"
                className="flow-line"
                markerEnd="url(#arr)"
              />
              <rect x="565" y="110" width="60" height="80" rx="6" fill="var(--primary)" />
              <foreignObject x="565" y="110" width="60" height="80">
                <div className="grid h-full place-items-center text-primary-foreground">
                  <Signal className="h-6 w-6" />
                </div>
              </foreignObject>
              <text
                x="595"
                y="210"
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fill="var(--muted-foreground)"
              >
                findings
              </text>
            </svg>
            <div className="mt-6 flex items-center gap-3 font-mono text-xs text-muted-foreground">
              <span className="text-primary">Illustrative SideScan result</span> · 1 YARA hit
              (webshell) · 14 CVEs · SHA-256 recorded
            </div>
          </div>

          <ol className="col-span-12 space-y-1 lg:col-span-5">
            {steps.map((st, i) => (
              <li key={st.k}>
                <button
                  onClick={() => setS(i)}
                  className={cn(
                    "w-full rounded-lg border p-4 text-left transition-all",
                    s === i
                      ? "border-primary/40 bg-background shadow-soft"
                      : "border-transparent hover:bg-background/60",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid h-6 w-6 place-items-center rounded-full font-mono text-[10px]",
                        s >= i
                          ? "bg-primary text-primary-foreground"
                          : "bg-border text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="font-semibold text-ink">{st.k}</span>
                  </div>
                  <AnimatePresence initial={false}>
                    {s === i && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-9 text-sm text-muted-foreground"
                      >
                        <span className="block pt-2">{st.d}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
