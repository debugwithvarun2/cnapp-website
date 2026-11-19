import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: string;
  className?: string;
  showDot?: boolean;
}

const RISK_CONFIG: Record<string, { label: string; className: string; dotClass: string }> = {
  CRITICAL: {
    label: "Critical",
    className: "bg-[#E35D62]/15 text-[#E35D62] border-[#E35D62]/40 font-bold",
    dotClass: "bg-[#E35D62]",
  },
  HIGH: {
    label: "High",
    className: "bg-[#E69A52]/15 text-[#E69A52] border-[#E69A52]/40 font-bold",
    dotClass: "bg-[#E69A52]",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-[#D4AE4C]/15 text-[#D4AE4C] border-[#D4AE4C]/40 font-bold",
    dotClass: "bg-[#D4AE4C]",
  },
  LOW: {
    label: "Low",
    className: "bg-[#43AE86]/15 text-[#43AE86] border-[#43AE86]/40 font-bold",
    dotClass: "bg-[#43AE86]",
  },
  INFO: {
    label: "Info",
    className: "bg-[#739FC5]/15 text-[#739FC5] border-[#739FC5]/35 font-semibold",
    dotClass: "bg-[#739FC5]",
  },
  NONE: {
    label: "None",
    className:
      "bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-default)] font-medium",
    dotClass: "bg-[var(--text-disabled)]",
  },
};

export function RiskBadge({ level, className, showDot = true }: RiskBadgeProps) {
  const norm = (level || "NONE").toUpperCase();
  const config = RISK_CONFIG[norm] ?? RISK_CONFIG["NONE"]!;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide rounded-[3px]",
        config.className,
        className,
      )}
    >
      {showDot && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotClass)} />}
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; dotClass?: string }> = {
  ACTIVE: {
    label: "Active",
    className: "bg-[#43AE86]/15 text-[#43AE86] border-[#43AE86]/40 font-semibold",
    dotClass: "bg-[#43AE86]",
  },
  RUNNING: {
    label: "Running",
    className: "bg-[#43AE86]/15 text-[#43AE86] border-[#43AE86]/40 font-semibold",
    dotClass: "bg-[#43AE86]",
  },
  OPEN: {
    label: "Open",
    className: "bg-[#E69A52]/15 text-[#E69A52] border-[#E69A52]/40 font-semibold",
    dotClass: "bg-[#E69A52]",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-[#43AE86]/20 text-[#43AE86] border-[#43AE86]/50 font-semibold",
    dotClass: "bg-[#43AE86]",
  },
  MUTED: {
    label: "Muted",
    className:
      "bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-default)] font-medium",
  },
  FALSE_POSITIVE: {
    label: "False Positive",
    className:
      "bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-default)] font-medium",
  },
  INACTIVE: {
    label: "Inactive",
    className:
      "bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-default)] font-medium",
  },
  STOPPED: {
    label: "Stopped",
    className:
      "bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-default)] font-medium",
  },
  PENDING: {
    label: "Pending",
    className: "bg-[#D4AE4C]/15 text-[#D4AE4C] border-[#D4AE4C]/40 font-semibold",
    dotClass: "bg-[#D4AE4C]",
  },
  ERROR: {
    label: "Error",
    className: "bg-[#E35D62]/15 text-[#E35D62] border-[#E35D62]/40 font-bold",
    dotClass: "bg-[#E35D62]",
  },
  SYNCING: {
    label: "Syncing",
    className:
      "bg-[var(--brand-soft)] text-[var(--brand-primary)] border-[var(--brand-border)] font-semibold",
    dotClass: "bg-[var(--brand-primary)]",
  },
  TERMINATED: {
    label: "Terminated",
    className:
      "bg-[var(--surface-secondary)] text-[var(--text-disabled)] border-[var(--border-default)] font-medium",
  },
  LOCKED: {
    label: "Locked",
    className: "bg-[#E35D62]/15 text-[#E35D62] border-[#E35D62]/40 font-bold",
    dotClass: "bg-[#E35D62]",
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-[#E69A52]/15 text-[#E69A52] border-[#E69A52]/40 font-semibold",
    dotClass: "bg-[#E69A52]",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const norm = (status || "").toUpperCase();
  const config = STATUS_CONFIG[norm] ?? {
    label: status,
    className:
      "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-default)] font-medium",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide rounded-[3px]",
        config.className,
        className,
      )}
    >
      {config.dotClass && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotClass)} />
      )}
      {config.label}
    </span>
  );
}
