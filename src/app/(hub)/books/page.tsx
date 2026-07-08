import type { Metadata } from "next";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BOOK_REGISTRY } from "@/lib/books/registry";

export const metadata: Metadata = { title: "Book Library" };

export default function BooksPage() {

  const available = BOOK_REGISTRY.filter((b) => b.status === "available");
  const comingSoon = BOOK_REGISTRY.filter((b) => b.status === "coming_soon");

  return (
    <DashboardShell
      breadcrumbs={[{ label: "Dr. Jerome Joseph" }, { label: "Book Library" }]}
    >
      <div className="page-padding py-8 sm:py-10">
        <h1 className="font-display text-[26px] font-semibold text-foreground">Book library</h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Dr. Jerome Joseph&apos;s interactive book journeys
        </p>

        <div className="mt-8 space-y-3">
          {available.map((book) => (
            <Link
              key={book.slug}
              href={`/books/${book.slug}`}
              className="dashboard-card group flex items-center justify-between gap-4 p-5 transition-colors hover:border-primary/20"
            >
              <div>
                <p className="text-fine text-success">
                  Live · {book.durationLabel}
                </p>
                <h2 className="mt-1 font-display text-base font-semibold text-foreground group-hover:text-indigo-glow transition-colors">
                  {book.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{book.tagline}</p>
              </div>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-indigo-glow transition-colors"
                strokeWidth={1.5}
              />
            </Link>
          ))}

          {comingSoon.map((book) => (
            <div
              key={book.slug}
              className="dashboard-card flex items-center justify-between gap-4 p-5 opacity-60"
            >
              <div>
                <p className="text-fine text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3 w-3" strokeWidth={1.5} />
                  Coming soon
                </p>
                <h2 className="mt-1 font-display text-base font-semibold text-muted-foreground">
                  {book.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground/70">{book.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
