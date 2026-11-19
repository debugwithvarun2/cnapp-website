/**
 * Static twin of AcademyPage — journey catalog with local demo progress.
 */
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Compass,
  GraduationCap,
  Play,
  RotateCcw,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type JourneyStatus = "not_started" | "in_progress" | "completed";

type JourneyCard = {
  id: string;
  title: string;
  description: string;
  category: keyof typeof CATEGORY_LABEL;
  status: JourneyStatus;
  progress: number;
  steps: number;
  estimatedMinutes: number;
};

const CATEGORY_LABEL: Record<string, string> = {
  "getting-started": "Getting Started",
  cloud: "Cloud Security",
  workload: "Workload Security",
  identity: "Identity",
  appsec: "Application Security",
  risk: "Risk Management",
  operations: "Operations",
  admin: "Administration",
};

const JOURNEYS: JourneyCard[] = [
  {
    id: "getting-started",
    title: "Getting Started with Septer",
    description:
      "Operator orientation: navigation model, connect cloud, discover inventory, then run CSPM — with real clicks on each control.",
    category: "getting-started",
    status: "completed",
    progress: 100,
    steps: 14,
    estimatedMinutes: 18,
  },
  {
    id: "dashboard",
    title: "Understanding the Security Dashboard",
    description:
      "Overview KPIs, provider filters, Trigger Assessment, refresh, and Security Posture scoring — including how each control behaves.",
    category: "getting-started",
    status: "in_progress",
    progress: 60,
    steps: 8,
    estimatedMinutes: 12,
  },
  {
    id: "connect-cloud",
    title: "Connecting Cloud Accounts",
    description:
      "Full connect workflow: open Cloud Accounts, Connect wizard, providers, credentials, Permissions Audit, Sync.",
    category: "admin",
    status: "not_started",
    progress: 0,
    steps: 8,
    estimatedMinutes: 14,
  },
  {
    id: "cloud-assets",
    title: "Exploring Cloud Assets",
    description: "Inventory UI, risk filters, search, discovery, and asset detail investigation.",
    category: "cloud",
    status: "not_started",
    progress: 0,
    steps: 5,
    estimatedMinutes: 10,
  },
  {
    id: "assessments",
    title: "Running Security Assessments",
    description:
      "CSPM Policies → Misconfigurations Trigger scan → Security Posture — full assessment loop with real controls.",
    category: "cloud",
    status: "not_started",
    progress: 0,
    steps: 7,
    estimatedMinutes: 14,
  },
  {
    id: "misconfigurations",
    title: "Investigating Misconfigurations",
    description: "Deep dive on findings triage, export, scan, and remediation hand-offs.",
    category: "cloud",
    status: "not_started",
    progress: 0,
    steps: 2,
    estimatedMinutes: 8,
  },
  {
    id: "compliance",
    title: "Understanding Compliance",
    description: "Framework baselines, Assess Posture, evidence for GRC.",
    category: "cloud",
    status: "not_started",
    progress: 0,
    steps: 3,
    estimatedMinutes: 9,
  },
  {
    id: "dspm",
    title: "Exploring Data Security",
    description: "DSPM stores, classification, and deep content scan controls.",
    category: "cloud",
    status: "not_started",
    progress: 0,
    steps: 2,
    estimatedMinutes: 8,
  },
  {
    id: "external-exposure",
    title: "Discovering External Exposure",
    description: "Perimeter IP/CIDR scanning — can run even without a cloud account.",
    category: "cloud",
    status: "not_started",
    progress: 0,
    steps: 2,
    estimatedMinutes: 7,
  },
  {
    id: "workload-security",
    title: "Exploring Workload Security",
    description:
      "CWPP, vulnerabilities, runtime, containers, Kubernetes, SideScan — open each module and learn its primary actions.",
    category: "workload",
    status: "not_started",
    progress: 0,
    steps: 9,
    estimatedMinutes: 16,
  },
  {
    id: "identity",
    title: "Understanding Identity Exposure",
    description: "CIEM effective access analysis and identity investigation.",
    category: "identity",
    status: "not_started",
    progress: 0,
    steps: 2,
    estimatedMinutes: 8,
  },
  {
    id: "appsec",
    title: "Exploring Application and API Security",
    description:
      "ASPM, Shift-Left, IaC & Secrets, SBOM, AI-SPM — navigation plus each module’s primary workflow.",
    category: "appsec",
    status: "not_started",
    progress: 0,
    steps: 6,
    estimatedMinutes: 14,
  },
  {
    id: "risk",
    title: "Investigating Attack Paths & CDR",
    description: "Toxic combination graphs and MITRE ATT&CK response mapping.",
    category: "risk",
    status: "not_started",
    progress: 0,
    steps: 4,
    estimatedMinutes: 9,
  },
  {
    id: "operations",
    title: "Understanding Remediation & Operations",
    description:
      "Alerts, SOAR, remediation approval, assistant, reports, audit, notifications — with each module’s purpose and controls.",
    category: "operations",
    status: "not_started",
    progress: 0,
    steps: 9,
    estimatedMinutes: 14,
  },
  {
    id: "platform-admin",
    title: "Configuring Platform Settings",
    description: "Users, RBAC, organization, search, documentation, and Product Academy.",
    category: "admin",
    status: "not_started",
    progress: 0,
    steps: 7,
    estimatedMinutes: 10,
  },
];

const OVERALL_PROGRESS = 47;
const COMPLETED_COUNT = 2;
const CATALOG_STEPS = "~80";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </p>
      <p className="font-heading text-base font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function StatusIcon({ status }: { status: JourneyStatus }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  if (status === "in_progress") return <Compass className="h-4 w-4 text-[var(--brand-primary)]" />;
  return <Circle className="h-4 w-4 text-[var(--text-muted)]" />;
}

export function LoginAcademyExact() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | JourneyStatus>("all");
  const [progressMap, setProgressMap] = useState<Record<string, JourneyCard>>(() =>
    Object.fromEntries(JOURNEYS.map((j) => [j.id, j])),
  );

  const journeys = useMemo(() => Object.values(progressMap), [progressMap]);

  const visible = useMemo(() => {
    return journeys.filter((j) => {
      if (filter !== "all" && j.status !== filter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.category.includes(q)
      );
    });
  }, [journeys, filter, query]);

  const bumpProgress = (id: string, action: "start" | "resume" | "restart") => {
    setProgressMap((prev) => {
      const current = prev[id];
      if (!current) return prev;
      if (action === "restart") {
        return { ...prev, [id]: { ...current, status: "in_progress" as const, progress: 10 } };
      }
      if (action === "start") {
        return {
          ...prev,
          [id]: {
            ...current,
            status: "in_progress" as const,
            progress: Math.max(current.progress, 15),
          },
        };
      }
      const next = Math.min(100, current.progress + 20);
      return {
        ...prev,
        [id]: {
          ...current,
          status: next >= 100 ? "completed" : "in_progress",
          progress: next >= 100 ? 100 : next,
        },
      };
    });
  };

  return (
    <div className="pointer-events-auto space-y-4 p-1" data-academy="academy-page">
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-[var(--brand-border)] bg-[var(--brand-soft)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">
              <GraduationCap className="h-3.5 w-3.5" />
              Product Academy
            </div>
            <h1 className="font-heading text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              Learn Septer by doing
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-[var(--text-secondary)]">
              Action-driven journeys guide you through real navigation and workflows. The platform
              waits for your clicks — nothing is simulated.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Stat label="Overall progress" value={`${OVERALL_PROGRESS}%`} />
            <Stat label="Journeys done" value={`${COMPLETED_COUNT}/${journeys.length}`} />
            <Stat label="Catalog steps" value={CATALOG_STEPS} />
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-secondary)]">
          <div
            className="h-full rounded-full bg-[var(--brand-primary)]"
            style={{ width: `${OVERALL_PROGRESS}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search journeys…"
            className="w-full rounded-md border border-[var(--border-default)] bg-[var(--surface)] py-2 pl-8 pr-3 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {(
            [
              ["all", "All"],
              ["not_started", "Not started"],
              ["in_progress", "In progress"],
              ["completed", "Completed"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                filter === id
                  ? "border-[var(--brand-border)] bg-[var(--brand-soft)] text-[var(--brand-primary)]"
                  : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((journey) => (
          <article
            key={journey.id}
            className="flex flex-col rounded-lg border border-[var(--border-default)] bg-[var(--surface)] p-3 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {CATEGORY_LABEL[journey.category] ?? journey.category}
                </p>
                <h2 className="font-heading text-sm font-semibold text-[var(--text-primary)]">
                  {journey.title}
                </h2>
              </div>
              <StatusIcon status={journey.status} />
            </div>
            <p className="mb-2 flex-1 text-[11px] leading-relaxed text-[var(--text-secondary)]">
              {journey.description}
            </p>
            <div className="mb-2 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
              <span>
                {journey.steps} steps · ~{journey.estimatedMinutes} min
              </span>
              <span className="font-mono">{journey.progress}%</span>
            </div>
            <div className="mb-2 h-1 overflow-hidden rounded-full bg-[var(--surface-secondary)]">
              <div
                className="h-full bg-[var(--brand-primary)]"
                style={{ width: `${journey.progress}%` }}
              />
            </div>
            <span className="mb-2 text-[11px] text-[var(--brand-primary)]">
              Open related module →
            </span>
            <div className="flex flex-wrap gap-2">
              {journey.status === "not_started" && (
                <button
                  type="button"
                  onClick={() => bumpProgress(journey.id, "start")}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[var(--brand-primary)] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[var(--brand-hover)]"
                >
                  <Play className="h-3 w-3" />
                  Start
                </button>
              )}
              {journey.status === "in_progress" && (
                <>
                  <button
                    type="button"
                    onClick={() => bumpProgress(journey.id, "resume")}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[var(--brand-primary)] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[var(--brand-hover)]"
                  >
                    <Compass className="h-3 w-3" />
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => bumpProgress(journey.id, "restart")}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-default)] px-2.5 py-1.5 text-[11px] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Restart
                  </button>
                </>
              )}
              {journey.status === "completed" && (
                <button
                  type="button"
                  onClick={() => bumpProgress(journey.id, "restart")}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-default)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                >
                  <RotateCcw className="h-3 w-3" />
                  Restart
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No journeys match your filters.</p>
      )}

      <p className="text-[11px] text-[var(--text-muted)]">
        Catalog covers 15 journeys built from implemented Septer modules. Journeys respect your RBAC
        permissions.
      </p>
    </div>
  );
}
