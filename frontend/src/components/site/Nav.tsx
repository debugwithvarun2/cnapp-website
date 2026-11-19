import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { SepterLogo, SepterWordmark } from "./BrandLogo";
import { Magnetic } from "./primitives";

type Item = { label: string; href: string; desc: string };
const menus: { label: string; items: Item[] }[] = [
  {
    label: "Platform",
    items: [
      {
        label: "Overview Dashboard",
        href: "#top",
        desc: "Multi-cloud posture, KPIs, and top risks",
      },
      { label: "Unified CNAPP", href: "#platform", desc: "Nine pillars, one intelligence layer" },
      {
        label: "Multi-Cloud",
        href: "#multicloud",
        desc: "AWS, Azure, GCP, Alibaba, OCI, Cloudflare",
      },
      { label: "How It Works", href: "#how", desc: "Connect → discover → scan → act" },
    ],
  },
  {
    label: "Capabilities",
    items: [
      { label: "Cloud Security", href: "#cap-cloud", desc: "CSPM, assets, DSPM, exposure" },
      {
        label: "Workload Security",
        href: "#cap-workload",
        desc: "CWPP, CVEs, containers, SideScan",
      },
      { label: "Identity Security", href: "#cap-identity", desc: "CIEM effective access" },
      {
        label: "Application Security",
        href: "#cap-app",
        desc: "ASPM, shift-left, IaC, SBOM, AI-SPM",
      },
      {
        label: "Risk & Operations",
        href: "#cap-risk",
        desc: "Attack paths, CDR, SOAR, remediation",
      },
    ],
  },
  {
    label: "Technology",
    items: [
      {
        label: "Agentless SideScanning",
        href: "#sidescan",
        desc: "Snapshot-based workload inspection",
      },
      {
        label: "Attack Path Intelligence",
        href: "#attack",
        desc: "Graph correlation & choke points",
      },
      { label: "Contextual Security Score", href: "#score", desc: "0–100 security index" },
    ],
  },
  {
    label: "Security Operations",
    items: [
      { label: "Controlled Remediation", href: "#secops", desc: "Two-person approval & SOAR" },
      {
        label: "Compliance & Reporting",
        href: "#compliance",
        desc: "Assessments and evidence exports",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "The Fragmentation Problem", href: "#challenge", desc: "Why a unified CNAPP" },
      { label: "Request a Demo", href: "#demo", desc: "Talk through your environment" },
    ],
  },
];

export function Nav() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pendingAnchor = useRef<string | null>(null);
  const navigateMobile = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      window.innerWidth >= 1024 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const href = event.currentTarget.getAttribute("href");
    if (!href?.startsWith("#") || !document.getElementById(href.slice(1))) return;
    event.preventDefault();
    pendingAnchor.current = href;
    setMobile(false);
  };
  const scrollToMobileAnchor = () => {
    const href = pendingAnchor.current;
    pendingAnchor.current = null;
    if (!href || window.innerWidth >= 1024) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    // Capability anchors are tab controls: show the matching existing content.
    if (target.closest('[aria-label="Capability domains"]'))
      target.querySelector("button")?.click();
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 84;
    window.scrollTo({
      top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "bg-transparent",
      )}
      onMouseLeave={() => setOpen(null)}
    >
      <nav className="container-site flex h-[72px] items-center gap-8" aria-label="Primary">
        <a
          href="#top"
          className="flex items-center gap-3 font-semibold tracking-tight text-ink group"
        >
          <SepterLogo className="h-9 w-9 drop-shadow-[0_2px_6px_rgba(3,105,161,0.2)] transition-transform group-hover:scale-105" />
          <SepterWordmark className="h-6 w-auto text-ink group-hover:text-primary transition-colors" />
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {menus.map((m) => (
            <li key={m.label} className="relative" onMouseEnter={() => setOpen(m.label)}>
              <button
                aria-expanded={open === m.label}
                onClick={() => setOpen(open === m.label ? null : m.label)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-primary",
                  open === m.label && "text-primary",
                )}
              >
                {m.label}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    open === m.label && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {open === m.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full w-80 pt-2"
                  >
                    <div className="overflow-hidden rounded-lg border border-border bg-popover p-2 shadow-soft">
                      {m.items.map((it) => (
                        <a
                          key={it.label}
                          href={it.href}
                          onClick={() => setOpen(null)}
                          className="group block rounded-md px-3 py-2.5 transition-colors hover:bg-alt"
                        >
                          <div className="flex items-center gap-2 text-sm font-semibold text-ink group-hover:text-primary">
                            <span className="h-1 w-1 rounded-full bg-electric opacity-0 transition-opacity group-hover:opacity-100" />
                            {it.label}
                          </div>
                          <div className="text-xs text-muted-foreground">{it.desc}</div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <a href="/admin" className="px-3 py-2 text-sm font-medium text-ink/80 hover:text-primary">
            Sign In
          </a>
          <Magnetic>
            <a
              href="#demo"
              className="inline-flex items-center rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-on-dark transition-colors hover:bg-primary"
            >
              Request a Demo
            </a>
          </Magnetic>
        </div>
        <button
          className="ml-auto p-2 lg:hidden"
          onClick={() => setMobile(!mobile)}
          aria-label="Toggle menu"
          aria-expanded={mobile}
        >
          {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      <AnimatePresence onExitComplete={scrollToMobileAnchor}>
        {mobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <div className="container-site max-h-[75vh] space-y-5 overflow-y-auto py-6">
              {menus.map((m) => (
                <div key={m.label}>
                  <div className="eyebrow mb-2">{m.label}</div>
                  {m.items.map((it) => (
                    <a
                      key={it.label}
                      href={it.href}
                      onClick={navigateMobile}
                      className="block py-1.5 text-sm font-medium text-ink"
                    >
                      {it.label}
                    </a>
                  ))}
                </div>
              ))}
              <a
                href="#demo"
                onClick={navigateMobile}
                className="block rounded-md bg-navy px-4 py-3 text-center text-sm font-semibold text-on-dark"
              >
                Request a Demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
