import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProgressPanel } from "@/components/dashboard/progress-panel";
import { getBookMeta } from "@/lib/books/loader";
import { getUserProgress } from "@/lib/progress/actions";
import { calculateProgress } from "@/lib/progress/helpers";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = { title: "My Progress" };

export default async function ProgressPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookMeta(slug);
  if (!book) notFound();

  const { user, dayProgress, reflections } = await getUserProgress(slug);
  const { recommendedDay } = calculateProgress(book.totalDays, dayProgress);

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Dr. Jerome Joseph" },
        { label: book.title, href: `/books/${slug}` },
        { label: "Progress" },
      ]}
      cara={{
        bookSlug: slug,
        onDayPage: false,
        contextDay: recommendedDay,
        totalDays: book.totalDays,
      }}
    >
      <ProgressPanel
        bookSlug={slug}
        totalDays={book.totalDays}
        serverProgress={dayProgress}
        serverReflections={reflections
          .filter((r) => r.content?.trim())
          .map((r) => ({ dayNumber: r.day_number, content: r.content }))}
        isAuthenticated={!!user}
        userEmail={user?.email}
      />
    </DashboardShell>
  );
}
