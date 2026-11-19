/**
 * Page-exact presentation twins for CNAPP console modules (showcase data only).
 */
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  Search,
  ToggleRight,
  Wrench,
  Download,
  RefreshCw,
  ShieldAlert,
  Key,
  Bug,
  Database,
  Box,
  Activity,
  Cpu,
  Disc,
  BellRing,
  FileBarChart,
  History,
  CreditCard,
  ClipboardCheck,
  ArrowRight,
  Zap,
  Building2,
  CheckCircle2,
  XCircle,
  Radio,
  Workflow,
  Terminal,
  FileCode2,
  Package,
  Bot,
  Layers,
  Bell,
  Users,
  Lock,
  Settings2,
  Sparkles,
  UserCheck,
  AlertTriangle,
  Cloud,
  Shield,
} from "lucide-react";
import { NAV_SECTIONS } from "./navigation";
import { cn } from "@/lib/utils";
import { RiskBadge, StatusBadge } from "./Badges";
import { ScanStatusBanner } from "./ScanStatusBanner";
import { ProviderLogo } from "./ProviderLogo";

const DEMO_NOTE = "Illustrative showcase sample — not live tenant data.";

function DemoFootnote() {
  return <p className="text-[10px] font-mono text-[var(--text-muted)]">{DEMO_NOTE}</p>;
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-3 p-2 sm:p-3">
      {children}
      <DemoFootnote />
    </div>
  );
}

function IamHeader({
  badge,
  title,
  subtitle,
  icon: Icon,
}: {
  badge?: string;
  title: string;
  subtitle: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="border-b border-[var(--border-default)] pb-4">
      {badge ? (
        <span className="mb-1.5 inline-block rounded-[3px] border border-[var(--brand-border)] bg-[var(--brand-soft)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
          {badge}
        </span>
      ) : null}
      <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[var(--text-primary)]">
        {Icon ? <Icon className="h-6 w-6 shrink-0 text-[var(--brand-primary)]" /> : null}
        {title}
      </h1>
      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{subtitle}</p>
    </div>
  );
}

function EyebrowHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  iconClass,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconClass?: string;
}) {
  return (
    <div className="border-b border-[var(--border-default)] pb-4">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
        {eyebrow}
      </span>
      <h1 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-[var(--text-primary)]">
        <Icon className={cn("h-6 w-6 shrink-0", iconClass ?? "text-[var(--brand-primary)]")} />
        {title}
      </h1>
      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{subtitle}</p>
    </div>
  );
}

function FilterBar({ children }: { children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-[6px] border border-[var(--border-default)] bg-[var(--surface)] p-3 md:flex-row md:flex-wrap md:items-center">
      {children}
    </div>
  );
}

function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative min-w-[200px] max-w-md flex-1">
      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-muted)]" />
      <input
        type="text"
        readOnly
        placeholder={placeholder}
        className="w-full rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] py-1.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
      />
    </div>
  );
}

function MiniSelect({ label }: { label: string }) {
  return (
    <select
      className="rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-1.5 text-xs text-[var(--text-secondary)]"
      defaultValue=""
    >
      <option value="">{label}</option>
    </select>
  );
}

function CompactTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-[6px] border border-[var(--border-default)] bg-[var(--surface-secondary)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[var(--text-secondary)]">
          <thead className="border-b border-[var(--border-default)] bg-[var(--surface)] text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-3.5 py-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {rows.map((cells, i) => (
              <tr key={i} className="h-11 transition-colors hover:bg-[var(--surface-hover)]">
                {cells.map((cell, j) => (
                  <td key={j} className="px-3.5 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const POLICY_ROWS = [
  {
    code: "CIS-2.1.1",
    title: "Deny public S3 bucket ACLs",
    cat: "Storage",
    sev: "CRITICAL",
    prov: "AWS",
    on: true,
  },
  {
    code: "IAM-4.2",
    title: "Require MFA for IAM user delete",
    cat: "Identity",
    sev: "HIGH",
    prov: "AWS",
    on: true,
  },
  {
    code: "NET-1.8",
    title: "Restrict 0.0.0.0/0 SSH ingress",
    cat: "Network",
    sev: "CRITICAL",
    prov: "AWS",
    on: true,
  },
  {
    code: "AZU-DISK-1",
    title: "Encrypt managed disks at rest",
    cat: "Compute",
    sev: "HIGH",
    prov: "AZURE",
    on: true,
  },
  {
    code: "GCP-IAM-9",
    title: "Disable service account key creation",
    cat: "Identity",
    sev: "MEDIUM",
    prov: "GCP",
    on: false,
  },
];

export function LoginPoliciesExact() {
  return (
    <Shell>
      <div className="space-y-4">
        <EyebrowHeader
          eyebrow="Cloud Security / Policies"
          title="Security Policy Library & Catalog"
          subtitle="Browse 60+ pre-built cloud security policies aligned with CIS benchmarks, AWS Well-Architected & NIST standards."
          icon={ShieldCheck}
        />
        <FilterBar>
          <SearchInput placeholder="Search policy code, title or description..." />
          <MiniSelect label="All Categories" />
          <MiniSelect label="All Providers" />
          <MiniSelect label="All Severities" />
        </FilterBar>
        <CompactTable
          headers={[
            "Code",
            "Policy Title",
            "Category",
            "Severity",
            "Provider",
            "Status",
            "Actions",
          ]}
          rows={POLICY_ROWS.map((p) => [
            <span
              key="c"
              className="font-mono text-[11px] font-semibold text-[var(--brand-primary)]"
            >
              {p.code}
            </span>,
            <div key="t">
              <div className="truncate font-medium text-[var(--text-primary)]">{p.title}</div>
            </div>,
            <span
              key="cat"
              className="rounded border border-[var(--border-default)] bg-[var(--surface-elevated)] px-2 py-0.5 text-[11px]"
            >
              {p.cat}
            </span>,
            <RiskBadge key="s" level={p.sev} />,
            <span key="pr" className="inline-flex items-center gap-1.5 font-mono text-[11px]">
              <ProviderLogo name={p.prov} size={13} />
              {p.prov}
            </span>,
            <span key="st" className="flex items-center gap-1 text-[#43AE86]">
              <ToggleRight className="h-4 w-4" /> {p.on ? "Active" : "Disabled"}
            </span>,
            <span key="a" className="inline-flex justify-end gap-1">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded border border-[var(--border-default)] bg-[var(--surface-elevated)] px-2 py-1 text-[11px]"
              >
                <Wrench className="h-3 w-3" /> Guide
              </button>
            </span>,
          ])}
        />
      </div>
    </Shell>
  );
}

const FINDING_ROWS = [
  {
    id: "f1",
    asset: "customer-exports",
    policy: "S3 public ACL",
    sev: "CRITICAL",
    status: "OPEN",
    prov: "AWS",
  },
  {
    id: "f2",
    asset: "sg-prod-bastion",
    policy: "SSH 0.0.0.0/0",
    sev: "CRITICAL",
    status: "OPEN",
    prov: "AWS",
  },
  {
    id: "f3",
    asset: "ci-deployer",
    policy: "Admin role attached",
    sev: "HIGH",
    status: "OPEN",
    prov: "AWS",
  },
  {
    id: "f4",
    asset: "payments/api:1.14.2",
    policy: "CVE-2024-3094",
    sev: "HIGH",
    status: "IN_REVIEW",
    prov: "AWS",
  },
];

export function LoginFindingsExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="CSPM"
          title="Security Findings & Misconfigurations"
          subtitle="Continuous posture compliance checks, misconfiguration alerts, and automated SOAR remediation."
          icon={ShieldAlert}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded border border-[var(--border-default)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button
            type="button"
            className="glass-button-primary rounded px-3 py-1.5 text-xs font-semibold"
          >
            Run CSPM Scan
          </button>
        </div>
        <ScanStatusBanner
          status="SCAN_COMPLETED"
          message="847 finding(s) from posture scans (showcase)."
        />
        <FilterBar>
          <SearchInput placeholder="Search findings..." />
          <MiniSelect label="All severities" />
          <MiniSelect label="Open" />
          <MiniSelect label="All Providers" />
        </FilterBar>
        <CompactTable
          headers={["", "Asset", "Policy / Signal", "Severity", "Status", "Provider"]}
          rows={FINDING_ROWS.map((f) => [
            <input
              key="cb"
              type="checkbox"
              readOnly
              className="rounded border-[var(--border-default)]"
            />,
            <span key="a" className="font-mono text-[11px] text-[var(--text-primary)]">
              {f.asset}
            </span>,
            f.policy,
            <RiskBadge key="s" level={f.sev} />,
            <StatusBadge key="st" status={f.status} />,
            <span key="p" className="inline-flex items-center gap-1 font-mono text-[11px]">
              <ProviderLogo name={f.prov} size={13} />
              {f.prov}
            </span>,
          ])}
        />
      </div>
    </Shell>
  );
}

const ASSET_ROWS = [
  {
    name: "customer-exports",
    type: "S3_BUCKET",
    prov: "AWS",
    region: "us-east-1",
    risk: "CRITICAL",
  },
  {
    name: "sg-prod-bastion",
    type: "SECURITY_GROUP",
    prov: "AWS",
    region: "us-east-1",
    risk: "CRITICAL",
  },
  { name: "ci-deployer", type: "IAM_ROLE", prov: "AWS", region: "global", risk: "HIGH" },
  { name: "aks-nodepool-1", type: "COMPUTE", prov: "AZURE", region: "eastus", risk: "MEDIUM" },
];

export function LoginAssetsExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <div className="flex flex-col gap-3 rounded-[6px] border border-[var(--border-default)] bg-[var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded border border-[var(--brand-primary)]/30 bg-[var(--brand-soft)]/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
                INVENTORY
              </span>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Cloud Asset Inventory
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              1,842 discovered cloud resources across 6 accounts.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded border border-[var(--brand-primary)] bg-[var(--brand-primary)] px-3.5 py-1.5 text-xs font-semibold text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Run Asset Discovery
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {["ALL", "AWS", "AZURE", "GCP"].map((p) => (
            <button
              key={p}
              type="button"
              className={cn(
                "rounded border px-2.5 py-1 font-mono text-[10px] uppercase",
                p === "ALL"
                  ? "border-[var(--brand-primary)] bg-[var(--brand-soft)]/25 text-[var(--brand-primary)]"
                  : "border-[var(--border-default)] text-[var(--text-muted)]",
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <FilterBar>
          <SearchInput placeholder="Search assets..." />
          <MiniSelect label="All risk levels" />
        </FilterBar>
        <CompactTable
          headers={["Name", "Type", "Provider", "Region", "Risk"]}
          rows={ASSET_ROWS.map((a) => [
            <span key="n" className="font-medium text-[var(--text-primary)]">
              {a.name}
            </span>,
            <span key="t" className="font-mono text-[10px] uppercase">
              {a.type}
            </span>,
            <span key="p" className="inline-flex items-center gap-1 font-mono text-[11px]">
              <ProviderLogo name={a.prov} size={13} />
              {a.prov}
            </span>,
            a.region,
            <RiskBadge key="r" level={a.risk} />,
          ])}
        />
      </div>
    </Shell>
  );
}

const FRAMEWORKS = [
  { name: "CIS AWS Foundations v3", pass: 81, fail: 42, scope: "AWS" },
  { name: "CIS Azure Foundations", pass: 69, fail: 58, scope: "Azure" },
  { name: "SOC 2 Trust Criteria", pass: 74, fail: 31, scope: "Multi" },
  { name: "ISO 27001 Annex A", pass: 91, fail: 12, scope: "Multi" },
];

export function LoginComplianceExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="Governance & Standards"
          title="Compliance & Governance Engine"
          subtitle="Run, monitor, and enforce 3-state enterprise cloud compliance posture assessments (Passed, Failed, Not Applicable)."
          icon={ClipboardCheck}
        />
        <div className="glass-panel border-l-4 border-l-[var(--brand-primary)] p-4">
          <p className="font-mono text-[10px] uppercase text-[var(--text-muted)]">
            Avg Compliance Score
          </p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">78%</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FRAMEWORKS.map((fw) => (
            <div
              key={fw.name}
              className="rounded-[6px] border border-[var(--border-default)] bg-[var(--surface)] p-4"
            >
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{fw.name}</h3>
              <p className="mt-1 text-[10px] text-[var(--text-muted)]">{fw.scope}</p>
              <div className="mt-3 flex gap-4 text-xs">
                <span className="inline-flex items-center gap-1 text-[#43AE86]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {fw.pass}% pass
                </span>
                <span className="inline-flex items-center gap-1 text-[#E35D62]">
                  <XCircle className="h-3.5 w-3.5" /> {fw.fail} failed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

const DSPM_STORES = [
  { name: "customer-exports", type: "S3_BUCKET", classes: ["PII", "SECRET"], risk: "CRITICAL" },
  { name: "payments-ledger", type: "RDS", classes: ["PAYMENT", "PCI"], risk: "HIGH" },
  { name: "analytics-curated", type: "BIGQUERY", classes: ["INTERNAL"], risk: "MEDIUM" },
];

export function LoginDspmExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          title="Enterprise Data Security Posture Management (DSPM)"
          subtitle="Continuous deep scanning across cloud storage objects, relational databases, data warehouses, custom taxonomy, and access governance."
          icon={Database}
        />
        <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase">
          {["Overview", "Data Stores", "Governance", "Taxonomy"].map((t, i) => (
            <button
              key={t}
              type="button"
              className={cn(
                "rounded border px-2.5 py-1",
                i === 1
                  ? "border-[var(--brand-primary)] bg-[var(--brand-soft)] text-[var(--brand-primary)]"
                  : "border-[var(--border-default)] text-[var(--text-muted)]",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <FilterBar>
          <SearchInput placeholder="Search data stores..." />
          <MiniSelect label="All target types" />
          <MiniSelect label="All classifications" />
        </FilterBar>
        <CompactTable
          headers={["Store", "Type", "Classification", "Risk"]}
          rows={DSPM_STORES.map((s) => [
            s.name,
            s.type,
            <span key="c" className="flex flex-wrap gap-1">
              {s.classes.map((cl) => (
                <span
                  key={cl}
                  className="rounded border border-[var(--border-default)] bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[10px]"
                >
                  {cl}
                </span>
              ))}
            </span>,
            <RiskBadge key="r" level={s.risk} />,
          ])}
        />
      </div>
    </Shell>
  );
}

const CVE_ROWS = [
  { cve: "CVE-2024-3094", sev: "CRITICAL", pkg: "xz-utils 5.6.0", image: "payments/api:1.14.2" },
  { cve: "CVE-2023-44487", sev: "HIGH", pkg: "golang.org/x/net", image: "auth/sidecar:2.1.0" },
  { cve: "CVE-2024-21626", sev: "HIGH", pkg: "runc 1.1.9", image: "batch/worker:0.9.4" },
];

export function LoginVulnerabilitiesExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <EyebrowHeader
          eyebrow="Workload Security"
          title="Deep Cloud Vulnerability Operations Center"
          subtitle="Deep cloud asset scanning, CISA KEV threat tracking, EPSS exploit prediction, and patch playbooks."
          icon={Bug}
        />
        <FilterBar>
          <SearchInput placeholder="Search CVE, package, image..." />
          <MiniSelect label="All severities" />
          <MiniSelect label="Open" />
        </FilterBar>
        <CompactTable
          headers={["CVE", "Severity", "Package", "Image"]}
          rows={CVE_ROWS.map((r) => [
            <span key="id" className="font-mono text-[11px] text-[var(--brand-primary)]">
              {r.cve}
            </span>,
            <RiskBadge key="s" level={r.sev} />,
            r.pkg,
            <span key="i" className="font-mono text-[10px]">
              {r.image}
            </span>,
          ])}
        />
      </div>
    </Shell>
  );
}

type WorkloadConfig = {
  badge: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  headers: string[];
  rows: ReactNode[][];
};

function WorkloadExact({ badge, title, subtitle, icon: Icon, headers, rows }: WorkloadConfig) {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader badge={badge} title={title} subtitle={subtitle} icon={Icon} />
        <ScanStatusBanner status="SCAN_COMPLETED" message="Workload scan completed (showcase)." />
        <FilterBar>
          <SearchInput placeholder="Search workloads..." />
          <MiniSelect label="All severities" />
        </FilterBar>
        <CompactTable headers={headers} rows={rows} />
      </div>
    </Shell>
  );
}

const WL_ROWS = (names: string[]) =>
  names.map((n) => [
    <span key="n" className="font-mono text-[11px] text-[var(--text-primary)]">
      {n}
    </span>,
    "AWS",
    "us-east-1",
    <RiskBadge key="r" level="HIGH" />,
    <StatusBadge key="s" status="RUNNING" />,
  ]);

export function LoginContainersExact() {
  return WorkloadExact({
    badge: "Workload Security",
    title: "Container Image Security & Registry",
    subtitle:
      "Static analysis, base image provenance, and CVE vulnerability scanning across cloud registries.",
    icon: Box,
    headers: ["Image", "Provider", "Region", "Risk", "Status"],
    rows: WL_ROWS(["payments/api:1.14.2", "auth/sidecar:2.1.0", "batch/worker:0.9.4"]),
  });
}

export function LoginKubernetesExact() {
  return WorkloadExact({
    badge: "Workload Security",
    title: "Kubernetes Security Posture",
    subtitle:
      "Cluster inventory, posture findings, and CIS benchmark coverage across connected clouds.",
    icon: Box,
    headers: ["Cluster", "Provider", "Region", "Risk", "Status"],
    rows: WL_ROWS(["prod-eks-primary", "staging-aks-01", "gke-analytics"]),
  });
}

export function LoginRuntimeExact() {
  return WorkloadExact({
    badge: "Workload Security",
    title: "Runtime Threat Detection",
    subtitle: "Live threat detections from connected cloud security services.",
    icon: Activity,
    headers: ["Workload", "Provider", "Region", "Risk", "Status"],
    rows: WL_ROWS(["ec2-bastion-prod", "lambda-payments-hook", "gce-batch-node-3"]),
  });
}

export function LoginComputeExact() {
  return WorkloadExact({
    badge: "Infrastructure",
    title: "Compute & Virtual Machine Security",
    subtitle:
      "Posture analysis for EC2, Azure VMs, Compute Engine, Lambda, and serverless runtimes.",
    icon: Cpu,
    headers: ["Instance", "Provider", "Region", "Risk", "Status"],
    rows: WL_ROWS(["i-0a9f82e1prod", "vm-bastion-eastus", "gce-legacy-batch"]),
  });
}

export function LoginSideScanExact() {
  return WorkloadExact({
    badge: "Orca Agentless Technology",
    title: "Agentless SideScanning™",
    subtitle: "Out-of-band block storage snapshot analysis for Linux & Windows Server guests.",
    icon: Disc,
    headers: ["Volume / Guest", "Provider", "Region", "Risk", "Status"],
    rows: WL_ROWS(["vol-prod-web-01", "disk-aks-node-02", "pd-analytics-09"]),
  });
}

const CIEM_ROWS = [
  { name: "ci-deployer", type: "IAM_ROLE", excess: "AdministratorAccess", risk: "CRITICAL" },
  { name: "legacy-deploy-bot", type: "IAM_USER", excess: "s3:* on *", risk: "HIGH" },
  {
    name: "aks-kubelet",
    type: "MANAGED_IDENTITY",
    excess: "Contributor subscription",
    risk: "MEDIUM",
  },
];

export function LoginCiemExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <EyebrowHeader
          eyebrow="Identity Security / CIEM"
          title="Cloud Identity & Entitlement Management"
          subtitle="Continuous IAM risk evaluation, unused permission revocation, and least-privilege enforcement across cloud identities."
          icon={Key}
        />
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--brand-primary)] bg-[var(--brand-primary)] px-4 py-2 text-xs font-semibold text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Run CIEM Analysis
        </button>
        <FilterBar>
          <SearchInput placeholder="Search identities..." />
          <MiniSelect label="All types" />
          <MiniSelect label="All risk levels" />
        </FilterBar>
        <CompactTable
          headers={["Identity", "Type", "Excess permission", "Risk"]}
          rows={CIEM_ROWS.map((r) => [
            r.name,
            <span key="t" className="font-mono text-[10px] uppercase">
              {r.type}
            </span>,
            r.excess,
            <RiskBadge key="rk" level={r.risk} />,
          ])}
        />
      </div>
    </Shell>
  );
}

const ATTACK_GRAPH = {
  title: "Public S3 → IAM admin role chain",
  score: 92,
  nodes: [
    { name: "customer-exports", type: "S3", status: "PUBLIC" },
    { name: "ci-deployer", type: "IAM_ROLE", status: "ADMIN" },
    { name: "prod-vpc", type: "NETWORK", status: "EXPOSED" },
  ],
};

export function LoginAttackPathsExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <EyebrowHeader
          eyebrow="Risk Management / Attack Paths"
          title="Attack Path Analysis & Correlation"
          subtitle="Multi-stage attack vectors correlated across CSPM, CIEM, container vulnerabilities & network exposure."
          icon={ShieldAlert}
          iconClass="text-[#E35D62]"
        />
        <ScanStatusBanner
          status="SCAN_COMPLETED"
          message="Evidence-backed toxic combinations (showcase)."
        />
        <div className="space-y-3 rounded-[6px] border border-[var(--border-default)] bg-[var(--surface)] p-4">
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-default)] pb-3">
            <span className="rounded border border-[#E35D62]/30 bg-[#E35D62]/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#E35D62]">
              Critical attack path
            </span>
            <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
              Score: {ATTACK_GRAPH.score} / 100
            </span>
            <button
              type="button"
              className="ml-auto inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--brand-primary)] bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Zap className="h-3.5 w-3.5" /> Remediation Guide
            </button>
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">{ATTACK_GRAPH.title}</h3>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {ATTACK_GRAPH.nodes.map((node, idx) => (
              <span key={node.name} className="flex shrink-0 items-center gap-2">
                <span className="max-w-[140px] rounded-[6px] border border-[var(--border-default)] bg-[var(--surface-secondary)] p-2">
                  <span className="font-mono text-[10px] uppercase text-[var(--brand-primary)]">
                    {node.type}
                  </span>
                  <span className="mt-0.5 block truncate text-xs font-semibold text-[var(--text-primary)]">
                    {node.name}
                  </span>
                  <span className="text-[10px] text-[#E35D62]">{node.status}</span>
                </span>
                {idx < ATTACK_GRAPH.nodes.length - 1 ? (
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#E69A52]" />
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

const ALERT_ROWS = [
  { title: "Public bucket with PII", kind: "DSPM", sev: "CRITICAL", status: "OPEN" },
  { title: "SSH exposure on bastion SG", kind: "CSPM", sev: "CRITICAL", status: "OPEN" },
  { title: "KEV CVE in prod image", kind: "CVE", sev: "HIGH", status: "ACKNOWLEDGED" },
];

export function LoginAlertsExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="Operations"
          title="Security Alerts & Incidents Queue"
          subtitle="Unified queue for CSPM violations, CVE flaws, Kubernetes alerts, runtime threats, and identity risks."
          icon={BellRing}
        />
        <FilterBar>
          <SearchInput placeholder="Search alerts by title or description..." />
          <MiniSelect label="All kinds" />
          <MiniSelect label="All severities" />
        </FilterBar>
        <CompactTable
          headers={["Alert", "Kind", "Severity", "Status"]}
          rows={ALERT_ROWS.map((a) => [
            a.title,
            a.kind,
            <RiskBadge key="s" level={a.sev} />,
            <StatusBadge key="st" status={a.status} />,
          ])}
        />
      </div>
    </Shell>
  );
}

const REPORT_ROWS = [
  { name: "Executive Posture Summary", type: "PDF", updated: "2d ago" },
  { name: "CIS AWS Assessment", type: "CSV", updated: "5d ago" },
  { name: "CVE Remediation Backlog", type: "PDF", updated: "1w ago" },
];

export function LoginReportsExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="Governance"
          title="Security Reports"
          subtitle="Build a report from stored findings. Empty sections are left out of the file."
          icon={FileBarChart}
        />
        <CompactTable
          headers={["Report", "Format", "Updated"]}
          rows={REPORT_ROWS.map((r) => [r.name, r.type, r.updated])}
        />
      </div>
    </Shell>
  );
}

const AUDIT_ROWS = [
  { action: "cloud.account.sync", actor: "system", resource: "acme-prod", time: "12m ago" },
  { action: "finding.status.update", actor: "m.lee", resource: "customer-exports", time: "1h ago" },
  { action: "policy.toggle", actor: "s.admin", resource: "NET-1.8", time: "3h ago" },
];

export function LoginAuditExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="Governance"
          title="Audit Log"
          subtitle="Immutable record of security-relevant actions across your organization."
          icon={History}
        />
        <FilterBar>
          <SearchInput placeholder="Search audit events..." />
          <MiniSelect label="All actions" />
        </FilterBar>
        <CompactTable
          headers={["Action", "Actor", "Resource", "When"]}
          rows={AUDIT_ROWS.map((r) => [
            <span key="a" className="font-mono text-[10px]">
              {r.action}
            </span>,
            r.actor,
            r.resource,
            r.time,
          ])}
        />
      </div>
    </Shell>
  );
}

const CLOUD_ACCOUNTS = [
  { name: "acme-prod", id: "221988441122", provider: "AWS", assets: 982, status: "ACTIVE" },
  { name: "acme-staging", id: "441029883012", provider: "AWS", assets: 214, status: "ACTIVE" },
  { name: "acme-azure", id: "a1b2c3d4-e5f6", provider: "AZURE", assets: 514, status: "SYNCING" },
];

export function LoginCloudExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="Cloud"
          title="Cloud Accounts"
          subtitle="3 cloud accounts connected"
          icon={Building2}
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {CLOUD_ACCOUNTS.map((acc) => (
            <div
              key={acc.name}
              className="rounded-[6px] border border-[var(--border-default)] bg-[var(--surface)] p-4"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[var(--border-default)] bg-[var(--surface-elevated)]">
                    <ProviderLogo name={acc.provider} size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[var(--text-primary)]">{acc.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{acc.id}</p>
                  </div>
                </div>
                <StatusBadge status={acc.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="rounded-[6px] bg-[var(--surface-elevated)] p-2.5 text-center"
                >
                  <p className="text-xl font-bold text-[var(--text-primary)]">
                    {acc.assets.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">Assets</p>
                </button>
                <div className="rounded-[6px] bg-[var(--surface-elevated)] p-2.5 text-center">
                  <p className="text-xs font-medium text-[var(--text-secondary)]">2h ago</p>
                  <p className="text-xs text-[var(--text-muted)]">Last sync</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

const BILLING_METERS = [
  { key: "assets", label: "Monitored assets", used: 1842, limit: 5000 },
  { key: "scans", label: "CSPM scans / mo", used: 42, limit: 100 },
  { key: "seats", label: "Team seats", used: 8, limit: 25 },
];

export function LoginBillingExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="Billing"
          title="Billing & usage"
          subtitle="Consumption, subscription state, and account lifecycle for this organization."
          icon={CreditCard}
        />
        <div className="space-y-3">
          {BILLING_METERS.map((m) => (
            <div
              key={m.key}
              className="rounded-[6px] border border-[var(--border-default)] bg-[var(--surface)] p-3"
            >
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)]">{m.label}</span>
                <span className="font-mono text-[var(--text-muted)]">
                  {m.used.toLocaleString()} / {m.limit.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--background-secondary)]">
                <div
                  className="h-full rounded-full bg-[var(--brand-primary)]"
                  style={{ width: `${Math.min(100, (m.used / m.limit) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function MiniStat({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <div className="rounded-[6px] border border-[var(--border-default)] bg-[var(--surface)] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">{value}</p>
      {subtitle ? (
        <p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">{subtitle}</p>
      ) : null}
    </div>
  );
}

function TabPills({ tabs, activeIndex = 0 }: { tabs: string[]; activeIndex?: number }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-[var(--border-default)] pb-2">
      {tabs.map((t, i) => (
        <button
          key={t}
          type="button"
          className={cn(
            "rounded border px-2.5 py-1 text-[11px] font-semibold",
            i === activeIndex
              ? "border-[var(--brand-primary)] bg-[var(--brand-soft)] text-[var(--brand-primary)]"
              : "border-transparent text-[var(--text-muted)]",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

const IP_SCAN_ROWS = [
  {
    ip: "203.0.113.44",
    label: "bastion-prod",
    profile: "Quick",
    status: "COMPLETED",
    ports: 3,
    grade: "D",
  },
  {
    ip: "198.51.100.12",
    label: "api-gw-nlb",
    profile: "Standard",
    status: "COMPLETED",
    ports: 12,
    grade: "C",
  },
  {
    ip: "192.0.2.88",
    label: "legacy-vpn",
    profile: "Deep",
    status: "RUNNING",
    ports: 0,
    grade: "-",
  },
];

export function LoginIpScannerExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <div className="border-b border-[var(--border-default)] pb-3">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            Enterprise IP Scanner
          </h1>
          <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">
            Automated network exposure discovery and security analysis
          </p>
        </div>
        <MotionPresetRow />
        <FilterBar>
          <SearchInput placeholder="Search by IP or label..." />
          <MiniSelect label="All statuses" />
        </FilterBar>
        <CompactTable
          headers={["Target", "Profile", "Status", "Ports", "Posture"]}
          rows={IP_SCAN_ROWS.map((r) => [
            <span
              key="t"
              className="font-mono text-[11px] font-semibold text-[var(--text-primary)]"
            >
              {r.ip}
              <span className="mt-0.5 block font-sans text-[10px] font-normal text-[var(--text-muted)]">
                {r.label}
              </span>
            </span>,
            <span key="p" className="capitalize">
              {r.profile}
            </span>,
            <StatusBadge key="s" status={r.status} />,
            <span key="ports" className="font-mono">
              {r.ports}
            </span>,
            <span
              key="g"
              className={cn(
                "rounded border px-2 py-0.5 text-[10px] font-bold",
                r.grade === "D"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                  : "border-[var(--border-default)] text-[var(--text-muted)]",
              )}
            >
              {r.grade}
            </span>,
          ])}
        />
      </div>
    </Shell>
  );
}

function MotionPresetRow() {
  return (
    <div className="flex flex-wrap gap-1 rounded-[6px] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-1.5">
      {["Quick Scan", "Standard", "Deep Discovery"].map((p, i) => (
        <button
          key={p}
          type="button"
          className={cn(
            "rounded px-3 py-1.5 text-[10px] font-bold",
            i === 1
              ? "bg-[var(--surface)] text-[var(--brand-primary)] shadow-sm"
              : "text-[var(--text-muted)]",
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

const API_ENDPOINT_ROWS = [
  { method: "GET", path: "/v1/payments", auth: "JWT", risk: "MEDIUM", gateway: "AWS" },
  { method: "POST", path: "/internal/admin", auth: "None", risk: "CRITICAL", gateway: "AWS" },
  { method: "PATCH", path: "/users/{id}", auth: "API Key", risk: "HIGH", gateway: "AZURE" },
];

export function LoginApiSecurityExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          title="API Security Posture Management (ASPM)"
          subtitle="Continuous endpoint discovery across AWS API Gateway, Azure APIM, and Google Apigee, shadow & rogue API detection, OpenAPI schema drift monitoring, and sensitive parameter leakage prevention."
          icon={Workflow}
        />
        <ScanStatusBanner
          status="SCAN_COMPLETED"
          message="124 endpoint(s) from live gateway discovery / uploads (showcase)."
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat label="Total Discovered APIs" value={124} subtitle="Across all gateways" />
          <MiniStat
            label="Unauthenticated APIs"
            value={7}
            subtitle="Missing authorizer or public"
          />
          <MiniStat label="Shadow & Rogue Routes" value={4} subtitle="2 shadow · 2 rogue" />
          <MiniStat
            label="Active Schema Drifts"
            value={3}
            subtitle="Deviations from OpenAPI spec"
          />
        </div>
        <TabPills
          tabs={[
            "Overview & Risk Radar",
            "API Endpoints (124)",
            "Shadow & Rogue APIs (4)",
            "OpenAPI Schema Drift (3)",
            "Sensitive URL Leaks (1)",
          ]}
          activeIndex={1}
        />
        <FilterBar>
          <SearchInput placeholder="Search method, path, gateway..." />
          <MiniSelect label="All gateways" />
          <MiniSelect label="All severities" />
        </FilterBar>
        <CompactTable
          headers={["Method", "Path", "Auth", "Severity", "Gateway"]}
          rows={API_ENDPOINT_ROWS.map((r) => [
            <span key="m" className="font-mono text-[10px] font-bold text-[var(--brand-primary)]">
              {r.method}
            </span>,
            <span key="p" className="font-mono text-[10px]">
              {r.path}
            </span>,
            r.auth,
            <RiskBadge key="s" level={r.risk} />,
            <span key="g" className="inline-flex items-center gap-1 font-mono text-[10px]">
              <ProviderLogo name={r.gateway} size={13} />
              {r.gateway}
            </span>,
          ])}
        />
      </div>
    </Shell>
  );
}

const SHIFT_LEFT_ROWS = [
  { repo: "infra-terraform", branch: "main", findings: 2, status: "BLOCKED" },
  { repo: "payments-k8s", branch: "feat/sidecar", findings: 0, status: "PASSED" },
  { repo: "legacy-cfng", branch: "develop", findings: 5, status: "BLOCKED" },
];

export function LoginShiftLeftExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          title="Developer Shift-Left CLI & IDE Security"
          subtitle="Empower engineers to catch and auto-remediate Terraform, CloudFormation, Helm, and Kubernetes YAML misconfigurations and secret leaks directly in their terminal and IDE before git commit."
          icon={Terminal}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat
            label="Local CLI Scans"
            value={318}
            subtitle="Pre-commit & developer terminal runs"
          />
          <MiniStat
            label="Commits Blocked"
            value={24}
            subtitle="Insecure IaC / leaked secrets stopped"
          />
          <MiniStat
            label="Developer Pass Rate"
            value="91%"
            subtitle="Clean commits passing shift-left"
          />
          <MiniStat label="Active Developers" value={12} subtitle="Across 8 repositories" />
        </div>
        <TabPills
          tabs={[
            "cnapp-cli & Pre-Commit Feed (18)",
            "VS Code Extension",
            "JetBrains Plugin",
            "Rule Taxonomy & Auto-Fixes",
            "Remote PR Gates",
          ]}
        />
        <FilterBar>
          <SearchInput placeholder="Search repository or branch..." />
          <MiniSelect label="All outcomes" />
        </FilterBar>
        <CompactTable
          headers={["Repository", "Branch", "Findings", "Result"]}
          rows={SHIFT_LEFT_ROWS.map((r) => [
            <span key="r" className="font-mono text-[11px]">
              {r.repo}
            </span>,
            r.branch,
            r.findings,
            <StatusBadge key="s" status={r.status} />,
          ])}
        />
      </div>
    </Shell>
  );
}

const IAC_ROWS = [
  { asset: "customer-exports", type: "SECRET", title: "AWS key in bucket policy", sev: "CRITICAL" },
  { asset: "sg-web-tier", type: "IAC_MISCONFIG", title: "0.0.0.0/0 on port 22", sev: "CRITICAL" },
  {
    asset: "main.tf",
    type: "IAC_MISCONFIG",
    title: "S3 block public access disabled",
    sev: "HIGH",
  },
];

export function LoginIacSecretsExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="DevSecOps & Cloud Security"
          title="Infrastructure as Code (IaC) & Secret Security Scanner"
          subtitle="Continuous security static analysis for Terraform (.tf), CloudFormation, Kubernetes YAML, Dockerfiles, and connected cloud assets."
          icon={FileCode2}
        />
        <MotionIacTabs />
        <MotionIacStats />
        <FilterBar>
          <SearchInput placeholder="Search findings..." />
          <MiniSelect label="ALL" />
        </FilterBar>
        <CompactTable
          headers={["Asset", "Category", "Finding", "Severity"]}
          rows={IAC_ROWS.map((r) => [
            <span key="a" className="font-mono text-[10px]">
              {r.asset}
            </span>,
            <span key="c" className="font-mono text-[10px] uppercase">
              {r.type}
            </span>,
            r.title,
            <RiskBadge key="s" level={r.sev} />,
          ])}
        />
      </div>
    </Shell>
  );
}

function MotionIacTabs() {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--brand-primary)] px-3 py-1.5 text-[11px] font-semibold text-white"
      >
        <Cloud className="h-3.5 w-3.5" /> Live Cloud Accounts Scanner
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--border-default)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)]"
      >
        <FileCode2 className="h-3.5 w-3.5" /> File & Template Code Inspector
      </button>
    </div>
  );
}

function MotionIacStats() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <MiniStat label="Scanned Cloud Assets" value={412} />
      <MiniStat label="Total Findings" value={28} />
      <MiniStat label="Hardcoded Secrets" value={3} />
      <MiniStat label="IaC Misconfigs" value={25} />
    </div>
  );
}

const SBOM_COMPONENTS = [
  { name: "openssl", version: "3.0.12", license: "Apache-2.0", cves: 1 },
  { name: "glibc", version: "2.38", license: "LGPL-2.1", cves: 0 },
  { name: "curl", version: "8.4.0", license: "curl", cves: 2 },
];

export function LoginSbomExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="SBOM"
          title="Software Bill of Materials (SBOM) Management"
          subtitle="Upload & correlate SPDX / CycloneDX software manifests to discover supply chain vulnerabilities & license compliance risks across connected cloud assets."
          icon={Package}
        />
        <div className="grid grid-cols-3 gap-2">
          <MiniStat label="Format & Version" value="CycloneDX (1.5)" />
          <MiniStat label="Components" value="142 Packages" />
          <MiniStat label="Vulnerabilities" value="7 CVE Matches" />
        </div>
        <FilterBar>
          <SearchInput placeholder="Search component name..." />
          <MiniSelect label="All licenses" />
        </FilterBar>
        <CompactTable
          headers={["Package", "Version", "License", "CVEs"]}
          rows={SBOM_COMPONENTS.map((c) => [
            <span key="n" className="font-mono text-[11px]">
              {c.name}
            </span>,
            c.version,
            c.license,
            <span
              key="v"
              className={c.cves ? "font-mono text-[#E35D62]" : "text-[var(--text-muted)]"}
            >
              {c.cves}
            </span>,
          ])}
        />
      </div>
    </Shell>
  );
}

const AI_ASSET_ROWS = [
  { name: "prod-llm-gateway", service: "Azure OpenAI", risk: "HIGH" },
  { name: "fraud-detector-sm", service: "SageMaker", risk: "MEDIUM" },
  { name: "embeddings-pg", service: "pgvector", risk: "CRITICAL" },
];

export function LoginAiSpmExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          title="AI Security Posture Management (AI-SPM)"
          subtitle="Continuous security discovery and posture auditing across Amazon SageMaker, Azure OpenAI, Google Vertex AI, LLM API key leaks, vector databases, and OWASP Top 10 for LLMs."
          icon={Bot}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <MiniStat
            label="Cloud AI Assets"
            value={18}
            subtitle="6 SageMaker • 5 Azure • 7 Vertex"
          />
          <MiniStat
            label="Active LLM Key Leaks"
            value={2}
            subtitle="OpenAI, Anthropic, HuggingFace, Cohere"
          />
          <MiniStat
            label="Vector Databases"
            value={4}
            subtitle="Pinecone, Weaviate, Milvus, Chroma, pgvector"
          />
          <MiniStat
            label="PII in Training Data"
            value={1}
            subtitle="Training buckets with sensitive customer data"
          />
          <MiniStat
            label="OWASP Compliance"
            value="82%"
            subtitle="OWASP Top 10 for Large Language Models"
          />
        </div>
        <TabPills
          tabs={[
            "AI Posture & OWASP Radar",
            "Cloud AI/ML Assets (18)",
            "LLM Key Leaks (2)",
            "Vector Databases (4)",
            "Training Data Guardrails",
            "OWASP Top 10 LLMs",
          ]}
          activeIndex={1}
        />
        <CompactTable
          headers={["Asset", "Service", "Risk"]}
          rows={AI_ASSET_ROWS.map((r) => [
            r.name,
            r.service,
            <RiskBadge key="rk" level={r.risk} />,
          ])}
        />
      </div>
    </Shell>
  );
}

const MITRE_TACTICS = [
  "Initial Access",
  "Execution",
  "Persistence",
  "Privilege Esc",
  "Defense Evasion",
  "Credential Access",
];

export function LoginMitreExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          title="MITRE ATT&CK & Cloud Detection & Response (CDR)"
          subtitle="Real-time multi-cloud audit log stream telemetry, behavioral anomaly detection (impossible travel, off-hours access, bulk egress), and automated closed-loop SOAR containment."
          icon={Layers}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat
            label="Audit Events Analyzed"
            value="48.2k"
            subtitle="CloudTrail, Azure Activity, GCP Audit"
          />
          <MiniStat label="Active Threats Detected" value={3} subtitle="1 Critical · 2 High" />
          <MiniStat
            label="Closed-Loop Contained"
            value={2}
            subtitle="Zero-touch autonomous remediation"
          />
          <MiniStat
            label="SOAR Playbooks Executed"
            value={5}
            subtitle="Isolate VM · Revoke IAM · Block S3"
          />
        </div>
        <TabPills
          tabs={[
            "MITRE ATT&CK Matrix",
            "Threat Incidents (3)",
            "Live Audit Stream (120)",
            "SOAR Playbooks",
          ]}
        />
        <div className="overflow-x-auto rounded-[6px] border border-[var(--border-default)] p-2">
          <div className="flex min-w-[480px] gap-2">
            {MITRE_TACTICS.map((t) => (
              <div
                key={t}
                className="min-w-[72px] flex-1 rounded border border-[var(--border-default)] bg-[var(--surface-secondary)] p-2"
              >
                <p className="text-[9px] font-bold uppercase text-[var(--text-muted)]">{t}</p>
                <div className="mt-1 space-y-1">
                  <span className="block rounded bg-[#E35D62]/15 px-1 py-0.5 text-[8px] font-mono text-[#E35D62]">
                    T1078
                  </span>
                  <span className="block rounded bg-amber-500/15 px-1 py-0.5 text-[8px] font-mono text-amber-500">
                    T1526
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

const SOAR_PLAYBOOKS = [
  {
    title: "Revoke compromised IAM access keys",
    category: "IDENTITY",
    impact: "CRITICAL_REDUCTION",
  },
  {
    title: "Close public SSH on security group",
    category: "NETWORK",
    impact: "CRITICAL_REDUCTION",
  },
  { title: "Block S3 public ACL", category: "GOVERNANCE", impact: "HIGH_REDUCTION" },
];

export function LoginSoarExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          title="Step-by-Step Manual Remediation Center"
          subtitle="Generate detailed, copyable CLI commands, Terraform IaC snippets, Cloud Console walkthroughs, and safety verification procedures."
          icon={Zap}
        />
        <ScanStatusBanner
          status="NOT_CONFIGURED"
          message="Automated cloud containment APIs are Not Configured — this center generates manual remediation guides only. CDR SOAR playbooks will report FAILED until remediation adapters are wired."
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat label="Manual Remediation Playbooks" value={8} />
          <MiniStat label="Manual Fix Guides Generated" value={12} />
          <MiniStat label="Zero-Downtime Safe Fixes" value="100%" />
          <MiniStat label="Automated Auto-Mutations" value="Disabled (0)" />
        </div>
        <TabPills tabs={["Remediation Playbooks (8)", "Guide Generation Audit History (12)"]} />
        <CompactTable
          headers={["Playbook", "Category", "Risk impact"]}
          rows={SOAR_PLAYBOOKS.map((p) => [
            p.title,
            <span key="c" className="font-mono text-[10px]">
              {p.category}
            </span>,
            <span key="i" className="font-mono text-[10px] text-emerald-400">
              {p.impact.replace(/_/g, " ")}
            </span>,
          ])}
        />
      </div>
    </Shell>
  );
}

const REMEDIATION_QUEUE = [
  { id: "REM-1042", control: "CLOSE_PUBLIC_SSH", proposer: "m.lee", status: "PENDING_APPROVAL" },
  { id: "REM-1038", control: "BLOCK_S3_PUBLIC", proposer: "s.admin", status: "PENDING_APPROVAL" },
];

export function LoginRemediationExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <div className="rounded-[6px] border border-[var(--border-default)] bg-[var(--surface)] p-4">
          <span className="inline-flex items-center gap-2 rounded border border-[var(--brand-border)] bg-[var(--brand-soft)] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[var(--brand-primary)]">
            <UserCheck className="h-3 w-3" /> DUAL-CONTROL WORKFLOW & BLAST RADIUS VERIFICATION
          </span>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Two-Person Remediation Approval Console
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Enforce separation of duties for all cloud remediation mutations. Engineers propose
            targeted configuration updates and review pre-flight blast radius; a separate peer
            engineer or security administrator must authorize execution.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MiniStat label="Pending Approvals" value={2} subtitle="awaiting peer" />
            <MiniStat label="Executed Changes" value={14} subtitle="audited mutations" />
            <MiniStat label="Rollback Ready" value="100%" subtitle="reversal plans" />
            <MiniStat label="Target AWS Accounts" value={3} subtitle="connected" />
          </div>
        </div>
        <CompactTable
          headers={["Request", "Control", "Proposer", "Status"]}
          rows={REMEDIATION_QUEUE.map((r) => [
            <span key="i" className="font-mono text-[10px]">
              {r.id}
            </span>,
            r.control,
            r.proposer,
            <StatusBadge key="s" status={r.status} />,
          ])}
        />
      </div>
    </Shell>
  );
}

export function LoginAssistantExact() {
  return (
    <Shell>
      <div className="overflow-hidden rounded-[6px] border border-[var(--border-default)] bg-[var(--surface)]">
        <header className="flex items-center gap-3 border-b border-[var(--border-default)] bg-[var(--surface-elevated)] px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--brand-border)] bg-[var(--brand-soft)] text-[var(--brand-primary)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-[var(--text-primary)]">Security Copilot</h1>
              <span className="rounded border border-[var(--border-default)] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--text-muted)]">
                Cites tenant records
              </span>
            </div>
            <p className="truncate text-[10px] text-[var(--text-muted)]">
              Findings, assets, and remediation from all connected accounts.
            </p>
          </div>
        </header>
        <div className="flex min-h-[180px]">
          <aside className="hidden w-36 shrink-0 border-r border-[var(--border-default)] p-2 sm:block">
            <button
              type="button"
              className="w-full rounded-[6px] bg-[var(--brand-primary)] px-2 py-1 text-[10px] font-semibold text-white"
            >
              New investigation
            </button>
            <p className="mt-2 font-mono text-[9px] uppercase text-[var(--text-muted)]">
              Threads · 3
            </p>
          </aside>
          <div className="flex flex-1 flex-col gap-2 p-3 text-xs">
            <div className="rounded-[6px] border border-[var(--border-default)] bg-[var(--surface-secondary)] p-2 text-[var(--text-secondary)]">
              Summarize critical open findings on production AWS and suggest remediation order.
            </div>
            <div className="rounded-[6px] border border-[var(--brand-border)] bg-[var(--brand-soft)]/30 p-2 text-[var(--text-primary)]">
              3 critical findings: public S3 with PII, SSH on bastion SG, KEV CVE in payments/api
              image. Start with S3 ACL and SG ingress.
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

const NOTIF_RULES = [
  {
    name: "Critical CSPM → Slack",
    channel: "SLACK",
    sev: "CRITICAL",
    dest: "#security-alerts",
    on: true,
  },
  {
    name: "PagerDuty on CVE KEV",
    channel: "PAGERDUTY",
    sev: "HIGH",
    dest: "svc_cnapp_prod",
    on: true,
  },
  {
    name: "SIEM webhook export",
    channel: "WEBHOOK",
    sev: "MEDIUM",
    dest: "https://siem.acme/ingest",
    on: false,
  },
];

export function LoginNotificationsExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="Operations"
          title="Security Notifications & Webhooks"
          subtitle="Manage automated alerting pipelines, Slack channels, Microsoft Teams, PagerDuty, and SIEM webhooks."
          icon={Bell}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniStat label="Active Rules" value={2} />
          <MiniStat label="Total Rules" value={3} />
          <MiniStat label="Delivered Alerts" value={842} />
          <MiniStat label="Failed Deliveries" value={3} />
        </div>
        <TabPills tabs={["Alerting Rules (3)", "Delivery History (845)"]} />
        <CompactTable
          headers={["Rule Name", "Channel", "Min Severity", "Target Destination", "Status"]}
          rows={NOTIF_RULES.map((r) => [
            r.name,
            <span key="ch" className="font-mono text-[10px]">
              {r.channel}
            </span>,
            <RiskBadge key="s" level={r.sev} />,
            <span key="d" className="max-w-[120px] truncate font-mono text-[10px]">
              {r.dest}
            </span>,
            <span
              key="on"
              className={
                r.on
                  ? "font-mono text-[10px] text-emerald-400"
                  : "font-mono text-[10px] text-[var(--text-muted)]"
              }
            >
              {r.on ? "ENABLED" : "DISABLED"}
            </span>,
          ])}
        />
      </div>
    </Shell>
  );
}

const USER_ROWS = [
  {
    name: "Maya Lee",
    email: "m.lee@acme.io",
    roles: "Security Admin",
    status: "ACTIVE",
    login: "2h ago",
  },
  {
    name: "Sam Admin",
    email: "s.admin@acme.io",
    roles: "Org Admin",
    status: "ACTIVE",
    login: "1d ago",
  },
  {
    name: "Dev Bot",
    email: "ci-bot@acme.io",
    roles: "No Role Assigned",
    status: "ACTIVE",
    login: "Never",
  },
];

export function LoginUsersExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="IAM"
          title="Team & Access"
          subtitle="Manage organization members, RBAC role assignments, and pending invitations."
          icon={Users}
        />
        <TabPills tabs={["Members (8)", "Pending invites (1)", "SCIM 2.0 (Enterprise)"]} />
        <FilterBar>
          <SearchInput placeholder="Search members by name or email..." />
        </FilterBar>
        <CompactTable
          headers={["User", "Assigned Roles", "Status", "Last Login"]}
          rows={USER_ROWS.map((u) => [
            <span key="u">
              <span className="font-medium text-[var(--text-primary)]">{u.name}</span>
              <span className="mt-0.5 block font-mono text-[10px] text-[var(--text-muted)]">
                {u.email}
              </span>
            </span>,
            u.roles,
            <StatusBadge key="s" status={u.status} />,
            <span key="l" className="font-mono text-[10px]">
              {u.login}
            </span>,
          ])}
        />
      </div>
    </Shell>
  );
}

const ROLE_LIST = [
  {
    name: "Org Admin",
    desc: "Full organization administration",
    users: 2,
    perms: 48,
    system: true,
  },
  {
    name: "Security Analyst",
    desc: "Read findings, alerts, reports",
    users: 5,
    perms: 32,
    system: false,
  },
  {
    name: "Cloud Engineer",
    desc: "Assets and remediation propose",
    users: 3,
    perms: 24,
    system: false,
  },
];

export function LoginRolesExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="RBAC"
          title="Roles & Permissions"
          subtitle="3 roles defined for your organization with granular resource scoping."
          icon={Lock}
        />
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          <div className="space-y-1 rounded-[6px] border border-[var(--border-default)] lg:col-span-1">
            {ROLE_LIST.map((role, i) => (
              <button
                key={role.name}
                type="button"
                className={cn(
                  "w-full border-b border-[var(--border-default)] p-3 text-left last:border-b-0",
                  i === 0
                    ? "border-l-2 border-l-[var(--brand-primary)] bg-[var(--brand-soft)]/40"
                    : "",
                )}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                  <span className="font-mono text-xs font-medium">{role.name}</span>
                  {role.system ? (
                    <span className="rounded border border-[var(--border-default)] px-1 text-[9px] uppercase">
                      System
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-[10px] text-[var(--text-muted)]">{role.desc}</p>
                <p className="mt-1 font-mono text-[9px] uppercase text-[var(--text-muted)]">
                  {role.users} users · {role.perms} permissions
                </p>
              </button>
            ))}
          </div>
          <div className="rounded-[6px] border border-[var(--border-default)] p-3 lg:col-span-2">
            <p className="text-xs font-semibold text-[var(--text-primary)]">
              cspm:read · alerts:read · reports:read · …
            </p>
            <p className="mt-2 text-[10px] text-[var(--text-muted)]">
              Granular permission matrix for Security Analyst (showcase).
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export function LoginOrganizationExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <IamHeader
          badge="Settings"
          title="Organization & Account"
          subtitle="Manage tenant settings, your profile, security, and appearance."
          icon={Settings2}
        />
        <TabPills tabs={["Organization", "My profile", "Security", "Appearance"]} />
        <div className="rounded-[6px] border border-[var(--border-default)] bg-[var(--surface)] p-4">
          <p className="font-mono text-[10px] uppercase text-[var(--text-muted)]">Tenant</p>
          <p className="text-sm font-bold text-[var(--text-primary)]">Acme Cloud Security</p>
          <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
            slug: acme · data region: us-east-1
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-[var(--border-default)] p-2">
              <span className="text-[var(--text-muted)]">Plan</span>
              <p className="font-semibold">Enterprise</p>
            </div>
            <div className="rounded border border-[var(--border-default)] p-2">
              <span className="text-[var(--text-muted)]">SSO</span>
              <p className="font-semibold">SAML enabled</p>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

const PARTNER_TENANTS = [
  { name: "RetailCo", slug: "retailco", region: "us", plan: "Professional", users: 12, clouds: 4 },
  { name: "FinServ Ltd", slug: "finserv", region: "eu", plan: "Enterprise", users: 28, clouds: 9 },
];

export function LoginPartnerExact() {
  return (
    <Shell>
      <div className="space-y-3">
        <div className="border-b border-[var(--border-default)] pb-3">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            MSSP / partner tenants
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-[var(--text-muted)]">
            Manage customer organizations linked to your partner account. Platform admins can also
            create links from the admin portal.
          </p>
        </div>
        <FilterBar>
          <SearchInput placeholder="Tenant organization UUID" />
          <button
            type="button"
            className="rounded-[6px] bg-[var(--brand-primary)] px-3 py-1.5 text-[11px] font-semibold text-white"
          >
            Link tenant
          </button>
        </FilterBar>
        <CompactTable
          headers={["Tenant", "Region", "Plan", "Users / clouds"]}
          rows={PARTNER_TENANTS.map((t) => [
            <span key="n">
              <span className="flex items-center gap-1 font-medium">
                <Building2 className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                {t.name}
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">{t.slug}</span>
            </span>,
            t.region,
            t.plan,
            `${t.users} / ${t.clouds}`,
          ])}
        />
      </div>
    </Shell>
  );
}

/** Routes rendered by dedicated *Exact files in LoginMockConsole (not RENDERERS). */
export const SHOWCASE_DEDICATED_HREFS = [
  "/dashboard",
  "/news",
  "/security-score",
  "/search",
  "/academy",
] as const;

export const LOGIN_MODULE_EXACT_HREFS = [
  "/policies",
  "/findings",
  "/assets",
  "/compliance",
  "/dspm",
  "/vulnerabilities",
  "/containers",
  "/kubernetes",
  "/runtime",
  "/compute",
  "/side-scan",
  "/ciem",
  "/attack-paths",
  "/alerts",
  "/reports",
  "/audit",
  "/cloud",
  "/billing",
  "/ip-scanner",
  "/api-security",
  "/shift-left",
  "/iac-secrets",
  "/sbom",
  "/ai-spm",
  "/mitre",
  "/soar",
  "/remediation",
  "/assistant",
  "/notifications",
  "/users",
  "/roles",
  "/organization",
  "/partner",
] as const;

function baseHref(href: string): string {
  const parts = href.split("/").filter(Boolean);
  if (parts.length === 0) return "/dashboard";
  return `/${parts[0]}`;
}

const RENDERERS: Record<string, () => ReactNode> = {
  "/policies": () => <LoginPoliciesExact />,
  "/findings": () => <LoginFindingsExact />,
  "/assets": () => <LoginAssetsExact />,
  "/compliance": () => <LoginComplianceExact />,
  "/dspm": () => <LoginDspmExact />,
  "/vulnerabilities": () => <LoginVulnerabilitiesExact />,
  "/containers": () => <LoginContainersExact />,
  "/kubernetes": () => <LoginKubernetesExact />,
  "/runtime": () => <LoginRuntimeExact />,
  "/compute": () => <LoginComputeExact />,
  "/side-scan": () => <LoginSideScanExact />,
  "/ciem": () => <LoginCiemExact />,
  "/attack-paths": () => <LoginAttackPathsExact />,
  "/alerts": () => <LoginAlertsExact />,
  "/reports": () => <LoginReportsExact />,
  "/audit": () => <LoginAuditExact />,
  "/cloud": () => <LoginCloudExact />,
  "/billing": () => <LoginBillingExact />,
  "/ip-scanner": () => <LoginIpScannerExact />,
  "/api-security": () => <LoginApiSecurityExact />,
  "/shift-left": () => <LoginShiftLeftExact />,
  "/iac-secrets": () => <LoginIacSecretsExact />,
  "/sbom": () => <LoginSbomExact />,
  "/ai-spm": () => <LoginAiSpmExact />,
  "/mitre": () => <LoginMitreExact />,
  "/soar": () => <LoginSoarExact />,
  "/remediation": () => <LoginRemediationExact />,
  "/assistant": () => <LoginAssistantExact />,
  "/notifications": () => <LoginNotificationsExact />,
  "/users": () => <LoginUsersExact />,
  "/roles": () => <LoginRolesExact />,
  "/organization": () => <LoginOrganizationExact />,
  "/partner": () => <LoginPartnerExact />,
};

export function LoginModuleExact({ href }: { href: string }) {
  const key = baseHref(href);
  const render = RENDERERS[key];
  if (!render) return null;
  return <>{render()}</>;
}

export function hasLoginModuleExact(href: string): boolean {
  return Boolean(RENDERERS[baseHref(href)]);
}

export function isNavHrefShowcaseCovered(href: string): boolean {
  if (SHOWCASE_DEDICATED_HREFS.some((d) => href === d || href.startsWith(`${d}/`))) {
    return true;
  }
  return hasLoginModuleExact(href);
}

/** Every NAV_SECTIONS item.href must resolve to a dedicated or module exact twin. */
export function assertNavSectionsHaveExactTwins(): void {
  const missing: string[] = [];
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (!isNavHrefShowcaseCovered(item.href)) {
        missing.push(item.href);
      }
    }
  }
  if (missing.length > 0) {
    throw new Error(`NAV_SECTIONS missing exact twin for: ${missing.join(", ")}`);
  }
}

if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
  try {
    assertNavSectionsHaveExactTwins();
  } catch (err) {
    console.error("[LoginModuleExacts]", err);
  }
}
