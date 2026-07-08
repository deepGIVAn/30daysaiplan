"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Flame, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { JourneyMap, PhaseTimeline } from "@/components/dashboard/journey-map";
import { getPhaseForDay } from "@/lib/books/phases";
import { calculateProgress, calculateStreak } from "@/lib/progress/helpers";
import { readLocalProgress } from "@/lib/progress/local";
import type { DayProgress } from "@/types";

export interface DaySummary {
  dayNumber: number;
  title: string;
  objective: string;
}

interface OverviewPanelProps {
  bookSlug: string;
  bookTitle: string;
  tagline: string;
  totalDays: number;
  daySummaries: DaySummary[];
  serverProgress: DayProgress[];
  isAuthenticated: boolean;
}

function StatCard({
  label,
  value,
  hint,
  hero,
}: {
  label: string;
  value: string | number;
  hint?: string;
  hero?: boolean;
}) {
  return (
    <div className={hero ? "dashboard-card-hero p-5" : "dashboard-card p-5"}>
      <div className="flex items-start justify-between gap-2">
        <p className={hero ? "text-[13px] text-white/80" : "text-fine text-muted-foreground"}>
          {label}
        </p>
        <span
          className={
            hero
              ? "flex h-8 w-8 items-center justify-center rounded-full bg-white/15"
              : "flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted"
          }
        >
          <ArrowUpRight
            className={hero ? "h-4 w-4 text-white" : "h-4 w-4 text-muted-foreground"}
            strokeWidth={1.75}
          />
        </span>
      </div>
      <p
        className={
          hero
            ? "mt-3 font-display text-[32px] font-semibold leading-none tabular-nums"
            : "mt-3 font-display text-[28px] font-semibold leading-none tabular-nums text-foreground"
        }
      >
        {value}
      </p>
      {hint && (
        <p
          className={
            hero
              ? "mt-2 flex items-center gap-1 text-[12px] text-white/70"
              : "mt-2 flex items-center gap-1 text-fine text-muted-foreground"
          }
        >
          <TrendingUp className="h-3 w-3" strokeWidth={2} />
          {hint}
        </p>
      )}
    </div>
  );
}

export function OverviewPanel({
  bookSlug,
  bookTitle,
  tagline,
  totalDays,
  daySummaries,
  serverProgress,
  isAuthenticated,
}: OverviewPanelProps) {
  const [dayProgress, setDayProgress] = useState<DayProgress[]>(serverProgress);

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      const { dayProgress: local } = readLocalProgress(bookSlug, totalDays);
      setDayProgress(local);
    }
  }, [isAuthenticated, bookSlug, totalDays]);

  const { completedDays, percentComplete, recommendedDay } = calculateProgress(
    totalDays,
    dayProgress,
  );
  const streak = calculateStreak(dayProgress);
  const todaySummary = daySummaries.find((d) => d.dayNumber === recommendedDay);
  const journeyDone = completedDays === totalDays;
  const todayPhase = getPhaseForDay(recommendedDay);
  const remaining = totalDays - completedDays;

  return (
    <div className="page-padding pb-10 pt-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-semibold text-foreground sm:text-[28px]">
            Dashboard
          </h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Plan your work and track your brand journey
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`/books/${bookSlug}/today`}>
            {completedDays === 0 ? "Start Day 1" : `Continue Day ${recommendedDay}`}
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Overall progress"
          value={`${percentComplete}%`}
          hint={completedDays > 0 ? "Keep the momentum going" : "Start your journey today"}
          hero
        />
        <StatCard
          label="Days completed"
          value={completedDays}
          hint={`of ${totalDays} total days`}
        />
        <StatCard label="Days remaining" value={remaining} hint="Until journey complete" />
        <StatCard
          label="Current streak"
          value={streak > 0 ? `${streak} days` : "—"}
          hint={streak > 0 ? "Consistency builds trust" : "Complete a day to start"}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="dashboard-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[16px] font-semibold text-foreground">
              Journey phases
            </h2>
            <span className="text-fine text-muted-foreground">{percentComplete}% overall</span>
          </div>
          <PhaseTimeline dayProgress={dayProgress} />
        </section>

        {!journeyDone && todaySummary ? (
          <section className="dashboard-card p-5">
            <h2 className="font-display text-[16px] font-semibold text-foreground">Reminder</h2>
            <p className="mt-3 inline-flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-lg bg-primary px-2.5 py-1 text-[12px] font-semibold tabular-nums text-primary-foreground">
                Day {recommendedDay}
              </span>
              <span className="inline-flex items-center rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-[12px] font-medium text-foreground/70">
                {todayPhase.name}
              </span>
            </p>
            <p className="mt-2 font-semibold text-[15px] leading-snug text-foreground">
              {todaySummary.title}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-3">
              {todaySummary.objective}
            </p>
            <Button size="sm" className="mt-4 w-full" asChild>
              <Link href={`/books/${bookSlug}/day/${recommendedDay}`}>
                {completedDays === 0 ? "Start Day 1" : `Open Day ${recommendedDay}`}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Link>
            </Button>
          </section>
        ) : (
          <section className="dashboard-card flex flex-col items-center justify-center p-5 text-center">
            <p className="text-success font-semibold">Journey complete</p>
            <p className="mt-1 text-fine text-muted-foreground">Well done — you finished all 30 days.</p>
          </section>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="dashboard-card p-5 lg:col-span-2" id="journey">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[16px] font-semibold text-foreground">30-day map</h2>
            <Link
              href={`/books/${bookSlug}/progress`}
              className="text-fine font-semibold text-primary hover:opacity-80"
            >
              View all
            </Link>
          </div>
          <JourneyMap
            bookSlug={bookSlug}
            totalDays={totalDays}
            recommendedDay={recommendedDay}
            dayProgress={dayProgress}
          />
        </section>

        <section className="dashboard-card p-5">
          <h2 className="font-display text-[16px] font-semibold text-foreground">
            {bookTitle}
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{tagline}</p>
          <div className="mt-5">
            <div className="flex items-center justify-between text-fine">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold tabular-nums">{percentComplete}%</span>
            </div>
            <Progress value={percentComplete} className="mt-2" />
          </div>
          {streak > 0 && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-red">
              <Flame className="h-4 w-4" strokeWidth={1.75} />
              {streak}-day streak
            </p>
          )}
        </section>
      </div>

    </div>
  );
}
