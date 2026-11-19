import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Cloud,
  Copy,
  Download,
  Filter,
  Mail,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SepterLogo, SepterWordmark } from "@/components/site/BrandLogo";
import { Signal } from "@/components/site/Dashboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

export interface DemoSubmission {
  id: string;
  fullName: string;
  email: string;
  company: string;
  cloudProviders?: string[];
  interest?: string;
  notes?: string;
  status: "new" | "contacted" | "qualified" | "demo_scheduled" | "closed";
  priority: "critical" | "high" | "medium" | "low";
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  ip?: string;
  userAgent?: string;
}

interface StatsData {
  total: number;
  newRequests: number;
  contacted: number;
  qualified: number;
  scheduled: number;
  closed: number;
  critical: number;
  conversionRate: number;
}

const STATUS_CONFIG: Record<
  DemoSubmission["status"],
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  new: {
    label: "New Request",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    dot: "bg-blue-400 shadow-[0_0_8px_#60a5fa]",
  },
  contacted: {
    label: "Contacted",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  qualified: {
    label: "Qualified",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
    dot: "bg-purple-400",
  },
  demo_scheduled: {
    label: "Demo Scheduled",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
  },
  closed: {
    label: "Closed / Archived",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
    dot: "bg-slate-400",
  },
};

const PRIORITY_CONFIG: Record<DemoSubmission["priority"], { label: string; badge: string }> = {
  critical: {
    label: "CRITICAL",
    badge: "border-rose-500/40 bg-rose-500/15 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]",
  },
  high: {
    label: "HIGH",
    badge: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  },
  medium: {
    label: "MEDIUM",
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  },
  low: {
    label: "LOW",
    badge: "border-slate-500/30 bg-slate-500/10 text-slate-400",
  },
};

function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    const days = Math.floor(diff / 86400);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  } catch {
    return dateStr;
  }
}

function formatFullDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function AdminPage() {
  const [submissions, setSubmissions] = useState<DemoSubmission[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    newRequests: 0,
    contacted: 0,
    qualified: 0,
    scheduled: 0,
    closed: 0,
    critical: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedCloud, setSelectedCloud] = useState<string>("all");

  // Drawer / modal states
  const [activeItem, setActiveItem] = useState<DemoSubmission | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<DemoSubmission["status"]>("new");
  const [editPriority, setEditPriority] = useState<DemoSubmission["priority"]>("medium");
  const [editAssigned, setEditAssigned] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [smtpStatus, setSmtpStatus] = useState<{
    configured: boolean;
    host?: string;
    userMasked?: string | null;
  } | null>(null);

  // Quick simulate dialog
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [simName, setSimName] = useState("");
  const [simEmail, setSimEmail] = useState("");
  const [simCompany, setSimCompany] = useState("");
  const [simInterest, setSimInterest] = useState("Unified CNAPP Platform Demo");
  const [simClouds, setSimClouds] = useState<string[]>(["AWS"]);
  const [simSubmitting, setSimSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      const res = await fetch("/api/demo-requests");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSubmissions(json.data || []);
          if (json.stats) setStats(json.stats);
        }
      }
      fetch("/api/admin/smtp-status")
        .then((r) => r.json())
        .then((j) => {
          if (j.success) setSmtpStatus(j);
        })
        .catch(() => {});
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 6 seconds to capture inbound submissions in real-time
    const interval = setInterval(() => {
      fetchData(true);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Update drawer state when an active item is opened
  const openDrawer = (item: DemoSubmission) => {
    setActiveItem(item);
    setEditNotes(item.notes || "");
    setEditStatus(item.status);
    setEditPriority(item.priority);
    setEditAssigned(item.assignedTo || "Unassigned");
  };

  const handleUpdateItem = async (patch: Partial<DemoSubmission>) => {
    if (!activeItem) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/demo-requests/${activeItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setActiveItem(json.data);
          setSubmissions((prev) => prev.map((it) => (it.id === activeItem.id ? json.data : it)));
          showToast("Dossier updated successfully");
          fetchData(true);
        }
      }
    } catch (err) {
      console.error("Error updating:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: DemoSubmission["status"]) => {
    try {
      const res = await fetch(`/api/demo-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSubmissions((prev) =>
            prev.map((it) => (it.id === id ? { ...it, status: newStatus } : it)),
          );
          if (activeItem?.id === id) {
            setActiveItem((prev) => (prev ? { ...prev, status: newStatus } : null));
          }
          showToast(`Status updated to ${STATUS_CONFIG[newStatus].label}`);
          fetchData(true);
        }
      }
    } catch (err) {
      console.error("Error changing status:", err);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete demo request from ${name}?`)) return;
    try {
      const res = await fetch(`/api/demo-requests/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((it) => it.id !== id));
        if (activeItem?.id === id) setActiveItem(null);
        showToast("Request removed from registry");
        fetchData(true);
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleResetSeed = async () => {
    if (!confirm("Reset submissions to sample seed data? Current list will be restored.")) return;
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      if (res.ok) {
        showToast("Submissions reset to seed data");
        fetchData();
      }
    } catch (err) {
      console.error("Error resetting:", err);
    }
  };

  const handleSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simEmail || !simCompany) return;
    setSimSubmitting(true);
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: simName,
          email: simEmail,
          company: simCompany,
          interest: simInterest,
          cloudProviders: simClouds,
        }),
      });
      if (res.ok) {
        showToast(`New inbound lead received from ${simName}!`);
        setSimName("");
        setSimEmail("");
        setSimCompany("");
        setSimulateOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setSimSubmitting(false);
    }
  };

  const handleExportCsv = () => {
    if (submissions.length === 0) return;
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Company",
      "Status",
      "Priority",
      "Clouds",
      "Interest",
      "Assigned To",
      "Created At",
    ];
    const rows = submissions.map((s) => [
      s.id,
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      `"${s.company.replace(/"/g, '""')}"`,
      s.status,
      s.priority,
      `"${(s.cloudProviders || []).join(", ")}"`,
      `"${(s.interest || "").replace(/"/g, '""')}"`,
      `"${(s.assignedTo || "").replace(/"/g, '""')}"`,
      s.createdAt,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `septer_demo_requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV exported successfully");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesName = item.fullName.toLowerCase().includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        const matchesCompany = item.company.toLowerCase().includes(q);
        const matchesInterest = (item.interest || "").toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesCompany && !matchesInterest) {
          return false;
        }
      }
      // Status
      if (selectedStatus !== "all" && item.status !== selectedStatus) {
        return false;
      }
      // Priority
      if (selectedPriority !== "all" && item.priority !== selectedPriority) {
        return false;
      }
      // Cloud
      if (selectedCloud !== "all") {
        if (!item.cloudProviders || !item.cloudProviders.includes(selectedCloud)) {
          return false;
        }
      }
      return true;
    });
  }, [submissions, search, selectedStatus, selectedPriority, selectedCloud]);

  return (
    <div className="min-h-screen bg-[#071426] text-[#e2e8f0] font-sans antialiased selection:bg-[#38bdf8] selection:text-[#071426]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border border-[#38bdf8]/40 bg-[#0d1b2d]/95 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur text-sm text-[#e2e8f0] animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-[#38bdf8]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071426]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 group"
              title="Return to Marketing Homepage"
            >
              <SepterLogo className="h-9 w-9 drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)] transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="font-semibold tracking-tight text-white flex items-center gap-2">
                  <SepterWordmark className="h-5 w-auto text-white group-hover:text-[#38bdf8] transition-colors" />
                  <span className="rounded bg-[#38bdf8]/15 px-1.5 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider text-[#38bdf8] border border-[#38bdf8]/30">
                    Admin
                  </span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Cloud Security Operations Console
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center ml-6 pl-6 border-l border-white/10 gap-2 font-mono text-xs text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-300">Live Backend Pipeline Active</span>
            </div>

            {smtpStatus && (
              <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-white/10 gap-1.5 font-mono text-xs">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {smtpStatus.configured ? (
                  <span className="text-sky-300 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    SMTP Ready ({smtpStatus.userMasked || smtpStatus.host})
                  </span>
                ) : (
                  <span
                    className="text-amber-400/90 flex items-center gap-1.5"
                    title="Configure SMTP_USER and SMTP_PASS in .env to enable instant demo request email delivery"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    SMTP: Add .env Password
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchData()}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0d1b2d] px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-white/20 transition-colors disabled:opacity-50"
              title="Refresh demo submissions"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", refreshing && "animate-spin text-[#38bdf8]")}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => setSimulateOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-3 py-1.5 text-xs font-semibold text-[#38bdf8] hover:bg-[#38bdf8]/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Simulate Request</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0d1b2d] px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-white/20 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#38bdf8] hover:text-[#071426] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>View Website</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Banner / Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#38bdf8] mb-1 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Inbound Enterprise Demo Pipeline
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Demo Requests & Prospect Registry
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Live ingestion feed of cloud enterprise prospects submitting from the Septer marketing
              portal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSeed}
              className="text-xs text-slate-400 hover:text-slate-200 underline decoration-slate-600 transition-colors"
            >
              Restore Seed Data
            </button>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Metric 1 */}
          <div className="rounded-xl border border-white/10 bg-[#0d1b2d]/80 p-4 backdrop-blur shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-mono text-xs uppercase tracking-wider">Total Inbound</span>
              <Activity className="h-4 w-4 text-[#38bdf8]" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {stats.total}
            </div>
            <div className="mt-1 flex items-center text-[11px] text-slate-400 font-mono">
              <span className="text-emerald-400 mr-1.5 font-semibold">100% recorded</span>
              in local DB
            </div>
          </div>

          {/* Metric 2 */}
          <div className="rounded-xl border border-blue-500/30 bg-[#0d1b2d]/80 p-4 backdrop-blur shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-mono text-xs uppercase tracking-wider text-blue-400">
                New / Uncontacted
              </span>
              <Clock className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-blue-400 tracking-tight">
              {stats.newRequests}
            </div>
            <div className="mt-1 flex items-center text-[11px] text-blue-300 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse mr-1.5" />
              Pending response
            </div>
          </div>

          {/* Metric 3 */}
          <div className="rounded-xl border border-emerald-500/30 bg-[#0d1b2d]/80 p-4 backdrop-blur shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400">
                Demos Scheduled
              </span>
              <Calendar className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
              {stats.scheduled}
            </div>
            <div className="mt-1 text-[11px] text-emerald-300/80 font-mono">
              High intent pipeline
            </div>
          </div>

          {/* Metric 4 */}
          <div className="rounded-xl border border-white/10 bg-[#0d1b2d]/80 p-4 backdrop-blur shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-mono text-xs uppercase tracking-wider">Qualification Rate</span>
              <Sparkles className="h-4 w-4 text-[#38bdf8]" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {stats.conversionRate}%
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-mono">Qualified & booked</div>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="rounded-xl border border-white/10 bg-[#0d1b2d]/70 p-4 backdrop-blur space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by prospect name, email, company, or interest..."
                className="w-full rounded-lg border border-white/10 bg-[#071426] pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:border-[#38bdf8] focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Selectors */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#071426] px-2.5 py-1.5">
                <span className="text-slate-400 font-mono text-[11px]">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
                >
                  <option value="all" className="bg-[#071426] text-white">
                    All Statuses ({submissions.length})
                  </option>
                  <option value="new" className="bg-[#071426] text-white">
                    New ({stats.newRequests})
                  </option>
                  <option value="contacted" className="bg-[#071426] text-white">
                    Contacted ({stats.contacted})
                  </option>
                  <option value="qualified" className="bg-[#071426] text-white">
                    Qualified ({stats.qualified})
                  </option>
                  <option value="demo_scheduled" className="bg-[#071426] text-white">
                    Demo Scheduled ({stats.scheduled})
                  </option>
                  <option value="closed" className="bg-[#071426] text-white">
                    Closed ({stats.closed})
                  </option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#071426] px-2.5 py-1.5">
                <span className="text-slate-400 font-mono text-[11px]">Priority:</span>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
                >
                  <option value="all" className="bg-[#071426] text-white">
                    All Priorities
                  </option>
                  <option value="critical" className="bg-[#071426] text-white">
                    Critical
                  </option>
                  <option value="high" className="bg-[#071426] text-white">
                    High
                  </option>
                  <option value="medium" className="bg-[#071426] text-white">
                    Medium
                  </option>
                  <option value="low" className="bg-[#071426] text-white">
                    Low
                  </option>
                </select>
              </div>

              {/* Cloud Filter */}
              <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#071426] px-2.5 py-1.5">
                <Cloud className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={selectedCloud}
                  onChange={(e) => setSelectedCloud(e.target.value)}
                  className="bg-transparent text-white focus:outline-none text-xs cursor-pointer"
                >
                  <option value="all" className="bg-[#071426] text-white">
                    All Clouds
                  </option>
                  <option value="AWS" className="bg-[#071426] text-white">
                    AWS
                  </option>
                  <option value="Azure" className="bg-[#071426] text-white">
                    Azure
                  </option>
                  <option value="GCP" className="bg-[#071426] text-white">
                    GCP
                  </option>
                  <option value="Multi-Cloud" className="bg-[#071426] text-white">
                    Multi-Cloud
                  </option>
                </select>
              </div>

              {(search ||
                selectedStatus !== "all" ||
                selectedPriority !== "all" ||
                selectedCloud !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedStatus("all");
                    setSelectedPriority("all");
                    setSelectedCloud("all");
                  }}
                  className="text-xs text-[#38bdf8] hover:underline px-2 py-1"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Requests Table / Grid */}
        <div className="rounded-xl border border-white/10 bg-[#0d1b2d]/80 overflow-hidden backdrop-blur shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 bg-[#071426]/70 font-mono uppercase tracking-wider text-[11px] text-slate-400">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Prospect & Organization
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Cloud Scope & Interest
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Priority
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Submitted
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-mono text-xs">
                      <RefreshCw className="h-6 w-6 animate-spin text-[#38bdf8] mx-auto mb-2" />
                      Loading demo submissions from backend...
                    </td>
                  </tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <AlertCircle className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                      <p className="font-semibold text-white">No demo requests found</p>
                      <p className="text-xs mt-1 text-slate-400 max-w-sm mx-auto">
                        {search || selectedStatus !== "all"
                          ? "Try adjusting your search filters above."
                          : "No requests have been submitted yet. Use the 'Simulate Request' button or test the form on the marketing homepage!"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const statusConf = STATUS_CONFIG[sub.status] || STATUS_CONFIG.new;
                    const priorityConf = PRIORITY_CONFIG[sub.priority] || PRIORITY_CONFIG.medium;
                    const isSelected = activeItem?.id === sub.id;

                    return (
                      <tr
                        key={sub.id}
                        className={cn(
                          "transition-colors hover:bg-white/[0.03] cursor-pointer",
                          isSelected && "bg-blue-500/10 border-l-2 border-[#38bdf8]",
                        )}
                        onClick={() => openDrawer(sub)}
                      >
                        {/* Prospect & Company */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#071426] border border-white/10 text-white font-mono font-bold text-xs uppercase">
                              {sub.fullName.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center gap-2">
                                {sub.fullName}
                                {sub.status === "new" && (
                                  <span
                                    className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"
                                    title="New unread request"
                                  />
                                )}
                              </div>
                              <div className="text-slate-400 flex items-center gap-2 mt-0.5">
                                <span className="text-[#38bdf8] font-medium">{sub.company}</span>
                                <span>•</span>
                                <span className="font-mono text-[11px]">{sub.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Cloud Scope & Interest */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {(sub.cloudProviders && sub.cloudProviders.length > 0
                                ? sub.cloudProviders
                                : ["Multi-Cloud"]
                              ).map((c) => (
                                <span
                                  key={c}
                                  className="inline-flex items-center gap-1 rounded bg-[#071426] px-2 py-0.5 font-mono text-[10px] text-slate-300 border border-white/10"
                                >
                                  <Cloud className="h-2.5 w-2.5 text-[#38bdf8]" />
                                  {c}
                                </span>
                              ))}
                            </div>
                            <div
                              className="text-[11px] text-slate-400 truncate max-w-xs"
                              title={sub.interest}
                            >
                              {sub.interest || "Unified CNAPP Platform Demo"}
                            </div>
                          </div>
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider",
                              priorityConf.badge,
                            )}
                          >
                            {priorityConf.label}
                          </span>
                        </td>

                        {/* Status (Interactive quick-change dropdown) */}
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-block relative">
                            <select
                              value={sub.status}
                              onChange={(e) =>
                                handleQuickStatusChange(
                                  sub.id,
                                  e.target.value as DemoSubmission["status"],
                                )
                              }
                              className={cn(
                                "appearance-none cursor-pointer rounded-full border px-3 py-1 pr-7 font-mono text-[11px] font-medium transition-colors focus:outline-none",
                                statusConf.bg,
                                statusConf.text,
                                statusConf.border,
                              )}
                            >
                              <option value="new" className="bg-[#071426] text-blue-400">
                                New Request
                              </option>
                              <option value="contacted" className="bg-[#071426] text-amber-400">
                                Contacted
                              </option>
                              <option value="qualified" className="bg-[#071426] text-purple-400">
                                Qualified
                              </option>
                              <option
                                value="demo_scheduled"
                                className="bg-[#071426] text-emerald-400"
                              >
                                Demo Scheduled
                              </option>
                              <option value="closed" className="bg-[#071426] text-slate-400">
                                Closed / Archived
                              </option>
                            </select>
                            <span
                              className={cn(
                                "pointer-events-none absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full",
                                statusConf.dot,
                              )}
                            />
                          </div>
                        </td>

                        {/* Submitted Date */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-mono text-xs text-slate-300">
                            {formatRelativeTime(sub.createdAt)}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {formatFullDate(sub.createdAt)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td
                          className="px-5 py-4 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openDrawer(sub)}
                              className="rounded px-2.5 py-1 text-xs font-medium text-[#38bdf8] hover:bg-[#38bdf8]/15 border border-[#38bdf8]/30 transition-colors"
                              title="Inspect Full Lead Dossier"
                            >
                              Inspect
                            </button>
                            <button
                              onClick={() => handleDeleteItem(sub.id, sub.fullName)}
                              className="rounded p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Submission"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count indicator */}
          <div className="border-t border-white/10 bg-[#071426]/50 px-5 py-3 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div>
              Showing {filteredSubmissions.length} of {submissions.length} total demo submissions
            </div>
            <div className="flex items-center gap-3">
              <span>Database synced</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </main>

      {/* Slide-over Detail Drawer / Inspector */}
      {activeItem && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveItem(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg border-l border-white/10 bg-[#071426] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="border-b border-white/10 px-6 py-5 bg-[#0d1b2d] flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#38bdf8]">
                    Inbound Dossier: {activeItem.id}
                  </div>
                  <h2 className="text-lg font-bold text-white mt-0.5">{activeItem.fullName}</h2>
                  <p className="text-xs text-slate-400">{activeItem.company}</p>
                </div>
                <button
                  onClick={() => setActiveItem(null)}
                  className="rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
                {/* Contact Card */}
                <div className="rounded-lg border border-white/10 bg-[#0d1b2d]/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400 uppercase">
                      Contact Information
                    </span>
                    <button
                      onClick={() => copyToClipboard(activeItem.email, "email")}
                      className="inline-flex items-center gap-1 text-[11px] text-[#38bdf8] hover:underline"
                    >
                      {copiedId === "email" ? (
                        <>
                          <Check className="h-3 w-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy Email
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono">Full Name</div>
                      <div className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {activeItem.fullName}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono">Work Email</div>
                      <a
                        href={`mailto:${activeItem.email}`}
                        className="font-mono text-[#38bdf8] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Mail className="h-3.5 w-3.5 text-[#38bdf8]" />
                        {activeItem.email}
                      </a>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Company / Organization
                      </div>
                      <div className="text-white font-medium mt-0.5">{activeItem.company}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Submitted Timestamp
                      </div>
                      <div className="font-mono text-slate-300 mt-0.5">
                        {formatFullDate(activeItem.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow Status & Triage Controls */}
                <div className="rounded-lg border border-white/10 bg-[#0d1b2d]/60 p-4 space-y-4">
                  <div className="font-mono text-[11px] text-slate-400 uppercase">
                    Triage & Pipeline Controls
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-mono mb-1">
                        Pipeline Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => {
                          const val = e.target.value as DemoSubmission["status"];
                          setEditStatus(val);
                          handleUpdateItem({ status: val });
                        }}
                        className="w-full rounded-md border border-white/10 bg-[#071426] px-3 py-2 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
                      >
                        <option value="new">New Request</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="demo_scheduled">Demo Scheduled</option>
                        <option value="closed">Closed / Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-mono mb-1">
                        Account Priority
                      </label>
                      <select
                        value={editPriority}
                        onChange={(e) => {
                          const val = e.target.value as DemoSubmission["priority"];
                          setEditPriority(val);
                          handleUpdateItem({ priority: val });
                        }}
                        className="w-full rounded-md border border-white/10 bg-[#071426] px-3 py-2 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
                      >
                        <option value="critical">Critical (High Enterprise Value)</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 font-mono mb-1">
                      Assigned Security Architect
                    </label>
                    <input
                      type="text"
                      value={editAssigned}
                      onChange={(e) => setEditAssigned(e.target.value)}
                      onBlur={() => handleUpdateItem({ assignedTo: editAssigned })}
                      placeholder="e.g. Alex Mercer (Principal Solutions Architect)"
                      className="w-full rounded-md border border-white/10 bg-[#071426] px-3 py-2 text-xs text-white focus:border-[#38bdf8] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Technical Scope & Interests */}
                <div className="rounded-lg border border-white/10 bg-[#0d1b2d]/60 p-4 space-y-3">
                  <div className="font-mono text-[11px] text-slate-400 uppercase">
                    Cloud Environment & Demo Scope
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 font-mono mb-1.5">
                      Target Cloud Providers
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(activeItem.cloudProviders && activeItem.cloudProviders.length > 0
                        ? activeItem.cloudProviders
                        : ["Multi-Cloud"]
                      ).map((c) => (
                        <span
                          key={c}
                          className="rounded border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-2.5 py-1 font-mono text-[11px] text-[#38bdf8]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 font-mono mb-1">
                      Primary Interest Area
                    </div>
                    <div className="text-white font-medium bg-[#071426] rounded border border-white/10 p-2.5">
                      {activeItem.interest || "Unified CNAPP Platform Demo"}
                    </div>
                  </div>
                </div>

                {/* Internal Architect Notes */}
                <div className="rounded-lg border border-white/10 bg-[#0d1b2d]/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400 uppercase">
                      Internal Notes & Meeting Log
                    </span>
                    {savingNotes && (
                      <span className="text-[10px] text-[#38bdf8] font-mono animate-pulse">
                        Saving...
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add engagement notes, qualification details, customer infrastructure requirements..."
                    className="w-full rounded-md border border-white/10 bg-[#071426] p-3 text-xs text-white placeholder-slate-500 focus:border-[#38bdf8] focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleUpdateItem({ notes: editNotes })}
                      disabled={savingNotes}
                      className="rounded bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#38bdf8] hover:text-[#071426] transition-colors disabled:opacity-50"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>

                {/* Audit & Ingestion Metadata */}
                <div className="rounded-lg border border-white/5 bg-[#071426]/50 p-3 space-y-1 font-mono text-[10px] text-slate-500">
                  <div>Ingestion IP: {activeItem.ip || "127.0.0.1"}</div>
                  <div className="truncate">
                    Client Agent: {activeItem.userAgent || "Web Client"}
                  </div>
                  <div>ID: {activeItem.id}</div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-white/10 bg-[#0d1b2d] px-6 py-4 flex items-center justify-between">
                <button
                  onClick={() => handleDeleteItem(activeItem.id, activeItem.fullName)}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Request
                </button>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${activeItem.email}?subject=${encodeURIComponent("Septer — CNAPP Demo Confirmation")}&body=${encodeURIComponent(`Hi ${activeItem.fullName},\n\nThank you for requesting a demo of Septer for ${activeItem.company}.\n\nOur cloud security architecture team would love to schedule a 30-minute deep dive tailored to your ${activeItem.cloudProviders?.join(", ") || "cloud"} infrastructure.\n\nBest regards,\nSepter Solutions Team`)}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#38bdf8] px-4 py-2 text-xs font-semibold text-[#071426] hover:bg-white transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Send Demo Invite</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulate Inbound Lead Modal */}
      {simulateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0d1b2d] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#38bdf8]" />
                <h3 className="font-semibold text-white">Simulate Inbound Demo Request</h3>
              </div>
              <button
                onClick={() => setSimulateOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Submit a test lead to simulate prospect traffic directly into the backend ingestion
              pipeline.
            </p>

            <form onSubmit={handleSimulateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full rounded-md border border-white/10 bg-[#071426] px-3 py-2 text-white placeholder-slate-500 focus:border-[#38bdf8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Work Email *</label>
                <input
                  required
                  type="email"
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  placeholder="e.g. r.adams@cybervault.io"
                  className="w-full rounded-md border border-white/10 bg-[#071426] px-3 py-2 text-white placeholder-slate-500 focus:border-[#38bdf8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Company *</label>
                <input
                  required
                  type="text"
                  value={simCompany}
                  onChange={(e) => setSimCompany(e.target.value)}
                  placeholder="e.g. CyberVault Technologies"
                  className="w-full rounded-md border border-white/10 bg-[#071426] px-3 py-2 text-white placeholder-slate-500 focus:border-[#38bdf8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Cloud Environment</label>
                <div className="flex gap-2">
                  {["AWS", "Azure", "GCP", "Multi-Cloud"].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => {
                        setSimClouds((prev) =>
                          prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
                        );
                      }}
                      className={cn(
                        "rounded px-2.5 py-1 text-[11px] font-mono border transition-colors",
                        simClouds.includes(c)
                          ? "bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8]"
                          : "border-white/10 bg-[#071426] text-slate-400",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Demo Focus / Interest</label>
                <input
                  type="text"
                  value={simInterest}
                  onChange={(e) => setSimInterest(e.target.value)}
                  placeholder="e.g. CIEM + DSPM Security Score evaluation"
                  className="w-full rounded-md border border-white/10 bg-[#071426] px-3 py-2 text-white placeholder-slate-500 focus:border-[#38bdf8] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSimulateOpen(false)}
                  className="rounded-md border border-white/10 px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={simSubmitting}
                  className="rounded-md bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white hover:bg-[#38bdf8] hover:text-[#071426] transition-colors disabled:opacity-50"
                >
                  {simSubmitting ? "Ingesting..." : "Submit to Pipeline"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
