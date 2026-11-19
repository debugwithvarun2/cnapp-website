/**
 * Client-only CNAPP showcase console — loaded dynamically from LoginMockConsole
 * so SSR never evaluates axios interceptors or zustand auth store.
 */
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type MouseEvent,
  type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import { PreviewAppShell } from "./PreviewAppShell";
import { ShowcasePageHost } from "@cnapp/showcase/ShowcasePageHost";
import { disableShowcaseApi, enableShowcaseApi } from "@cnapp/showcase/enableShowcaseApi";
import { NAV_SECTIONS } from "./navigation";

class PreviewErrorBoundary extends Component<
  { children: ReactNode; resetKey: string },
  { error: string | null }
> {
  override state = { error: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { error: error.message || "Preview failed" };
  }

  override componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[LoginMockConsole] page crash:", error, info.componentStack);
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Panel failed to render</p>
          <p className="max-w-md font-mono text-[11px] text-[var(--text-muted)]">
            {this.state.error}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function blockInternalNavigation(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  if (target.closest("a[href]")) {
    event.preventDefault();
    event.stopPropagation();
  }
}

const TOUR_HREFS = [
  "/dashboard",
  "/news",
  "/search",
  "/security-score",
  "/policies",
  "/assets",
  "/findings",
  "/compliance",
  "/dspm",
  "/vulnerabilities",
  "/containers",
  "/kubernetes",
  "/runtime",
  "/ciem",
  "/attack-paths",
  "/alerts",
  "/reports",
  "/cloud",
  "/billing",
].filter((href) => NAV_SECTIONS.some((s) => s.items.some((i) => i.href === href)));

const TOUR_INTERVAL_MS = 5000;

export function LoginMockConsoleMounted({
  width,
  height,
  accent = "var(--brand-primary)",
}: {
  width: number;
  height: number;
  accent?: string;
}) {
  enableShowcaseApi();

  const [href, setHref] = useState(TOUR_HREFS[0] ?? "/dashboard");
  const [tourPaused, setTourPaused] = useState(false);
  const pausedRef = useRef(false);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 60_000,
          },
        },
      }),
    [],
  );

  useEffect(() => {
    const err = toast.error.bind(toast);
    const warn = toast.warning.bind(toast);
    const info = toast.info.bind(toast);
    toast.error = (() => "") as typeof toast.error;
    toast.warning = (() => "") as typeof toast.warning;
    toast.info = (() => "") as typeof toast.info;
    enableShowcaseApi();
    return () => {
      toast.error = err;
      toast.warning = warn;
      toast.info = info;
      disableShowcaseApi();
      queryClient.clear();
    };
  }, [queryClient]);

  useEffect(() => {
    if (TOUR_HREFS.length < 2 || tourPaused) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduced) return;

    const tick = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      if (pausedRef.current) return;
      setHref((current) => {
        const idx = Math.max(0, TOUR_HREFS.indexOf(current));
        return TOUR_HREFS[(idx + 1) % TOUR_HREFS.length] ?? TOUR_HREFS[0] ?? "/dashboard";
      });
    };
    const id = window.setInterval(tick, TOUR_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [tourPaused]);

  const onNavigate = (next: string) => {
    pausedRef.current = true;
    setTourPaused(true);
    setHref(next);
  };

  return (
    <div
      className="cnapp-login-console"
      style={{ width, height }}
      onClickCapture={blockInternalNavigation}
    >
      <QueryClientProvider client={queryClient}>
        <PreviewAppShell
          accent={accent}
          activeHref={href}
          width={width}
          height={height}
          onNavigate={onNavigate}
        >
          <PreviewErrorBoundary resetKey={href}>
            <div key={href} className="animate-in fade-in duration-300">
              <ShowcasePageHost href={href} />
            </div>
          </PreviewErrorBoundary>
        </PreviewAppShell>
      </QueryClientProvider>
    </div>
  );
}
