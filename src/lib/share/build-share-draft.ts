import type { DayContent } from "@/types";

/** Build a valuable, share-ready post draft from day content + optional reflection. */
export function buildShareDraft(
  day: DayContent,
  reflection?: string,
): string {
  const insight = day.whyItMatters.trim();
  const workLine =
    day.workSummary[0]?.replace(/\.$/, "") ||
    day.actionSteps[0]?.replace(/\.$/, "") ||
    day.objective;

  const reflectionLine = reflection?.trim()
    ? reflection.trim().length > 220
      ? `${reflection.trim().slice(0, 217).trim()}…`
      : reflection.trim()
    : null;

  const hook =
    day.optionalPost?.trim() ||
    `Day ${day.dayNumber} of my personal brand journey: ${day.title}.`;

  const parts = [
    hook,
    "",
    `Here's what I'm learning:`,
    insight,
    "",
    `Today I focused on:`,
    `→ ${workLine}`,
  ];

  if (reflectionLine) {
    parts.push("", `My takeaway:`, reflectionLine);
  } else {
    parts.push(
      "",
      `My takeaway:`,
      `Clarity compounds. Small, intentional brand actions beat random visibility every time.`,
    );
  }

  parts.push(
    "",
    `If you're building your brand too — what's one thing you're refining this week?`,
  );

  if (day.hashtags?.length) {
    parts.push("", day.hashtags.join(" "));
  }

  return parts.join("\n");
}
