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
import { buildShareDraft } from "@/lib/share/build-share-draft";
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
  const [shareDraft, setShareDraft] = useState(() =>
    buildShareDraft(day, initialReflection),
  );
  const [shareEdited, setShareEdited] = useState(false);

  const storageKey = `bookhub:${bookSlug}:day:${day.dayNumber}`;
  const phase = getPhaseForDay(day.dayNumber);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    let existing: {
      checklist?: ChecklistState;
      reflection?: string;
      completed?: boolean;
      shareDraft?: string;
    } = {};

    if (saved) {
      try {
        existing = JSON.parse(saved);
        if (!isAuthenticated) {
          setChecklist(existing.checklist || {});
          setReflection(existing.reflection || "");
          setCompleted(existing.completed || false);
        }
        if (typeof existing.shareDraft === "string" && existing.shareDraft.trim()) {
          setShareDraft(existing.shareDraft);
          setShareEdited(true);
        } else {
          setShareDraft(
            buildShareDraft(
              day,
              !isAuthenticated ? existing.reflection || "" : initialReflection,
            ),
          );
          setShareEdited(false);
        }
      } catch {
        localStorage.removeItem(storageKey);
        existing = {};
        setShareDraft(buildShareDraft(day, initialReflection));
        setShareEdited(false);
      }
    } else {
      setShareDraft(buildShareDraft(day, initialReflection));
      setShareEdited(false);
    }

    // Seed localStorage so CARA can read live day state even before the user edits.
    try {
      const seededChecklist = isAuthenticated
        ? initialChecklist
        : existing.checklist || {};
      const seededReflection = isAuthenticated
        ? initialReflection
        : existing.reflection || "";
      const seededCompleted = isAuthenticated
        ? initialCompleted
        : !!existing.completed;
      const seededShare =
        typeof existing.shareDraft === "string" && existing.shareDraft.trim()
          ? existing.shareDraft
          : buildShareDraft(day, seededReflection);

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          checklist: seededChecklist,
          reflection: seededReflection,
          completed: seededCompleted,
          shareDraft: seededShare,
        }),
      );
    } catch {
      // ignore storage failures
    }
  }, [
    storageKey,
    isAuthenticated,
    day,
    initialReflection,
    initialChecklist,
    initialCompleted,
  ]);

  function persistShareDraft(nextDraft: string, edited: boolean) {
    setShareDraft(nextDraft);
    setShareEdited(edited);
    try {
      const existing = localStorage.getItem(storageKey);
      const data = existing ? JSON.parse(existing) : {};
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          checklist: data.checklist ?? checklist,
          reflection: data.reflection ?? reflection,
          completed: data.completed ?? completed,
          shareDraft: nextDraft,
        }),
      );
    } catch {
      // ignore storage failures
    }
  }

  function refreshShareDraft() {
    const next = buildShareDraft(day, reflection);
    persistShareDraft(next, false);
    toast.success("Share draft refreshed with your latest reflection");
  }

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

      // Always mirror to localStorage so CARA can read live day state.
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            checklist: payload.checklist,
            reflection: payload.reflection,
            completed: payload.completed,
            shareDraft,
          }),
        );
      } catch {
        // ignore storage failures
      }

      if (isAuthenticated) {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          toast.error("Could not save progress. Please try again.");
        }
      }
      setSaving(false);
    },
    [bookSlug, day.dayNumber, checklist, reflection, completed, isAuthenticated, storageKey, shareDraft],
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

  function copyPost() {
    navigator.clipboard.writeText(shareDraft);
    toast.success("Post copied — paste it anywhere");
  }

  function shareToLinkedIn() {
    navigator.clipboard.writeText(shareDraft);
    toast.success("Post copied — paste it into the LinkedIn composer");
    window.open(
      `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareDraft)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareToX() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareDraft)}`,
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-lg bg-primary px-2.5 py-1 text-[12px] font-semibold tabular-nums text-primary-foreground">
                Day {day.dayNumber}
              </span>
              <span className="inline-flex items-center rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-[12px] font-medium text-foreground/70">
                {phase.name}
              </span>
            </div>

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
              placeholder="Write your thoughts"
              rows={6}
              className="dashboard-card px-5 py-4 text-[17px] leading-[1.47] border-0"
            />
          </section>

          <section className="mt-14">
            <SectionTitle>Share your progress</SectionTitle>
            <p className="mb-4 text-[15px] leading-relaxed text-muted-foreground">
              A ready-to-post draft with today&apos;s insight, what you worked on, and a takeaway.
              Edit it so it sounds like you — then share.
            </p>
            <div className="dashboard-card overflow-hidden p-0">
              <div className="border-b border-border px-5 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[12px] font-medium text-muted-foreground">
                    LinkedIn / X draft
                    {shareEdited ? " · edited" : " · generated"}
                  </p>
                  <button
                    type="button"
                    onClick={refreshShareDraft}
                    className="text-[12px] font-semibold text-primary transition-opacity hover:opacity-70"
                  >
                    Refresh from reflection
                  </button>
                </div>
              </div>
              <Textarea
                value={shareDraft}
                onChange={(e) => persistShareDraft(e.target.value, true)}
                rows={12}
                className="min-h-[220px] resize-y rounded-none border-0 bg-transparent px-5 py-4 text-[15px] leading-[1.55] shadow-none focus-visible:ring-0"
              />
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
          </div>
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-14 z-30 border-t border-border bg-surface px-5 py-3 backdrop-blur-xl sm:px-8 md:static md:bottom-auto md:z-auto md:px-8 md:py-4 lg:px-10">
        <div className="mx-auto flex max-w-[640px] items-center justify-between gap-3">
          <p className="min-w-0 truncate text-[13px] text-muted-foreground">
            {completed && nextDay ? (
              <>
                <span className="font-semibold text-success">Day {day.dayNumber} done</span>
                {day.tomorrowPreview ? (
                  <>
                    <span className="mx-1.5 text-border">·</span>
                    {day.tomorrowPreview}
                  </>
                ) : null}
              </>
            ) : day.tomorrowPreview ? (
              <>
                <span className="font-semibold text-foreground/60">Up next</span>
                {"  "}
                {day.tomorrowPreview}
              </>
            ) : (
              <span className="text-success">You&apos;ve finished the journey.</span>
            )}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            {completed ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkComplete}
                  disabled={saving}
                  className="rounded-full px-3 text-muted-foreground"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  Undo
                </Button>
                {nextDay ? (
                  <Button size="sm" asChild className="rounded-full px-4">
                    <Link href={`/books/${bookSlug}/day/${nextDay}`}>
                      Continue to Day {nextDay}
                      <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </Link>
                  </Button>
                ) : (
                  <Button size="sm" asChild className="rounded-full px-4">
                    <Link href={`/books/${bookSlug}/progress`}>View progress</Link>
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                onClick={handleMarkComplete}
                disabled={saving}
                className="rounded-full px-4"
              >
                Mark day complete
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
