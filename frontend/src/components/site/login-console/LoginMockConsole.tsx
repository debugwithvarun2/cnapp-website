/**
 * Marketing hero CNAPP console — loads real product pages via dynamic import +
 * Vite `@cnapp/*` bridge into /CNAPP/frontend/src (ShowcasePageHost + enableShowcaseApi).
 * Client-only gate avoids SSR running axios/zustand from the showcase bundle.
 */
import { useEffect, useState, type ComponentType } from "react";
import { PreviewAppShell } from "./PreviewAppShell";

type MountedProps = {
  width: number;
  height: number;
  accent?: string;
};

export function LoginMockConsole({ width, height, accent = "var(--brand-primary)" }: MountedProps) {
  const [clientReady, setClientReady] = useState(false);
  const [Mounted, setMounted] = useState<ComponentType<MountedProps> | null>(null);

  useEffect(() => {
    setClientReady(true);
    void import("./LoginMockConsoleMounted").then((mod) => {
      setMounted(() => mod.LoginMockConsoleMounted);
    });
  }, []);

  if (!clientReady || !Mounted) {
    return (
      <div className="cnapp-login-console" style={{ width, height }}>
        <PreviewAppShell
          accent={accent}
          activeHref="/dashboard"
          width={width}
          height={height}
          onNavigate={() => {}}
        >
          <div className="flex min-h-[280px] items-center justify-center p-6 text-center text-sm text-[var(--text-muted)]">
            Loading console…
          </div>
        </PreviewAppShell>
      </div>
    );
  }

  return <Mounted width={width} height={height} accent={accent} />;
}
