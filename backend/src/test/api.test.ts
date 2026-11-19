import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import cors from "cors";
import apiRoutes from "../routes/apiRoutes";
import { initDatabase, pool } from "../config/database";
import type { Server } from "node:http";

describe("Septer CNAPP Backend API Tests", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    // Initialize DB (PostgreSQL or fallback)
    await initDatabase();

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/api", apiRoutes);

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (typeof address === "object" && address !== null) {
          baseUrl = `http://localhost:${address.port}`;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
    await pool.end();
  });

  it("GET /api/health returns ok status and db info", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(data.database).toBeDefined();
  });

  it("GET /api/demo-requests returns seeded records and stats", async () => {
    const res = await fetch(`${baseUrl}/api/demo-requests`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.stats).toBeDefined();
    expect(data.stats.total).toBeGreaterThanOrEqual(1);
  });

  it("POST /api/demo-requests creates a new lead and persists", async () => {
    const newLead = {
      fullName: "Vitest Engineer",
      email: "engineer@testcorp.com",
      company: "Test Corp Global",
      cloudProviders: ["aws", "kubernetes"],
      interest: "Agentless CNAPP & Graph DSPM",
      notes: "Integration test submission",
    };

    const res = await fetch(`${baseUrl}/api/demo-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead),
    });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.fullName).toBe("Vitest Engineer");
    expect(json.data.company).toBe("Test Corp Global");
    expect(json.data.status).toBe("new");

    const createdId = json.data.id;

    // PATCH to update status
    const updateRes = await fetch(`${baseUrl}/api/demo-requests/${createdId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "qualified", notes: "Verified lead" }),
    });
    expect(updateRes.status).toBe(200);
    const updateJson = await updateRes.json();
    expect(updateJson.data.status).toBe("qualified");

    // DELETE created test lead to keep db clean
    const delRes = await fetch(`${baseUrl}/api/demo-requests/${createdId}`, {
      method: "DELETE",
    });
    expect(delRes.status).toBe(200);
  });

  it("POST /api/demo-requests rejects invalid payloads", async () => {
    const invalidLead = {
      fullName: "",
      email: "not-an-email",
    };

    const res = await fetch(`${baseUrl}/api/demo-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidLead),
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("GET /api/admin/stats returns metrics", async () => {
    const res = await fetch(`${baseUrl}/api/admin/stats`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(typeof json.data.total).toBe("number");
    expect(typeof json.data.conversionRate).toBe("number");
  });

  it("GET /api/admin/smtp-status reports configuration", async () => {
    const res = await fetch(`${baseUrl}/api/admin/smtp-status`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.host).toBeDefined();
  });
});
