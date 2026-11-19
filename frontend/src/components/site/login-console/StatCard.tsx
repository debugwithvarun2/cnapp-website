import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string; positive?: boolean };
  accentColor?: string;
  badge?: string;
  className?: string;
  onClick?: () => void;
}

const ACCENT: Record<string, { iconBg: string; iconText: string; border: string }> = {
  primary: {
    iconBg: "bg-[var(--brand-soft)] border-[var(--brand-border)]",
    iconText: "text-[var(--brand-primary)]",
    border: "hover:border-[var(--brand-primary)]/60",
  },
  red: {
    iconBg:
      "bg-[color-mix(in_srgb,var(--severity-critical)_14%,transparent)] border-[color-mix(in_srgb,var(--severity-critical)_40%,transparent)]",
    iconText: "text-[var(--severity-critical)]",
    border: "hover:border-[var(--severity-critical)]/60",
  },
  orange: {
    iconBg:
      "bg-[color-mix(in_srgb,var(--severity-high)_14%,transparent)] border-[color-mix(in_srgb,var(--severity-high)_40%,transparent)]",
    iconText: "text-[var(--severity-high)]",
    border: "hover:border-[var(--severity-high)]/60",
  },
  amber: {
    iconBg:
      "bg-[color-mix(in_srgb,var(--severity-medium)_14%,transparent)] border-[color-mix(in_srgb,var(--severity-medium)_40%,transparent)]",
    iconText: "text-[var(--severity-medium)]",
    border: "hover:border-[var(--severity-medium)]/60",
  },
  green: {
    iconBg:
      "bg-[color-mix(in_srgb,var(--severity-low)_14%,transparent)] border-[color-mix(in_srgb,var(--severity-low)_40%,transparent)]",
    iconText: "text-[var(--severity-low)]",
    border: "hover:border-[var(--severity-low)]/60",
  },
  steel: {
    iconBg:
      "bg-[color-mix(in_srgb,var(--support-steel)_14%,transparent)] border-[color-mix(in_srgb,var(--support-steel)_40%,transparent)]",
    iconText: "text-[var(--support-steel)]",
    border: "hover:border-[var(--support-steel)]/60",
  },
  violet: {
    iconBg:
      "bg-[color-mix(in_srgb,var(--support-violet)_14%,transparent)] border-[color-mix(in_srgb,var(--support-violet)_40%,transparent)]",
    iconText: "text-[var(--support-violet)]",
    border: "hover:border-[var(--support-violet)]/60",
  },
  slate: {
    iconBg: "bg-[var(--surface-secondary)] border-[var(--border-default)]",
    iconText: "text-[var(--text-secondary)]",
    border: "hover:border-[var(--border-strong)]",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = "primary",
  badge,
  className,
  onClick,
}: StatCardProps) {
  const a = ACCENT[accentColor] ?? ACCENT["primary"]!;

  let badgeStyles =
    "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-default)]";
  if (badge) {
    const lower = badge.toLowerCase();
    if (lower.includes("critical") || lower.includes("danger") || lower.includes("fail")) {
      badgeStyles =
        "bg-[color-mix(in_srgb,var(--severity-critical)_14%,transparent)] text-[var(--severity-critical)] border-[color-mix(in_srgb,var(--severity-critical)_40%,transparent)]";
    } else if (lower.includes("high") || lower.includes("warn") || lower.includes("medium")) {
      badgeStyles =
        "bg-[color-mix(in_srgb,var(--severity-high)_14%,transparent)] text-[var(--severity-high)] border-[color-mix(in_srgb,var(--severity-high)_40%,transparent)]";
    } else if (
      lower.includes("pass") ||
      lower.includes("healthy") ||
      lower.includes("active") ||
      lower.includes("good") ||
      lower.includes("connected")
    ) {
      badgeStyles =
        "bg-[color-mix(in_srgb,var(--severity-low)_14%,transparent)] text-[var(--severity-low)] border-[color-mix(in_srgb,var(--severity-low)_40%,transparent)]";
    } else if (lower.includes("disconnect") || lower.includes("n/a") || lower.includes("none")) {
      badgeStyles =
        "bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-default)]";
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "stat-card-fx rounded-[8px] border border-[var(--border-default)] bg-[var(--surface)] p-4",
        "shadow-[inset_0_1px_0_var(--glass-highlight)] backdrop-blur-[2px]",
        a.border,
        onClick && "cursor-pointer hover:bg-[var(--surface-hover)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] leading-tight">
              {title}
            </p>
            {badge && (
              <span
                className={cn(
                  "rounded-[4px] border px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase",
                  badgeStyles,
                )}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="font-heading text-[1.625rem] font-bold leading-none tracking-[-0.03em] text-[var(--text-primary)]">
            {value}
          </p>
          {subtitle && (
            <p className="truncate text-[11px] text-[var(--text-secondary)]">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 pt-0.5 text-[10px] font-mono">
              <span
                className={cn(
                  "font-bold",
                  (trend.positive ?? trend.value >= 0)
                    ? "text-[var(--severity-low)]"
                    : "text-[var(--severity-critical)]",
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-[var(--text-muted)]">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn("shrink-0 rounded-[6px] border p-2.5", a.iconBg, a.iconText)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
