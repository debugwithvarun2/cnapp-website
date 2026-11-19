import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Newspaper,
  Gauge,
  GraduationCap,
  ShieldCheck,
  Server,
  FileWarning,
  ClipboardCheck,
  Database,
  Radio,
  Cpu,
  Flame,
  Activity,
  Boxes,
  Disc,
  KeyRound,
  Workflow,
  Terminal,
  FileCode2,
  Package,
  Bot,
  Route,
  Layers,
  BellRing,
  Zap,
  Wrench,
  MessageSquare,
  FileBarChart,
  History,
  Bell,
  Building2,
  Users,
  Lock,
  Settings2,
  Search,
  CreditCard,
  Network,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  badge?: string;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

/** Single source of truth for Septer app navigation (sidebar + breadcrumbs). */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    items: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard:read",
      },
      { label: "Security News", href: "/news", icon: Newspaper, permission: "dashboard:read" },
      {
        label: "Security Posture",
        href: "/security-score",
        icon: Gauge,
        permission: "dashboard:read",
      },
      { label: "Global Search", href: "/search", icon: Search, permission: "assets:read" },
      { label: "Academy", href: "/academy", icon: GraduationCap },
    ],
  },
  {
    id: "cloud-security",
    title: "Cloud Security",
    items: [
      { label: "CSPM Policies", href: "/policies", icon: ShieldCheck, permission: "cspm:read" },
      { label: "Cloud Assets", href: "/assets", icon: Server, permission: "assets:read" },
      { label: "Misconfigurations", href: "/findings", icon: FileWarning, permission: "cspm:read" },
      {
        label: "Compliance",
        href: "/compliance",
        icon: ClipboardCheck,
        permission: "compliance:read",
      },
      { label: "Data Security (DSPM)", href: "/dspm", icon: Database, permission: "cspm:read" },
      {
        label: "External Exposure",
        href: "/ip-scanner",
        icon: Radio,
        permission: "ip-scanner:read",
      },
    ],
  },
  {
    id: "workload-security",
    title: "Workload Security",
    items: [
      { label: "Compute (CWPP)", href: "/compute", icon: Cpu, permission: "assets:read" },
      {
        label: "Vulnerabilities",
        href: "/vulnerabilities",
        icon: Flame,
        permission: "vulnerabilities:read",
      },
      { label: "Runtime Security", href: "/runtime", icon: Activity, permission: "runtime:read" },
      {
        label: "Container Security",
        href: "/containers",
        icon: Boxes,
        permission: "containers:read",
      },
      {
        label: "Kubernetes Security",
        href: "/kubernetes",
        icon: Boxes,
        permission: "kubernetes:read",
      },
      { label: "Agentless SideScan", href: "/side-scan", icon: Disc, permission: "cloud:read" },
    ],
  },
  {
    id: "identity-security",
    title: "Identity Security",
    items: [
      { label: "CIEM Effective Access", href: "/ciem", icon: KeyRound, permission: "ciem:read" },
    ],
  },
  {
    id: "app-security",
    title: "Application Security",
    items: [
      {
        label: "API Security (ASPM)",
        href: "/api-security",
        icon: Workflow,
        permission: "cspm:read",
      },
      {
        label: "Shift-Left CLI & IDE",
        href: "/shift-left",
        icon: Terminal,
        permission: "cspm:read",
      },
      { label: "IaC & Secrets", href: "/iac-secrets", icon: FileCode2, permission: "cspm:read" },
      { label: "SBOM Packages", href: "/sbom", icon: Package, permission: "vulnerabilities:read" },
      { label: "AI-SPM Security", href: "/ai-spm", icon: Bot, permission: "cspm:read" },
    ],
  },
  {
    id: "risk-management",
    title: "Risk Management",
    items: [
      { label: "Attack Paths", href: "/attack-paths", icon: Route, permission: "cspm:read" },
      { label: "MITRE ATT&CK (CDR)", href: "/mitre", icon: Layers, permission: "cspm:read" },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    items: [
      { label: "Alerts & Tickets", href: "/alerts", icon: BellRing, permission: "alerts:read" },
      { label: "SOAR Playbooks", href: "/soar", icon: Zap, permission: "cspm:remediate" },
      {
        label: "Remediation Approval",
        href: "/remediation",
        icon: Wrench,
        permission: "cspm:remediate",
      },
      {
        label: "AI Security Assistant",
        href: "/assistant",
        icon: MessageSquare,
        permission: "cspm:read",
      },
      {
        label: "Security Reports",
        href: "/reports",
        icon: FileBarChart,
        permission: "reports:read",
      },
      { label: "Audit Logs", href: "/audit", icon: History, permission: "audit:read" },
      { label: "Notifications", href: "/notifications", icon: Bell, permission: "alerts:read" },
    ],
  },
  {
    id: "administration",
    title: "Administration",
    items: [
      { label: "Cloud Accounts", href: "/cloud", icon: Building2, permission: "cloud:read" },
      { label: "Team & Users", href: "/users", icon: Users, permission: "users:read" },
      { label: "Roles & RBAC", href: "/roles", icon: Lock, permission: "roles:read" },
      {
        label: "Organization Settings",
        href: "/organization",
        icon: Settings2,
        permission: "organization:read",
      },
      {
        label: "Billing & usage",
        href: "/billing",
        icon: CreditCard,
        permission: "organization:read",
      },
      {
        label: "Partner tenants",
        href: "/partner",
        icon: Network,
        permission: "organization:read",
      },
    ],
  },
];

const ROUTE_LABELS: Record<string, string> = {};
for (const section of NAV_SECTIONS) {
  for (const item of section.items) {
    ROUTE_LABELS[item.href] = item.label;
  }
}
ROUTE_LABELS["/help"] = "Help & Documentation";
ROUTE_LABELS["/academy"] = "Product Academy";

export function getRouteLabel(pathname: string): string {
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
  const base = pathname.split("/").slice(0, 2).join("/") || pathname;
  if (ROUTE_LABELS[base]) return ROUTE_LABELS[base];
  const segment = pathname.split("/").filter(Boolean).pop();
  return segment ? segment.replace(/-/g, " ") : "Dashboard";
}

export function getSectionForPath(pathname: string): NavSection | undefined {
  return NAV_SECTIONS.find((s) =>
    s.items.some((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)),
  );
}

/** Permission required for a feature path, derived from NAV_SECTIONS. */
export function getRequiredPermissionForPath(pathname: string): string | undefined {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item.permission;
      }
    }
  }
  // Aliases not listed as primary nav hrefs
  if (pathname === "/cdr" || pathname.startsWith("/cdr/")) return "cspm:read";
  if (pathname === "/network" || pathname.startsWith("/network/")) return "assets:read";
  if (pathname === "/databases" || pathname.startsWith("/databases/")) return "assets:read";
  return undefined;
}

/** Map of path → permission for App route wiring. */
export const ROUTE_PERMISSIONS: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.permission) map[item.href] = item.permission;
    }
  }
  map["/cdr"] = "cspm:read";
  map["/network"] = "assets:read";
  map["/databases"] = "assets:read";
  return map;
})();
