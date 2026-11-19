/** Shared honest status vocabulary (mirrors backend enterprise/scanStatus). */
export type HonestScanStatus =
  | "NOT_CONNECTED"
  | "AUTH_FAILED"
  | "INSUFFICIENT_PERMISSIONS"
  | "CONNECTION_ERROR"
  | "SCAN_QUEUED"
  | "SCAN_RUNNING"
  | "SCAN_COMPLETED"
  | "SCAN_FAILED"
  | "PARTIAL_RESULTS"
  | "NO_FINDINGS"
  | "UNSUPPORTED"
  | "NOT_CONFIGURED"
  | "NOT_SCANNED";

export const SCAN_STATUS_LABELS: Record<HonestScanStatus, string> = {
  NOT_CONNECTED: "Not Connected",
  AUTH_FAILED: "Authentication Failed",
  INSUFFICIENT_PERMISSIONS: "Insufficient Permissions",
  CONNECTION_ERROR: "Connection Error",
  SCAN_QUEUED: "Scan Queued",
  SCAN_RUNNING: "Scan Running",
  SCAN_COMPLETED: "Scan Completed",
  SCAN_FAILED: "Scan Failed",
  PARTIAL_RESULTS: "Partial Results",
  NO_FINDINGS: "No Findings",
  UNSUPPORTED: "Unsupported",
  NOT_CONFIGURED: "Not Configured",
  NOT_SCANNED: "Not Scanned",
};

export function mapApiStatus(raw?: string | null): HonestScanStatus {
  const s = (raw || "").toLowerCase();
  if (s.includes("not connected")) return "NOT_CONNECTED";
  if (s.includes("not configured")) return "NOT_CONFIGURED";
  if (s.includes("not scanned")) return "NOT_SCANNED";
  if (s.includes("no findings")) return "NO_FINDINGS";
  if (s.includes("failed") || s.includes("error")) return "SCAN_FAILED";
  if (s.includes("running") || s.includes("queued"))
    return s.includes("queued") ? "SCAN_QUEUED" : "SCAN_RUNNING";
  if (s.includes("unsupported")) return "UNSUPPORTED";
  if (s.includes("completed") || s.includes("success")) return "SCAN_COMPLETED";
  return "NOT_SCANNED";
}
