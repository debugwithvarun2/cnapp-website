/**
 * Honest scan / connection status banner for CNAPP modules.
 * Uses multi-hue status tokens (not brand-only) for clear contrast.
 */
import { SCAN_STATUS_LABELS, type HonestScanStatus } from "./scanStatus";

export function ScanStatusBanner({
  status,
  message,
  className = "",
}: {
  status: HonestScanStatus;
  message?: string;
  className?: string;
}) {
  const label = SCAN_STATUS_LABELS[status] || status;
  const tone =
    status === "SCAN_COMPLETED" || status === "NO_FINDINGS"
      ? "border-[color-mix(in_srgb,var(--status-success)_45%,transparent)] text-[var(--status-success)] bg-[color-mix(in_srgb,var(--status-success)_12%,transparent)]"
      : status === "SCAN_FAILED" || status === "AUTH_FAILED" || status === "CONNECTION_ERROR"
        ? "border-[color-mix(in_srgb,var(--status-danger)_45%,transparent)] text-[var(--status-danger)] bg-[color-mix(in_srgb,var(--status-danger)_12%,transparent)]"
        : status === "NOT_CONNECTED" ||
            status === "NOT_CONFIGURED" ||
            status === "NOT_SCANNED" ||
            status === "UNSUPPORTED"
          ? "border-[color-mix(in_srgb,var(--status-warning)_45%,transparent)] text-[var(--status-warning)] bg-[color-mix(in_srgb,var(--status-warning)_12%,transparent)]"
          : status === "SCAN_RUNNING" || status === "SCAN_QUEUED"
            ? "border-[color-mix(in_srgb,var(--status-info)_45%,transparent)] text-[var(--status-info)] bg-[color-mix(in_srgb,var(--status-info)_12%,transparent)]"
            : "border-[var(--border-default)] text-[var(--text-secondary)] bg-[var(--surface)]";

  return (
    <div
      role="status"
      className={`rounded-[6px] border px-3 py-2 text-xs font-mono ${tone} ${className}`}
    >
      <span className="font-semibold tracking-wide">{label}</span>
      {message ? <span className="ml-2 opacity-90">{message}</span> : null}
    </div>
  );
}
