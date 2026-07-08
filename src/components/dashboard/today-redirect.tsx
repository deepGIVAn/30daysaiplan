"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateProgress } from "@/lib/progress/helpers";
import { readLocalProgress } from "@/lib/progress/local";

interface TodayRedirectProps {
  bookSlug: string;
  totalDays: number;
  serverRecommendedDay: number;
  isAuthenticated: boolean;
}

export function TodayRedirect({
  bookSlug,
  totalDays,
  serverRecommendedDay,
  isAuthenticated,
}: TodayRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    let day = serverRecommendedDay;
    if (!isAuthenticated) {
      const { dayProgress } = readLocalProgress(bookSlug, totalDays);
      day = calculateProgress(totalDays, dayProgress).recommendedDay;
    }
    router.replace(`/books/${bookSlug}/day/${day}`);
  }, [router, bookSlug, totalDays, serverRecommendedDay, isAuthenticated]);

  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-muted-foreground animate-pulse">
        Finding your current day…
      </p>
    </div>
  );
}
