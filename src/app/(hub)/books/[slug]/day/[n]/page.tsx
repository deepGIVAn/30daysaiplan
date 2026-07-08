import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DayPanel } from "@/components/dashboard/day-panel";
import { getBookMeta, getDayContent } from "@/lib/books/loader";
import { getDayUserData } from "@/lib/progress/actions";

interface PageProps {
  params: Promise<{ slug: string; n: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, n } = await params;
  const day = getDayContent(slug, parseInt(n, 10));
  return { title: day ? `Day ${n}: ${day.title}` : "Day" };
}

export default async function DayPage({ params }: PageProps) {
  const { slug, n } = await params;
  const dayNumber = parseInt(n, 10);

  const book = getBookMeta(slug);
  if (!book) notFound();

  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > book.totalDays) notFound();

  const day = getDayContent(slug, dayNumber);
  if (!day) notFound();

  const { user, checklist, completed, reflection } = await getDayUserData(
    slug,
    dayNumber,
  );

  const prevDay = dayNumber > 1 ? dayNumber - 1 : null;
  const nextDay = dayNumber < book.totalDays ? dayNumber + 1 : null;

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Dr. Jerome Joseph" },
        { label: book.title, href: `/books/${slug}` },
        { label: `Day ${dayNumber}` },
      ]}
      cara={{
        bookSlug: slug,
        onDayPage: true,
        contextDay: dayNumber,
        dayTitle: day.title,
        totalDays: book.totalDays,
      }}
    >
      <DayPanel
        bookSlug={slug}
        day={day}
        initialChecklist={checklist}
        initialReflection={reflection}
        initialCompleted={completed}
        isAuthenticated={!!user}
        prevDay={prevDay}
        nextDay={nextDay}
      />
    </DashboardShell>
  );
}
