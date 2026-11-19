import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Search, Bell, Settings, Moon } from "lucide-react";
import { SepterLogo } from "@/components/site/BrandLogo";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "./navigation";

/** Visual twin of AppLayout (sidebar + header + main) — no nested Router. */
export function PreviewAppShell({
  children,
  accent,
  activeHref,
  onNavigate,
  width = 1440,
  height = 900,
}: {
  children: ReactNode;
  accent: string;
  activeHref: string;
  /** When set, sidebar tabs switch the mock console content */
  onNavigate?: (href: string) => void;
  width?: number;
  height?: number;
}) {
  // Controlled by parent router/state so highlight + content stay in sync
  const path = activeHref;
  const activeBtnRef = useRef<HTMLButtonElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Keep active sidebar nav item visible within the console's internal sidebar nav only,
    // avoiding scrollIntoView which causes the browser window to auto-scroll to the dashboard.
    const btn = activeBtnRef.current;
    const container = navRef.current;
    if (!btn || !container) return;

    const btnTop = btn.offsetTop;
    const btnBottom = btnTop + btn.offsetHeight;
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    if (btnTop < containerTop) {
      container.scrollTop = btnTop;
    } else if (btnBottom > containerBottom) {
      container.scrollTop = btnBottom - container.clientHeight;
    }
  }, [path]);

  const crumb = useMemo(() => {
    for (const section of NAV_SECTIONS) {
      const item = section.items.find((i) => path === i.href || path.startsWith(`${i.href}/`));
      if (item) return `${section.title} › ${item.label}`;
    }
    return "Dashboard › Overview";
  }, [path]);

  const go = (href: string) => {
    onNavigate?.(href);
  };

  return (
    <div
      className="flex overflow-hidden luminous-bg text-[var(--text-primary)] antialiased"
      style={{ width, height }}
      data-showcase-shell
    >
      <aside className="flex w-[188px] shrink-0 flex-col border-r border-[var(--border-default)] bg-[var(--bg-surface)] sm:w-[200px]">
        <div className="flex h-11 shrink-0 items-center gap-2 border-b border-[var(--border-default)] px-2.5 sm:h-12 sm:px-3">
          <SepterLogo className="h-7 w-7 shrink-0 drop-shadow-[0_1px_4px_rgba(56,189,248,0.35)]" />
          <div className="min-w-0">
            <p className="truncate font-heading text-[12px] font-bold tracking-[-0.02em] sm:text-[13px]">
              Septer
            </p>
            <p className="truncate font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--text-muted)] sm:text-[9px]">
              Cloud security
            </p>
          </div>
        </div>
        <nav
          ref={navRef}
          className="flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-1.5 py-2"
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.id}>
              <p className="mb-1 px-2 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = path === item.href || path.startsWith(`${item.href}/`);
                  return (
                    <button
                      key={item.href}
                      ref={active ? activeBtnRef : undefined}
                      type="button"
                      onClick={() => go(item.href)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[10.5px] transition-colors sm:text-[11px]",
                        active
                          ? "font-semibold text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]",
                      )}
                      style={
                        active
                          ? {
                              background: `${accent}22`,
                              boxShadow: `inset 2px 0 0 ${accent}`,
                            }
                          : undefined
                      }
                    >
                      <Icon className="h-3 w-3 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-[var(--border-default)] bg-[var(--bg-surface-elevated)] px-3 sm:h-12 sm:px-4">
          <p className="min-w-0 truncate font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--text-muted)] sm:text-[9px]">
            Septer <span className="text-[var(--text-secondary)]">›</span>{" "}
            <span className="text-[var(--text-secondary)]">{crumb}</span>
          </p>
          <div className="flex shrink-0 items-center gap-1.5 text-[var(--text-muted)] sm:gap-2">
            <span className="hidden items-center gap-1 rounded-md border border-[var(--border-default)] px-2 py-0.5 text-[10px] sm:inline-flex">
              <Search className="h-3 w-3" />
              Search…
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-300 sm:text-[9px]">
              Live Sensor
            </span>
            <Moon className="hidden h-3.5 w-3.5 sm:block" />
            <Bell className="h-3.5 w-3.5" />
            <Settings className="hidden h-3.5 w-3.5 md:block" />
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--brand-soft)] text-[9px] font-bold text-[var(--brand-primary)]">
              SP
            </span>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-auto overscroll-contain">
          <div className="min-h-full p-3 sm:p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
