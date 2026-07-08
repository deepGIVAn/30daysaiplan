import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OverviewPanel, type DaySummary } from "@/components/dashboard/overview-panel";
import { getBookMeta, getDayContent } from "@/lib/books/loader";
import { getUserProgress } from "@/lib/progress/actions";
import { calculateProgress } from "@/lib/progress/helpers";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookMeta(slug);
  return { title: book?.title || "Overview" };
}

export default async function BookDashboardPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookMeta(slug);
  if (!book) notFound();

  const { user, dayProgress } = await getUserProgress(slug);
  const { recommendedDay } = calculateProgress(book.totalDays, dayProgress);

  const daySummaries: DaySummary[] = Array.from(
    { length: book.totalDays },
    (_, i) => {
      const day = getDayContent(slug, i + 1);
      return {
        dayNumber: i + 1,
        title: day?.title || `Day ${i + 1}`,
        objective: day?.objective || "",
      };
    },
  );

  return (
    <DashboardShell
      breadcrumbs={[{ label: "Dr. Jerome Joseph" }, { label: book.title }]}
      cara={{
        bookSlug: slug,
        onDayPage: false,
        contextDay: recommendedDay,
        totalDays: book.totalDays,
      }}
    >
      <OverviewPanel
        bookSlug={slug}
        bookTitle={book.title}
        tagline={book.tagline}
        totalDays={book.totalDays}
        daySummaries={daySummaries}
        serverProgress={dayProgress}
        isAuthenticated={!!user}
      />
    </DashboardShell>
  );
}
