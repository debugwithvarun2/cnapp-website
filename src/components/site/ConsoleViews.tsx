import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  Clock3,
  Cloud,
  Eye,
  FileCheck,
  GraduationCap,
  Layers,
  Newspaper,
  Play,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { DEMO, type ConsoleHref, type Severity } from "./consoleData";
import { packFor, type PackSeverity } from "./modulePacks";

export function RiskBadge({ level }: { level: Severity | PackSeverity }) {
  const map: Record<string, string> = {
    CRITICAL: "border-[#E35D62]/40 bg-[#E35D62]/15 text-[#E35D62]",
    HIGH: "border-[#E69A52]/40 bg-[#E69A52]/15 text-[#E69A52]",
    MEDIUM: "border-[#D4AE4C]/40 bg-[#D4AE4C]/15 text-[#D4AE4C]",
    LOW: "border-[#43AE86]/40 bg-[#43AE86]/15 text-[#43AE86]",
    INFO: "border-[var(--cs-border)] bg-[var(--cs-surface-2)] text-[var(--cs-text-muted)]",
    PASS: "border-[#43AE86]/40 bg-[#43AE86]/15 text-[#43AE86]",
  };
  const dots: Record<string, string> = {
    CRITICAL: "bg-[#E35D62]",
    HIGH: "bg-[#E69A52]",
    MEDIUM: "bg-[#D4AE4C]",
    LOW: "bg-[#43AE86]",
    INFO: "bg-[var(--cs-text-muted)]",
    PASS: "bg-[#43AE86]",
  };
  const label =
    level === "CRITICAL"
      ? "Critical"
      : level === "HIGH"
        ? "High"
        : level === "MEDIUM"
          ? "Medium"
          : level === "LOW"
            ? "Low"
            : level === "PASS"
              ? "Pass"
              : "Info";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide",
        map[level] ?? map["INFO"],
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dots[level] ?? dots["INFO"])} />
      {label}
    </span>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  badge,
  icon,
  accent,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  badge?: string;
  icon: React.ReactNode;
  accent: "green" | "red" | "orange" | "steel" | "primary";
  trend?: { value: number; label: string; positive: boolean };
}) {
  const accents = {
    green:
      "border-[color-mix(in_srgb,var(--cs-sev-low)_40%,transparent)] bg-[color-mix(in_srgb,var(--cs-sev-low)_14%,transparent)] text-[var(--cs-sev-low)]",
    red: "border-[color-mix(in_srgb,var(--cs-sev-critical)_40%,transparent)] bg-[color-mix(in_srgb,var(--cs-sev-critical)_14%,transparent)] text-[var(--cs-sev-critical)]",
    orange:
      "border-[color-mix(in_srgb,var(--cs-sev-high)_40%,transparent)] bg-[color-mix(in_srgb,var(--cs-sev-high)_14%,transparent)] text-[var(--cs-sev-high)]",
    steel:
      "border-[color-mix(in_srgb,#94A3B8_40%,transparent)] bg-[color-mix(in_srgb,#94A3B8_14%,transparent)] text-[#94A3B8]",
    primary: "border-[var(--cs-brand-border)] bg-[var(--cs-brand-soft)] text-[var(--cs-brand)]",
  };
  let badgeStyle = "border-[var(--cs-border)] bg-[var(--cs-surface-2)] text-[var(--cs-text-2)]";
  if (badge) {
    const lower = badge.toLowerCase();
    if (lower.includes("urgent") || lower.includes("critical")) {
      badgeStyle =
        "border-[color-mix(in_srgb,var(--cs-sev-critical)_40%,transparent)] bg-[color-mix(in_srgb,var(--cs-sev-critical)_14%,transparent)] text-[var(--cs-sev-critical)]";
    } else if (lower.includes("good") || lower.includes("pass") || lower.includes("active")) {
      badgeStyle =
        "border-[color-mix(in_srgb,var(--cs-sev-low)_40%,transparent)] bg-[color-mix(in_srgb,var(--cs-sev-low)_14%,transparent)] text-[var(--cs-sev-low)]";
    }
  }
  return (
    <div className="rounded-[7px] border border-[var(--cs-border)] bg-[var(--cs-surface)] px-2.5 py-2.5">
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-1">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--cs-text-muted)]">
              {title}
            </p>
            {badge && (
              <span
                className={cn(
                  "rounded-[3px] border px-1 py-px text-[8px] font-mono font-bold uppercase",
                  badgeStyle,
                )}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-[1.25rem] font-bold leading-none tracking-[-0.03em] text-[var(--cs-text)]">
            {value}
          </p>
          <p className="truncate text-[9px] text-[var(--cs-text-2)]">{subtitle}</p>
          {trend && (
            <div className="flex items-center gap-1 font-mono text-[9px]">
              <span
                className={cn(
                  "font-bold",
                  trend.positive ? "text-[var(--cs-sev-low)]" : "text-[var(--cs-sev-critical)]",
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-[var(--cs-text-muted)]">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn("shrink-0 rounded-[5px] border p-1.5", accents[accent])}>{icon}</div>
      </div>
    </div>
  );
}

function PrimaryBtn({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--cs-brand)] px-3 py-1.5 text-xs font-semibold text-white">
      {children}
    </span>
  );
}

const OVERVIEW_FINDINGS = [
  {
    id: "1",
    name: "customer-exports",
    type: "S3_BUCKET",
    provider: "AWS",
    riskLevel: "CRITICAL" as Severity,
    reason: "Public access block disabled · world-readable ACL",
  },
  {
    id: "2",
    name: "sg-prod-bastion",
    type: "SECURITY_GROUP",
    provider: "AWS",
    riskLevel: "CRITICAL" as Severity,
    reason: "0.0.0.0/0 ingress on TCP 22",
  },
  {
    id: "3",
    name: "ci-deployer",
    type: "IAM_ROLE",
    provider: "AWS",
    riskLevel: "HIGH" as Severity,
    reason: "AdministratorAccess attached · unused 14d",
  },
  {
    id: "4",
    name: "payments/api:1.14.2",
    type: "CONTAINER_IMAGE",
    provider: "AWS",
    riskLevel: "HIGH" as Severity,
    reason: "CVE-2024-3094 (KEV) in xz-utils",
  },
  {
    id: "5",
    name: "aks-nodepool-1",
    type: "COMPUTE",
    provider: "AZURE",
    riskLevel: "MEDIUM" as Severity,
    reason: "Privileged container workload detected",
  },
];

const PILLARS = [
  { name: "CSPM misconfigurations", score: 72, color: "#43AE86" },
  { name: "CIEM excess roles", score: 68, color: "#A18BE0" },
  { name: "Vulnerability CVEs", score: 61, color: "#D4AE4C" },
  { name: "Container exposure", score: 74, color: "#3b82f6" },
  { name: "Unencrypted data", score: 81, color: "#E69A52" },
];

/** Exact twin of Septer LoginDashboardExact / DashboardPage overview. */
export function OverviewView({ onNavigate }: { onNavigate: (href: ConsoleHref) => void }) {
  const [provider, setProvider] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState<"ALL" | Severity>("ALL");
  const [selectedId, setSelectedId] = useState(OVERVIEW_FINDINGS[0]?.id ?? null);

  const topology = DEMO.providers.map((p) => ({
    name: `${p.label} Assets`,
    value: p.count,
    percentage: `${Math.round((p.count / DEMO.totalAssets) * 100)}%`,
    color: p.color,
  }));

  const findings = useMemo(
    () =>
      OVERVIEW_FINDINGS.filter((f) => {
        const okProv =
          provider === "ALL" ||
          f.provider === provider ||
          (provider === "AZURE" && f.provider === "AZURE");
        const okSev = severityFilter === "ALL" || f.riskLevel === severityFilter;
        return okProv && okSev;
      }),
    [provider, severityFilter],
  );

  return (
    <div className="space-y-3">
      <div
        role="status"
        className="rounded-[5px] border border-[color-mix(in_srgb,var(--cs-sev-low)_45%,transparent)] bg-[color-mix(in_srgb,var(--cs-sev-low)_12%,transparent)] px-2.5 py-1 font-mono text-[10px] text-[var(--cs-sev-low)]"
      >
        <span className="font-semibold tracking-wide">Scan Completed</span>
        <span className="ml-2 opacity-90">
          SCAN_COMPLETED · {DEMO.findingCount} findings · {DEMO.totalCloudAccounts} accounts
        </span>
      </div>

      <div className="rounded-[7px] border border-[var(--cs-border)] bg-[var(--cs-surface)] p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h2 className="text-[15px] font-bold tracking-tight">Multi-cloud posture</h2>
            <p className="text-[11px] text-[var(--cs-text-2)]">
              {DEMO.totalAssets.toLocaleString()} assets across {DEMO.totalCloudAccounts} connected
              accounts
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center rounded-[5px] border border-[var(--cs-border)] bg-[var(--cs-bg)] p-0.5">
              {["ALL", "AWS", "AZURE", "GCP"].map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => setProvider(prov)}
                  className={cn(
                    "rounded-[4px] px-2 py-0.5 text-[10px] font-medium transition-colors",
                    provider === prov
                      ? "bg-[var(--cs-brand)] font-semibold text-white"
                      : "text-[var(--cs-text-2)] hover:text-[var(--cs-text)]",
                  )}
                >
                  {prov === "ALL" ? "ALL" : prov === "AZURE" ? "Azure" : prov}
                </button>
              ))}
            </div>
            <PrimaryBtn>
              <Play className="h-3 w-3 fill-current" />
              Trigger Assessment
            </PrimaryBtn>
            <button
              type="button"
              className="rounded-[5px] border border-[var(--cs-border)] bg-[var(--cs-bg)] p-1.5 text-[var(--cs-text-2)]"
              aria-label="Refresh"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 xl:grid-cols-6">
        <StatCard
          title="Overall Posture"
          value={DEMO.postureScore}
          subtitle="Security index / 100"
          badge="Good"
          trend={{ value: 1.3, label: "30d", positive: true }}
          icon={<Activity className="h-3.5 w-3.5" />}
          accent="green"
        />
        <StatCard
          title="Critical Findings"
          value={DEMO.criticalAssets}
          subtitle="Require urgent fix"
          badge="URGENT"
          icon={<ShieldAlert className="h-3.5 w-3.5" />}
          accent="red"
        />
        <StatCard
          title="High Risk Assets"
          value={DEMO.highAssets}
          subtitle="Misconfigured resources"
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          accent="orange"
        />
        <StatCard
          title="Compliance Score"
          value={`${DEMO.postureScore}%`}
          subtitle="Passing checks"
          badge="Passing"
          icon={<FileCheck className="h-3.5 w-3.5" />}
          accent="green"
        />
        <StatCard
          title="Monitored Assets"
          value={DEMO.totalAssets}
          subtitle="982 AWS, 514 Azure, 346 GCP"
          icon={<Server className="h-3.5 w-3.5" />}
          accent="steel"
        />
        <StatCard
          title="Cloud Accounts"
          value={DEMO.totalCloudAccounts}
          subtitle="AWS, Azure, GCP active"
          icon={<Cloud className="h-3.5 w-3.5" />}
          accent="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="rounded-[7px] border border-[var(--cs-border)] bg-[var(--cs-surface)]/90 p-3 lg:col-span-7">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[var(--cs-border)] pb-2">
            <div>
              <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                <Shield className="h-3.5 w-3.5 text-[var(--cs-brand)]" />
                Security Posture & Exposure Risk Matrix
              </h3>
              <p className="mt-0.5 text-[10px] text-[var(--cs-text-muted)]">
                Evaluated across {DEMO.totalAssets} workloads, IAM roles, and storage buckets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("/security-score")}
              className="rounded border border-[var(--cs-brand-border)] bg-[var(--cs-brand-soft)] px-2 py-0.5 font-mono text-[9px] font-semibold text-[var(--cs-brand)]"
            >
              5 Pillars Audited
            </button>
          </div>
          <div className="mt-3 space-y-2.5">
            {PILLARS.map((p, i) => (
              <div key={p.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: p.color }}
                    />
                    {p.name}
                  </span>
                  <span className="font-mono text-[11px] font-bold" style={{ color: p.color }}>
                    {p.score} / 100
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--cs-bg)]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: p.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${p.score}%` }}
                    transition={{ duration: 0.7, delay: i * 0.05 }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-[var(--cs-border)] pt-2 text-[10px]">
              <span className="text-[var(--cs-text-muted)]">
                Active SOAR containment playbooks: 6 ready
              </span>
              <button
                type="button"
                onClick={() => onNavigate("/security-score")}
                className="font-semibold text-[var(--cs-brand)]"
              >
                Deep Audit View
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[7px] border border-[var(--cs-border)] bg-[var(--cs-surface)]/90 p-3 lg:col-span-5">
          <div className="border-b border-[var(--cs-border)] pb-2">
            <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5 text-[var(--cs-brand)]" />
              Multi-Cloud Topology
            </h3>
            <p className="mt-0.5 text-[10px] text-[var(--cs-text-muted)]">
              Asset distribution by provider.
            </p>
          </div>
          <div className="relative mt-2 flex h-[140px] items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topology}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={62}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {topology.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold">{DEMO.totalAssets}</span>
              <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--cs-text-muted)]">
                Total Assets
              </span>
            </div>
          </div>
          <div className="mt-1 space-y-1">
            {topology.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded border border-[var(--cs-border)] bg-[var(--cs-bg)] px-2 py-1 text-[10px]"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-1.5 rounded-sm" style={{ background: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono text-[var(--cs-text-2)]">
                  {item.value} ({item.percentage})
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onNavigate("/attack-paths")}
            className="mt-2 w-full rounded border border-[color-mix(in_srgb,var(--cs-sev-critical)_35%,transparent)] bg-[color-mix(in_srgb,var(--cs-sev-critical)_10%,transparent)] p-2 text-left"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--cs-sev-critical)]">
              <AlertTriangle className="h-3.5 w-3.5" /> Active Critical Attack Path
            </div>
            <p className="mt-1 text-[10px] text-[var(--cs-text-2)]">
              Public Port 22 → Ingress VM → EC2 Instance Profile → Sensitive S3
            </p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="overflow-hidden rounded-[7px] border border-[var(--cs-border)] bg-[var(--cs-surface)]/90 lg:col-span-7">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--cs-border)] px-3 py-2">
            <h3 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
              <AlertCircle className="h-3.5 w-3.5 text-[var(--cs-sev-critical)]" />
              Top Critical Unresolved Misconfigurations
            </h3>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as "ALL" | Severity)}
              className="rounded border border-[var(--cs-border)] bg-[var(--cs-bg)] px-2 py-0.5 text-[10px] text-[var(--cs-text)]"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
            </select>
          </div>
          <div className="divide-y divide-[var(--cs-border)]">
            {findings.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedId(f.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-white/[0.03]",
                  selectedId === f.id && "bg-white/[0.04]",
                )}
              >
                <RiskBadge level={f.riskLevel} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold">{f.name}</p>
                  <p className="truncate text-[10px] text-[var(--cs-text-muted)]">{f.reason}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--cs-brand)]">
                  <Eye className="h-3 w-3" /> Inspect
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[7px] border border-[var(--cs-border)] bg-[var(--cs-surface)]/90 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-[var(--cs-border)] px-3 py-2">
            <h3 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
              <Newspaper className="h-3.5 w-3.5 text-[var(--cs-brand)]" /> Latest news
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("/news")}
              className="text-[10px] font-semibold text-[var(--cs-brand)]"
            >
              All
            </button>
          </div>
          <ul>
            {DEMO.news.slice(0, 4).map((n) => (
              <li key={n.title} className="border-b border-white/5 px-3 py-2 last:border-0">
                <div className="font-mono text-[8px] text-[var(--cs-text-muted)]">
                  {n.source} · {n.ago}
                </div>
                <p className="line-clamp-2 text-[11px] font-semibold leading-snug">{n.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function NewsView() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Security News</h2>
          <p className="mt-0.5 text-[12px] text-[var(--cs-text-2)]">
            Security feed · updates ~15 min
          </p>
        </div>
        <PrimaryBtn>
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </PrimaryBtn>
      </div>
      <div className="space-y-2.5">
        {DEMO.news.map((n) => (
          <article
            key={n.title}
            className="rounded-[8px] border border-[var(--cs-border)] bg-[var(--cs-surface)] px-4 py-3"
          >
            <div className="font-mono text-[10px] text-[var(--cs-text-muted)]">
              {n.source} · {n.ago}
            </div>
            <p className="mt-1.5 text-sm font-semibold leading-snug">{n.title}</p>
            <span className="mt-2 inline-flex items-center gap-0.5 text-[11px] font-semibold text-[var(--cs-brand)]">
              Read more <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}

function AcademyView() {
  const journeys = [
    { title: "Connect your first cloud", category: "Getting Started", steps: 5, progress: 100 },
    { title: "Run a CSPM assessment", category: "Cloud Security", steps: 4, progress: 75 },
    { title: "Triage critical findings", category: "Cloud Security", steps: 6, progress: 40 },
    { title: "Map an attack path", category: "Risk Management", steps: 5, progress: 20 },
    { title: "Approve a remediation", category: "Operations", steps: 4, progress: 0 },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-[8px] border border-[var(--cs-border)] bg-[var(--cs-surface)] p-4">
        <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-[var(--cs-brand-border)] bg-[var(--cs-brand-soft)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--cs-brand)]">
          <GraduationCap className="h-3.5 w-3.5" /> Product Academy
        </div>
        <h2 className="text-xl font-bold tracking-tight">Learn Septer by doing</h2>
        <p className="mt-1 max-w-xl text-[12px] text-[var(--cs-text-2)]">
          Action-driven journeys guide you through real navigation and workflows — illustrative demo
          progress.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <div className="rounded-[6px] border border-[var(--cs-border)] bg-[var(--cs-bg)] px-3 py-2">
            <p className="font-mono text-[9px] uppercase text-[var(--cs-text-muted)]">Overall</p>
            <p className="text-lg font-bold text-[var(--cs-brand)]">47%</p>
          </div>
          <div className="rounded-[6px] border border-[var(--cs-border)] bg-[var(--cs-bg)] px-3 py-2">
            <p className="font-mono text-[9px] uppercase text-[var(--cs-text-muted)]">Journeys</p>
            <p className="text-lg font-bold">1/5</p>
          </div>
          <div className="rounded-[6px] border border-[var(--cs-border)] bg-[var(--cs-bg)] px-3 py-2">
            <p className="font-mono text-[9px] uppercase text-[var(--cs-text-muted)]">Steps</p>
            <p className="text-lg font-bold">24</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--cs-bg)]">
          <div className="h-full rounded-full bg-[var(--cs-brand)]" style={{ width: "47%" }} />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {journeys.map((j) => (
          <div
            key={j.title}
            className="rounded-[8px] border border-[var(--cs-border)] bg-[var(--cs-surface)] p-3"
          >
            <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--cs-text-muted)]">
              {j.category}
            </p>
            <p className="mt-1 text-[13px] font-semibold">{j.title}</p>
            <p className="mt-0.5 text-[10px] text-[var(--cs-text-2)]">
              {j.steps} steps · {j.progress}% complete
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--cs-bg)]">
              <div
                className="h-full rounded-full bg-[var(--cs-brand)]"
                style={{ width: `${j.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PackModuleView({ href, label }: { href: string; label: string }) {
  const pack = packFor(href);
  const section = href.split("/")[1] ?? "module";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--cs-text-muted)]">
            {section.replace(/-/g, " ")}
          </p>
          <h2 className="text-lg font-bold tracking-tight">{label}</h2>
          <p className="mt-1 text-[11px] text-[var(--cs-text-2)]">{pack.footnote}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cs-brand-border)] bg-[var(--cs-brand-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--cs-brand)]">
            Sample
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--cs-sev-low)_35%,transparent)] bg-[color-mix(in_srgb,var(--cs-sev-low)_12%,transparent)] px-2.5 py-1 text-[10px] font-semibold text-[var(--cs-sev-low)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--cs-sev-low)]" />
            Data populated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {pack.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-[8px] border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-2.5"
          >
            <p className="font-mono text-[9px] uppercase tracking-wide text-[var(--cs-text-muted)]">
              {kpi.label}
            </p>
            <p
              className={cn(
                "mt-1 font-mono text-xl font-bold tabular-nums",
                kpi.tone === "bad" && "text-[var(--cs-sev-critical)]",
                kpi.tone === "warn" && "text-[var(--cs-sev-high)]",
                kpi.tone === "ok" && "text-[var(--cs-sev-low)]",
              )}
            >
              {kpi.value}
            </p>
            {kpi.hint && (
              <p className="mt-0.5 text-[10px] text-[var(--cs-text-muted)]">{kpi.hint}</p>
            )}
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[var(--cs-border)] bg-[var(--cs-surface)]">
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_88px_88px] gap-2 border-b border-[var(--cs-border)] bg-[var(--cs-surface-2)] px-3 py-2">
          {pack.columns.map((c) => (
            <p
              key={c}
              className="font-mono text-[9px] font-semibold uppercase tracking-wide text-[var(--cs-text-muted)]"
            >
              {c}
            </p>
          ))}
        </div>
        <div className="divide-y divide-[var(--cs-border)]">
          {pack.rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_88px_88px] items-center gap-2 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium">{row.title}</p>
                <p className="truncate text-[10px] text-[var(--cs-text-muted)]">{row.subtitle}</p>
              </div>
              <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-[var(--cs-text-2)]">
                {row.provider && (
                  <span className="rounded border border-[var(--cs-border)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--cs-text-muted)]">
                    {row.provider}
                  </span>
                )}
                <span className="truncate">{row.subtitle.split("·")[0]}</span>
              </div>
              <RiskBadge level={row.severity} />
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--cs-text-muted)]">
                <Clock3 className="h-3 w-3" />
                {row.meta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const LABEL_FOR: Partial<Record<ConsoleHref, string>> = {
  "/security-score": "Security Posture",
  "/search": "Global Search",
  "/policies": "CSPM Policies",
  "/assets": "Cloud Assets",
  "/findings": "Misconfigurations",
  "/compliance": "Compliance",
  "/dspm": "Data Security (DSPM)",
  "/ip-scanner": "External Exposure",
  "/compute": "Compute (CWPP)",
  "/vulnerabilities": "Vulnerabilities",
  "/runtime": "Runtime Security",
  "/containers": "Container Security",
  "/kubernetes": "Kubernetes Security",
  "/side-scan": "Agentless SideScan",
  "/ciem": "CIEM Effective Access",
  "/api-security": "API Security (ASPM)",
  "/shift-left": "Shift-Left CLI & IDE",
  "/iac-secrets": "IaC & Secrets",
  "/sbom": "SBOM Packages",
  "/ai-spm": "AI-SPM Security",
  "/attack-paths": "Attack Paths",
  "/mitre": "MITRE ATT&CK (CDR)",
  "/alerts": "Alerts & Tickets",
  "/soar": "SOAR Playbooks",
  "/remediation": "Remediation Approval",
  "/assistant": "AI Security Assistant",
  "/reports": "Security Reports",
  "/audit": "Audit Logs",
  "/notifications": "Notifications",
  "/cloud": "Cloud Accounts",
  "/users": "Team & Users",
  "/roles": "Roles & RBAC",
  "/organization": "Organization Settings",
  "/billing": "Billing & usage",
  "/partner": "Partner tenants",
};

/** Module pages matching Septer console screens (showcase packs + exact News/Academy). */
export function ModuleView({ href }: { href: ConsoleHref }) {
  if (href === "/news") return <NewsView />;
  if (href === "/academy") return <AcademyView />;
  const label =
    LABEL_FOR[href] ??
    href
      .replace("/", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  return <PackModuleView href={href} label={label} />;
}
