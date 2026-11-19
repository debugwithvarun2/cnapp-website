import {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getStats,
  resetSeedSubmissions,
  type DemoSubmission,
} from "./storage";
import { sendDemoNotificationEmails, isSmtpConfigured, getSmtpConfig, verifySmtp } from "./email";

function jsonResponse(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...headers,
    },
  });
}

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!pathname.startsWith("/api/")) {
    return null;
  }

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Forward to Dedicated Express Backend with PostgreSQL
  const backendBase = process.env.BACKEND_URL || process.env.VITE_BACKEND_URL || "http://localhost:5005";
  try {
    const targetUrl = `${backendBase}${pathname}${url.search}`;
    const fHeaders = new Headers(request.headers);
    fHeaders.set("host", new URL(backendBase).host);

    const bodyBuffer =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.clone().arrayBuffer()
        : undefined;

    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers: fHeaders,
      body: bodyBuffer,
    });

    const resHeaders = new Headers(backendRes.headers);
    resHeaders.set("Access-Control-Allow-Origin", "*");
    const respData = await backendRes.arrayBuffer();

    return new Response(respData, {
      status: backendRes.status,
      headers: resHeaders,
    });
  } catch {
    // If backend is unreachable, gracefully fall back to local handler below
  }

  // Route: /api/admin/stats
  if (pathname === "/api/admin/stats" && request.method === "GET") {
    const stats = getStats();
    return jsonResponse({ success: true, data: stats });
  }

  // Route: /api/admin/smtp-status
  if (pathname === "/api/admin/smtp-status" && request.method === "GET") {
    const configured = isSmtpConfigured();
    const cfg = getSmtpConfig();
    const shouldVerify = url.searchParams.get("verify") === "true";
    let verification: { ok: boolean; message: string } | null = null;
    if (shouldVerify && configured) {
      verification = await verifySmtp();
    }

    return jsonResponse({
      success: true,
      configured,
      host: cfg.host,
      port: cfg.port,
      userMasked: cfg.user ? cfg.user.replace(/(.{2})(.*)(@.*)/, "$1***$3") : null,
      recipientTo: cfg.to,
      verification,
    });
  }

  // Route: /api/admin/reset
  if (pathname === "/api/admin/reset" && request.method === "POST") {
    const data = resetSeedSubmissions();
    return jsonResponse({ success: true, message: "Reset to seed data", data });
  }

  // Route: /api/demo-requests
  if (pathname === "/api/demo-requests") {
    if (request.method === "GET") {
      const search = url.searchParams.get("search")?.toLowerCase();
      const status = url.searchParams.get("status");
      const priority = url.searchParams.get("priority");

      let items = getAllSubmissions();

      if (status && status !== "all") {
        items = items.filter((it) => it.status === status);
      }
      if (priority && priority !== "all") {
        items = items.filter((it) => it.priority === priority);
      }
      if (search) {
        items = items.filter(
          (it) =>
            it.fullName.toLowerCase().includes(search) ||
            it.email.toLowerCase().includes(search) ||
            it.company.toLowerCase().includes(search) ||
            (it.interest && it.interest.toLowerCase().includes(search)),
        );
      }

      const stats = getStats();
      return jsonResponse({ success: true, data: items, total: items.length, stats });
    }

    if (request.method === "POST") {
      try {
        let body: Record<string, unknown> = {};
        const contentType = request.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          body = (await request.json()) as Record<string, unknown>;
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
          const text = await request.text();
          const params = new URLSearchParams(text);
          body = Object.fromEntries(params.entries());
        } else {
          try {
            body = (await request.json()) as Record<string, unknown>;
          } catch {
            body = {};
          }
        }

        const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
        const email = typeof body.email === "string" ? body.email.trim() : "";
        const company = typeof body.company === "string" ? body.company.trim() : "";

        if (!fullName) {
          return jsonResponse({ success: false, error: "Full name is required." }, 400);
        }
        if (!email || !email.includes("@") || !email.includes(".")) {
          return jsonResponse(
            { success: false, error: "A valid corporate or work email address is required." },
            400,
          );
        }
        if (!company) {
          return jsonResponse(
            { success: false, error: "Company or organization name is required." },
            400,
          );
        }

        const cloudProviders = Array.isArray(body.cloudProviders)
          ? (body.cloudProviders as string[])
          : typeof body.cloudProviders === "string"
            ? body.cloudProviders
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : undefined;

        const ip =
          request.headers.get("x-forwarded-for") ||
          request.headers.get("cf-connecting-ip") ||
          "127.0.0.1";
        const userAgent = request.headers.get("user-agent") || undefined;

        const submission = createSubmission({
          fullName,
          email,
          company,
          cloudProviders,
          interest: typeof body.interest === "string" ? body.interest : undefined,
          notes: typeof body.notes === "string" ? body.notes : undefined,
          ip,
          userAgent,
        });

        // Dispatch asynchronous SMTP email notifications (never blocks response)
        sendDemoNotificationEmails(submission).catch((mailErr: unknown) => {
          console.error("[API] Background email dispatch error:", mailErr);
        });

        return jsonResponse(
          {
            success: true,
            message:
              "Demo request received successfully. Our cloud security team will reach out shortly.",
            data: submission,
          },
          201,
        );
      } catch (err: unknown) {
        console.error("[API] Error processing submission:", err);
        return jsonResponse({ success: false, error: "Server error processing submission." }, 500);
      }
    }

    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  // Dynamic route: /api/demo-requests/:id
  const matchId = pathname.match(/^\/api\/demo-requests\/([^/]+)$/);
  if (matchId) {
    const id = matchId[1];

    if (request.method === "GET") {
      const item = getSubmissionById(id);
      if (!item) {
        return jsonResponse({ success: false, error: "Submission not found" }, 404);
      }
      return jsonResponse({ success: true, data: item });
    }

    if (request.method === "PATCH") {
      try {
        const body = (await request.json()) as Record<string, unknown>;
        const updated = updateSubmission(id, body);
        if (!updated) {
          return jsonResponse({ success: false, error: "Submission not found" }, 404);
        }
        return jsonResponse({
          success: true,
          data: updated,
          message: "Submission updated successfully",
        });
      } catch (err: unknown) {
        console.error("[API] Error updating submission:", err);
        return jsonResponse({ success: false, error: "Invalid request payload" }, 400);
      }
    }

    if (request.method === "DELETE") {
      const deleted = deleteSubmission(id);
      if (!deleted) {
        return jsonResponse({ success: false, error: "Submission not found" }, 404);
      }
      return jsonResponse({ success: true, message: "Submission deleted successfully" });
    }

    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  return jsonResponse({ success: false, error: "Not found" }, 404);
}
