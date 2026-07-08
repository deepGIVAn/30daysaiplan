import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AboutAuthorSection } from "@/components/about/about-author-section";

export const metadata: Metadata = { title: "About Dr. Jerome Joseph" };

export default function AboutPage() {
  return (
    <DashboardShell hideTopbar>
      <AboutAuthorSection />
    </DashboardShell>
  );
}
