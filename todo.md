# Septer CNAPP Website — Project Tasks & To-Do

Last Updated: November 20, 2026

---

## 📌 Remaining Action Items (Pending User Credentials)

- [ ] **Configure Google SMTP Credentials for Live Email Notifications**
  - [ ] Enable 2-Step Verification on your Google Account: [myaccount.google.com/security](https://myaccount.google.com/security)
  - [ ] Generate a 16-character App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
  - [ ] Add the credentials into `backend/.env`:
    ```ini
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=xxxx xxxx xxxx xxxx
    NOTIFICATION_EMAIL=your-inbox@company.com
    ```
  - [ ] Test outbound delivery using the Admin Console or by submitting a test lead at `http://localhost:8080/#demo`

---

## ✅ Completed Tasks

### 1. Database Architecture (PostgreSQL 16)
- [x] Connected to PostgreSQL 16 on port `5433` (matching the CNAPP platform container `cnapp-postgres`).
- [x] Created and initialized database `cnapp_website_db`.
- [x] Created `demo_submissions` schema with auto-migration and persistent storage.
- [x] Implemented database fallback logic for maximum resilience.

### 2. Architecture & Monorepo Decoupling
- [x] Decoupled codebase into clean `frontend/` and `backend/` directories.
- [x] Preserved root backwards-compatible symlinks (`src` and `public`) for seamless IDE navigation.
- [x] Configured monorepo scripts in root `package.json` for running, testing, and building both workspaces.

### 3. Backend API Service (`backend/`)
- [x] Built Express REST API service running on port `5005`.
- [x] Implemented endpoints:
  - `GET  /api/health` — PostgreSQL connection status & service health
  - `GET  /api/demo-requests` — All submissions and real-time conversion KPIs
  - `POST /api/demo-requests` — Lead intake with corporate email validation & priority scoring
  - `PATCH /api/demo-requests/:id` — Status triage (`new` → `contacted` → `qualified` → `demo_scheduled` → `closed`)
  - `DELETE /api/demo-requests/:id` — Lead record removal
  - `GET  /api/admin/stats` — Summary metrics
  - `GET  /api/admin/smtp-status` — SMTP readiness check
  - `POST /api/admin/reset` — Seed leads restoration
- [x] Implemented Nodemailer Gmail SMTP notification service with templated emails.

### 4. Frontend & Marketing Showcase (`frontend/`)
- [x] Configured Vite development proxy and dynamic server entry routing `/api/*` to `backend:5005`.
- [x] In-page anchor navigation: `#top`, `#platform`, `#multicloud`, `#how`, `#sidescan`, `#attack`, `#score`, `#secops`, `#compliance`, `#challenge`, `#demo`.
- [x] Interactive Demo Request Form at `#demo` with instant confirmation card.
- [x] Leads Admin Portal at `/admin` with live search, filters (status, priority, cloud), and status triage.
- [x] Branding: Pure Septer vector logo without shapes, boxes, or masks.
- [x] Removed "Admin Console" and "Access Admin Panel" links from public footer and marketing CTA.

### 5. Multi-Container Docker Stack
- [x] `backend/Dockerfile` (Alpine production runner compiling TypeScript via `esbuild`).
- [x] `frontend/Dockerfile` (Alpine production runner serving pre-rendered Nitro bundle).
- [x] `docker-compose.yml` orchestrating `septer-website-backend` (port `5006->5005`) and `septer-website-frontend` (port `8082->8080`).
- [x] Host PostgreSQL bridge integration via `host.docker.internal:5433`.
- [x] Verified both containers running and healthy.

### 6. Testing & Quality Assurance
- [x] 6/6 Backend API Vitest tests passing against live PostgreSQL database.
- [x] 14/14 Frontend routing, mobile navigation, and API integration Vitest tests passing.
- [x] Headless browser end-to-end integration test verified (form submission → PostgreSQL persistence → Admin UI rendering).

### 7. GitHub Synchronization
- [x] Remote repository connected: [github.com/debugwithvarun2/cnapp-website](https://github.com/debugwithvarun2/cnapp-website).
- [x] Clean commit history and branch `main` updated.
- [x] Sensitive files (`.env`, `node_modules`, build outputs) excluded via `.gitignore`.

---

## 🔮 Optional Future Enhancements

- [ ] Add GitHub Actions CI workflow (`.github/workflows/ci.yml`) for automated testing and Docker builds.
- [ ] Configure reverse proxy (Nginx / Caddy) with custom domain name and automatic Let's Encrypt SSL/TLS certificate.
- [ ] Implement role-based JWT authentication for `/admin` if required for multi-admin enterprise access.
