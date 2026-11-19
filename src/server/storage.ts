import fs from "node:fs";
import path from "node:path";

export interface DemoSubmission {
  id: string;
  fullName: string;
  email: string;
  company: string;
  cloudProviders?: string[];
  interest?: string;
  notes?: string;
  status: "new" | "contacted" | "qualified" | "demo_scheduled" | "closed";
  priority: "critical" | "high" | "medium" | "low";
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  ip?: string;
  userAgent?: string;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

const SEED_DATA: DemoSubmission[] = [
  {
    id: "req_cs_94102",
    fullName: "Sarah Jenkins",
    email: "s.jenkins@finovatech.io",
    company: "Finova Financial",
    cloudProviders: ["AWS", "GCP"],
    interest: "CIEM Effective Access & Attack Path Graph",
    notes:
      "Evaluating multi-cloud identity risk across 400+ AWS accounts. Requesting deep dive into choke points.",
    status: "new",
    priority: "high",
    createdAt: new Date(Date.now() - 1000 * 60 * 34).toISOString(), // 34 mins ago
    assignedTo: "Alex Mercer (Principal Solutions Architect)",
  },
  {
    id: "req_cs_93881",
    fullName: "Marcus Vance",
    email: "m.vance@aerocore-defense.com",
    company: "AeroCore Systems",
    cloudProviders: ["AWS", "Azure"],
    interest: "Agentless SideScanning & CWPP",
    notes:
      "Requires zero-impact workload inspection on live production clusters without host agents.",
    status: "demo_scheduled",
    priority: "critical",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hrs ago
    assignedTo: "Elena Rostova (Director of SecOps)",
  },
  {
    id: "req_cs_92715",
    fullName: "Dr. Aris Thorne",
    email: "athorne@healthnexus.org",
    company: "Nexus Health Networks",
    cloudProviders: ["Azure", "GCP"],
    interest: "DSPM & Sensitive Data Exposure",
    notes:
      "HIPAA and SOC2 Type II compliance audit upcoming in Q3. Interested in automated evidence exports.",
    status: "contacted",
    priority: "high",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hrs ago
    assignedTo: "Devon Reed (Enterprise AE)",
  },
  {
    id: "req_cs_91040",
    fullName: "Kevin Zhao",
    email: "kevin.zhao@cloudlogistics.net",
    company: "CloudLogistics Global",
    cloudProviders: ["AWS", "Multi-Cloud"],
    interest: "Controlled Remediation & SOAR Guardrails",
    notes:
      "Wants to test two-person approval workflows before deploying automated Terraform fixes.",
    status: "qualified",
    priority: "medium",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    assignedTo: "Alex Mercer (Principal Solutions Architect)",
  },
];

function ensureStorageInitialized(): DemoSubmission[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_DATA, null, 2), "utf-8");
      return SEED_DATA;
    }
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return SEED_DATA;
  } catch (err) {
    console.error("[Storage] Failed to read submissions data:", err);
    return SEED_DATA;
  }
}

function writeStorage(items: DemoSubmission[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tmp = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tmp, JSON.stringify(items, null, 2), "utf-8");
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    console.error("[Storage] Failed to write submissions data:", err);
    throw err;
  }
}

export function getAllSubmissions(): DemoSubmission[] {
  const items = ensureStorageInitialized();
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getSubmissionById(id: string): DemoSubmission | null {
  const items = getAllSubmissions();
  return items.find((it) => it.id === id) ?? null;
}

export function createSubmission(payload: {
  fullName: string;
  email: string;
  company: string;
  cloudProviders?: string[];
  interest?: string;
  notes?: string;
  ip?: string;
  userAgent?: string;
}): DemoSubmission {
  const items = ensureStorageInitialized();

  // Determine auto-priority based on enterprise indicators
  let priority: DemoSubmission["priority"] = "medium";
  const lowerCompany = payload.company.toLowerCase();
  const lowerEmail = payload.email.toLowerCase();
  if (
    lowerCompany.includes("defense") ||
    lowerCompany.includes("bank") ||
    lowerCompany.includes("financial") ||
    lowerCompany.includes("health") ||
    lowerEmail.endsWith(".gov") ||
    lowerEmail.endsWith(".mil")
  ) {
    priority = "critical";
  } else if (
    lowerCompany.includes("enterprise") ||
    lowerCompany.includes("global") ||
    lowerCompany.includes("cloud") ||
    lowerCompany.includes("tech")
  ) {
    priority = "high";
  }

  const id = `req_cs_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const newSubmission: DemoSubmission = {
    id,
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    company: payload.company.trim(),
    cloudProviders:
      payload.cloudProviders && payload.cloudProviders.length > 0
        ? payload.cloudProviders
        : ["Multi-Cloud"],
    interest: payload.interest?.trim() || "Unified CNAPP Platform Demo",
    notes: payload.notes?.trim() || "",
    status: "new",
    priority,
    createdAt: new Date().toISOString(),
    assignedTo: "Unassigned (New Inbound)",
    ip: payload.ip,
    userAgent: payload.userAgent,
  };

  items.unshift(newSubmission);
  writeStorage(items);
  return newSubmission;
}

export function updateSubmission(
  id: string,
  patch: Partial<Pick<DemoSubmission, "status" | "priority" | "notes" | "assignedTo">>,
): DemoSubmission | null {
  const items = ensureStorageInitialized();
  const index = items.findIndex((it) => it.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  writeStorage(items);
  return items[index];
}

export function deleteSubmission(id: string): boolean {
  const items = ensureStorageInitialized();
  const filtered = items.filter((it) => it.id !== id);
  if (filtered.length === items.length) return false;
  writeStorage(filtered);
  return true;
}

export function resetSeedSubmissions(): DemoSubmission[] {
  writeStorage(SEED_DATA);
  return SEED_DATA;
}

export function getStats() {
  const items = getAllSubmissions();
  const total = items.length;
  const newRequests = items.filter((it) => it.status === "new").length;
  const contacted = items.filter((it) => it.status === "contacted").length;
  const qualified = items.filter((it) => it.status === "qualified").length;
  const scheduled = items.filter((it) => it.status === "demo_scheduled").length;
  const closed = items.filter((it) => it.status === "closed").length;
  const critical = items.filter((it) => it.priority === "critical").length;

  return {
    total,
    newRequests,
    contacted,
    qualified,
    scheduled,
    closed,
    critical,
    conversionRate: total > 0 ? Math.round(((qualified + scheduled) / total) * 100) : 0,
  };
}
