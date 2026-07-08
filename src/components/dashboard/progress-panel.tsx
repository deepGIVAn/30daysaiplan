"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PhaseTimeline } from "@/components/dashboard/journey-map";
import { calculateProgress, calculateStreak } from "@/lib/progress/helpers";
import { readLocalProgress } from "@/lib/progress/local";
import type { DayProgress } from "@/types";

interface ReflectionEntry {
  dayNumber: number;
  content: string;
}

interface ProgressPanelProps {
  bookSlug: string;
  totalDays: number;
  serverProgress: DayProgress[];
  serverReflections: ReflectionEntry[];
  isAuthenticated: boolean;
  userEmail?: string | null;
}

export function ProgressPanel({
  bookSlug,
  totalDays,
  serverProgress,
  serverReflections,
  isAuthenticated,
  userEmail,
}: ProgressPanelProps) {
  const [dayProgress, setDayProgress] = useState<DayProgress[]>(serverProgress);
  const [reflections, setReflections] = useState<ReflectionEntry[]>(serverReflections);

  useEffect(() => {
    if (!isAuthenticated) {
      const local = readLocalProgress(bookSlug, totalDays);
      setDayProgress(local.dayProgress);
      setReflections(local.reflections);
    }
  }, [isAuthenticated, bookSlug, totalDays]);

  const { completedDays, percentComplete } = calculateProgress(totalDays, dayProgress);
  const streak = calculateStreak(dayProgress);
  const isComplete = completedDays === totalDays;

  const completedSet = new Set(
    dayProgress.filter((d) => d.completed).map((d) => d.day_number),
  );
  const reflectionsWithContent = reflections.filter((r) => r.content?.trim());

  return (
    <div className="page-padding pb-10 pt-2">
      <div>
        <h1 className="font-display text-[26px] font-semibold text-foreground sm:text-[28px]">
          Progress
        </h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Track completion, streaks, and reflections
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="dashboard-card-hero p-5 sm:col-span-2 xl:col-span-1">
          <p className="text-[13px] text-white/80">Overall complete</p>
          <p className="mt-3 font-display text-[40px] font-semibold leading-none tabular-nums">
            {percentComplete}%
          </p>
          <Progress value={percentComplete} className="mt-4" />
        </div>
        <div className="dashboard-card p-5">
          <p className="text-fine text-muted-foreground">Days done</p>
          <p className="mt-3 font-display text-[28px] font-semibold tabular-nums">
            {completedDays}
            <span className="text-base text-muted-foreground"> / {totalDays}</span>
          </p>
        </div>
        <div className="dashboard-card p-5">
          <p className="text-fine text-muted-foreground">Streak</p>
          <p className="mt-3 font-display text-[28px] font-semibold tabular-nums">
            {streak}
            <span className="text-base text-muted-foreground"> days</span>
          </p>
        </div>
        <div className="dashboard-card p-5">
          <p className="text-fine text-muted-foreground">Reflections</p>
          <p className="mt-3 font-display text-[28px] font-semibold tabular-nums">
            {reflectionsWithContent.length}
          </p>
        </div>
      </div>

      {isComplete && (
        <div className="dashboard-card mt-6 p-6">
          <Trophy className="h-5 w-5 text-brand-red" strokeWidth={1.75} />
          <h2 className="mt-3 font-display text-lg font-semibold text-foreground">
            30-day journey complete
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Certificate earned — {userEmail || "Brand Builder"}
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card p-5">
          <h2 className="font-display text-[16px] font-semibold text-foreground">Phases</h2>
          <div className="mt-4">
            <PhaseTimeline dayProgress={dayProgress} />
          </div>
        </section>

        <section className="dashboard-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[16px] font-semibold text-foreground">Day-by-day</h2>
            <span className="text-fine text-muted-foreground">{completedDays} done</span>
          </div>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
              const isCompleted = completedSet.has(day);
              const hasActivity = dayProgress.some(
                (d) =>
                  d.day_number === day &&
                  (d.completed || Object.values(d.checklist_state || {}).some(Boolean)),
              );
              return (
                <Link
                  key={day}
                  href={`/books/${bookSlug}/day/${day}`}
                  title={`Day ${day}`}
                  className={`flex min-h-10 items-center justify-center rounded-lg text-[11px] font-semibold tabular-nums transition-colors ${
                    isCompleted
                      ? "bg-success/15 text-success"
                      : hasActivity
                        ? "bg-primary-soft text-primary"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {isCompleted ? <Check className="h-3 w-3" strokeWidth={2} /> : day}
                </Link>
              );
            })}
          </div>
          <p className="text-fine mt-3 text-muted-foreground">
            Green — completed · Red tint — in progress
          </p>
        </section>
      </div>

      {reflectionsWithContent.length > 0 && (
        <section className="dashboard-card mt-6 p-5">
          <h2 className="font-display text-[16px] font-semibold text-foreground">Reflections</h2>
          <div className="mt-4 divide-y divide-border">
            {reflectionsWithContent
              .sort((a, b) => a.dayNumber - b.dayNumber)
              .map((r) => (
                <div key={r.dayNumber} className="py-4 first:pt-0 last:pb-0">
                  <Link
                    href={`/books/${bookSlug}/day/${r.dayNumber}`}
                    className="text-meta font-semibold text-primary hover:opacity-80"
                  >
                    Day {r.dayNumber}
                  </Link>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground line-clamp-3">
                    {r.content}
                  </p>
                </div>
              ))}
          </div>
        </section>
      )}

      {!isAuthenticated && (
        <div className="dashboard-card mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Progress saved on this device</p>
            <p className="mt-0.5 text-fine text-muted-foreground">Sign up to sync to the cloud</p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
