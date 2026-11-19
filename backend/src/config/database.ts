import pg from "pg";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const { Pool } = pg;

export interface DemoSubmissionRecord {
  id: string;
  fullName: string;
  email: string;
  company: string;
  cloudProviders?: string[];
  interest?: string;
  notes?: string;
  status: "new" | "contacted" | "qualified" | "demo_scheduled" | "closed";
  priority?: "low" | "medium" | "high" | "critical";
  createdAt: string;
  assignedTo?: string;
  ip?: string;
  userAgent?: string;
}

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.POSTGRES_USER || "cnapp_admin"}:${process.env.POSTGRES_PASSWORD || "SecureCnappPassword2026!"}@${process.env.POSTGRES_HOST || "localhost"}:${process.env.POSTGRES_PORT || "5433"}/${process.env.POSTGRES_DB || "cnapp_website_db"}`;

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 4000,
  max: 10,
});

let isPgConnected = false;

export async function initDatabase(): Promise<boolean> {
  try {
    const client = await pool.connect();
    isPgConnected = true;
    console.log(`[Database] Connected successfully to PostgreSQL at ${pool.options.connectionString ? connectionString.replace(/:[^:]*@/, ":****@") : "PostgreSQL"}`);

    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS demo_submissions (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        cloud_providers TEXT[] DEFAULT '{}',
        interest TEXT,
        notes TEXT,
        status VARCHAR(64) DEFAULT 'new',
        priority VARCHAR(64) DEFAULT 'high',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        assigned_to VARCHAR(255),
        ip VARCHAR(128),
        user_agent TEXT
      );
    `);

    // Check count and seed if empty
    const countRes = await client.query("SELECT COUNT(*) FROM demo_submissions");
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      await seedFromInitialData(client);
    }

    client.release();
    return true;
  } catch (err) {
    console.warn("[Database] PostgreSQL connection failed or offline. Operating in resilient JSON storage fallback mode:", err instanceof Error ? err.message : err);
    isPgConnected = false;
    return false;
  }
}

export function isDatabaseConnected(): boolean {
  return isPgConnected;
}

export async function seedFromInitialData(client?: pg.PoolClient): Promise<void> {
  const seedFile = path.resolve(__dirname, "../../data/submissions.json");
  if (!fs.existsSync(seedFile)) return;

  try {
    const raw = fs.readFileSync(seedFile, "utf-8");
    const records: DemoSubmissionRecord[] = JSON.parse(raw);

    const c = client || (await pool.connect());
    for (const r of records) {
      await c.query(
        `INSERT INTO demo_submissions (id, full_name, email, company, cloud_providers, interest, notes, status, priority, created_at, assigned_to)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING`,
        [
          r.id,
          r.fullName,
          r.email,
          r.company,
          r.cloudProviders || [],
          r.interest || "",
          r.notes || "",
          r.status || "new",
          r.priority || "high",
          r.createdAt || new Date().toISOString(),
          r.assignedTo || "Unassigned",
        ]
      );
    }
    if (!client) (c as pg.PoolClient).release();
    console.log(`[Database] Seeded ${records.length} demo requests into PostgreSQL.`);
  } catch (e) {
    console.error("[Database] Error seeding database:", e);
  }
}
