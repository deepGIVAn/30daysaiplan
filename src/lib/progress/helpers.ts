import type { DayProgress } from "@/types";

export function calculateProgress(
  totalDays: number,
  dayProgress: DayProgress[],
): {
  completedDays: number;
  percentComplete: number;
  recommendedDay: number;
} {
  const completedDays = dayProgress.filter((d) => d.completed).length;
  const percentComplete = Math.round((completedDays / totalDays) * 100);

  const completedNumbers = dayProgress
    .filter((d) => d.completed)
    .map((d) => d.day_number)
    .sort((a, b) => a - b);

  let recommendedDay = 1;
  if (completedNumbers.length > 0) {
    const lastCompleted = completedNumbers[completedNumbers.length - 1];
    recommendedDay = Math.min(lastCompleted + 1, totalDays);
  }

  return { completedDays, percentComplete, recommendedDay };
}

export function calculateStreak(dayProgress: DayProgress[]): number {
  const activeDays = dayProgress
    .filter((d) => {
      const hasChecklist = Object.values(d.checklist_state || {}).some(Boolean);
      return d.completed || hasChecklist;
    })
    .map((d) => d.day_number)
    .sort((a, b) => b - a);

  if (activeDays.length === 0) return 0;

  let streak = 0;
  let expected = activeDays[0];

  for (const day of activeDays) {
    if (day === expected) {
      streak++;
      expected--;
    } else {
      break;
    }
  }

  return streak;
}

export function getPhaseProgress(
  dayProgress: DayProgress[],
  startDay: number,
  endDay: number,
): number {
  const phaseDays = dayProgress.filter(
    (d) => d.day_number >= startDay && d.day_number <= endDay,
  );
  const completed = phaseDays.filter((d) => d.completed).length;
  const total = endDay - startDay + 1;
  return Math.round((completed / total) * 100);
}
