"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, User } from "lucide-react";
import { CoachFace } from "@/components/chat/coach-face";
import { CaraMarkdown } from "@/components/chat/cara-markdown";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import {
  hasMetCara,
  loadChatSession,
  markMetCara,
  readLocalJourneySignals,
  saveChatSession,
  type ChatMessage,
} from "@/lib/chat/session";

interface CoachEmbedProps {
  bookSlug: string;
  /** True only when the user is on a /day/[n] task page. */
  onDayPage?: boolean;
  contextDay: number;
  dayTitle?: string;
  totalDays?: number;
}

function dayBit(contextDay: number, dayTitle?: string) {
  if (dayTitle?.trim()) {
    return `I see you're on Day ${contextDay}: ${dayTitle.trim()}.`;
  }
  return `I see you're on Day ${contextDay}.`;
}

function guestGreeting(opts: {
  onDayPage: boolean;
  contextDay: number;
  dayTitle?: string;
  isFirstMeet: boolean;
}) {
  if (opts.onDayPage) {
    const day = dayBit(opts.contextDay, opts.dayTitle);
    if (opts.isFirstMeet) {
      return `Hi, I am CARA. ${day} Please let me know how I can help you.`;
    }
    return `${day} How can I help you?`;
  }

  if (opts.isFirstMeet) {
    return "Hi, I am CARA. Please let me know how I can help you.";
  }
  return "Hey again. How can I help you?";
}

function signedInGreeting(
  name: string,
  opts: {
    onDayPage: boolean;
    contextDay: number;
    dayTitle?: string;
    isFirstMeet: boolean;
  },
) {
  if (opts.onDayPage) {
    const day = dayBit(opts.contextDay, opts.dayTitle);
    if (opts.isFirstMeet) {
      return `Hi ${name}. I am CARA. ${day} Please let me know how I can help you.`;
    }
    return `Hi ${name}. ${day} How can I help you?`;
  }

  if (opts.isFirstMeet) {
    return `Hi ${name}. I am CARA. Please let me know how I can help you.`;
  }
  return `Hi ${name}. How can I help you?`;
}

export function CoachEmbed({
  bookSlug,
  onDayPage = false,
  contextDay,
  dayTitle,
  totalDays,
}: CoachEmbedProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [badgeLabel, setBadgeLabel] = useState(
    onDayPage ? `Day ${contextDay}` : "Ready when you are",
  );
  const [badgeTitle, setBadgeTitle] = useState(onDayPage ? dayTitle : undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist chat so navigating Day 4 -> Day 5 keeps the conversation.
  useEffect(() => {
    if (!ready) return;
    saveChatSession(bookSlug, messages);
  }, [bookSlug, messages, ready]);

  // Update day badge silently when the page changes. Never wipe chat.
  useEffect(() => {
    if (onDayPage) {
      setBadgeLabel(`Day ${contextDay}`);
      setBadgeTitle(dayTitle);
    } else {
      setBadgeLabel("Ready when you are");
      setBadgeTitle(undefined);
    }
  }, [onDayPage, contextDay, dayTitle]);

  // Bootstrap / refresh greeting when book or page mode changes.
  // Real conversations persist. Greeting-only sessions are rebuilt for the current page.
  useEffect(() => {
    let cancelled = false;

    async function buildGreeting(isFirstMeet: boolean) {
      const opts = {
        onDayPage,
        contextDay,
        dayTitle,
        isFirstMeet,
      };
      let greeting = guestGreeting(opts);

      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data } = await supabase.auth.getUser();
          const user = data.user;
          if (user) {
            const metaName =
              typeof user.user_metadata?.display_name === "string"
                ? user.user_metadata.display_name.trim()
                : "";
            const name = metaName || user.email?.split("@")[0] || "";
            greeting = name ? signedInGreeting(name, opts) : guestGreeting(opts);
          }
        } catch {
          // stay on guest greeting
        }
      }

      return greeting;
    }

    async function bootstrap() {
      const existing = loadChatSession(bookSlug);
      const hasRealChat = existing.some((m) => m.role === "user");

      // Keep real conversations across day/hub navigation.
      if (hasRealChat) {
        if (!cancelled) {
          setMessages(existing);
          setReady(true);
          markMetCara();
        }
        return;
      }

      // Greeting-only (or empty): always build for the current page mode.
      // This prevents a Day 4 greeting from showing on the dashboard.
      const greeting = await buildGreeting(!hasMetCara());
      if (!cancelled) {
        setMessages([{ role: "assistant", content: greeting }]);
        setReady(true);
        markMetCara();
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookSlug, onDayPage]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const clientProgress = (() => {
        if (!onDayPage) return null;
        try {
          const raw = localStorage.getItem(`bookhub:${bookSlug}:day:${contextDay}`);
          if (!raw) return null;
          const data = JSON.parse(raw);
          return {
            checklist: data.checklist || {},
            reflection: data.reflection || "",
            completed: !!data.completed,
          };
        } catch {
          return null;
        }
      })();

      const history = nextMessages
        .filter((m) => m.content.trim())
        .slice(-16)
        .map((m) => ({ role: m.role, content: m.content }));

      const journeySignals = totalDays
        ? readLocalJourneySignals(bookSlug, totalDays)
        : [];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          bookSlug,
          onDayPage,
          contextDay,
          clientProgress,
          history,
          journeySignals,
          totalDays,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantMessage += parsed.content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: assistantMessage,
                    };
                    return updated;
                  });
                }
              } catch {
                // skip malformed SSE
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Connection issue: ${error instanceof Error ? error.message : "Please check your OpenAI API key in .env.local"}`,
        },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-black text-white">
      <header className="shrink-0 px-6 pb-5 pt-7">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <div className="rounded-full bg-white/[0.06] p-1.5 ring-1 ring-white/10">
            <CoachFace size="lg" className="h-20 w-20 border-0" />
          </div>
          <div className="space-y-0.5">
            <p className="font-display text-base font-semibold tracking-tight text-white">CARA</p>
            <p className="text-fine text-white/45">Your AI brand coach</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {badgeLabel}
            {badgeTitle && (
              <span className="max-w-[180px] truncate text-white/40">· {badgeTitle}</span>
            )}
          </span>
        </div>
      </header>

      <div className="mx-6 h-px shrink-0 bg-white/10" />

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            <div className="mt-0.5 shrink-0">
              {msg.role === "user" ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <User className="h-3.5 w-3.5 text-white/60" strokeWidth={1.5} />
                </div>
              ) : (
                <CoachFace size="sm" />
              )}
            </div>
            {msg.role === "user" ? (
              <p className="max-w-[90%] text-right text-[13px] leading-relaxed text-white/90">
                {msg.content}
              </p>
            ) : (
              <CaraMarkdown content={msg.content} />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <CoachFace size="sm" className="opacity-80" />
            <p className="text-[13px] text-white/45">Thinking…</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <footer className="relative shrink-0 px-4 pb-4 pt-2">
        <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-black to-transparent" />

        <div
          className={cn(
            "rounded-2xl border bg-white/[0.04] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.35)] transition-colors",
            input.trim()
              ? "border-primary/35"
              : "border-white/10 focus-within:border-white/20",
          )}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask CARA anything…"
            rows={2}
            className="max-h-32 min-h-[52px] w-full resize-none bg-transparent px-3 pt-2.5 text-[14px] leading-relaxed text-white placeholder:text-white/35 focus:outline-none"
          />

          <div className="mt-1 flex items-center justify-end px-1.5 pb-0.5">
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-all",
                input.trim() && !loading
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(210,111,21,0.35)] hover:opacity-90"
                  : "bg-white/10 text-white/30",
              )}
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
