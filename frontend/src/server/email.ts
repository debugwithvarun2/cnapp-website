import fs from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import type { DemoSubmission } from "./storage";

// Load .env manually if process.env hasn't loaded it yet
function loadEnvFile(): void {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch (err) {
    console.error("[Email] Could not load .env file:", err);
  }
}

loadEnvFile();

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
}

export function getSmtpConfig(): SmtpConfig {
  loadEnvFile();
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const from = process.env.SMTP_FROM || (user ? `"Septer" <${user}>` : "noreply@septer.io");
  const to = process.env.SMTP_TO || user || "security-demos@septer.io";

  return { host, port, secure, user, pass, from, to };
}

export function isSmtpConfigured(): boolean {
  const cfg = getSmtpConfig();
  return Boolean(cfg.user && cfg.pass && cfg.pass !== "your-google-app-password-here");
}

function createTransporter() {
  const cfg = getSmtpConfig();
  if (!isSmtpConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass.replace(/\s+/g, ""), // Google app passwords often contain spaces
    },
  });
}

/**
 * Sends both internal team notification and prospect confirmation emails.
 */
export async function sendDemoNotificationEmails(submission: DemoSubmission): Promise<{
  internalSent: boolean;
  prospectSent: boolean;
  message?: string;
  error?: string;
}> {
  const cfg = getSmtpConfig();
  const transporter = createTransporter();

  if (!transporter) {
    console.log(
      `[Email Service] SMTP is not yet configured or password is placeholder. Skipped email for submission ${submission.id} (lead: ${submission.fullName} <${submission.email}> from ${submission.company}).`,
    );
    return {
      internalSent: false,
      prospectSent: false,
      message: "SMTP credentials not configured. Lead recorded in database.",
    };
  }

  let internalSent = false;
  let prospectSent = false;

  // 1. Email to Admin / Security Sales Engineering Team
  try {
    const adminHtml = `
      <div style="background-color: #071426; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px; border-radius: 8px;">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #38bdf8; margin: 0; font-size: 20px;">🛡️ New Inbound Demo Request</h2>
          <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Reference ID: <strong>${submission.id}</strong></p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #94a3b8; width: 140px;">Prospect Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${submission.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Work Email:</td>
            <td style="padding: 8px 0; color: #38bdf8;"><a href="mailto:${submission.email}" style="color: #38bdf8; text-decoration: none;">${submission.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Company:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${submission.company}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Cloud Target:</td>
            <td style="padding: 8px 0; color: #ffffff;">${(submission.cloudProviders || []).join(", ") || "Multi-Cloud"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Interest:</td>
            <td style="padding: 8px 0; color: #ffffff;">${submission.interest || "Unified CNAPP Platform"}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Priority:</td>
            <td style="padding: 8px 0; color: #f43f5e; font-weight: bold; text-transform: uppercase;">${submission.priority}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #94a3b8;">Submitted At:</td>
            <td style="padding: 8px 0; color: #94a3b8;">${new Date(submission.createdAt).toLocaleString()}</td>
          </tr>
        </table>

        <div style="background-color: #0d1b2d; border: 1px solid rgba(56, 189, 248, 0.2); padding: 16px; border-radius: 6px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 13px; color: #cbd5e1;">
            To triage, change status, assign a solutions architect, or schedule the session, open the <strong>Septer Admin Console</strong>.
          </p>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px; font-size: 12px; color: #64748b;">
          Septer Cloud-Native Application Protection Platform • Automated Operations Dispatch
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: cfg.from,
      to: cfg.to,
      subject: `🚨 [Septer Demo Request] ${submission.company} - ${submission.fullName}`,
      html: adminHtml,
      text: `New Demo Request\nName: ${submission.fullName}\nEmail: ${submission.email}\nCompany: ${submission.company}\nClouds: ${(submission.cloudProviders || []).join(", ")}\nID: ${submission.id}`,
    });
    internalSent = true;
    console.log(
      `[Email Service] Sent internal notification to ${cfg.to} for lead ${submission.id}`,
    );
  } catch (err: unknown) {
    console.error("[Email Service] Failed to send internal notification:", err);
  }

  // 2. Email confirmation to the Prospect
  try {
    const prospectHtml = `
      <div style="background-color: #071426; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 36px; border-radius: 8px;">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 8px 0;">Septer</h1>
          <p style="color: #38bdf8; font-size: 14px; margin: 0; font-weight: 600;">Cloud-Native Application Protection Platform</p>
        </div>

        <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;">
          Hi ${submission.fullName},
        </p>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">
          Thank you for requesting a demo of <strong>Septer</strong> for <strong>${submission.company}</strong>. We have received your submission (Ref: <code style="color: #38bdf8; background: #0d1b2d; padding: 2px 6px; border-radius: 4px;">${submission.id}</code>).
        </p>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">
          A dedicated solutions architect will reach out to you at this email address within 24 hours to schedule a deep dive tailored to your ${submission.cloudProviders?.join(", ") || "multi-cloud"} environment.
        </p>

        <div style="background-color: #0d1b2d; border-left: 3px solid #38bdf8; padding: 16px; margin: 24px 0; border-radius: 0 6px 6px 0;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #ffffff; font-size: 13px;">What to expect during your session:</p>
          <ul style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 13px; line-height: 1.6;">
            <li>Zero-impact Agentless SideScanning architecture overview</li>
            <li>Multi-cloud graph correlation & choke point attack path demonstration</li>
            <li>Controlled SOAR remediation & two-person approval workflows</li>
          </ul>
        </div>

        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
          If you have urgent questions, reply directly to this email.
        </p>

        <p style="font-size: 14px; color: #cbd5e1; margin-top: 28px;">
          Best regards,<br />
          <strong>The Septer Solutions Engineering Team</strong><br />
          <span style="color: #64748b; font-size: 12px;">Enterprise Cloud Security</span>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: cfg.from,
      to: submission.email,
      subject: `Your Septer CNAPP Demo Request [${submission.company}]`,
      html: prospectHtml,
      text: `Hi ${submission.fullName},\n\nThank you for requesting a demo of Septer for ${submission.company}. We have received your request (${submission.id}) and our cloud security team will reach out shortly to schedule your personalized session.\n\nBest regards,\nSepter Solutions Team`,
    });
    prospectSent = true;
    console.log(`[Email Service] Sent confirmation email to prospect ${submission.email}`);
  } catch (err: unknown) {
    console.error("[Email Service] Failed to send prospect confirmation email:", err);
  }

  return {
    internalSent,
    prospectSent,
    message:
      internalSent || prospectSent ? "Emails dispatched" : "Failed to dispatch one or more emails",
  };
}

/**
 * Verify SMTP connection credentials (for admin diagnostic check).
 */
export async function verifySmtp(): Promise<{ ok: boolean; message: string }> {
  const cfg = getSmtpConfig();
  if (!isSmtpConfigured()) {
    return {
      ok: false,
      message: "SMTP is not configured. Please add SMTP_USER and SMTP_PASS in .env",
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { ok: false, message: "Could not create mail transporter" };
  }

  try {
    await transporter.verify();
    return { ok: true, message: `Successfully connected to ${cfg.host} as ${cfg.user}` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: `SMTP verification failed: ${errorMsg}` };
  }
}
