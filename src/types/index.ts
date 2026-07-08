export type BookStatus = "available" | "coming_soon";

export type PhaseId =
  | "clarity"
  | "foundation"
  | "visibility"
  | "authority"
  | "momentum";

export interface BookPhase {
  id: PhaseId;
  name: string;
  days: [number, number];
  theme: string;
}

export interface BookMeta {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  totalDays: number;
  status: BookStatus;
  durationLabel: string;
  author: string;
  publisher: string;
  phases: BookPhase[];
  coverGradient: string;
}

export interface DayContent {
  dayNumber: number;
  title: string;
  phase: PhaseId;
  quote?: string;
  objective: string;
  whyItMatters: string;
  workSummary: string[];
  aiPrompts: { label: string; prompt: string }[];
  reflectionPrompts: string[];
  actionSteps: string[];
  optionalPost?: string;
  hashtags?: string[];
  tomorrowPreview?: string;
}

export interface BookRegistryEntry {
  slug: string;
  title: string;
  tagline: string;
  status: BookStatus;
  totalDays: number;
  durationLabel: string;
  coverGradient: string;
}

export interface ChecklistState {
  [stepIndex: string]: boolean;
}

export interface DayProgress {
  day_number: number;
  checklist_state: ChecklistState;
  completed: boolean;
  completed_at: string | null;
}

export interface Reflection {
  id: string;
  day_number: number;
  content: string;
  updated_at: string;
}

export interface Enrollment {
  book_slug: string;
  current_day: number;
  started_at: string;
}

export interface ContentChunk {
  id: string;
  bookSlug: string;
  dayNumber: number;
  section: string;
  text: string;
}
