"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { getPhaseForDay } from "@/lib/books/phases";
import type { ChecklistState, DayContent } from "@/types";

interface DayPanelProps {
  bookSlug: string;
  day: DayContent;
  initialChecklist: ChecklistState;
  initialReflection: string;
  initialCompleted: boolean;
  isAuthenticated: boolean;
  prevDay?: number | null;
  nextDay?: number | null;
}

function SectionTitle({ children, detail }: { children: React.ReactNode; detail?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-[17px] font-semibold text-foreground">{children}</h2>
      {detail && (
        <span className="shrink-0 text-fine tabular-nums text-muted-foreground">{detail}</span>
      )}
    </div>
  );
}

export function DayPanel({
  bookSlug,
  day,
  initialChecklist,
  initialReflection,
  initialCompleted,
  isAuthenticated,
  prevDay,
  nextDay,
}: DayPanelProps) {
  const [checklist, setChecklist] = useState<ChecklistState>(initialChecklist);
  const [reflection, setReflection] = useState(initialReflection);
  const [completed, setCompleted] = useState(initialCompleted);
  const [saving, setSaving] = useState(false);

  const storageKey = `bookhub:${bookSlug}:day:${day.dayNumber}`;
  const phase = getPhaseForDay(day.dayNumber);

  useEffect(() => {
    if (!isAuthenticated) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        setChecklist(data.checklist || {});
        setReflection(data.reflection || "");
        setCompleted(data.completed || false);
      }
    }
  }, [storageKey, isAuthenticated]);

  const saveProgress = useCallback(
    async (updates: {
      checklist?: ChecklistState;
      reflection?: string;
      completed?: boolean;
    }) => {
      setSaving(true);
      const payload = {
        bookSlug,
        dayNumber: day.dayNumber,
        checklist: updates.checklist ?? checklist,
        reflection: updates.reflection ?? reflection,
        completed: updates.completed ?? completed,
      };

      if (isAuthenticated) {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            checklist: payload.checklist,
            reflection: payload.reflection,
            completed: payload.completed,
          }),
        );
      }
      setSaving(false);
    },
    [bookSlug, day.dayNumber, checklist, reflection, completed, isAuthenticated, storageKey],
  );

  function handleChecklistChange(index: number, checked: boolean) {
    const updated = { ...checklist, [String(index)]: checked };
    setChecklist(updated);
    saveProgress({ checklist: updated });
  }

  function copyPrompt(prompt: string) {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied");
  }

  const shareText = day.optionalPost
    ? `${day.optionalPost}${day.hashtags?.length ? `\n\n${day.hashtags.join(" ")}` : ""}`
    : "";

  function copyPost() {
    navigator.clipboard.writeText(shareText);
    toast.success("Post copied — paste it anywhere");
  }

  function shareToLinkedIn() {
    navigator.clipboard.writeText(shareText);
    toast.success("Post copied — paste it into the LinkedIn composer");
    window.open(
      `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareToX() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function handleMarkComplete() {
    const updated = !completed;
    setCompleted(updated);
    await saveProgress({ completed: updated });
    if (updated) toast.success(`Day ${day.dayNumber} marked complete`);
  }

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="flex h-full flex-col pb-16 md:pb-0">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <header className="page-padding pt-8 pb-2 sm:pt-10 lg:pt-12">
          <div className="mx-auto max-w-[640px]">
          <div className="flex items-center justify-between gap-6">
            <p className="text-meta text-meta-brand">
              Day {day.dayNumber}
              <span className="mx-1.5 text-border">·</span>
              <span className="text-muted-foreground">{phase.name}</span>
            </p>

            <nav className="flex items-center gap-1.5">
              {prevDay ? (
                <Link
                  href={`/books/${bookSlug}/day/${prevDay}`}
                  aria-label={`Day ${prevDay}`}
                  title={`Day ${prevDay}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                >
                  <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/50 text-muted-foreground/30">
                  <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              )}
              {nextDay ? (
                <Link
                  href={`/books/${bookSlug}/day/${nextDay}`}
                  aria-label={`Day ${nextDay}`}
                  title={`Day ${nextDay}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                >
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/50 text-muted-foreground/30">
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              )}
            </nav>
          </div>

          <h1 className="mt-4 font-display text-[34px] font-semibold leading-[1.1] text-foreground text-balance">
            {day.title}
          </h1>
          <p className="mt-4 max-w-[560px] text-[17px] font-normal leading-[1.47] text-muted-foreground">
            {day.objective}
          </p>

          {completed && (
            <p className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-success">
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-success/15">
                <Check className="h-3 w-3" strokeWidth={2.5} />
              </span>
              Completed
            </p>
          )}
          </div>
        </header>

        <div className="page-padding pb-24 sm:pb-14 lg:pb-14">
          <div className="mx-auto max-w-[640px]">
            <div className="mt-10 h-px w-full bg-border" />

            <section className="mt-12">
            <SectionTitle>Why this matters</SectionTitle>
            <p className="text-[17px] leading-[1.47] text-foreground/75">{day.whyItMatters}</p>
          </section>

          <section className="mt-14">
            <SectionTitle>Today&apos;s work</SectionTitle>
            <ul className="space-y-3.5">
              {day.workSummary.map((item, i) => (
                <li key={i} className="flex gap-3.5 text-[17px] leading-[1.47] text-foreground/75">
                  <span className="mt-[12px] h-[3px] w-[3px] shrink-0 rounded-full bg-brand-red" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <SectionTitle
              detail={
                checkedCount === day.actionSteps.length
                  ? "All done"
                  : `${checkedCount} of ${day.actionSteps.length}`
              }
            >
              Checklist
            </SectionTitle>
            <div className="dashboard-card overflow-hidden p-0">
              {day.actionSteps.map((step, index) => (
                <div
                  key={index}
                  className="border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-foreground/[0.02]"
                >
                  <Checkbox
                    label={step}
                    checked={!!checklist[String(index)]}
                    onChange={(e) => handleChecklistChange(index, e.target.checked)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <SectionTitle>AI power-up</SectionTitle>
            <p className="mb-4 text-[17px] leading-[1.47] text-foreground/70">
              Paste this into ChatGPT or your AI of choice to move faster.
            </p>
            {day.aiPrompts.map((ai, i) => (
              <div key={i} className="dashboard-card p-5">
                <p className="text-[15px] leading-[1.47] text-foreground/80">{ai.prompt}</p>
                <div className="mt-4 flex justify-end border-t border-border pt-3.5">
                  <button
                    type="button"
                    onClick={() => copyPrompt(ai.prompt)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-red transition-opacity hover:opacity-70"
                  >
                    <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Copy prompt
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-14">
            <SectionTitle>Reflection</SectionTitle>
            <ul className="mb-5 space-y-2.5">
              {day.reflectionPrompts.map((p, i) => (
                <li key={i} className="flex gap-3.5 text-[17px] leading-[1.47] text-foreground/70">
                  <span className="mt-[12px] h-[3px] w-[3px] shrink-0 rounded-full bg-brand-red" />
                  {p}
                </li>
              ))}
            </ul>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              onBlur={() => saveProgress({ reflection })}
              placeholder="Write your thoughts — saved automatically"
              rows={6}
              className="dashboard-card px-5 py-4 text-[17px] leading-[1.47] border-0"
            />
          </section>

          {day.optionalPost && (
            <section className="mt-14">
              <SectionTitle detail="Optional">Share your progress</SectionTitle>
              <div className="dashboard-card overflow-hidden p-0">
                <div className="p-5">
                  <p className="text-[15px] leading-[1.47] text-foreground/80">
                    {day.optionalPost}
                  </p>
                  {day.hashtags && (
                    <p className="mt-3 text-[13px] text-brand-red/80">
                      {day.hashtags.join("  ")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border px-5 py-3.5">
                  <button
                    type="button"
                    onClick={shareToLinkedIn}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground/80 transition-opacity hover:opacity-70"
                  >
                    LinkedIn
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={shareToX}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground/80 transition-opacity hover:opacity-70"
                  >
                    X
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={copyPost}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Copy className="h-3 w-3" strokeWidth={1.75} />
                    Copy
                  </button>
                </div>
              </div>
            </section>
          )}
          </div>
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-14 z-30 border-t border-border bg-surface px-5 py-3 backdrop-blur-xl sm:px-8 md:static md:bottom-auto md:z-auto md:px-8 md:py-4 lg:px-10">
        <div className="mx-auto flex max-w-[640px] items-center justify-between gap-4">
          <p className="min-w-0 truncate text-[13px] text-muted-foreground">
            {day.tomorrowPreview ? (
              <>
                <span className="font-semibold text-foreground/60">Up next</span>
                {"  "}
                {day.tomorrowPreview}
              </>
            ) : (
              <span className="text-success">You&apos;ve finished the journey.</span>
            )}
          </p>
          <Button
            variant={completed ? "secondary" : "default"}
            size="sm"
            onClick={handleMarkComplete}
            disabled={saving}
            className="shrink-0 rounded-full px-4"
          >
            {completed ? (
              <>
                <Check className="h-3.5 w-3.5" strokeWidth={2} />
                Completed
              </>
            ) : (
              "Mark day complete"
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
