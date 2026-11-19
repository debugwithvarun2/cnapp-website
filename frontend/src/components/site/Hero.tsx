import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NetworkField } from "./Ambient";
import { Dashboard } from "./Dashboard";
import { Magnetic, SplitHeading } from "./primitives";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[72px] md:pt-[80px]">
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]">
        <div className="grid-lines absolute inset-0" />
      </div>
      <NetworkField className="pointer-events-none absolute inset-0 h-full w-full" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-navy"
      />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-12 items-end gap-4 lg:gap-6">
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur"
            >
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-primary" />
              Cloud-Native Application Protection Platform
            </motion.div>
            <SplitHeading
              as="h1"
              text="Complete Cloud Visibility. Contextual Risk Intelligence. Controlled Remediation."
              highlight={["Contextual", "Risk", "Intelligence"]}
              className="text-[1.85rem] font-semibold leading-[1.05] text-ink sm:text-4xl xl:text-[3.5rem]"
            />
          </div>
          <motion.div
            className="col-span-12 lg:col-span-4 lg:pb-1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
              Septer unifies CSPM, CWPP, CIEM, DSPM, AI-SPM, ASPM, attack paths, CDR, and controlled
              SOAR remediation into one multi-cloud CNAPP console.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Magnetic>
                <a
                  href="#platform"
                  className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-navy"
                >
                  Explore the Platform
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#demo"
                  className="inline-flex items-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                >
                  Request a Demo
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 mt-5 md:mt-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--electric)_25%,transparent),transparent_65%)] blur-2xl"
          />
          <div className="border-beam relative z-20 rounded-xl">
            <Dashboard />
          </div>
        </motion.div>
      </div>
      <div className="relative h-8 bg-navy md:h-10" />
    </section>
  );
}
