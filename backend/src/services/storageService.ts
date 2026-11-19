import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool, isDatabaseConnected, DemoSubmissionRecord, seedFromInitialData } from "../config/database";

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

function ensureFileStorage(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

function readFileStorage(): DemoSubmissionRecord[] {
  ensureFileStorage();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeFileStorage(data: DemoSubmissionRecord[]): void {
  ensureFileStorage();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function mapRowToRecord(row: any): DemoSubmissionRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    company: row.company,
    cloudProviders: row.cloud_providers || [],
    interest: row.interest || "",
    notes: row.notes || "",
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    assignedTo: row.assigned_to,
    ip: row.ip,
    userAgent: row.user_agent,
  };
}

export async function getAllSubmissions(): Promise<DemoSubmissionRecord[]> {
  if (isDatabaseConnected()) {
    try {
      const res = await pool.query("SELECT * FROM demo_submissions ORDER BY created_at DESC");
      return res.rows.map(mapRowToRecord);
    } catch (err) {
      console.error("[Storage] Failed to query PostgreSQL, reading fallback file:", err);
    }
  }
  return readFileStorage();
}

export async function createSubmission(
  submission: Omit<DemoSubmissionRecord, "id" | "createdAt" | "status" | "priority"> & {
    id?: string;
    status?: DemoSubmissionRecord["status"];
    priority?: DemoSubmissionRecord["priority"];
  }
): Promise<DemoSubmissionRecord> {
  const newRecord: DemoSubmissionRecord = {
    id: submission.id || `req_septer_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    fullName: submission.fullName.trim(),
    email: submission.email.trim().toLowerCase(),
    company: submission.company.trim(),
    cloudProviders: submission.cloudProviders || [],
    interest: (submission.interest || "").trim(),
    notes: (submission.notes || "").trim(),
    status: submission.status || "new",
    priority: submission.priority || "high",
    createdAt: new Date().toISOString(),
    assignedTo: "Unassigned (New Inbound)",
    ip: submission.ip || "127.0.0.1",
    userAgent: submission.userAgent || "Unknown",
  };

  if (isDatabaseConnected()) {
    try {
      await pool.query(
        `INSERT INTO demo_submissions (id, full_name, email, company, cloud_providers, interest, notes, status, priority, created_at, assigned_to, ip, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          newRecord.id,
          newRecord.fullName,
          newRecord.email,
          newRecord.company,
          newRecord.cloudProviders,
          newRecord.interest,
          newRecord.notes,
          newRecord.status,
          newRecord.priority,
          newRecord.createdAt,
          newRecord.assignedTo,
          newRecord.ip,
          newRecord.userAgent,
        ]
      );
    } catch (err) {
      console.error("[Storage] Failed to insert into PostgreSQL, persisting to fallback file:", err);
    }
  }

  // Also persist to JSON file backup
  const all = readFileStorage();
  all.unshift(newRecord);
  writeFileStorage(all);

  return newRecord;
}

export async function updateSubmission(
  id: string,
  patch: Partial<Omit<DemoSubmissionRecord, "id" | "createdAt">>
): Promise<DemoSubmissionRecord | null> {
  let updatedRecord: DemoSubmissionRecord | null = null;

  if (isDatabaseConnected()) {
    try {
      const current = await pool.query("SELECT * FROM demo_submissions WHERE id = $1", [id]);
      if (current.rows.length > 0) {
        const row = current.rows[0];
        const status = patch.status !== undefined ? patch.status : row.status;
        const priority = patch.priority !== undefined ? patch.priority : row.priority;
        const assignedTo = patch.assignedTo !== undefined ? patch.assignedTo : row.assigned_to;
        const notes = patch.notes !== undefined ? patch.notes : row.notes;

        const res = await pool.query(
          `UPDATE demo_submissions 
           SET status = $1, priority = $2, assigned_to = $3, notes = $4
           WHERE id = $5 RETURNING *`,
          [status, priority, assignedTo, notes, id]
        );
        if (res.rows.length > 0) {
          updatedRecord = mapRowToRecord(res.rows[0]);
        }
      }
    } catch (err) {
      console.error("[Storage] Failed to update PostgreSQL:", err);
    }
  }

  // Mirror to file
  const all = readFileStorage();
  const idx = all.findIndex((i) => i.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...patch };
    writeFileStorage(all);
    if (!updatedRecord) updatedRecord = all[idx];
  }

  return updatedRecord;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  let deleted = false;
  if (isDatabaseConnected()) {
    try {
      const res = await pool.query("DELETE FROM demo_submissions WHERE id = $1", [id]);
      deleted = (res.rowCount ?? 0) > 0;
    } catch (err) {
      console.error("[Storage] Failed to delete from PostgreSQL:", err);
    }
  }

  const all = readFileStorage();
  const next = all.filter((i) => i.id !== id);
  if (next.length !== all.length) {
    writeFileStorage(next);
    deleted = true;
  }
  return deleted;
}

export async function getStats() {
  const all = await getAllSubmissions();
  const total = all.length;
  const newRequests = all.filter((r) => r.status === "new").length;
  const contacted = all.filter((r) => r.status === "contacted").length;
  const qualified = all.filter((r) => r.status === "qualified").length;
  const scheduled = all.filter((r) => r.status === "demo_scheduled").length;
  const closed = all.filter((r) => r.status === "closed").length;
  const critical = all.filter((r) => r.priority === "critical").length;
  const conversionRate = total > 0 ? Math.round(((qualified + scheduled) / total) * 100) : 0;

  return {
    total,
    newRequests,
    contacted,
    qualified,
    scheduled,
    closed,
    critical,
    conversionRate,
    database: isDatabaseConnected() ? "PostgreSQL 16" : "JSON Storage Fallback",
  };
}

export async function resetToSeedData(): Promise<DemoSubmissionRecord[]> {
  if (isDatabaseConnected()) {
    try {
      await pool.query("TRUNCATE TABLE demo_submissions");
      await seedFromInitialData();
    } catch (err) {
      console.error("[Storage] Failed to reset PostgreSQL seed:", err);
    }
  }

  const seedFile = path.resolve(process.cwd(), "data/submissions.json");
  if (fs.existsSync(seedFile)) {
    const raw = fs.readFileSync(seedFile, "utf-8");
    writeFileStorage(JSON.parse(raw));
  }
  return getAllSubmissions();
}
