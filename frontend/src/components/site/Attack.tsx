import { AnimatePresence, motion } from "framer-motion";
import { Database, Globe, KeyRound, Scissors, Server, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NetworkField } from "./Ambient";
import { Signal } from "./Dashboard";
import { Reveal, SectionHeader, Spotlight } from "./primitives";

type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
  kind: string;
  sev: "critical" | "high" | "medium" | "neutral";
  icon: typeof Globe;
  desc: string;
  rel: string;
  main?: boolean;
};

const nodes: Node[] = [
  {
    id: "net",
    x: 70,
    y: 230,
    label: "Internet Exposure",
    kind: "Exposure",
    sev: "neutral",
    icon: Globe,
    main: true,
    desc: "The path begins where a resource is reachable from the public internet.",
    rel: "Ingress to 0.0.0.0/0",
  },
  {
    id: "sg",
    x: 260,
    y: 140,
    label: "Open Security Group",
    kind: "Network",
    sev: "high",
    icon: ShieldAlert,
    main: true,
    desc: "A security group allows inbound SSH (port 22) from anywhere — a CSPM misconfiguration finding.",
    rel: "Allows :22 → instance",
  },
  {
    id: "ec2",
    x: 460,
    y: 230,
    label: "Vulnerable Compute Instance",
    kind: "Compute",
    sev: "critical",
    icon: Server,
    main: true,
    desc: "The instance carries known CVEs found by vulnerability scanning and SideScan. This is the choke point: remediating here severs the entire path.",
    rel: "Assumes IAM role",
  },
  {
    id: "iam",
    x: 660,
    y: 140,
    label: "IAM Credentials",
    kind: "Identity",
    sev: "high",
    icon: KeyRound,
    main: true,
    desc: "The attached role's effective permissions (CIEM) include read access to storage it never uses.",
    rel: "s3:GetObject on bucket",
  },
  {
    id: "s3",
    x: 860,
    y: 230,
    label: "Sensitive Data Bucket",
    kind: "Data · crown jewel",
    sev: "critical",
    icon: Database,
    main: true,
    desc: "DSPM classified PII and financial records in this bucket — the crown jewel the path ultimately reaches.",
    rel: "Contains PII",
  },
  // blast radius
  {
    id: "b1",
    x: 560,
    y: 360,
    label: "rds-orders",
    kind: "Database",
    sev: "medium",
    icon: Database,
    desc: "Downstream database reachable from the compromised instance.",
    rel: "Blast radius",
  },
  {
    id: "b2",
    x: 400,
    y: 380,
    label: "ecr-images",
    kind: "Registry",
    sev: "medium",
    icon: Server,
    desc: "Container registry the role can pull from.",
    rel: "Blast radius",
  },
  {
    id: "b3",
    x: 760,
    y: 360,
    label: "kms-key-prod",
    kind: "Key",
    sev: "high",
    icon: KeyRound,
    desc: "Encryption key the role can use.",
    rel: "Blast radius",
  },
];

const edges: [string, string][] = [
  ["net", "sg"],
  ["sg", "ec2"],
  ["ec2", "iam"],
  ["iam", "s3"],
  ["ec2", "b1"],
  ["ec2", "b2"],
  ["iam", "b3"],
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

export function AttackPath() {
  const [sel, setSel] = useState("ec2");
  const [severed, setSevered] = useState(false);
  const node = byId[sel]!;
  const connected = new Set(edges.filter((e) => e.includes(sel)).flat());

  return (
    <section id="attack" className="section-dark relative overflow-hidden py-28 md:py-36">
      <NetworkField dark className="absolute inset-0 h-full w-full opacity-60" />
      <Spotlight />
      <div className="container-site relative">
        <div className="grid grid-cols-12 gap-10">
          <SectionHeader
            dark
            className="col-span-12 lg:col-span-7"
            eyebrow="Attack path intelligence"
            title="See How Individual Risks Become Critical Attack Paths."
            highlight={["Critical", "Attack", "Paths."]}
          />
          <Reveal delay={0.1} className="col-span-12 self-end lg:col-span-4 lg:col-start-9">
            <p className="text-on-dark-muted">
              Assets, security groups, identities, policies and findings are modeled as connected
              edges. Graph traversal exposes toxic combinations, blast radius and the single choke
              point worth fixing first.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-6">
          <div className="relative col-span-12 overflow-hidden rounded-xl border border-line-dark bg-surface/50 xl:col-span-9">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-dark px-5 py-3">
              <div className="flex items-center gap-2 font-mono text-[11px] text-on-dark-muted">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-sev-critical" /> Critical path
                · illustrative graph
              </div>
              <button
                onClick={() => {
                  setSevered((v) => !v);
                  setSel("ec2");
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
                  severed
                    ? "border-ok/50 bg-ok/15 text-ok"
                    : "border-electric/40 text-electric hover:bg-electric/10",
                )}
              >
                <Scissors className="h-3.5 w-3.5" />
                {severed ? "Path severed — reset" : "Remediate choke point"}
              </button>
            </div>
            <div className="overflow-x-auto">
              <svg viewBox="0 0 930 430" className="min-w-[720px]">
                {/* blast radius halo */}
                <motion.ellipse
                  cx="610"
                  cy="330"
                  rx="240"
                  ry="90"
                  fill="var(--sev-critical)"
                  animate={{ opacity: severed ? 0 : 0.06 }}
                />
                <text
                  x="610"
                  y="420"
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fill="var(--on-dark-muted)"
                  opacity={severed ? 0.3 : 1}
                >
                  BLAST RADIUS
                </text>
                {edges.map(([a, b]) => {
                  const A = byId[a]!,
                    B = byId[b]!;
                  const main = A.main && B.main;
                  const lit = connected.has(a) && connected.has(b) && (a === sel || b === sel);
                  const cut =
                    severed &&
                    (a === "ec2" || b === "ec2" || a === "iam" || b === "iam" || b === "s3");
                  return (
                    <g key={a + b}>
                      <line
                        x1={A.x}
                        y1={A.y}
                        x2={B.x}
                        y2={B.y}
                        stroke="var(--line-dark)"
                        strokeWidth={main ? 2 : 1}
                      />
                      {!cut && (
                        <line
                          x1={A.x}
                          y1={A.y}
                          x2={B.x}
                          y2={B.y}
                          stroke={main ? "var(--sev-critical)" : "var(--electric)"}
                          strokeWidth={lit ? 2.5 : main ? 1.8 : 1}
                          strokeOpacity={lit ? 1 : main ? 0.7 : 0.35}
                          className="flow-line"
                        />
                      )}
                    </g>
                  );
                })}
                {severed && (
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ transformOrigin: "360px 185px" }}
                  >
                    <circle cx="360" cy="185" r="12" fill="var(--ok)" />
                    <path d="M354 185l4 4 8-8" stroke="var(--navy)" strokeWidth="2" fill="none" />
                  </motion.g>
                )}
                {nodes.map((n, i) => {
                  const active = sel === n.id;
                  const dim = severed && n.id !== "net" && n.id !== "sg" && n.id !== "ec2";
                  return (
                    <motion.g
                      key={n.id}
                      onMouseEnter={() => setSel(n.id)}
                      onClick={() => setSel(n.id)}
                      style={{ cursor: "pointer" }}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: dim ? 0.35 : 1, y: 0 }}
                      animate={{ opacity: dim ? 0.35 : 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      tabIndex={0}
                      role="button"
                      aria-label={n.label}
                    >
                      {n.id === "ec2" && !severed && (
                        <circle
                          cx={n.x}
                          cy={n.y}
                          r="40"
                          fill="none"
                          stroke="var(--sev-critical)"
                          strokeOpacity=".5"
                          strokeDasharray="3 4"
                          className="live-dot"
                          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                        />
                      )}
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={n.main ? 26 : 16}
                        fill="var(--navy)"
                        stroke={`var(--sev-${n.sev})`}
                        strokeWidth={active ? 3 : 1.5}
                      />
                      {active && (
                        <circle
                          cx={n.x}
                          cy={n.y}
                          r={n.main ? 32 : 22}
                          fill="none"
                          stroke="var(--electric)"
                          strokeOpacity=".6"
                        />
                      )}
                      <foreignObject
                        x={n.x - 10}
                        y={n.y - 10}
                        width="20"
                        height="20"
                        style={{ pointerEvents: "none" }}
                      >
                        <n.icon
                          className={cn("h-5 w-5", n.main ? "text-on-dark" : "text-on-dark-muted")}
                        />
                      </foreignObject>
                      <text
                        x={n.x}
                        y={n.y + (n.main ? 46 : 32)}
                        textAnchor="middle"
                        fontSize={n.main ? 12 : 10}
                        fontWeight={n.main ? 600 : 400}
                        fill="var(--on-dark)"
                      >
                        {n.label}
                      </text>
                      {n.main && (
                        <text
                          x={n.x}
                          y={n.y + 61}
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily="var(--font-mono)"
                          fill="var(--on-dark-muted)"
                        >
                          {n.kind.toUpperCase()}
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              </svg>
            </div>
          </div>

          <aside className="col-span-12 rounded-xl border border-line-dark bg-surface p-6 xl:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={sel + severed}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-on-dark-muted">
                  <span className={cn("h-2 w-2 rounded-full", `bg-sev-${node.sev}`)} /> {node.sev} ·{" "}
                  {node.kind}
                </div>
                <h3 className="mt-3 text-xl font-semibold text-on-dark">{node.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">{node.desc}</p>
                <div className="mt-5 rounded-md border border-line-dark p-3 font-mono text-[11px] text-electric">
                  → {node.rel}
                </div>
                {sel === "ec2" && (
                  <div
                    className={cn(
                      "mt-5 rounded-md p-4 text-sm",
                      severed ? "bg-ok/15 text-on-dark" : "bg-sev-critical/15 text-on-dark",
                    )}
                  >
                    <div className="mb-1 flex items-center gap-2 font-semibold">
                      <Signal className="h-4 w-4" /> {severed ? "Path severed" : "Choke point"}
                    </div>
                    <p className="text-on-dark-muted">
                      {severed
                        ? "Closing the exposure on this instance breaks the route to IAM credentials and the sensitive bucket."
                        : "One remediation here severs the full path to the crown jewel — prioritize it above isolated findings."}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 border-t border-line-dark pt-4 text-xs text-on-dark-muted">
              Hover any node to inspect relationships.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Multi-cloud ---------------- */
const clouds = [
  { k: "AWS", n: "Amazon Web Services" },
  { k: "Azure", n: "Microsoft Azure" },
  { k: "GCP", n: "Google Cloud Platform" },
  { k: "Alibaba", n: "Alibaba Cloud" },
  { k: "OCI", n: "Oracle Cloud Infrastructure" },
  { k: "Cloudflare", n: "Cloudflare" },
];

export function MultiCloud() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section id="multicloud" className="relative overflow-hidden bg-background py-28 md:py-36">
      <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="container-site relative">
        <SectionHeader
          center
          eyebrow="Multi-cloud"
          title="One Connected View Across Your Cloud Environment."
          highlight={["Connected"]}
          body="Connect cloud accounts through documented provider connectors. Discovery normalizes resources into one tenant-scoped asset inventory and graph."
        />
        <div className="relative mx-auto mt-16 max-w-5xl">
          <svg viewBox="0 0 1000 360" className="w-full">
            {clouds.map((_, i) => {
              const x = 85 + i * 166;
              const lit = hover === null || hover === i;
              return (
                <g key={i}>
                  <path
                    d={`M${x} 70 C ${x} 200, 500 160, 500 280`}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                  />
                  <path
                    d={`M${x} 70 C ${x} 200, 500 160, 500 280`}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="1.5"
                    strokeOpacity={lit ? 0.9 : 0.15}
                    className="flow-line"
                  />
                </g>
              );
            })}
            <circle cx="500" cy="300" r="46" fill="var(--navy)" />
            <circle
              cx="500"
              cy="300"
              r="60"
              fill="none"
              stroke="var(--primary)"
              strokeOpacity=".25"
              className="live-dot"
              style={{ transformOrigin: "500px 300px" }}
            />
          </svg>
          <div className="absolute inset-x-0 top-0 grid grid-cols-6">
            {clouds.map((c, i) => (
              <div key={c.k} className="flex justify-center">
                <button
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  className={cn(
                    "rounded-lg border bg-background px-2 py-3 text-center shadow-soft transition-all sm:w-36 sm:px-4",
                    hover === i ? "-translate-y-1 border-primary" : "border-border",
                  )}
                >
                  <div className="text-xs font-bold text-ink sm:text-base">{c.k}</div>
                  <div className="hidden text-[10px] leading-tight text-muted-foreground sm:block">
                    {c.n}
                  </div>
                </button>
              </div>
            ))}
          </div>
          <div className="absolute left-1/2 top-[83%] -translate-x-1/2 -translate-y-1/2 text-center text-electric">
            <Signal className="mx-auto h-8 w-8" />
          </div>
        </div>
        <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
          Unified asset graph · tenant-scoped inventory
        </p>
      </div>
    </section>
  );
}
