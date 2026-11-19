import { describe, expect, it, beforeEach } from "vitest";
import { handleApiRequest } from "@/server/api";
import {
  createSubmission,
  deleteSubmission,
  getAllSubmissions,
  getStats,
  resetSeedSubmissions,
  updateSubmission,
} from "@/server/storage";

describe("Backend Storage & API", () => {
  beforeEach(() => {
    resetSeedSubmissions();
  });

  it("stores and retrieves demo submissions", () => {
    const initial = getAllSubmissions();
    expect(initial.length).toBeGreaterThan(0);

    const created = createSubmission({
      fullName: "Test Enterprise Leader",
      email: "leader@testcorp.com",
      company: "TestCorp Global",
      cloudProviders: ["AWS", "Azure"],
      interest: "Attack Paths & SideScanning",
    });

    expect(created.id).toBeDefined();
    expect(created.status).toBe("new");
    expect(created.fullName).toBe("Test Enterprise Leader");

    const all = getAllSubmissions();
    expect(all[0].id).toBe(created.id);
  });

  it("updates submission status and notes", () => {
    const created = createSubmission({
      fullName: "Jane Doe",
      email: "jane@acme.com",
      company: "Acme Cloud",
    });

    const updated = updateSubmission(created.id, {
      status: "demo_scheduled",
      notes: "Demo scheduled for Thursday 2pm EST",
    });

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("demo_scheduled");
    expect(updated?.notes).toContain("Thursday 2pm EST");
  });

  it("deletes a submission", () => {
    const created = createSubmission({
      fullName: "Delete Me",
      email: "delete@acme.com",
      company: "Acme Temp",
    });

    const success = deleteSubmission(created.id);
    expect(success).toBe(true);

    const all = getAllSubmissions();
    expect(all.find((s) => s.id === created.id)).toBeUndefined();
  });

  it("handles POST /api/demo-requests successfully", async () => {
    const request = new Request("http://localhost:8080/api/demo-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Marcus Aurelius",
        email: "marcus@rome.corp",
        company: "Roman Empire Security",
        cloudProviders: ["AWS", "GCP"],
        interest: "DSPM & CIEM",
      }),
    });

    const response = await handleApiRequest(request);
    expect(response).not.toBeNull();
    expect(response?.status).toBe(201);

    const json = await response?.json();
    expect(json.success).toBe(true);
    expect(json.data.fullName).toBe("Marcus Aurelius");
    expect(json.data.company).toBe("Roman Empire Security");
  });

  it("validates required fields on POST /api/demo-requests", async () => {
    const request = new Request("http://localhost:8080/api/demo-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "",
        email: "invalid-email",
        company: "",
      }),
    });

    const response = await handleApiRequest(request);
    expect(response?.status).toBe(400);

    const json = await response?.json();
    expect(json.success).toBe(false);
  });

  it("handles GET /api/demo-requests with filters and stats", async () => {
    const request = new Request("http://localhost:8080/api/demo-requests?status=new", {
      method: "GET",
    });

    const response = await handleApiRequest(request);
    expect(response?.status).toBe(200);

    const json = await response?.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.stats).toBeDefined();
    expect(json.stats.total).toBeGreaterThan(0);
  });

  it("handles PATCH /api/demo-requests/:id to update triage status", async () => {
    // Create lead through handleApiRequest
    const createReq = new Request("http://localhost:8080/api/demo-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Alice Smith",
        email: "alice@fintech.io",
        company: "Fintech Org",
      }),
    });
    const createRes = await handleApiRequest(createReq);
    expect(createRes?.status).toBe(201);
    const createJson = await createRes?.json();
    const targetId = createJson.data.id;

    const request = new Request(`http://localhost:8080/api/demo-requests/${targetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "qualified" }),
    });

    const response = await handleApiRequest(request);
    expect(response?.status).toBe(200);

    const json = await response?.json();
    expect(json.success).toBe(true);
    expect(json.data.status).toBe("qualified");
  });

  it("handles GET /api/admin/smtp-status", async () => {
    const request = new Request("http://localhost:8080/api/admin/smtp-status", {
      method: "GET",
    });

    const response = await handleApiRequest(request);
    expect(response?.status).toBe(200);

    const json = await response?.json();
    expect(json.success).toBe(true);
    expect(json.host).toBe("smtp.gmail.com");
    expect(typeof json.configured).toBe("boolean");
  });
});
