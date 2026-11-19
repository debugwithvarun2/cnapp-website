import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  ShieldCheck,
  UserCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { NetworkField } from "./Ambient";
import { SepterLogo, SepterWordmark } from "./BrandLogo";
import { Magnetic, Reveal, SectionHeader, SplitHeading, Spotlight } from "./primitives";

/* ---------------- SecOps ---------------- */
const flow = ["Detect", "Prioritize", "Review", "Approve", "Remediate", "Audit"];

export function SecOps() {
  const [stage, setStage] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setStage((s) => (s + 1) % 7), 1700);
    return () => clearInterval(id);
  }, [inView]);
  const status =
    stage < 2 ? "OPEN" : stage < 4 ? "PENDING_APPROVAL" : stage < 5 ? "APPROVED" : "EXECUTED";

  return (
    <section id="secops" className="section-dark relative overflow-hidden py-28 md:py-36">
      <div className="grid-lines-dark absolute inset-0" />
      <Spotlight />
      <div className="container-site relative">
        <SectionHeader
          dark
          eyebrow="Security operations"
          title="Move From Detection to Controlled Action."
          highlight={["Controlled"]}
          body="Alerts, tickets, playbooks and approvals in one loop. Sensitive changes are never executed by a single person."
        />

        <div ref={ref} className="mt-14">
          <div className="relative grid grid-cols-3 gap-y-6 md:grid-cols-6">
            <div className="absolute inset-x-[8.33%] top-5 hidden h-px bg-line-dark md:block">
              <motion.div
                className="h-px bg-electric"
                animate={{ width: `${Math.min(stage, 5) * 20}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            {flow.map((f, i) => (
              <div key={f} className="relative flex flex-col items-center gap-3">
                <span
                  className={cn(
                    "relative z-10 grid h-10 w-10 place-items-center rounded-full border font-mono text-xs transition-all duration-500",
                    stage >= i
                      ? "border-electric bg-primary text-primary-foreground glow-blue"
                      : "border-line-dark bg-surface text-on-dark-muted",
                  )}
                >
                  {stage > i ? <Check className="h-4 w-4" /> : `0${i + 1}`}
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    stage >= i ? "text-on-dark" : "text-on-dark-muted",
                  )}
                >
                  {f}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-12 gap-6">
            {/* two-person approval card */}
            <div className="col-span-12 rounded-xl border border-line-dark bg-surface p-6 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-on-dark-muted">
                    Remediation change request · demo
                  </div>
                  <div className="mt-1 text-lg font-semibold text-on-dark">
                    Close inbound :22 on sg-0a91 (prod)
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={status}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "rounded-full px-3 py-1 font-mono text-[10px]",
                      status === "EXECUTED"
                        ? "bg-ok/20 text-ok"
                        : status === "PENDING_APPROVAL"
                          ? "bg-electric/15 text-electric"
                          : "bg-line-dark text-on-dark",
                    )}
                  >
                    {status}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <div
                  className={cn(
                    "rounded-lg border p-4 transition-colors",
                    stage >= 2 ? "border-electric/50" : "border-line-dark",
                  )}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-on-dark">
                    <UserRound className="h-4 w-4 text-electric" /> Requester
                  </div>
                  <div className="mt-1 text-xs text-on-dark-muted">
                    Analyst submits change with diff
                  </div>
                </div>
                <div className="flex justify-center">
                  <Lock
                    className={cn(
                      "h-5 w-5 transition-colors",
                      stage >= 4 ? "text-ok" : "text-on-dark-muted",
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "rounded-lg border p-4 transition-colors",
                    stage >= 3 ? "border-electric/50" : "border-line-dark",
                  )}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-on-dark">
                    <UserCheck className="h-4 w-4 text-electric" /> Second approver
                  </div>
                  <div className="mt-1 text-xs text-on-dark-muted">
                    Must be a different administrator
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-md bg-navy p-3 font-mono text-[11px] text-on-dark-muted">
                <span className="text-sev-critical">- ingress 0.0.0.0/0 tcp:22</span>
                <br />
                <span className="text-ok">+ ingress (removed)</span>
              </div>
              <p className="mt-4 text-xs text-on-dark-muted">
                Execution stays blocked until an independent approver signs off. Requesters cannot
                self-approve.
              </p>
            </div>

            <div className="col-span-12 grid gap-4 lg:col-span-5">
              {[
                [
                  "Alerts & Tickets",
                  "Unified inbox for CSPM, CVE, K8s, runtime and identity alerts — acknowledge, assign, suppress, comment.",
                ],
                [
                  "Jira & ServiceNow",
                  "Open external tickets directly from an alert via Jira and ServiceNow integrations.",
                ],
                [
                  "SOAR Playbooks",
                  "Step-by-step guided remediation (CLI / Terraform / console) from finding drawers.",
                ],
                [
                  "Audit Logs & Notifications",
                  "Searchable audit trail plus Slack, Microsoft Teams, and webhook routing rules.",
                ],
              ].map(([k, d], i) => (
                <Reveal key={k} delay={i * 0.08}>
                  <div className="group flex gap-4 border-b border-line-dark pb-4">
                    <span className="font-mono text-xs text-electric">0{i + 1}</span>
                    <div>
                      <div className="font-semibold text-on-dark">{k}</div>
                      <div className="mt-1 text-sm text-on-dark-muted">{d}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Compliance ---------------- */
export function Compliance() {
  const [fmt, setFmt] = useState("PDF");
  const controls = [
    ["1.4", "Ensure no root access keys exist", "Passed"],
    ["2.1.1", "Ensure S3 buckets deny public access", "Failed"],
    ["3.1", "Ensure CloudTrail is enabled in all regions", "Passed"],
    ["4.2", "Ensure no SG allows ingress to port 22", "Failed"],
    ["5.6", "Ensure legacy service is disabled", "N/A"],
  ];
  return (
    <section id="compliance" className="bg-background py-28 md:py-36">
      <div className="container-site grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-5">
          <SectionHeader
            eyebrow="Compliance & reporting"
            title="Turn Security Findings Into Actionable Evidence."
            highlight={["Evidence."]}
          />
          <Reveal delay={0.1}>
            <ul className="mt-10 space-y-4 text-muted-foreground">
              <li>
                <strong className="text-ink">CIS baselines</strong> filtered by your connected
                providers.
              </li>
              <li>
                <strong className="text-ink">SOC 2 / ISO / PCI / NIST-style frameworks</strong> as
                supported by the configured framework catalog.
              </li>
              <li>
                <strong className="text-ink">Passed / Failed / N/A</strong> control results per
                assessment.
              </li>
              <li>
                <strong className="text-ink">Executive security reports</strong>, combined reports
                and schedules.
              </li>
              <li>
                <strong className="text-ink">Audit evidence</strong> with CSV export from the audit
                log.
              </li>
            </ul>
          </Reveal>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <div className="relative">
              <div className="absolute -right-3 -top-3 hidden h-full w-full rounded-xl border border-border bg-alt sm:block" />
              <div className="relative rounded-xl border border-border bg-background p-6 shadow-soft md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-navy text-electric">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-semibold text-ink">Executive Security Report</div>
                      <div className="font-mono text-[11px] text-muted-foreground">
                        CIS AWS Baseline · sample preview
                      </div>
                    </div>
                  </div>
                  <div className="flex rounded-md border border-border p-0.5 font-mono text-[11px]">
                    {["PDF", "XLSX", "CSV", "JSON"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFmt(f)}
                        className={cn(
                          "rounded px-2.5 py-1 transition-colors",
                          fmt === f
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-ink",
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    ["Passed", 82, "text-ok"],
                    ["Failed", 14, "text-sev-critical"],
                    ["N/A", 6, "text-muted-foreground"],
                  ].map(([k, v, c]) => (
                    <div key={k as string} className="rounded-md bg-alt p-3">
                      <div className={cn("text-2xl font-semibold", c as string)}>{v}</div>
                      <div className="text-xs text-muted-foreground">{k}</div>
                    </div>
                  ))}
                </div>
                <table className="mt-5 w-full text-left text-sm">
                  <tbody>
                    {controls.map(([id, t, r], i) => (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className="border-t border-border"
                      >
                        <td className="py-2.5 pr-3 font-mono text-xs text-muted-foreground">
                          {id}
                        </td>
                        <td className="py-2.5 text-ink">{t}</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 font-mono text-[10px]",
                              r === "Passed"
                                ? "bg-ok/15 text-ink"
                                : r === "Failed"
                                  ? "bg-sev-critical/15 text-sev-critical"
                                  : "bg-alt text-muted-foreground",
                            )}
                          >
                            {r}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-5 font-mono text-[11px] text-muted-foreground">
                  Export format: <span className="text-primary">{fmt}</span> · generated from stored
                  findings and assessments
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */
const how = [
  [
    "Connect Cloud Accounts",
    "Link AWS, Azure, GCP, Alibaba, Oracle, or Cloudflare from Administration.",
  ],
  ["Discover Cloud Assets", "Trigger Assessment builds a normalized, tenant-scoped inventory."],
  [
    "Run Security Assessments",
    "Trigger CSPM, CIEM, vulnerability, SideScan, DSPM, and related scans.",
  ],
  ["Correlate Attack Paths", "Graph toxic combinations of exposure, identity, vuln, and data."],
  ["Prioritize With Security Posture", "Use the 0–100 index and top misconfigurations queue."],
  ["Remediate With Controlled Workflows", "SOAR playbooks plus two-person remediation approval."],
  ["Report and Audit", "Export Security Reports and retain Audit Logs as evidence."],
];

export function HowItWorks() {
  const [a, setA] = useState(0);
  return (
    <section id="how" className="bg-alt py-28 md:py-36">
      <div className="container-site">
        <SectionHeader
          eyebrow="How Septer works"
          title="From Cloud Connection to Security Action."
          highlight={["Security", "Action."]}
        />
        <div className="mt-16 overflow-x-auto pb-4">
          <ol className="grid min-w-[980px] grid-cols-7">
            {how.map(([k, d], i) => (
              <li
                key={k}
                onMouseEnter={() => setA(i)}
                className="group relative cursor-default pr-4"
              >
                <div className="relative mb-6 flex items-center">
                  <span
                    className={cn(
                      "relative z-10 grid h-12 w-12 place-items-center rounded-full border text-sm font-semibold transition-all duration-300",
                      a === i
                        ? "border-primary bg-primary text-primary-foreground scale-110"
                        : a > i
                          ? "border-primary bg-background text-primary"
                          : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {i < 6 && (
                    <span className="h-px flex-1 bg-border">
                      <motion.span
                        className="block h-full bg-primary"
                        animate={{ width: a > i ? "100%" : "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </span>
                  )}
                </div>
                <h3
                  className={cn(
                    "font-semibold transition-colors",
                    a === i ? "text-primary" : "text-ink",
                  )}
                >
                  {k}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA + demo + footer ---------------- */
export function FinalCta() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [cloud, setCloud] = useState("Multi-Cloud");
  const [interest, setInterest] = useState("Unified CNAPP Platform");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    fullName: string;
    company: string;
    email: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          company,
          cloudProviders: [cloud],
          interest,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit demo request.");
      }

      setSubmittedData({
        id: json.data?.id || `req_cs_${Date.now()}`,
        fullName,
        company,
        email,
      });
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      setError(err instanceof Error ? err.message : "Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName("");
    setEmail("");
    setCompany("");
    setSubmittedData(null);
    setError(null);
  };

  return (
    <section id="demo" className="section-dark relative overflow-hidden py-28 md:py-40">
      <NetworkField dark className="absolute inset-0 h-full w-full" />
      <Spotlight />
      <div className="container-site relative grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-7">
          <SplitHeading
            text="Bring Your Entire Cloud Security Landscape Into Focus."
            highlight={["Focus."]}
            className="text-4xl font-semibold leading-[1.05] text-on-dark md:text-6xl"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lg text-on-dark-muted">
              Connect visibility, contextual risk intelligence, and security operations through one
              unified CNAPP platform.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <a
                  href="#platform"
                  className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-electric hover:text-navy"
                >
                  Explore Septer
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#demo-form"
                  className="inline-flex items-center gap-2 rounded-md border border-line-dark px-6 py-3.5 text-sm font-semibold text-on-dark transition-colors hover:border-electric hover:text-electric"
                >
                  Request a Demo
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="col-span-12 lg:col-span-5">
          <div className="border-beam rounded-xl bg-surface/90 p-6 backdrop-blur shadow-2xl">
            <div className="flex items-center justify-between border-b border-line-dark pb-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-electric flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-electric animate-ping" />
                Request a demo
              </div>
            </div>

            <AnimatePresence mode="wait">
              {submittedData ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6 space-y-4 text-center"
                >
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-electric/15 border border-electric/40 text-electric glow-blue">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-dark">Demo Request Confirmed!</h3>
                    <p className="mt-1 text-xs text-on-dark-muted max-w-sm mx-auto">
                      Thank you,{" "}
                      <span className="font-semibold text-on-dark">{submittedData.fullName}</span>.
                      Your submission for{" "}
                      <span className="font-semibold text-electric">{submittedData.company}</span>{" "}
                      has been securely recorded and routed to the Septer solutions engineering
                      queue.
                    </p>
                  </div>

                  <div className="rounded-lg border border-line-dark bg-navy/80 p-3 font-mono text-[11px] text-left text-on-dark-muted space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tracking Reference:</span>
                      <span className="text-electric font-semibold">{submittedData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Confirmation Sent To:</span>
                      <span className="text-on-dark">{submittedData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pipeline Ingestion:</span>
                      <span className="text-emerald-400 font-semibold">Verified & Queued</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full rounded-md bg-primary py-2.5 px-3 text-xs font-semibold text-primary-foreground hover:bg-electric hover:text-navy transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  id="demo-form"
                  onSubmit={handleSubmit}
                  className="mt-4 grid gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error && (
                    <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
                      {error}
                    </div>
                  )}

                  <label className="block text-xs text-on-dark-muted">
                    Full name *
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="mt-1 w-full rounded-md border border-line-dark bg-navy px-3 py-2.5 text-sm text-on-dark outline-none transition-colors focus:border-electric"
                    />
                  </label>

                  <label className="block text-xs text-on-dark-muted">
                    Work email *
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@enterprise.com"
                      className="mt-1 w-full rounded-md border border-line-dark bg-navy px-3 py-2.5 text-sm text-on-dark outline-none transition-colors focus:border-electric"
                    />
                  </label>

                  <label className="block text-xs text-on-dark-muted">
                    Company *
                    <input
                      required
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Cloud Corp"
                      className="mt-1 w-full rounded-md border border-line-dark bg-navy px-3 py-2.5 text-sm text-on-dark outline-none transition-colors focus:border-electric"
                    />
                  </label>

                  <div className="block text-xs text-on-dark-muted">
                    <span className="block mb-1.5">Primary Cloud Infrastructure</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {["AWS", "Azure", "GCP", "Multi-Cloud"].map((c) => (
                        <button
                          type="button"
                          key={c}
                          onClick={() => setCloud(c)}
                          className={cn(
                            "rounded py-1.5 px-2 text-[11px] font-mono border transition-all text-center",
                            cloud === c
                              ? "border-electric bg-electric/20 text-electric font-semibold"
                              : "border-line-dark bg-navy text-on-dark-muted hover:border-line-dark/80",
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-electric hover:text-navy disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Securing submission...</span>
                      </>
                    ) : (
                      <span>Submit request</span>
                    )}
                  </button>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-on-dark-muted pt-2 border-t border-line-dark">
                    <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live backend connected
                    </span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    {
      k: "Platform",
      l: [
        ["Overview Dashboard", "#top"],
        ["Unified CNAPP", "#platform"],
        ["Multi-Cloud", "#multicloud"],
        ["How It Works", "#how"],
      ],
    },
    {
      k: "Capabilities",
      l: [
        ["Cloud Security", "#cap-cloud"],
        ["Workload Security", "#cap-workload"],
        ["Identity Security", "#cap-identity"],
        ["Application Security", "#cap-app"],
        ["Risk & Operations", "#cap-risk"],
      ],
    },
    {
      k: "Technology",
      l: [
        ["Agentless SideScanning", "#sidescan"],
        ["Attack Paths", "#attack"],
        ["Security Score", "#score"],
        ["Compliance & Reporting", "#compliance"],
      ],
    },
    {
      k: "Get started",
      l: [
        ["Request a Demo", "#demo-form"],
        ["Contact", "#demo-form"],
        ["Sign In", "/admin"],
      ],
    },
  ];
  return (
    <footer className="bg-navy text-on-dark">
      <div className="container-site border-t border-line-dark py-16">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-4">
            <a href="#top" className="flex items-center gap-3 text-lg font-semibold group">
              <SepterLogo className="h-9 w-9 drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)] transition-transform group-hover:scale-105" />
              <SepterWordmark className="h-6 w-auto text-on-dark group-hover:text-electric transition-colors" />
            </a>
            <p className="mt-4 max-w-xs text-sm text-on-dark-muted">
              Enterprise cloud-native application protection platform.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.k} className="col-span-6 sm:col-span-3 lg:col-span-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-on-dark-muted">
                {c.k}
              </div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {c.l.map(([l, h]) => (
                  <li key={l}>
                    <a href={h} className="text-on-dark/80 transition-colors hover:text-electric">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-line-dark pt-6 text-xs text-on-dark-muted">
          <span>© {new Date().getFullYear()} Septer Inc.</span>
          <span>Dashboard and product visuals use illustrative demonstration data.</span>
        </div>
      </div>
    </footer>
  );
}
