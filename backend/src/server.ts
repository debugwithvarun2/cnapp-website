import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes";
import { initDatabase } from "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Root health
app.get("/", (req, res) => {
  res.json({
    name: "Septer CNAPP Backend API Service",
    status: "running",
    version: "1.0.0",
    docs: "/api/health",
  });
});

async function start() {
  // Initialize Database connection
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`[Backend Server] Septer CNAPP API running on http://localhost:${PORT}`);
    console.log(`[Backend Server] Health endpoint: http://localhost:${PORT}/api/health`);
  });
}

start().catch((err) => {
  console.error("[Backend Server] Fatal error starting server:", err);
  process.exit(1);
});

export default app;
