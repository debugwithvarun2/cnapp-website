import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

import { createJiti } from "jiti";

const marketingRoot = path.dirname(fileURLToPath(import.meta.url));
const marketingSrc = path.join(marketingRoot, "src");
const cnappFrontendRoot = path.resolve(marketingRoot, "../../CNAPP/frontend");
const cnappSrc = path.join(cnappFrontendRoot, "src");
const jiti = createJiti(import.meta.url);

const SOURCE_EXTS = [".tsx", ".ts", ".jsx", ".js", ".mjs", ".css"];

function resolveWithExtensions(basePath: string): string | null {
  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) {
    return basePath;
  }
  for (const ext of SOURCE_EXTS) {
    const candidate = basePath + ext;
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  for (const ext of SOURCE_EXTS) {
    const candidate = path.join(basePath, `index${ext}`);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function isCnappSourceImporter(importer?: string): boolean {
  if (!importer) return false;
  const normalized = importer.replace(/\\/g, "/");
  return normalized.includes("CNAPP/frontend/src");
}

function isMarketingSourceImporter(importer?: string): boolean {
  if (!importer) return false;
  const normalized = importer.replace(/\\/g, "/");
  return (
    normalized.includes("cnapp_website/src") ||
    normalized.includes("cnapp-website/src") ||
    normalized.includes("frontend/src")
  );
}

/** Resolves `@cnapp/*` into CNAPP src; `@/` from CNAPP importers stays on product src (not marketing). */
function cnappBridgePlugin(): Plugin {
  return {
    name: "cnapp-bridge",
    enforce: "pre",
    resolveId(source, importer) {
      const id = source.split("?")[0] ?? source;

      if (id.startsWith("@cnapp/")) {
        const sub = id.slice("@cnapp/".length);
        const base = path.join(cnappSrc, sub);
        return resolveWithExtensions(base) ?? base;
      }

      if (id.startsWith("@/")) {
        if (isCnappSourceImporter(importer)) {
          const base = path.join(cnappSrc, id.slice(2));
          return resolveWithExtensions(base) ?? base;
        }
        if (isMarketingSourceImporter(importer)) {
          const base = path.join(marketingSrc, id.slice(2));
          return resolveWithExtensions(base) ?? base;
        }
      }

      return null;
    },
  };
}

const BACKEND_URL = process.env.BACKEND_URL || process.env.VITE_BACKEND_URL || "http://localhost:5005";

function apiDevPlugin(): Plugin {
  return {
    name: "api-dev-server",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) {
          return next();
        }

        // Try forwarding directly to the dedicated backend service
        try {
          const targetUrl = `${BACKEND_URL}${req.url}`;
          const headers: Record<string, string> = {};
          for (const [key, value] of Object.entries(req.headers)) {
            if (value && typeof value === "string") {
              headers[key] = value;
            }
          }
          headers["host"] = new URL(BACKEND_URL).host;

          let bodyBuffer: Buffer | undefined;
          if (req.method !== "GET" && req.method !== "HEAD") {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
            }
            bodyBuffer = Buffer.concat(chunks);
          }

          const backendResponse = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: bodyBuffer && bodyBuffer.length > 0 ? bodyBuffer : undefined,
          });

          res.statusCode = backendResponse.status;
          backendResponse.headers.forEach((val, key) => {
            res.setHeader(key, val);
          });

          const data = await backendResponse.arrayBuffer();
          res.end(Buffer.from(data));
          return;
        } catch (backendErr) {
          // Fall back to local handler if backend is starting up or in standalone mode
        }

        try {
          const { handleApiRequest } = (await jiti.import("./src/server/api.ts")) as {
            handleApiRequest: (req: Request) => Promise<Response | null>;
          };
          const protocol = (req.headers["x-forwarded-proto"] as string) || "http";
          const host = req.headers.host || "localhost:8080";
          const fullUrl = `${protocol}://${host}${req.url}`;

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value) {
              if (Array.isArray(value)) {
                for (const v of value) headers.append(key, v);
              } else {
                headers.set(key, value);
              }
            }
          }

          let body: Buffer | null = null;
          if (req.method !== "GET" && req.method !== "HEAD") {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
            }
            body = Buffer.concat(chunks);
          }

          const webRequest = new Request(fullUrl, {
            method: req.method,
            headers,
            body: body && body.length > 0 ? body : undefined,
            // @ts-expect-error duplex required for body stream in node fetch
            duplex: "half",
          });

          const webResponse = await handleApiRequest(webRequest);
          if (!webResponse) {
            return next();
          }

          res.statusCode = webResponse.status;
          webResponse.headers.forEach((val: string, key: string) => {
            res.setHeader(key, val);
          });

          const responseText = await webResponse.text();
          res.end(responseText);
        } catch (error) {
          console.error("[apiDevPlugin] Error:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: false, error: "Internal server error" }));
        }
      });
    },
  };
}

export default defineConfig({
  server: {
    host: true,
    port: 8080,
    strictPort: true,
    fs: {
      allow: [marketingRoot, cnappFrontendRoot, path.resolve(marketingRoot, "..")],
    },
  },
  resolve: {
    tsconfigPaths: false,
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-query",
      "react-router-dom",
    ],
  },
  plugins: [
    apiDevPlugin(),
    cnappBridgePlugin(),
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
    tailwindcss(),
    nitro(),
  ],
});
