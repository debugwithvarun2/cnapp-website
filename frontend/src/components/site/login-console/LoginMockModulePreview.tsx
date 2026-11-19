/**
 * Populated sample views for login showcase tabs (not empty connect states).
 * Curated demo data only — no live API calls.
 */
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "./navigation";

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO" | "PASS";

type MockRow = {
  id: string;
  title: string;
  subtitle: string;
  provider?: string;
  severity: Severity;
  meta: string;
};

type ModulePack = {
  kpis: Array<{ label: string; value: string; hint?: string; tone?: "ok" | "warn" | "bad" }>;
  columns: [string, string, string, string];
  rows: MockRow[];
  footnote: string;
};

const SEVERITY_CLASS: Record<Severity, string> = {
  CRITICAL: "border-[#E35D62]/35 bg-[#E35D62]/15 text-[#E35D62]",
  HIGH: "border-amber-500/35 bg-amber-500/15 text-amber-400",
  MEDIUM: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  LOW: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  INFO: "border-[var(--border-default)] bg-[var(--surface-secondary)] text-[var(--text-muted)]",
  PASS: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

function resolveNavMeta(href: string) {
  let label = href;
  let section = "Platform";
  for (const s of NAV_SECTIONS) {
    const item = s.items.find((i) => i.href === href);
    if (item) {
      label = item.label;
      section = s.title;
      break;
    }
  }
  return { label, section };
}

const PACKS: Record<string, ModulePack> = {
  "/security-score": {
    kpis: [
      { label: "Posture index", value: "78", hint: "GOOD", tone: "ok" },
      { label: "Control gaps", value: "23", hint: "open", tone: "warn" },
      { label: "Passing controls", value: "146", hint: "of 169" },
      { label: "Trend 7d", value: "+4", hint: "improved", tone: "ok" },
    ],
    columns: ["Control domain", "Signal", "Score", "Owner"],
    rows: [
      {
        id: "1",
        title: "Public storage exposure",
        subtitle: "CSPM · S3 / Blob / GCS",
        severity: "CRITICAL",
        meta: "42 → 72",
        provider: "AWS",
      },
      {
        id: "2",
        title: "Admin role hygiene",
        subtitle: "CIEM · standing privileges",
        severity: "HIGH",
        meta: "51 → 68",
        provider: "Azure",
      },
      {
        id: "3",
        title: "CVE backlog (KEV)",
        subtitle: "CWPP · patch SLA",
        severity: "HIGH",
        meta: "58 → 61",
        provider: "GCP",
      },
      {
        id: "4",
        title: "Encryption at rest",
        subtitle: "DSPM · key coverage",
        severity: "PASS",
        meta: "81 / 100",
        provider: "Multi",
      },
      {
        id: "5",
        title: "Network exposure",
        subtitle: "Security groups / NSG",
        severity: "MEDIUM",
        meta: "74 / 100",
        provider: "AWS",
      },
    ],
    footnote: "Sample posture domains after a completed multi-cloud assessment.",
  },
  "/compliance": {
    kpis: [
      { label: "Frameworks", value: "4", hint: "active" },
      { label: "Passing", value: "78%", hint: "controls", tone: "ok" },
      { label: "Gaps", value: "19", hint: "remediate", tone: "warn" },
      { label: "Evidence packs", value: "12", hint: "ready" },
    ],
    columns: ["Framework", "Scope", "Status", "Updated"],
    rows: [
      {
        id: "1",
        title: "CIS AWS Foundations v3",
        subtitle: "6 accounts · 214 checks",
        severity: "MEDIUM",
        meta: "81% pass",
        provider: "AWS",
      },
      {
        id: "2",
        title: "CIS Azure Foundations",
        subtitle: "2 subscriptions",
        severity: "HIGH",
        meta: "69% pass",
        provider: "Azure",
      },
      {
        id: "3",
        title: "CIS GCP Foundations",
        subtitle: "3 projects",
        severity: "PASS",
        meta: "88% pass",
        provider: "GCP",
      },
      {
        id: "4",
        title: "SOC 2 Trust Criteria",
        subtitle: "Security · Availability",
        severity: "MEDIUM",
        meta: "74% pass",
        provider: "Multi",
      },
      {
        id: "5",
        title: "ISO 27001 Annex A",
        subtitle: "Mapped controls",
        severity: "PASS",
        meta: "91% pass",
        provider: "Multi",
      },
    ],
    footnote: "Sample compliance assessments with mapped cloud controls.",
  },
  "/assets": {
    kpis: [
      { label: "Assets", value: "1,842", hint: "monitored" },
      { label: "Critical", value: "14", hint: "urgent", tone: "bad" },
      { label: "Internet-facing", value: "96", hint: "exposed", tone: "warn" },
      { label: "Providers", value: "3", hint: "AWS · Azure · GCP" },
    ],
    columns: ["Asset", "Type", "Risk", "Region"],
    rows: [
      {
        id: "1",
        title: "customer-exports",
        subtitle: "s3 · prod-data",
        severity: "CRITICAL",
        meta: "us-east-1",
        provider: "AWS",
      },
      {
        id: "2",
        title: "pay-api-prod",
        subtitle: "EC2 · t3.large",
        severity: "HIGH",
        meta: "us-west-2",
        provider: "AWS",
      },
      {
        id: "3",
        title: "crm-sql-flex",
        subtitle: "Azure SQL",
        severity: "HIGH",
        meta: "eastus",
        provider: "Azure",
      },
      {
        id: "4",
        title: "ml-training-bucket",
        subtitle: "GCS · notebooks",
        severity: "MEDIUM",
        meta: "us-central1",
        provider: "GCP",
      },
      {
        id: "5",
        title: "eks-payments",
        subtitle: "EKS cluster",
        severity: "MEDIUM",
        meta: "eu-west-1",
        provider: "AWS",
      },
    ],
    footnote: "Sample multi-cloud inventory after discovery finishes.",
  },
  "/vulnerabilities": {
    kpis: [
      { label: "Open CVEs", value: "312", hint: "across images" },
      { label: "Critical", value: "18", hint: "KEV overlap", tone: "bad" },
      { label: "Images", value: "86", hint: "scanned" },
      { label: "SLA breach", value: "7", hint: ">14d", tone: "warn" },
    ],
    columns: ["Finding", "Package", "Severity", "Age"],
    rows: [
      {
        id: "1",
        title: "CVE-2024-3094",
        subtitle: "payments/api:1.14.2",
        severity: "CRITICAL",
        meta: "3d",
        provider: "AWS",
      },
      {
        id: "2",
        title: "CVE-2023-44487",
        subtitle: "edge-proxy:2.1.0",
        severity: "HIGH",
        meta: "9d",
        provider: "GCP",
      },
      {
        id: "3",
        title: "CVE-2024-21626",
        subtitle: "runner-base:1.8",
        severity: "HIGH",
        meta: "12d",
        provider: "Azure",
      },
      {
        id: "4",
        title: "CVE-2022-22965",
        subtitle: "billing-svc:3.2",
        severity: "MEDIUM",
        meta: "21d",
        provider: "AWS",
      },
      {
        id: "5",
        title: "CVE-2021-44228",
        subtitle: "legacy-batch:0.9",
        severity: "CRITICAL",
        meta: "41d",
        provider: "AWS",
      },
    ],
    footnote: "Sample vulnerability backlog correlated to container images.",
  },
  "/ciem": {
    kpis: [
      { label: "Identities", value: "428", hint: "human + machine" },
      { label: "Toxic combos", value: "11", hint: "urgent", tone: "bad" },
      { label: "Unused admins", value: "27", hint: "30d idle", tone: "warn" },
      { label: "Least-priv ready", value: "64", hint: "plans" },
    ],
    columns: ["Identity", "Access", "Risk", "Last used"],
    rows: [
      {
        id: "1",
        title: "ci-deployer",
        subtitle: "IAM role · AdministratorAccess",
        severity: "CRITICAL",
        meta: "14d idle",
        provider: "AWS",
      },
      {
        id: "2",
        title: "sec-admin@globalcorp.com",
        subtitle: "Entra ID · Global Admin",
        severity: "HIGH",
        meta: "2h ago",
        provider: "Azure",
      },
      {
        id: "3",
        title: "etl-sa-prod",
        subtitle: "GCP SA · roles/owner",
        severity: "HIGH",
        meta: "6d idle",
        provider: "GCP",
      },
      {
        id: "4",
        title: "readonly-auditor",
        subtitle: "IAM user · SecurityAudit",
        severity: "PASS",
        meta: "1d ago",
        provider: "AWS",
      },
      {
        id: "5",
        title: "k8s-node-role",
        subtitle: "IRSA · broad S3 *",
        severity: "MEDIUM",
        meta: "active",
        provider: "AWS",
      },
    ],
    footnote: "Sample effective-access and entitlement risk for CIEM.",
  },
  "/attack-paths": {
    kpis: [
      { label: "Open paths", value: "9", hint: "graphable", tone: "bad" },
      { label: "Blast radius", value: "214", hint: "assets" },
      { label: "Internet entry", value: "4", hint: "edges", tone: "warn" },
      { label: "Crown jewels", value: "3", hint: "reachable" },
    ],
    columns: ["Path", "Chain", "Severity", "Steps"],
    rows: [
      {
        id: "1",
        title: "Internet → S3 PII",
        subtitle: "ALB → EC2 → role → bucket",
        severity: "CRITICAL",
        meta: "4 hops",
        provider: "AWS",
      },
      {
        id: "2",
        title: "Public NSG → SQL",
        subtitle: "NSG 3389 → VM → SQL flex",
        severity: "CRITICAL",
        meta: "3 hops",
        provider: "Azure",
      },
      {
        id: "3",
        title: "SA key → BigQuery",
        subtitle: "exposed key → dataset",
        severity: "HIGH",
        meta: "2 hops",
        provider: "GCP",
      },
      {
        id: "4",
        title: "CI admin → prod EKS",
        subtitle: "OIDC role → cluster-admin",
        severity: "HIGH",
        meta: "3 hops",
        provider: "AWS",
      },
      {
        id: "5",
        title: "Dev VPC peer → payments",
        subtitle: "peering · lateral move",
        severity: "MEDIUM",
        meta: "5 hops",
        provider: "Multi",
      },
    ],
    footnote: "Sample toxic attack paths linking exposure to sensitive data.",
  },
  "/cloud": {
    kpis: [
      { label: "Accounts", value: "6", hint: "connected", tone: "ok" },
      { label: "AWS", value: "3", hint: "org units" },
      { label: "Azure", value: "2", hint: "subscriptions" },
      { label: "GCP", value: "1", hint: "projects" },
    ],
    columns: ["Account", "Provider", "Status", "Last sync"],
    rows: [
      {
        id: "1",
        title: "acme-prod (221988441122)",
        subtitle: "Organization · us-east-1 home",
        severity: "PASS",
        meta: "4m ago",
        provider: "AWS",
      },
      {
        id: "2",
        title: "acme-security",
        subtitle: "Log archive · Security Hub",
        severity: "PASS",
        meta: "4m ago",
        provider: "AWS",
      },
      {
        id: "3",
        title: "Contoso Prod",
        subtitle: "Subscription · eastus",
        severity: "PASS",
        meta: "7m ago",
        provider: "Azure",
      },
      {
        id: "4",
        title: "Contoso Shared",
        subtitle: "Subscription · westeurope",
        severity: "MEDIUM",
        meta: "permission lag",
        provider: "Azure",
      },
      {
        id: "5",
        title: "acme-analytics",
        subtitle: "GCP project · us-central1",
        severity: "PASS",
        meta: "9m ago",
        provider: "GCP",
      },
    ],
    footnote: "Sample connected cloud accounts after onboarding.",
  },
  "/findings": {
    kpis: [
      { label: "Open findings", value: "128", hint: "posture" },
      { label: "Critical", value: "14", hint: "urgent", tone: "bad" },
      { label: "High", value: "31", hint: "priority", tone: "warn" },
      { label: "Auto-fixable", value: "22", hint: "playbooks" },
    ],
    columns: ["Finding", "Resource", "Severity", "Age"],
    rows: [
      {
        id: "1",
        title: "S3 public ACL",
        subtitle: "customer-exports",
        severity: "CRITICAL",
        meta: "2d",
        provider: "AWS",
      },
      {
        id: "2",
        title: "SSH open to world",
        subtitle: "sg-prod-bastion",
        severity: "CRITICAL",
        meta: "5d",
        provider: "AWS",
      },
      {
        id: "3",
        title: "Disk not encrypted",
        subtitle: "vm-payments-01",
        severity: "HIGH",
        meta: "8d",
        provider: "Azure",
      },
      {
        id: "4",
        title: "SA user-managed keys",
        subtitle: "etl-sa-prod",
        severity: "HIGH",
        meta: "11d",
        provider: "GCP",
      },
      {
        id: "5",
        title: "CloudTrail not multi-region",
        subtitle: "acme-prod",
        severity: "MEDIUM",
        meta: "16d",
        provider: "AWS",
      },
    ],
    footnote: "Sample CSPM misconfiguration queue with severity triage.",
  },
  "/policies": {
    kpis: [
      { label: "Policies", value: "186", hint: "enabled" },
      { label: "Failing", value: "41", hint: "drift", tone: "warn" },
      { label: "Critical rules", value: "12", hint: "P0", tone: "bad" },
      { label: "Coverage", value: "94%", hint: "assets", tone: "ok" },
    ],
    columns: ["Policy", "Category", "Result", "Hits"],
    rows: [
      {
        id: "1",
        title: "Deny public S3",
        subtitle: "Storage · CIS 2.1.5",
        severity: "CRITICAL",
        meta: "6 fails",
        provider: "AWS",
      },
      {
        id: "2",
        title: "Require MFA delete",
        subtitle: "Storage",
        severity: "HIGH",
        meta: "3 fails",
        provider: "AWS",
      },
      {
        id: "3",
        title: "Restrict 0.0.0.0/0 SSH",
        subtitle: "Network",
        severity: "CRITICAL",
        meta: "2 fails",
        provider: "Multi",
      },
      {
        id: "4",
        title: "Encrypt managed disks",
        subtitle: "Compute",
        severity: "HIGH",
        meta: "9 fails",
        provider: "Azure",
      },
      {
        id: "5",
        title: "Disable SA key creation",
        subtitle: "Identity",
        severity: "MEDIUM",
        meta: "4 fails",
        provider: "GCP",
      },
    ],
    footnote: "Sample policy catalog results after assessment.",
  },
  "/dspm": {
    kpis: [
      { label: "Data stores", value: "64", hint: "classified" },
      { label: "Sensitive", value: "19", hint: "PII/PCI", tone: "warn" },
      { label: "Public + sensitive", value: "2", hint: "urgent", tone: "bad" },
      { label: "Encrypted", value: "81%", hint: "at rest", tone: "ok" },
    ],
    columns: ["Store", "Class", "Risk", "Access"],
    rows: [
      {
        id: "1",
        title: "customer-exports",
        subtitle: "S3 · PII exports",
        severity: "CRITICAL",
        meta: "public ACL",
        provider: "AWS",
      },
      {
        id: "2",
        title: "crm-sql-flex",
        subtitle: "Azure SQL · PCI",
        severity: "HIGH",
        meta: "3 wide grants",
        provider: "Azure",
      },
      {
        id: "3",
        title: "ml-training-bucket",
        subtitle: "GCS · training PII",
        severity: "HIGH",
        meta: "SA owner",
        provider: "GCP",
      },
      {
        id: "4",
        title: "payments-rds",
        subtitle: "RDS · card tokens",
        severity: "MEDIUM",
        meta: "private",
        provider: "AWS",
      },
      {
        id: "5",
        title: "hr-archive",
        subtitle: "Blob · employee PII",
        severity: "PASS",
        meta: "encrypted",
        provider: "Azure",
      },
    ],
    footnote: "Sample DSPM classification and exposure correlation.",
  },
  "/containers": {
    kpis: [
      { label: "Images", value: "86", hint: "registry" },
      { label: "Critical CVEs", value: "18", hint: "open", tone: "bad" },
      { label: "Clusters", value: "4", hint: "linked" },
      { label: "Unsigned", value: "11", hint: "images", tone: "warn" },
    ],
    columns: ["Image", "Registry", "Severity", "CVEs"],
    rows: [
      {
        id: "1",
        title: "payments/api:1.14.2",
        subtitle: "ECR · prod",
        severity: "CRITICAL",
        meta: "12 open",
        provider: "AWS",
      },
      {
        id: "2",
        title: "edge-proxy:2.1.0",
        subtitle: "GCR · edge",
        severity: "HIGH",
        meta: "7 open",
        provider: "GCP",
      },
      {
        id: "3",
        title: "runner-base:1.8",
        subtitle: "ACR · ci",
        severity: "HIGH",
        meta: "9 open",
        provider: "Azure",
      },
      {
        id: "4",
        title: "web-frontend:5.2",
        subtitle: "ECR · prod",
        severity: "MEDIUM",
        meta: "4 open",
        provider: "AWS",
      },
      {
        id: "5",
        title: "batch-worker:0.9",
        subtitle: "ECR · legacy",
        severity: "CRITICAL",
        meta: "15 open",
        provider: "AWS",
      },
    ],
    footnote: "Sample container image risk after registry scans.",
  },
  "/kubernetes": {
    kpis: [
      { label: "Clusters", value: "4", hint: "monitored" },
      { label: "Findings", value: "37", hint: "open", tone: "warn" },
      { label: "Privileged pods", value: "5", hint: "urgent", tone: "bad" },
      { label: "Namespaces", value: "28", hint: "in scope" },
    ],
    columns: ["Finding", "Cluster", "Severity", "NS"],
    rows: [
      {
        id: "1",
        title: "Privileged container",
        subtitle: "eks-payments",
        severity: "CRITICAL",
        meta: "payments",
        provider: "AWS",
      },
      {
        id: "2",
        title: "HostPath mount",
        subtitle: "aks-shared",
        severity: "HIGH",
        meta: "platform",
        provider: "Azure",
      },
      {
        id: "3",
        title: "Cluster-admin binding",
        subtitle: "gke-analytics",
        severity: "HIGH",
        meta: "kube-system",
        provider: "GCP",
      },
      {
        id: "4",
        title: "No network policy",
        subtitle: "eks-payments",
        severity: "MEDIUM",
        meta: "default",
        provider: "AWS",
      },
      {
        id: "5",
        title: "Secrets as env vars",
        subtitle: "aks-shared",
        severity: "MEDIUM",
        meta: "apps",
        provider: "Azure",
      },
    ],
    footnote: "Sample Kubernetes posture findings across clusters.",
  },
  "/runtime": {
    kpis: [
      { label: "Threats 24h", value: "6", hint: "detected", tone: "warn" },
      { label: "Critical", value: "1", hint: "active", tone: "bad" },
      { label: "Processes", value: "1.2k", hint: "observed" },
      { label: "Blocked", value: "3", hint: "actions", tone: "ok" },
    ],
    columns: ["Event", "Workload", "Severity", "When"],
    rows: [
      {
        id: "1",
        title: "Crypto-miner pattern",
        subtitle: "payments-api-7f2",
        severity: "CRITICAL",
        meta: "12m ago",
        provider: "AWS",
      },
      {
        id: "2",
        title: "Unexpected reverse shell",
        subtitle: "batch-worker-3",
        severity: "HIGH",
        meta: "41m ago",
        provider: "AWS",
      },
      {
        id: "3",
        title: "Sensitive file read",
        subtitle: "etl-job-19",
        severity: "HIGH",
        meta: "2h ago",
        provider: "GCP",
      },
      {
        id: "4",
        title: "Privilege escalation attempt",
        subtitle: "web-frontend-2",
        severity: "MEDIUM",
        meta: "5h ago",
        provider: "Azure",
      },
      {
        id: "5",
        title: "Anomalous DNS egress",
        subtitle: "edge-proxy-1",
        severity: "MEDIUM",
        meta: "8h ago",
        provider: "GCP",
      },
    ],
    footnote: "Sample runtime detections from workload sensors.",
  },
  "/alerts": {
    kpis: [
      { label: "Open alerts", value: "17", hint: "queue" },
      { label: "P1", value: "3", hint: "urgent", tone: "bad" },
      { label: "Tickets", value: "8", hint: "linked" },
      { label: "MTTR", value: "6.4h", hint: "7d avg", tone: "ok" },
    ],
    columns: ["Alert", "Source", "Severity", "Age"],
    rows: [
      {
        id: "1",
        title: "Public bucket with PII",
        subtitle: "DSPM correlation",
        severity: "CRITICAL",
        meta: "34m",
        provider: "AWS",
      },
      {
        id: "2",
        title: "Admin role unused 14d",
        subtitle: "CIEM",
        severity: "HIGH",
        meta: "2h",
        provider: "AWS",
      },
      {
        id: "3",
        title: "KEV CVE on prod image",
        subtitle: "CWPP",
        severity: "HIGH",
        meta: "5h",
        provider: "Multi",
      },
      {
        id: "4",
        title: "Failed compliance control",
        subtitle: "CIS AWS 1.4",
        severity: "MEDIUM",
        meta: "1d",
        provider: "AWS",
      },
      {
        id: "5",
        title: "New internet exposure",
        subtitle: "IP scanner",
        severity: "MEDIUM",
        meta: "1d",
        provider: "Azure",
      },
    ],
    footnote: "Sample operations alert queue with ticket correlation.",
  },
  "/reports": {
    kpis: [
      { label: "Reports", value: "24", hint: "library" },
      { label: "Scheduled", value: "6", hint: "weekly" },
      { label: "Exports 7d", value: "11", hint: "PDF/CSV" },
      { label: "Recipients", value: "18", hint: "stakeholders" },
    ],
    columns: ["Report", "Type", "Status", "Last run"],
    rows: [
      {
        id: "1",
        title: "Executive posture brief",
        subtitle: "Board pack",
        severity: "PASS",
        meta: "Today 06:00",
        provider: "Multi",
      },
      {
        id: "2",
        title: "CIS AWS evidence",
        subtitle: "Compliance export",
        severity: "PASS",
        meta: "Yesterday",
        provider: "AWS",
      },
      {
        id: "3",
        title: "Vulnerability SLA",
        subtitle: "CWPP backlog",
        severity: "HIGH",
        meta: "2d ago",
        provider: "Multi",
      },
      {
        id: "4",
        title: "Identity risk digest",
        subtitle: "CIEM weekly",
        severity: "MEDIUM",
        meta: "3d ago",
        provider: "Multi",
      },
      {
        id: "5",
        title: "DSPM sensitive inventory",
        subtitle: "Data owners",
        severity: "PASS",
        meta: "5d ago",
        provider: "Multi",
      },
    ],
    footnote: "Sample report library after scheduled generation.",
  },
  "/billing": {
    kpis: [
      { label: "Plan", value: "Standard", hint: "active", tone: "ok" },
      { label: "Cloud accounts", value: "6 / 10", hint: "OK" },
      { label: "Assets", value: "3.8k / 5k", hint: "High", tone: "warn" },
      { label: "Seats", value: "18 / 50", hint: "OK" },
    ],
    columns: ["Meter", "Used", "Status", "Soft limit"],
    rows: [
      {
        id: "1",
        title: "cloud_accounts",
        subtitle: "Connected providers",
        severity: "PASS",
        meta: "soft 8",
        provider: "Multi",
      },
      {
        id: "2",
        title: "assets",
        subtitle: "Inventoried resources",
        severity: "MEDIUM",
        meta: "soft 4,000",
        provider: "Multi",
      },
      {
        id: "3",
        title: "seats",
        subtitle: "Active users",
        severity: "PASS",
        meta: "soft 40",
        provider: "Multi",
      },
      {
        id: "4",
        title: "scans_day",
        subtitle: "UTC day window",
        severity: "HIGH",
        meta: "soft 80",
        provider: "Multi",
      },
      {
        id: "5",
        title: "api_calls_day",
        subtitle: "Metered API",
        severity: "HIGH",
        meta: "soft 40k",
        provider: "Multi",
      },
    ],
    footnote: "Sample Billing & usage meters for a Standard plan tenant.",
  },
};

const FALLBACK: ModulePack = {
  kpis: [
    { label: "Signals", value: "128", hint: "open" },
    { label: "Critical", value: "14", hint: "urgent", tone: "bad" },
    { label: "Accounts", value: "6", hint: "linked" },
    { label: "Coverage", value: "94%", hint: "assets", tone: "ok" },
  ],
  columns: ["Item", "Context", "Severity", "Detail"],
  rows: [
    {
      id: "1",
      title: "High-risk exposure",
      subtitle: "Internet-facing asset",
      severity: "CRITICAL",
      meta: "triage",
      provider: "AWS",
    },
    {
      id: "2",
      title: "Identity drift",
      subtitle: "Standing admin",
      severity: "HIGH",
      meta: "review",
      provider: "Azure",
    },
    {
      id: "3",
      title: "CVE backlog",
      subtitle: "Prod image",
      severity: "HIGH",
      meta: "patch",
      provider: "GCP",
    },
    {
      id: "4",
      title: "Policy drift",
      subtitle: "Encryption control",
      severity: "MEDIUM",
      meta: "fix",
      provider: "Multi",
    },
    {
      id: "5",
      title: "Compliant control",
      subtitle: "Logging enabled",
      severity: "PASS",
      meta: "ok",
      provider: "Multi",
    },
  ],
  footnote: "Sample operational view after cloud accounts are connected.",
};

function packFor(href: string): ModulePack {
  if (PACKS[href]) return PACKS[href]!;
  if (href.startsWith("/vulnerabilities") || href === "/sbom") return PACKS["/vulnerabilities"]!;
  if (href === "/compute" || href === "/side-scan") return PACKS["/containers"]!;
  if (href === "/ip-scanner") return PACKS["/findings"]!;
  if (href === "/mitre" || href === "/cdr") return PACKS["/attack-paths"]!;
  if (
    href === "/api-security" ||
    href === "/shift-left" ||
    href === "/iac-secrets" ||
    href === "/ai-spm"
  )
    return PACKS["/vulnerabilities"]!;
  if (
    href === "/soar" ||
    href === "/remediation" ||
    href === "/assistant" ||
    href === "/notifications"
  )
    return PACKS["/alerts"]!;
  if (href === "/users" || href === "/roles" || href === "/organization" || href === "/partner")
    return PACKS["/cloud"]!;
  if (href === "/audit") return PACKS["/reports"]!;
  return FALLBACK;
}

export function LoginMockModulePreview({ href }: { href: string }) {
  const { label, section } = resolveNavMeta(href);
  const pack = packFor(href);

  return (
    <div className="flex min-h-[440px] flex-col gap-3 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {section}
          </p>
          <h2 className="font-heading text-lg font-bold tracking-[-0.02em] text-[var(--text-primary)]">
            {label}
          </h2>
          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{pack.footnote}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-border)] bg-[var(--brand-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--brand-primary)]">
            Sample
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Data populated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {pack.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-[8px] border border-[var(--border-default)] bg-[var(--surface)] px-3 py-2.5"
          >
            <p className="font-mono text-[9px] uppercase tracking-wide text-[var(--text-muted)]">
              {kpi.label}
            </p>
            <p
              className={cn(
                "mt-1 font-mono text-xl font-bold tabular-nums text-[var(--text-primary)]",
                kpi.tone === "bad" && "text-[#E35D62]",
                kpi.tone === "warn" && "text-amber-400",
                kpi.tone === "ok" && "text-emerald-400",
              )}
            >
              {kpi.value}
            </p>
            {kpi.hint && <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">{kpi.hint}</p>}
          </div>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[8px] border border-[var(--border-default)] bg-[var(--surface)]">
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_88px_88px] gap-2 border-b border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2">
          {pack.columns.map((c) => (
            <p
              key={c}
              className="font-mono text-[9px] font-semibold uppercase tracking-wide text-[var(--text-muted)]"
            >
              {c}
            </p>
          ))}
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {pack.rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_88px_88px] items-center gap-2 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-[var(--text-primary)]">
                  {row.title}
                </p>
                <p className="truncate text-[10px] text-[var(--text-muted)]">{row.subtitle}</p>
              </div>
              <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                {row.provider && (
                  <span className="rounded border border-[var(--border-default)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)]">
                    {row.provider}
                  </span>
                )}
                <span className="truncate">{row.subtitle.split("·")[0]}</span>
              </div>
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1 rounded-[4px] border px-1.5 py-0.5 font-mono text-[9px] font-semibold",
                  SEVERITY_CLASS[row.severity],
                )}
              >
                {row.severity === "CRITICAL" || row.severity === "HIGH" ? (
                  <ShieldAlert className="h-2.5 w-2.5" />
                ) : row.severity === "PASS" ? (
                  <CheckCircle2 className="h-2.5 w-2.5" />
                ) : (
                  <AlertTriangle className="h-2.5 w-2.5" />
                )}
                {row.severity}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)]">
                <Clock3 className="h-3 w-3" />
                {row.meta}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-[10px] text-[var(--text-muted)]">
        <span>Showcase preview · sample estate · not live tenant data</span>
        <span className="inline-flex items-center gap-1 text-[var(--brand-primary)]">
          Open after sign-in
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}
