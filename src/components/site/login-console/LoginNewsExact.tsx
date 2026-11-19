/**
 * Static twin of NewsPage — persisted intelligence feed (showcase articles).
 */
import { useState, type ReactNode } from "react";
import { ChevronRight, Filter, Newspaper, RefreshCw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type NewsArticle = {
  id: string;
  source: string;
  trust: string;
  title: string;
  summary: string;
  postedAt: string;
  tags: string[];
};

const SHOWCASE_NEWS: NewsArticle[] = [
  {
    id: "n-1",
    source: "The Hacker News",
    trust: "press",
    title: "Critical cloud IAM misconfiguration campaigns surge across multi-account orgs",
    summary:
      "Researchers report a rise in privilege-escalation playbooks targeting overly permissive roles and unused service principals in AWS and Azure tenants.",
    postedAt: "12m ago",
    tags: ["iam", "cloud"],
  },
  {
    id: "n-2",
    source: "CISA Alerts",
    trust: "press",
    title: "CISA adds new KEV entries for widely exploited container runtime flaws",
    summary:
      "Operators should patch affected runtimes and verify workload admission controls before the next exploitation window.",
    postedAt: "2h ago",
    tags: ["containers", "kev"],
  },
  {
    id: "n-3",
    source: "CyberMonitum",
    trust: "broadcast",
    title: "Leaked credentials remain a top enterprise breach vector this quarter",
    summary:
      "Security teams are expanding secret scanning and rotation playbooks after another wave of public credential dumps tied to CI pipelines.",
    postedAt: "4h ago",
    tags: ["secrets"],
  },
  {
    id: "n-4",
    source: "BleepingComputer",
    trust: "press",
    title: "Ransomware crews abuse exposed Kubernetes dashboards for initial access",
    summary:
      "Threat actors are scanning for open kube dashboards and deploying encryptors across unmanaged clusters within hours of discovery.",
    postedAt: "6h ago",
    tags: ["kubernetes", "ransomware"],
  },
  {
    id: "n-5",
    source: "Dark Reading",
    trust: "press",
    title: "Enterprises race to revoke long-lived cloud access keys after mass leak",
    summary:
      "Security teams are prioritizing key rotation and short-lived credentials after another dump of long-lived AWS and Azure keys hit public paste sites.",
    postedAt: "9h ago",
    tags: ["iam", "keys"],
  },
  {
    id: "n-6",
    source: "SecurityWeek",
    trust: "press",
    title: "New guidance pushes continuous CSPM evidence for audit-ready cloud estates",
    summary:
      "Auditors increasingly expect continuous posture evidence instead of point-in-time screenshots for multi-cloud compliance packages.",
    postedAt: "12h ago",
    tags: ["cspm", "compliance"],
  },
];

const SOURCES = [
  "The Hacker News",
  "CISA Alerts",
  "CyberMonitum",
  "BleepingComputer",
  "Dark Reading",
  "SecurityWeek",
];

function trustClass(trust: string) {
  if (trust === "primary") {
    return "border-[var(--severity-low)]/40 text-[var(--severity-low)] bg-[color-mix(in_srgb,var(--severity-low)_12%,transparent)]";
  }
  if (trust === "press") {
    return "border-[var(--brand-border)] text-[var(--brand-primary)] bg-[var(--brand-soft)]";
  }
  return "border-[var(--border-default)] text-[var(--text-muted)] bg-[var(--surface-secondary)]";
}

function NewsCard({ item }: { item: NewsArticle }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[8px] border border-[var(--border-default)] bg-[var(--surface)]/90 transition-colors hover:border-[var(--brand-border)]">
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {item.source}
          </span>
          <span
            className={cn(
              "rounded-[3px] border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase",
              trustClass(item.trust),
            )}
          >
            {item.trust}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">{item.postedAt}</span>
        </div>
        <span className="font-heading text-sm font-bold leading-snug tracking-tight text-[var(--text-primary)] group-hover:text-[var(--brand-primary)]">
          {item.title}
        </span>
        <p className="line-clamp-3 text-[11px] leading-relaxed text-[var(--text-secondary)]">
          {item.summary}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--brand-primary)]">
            Read more <ChevronRight className="h-3.5 w-3.5" />
          </span>
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="font-mono text-[10px] text-[var(--text-muted)]">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function LoginNewsPageHeader({
  badge,
  title,
  subtitle,
  actions,
}: {
  badge: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="glass-panel mb-3 flex flex-col gap-2 rounded-[6px] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-[3px] border border-[var(--brand-border)] bg-[var(--brand-soft)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
            {badge}
          </span>
          <h1 className="font-heading text-lg font-bold tracking-tight text-[var(--text-primary)]">
            {title}
          </h1>
        </div>
        <p className="max-w-3xl text-[11px] leading-normal text-[var(--text-secondary)]">
          {subtitle}
        </p>
      </div>
      {actions}
    </div>
  );
}

export function LoginNewsExact() {
  const [searchInput, setSearchInput] = useState("");
  const [trust, setTrust] = useState("");
  const [source, setSource] = useState("");

  const filtered = SHOWCASE_NEWS.filter((item) => {
    if (trust && item.trust !== trust) return false;
    if (source && item.source !== source) return false;
    const q = searchInput.trim().toLowerCase();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pointer-events-auto space-y-3 p-1">
      <LoginNewsPageHeader
        badge="Intelligence"
        title="Security News"
        subtitle="Persisted industry and threat feed. Open any story for the full article view."
        actions={
          <button
            type="button"
            className="glass-button-primary inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Sync feed
          </button>
        }
      />

      <div className="flex flex-col gap-2 rounded-[8px] border border-[var(--border-default)] bg-[var(--surface)]/90 p-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[6px] border border-[var(--border-default)] bg-[var(--background-secondary)] px-2.5 py-1.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search titles, sources, summaries…"
            className="min-w-0 flex-1 bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--border-default)] bg-[var(--background-secondary)] px-2 py-1.5">
            <Filter className="h-3 w-3 text-[var(--text-muted)]" />
            <select
              value={trust}
              onChange={(e) => setTrust(e.target.value)}
              className="bg-transparent text-[11px] font-medium text-[var(--text-primary)] focus:outline-none"
            >
              <option value="">All trust</option>
              <option value="press">Press</option>
              <option value="broadcast">Broadcast</option>
            </select>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="max-w-[150px] bg-transparent text-[11px] font-medium text-[var(--text-primary)] focus:outline-none"
            >
              <option value="">All sources</option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            6 stored · synced just now
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[8px] border border-[var(--border-default)] p-8 text-center">
          <Newspaper className="mx-auto h-8 w-8 text-[var(--text-muted)]" />
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            No articles match these filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
