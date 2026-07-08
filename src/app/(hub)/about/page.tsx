import type { Metadata } from "next";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { SectionRule } from "@/components/ui/section-heading";

export const metadata: Metadata = { title: "About Dr. Jerome Joseph" };

const CREDENTIALS = [
  { value: "30+", label: "Years in branding" },
  { value: "1,000+", label: "Brands coached" },
  { value: "12", label: "Bestselling books" },
  { value: "40+", label: "Countries" },
];

export default function AboutPage() {
  return (
    <DashboardShell
      breadcrumbs={[{ label: "Dr. Jerome Joseph" }, { label: "About" }]}
    >
      <div className="page-padding py-8 sm:py-10 max-w-2xl">
        <div className="dashboard-card p-6">
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full brand-gradient font-display text-lg font-semibold text-primary-foreground">
            JJ
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Dr. Jerome Joseph
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Global Brand Strategist · Global Brand Academy
            </p>
          </div>
        </div>

        <SectionRule />

        <div className="mt-6 space-y-4 text-[17px] text-foreground/70 leading-[1.47]">
          <p>
            One of the world&apos;s most respected authorities on branding, leadership, sales,
            culture, and AI-driven transformation. Over 30 years of experience working with
            1,000+ brands across 40 countries.
          </p>
          <p>
            Ranked No. 2 Global Brand Thought Leader. Bestselling author of 12 books.
            Founder of Global Brand Academy.
          </p>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
          {CREDENTIALS.map((c) => (
            <div key={c.label}>
              <dt className="text-fine text-muted-foreground">{c.label}</dt>
              <dd className="mt-0.5 font-display text-xl font-semibold tabular-nums text-indigo-glow">
                {c.value}
              </dd>
            </div>
          ))}
        </dl>

        <blockquote className="mt-10 border-l-2 border-primary/40 pl-4 text-sm italic text-muted-foreground leading-relaxed">
          &ldquo;Your future brand isn&apos;t waiting. It&apos;s being built — today.&rdquo;
        </blockquote>

        <div className="mt-8 flex gap-3">
          <Button size="sm" asChild>
            <Link href="/books/30-day-ai-personal-brand-plan">Start 30-day plan</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href="https://jeromejoseph.com" target="_blank" rel="noopener noreferrer">
              jeromejoseph.com
            </a>
          </Button>
        </div>
        </div>
      </div>
    </DashboardShell>
  );
}
