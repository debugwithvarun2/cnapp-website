import { createFileRoute } from "@tanstack/react-router";
import { Cursor } from "@/components/site/Ambient";
import { AttackPath, MultiCloud } from "@/components/site/Attack";
import { Capabilities } from "@/components/site/Capabilities";
import { DataSecurity, Score, ShiftLeft } from "@/components/site/Deep";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { Compliance, FinalCta, Footer, HowItWorks, SecOps } from "@/components/site/Ops";
import { Challenge, Pillars, SideScan } from "@/components/site/Story";

const title = "Septer — Enterprise CNAPP for Unified Cloud Security";
const description =
  "Septer is an enterprise CNAPP that unifies CSPM, CWPP, CIEM, DSPM, AI-SPM, ASPM, attack paths, CDR, SOAR, and shift-left security across AWS, Azure, and GCP.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Challenge />
        <Pillars />
        <SideScan />
        <AttackPath />
        <MultiCloud />
        <Capabilities />
        <Score />
        <DataSecurity />
        <ShiftLeft />
        <SecOps />
        <Compliance />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
