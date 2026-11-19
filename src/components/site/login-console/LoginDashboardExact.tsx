/**
 * Separate presentation twin of DashboardPage for the login showcase.
 * Same layout, components, and CNAPP visual language — curated sample data only.
 */
import { useMemo, useState } from "react";
import {
  Server,
  Cloud,
  AlertTriangle,
  Shield,
  RefreshCw,
  Play,
  Layers,
  Activity,
  ShieldAlert,
  FileCheck,
  AlertCircle,
  Eye,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { StatCard } from "./StatCard";
import { RiskBadge } from "./Badges";
import { ScanStatusBanner } from "./ScanStatusBanner";
import { ProviderLogo } from "./ProviderLogo";

type SeverityFilter = "ALL" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

const SHOWCASE = {
  postureScore: 78,
  criticalAssets: 14,
  highAssets: 31,
  totalAssets: 1842,
  accounts: 6,
  pillars: [
    { name: "CSPM misconfigurations", score: 72, color: "#43AE86" },
    { name: "CIEM excess roles", score: 68, color: "#A18BE0" },
    { name: "Vulnerability CVEs", score: 61, color: "#D4AE4C" },
    { name: "Container exposure", score: 74, color: "var(--brand-primary)" },
    { name: "Unencrypted data", score: 81, color: "#E69A52" },
  ],
  topology: [
    { name: "AWS Assets", value: 982, percentage: "53%", color: "#1e40af" },
    { name: "Azure Assets", value: 514, percentage: "28%", color: "#1d4ed8" },
    { name: "GCP Assets", value: 346, percentage: "19%", color: "#10b981" },
  ],
  findings: [
    {
      id: "1",
      name: "customer-exports",
      type: "S3_BUCKET",
      provider: "AWS",
      riskLevel: "CRITICAL" as const,
      reason: "Public access block disabled · world-readable ACL",
    },
    {
      id: "2",
      name: "sg-prod-bastion",
      type: "SECURITY_GROUP",
      provider: "AWS",
      riskLevel: "CRITICAL" as const,
      reason: "0.0.0.0/0 ingress on TCP 22",
    },
    {
      id: "3",
      name: "ci-deployer",
      type: "IAM_ROLE",
      provider: "AWS",
      riskLevel: "HIGH" as const,
      reason: "AdministratorAccess attached · unused 14d",
    },
    {
      id: "4",
      name: "payments/api:1.14.2",
      type: "CONTAINER_IMAGE",
      provider: "AWS",
      riskLevel: "HIGH" as const,
      reason: "CVE-2024-3094 (KEV) in xz-utils",
    },
    {
      id: "5",
      name: "aks-nodepool-1",
      type: "COMPUTE",
      provider: "AZURE",
      riskLevel: "MEDIUM" as const,
      reason: "Privileged container workload detected",
    },
  ],
};

function PillarBar({ name, score, color }: { name: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
          <span className="min-w-0">{name}</span>
        </span>
        <span className="font-mono text-[11px] font-bold" style={{ color }}>
          {score} / 100
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--border-subtle)] bg-[var(--background-secondary)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

/** Exact-look twin of the in-app Overview dashboard (presentation only). */
export function LoginDashboardExact({ compact = false }: { compact?: boolean }) {
  const [provider, setProvider] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");
  const [selectedId, setSelectedId] = useState(SHOWCASE.findings[0]?.id ?? null);

  const findings = useMemo(
    () =>
      SHOWCASE.findings.filter((f) => {
        const okProv = provider === "ALL" || f.provider === provider;
        const okSev = severityFilter === "ALL" || f.riskLevel === severityFilter;
        return okProv && okSev;
      }),
    [provider, severityFilter],
  );

  return (
    <div className={`pointer-events-auto ${compact ? "space-y-3" : "space-y-4"}`}>
      <ScanStatusBanner status="SCAN_COMPLETED" message="128 findings · 6 accounts" />

      <div className="rounded-md border border-[var(--border-default)] bg-[var(--surface)] p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                Multi-cloud posture
              </h1>
              <span className="rounded border border-[var(--brand-border)] bg-[var(--brand-soft)] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-primary)]">
                Sample
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {SHOWCASE.totalAssets.toLocaleString()} assets · {SHOWCASE.accounts} connected
              accounts
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)] p-0.5">
              {["ALL", "AWS", "AZURE", "GCP"].map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => setProvider(prov)}
                  className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    provider === prov
                      ? "bg-[var(--brand-primary)] font-semibold text-white shadow-xs"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {prov === "ALL" ? "ALL" : prov === "AZURE" ? "Azure" : prov}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-[var(--brand-primary)] bg-[var(--brand-primary)] px-2.5 py-1 text-[11px] font-semibold text-white"
            >
              <Play className="h-3 w-3 fill-current" />
              Trigger Assessment
            </button>
            <button
              type="button"
              className="rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)] p-1.5 text-[var(--text-secondary)]"
              title="Refresh"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-2 ${compact ? "sm:grid-cols-3" : "lg:grid-cols-6"}`}>
        <StatCard
          title="Overall Posture"
          value={SHOWCASE.postureScore}
          subtitle="Index / 100"
          badge="Good"
          trend={{ value: 1.3, label: "30d", positive: true }}
          icon={<Activity className="h-4 w-4" />}
          accentColor="green"
        />
        <StatCard
          title="Critical Findings"
          value={SHOWCASE.criticalAssets}
          subtitle="Need a fix"
          badge="URGENT"
          icon={<ShieldAlert className="h-4 w-4" />}
          accentColor="red"
        />
        <StatCard
          title="High Risk Assets"
          value={SHOWCASE.highAssets}
          subtitle="Misconfigured"
          icon={<AlertTriangle className="h-4 w-4" />}
          accentColor="orange"
        />
        <StatCard
          title="Monitored Assets"
          value={SHOWCASE.totalAssets}
          subtitle="All clouds"
          icon={<Server className="h-4 w-4" />}
          accentColor="steel"
        />
        <StatCard
          title="Cloud Accounts"
          value={SHOWCASE.accounts}
          subtitle="3 clouds"
          icon={<Cloud className="h-4 w-4" />}
          accentColor="steel"
        />
        <StatCard
          title="Compliance Score"
          value={`${SHOWCASE.postureScore}%`}
          subtitle="1,828 checks"
          badge="Passing"
          icon={<FileCheck className="h-4 w-4" />}
          accentColor="green"
        />
      </div>

      <div className={`grid grid-cols-1 gap-4 ${compact ? "" : "lg:grid-cols-12"}`}>
        <div
          className={`flex flex-col justify-between rounded-[6px] glass-panel p-4 ${compact ? "" : "lg:col-span-7"}`}
        >
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  <Shield className="h-4 w-4 text-[var(--brand-primary)]" />
                  Security Posture & Exposure Risk Matrix
                </h3>
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  Evaluated across {SHOWCASE.totalAssets} workloads, IAM roles, and storage buckets.
                </p>
              </div>
              <span className="rounded border border-[var(--brand-primary)]/30 bg-[var(--brand-soft)]/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--brand-primary)]">
                5 Pillars Audited
              </span>
            </div>
            <div className="mt-3 space-y-3">
              {SHOWCASE.pillars.map((p) => (
                <PillarBar key={p.name} name={p.name} score={p.score} color={p.color} />
              ))}
              <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs">
                <span className="text-[11px] font-medium text-[var(--text-muted)]">
                  Active SOAR containment playbooks: 6 ready
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-[var(--brand-primary)]">
                  Deep Audit View
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col justify-between rounded-[6px] glass-panel p-4 ${compact ? "" : "lg:col-span-5"}`}
        >
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  <Layers className="h-4 w-4 text-[var(--brand-primary)]" />
                  Multi-Cloud Topology
                </h3>
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                  Asset distribution by provider.
                </p>
              </div>
            </div>
            <div className="relative mt-3 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={SHOWCASE.topology}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {SHOWCASE.topology.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[var(--text-primary)]">
                  {SHOWCASE.totalAssets}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Total Assets
                </span>
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              {SHOWCASE.topology.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-1.5 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <ProviderLogo name={item.name} size={14} className="shrink-0" />
                    <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-[var(--text-secondary)]">{item.value}</span>
                    <span className="text-[var(--text-muted)]">({item.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded border border-[#E35D62]/30 bg-[#E35D62]/10 p-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E35D62]">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Active Critical Attack Path
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                Public Port 22 → Ingress VM → EC2 Instance Profile → Sensitive S3 / Database Store
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[6px] glass-panel">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--surface)]/90 px-3 py-2">
          <h3 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
            <AlertCircle className="h-3.5 w-3.5 text-[#E35D62]" />
            Top Critical Unresolved Misconfigurations
          </h3>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as SeverityFilter)}
            className="rounded border border-[var(--border-default)] bg-[var(--background-secondary)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-primary)] focus:border-[var(--brand-primary)] focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
          </select>
        </div>
        <div className="divide-y divide-[var(--border-default)]">
          {findings.slice(0, compact ? 3 : 5).map((f) => {
            const selected = selectedId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedId(f.id)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-[var(--bg-surface-hover)] ${
                  selected ? "bg-[var(--bg-surface-hover)]" : ""
                }`}
              >
                <RiskBadge level={f.riskLevel} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                    {f.name}
                  </p>
                  <p className="truncate text-[11px] text-[var(--text-muted)]">{f.reason}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--brand-primary)]">
                  <Eye className="h-3 w-3" /> Inspect
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
