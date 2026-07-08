"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPhaseForDay } from "@/lib/books/phases";
import type { DayProgress } from "@/types";

interface JourneyMapProps {
  bookSlug: string;
  totalDays: number;
  recommendedDay: number;
  dayProgress: DayProgress[];
}

export function JourneyMap({
  bookSlug,
  totalDays,
  recommendedDay,
  dayProgress,
}: JourneyMapProps) {
  const completedSet = new Set(
    dayProgress.filter((d) => d.completed).map((d) => d.day_number),
  );

  return (
    <div className="space-y-1">
      {/* Week rows — reads like a calendar, not a button grid */}
      {Array.from({ length: Math.ceil(totalDays / 7) }, (_, week) => (
        <div key={week} className="flex gap-px">
          {Array.from({ length: 7 }, (_, dow) => {
            const day = week * 7 + dow + 1;
            if (day > totalDays) {
              return <div key={dow} className="flex-1" />;
            }

            const isCompleted = completedSet.has(day);
            const isToday = day === recommendedDay;
            const phase = getPhaseForDay(day);

            return (
              <Link
                key={day}
                href={`/books/${bookSlug}/day/${day}`}
                title={`${phase.name} · Day ${day}`}
                className={cn(
                  "group relative flex min-h-11 flex-1 flex-col items-center justify-center rounded-lg py-2 transition-all duration-300 sm:min-h-10",
                  "hover:bg-foreground/[0.04]",
                  isToday && !isCompleted && "bg-primary-soft ring-1 ring-inset ring-primary/15",
                  isCompleted && "bg-success/[0.06]",
                )}
              >
                {isToday && !isCompleted && (
                  <>
                    <span className="absolute top-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(210,111,21,0.45)]" />
                    <span className="absolute -top-px right-1.5 rounded-b-md bg-primary px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white">
                      Now
                    </span>
                  </>
                )}
                <span
                  className={cn(
                    "mb-1 text-[11px] tabular-nums",
                    isCompleted && "font-semibold text-success",
                    isToday && !isCompleted && "font-bold text-primary",
                    !isToday && !isCompleted && "text-muted-foreground/60",
                  )}
                >
                  {day}
                </span>
                {isCompleted ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-success to-emerald-600 text-white shadow-[0_2px_8px_rgba(22,163,74,0.45)] ring-2 ring-success/25 transition-all duration-300 group-hover:scale-105">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                ) : isToday ? (
                  <span className="relative h-7 w-7 transition-all duration-300 group-hover:scale-105">
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary/25" />
                    <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#B85F12] text-white shadow-[0_2px_8px_rgba(210,111,21,0.45)] ring-2 ring-primary/30">
                      <span className="h-2 w-2 rounded-full bg-white shadow-sm" />
                    </span>
                  </span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40 transition-all duration-300 group-hover:scale-105 group-hover:text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-current" />
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface PhaseTimelineProps {
  dayProgress: DayProgress[];
}

export function PhaseTimeline({ dayProgress }: PhaseTimelineProps) {
  const phases = [
    { id: "clarity", name: "Clarity", days: [1, 5] },
    { id: "foundation", name: "Foundation", days: [6, 10] },
    { id: "visibility", name: "Visibility", days: [11, 15] },
    { id: "authority", name: "Authority", days: [16, 20] },
    { id: "momentum", name: "Momentum", days: [21, 30] },
  ];

  return (
    <div className="space-y-3">
      {phases.map((phase) => {
        const total = phase.days[1] - phase.days[0] + 1;
        const completed = dayProgress.filter(
          (d) =>
            d.completed &&
            d.day_number >= phase.days[0] &&
            d.day_number <= phase.days[1],
        ).length;
        const pct = Math.round((completed / total) * 100);

        return (
          <div key={phase.id} className="grid grid-cols-[96px_1fr_36px] items-center gap-3">
            <span className="text-[13px] text-muted-foreground">{phase.name}</span>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-right text-[13px] tabular-nums text-muted-foreground">
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
