import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Fragment, useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeader, SeverityDot } from "./primitives";

type Cap = { k: string; d: string };
/** Module list sourced from Septer `NAV_SECTIONS` + CNAPP_DETAILS.md */
const groups: {
  id: string;
  k: string;
  lead: string;
  caps: Cap[];
  preview: "table" | "terminal" | "matrix" | "pipeline" | "feed";
}[] = [
  {
    id: "cap-cloud",
    k: "Cloud Security",
    preview: "table",
    lead: "Connect accounts, discover every resource, evaluate CSPM posture, classify sensitive data, and scan public exposure.",
    caps: [
      {
        k: "CSPM Policies",
        d: "Browse and enable cloud posture controls evaluated during CSPM scans.",
      },
      {
        k: "Cloud Assets",
        d: "Normalized inventory of compute, storage, network, identity, clusters, and images.",
      },
      {
        k: "Misconfigurations",
        d: "Operational queue of CSPM findings with severity, status, and remediation hints.",
      },
      {
        k: "Compliance",
        d: "CIS, SOC 2, ISO, PCI, and NIST-style assessments with Passed / Failed / N/A results.",
      },
      {
        k: "Data Security (DSPM)",
        d: "Discover sensitive data in stores, apply taxonomy rules, and run deep scans.",
      },
      {
        k: "External Exposure",
        d: "Independent IP / CIDR perimeter scanner with schedules and downloadable reports.",
      },
    ],
  },
  {
    id: "cap-workload",
    k: "Workload Security",
    preview: "terminal",
    lead: "CVE-centric risk across compute, images, clusters, and runtime — including agentless SideScan.",
    caps: [
      {
        k: "Compute (CWPP)",
        d: "Cloud workload protection for VMs and serverless-style assets from inventory.",
      },
      {
        k: "Vulnerabilities",
        d: "CVE risk across workloads and images with suppress, export, and threat-feed sync.",
      },
      {
        k: "Runtime Security",
        d: "Runtime events and threats ingested from provider signals for triage.",
      },
      { k: "Container Security", d: "Registry and image inventory with image-level CVE findings." },
      {
        k: "Kubernetes Security",
        d: "Cluster inventory and KSPM findings for workloads, RBAC, and controls.",
      },
      {
        k: "Agentless SideScan",
        d: "Out-of-band volume inspection without full host agents — packages and rule matches.",
      },
    ],
  },
  {
    id: "cap-identity",
    k: "Identity Security",
    preview: "matrix",
    lead: "Resolve effective permissions across human and machine identities to expose over-privilege and MFA gaps.",
    caps: [
      {
        k: "CIEM Effective Access",
        d: "Analyze identities, effective permissions, unused keys, and over-privileged roles.",
      },
      {
        k: "Identity risk scoring",
        d: "CIEM gaps feed Security Posture and Attack Paths prioritization.",
      },
      {
        k: "Identity detail views",
        d: "Drill into principals for effective access maps and recommendations.",
      },
      {
        k: "Least-privilege guidance",
        d: "Surface unused admin rights and dangerous entitlement combinations.",
      },
    ],
  },
  {
    id: "cap-app",
    k: "Application Security",
    preview: "pipeline",
    lead: "From API surface to code: ASPM, shift-left tooling, IaC and secrets, SBOM, and AI-SPM in one console.",
    caps: [
      {
        k: "API Security (ASPM)",
        d: "Gateway endpoints, shadow routes, OpenAPI schema drift, and sensitive parameter leaks.",
      },
      {
        k: "Shift-Left CLI & IDE",
        d: "cnapp-cli, git hooks, VS Code and JetBrains plugins with scan history upload.",
      },
      {
        k: "IaC & Secrets",
        d: "Live cloud account scanner plus Terraform / CloudFormation template inspection.",
      },
      {
        k: "SBOM Packages",
        d: "Ingest SPDX / CycloneDX manifests and correlate licenses and CVEs.",
      },
      {
        k: "AI-SPM Security",
        d: "AI/ML assets, LLM key leaks, vector DBs, training buckets, and OWASP LLM benchmarks.",
      },
    ],
  },
  {
    id: "cap-risk",
    k: "Risk & Operations",
    preview: "feed",
    lead: "Correlate toxic combinations, map detections to MITRE ATT&CK, and close the loop with controlled remediation.",
    caps: [
      {
        k: "Attack Paths",
        d: "Graph correlation of exposure, misconfig, privilege, and vuln into blast radius and choke points.",
      },
      {
        k: "MITRE ATT&CK (CDR)",
        d: "Cloud detection and response mapped to ATT&CK techniques and containment playbooks.",
      },
      {
        k: "Alerts & Tickets",
        d: "Unified inbox — acknowledge, assign, suppress, comment, and open Jira / ServiceNow tickets.",
      },
      {
        k: "SOAR Playbooks",
        d: "Step-by-step guided remediation (CLI / Terraform / console) instead of silent mutation.",
      },
      {
        k: "Remediation Approval",
        d: "Two-person approval queue for sensitive cloud fixes with an auditable trail.",
      },
      {
        k: "AI Security Assistant",
        d: "Natural-language copilot grounded in your tenant's findings and modules.",
      },
      {
        k: "Security Reports",
        d: "Generate PDF / XLSX / CSV / JSON reports, including schedules.",
      },
      { k: "Audit Logs", d: "Searchable activity trail with CSV export for compliance evidence." },
      { k: "Notifications", d: "Severity routing rules for Slack, Microsoft Teams, and webhooks." },
    ],
  },
];

function Preview({ kind }: { kind: string }) {
  if (kind === "table")
    return (
      <div className="font-mono text-[11px]">
        {[
          ["customer-exports", "AWS", "critical"],
          ["sg-prod-bastion", "AWS", "critical"],
          ["pay-api-prod", "AWS", "high"],
          ["crm-sql-flex", "Azure", "high"],
          ["ml-training-bucket", "GCP", "medium"],
        ].map(([a, p, s], i) => (
          <motion.div
            key={a}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center justify-between border-b border-line-dark py-2 text-on-dark"
          >
            <span className="flex items-center gap-2">
              <SeverityDot sev={s as "critical"} />
              {a}
            </span>
            <span className="text-on-dark-muted">{p}</span>
          </motion.div>
        ))}
      </div>
    );
  if (kind === "terminal")
    return (
      <div className="font-mono text-[11px] leading-6 text-on-dark-muted">
        {[
          "$ sidescan start i-0f3a…",
          "› snapshot created",
          "› mounted read-only",
          "› 412 packages parsed",
          "› YARA: 1 hit  webshell.php",
          "› CVE matches: 14",
          "› snapshot cleaned up ✓",
        ].map((l, i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.18 }}
            className={
              i === 4 ? "text-sev-critical" : i === 6 ? "text-ok" : i === 0 ? "text-on-dark" : ""
            }
          >
            {l}
          </motion.div>
        ))}
      </div>
    );
  if (kind === "matrix") {
    const ids = ["ci-deployer", "app-role", "analyst", "lambda-x"];
    const res = ["pii-db", "exports", "kms", "train-bkt"];
    return (
      <div className="grid grid-cols-[70px_repeat(4,1fr)] gap-1 font-mono text-[10px] text-on-dark-muted">
        <span />
        {res.map((r) => (
          <span key={r} className="truncate text-center">
            {r}
          </span>
        ))}
        {ids.map((id, i) => (
          <Fragment key={id}>
            <span className="truncate">{id}</span>
            {res.map((r, j) => {
              const v = (i * 7 + j * 3) % 5;
              return (
                <motion.span
                  key={id + r}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (i + j) * 0.05 }}
                  className={cn(
                    "h-7 rounded-sm",
                    v > 3
                      ? "bg-sev-critical/70"
                      : v > 2
                        ? "bg-primary/70"
                        : v > 0
                          ? "bg-electric/25"
                          : "bg-line-dark",
                  )}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    );
  }
  if (kind === "pipeline")
    return (
      <div className="flex items-center justify-between gap-2 text-[10px]">
        {["commit", "pre-commit", "cnapp-cli", "PR check", "cloud"].map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2 max-[479px]:min-w-0">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.12 }}
              className={cn(
                "grid h-14 flex-1 place-items-center rounded-md border font-mono max-[479px]:min-w-0 max-[479px]:[overflow-wrap:anywhere]",
                i === 2
                  ? "border-electric bg-primary/30 text-on-dark"
                  : "border-line-dark text-on-dark-muted",
              )}
            >
              {s}
            </motion.div>
            {i < 4 && <span className="h-px w-3 bg-electric/50" />}
          </div>
        ))}
      </div>
    );
  return (
    <div className="space-y-2 text-[11px]">
      {[
        ["Detect", "CDR alert · T1078 Valid Accounts"],
        ["Prioritize", "On critical attack path"],
        ["Approve", "2nd admin approval required"],
        ["Audit", "Change recorded with approver identity"],
      ].map(([a, b], i) => (
        <motion.div
          key={a}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 rounded-md border border-line-dark px-3 py-2"
        >
          <span className="w-16 font-mono text-electric">{a}</span>
          <span className="text-on-dark">{b}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function Capabilities() {
  const [g, setG] = useState(0);
  const G = groups[g]!;
  return (
    <section id="capabilities" className="bg-alt py-28 md:py-36">
      <div className="container-site">
        <SectionHeader
          eyebrow="Complete capabilities"
          title="Every Septer module, in one connected console."
          highlight={["connected"]}
          body="Functionalities match the live platform navigation — Cloud, Workload, Identity, Application, Risk, and Operations."
        />
        <div className="mt-14 grid grid-cols-12 gap-8">
          <nav className="col-span-12 lg:col-span-3" aria-label="Capability domains">
            <ul className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:pb-0">
              {groups.map((x, i) => (
                <li key={x.k} id={x.id} className="shrink-0 scroll-mt-28">
                  <button
                    onClick={() => setG(i)}
                    className={cn(
                      "group flex w-full items-center justify-between gap-4 rounded-lg px-4 py-3.5 text-left transition-all",
                      g === i
                        ? "bg-navy text-on-dark"
                        : "text-ink/70 hover:bg-background hover:text-ink",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "font-mono text-xs",
                          g === i ? "text-electric" : "text-muted-foreground",
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span className="font-semibold whitespace-nowrap">{x.k}</span>
                    </span>
                    <span className="hidden font-mono text-xs opacity-60 lg:inline">
                      {x.caps.length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-12 lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={g}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-12 gap-6"
              >
                <div className="col-span-12 md:col-span-7">
                  <h3 className="text-3xl font-semibold text-ink">{G.k}</h3>
                  <p className="mt-3 max-w-xl text-muted-foreground">{G.lead}</p>
                  <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
                    {G.caps.map((c, i) => (
                      <motion.li
                        key={c.k}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="group border-t border-border py-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-ink group-hover:text-primary">
                            {c.k}
                          </span>
                          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <Reveal className="col-span-12 md:col-span-5">
                  <div className="sticky top-28 rounded-xl border border-line-dark bg-navy p-5 shadow-dash">
                    <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-on-dark-muted">
                      <span>{G.k} · preview</span>
                      <span className="text-electric">demo</span>
                    </div>
                    <Preview kind={G.preview} />
                  </div>
                </Reveal>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
