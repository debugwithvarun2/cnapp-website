/**
 * Static twin of SecurityScorePage — showcase posture data only.
 */
import {
  ShieldCheck,
  Cloud,
  Layers,
  Server,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SecurityScoreGauge } from "./SecurityScoreGauge";

const OVERVIEW = {
  currentScore: 78,
  grade: "B",
  criticalCount: 14,
  highCount: 31,
  mediumCount: 86,
  lowCount: 210,
  assetsScanned: 1842,
  accountsActive: 6,
  complianceScore: 81,
};

const PROVIDERS = [
  { provider: "AWS", score: 76, assetsCount: 982, connected: true },
  { provider: "AZURE", score: 72, assetsCount: 514, connected: true },
  { provider: "GCP", score: 84, assetsCount: 346, connected: true },
];

const CATEGORY_DETAILS = [
  {
    category: "STORAGE",
    score: 72,
    totalAssets: 310,
    openFindings: 22,
    criticalCount: 4,
    passedControls: 40,
  },
  {
    category: "IDENTITY",
    score: 68,
    totalAssets: 180,
    openFindings: 18,
    criticalCount: 3,
    passedControls: 28,
  },
  {
    category: "VULNERABILITY",
    score: 61,
    totalAssets: 420,
    openFindings: 45,
    criticalCount: 8,
    passedControls: 22,
  },
  {
    category: "CONTAINER",
    score: 74,
    totalAssets: 86,
    openFindings: 14,
    criticalCount: 3,
    passedControls: 35,
  },
  {
    category: "ENCRYPTION",
    score: 81,
    totalAssets: 240,
    openFindings: 11,
    criticalCount: 1,
    passedControls: 52,
  },
  {
    category: "NETWORK",
    score: 74,
    totalAssets: 240,
    openFindings: 19,
    criticalCount: 2,
    passedControls: 38,
  },
];

const ACCOUNTS = [
  {
    id: "acc-aws-prod",
    name: "acme-prod",
    nativeId: "221988441122",
    provider: "AWS",
    assetsCount: 982,
    openFindingsCount: 10,
    criticalCount: 6,
    score: 70,
    status: "ACTIVE",
  },
  {
    id: "acc-aws-sec",
    name: "acme-security",
    nativeId: "221988441199",
    provider: "AWS",
    assetsCount: 214,
    openFindingsCount: 13,
    criticalCount: 2,
    score: 72,
    status: "ACTIVE",
  },
  {
    id: "acc-az-prod",
    name: "Contoso Prod",
    nativeId: "sub-contoso-prod",
    provider: "AZURE",
    assetsCount: 514,
    openFindingsCount: 16,
    criticalCount: 2,
    score: 74,
    status: "ACTIVE",
  },
  {
    id: "acc-az-shared",
    name: "Contoso Shared",
    nativeId: "sub-contoso-shared",
    provider: "AZURE",
    assetsCount: 188,
    openFindingsCount: 19,
    criticalCount: 2,
    score: 76,
    status: "ACTIVE",
  },
  {
    id: "acc-gcp-analytics",
    name: "acme-analytics",
    nativeId: "acme-analytics",
    provider: "GCP",
    assetsCount: 346,
    openFindingsCount: 22,
    criticalCount: 2,
    score: 78,
    status: "ACTIVE",
  },
  {
    id: "acc-aws-dev",
    name: "acme-dev",
    nativeId: "221988441155",
    provider: "AWS",
    assetsCount: 98,
    openFindingsCount: 25,
    criticalCount: 2,
    score: 80,
    status: "ACTIVE",
  },
];

function scoreBarColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function LoginSecurityScoreExact() {
  return (
    <div className="pointer-events-auto space-y-4 p-1">
      <div className="flex flex-col justify-between gap-3 border-b border-[var(--border-default)] pb-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-[var(--text-primary)]">
            <ShieldCheck className="h-6 w-6 text-[var(--brand-primary)]" />
            Executive Security Posture & Score Overview
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Real-time compliance rating, multi-cloud vulnerability risk score & deep domain security
            posture.
          </p>
        </div>
        <button
          type="button"
          className="glass-button-primary inline-flex items-center gap-1.5 rounded-[6px] px-3 py-2 text-xs font-bold"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Trigger Assessment
        </button>
      </div>

      <div className="flex flex-col items-center justify-between gap-6 rounded-[8px] border border-[var(--border-default)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)] to-[var(--bg-surface)] p-5 shadow-lg md:flex-row">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <SecurityScoreGauge
            score={OVERVIEW.currentScore}
            grade={OVERVIEW.grade}
            size={140}
            strokeWidth={12}
          />
          <div className="space-y-2 text-center md:text-left">
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                Overall Posture Rating
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">
                Moderate Risk Surface
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[var(--text-secondary)]">
              Calculated dynamically across{" "}
              <span className="font-bold text-[var(--text-primary)]">
                {OVERVIEW.assetsScanned} scanned cloud assets
              </span>{" "}
              and{" "}
              <span className="font-bold text-[var(--text-primary)]">
                {OVERVIEW.accountsActive} active cloud accounts
              </span>
              .
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 md:justify-start">
              <span className="rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-red-400">
                {OVERVIEW.criticalCount} Critical
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-400">
                {OVERVIEW.highCount} High
              </span>
              <span className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-soft)] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--brand-primary)]">
                {OVERVIEW.mediumCount} Medium
              </span>
              <span className="rounded-full border border-[var(--border-default)] bg-slate-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--text-muted)]">
                {OVERVIEW.lowCount} Low
              </span>
            </div>
          </div>
        </div>
        <div className="grid w-full shrink-0 grid-cols-2 gap-3 md:w-auto">
          <div className="min-w-[110px] rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 text-center">
            <span className="mb-1 block font-mono text-[10px] text-[var(--text-muted)]">
              Compliance Score
            </span>
            <span className="text-2xl font-extrabold text-emerald-400">
              {OVERVIEW.complianceScore}%
            </span>
          </div>
          <div className="min-w-[110px] rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 text-center">
            <span className="mb-1 block font-mono text-[10px] text-[var(--text-muted)]">
              Total Cloud Assets
            </span>
            <span className="text-2xl font-extrabold text-[var(--text-primary)]">
              {OVERVIEW.assetsScanned}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
              <Cloud className="h-4 w-4 text-[var(--brand-primary)]" /> Multi-Cloud Provider Posture
            </h3>
            <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-[var(--brand-primary)]">
              Manage Accounts <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="space-y-3">
            {PROVIDERS.map((p) => (
              <div
                key={p.provider}
                className="space-y-2 rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-surface-elevated)] p-3"
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {p.provider}
                    </span>
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                      CONNECTED ({p.assetsCount} Assets)
                    </span>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-[var(--text-primary)]">
                    {p.score} / 100
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--border-default)] bg-[var(--bg-input)]">
                  <div
                    className={cn("h-full rounded-full", scoreBarColor(p.score))}
                    style={{ width: `${p.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
              <Layers className="h-4 w-4 text-[var(--brand-primary)]" /> Security Domain Deep
              Analysis
            </h3>
            <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-[var(--brand-primary)]">
              View All Findings <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="space-y-3">
            {CATEGORY_DETAILS.map((cat) => (
              <DomainRow key={cat.category} cat={cat} />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
            <Server className="h-4 w-4 text-[var(--brand-primary)]" /> Connected Cloud Accounts
            Posture Matrix
          </h3>
          <span className="font-mono text-[10px] font-bold text-[var(--text-muted)]">
            {ACCOUNTS.length} Active Cloud Accounts Scanned
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-[10px]">
            <thead>
              <tr className="border-b border-[var(--border-default)] text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-3 py-2 font-bold">Account Name</th>
                <th className="px-3 py-2 font-bold">Account Native ID</th>
                <th className="px-3 py-2 font-bold">Provider</th>
                <th className="px-3 py-2 font-bold">Scanned Assets</th>
                <th className="px-3 py-2 font-bold">Open Risks</th>
                <th className="px-3 py-2 font-bold">Posture Score</th>
                <th className="px-3 py-2 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-secondary)]">
              {ACCOUNTS.map((acc) => (
                <tr key={acc.id} className="transition-colors hover:bg-[var(--bg-surface-hover)]">
                  <td className="px-3 py-2.5 font-bold text-[var(--text-primary)]">{acc.name}</td>
                  <td className="px-3 py-2.5 font-bold text-[var(--brand-primary)]">
                    {acc.nativeId}
                  </td>
                  <td className="px-3 py-2.5 font-bold">{acc.provider}</td>
                  <td className="px-3 py-2.5 font-bold">{acc.assetsCount} Assets</td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded border border-red-500/30 bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {acc.openFindingsCount} Risks ({acc.criticalCount} Critical)
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "rounded-[6px] border px-2 py-0.5 text-xs font-extrabold",
                        acc.score >= 80
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400",
                      )}
                    >
                      {acc.score} / 100
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                      {acc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DomainRow({ cat }: { cat: (typeof CATEGORY_DETAILS)[number] }) {
  return (
    <div className="group cursor-default space-y-2 rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-surface-elevated)] p-3 transition-all hover:border-[var(--brand-border)]">
      <div className="flex items-center justify-between text-[10px]">
        <div>
          <span className="text-xs font-bold text-[var(--text-primary)]">
            {cat.category} DOMAIN
          </span>
          <span className="ml-2 font-mono text-[10px] text-[var(--text-muted)]">
            ({cat.totalAssets} Scanned Assets)
          </span>
        </div>
        <span className="font-mono text-xs font-extrabold text-[var(--text-primary)]">
          {cat.score} / 100
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--border-default)] bg-[var(--bg-input)]">
        <div
          className={cn("h-full rounded-full", scoreBarColor(cat.score))}
          style={{ width: `${cat.score}%` }}
        />
      </div>
      <div className="flex items-center justify-between pt-0.5 font-mono text-[10px] text-[var(--text-muted)]">
        <span className="flex items-center gap-1 font-bold text-emerald-500">
          <CheckCircle2 className="h-3 w-3" /> {cat.passedControls} Controls Passed
        </span>
        <span className="flex items-center gap-1 font-bold text-amber-500">
          <AlertTriangle className="h-3 w-3" /> {cat.openFindings} Open Risks ({cat.criticalCount}{" "}
          Critical)
        </span>
      </div>
    </div>
  );
}
