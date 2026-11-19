import { Request, Response } from "express";
import {
  getAllSubmissions,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getStats,
  resetToSeedData,
} from "../services/storageService";
import { sendDemoRequestEmails, testSmtpConnection, isSmtpConfigured, getSmtpConfig } from "../services/emailService";

export async function handleGetSubmissions(req: Request, res: Response) {
  try {
    const list = await getAllSubmissions();
    const stats = await getStats();
    res.json({ success: true, count: list.length, data: list, stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to load submissions" });
  }
}

export async function handleCreateSubmission(req: Request, res: Response) {
  try {
    const { fullName, email, company, cloudProviders, interest, notes } = req.body || {};

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return res.status(400).json({ success: false, error: "Full name is required" });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: "A valid corporate email is required" });
    }
    if (!company || typeof company !== "string" || !company.trim()) {
      return res.status(400).json({ success: false, error: "Company name is required" });
    }

    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown";

    const created = await createSubmission({
      fullName,
      email,
      company,
      cloudProviders: Array.isArray(cloudProviders) ? cloudProviders : [],
      interest,
      notes,
      ip,
      userAgent,
    });

    const emailResult = await sendDemoRequestEmails(created);

    res.status(201).json({
      success: true,
      message: "Demo request received successfully. Our cloud security team will reach out shortly.",
      data: created,
      email: emailResult,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
}

export async function handleUpdateSubmission(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status, priority, assignedTo, notes } = req.body || {};

    if (!id) {
      return res.status(400).json({ success: false, error: "Submission ID is required" });
    }

    const updated = await updateSubmission(id, { status, priority, assignedTo, notes });
    if (!updated) {
      return res.status(404).json({ success: false, error: "Submission not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to update" });
  }
}

export async function handleDeleteSubmission(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      return res.status(400).json({ success: false, error: "Submission ID is required" });
    }
    const deleted = await deleteSubmission(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Submission not found" });
    }
    res.json({ success: true, message: "Submission deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to delete" });
  }
}

export async function handleGetStats(req: Request, res: Response) {
  try {
    const stats = await getStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to get stats" });
  }
}

export async function handleGetSmtpStatus(req: Request, res: Response) {
  const cfg = getSmtpConfig();
  const configured = isSmtpConfigured();
  const userMasked = cfg.user ? `${cfg.user.substring(0, 3)}***@${cfg.user.split("@")[1] || ""}` : null;
  res.json({
    success: true,
    configured,
    host: cfg.host,
    port: cfg.port,
    userMasked,
    from: cfg.from,
    to: cfg.to,
    data: {
      configured,
      host: cfg.host,
      port: cfg.port,
      userMasked,
      from: cfg.from,
      to: cfg.to,
    },
  });
}

export async function handleTestSmtp(req: Request, res: Response) {
  const result = await testSmtpConnection();
  res.status(result.success ? 200 : 400).json(result);
}

export async function handleResetSeed(req: Request, res: Response) {
  try {
    const restored = await resetToSeedData();
    res.json({
      success: true,
      message: "Seed demo requests restored successfully.",
      count: restored.length,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to reset seed data" });
  }
}
