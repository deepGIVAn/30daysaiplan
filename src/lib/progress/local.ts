import type { DayProgress } from "@/types";

export interface LocalReflection {
  dayNumber: number;
  content: string;
}

/**
 * Guest progress lives in localStorage under `bookhub:<slug>:day:<n>`.
 * Reads it back into the same shape the server returns for signed-in users.
 */
export function readLocalProgress(
  bookSlug: string,
  totalDays: number,
): { dayProgress: DayProgress[]; reflections: LocalReflection[] } {
  const dayProgress: DayProgress[] = [];
  const reflections: LocalReflection[] = [];

  if (typeof window === "undefined") return { dayProgress, reflections };

  for (let day = 1; day <= totalDays; day++) {
    const raw = localStorage.getItem(`bookhub:${bookSlug}:day:${day}`);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw);
      dayProgress.push({
        day_number: day,
        checklist_state: data.checklist || {},
        completed: !!data.completed,
        completed_at: null,
      });
      if (typeof data.reflection === "string" && data.reflection.trim()) {
        reflections.push({ dayNumber: day, content: data.reflection });
      }
    } catch {
      // corrupt entry — skip
    }
  }

  return { dayProgress, reflections };
}

export function clearLocalProgress(bookSlug: string, totalDays: number) {
  if (typeof window === "undefined") return;
  for (let day = 1; day <= totalDays; day++) {
    localStorage.removeItem(`bookhub:${bookSlug}:day:${day}`);
  }
}

/** Upload guest localStorage progress to the server after sign-in. */
export async function migrateLocalProgressToServer(bookSlug: string, totalDays: number) {
  const { dayProgress, reflections } = readLocalProgress(bookSlug, totalDays);
  if (dayProgress.length === 0) return;

  const reflectionMap = new Map(reflections.map((r) => [r.dayNumber, r.content]));

  await Promise.all(
    dayProgress.map(async (day) => {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookSlug,
          dayNumber: day.day_number,
          checklist: day.checklist_state || {},
          reflection: reflectionMap.get(day.day_number) || "",
          completed: day.completed,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to sync progress");
      }
    }),
  );

  clearLocalProgress(bookSlug, totalDays);
}
