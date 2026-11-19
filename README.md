# Septer — Enterprise CNAPP Platform Marketing Site & Backend API

An enterprise marketing showcase and lead-capture platform for **Septer**, the unified Cloud-Native Application Protection Platform (CNAPP) covering CSPM, CWPP, CIEM, DSPM, AI-SPM, ASPM, CDR, and Graph-based Attack Paths across AWS, Azure, GCP, and Kubernetes.

---

## 🏗 Architecture Overview

The repository is organized into a clean decoupled structure:

```
cnapp_website/
├── frontend/                 # TanStack Start / React / Vite Marketing & Showcase App
│   ├── src/
│   │   ├── components/site/  # Landing page sections, hero, capabilities, interactive console
│   │   ├── routes/           # In-page anchor marketing site (/) and admin console (/admin)
│   │   └── server/           # SSR and proxy integration to backend API
│   ├── public/               # Brand assets (Septer pure vector logo, wordmark, favicon)
│   ├── Dockerfile            # Production web runner container (port 8080)
│   └── package.json
│
├── backend/                  # Dedicated Node.js & Express REST API Service
│   ├── src/
│   │   ├── config/database.ts# PostgreSQL 16 connection pool & automatic table migration
│   │   ├── controllers/      # Demo lead triage, submission handlers, and admin metrics
│   │   ├── routes/           # REST endpoints (/api/demo-requests, /api/admin/stats, etc.)
│   │   ├── services/         # Storage service (CRUD + stats) & Nodemailer Gmail SMTP
│   │   └── server.ts         # Express API Server (port 5005)
│   ├── Dockerfile            # Lean Alpine Node.js API container
│   ├── .env.example          # Sample environment variables for PostgreSQL & SMTP
│   └── package.json
│
├── docker-compose.yml        # Orchestrates PostgreSQL + Backend API + Frontend Showcase
└── package.json              # Monorepo root scripts for testing, building, and docker
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v20+ (Node 22 recommended)
- **PostgreSQL 16**: (default port `5433`, database `cnapp_website_db`, user `cnapp_admin`, matching the CNAPP Platform)
- **Docker**: (optional, for containerized deployment)

### 2. Environment Configuration
Create `backend/.env` (see `backend/.env.example`):

```ini
PORT=5005
DATABASE_URL=postgresql://cnapp_admin:SecureCnappPassword2026!@localhost:5433/cnapp_website_db
POSTGRES_USER=cnapp_admin
POSTGRES_PASSWORD=SecureCnappPassword2026!
POSTGRES_DB=cnapp_website_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5433

# Optional: Google App Password for outbound SMTP notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM="Septer Security Team <no-reply@septer.io>"
NOTIFICATION_EMAIL=leads@yourcompany.com
```

### 3. Local Development

Run both the backend API and frontend marketing site simultaneously from the root:

```bash
# Install root and workspace dependencies
npm install

# Run backend (port 5005) and frontend (port 8080) concurrently
npm run dev
```

Or run them individually:

```bash
# Terminal 1: Backend API
cd backend && npm run dev

# Terminal 2: Frontend Showcase
cd frontend && npm run dev
```

- **Marketing Website**: [http://localhost:8080/](http://localhost:8080/)
- **Leads Admin Dashboard**: [http://localhost:8080/admin](http://localhost:8080/admin)
- **Backend API Health Check**: [http://localhost:5005/api/health](http://localhost:5005/api/health)

---

## 🧪 Testing

Run comprehensive automated test suites across both backend and frontend:

```bash
# Run all tests (Vitest)
npm run test

# Run backend API & PostgreSQL tests only
npm run test:backend

# Run frontend UI, routing, and navigation tests only
npm run test:frontend
```

---

## 🐳 Docker Deployment

Deploy the entire stack with Docker Compose:

```bash
# Build and run containers in background
npm run docker:up

# View running container status
docker compose ps

# View real-time logs
docker compose logs -f

# Stop and remove containers
npm run docker:down
```

- **Frontend Container**: `septer-website-frontend` exposed on port `8080` (or `${PORT:-8082}`)
- **Backend Container**: `septer-website-backend` exposed on port `5005`
- **Database**: Automatically links to the host PostgreSQL 16 via `host.docker.internal:5433`

---

## 🔒 Security & Data Persistence

- All demo lead submissions are strictly persisted in the PostgreSQL 16 `demo_submissions` table.
- Credentials and environment secrets are excluded from source control (`.gitignore`).
- When SMTP is unconfigured or offline, submissions are reliably stored in PostgreSQL with graceful notification fallback.
