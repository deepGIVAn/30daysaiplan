import type { BookPhase } from "@/types";

export const BOOK_PHASES: BookPhase[] = [
  {
    id: "clarity",
    name: "Clarity",
    days: [1, 5],
    theme: "Audit, values, audience, vision, positioning",
  },
  {
    id: "foundation",
    name: "Foundation",
    days: [6, 10],
    theme: "Story, differentiator, pillars, LinkedIn, bios, video",
  },
  {
    id: "visibility",
    name: "Visibility",
    days: [11, 15],
    theme: "Visual identity, thought leadership, communities, testimonials",
  },
  {
    id: "authority",
    name: "Authority",
    days: [16, 20],
    theme: "Articles, case studies, lead magnets, networking",
  },
  {
    id: "momentum",
    name: "Momentum",
    days: [21, 30],
    theme: "Proof, connections, calendar, signature offer, tracker",
  },
];

export function getPhaseForDay(dayNumber: number): BookPhase {
  const phase = BOOK_PHASES.find(
    (p) => dayNumber >= p.days[0] && dayNumber <= p.days[1],
  );
  return phase ?? BOOK_PHASES[0];
}
