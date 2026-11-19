/** Illustrative demo data mirrored from Septer login showcase fixtures */

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export const DEMO = {
  totalAssets: 1842,
  totalCloudAccounts: 6,
  criticalAssets: 14,
  highAssets: 31,
  postureScore: 78,
  findingCount: 128,
  providers: [
    { provider: "AWS", label: "AWS", count: 982, color: "#1e40af" },
    { provider: "AZURE", label: "Azure", count: 514, color: "#1d4ed8" },
    { provider: "GCP", label: "GCP", count: 346, color: "#10b981" },
  ],
  pillars: [
    { k: "CSPM & Cloud Misconfigurations (128 issues)", v: 72, color: "var(--cs-sev-low)" },
    { k: "CIEM Identity & Entitlements (2 excess roles)", v: 68, color: "var(--cs-violet)" },
    { k: "Vulnerability Management & CVEs (5 active)", v: 61, color: "var(--cs-sev-medium)" },
    { k: "Container & Microservice Security (5 exposed)", v: 74, color: "var(--cs-brand)" },
    { k: "Data Governance & Encryption (14 unencrypted)", v: 81, color: "var(--cs-sev-high)" },
  ],
  news: [
    {
      source: "The Hacker News",
      ago: "12m ago",
      title: "Critical cloud IAM misconfiguration campaigns surge across multi-account orgs",
    },
    {
      source: "CISA Alerts",
      ago: "2h ago",
      title: "CISA adds new KEV entries for widely exploited container runtime flaws",
    },
    {
      source: "CyberMonitum",
      ago: "4h ago",
      title: "Leaked credentials remain a top enterprise breach vector this quarter",
    },
    {
      source: "BleepingComputer",
      ago: "6h ago",
      title: "Ransomware crews abuse exposed Kubernetes dashboards for initial access",
    },
    {
      source: "Dark Reading",
      ago: "9h ago",
      title: "Enterprises race to revoke long-lived cloud access keys after mass leak",
    },
  ],
  assets: [
    {
      name: "customer-exports",
      type: "S3_BUCKET",
      provider: "AWS",
      riskLevel: "CRITICAL" as Severity,
      riskScore: 94,
      region: "us-east-1",
    },
    {
      name: "sg-prod-bastion",
      type: "SECURITY_GROUP",
      provider: "AWS",
      riskLevel: "CRITICAL" as Severity,
      riskScore: 91,
      region: "us-east-1",
    },
    {
      name: "pay-api-prod",
      type: "EC2_INSTANCE",
      provider: "AWS",
      riskLevel: "HIGH" as Severity,
      riskScore: 81,
      region: "us-west-2",
    },
    {
      name: "crm-sql-flex",
      type: "SQL_DATABASE",
      provider: "AZURE",
      riskLevel: "HIGH" as Severity,
      riskScore: 78,
      region: "eastus",
    },
    {
      name: "ml-training-bucket",
      type: "GCS_BUCKET",
      provider: "GCP",
      riskLevel: "MEDIUM" as Severity,
      riskScore: 62,
      region: "us-central1",
    },
    {
      name: "eks-payments",
      type: "EKS_CLUSTER",
      provider: "AWS",
      riskLevel: "MEDIUM" as Severity,
      riskScore: 58,
      region: "eu-west-1",
    },
  ],
  findings: [
    {
      title: "S3 public ACL",
      severity: "CRITICAL" as Severity,
      provider: "AWS",
      asset: "customer-exports",
      policy: "CIS-2.1.5",
      score: 94,
    },
    {
      title: "SSH open to world",
      severity: "CRITICAL" as Severity,
      provider: "AWS",
      asset: "sg-prod-bastion",
      policy: "NET-SSH-01",
      score: 91,
    },
    {
      title: "Disk not encrypted",
      severity: "HIGH" as Severity,
      provider: "AZURE",
      asset: "crm-sql-flex",
      policy: "AZ-DISK-01",
      score: 78,
    },
    {
      title: "SA user-managed keys",
      severity: "HIGH" as Severity,
      provider: "GCP",
      asset: "ml-training-bucket",
      policy: "GCP-IAM-04",
      score: 74,
    },
    {
      title: "CloudTrail not multi-region",
      severity: "MEDIUM" as Severity,
      provider: "AWS",
      asset: "pay-api-prod",
      policy: "CIS-3.1",
      score: 55,
    },
  ],
  policies: [
    {
      code: "CIS-2.1.5",
      title: "Deny public S3",
      category: "Storage",
      provider: "AWS",
      enabled: true,
    },
    {
      code: "NET-SSH-01",
      title: "Restrict SSH",
      category: "Network",
      provider: "AWS",
      enabled: true,
    },
    {
      code: "AZ-DISK-01",
      title: "Encrypt managed disks",
      category: "Compute",
      provider: "AZURE",
      enabled: true,
    },
    {
      code: "GCP-IAM-04",
      title: "Disable SA key creation",
      category: "Identity",
      provider: "GCP",
      enabled: true,
    },
    {
      code: "CIS-3.1",
      title: "Multi-region CloudTrail",
      category: "Logging",
      provider: "AWS",
      enabled: false,
    },
  ],
  accounts: [
    { name: "acme-prod", provider: "AWS", status: "ACTIVE", assets: 982, region: "us-east-1" },
    { name: "acme-security", provider: "AWS", status: "ACTIVE", assets: 214, region: "us-east-1" },
    { name: "Contoso Prod", provider: "AZURE", status: "ACTIVE", assets: 514, region: "eastus" },
    {
      name: "Contoso Shared",
      provider: "AZURE",
      status: "ACTIVE",
      assets: 188,
      region: "westeurope",
    },
    {
      name: "acme-analytics",
      provider: "GCP",
      status: "ACTIVE",
      assets: 346,
      region: "us-central1",
    },
    { name: "acme-dev", provider: "AWS", status: "ACTIVE", assets: 98, region: "eu-west-1" },
  ],
  vulns: [
    {
      cve: "CVE-2024-3094",
      title: "xz-utils backdoor (KEV)",
      severity: "CRITICAL" as Severity,
      target: "payments/api:1.14.2",
      score: 9.8,
    },
    {
      cve: "CVE-2024-21626",
      title: "runc container escape",
      severity: "CRITICAL" as Severity,
      target: "eks-payments",
      score: 8.6,
    },
    {
      cve: "CVE-2023-38545",
      title: "curl SOCKS5 heap overflow",
      severity: "HIGH" as Severity,
      target: "pay-api-prod",
      score: 7.5,
    },
    {
      cve: "CVE-2024-6387",
      title: "OpenSSH regreSSHion",
      severity: "HIGH" as Severity,
      target: "sg-prod-bastion host",
      score: 8.1,
    },
  ],
  identities: [
    {
      name: "ci-deployer",
      type: "IAM Role",
      provider: "AWS",
      risk: "CRITICAL" as Severity,
      issue: "AdministratorAccess unused 14d",
    },
    {
      name: "ml-pipeline",
      type: "Service Account",
      provider: "GCP",
      risk: "HIGH" as Severity,
      issue: "User-managed keys",
    },
    {
      name: "ops-admin",
      type: "IAM User",
      provider: "AWS",
      risk: "HIGH" as Severity,
      issue: "Admin without MFA",
    },
    {
      name: "contoso-reader",
      type: "App Role",
      provider: "AZURE",
      risk: "MEDIUM" as Severity,
      issue: "Over-privileged read",
    },
  ],
  attackPaths: [
    {
      title: "Internet → S3 PII",
      severity: "CRITICAL" as Severity,
      steps: "Port 22 → EC2 → Instance profile → customer-exports",
      blast: 37,
    },
    {
      title: "Public NSG → SQL",
      severity: "CRITICAL" as Severity,
      steps: "NSG :1433 → crm-sql-flex",
      blast: 12,
    },
    {
      title: "CI admin → prod EKS",
      severity: "HIGH" as Severity,
      steps: "ci-deployer → eks-payments",
      blast: 24,
    },
  ],
  compliance: [
    { framework: "CIS AWS Baseline", passed: 82, failed: 14, na: 6 },
    { framework: "CIS Azure Baseline", passed: 76, failed: 19, na: 4 },
    { framework: "SOC 2-style", passed: 71, failed: 22, na: 9 },
    { framework: "PCI-style", passed: 64, failed: 28, na: 11 },
  ],
  alerts: [
    {
      title: "Public bucket with PII",
      kind: "DSPM",
      severity: "CRITICAL" as Severity,
      status: "OPEN",
    },
    { title: "Admin role unused 14d", kind: "CIEM", severity: "HIGH" as Severity, status: "OPEN" },
    {
      title: "KEV CVE on prod image",
      kind: "CVE",
      severity: "CRITICAL" as Severity,
      status: "ACKNOWLEDGED",
    },
    { title: "Privileged container", kind: "K8s", severity: "HIGH" as Severity, status: "OPEN" },
  ],
} as const;

export type ConsoleHref =
  | "/dashboard"
  | "/news"
  | "/security-score"
  | "/search"
  | "/academy"
  | "/policies"
  | "/assets"
  | "/findings"
  | "/compliance"
  | "/dspm"
  | "/ip-scanner"
  | "/compute"
  | "/vulnerabilities"
  | "/runtime"
  | "/containers"
  | "/kubernetes"
  | "/side-scan"
  | "/ciem"
  | "/api-security"
  | "/shift-left"
  | "/iac-secrets"
  | "/sbom"
  | "/ai-spm"
  | "/attack-paths"
  | "/mitre"
  | "/alerts"
  | "/soar"
  | "/remediation"
  | "/assistant"
  | "/reports"
  | "/audit"
  | "/notifications"
  | "/cloud"
  | "/users"
  | "/roles"
  | "/organization"
  | "/billing"
  | "/partner";
