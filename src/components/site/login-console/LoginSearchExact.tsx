/**
 * Static twin of SearchPage — global search with AWS showcase results.
 */
import { useMemo, useState } from "react";
import {
  Search,
  ShieldAlert,
  Layers,
  Server,
  Bug,
  Key,
  Cloud,
  Sparkles,
  Filter,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskBadge } from "./Badges";

type EntityType =
  "ALL" | "ASSET" | "FINDING" | "VULNERABILITY" | "IDENTITY" | "ALERT" | "CLOUD_ACCOUNT";

type SearchRow = {
  id: string;
  type: Exclude<EntityType, "ALL">;
  title: string;
  subtitle: string;
  severity?: string;
};

const ENTITY_CATEGORIES: { id: EntityType; label: string }[] = [
  { id: "ALL", label: "All Categories" },
  { id: "ASSET", label: "Cloud Assets" },
  { id: "FINDING", label: "CSPM Findings" },
  { id: "VULNERABILITY", label: "Container CVEs" },
  { id: "IDENTITY", label: "CIEM Identities" },
  { id: "ALERT", label: "Security Alerts" },
];

const SUGGESTED = ["AWS", "S3", "CVE-2024", "CRITICAL", "admin", "prod-cluster", "IAM"];

const BASE_RESULTS: SearchRow[] = [
  {
    id: "ast-1",
    type: "ASSET",
    title: "customer-exports",
    subtitle: "S3 · us-east-1 · AWS",
    severity: "CRITICAL",
  },
  {
    id: "fnd-1",
    type: "FINDING",
    title: "S3 public ACL",
    subtitle: "CIS-2.1.5 · AWS",
    severity: "CRITICAL",
  },
  {
    id: "vuln-1",
    type: "VULNERABILITY",
    title: "CVE-2024-3094",
    subtitle: "payments/api:1.14.2 · AWS ECR",
    severity: "CRITICAL",
  },
  {
    id: "id-1",
    type: "IDENTITY",
    title: "ci-deployer",
    subtitle: "IAM role · AdministratorAccess · AWS",
    severity: "CRITICAL",
  },
  {
    id: "al-1",
    type: "ALERT",
    title: "Public bucket with PII",
    subtitle: "DSPM correlation · AWS S3",
    severity: "CRITICAL",
  },
  {
    id: "ca-1",
    type: "CLOUD_ACCOUNT",
    title: "acme-prod",
    subtitle: "AWS · 221988441122",
  },
];

function entityIcon(type: SearchRow["type"]) {
  switch (type) {
    case "ALERT":
      return <ShieldAlert className="h-4 w-4 text-red-400" />;
    case "FINDING":
      return <Layers className="h-4 w-4 text-amber-400" />;
    case "ASSET":
      return <Server className="h-4 w-4 text-[var(--brand-primary)]" />;
    case "VULNERABILITY":
      return <Bug className="h-4 w-4 text-rose-400" />;
    case "IDENTITY":
      return <Key className="h-4 w-4 text-emerald-400" />;
    case "CLOUD_ACCOUNT":
      return <Cloud className="h-4 w-4 text-[var(--brand-primary)]" />;
    default:
      return <Search className="h-4 w-4 text-[var(--brand-primary)]" />;
  }
}

function SearchPageHeader() {
  return (
    <div className="glass-panel mb-2 flex flex-col gap-2 rounded-[6px] px-3 py-2">
      <span className="inline-block w-fit rounded-[3px] border border-[var(--brand-border)] bg-[var(--brand-soft)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
        Enterprise Intelligence
      </span>
      <h1 className="font-heading text-lg font-bold tracking-tight text-[var(--text-primary)]">
        Unified Multi-Entity Global Search
      </h1>
      <p className="max-w-3xl text-[11px] leading-normal text-[var(--text-secondary)]">
        Search across all multi-cloud assets, CSPM findings, CVE vulnerabilities, CIEM identities,
        security policies, audit records, and user accounts in real time.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = "primary",
}: {
  label: string;
  value: number;
  accent?: "primary" | "red";
}) {
  const accentClass =
    accent === "red"
      ? "border-[#E35D62]/30 text-[#E35D62]"
      : "border-[var(--brand-border)] text-[var(--brand-primary)]";
  return (
    <div className={cn("glass-card rounded-[6px] border p-3", accentClass)}>
      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
      <p className="font-heading text-xl font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

export function LoginSearchExact() {
  const [query, setQuery] = useState("AWS");
  const [selectedType, setSelectedType] = useState<EntityType>("ALL");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return BASE_RESULTS.filter((r) => {
      const matchesType = selectedType === "ALL" || r.type === selectedType;
      const hay = `${r.title} ${r.subtitle} ${r.type}`.toLowerCase();
      return matchesType && hay.includes(q);
    });
  }, [query, selectedType]);

  const categoryCount = (type: EntityType) => {
    if (type === "ALL") return results.length;
    return results.filter((r) => r.type === type).length;
  };

  return (
    <div className="pointer-events-auto space-y-3 p-1">
      <SearchPageHeader />

      <form
        className="relative flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-primary)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any asset name, CVE ID, policy code, IAM user, or keyword..."
            className="w-full rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-card)] py-3 pl-10 pr-3 text-xs font-medium text-[var(--text-primary)] shadow-lg placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
          />
        </div>
        <button
          type="submit"
          className="glass-button-primary inline-flex h-11 items-center gap-2 rounded-[6px] px-4 font-mono text-[10px] font-bold uppercase tracking-wider"
        >
          <Search className="h-3.5 w-3.5" />
          Search
        </button>
      </form>

      <div className="flex items-center gap-2 overflow-x-auto font-mono text-[10px] text-[var(--text-muted)]">
        <span className="flex shrink-0 items-center gap-1 text-[var(--brand-primary)]">
          <Sparkles className="h-3.5 w-3.5" /> Popular:
        </span>
        {SUGGESTED.map((sq) => (
          <button
            key={sq}
            type="button"
            onClick={() => setQuery(sq)}
            className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-2 py-1 transition-colors hover:border-[var(--brand-border)] hover:text-[var(--brand-primary)]"
          >
            {sq}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-px border border-[var(--border-default)] bg-[var(--border-default)] md:grid-cols-4">
        <StatCard label="Matches Found" value={results.length} />
        <StatCard
          label="Critical Findings / CVEs"
          value={results.filter((r) => r.severity === "CRITICAL").length}
          accent="red"
        />
        <StatCard
          label="Active Cloud Assets"
          value={results.filter((r) => r.type === "ASSET").length}
        />
        <StatCard
          label="Identities & Users"
          value={results.filter((r) => r.type === "IDENTITY").length}
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto border-b border-[var(--border-default)] pb-2">
        <Filter className="mr-1 h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        {ENTITY_CATEGORIES.map((cat) => {
          const count = categoryCount(cat.id);
          const active = selectedType === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedType(cat.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-[6px] px-2.5 py-1 font-mono text-[10px] font-bold transition-all",
                active
                  ? "glass-button-primary text-white"
                  : "border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--brand-border)] hover:text-[var(--text-primary)]",
              )}
            >
              {cat.label}
              {query.length >= 2 && (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px]",
                    active
                      ? "bg-[var(--brand-soft)] text-white"
                      : "bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="glass-panel overflow-hidden rounded-[6px]">
        {results.length === 0 ? (
          <div className="py-10 text-center font-mono text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
            {query.length < 2
              ? "Enter at least 2 characters in the search bar above to query tenant infrastructure."
              : `No security findings, assets, or records found matching "${query}".`}
          </div>
        ) : (
          <SearchResultsTable results={results} />
        )}
      </div>
    </div>
  );
}

function SearchResultsTable({ results }: { results: SearchRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs text-[var(--text-primary)]">
        <thead>
          <tr>
            <th className="border-b border-[var(--border-default)] bg-[var(--surface-secondary)]/90 px-4 py-2.5 text-left font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Entity Type
            </th>
            <th className="border-b border-[var(--border-default)] bg-[var(--surface-secondary)]/90 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Title & Identification
            </th>
            <th className="border-b border-[var(--border-default)] bg-[var(--surface-secondary)]/90 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Subtitle / Context
            </th>
            <th className="border-b border-[var(--border-default)] bg-[var(--surface-secondary)]/90 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Severity / Status
            </th>
            <th className="border-b border-[var(--border-default)] bg-[var(--surface-secondary)]/90 px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-default)]">
          {results.map((res) => (
            <tr key={`${res.type}-${res.id}`} className="hover:bg-[var(--bg-surface-hover)]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[var(--text-secondary)]">
                  <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-1.5">
                    {entityIcon(res.type)}
                  </div>
                  {res.type}
                </div>
              </td>
              <td className="max-w-sm truncate px-4 py-3 font-medium text-[var(--text-primary)]">
                {res.title}
              </td>
              <td className="max-w-xs truncate px-4 py-3 font-mono text-[10px] text-[var(--text-muted)]">
                {res.subtitle}
              </td>
              <td className="px-4 py-3">
                {res.severity ? (
                  <RiskBadge level={res.severity} showDot />
                ) : (
                  <span className="font-mono text-[10px] text-zinc-500">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--brand-primary)] hover:opacity-80"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Entity
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
