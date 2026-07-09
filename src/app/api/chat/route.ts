import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDayContent } from "@/lib/books/loader";
import { getPhaseForDay } from "@/lib/books/phases";
import { retrieveContext, formatChunksForPrompt } from "@/lib/rag/retrieve";
import { getOpenAIClient, COACH_SYSTEM_PROMPT, sanitizeCaraText } from "@/lib/openai/client";
import type { ChecklistState } from "@/types";

function formatChecklistStatus(daySteps: string[], checklist: ChecklistState | null | undefined) {
  if (!daySteps.length) return "No checklist available.";
  const state = checklist || {};
  return daySteps
    .map((step, index) => {
      const done = !!state[String(index)];
      return `${done ? "[x]" : "[ ]"} ${index + 1}. ${step}`;
    })
    .join("\n");
}

function incompleteSteps(daySteps: string[], checklist: ChecklistState | null | undefined) {
  const state = checklist || {};
  return daySteps
    .map((step, index) => ({ step, index, done: !!state[String(index)] }))
    .filter((item) => !item.done)
    .map((item) => `${item.index + 1}. ${item.step}`);
}

/** Cap reply length by how much depth the user actually asked for. */
function estimateReplyBudget(message: string) {
  const text = message.trim().toLowerCase();
  const words = text.split(/\s+/).filter(Boolean).length;

  const wantsDepth =
    /\b(explain|detail|detailed|walk me through|step by step|break( it)? down|help me write|draft|rewrite|elaborate|in depth|thorough|full|everything|why does|how does)\b/.test(
      text,
    ) ||
    (text.includes("?") && words > 25);

  const looksShort =
    words <= 8 ||
    /^(hi|hello|hey|thanks|thank you|ok|okay|yes|no|yep|nope|sure|cool|got it)\b/.test(text) ||
    /^(what('?s| is) (today|my day|this day)|which day|am i on)\b/.test(text);

  if (wantsDepth) return 500;
  if (looksShort) return 120;
  return 220;
}

type HistoryItem = { role: "user" | "assistant"; content: string };
type JourneySignal = {
  dayNumber: number;
  completed?: boolean;
  reflection?: string;
  checklistDone?: number;
};

function normalizeHistory(raw: unknown): HistoryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is HistoryItem =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-16);
}

function formatJourneyMemory(bookSlug: string, signals: JourneySignal[]) {
  if (!Array.isArray(signals) || signals.length === 0) {
    return "No prior day work recorded yet.";
  }

  return signals
    .filter((s) => typeof s?.dayNumber === "number")
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((s) => {
      const day = getDayContent(bookSlug, s.dayNumber);
      const title = day?.title || `Day ${s.dayNumber}`;
      const status = s.completed ? "completed" : "in progress";
      const checklist =
        typeof s.checklistDone === "number"
          ? `checklist items done: ${s.checklistDone}`
          : "checklist unknown";
      const reflection =
        typeof s.reflection === "string" && s.reflection.trim()
          ? `reflection: ${s.reflection.trim().slice(0, 280)}`
          : "no reflection yet";
      return `Day ${s.dayNumber} (${title}): ${status}; ${checklist}; ${reflection}`;
    })
    .join("\n");
}

export async function POST(request: Request) {
  try {
    const {
      message,
      bookSlug,
      contextDay,
      clientProgress,
      onDayPage,
      history: rawHistory,
      journeySignals,
    } = await request.json();

    if (!message || !bookSlug) {
      return NextResponse.json({ error: "Missing message or bookSlug" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Add OPENAI_API_KEY to .env.local" },
        { status: 503 },
      );
    }

    const activelyOnDay = onDayPage === true;
    const dayNumber = typeof contextDay === "number" ? contextDay : parseInt(String(contextDay), 10);
    const dayContent =
      activelyOnDay && Number.isFinite(dayNumber) ? getDayContent(bookSlug, dayNumber) : null;
    const phase =
      activelyOnDay && Number.isFinite(dayNumber) ? getPhaseForDay(dayNumber) : null;
    const chunks = retrieveContext(
      bookSlug,
      message,
      activelyOnDay && Number.isFinite(dayNumber) ? dayNumber : undefined,
    );
    const contextText = formatChunksForPrompt(chunks);
    const history = normalizeHistory(rawHistory);

    let checklist: ChecklistState | null = null;
    let completed = false;
    let reflection = "";
    let serverJourneySignals: JourneySignal[] = [];

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const [{ data: allProgress }, { data: allReflections }] = await Promise.all([
            supabase
              .from("day_progress")
              .select("day_number, checklist_state, completed")
              .eq("user_id", user.id)
              .eq("book_slug", bookSlug),
            supabase
              .from("reflections")
              .select("day_number, content")
              .eq("user_id", user.id)
              .eq("book_slug", bookSlug),
          ]);

          const reflectionByDay = new Map(
            (allReflections || []).map((r) => [r.day_number as number, r.content as string]),
          );

          serverJourneySignals = (allProgress || [])
            .map((p) => {
              const state = (p.checklist_state || {}) as ChecklistState;
              const checklistDone = Object.values(state).filter(Boolean).length;
              const dayReflection =
                typeof reflectionByDay.get(p.day_number) === "string"
                  ? String(reflectionByDay.get(p.day_number)).trim().slice(0, 280)
                  : "";
              return {
                dayNumber: p.day_number as number,
                completed: !!p.completed,
                reflection: dayReflection,
                checklistDone,
              };
            })
            .filter((s) => s.completed || s.checklistDone > 0 || !!s.reflection);

          if (activelyOnDay && Number.isFinite(dayNumber)) {
            const progress = (allProgress || []).find((p) => p.day_number === dayNumber);
            if (progress) {
              checklist = (progress.checklist_state as ChecklistState) || {};
              completed = !!progress.completed;
            }
            reflection =
              typeof reflectionByDay.get(dayNumber) === "string"
                ? String(reflectionByDay.get(dayNumber))
                : "";
          }

          await supabase.from("chat_messages").insert({
            user_id: user.id,
            book_slug: bookSlug,
            context_day: activelyOnDay && Number.isFinite(dayNumber) ? dayNumber : null,
            role: "user",
            content: message,
          });
        }
      }
    }

    // Prefer live client progress (freshest checklist/reflection from the day page)
    if (activelyOnDay && clientProgress && typeof clientProgress === "object") {
      if (clientProgress.checklist && typeof clientProgress.checklist === "object") {
        checklist = clientProgress.checklist as ChecklistState;
      }
      if (typeof clientProgress.completed === "boolean") {
        completed = clientProgress.completed;
      }
      if (typeof clientProgress.reflection === "string") {
        reflection = clientProgress.reflection;
      }
    }

    // Merge server + client journey signals (server wins on conflicts)
    const clientSignals: JourneySignal[] = Array.isArray(journeySignals)
      ? journeySignals.filter(
          (s): s is JourneySignal =>
            !!s && typeof s.dayNumber === "number",
        )
      : [];
    const journeyByDay = new Map<number, JourneySignal>();
    for (const s of clientSignals) journeyByDay.set(s.dayNumber, s);
    for (const s of serverJourneySignals) journeyByDay.set(s.dayNumber, s);
    const journeyMemory = formatJourneyMemory(
      bookSlug,
      Array.from(journeyByDay.values()),
    );

    const checklistBlock = dayContent
      ? formatChecklistStatus(dayContent.actionSteps, checklist)
      : "No checklist available.";
    const remaining = dayContent ? incompleteSteps(dayContent.actionSteps, checklist) : [];

    const suggestedDay =
      !activelyOnDay && Number.isFinite(dayNumber) ? dayNumber : null;

    const currentDayBlock = dayContent
      ? `PAGE CONTEXT: The user is ON a day task page right now.
CURRENT DAY CONTEXT (live truth for coaching - do NOT announce unless relevant):
Day number: ${dayNumber}
Day title: ${dayContent.title}
Phase: ${phase?.name || dayContent.phase} (${phase?.theme || "personal branding"})
Objective: ${dayContent.objective}
Why it matters: ${dayContent.whyItMatters}
Work summary: ${dayContent.workSummary.join("; ")}
Reflection prompts: ${dayContent.reflectionPrompts.join("; ")}
AI Power-Up prompt: ${dayContent.aiPrompts[0]?.prompt || "N/A"}
Tomorrow preview: ${dayContent.tomorrowPreview || "N/A"}
Day completed: ${completed ? "yes" : "no"}
Checklist status:
${checklistBlock}
Incomplete actions:
${remaining.length ? remaining.join("\n") : "All checklist items done (or none remaining)."}
User reflection so far: ${reflection.trim() ? reflection.trim() : "(empty)"}

AWARENESS RULE FOR THIS TURN:
Silently coach from Day ${dayNumber}: "${dayContent.title}".
ONLY mention the day number/title if the user's message clearly relates to today's task, checklist, reflection, prompt, or branding work for this day.
Never open with "I see you're on Day X" unless that acknowledgment is needed for the answer.
If unrelated small talk, skip the day mention entirely.

LENGTH RULE FOR THIS TURN (critical):
Answer only as long as the question needs. Prefer 1-3 sentences. No padding, no essay, no unsolicited tips.`
      : `PAGE CONTEXT: The user is on a hub page (dashboard, progress, or overview), NOT on a day task page.
Do NOT say "I see you're on Day X" or claim they are currently working a specific day.
Suggested next day (for soft tips only, if they ask what to do): ${suggestedDay ?? "unknown"}.
If they ask what to do next, point them to Today's task / Day ${suggestedDay ?? "their next day"}.
Otherwise answer normally without inventing that they are mid-task.

LENGTH RULE FOR THIS TURN (critical):
Answer only as long as the question needs. Prefer 1-3 sentences. No padding, no essay, no unsolicited tips.`;

    const systemMessage = `${COACH_SYSTEM_PROMPT}

BOOK CONTEXT (RAG):
${contextText}

JOURNEY MEMORY (what the user has already done across days):
${journeyMemory}

${currentDayBlock}

CONVERSATION MEMORY:
Use the prior chat messages below. Stay consistent with what was already said. Do not re-introduce yourself.`;

    // Drop trailing duplicate of the latest user message if the client included it in history
    const prior = [...history];
    if (
      prior.length > 0 &&
      prior[prior.length - 1]?.role === "user" &&
      prior[prior.length - 1]?.content === message
    ) {
      prior.pop();
    }

    const openai = getOpenAIClient();
    const maxTokens = estimateReplyBudget(message);
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        ...prior.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
      stream: true,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            const cleaned = sanitizeCaraText(content);
            fullResponse += cleaned;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: cleaned })}\n\n`),
            );
          }
        }

        fullResponse = sanitizeCaraText(fullResponse);

        if (isSupabaseConfigured() && fullResponse) {
          const supabase = await createClient();
          if (supabase) {
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (user) {
              await supabase.from("chat_messages").insert({
                user_id: user.id,
                book_slug: bookSlug,
                context_day: activelyOnDay && Number.isFinite(dayNumber) ? dayNumber : null,
                role: "assistant",
                content: fullResponse,
              });
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat failed" },
      { status: 500 },
    );
  }
}
