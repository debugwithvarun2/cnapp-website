import { cn } from "@/lib/utils";

interface SecurityScoreGaugeProps {
  score: number;
  grade?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function SecurityScoreGauge({
  score,
  grade = "A",
  size = 160,
  strokeWidth = 12,
  className,
}: SecurityScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = "text-emerald-500";
  if (normalizedScore < 50) colorClass = "text-red-500";
  else if (normalizedScore < 70) colorClass = "text-orange-500";
  else if (normalizedScore < 85) colorClass = "text-amber-500";

  return (
    <div className={cn("relative flex shrink-0 items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90 transform">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-[var(--border-default)]"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
          className={cn("transition-all duration-1000 ease-out", colorClass)}
          fill="transparent"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-mono text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          {normalizedScore}
        </span>
        <span className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
          Grade <span className={cn("font-bold", colorClass)}>{grade}</span>
        </span>
      </div>
    </div>
  );
}
