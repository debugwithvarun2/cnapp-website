import { Router } from "express";
import {
  handleGetSubmissions,
  handleCreateSubmission,
  handleUpdateSubmission,
  handleDeleteSubmission,
  handleGetStats,
  handleGetSmtpStatus,
  handleTestSmtp,
  handleResetSeed,
} from "../controllers/demoController";
import { isDatabaseConnected } from "../config/database";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: isDatabaseConnected() ? "PostgreSQL 16 (Connected)" : "JSON Storage Fallback",
    timestamp: new Date().toISOString(),
  });
});

// Demo requests
router.get("/demo-requests", handleGetSubmissions);
router.post("/demo-requests", handleCreateSubmission);
router.patch("/demo-requests/:id", handleUpdateSubmission);
router.delete("/demo-requests/:id", handleDeleteSubmission);

// Admin endpoints
router.get("/admin/stats", handleGetStats);
router.get("/admin/smtp-status", handleGetSmtpStatus);
router.post("/admin/test-smtp", handleTestSmtp);
router.post("/admin/reset", handleResetSeed);
router.post("/admin/reset-seed", handleResetSeed);

export default router;
