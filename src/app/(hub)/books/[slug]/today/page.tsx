import { notFound } from "next/navigation";
import { TodayRedirect } from "@/components/dashboard/today-redirect";
import { getBookMeta } from "@/lib/books/loader";
import { getUserProgress } from "@/lib/progress/actions";
import { calculateProgress } from "@/lib/progress/helpers";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TodayPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookMeta(slug);
  if (!book) notFound();

  const { user, dayProgress } = await getUserProgress(slug);
  const { recommendedDay } = calculateProgress(book.totalDays, dayProgress);

  return (
    <TodayRedirect
      bookSlug={slug}
      totalDays={book.totalDays}
      serverRecommendedDay={recommendedDay}
      isAuthenticated={!!user}
    />
  );
}
