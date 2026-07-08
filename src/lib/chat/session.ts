export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const CARA_MET_KEY = "bookhub:cara:met";

export function chatStorageKey(bookSlug: string) {
  return `bookhub:cara:chat:${bookSlug}`;
}

export function hasMetCara() {
  try {
    return localStorage.getItem(CARA_MET_KEY) === "1";
  } catch {
    return false;
  }
}

export function markMetCara() {
  try {
    localStorage.setItem(CARA_MET_KEY, "1");
  } catch {
    // ignore
  }
}

export function loadChatSession(bookSlug: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(chatStorageKey(bookSlug));
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (m): m is ChatMessage =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0,
      )
      .slice(-40);
  } catch {
    return [];
  }
}

export function saveChatSession(bookSlug: string, messages: ChatMessage[]) {
  try {
    const trimmed = messages
      .filter((m) => m.content.trim().length > 0)
      .slice(-40);
    localStorage.setItem(chatStorageKey(bookSlug), JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

/** Compact prior-day signals from localStorage for the chat API. */
export function readLocalJourneySignals(bookSlug: string, totalDays: number) {
  const signals: Array<{
    dayNumber: number;
    completed: boolean;
    reflection: string;
    checklistDone: number;
  }> = [];

  if (typeof window === "undefined") return signals;

  for (let day = 1; day <= totalDays; day++) {
    try {
      const raw = localStorage.getItem(`bookhub:${bookSlug}:day:${day}`);
      if (!raw) continue;
      const data = JSON.parse(raw);
      const checklist = data.checklist && typeof data.checklist === "object" ? data.checklist : {};
      const checklistDone = Object.values(checklist).filter(Boolean).length;
      const reflection =
        typeof data.reflection === "string" ? data.reflection.trim().slice(0, 280) : "";
      const completed = !!data.completed;
      if (!completed && checklistDone === 0 && !reflection) continue;
      signals.push({ dayNumber: day, completed, reflection, checklistDone });
    } catch {
      // skip corrupt
    }
  }

  return signals;
}
