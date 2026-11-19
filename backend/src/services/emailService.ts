import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { DemoSubmissionRecord } from "../config/database";

dotenv.config();

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
  if (!isSmtpConfigured()) return null;

  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  });
}

export async function testSmtpConnection(): Promise<{ success: boolean; message: string }> {
  const cfg = getSmtpConfig();
  if (!isSmtpConfigured()) {
    return {
      success: false,
      message: "SMTP is not fully configured. Set SMTP_USER and SMTP_PASS in .env",
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: false, message: "Could not create email transport" };
  }

  try {
    await transporter.verify();
    return {
      success: true,
      message: `Successfully connected and authenticated with ${cfg.host}:${cfg.port} as ${cfg.user}`,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `SMTP connection failed: ${msg}`,
    };
  }
}

export async function sendDemoRequestEmails(
  submission: DemoSubmissionRecord
): Promise<{ internalSent: boolean; prospectSent: boolean; message: string }> {
  const cfg = getSmtpConfig();
  if (!isSmtpConfigured()) {
    console.log(
      `[Email Service] SMTP is not yet configured or password is placeholder. Skipped email for submission ${submission.id} (lead: ${submission.fullName} <${submission.email}> from ${submission.company}).`
    );
    return {
      internalSent: false,
      prospectSent: false,
      message: "SMTP credentials not provided in .env. Submission saved to database.",
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { internalSent: false, prospectSent: false, message: "Transport unavailable" };
  }

  let internalSent = false;
  let prospectSent = false;

  // 1. Internal Notification
  try {
    const adminHtml = `
      <div style="background-color: #071426; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; border-radius: 8px;">
        <h2 style="color: #38bdf8; margin-top: 0;">New Inbound Septer CNAPP Demo Request</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #94a3b8; width: 140px;">Reference ID:</td><td style="padding: 8px 0; font-family: monospace; color: #38bdf8;">${submission.id}</td></tr>
          <tr><td style="padding: 8px 0; color: #94a3b8;">Prospect:</td><td style="padding: 8px 0; font-weight: 600;">${submission.fullName}</td></tr>
          <tr><td style="padding: 8px 0; color: #94a3b8;">Corporate Email:</td><td style="padding: 8px 0;"><a href="mailto:${submission.email}" style="color: #38bdf8;">${submission.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #94a3b8;">Company:</td><td style="padding: 8px 0;">${submission.company}</td></tr>
          <tr><td style="padding: 8px 0; color: #94a3b8;">Cloud Platforms:</td><td style="padding: 8px 0;">${(submission.cloudProviders || []).join(", ") || "Unspecified"}</td></tr>
          <tr><td style="padding: 8px 0; color: #94a3b8;">Primary Interest:</td><td style="padding: 8px 0;">${submission.interest || "General CNAPP Overview"}</td></tr>
        </table>
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
      text: `New Demo Request\nName: ${submission.fullName}\nEmail: ${submission.email}\nCompany: ${submission.company}\nID: ${submission.id}`,
    });
    internalSent = true;
  } catch (err) {
    console.error("[Email Service] Failed to send internal notification:", err);
  }

  // 2. Confirmation to Prospect
  try {
    const prospectHtml = `
      <div style="background-color: #071426; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 36px; border-radius: 8px;">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="color: #ffffff; font-size: 22px; margin: 0 0 8px 0;">Septer</h1>
          <p style="color: #38bdf8; font-size: 14px; margin: 0; font-weight: 600;">Cloud-Native Application Protection Platform</p>
        </div>
        <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;">Hi ${submission.fullName},</p>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">Thank you for requesting a demo of <strong>Septer</strong> for <strong>${submission.company}</strong>. We have received your submission (Ref: <code style="color: #38bdf8; background: #0d1b2d; padding: 2px 6px; border-radius: 4px;">${submission.id}</code>).</p>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">A solutions architect will reach out within 24 hours to schedule a session tailored to your cloud environment.</p>
        <p style="font-size: 14px; color: #cbd5e1; margin-top: 28px;">Best regards,<br /><strong>The Septer Solutions Engineering Team</strong></p>
      </div>
    `;

    await transporter.sendMail({
      from: cfg.from,
      to: submission.email,
      subject: `Your Septer CNAPP Demo Request [${submission.company}]`,
      html: prospectHtml,
      text: `Hi ${submission.fullName},\n\nThank you for requesting a demo of Septer for ${submission.company}. We have received your request (${submission.id}) and our team will reach out shortly.\n\nBest regards,\nSepter Solutions Team`,
    });
    prospectSent = true;
  } catch (err) {
    console.error("[Email Service] Failed to send prospect confirmation email:", err);
  }

  return {
    internalSent,
    prospectSent,
    message: internalSent || prospectSent ? "Emails dispatched" : "Failed to dispatch one or more emails",
  };
}
