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
