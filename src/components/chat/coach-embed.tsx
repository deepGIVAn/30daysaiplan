"use client";

import { useEffect, useRef, useState } from "react";
import { Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CoachFace } from "@/components/chat/coach-face";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CoachEmbedProps {
  bookSlug: string;
  contextDay: number;
  dayTitle?: string;
}

export function CoachEmbed({ bookSlug, contextDay, dayTitle }: CoachEmbedProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `I'm CARA — your AI coach powered by Dr. Jerome's methodology. You're on Day ${contextDay}${dayTitle ? `: ${dayTitle}` : ""}. Ask me how to complete today's tasks, use the AI prompts, or get unstuck.`,
      },
    ]);
  }, [contextDay, dayTitle]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, bookSlug, contextDay }),
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
          for (const line of chunk.split("\n")) {
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
                // skip
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
            Day {contextDay}
            {dayTitle && <span className="max-w-[180px] truncate text-white/40">· {dayTitle}</span>}
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
            <p
              className={cn(
                "max-w-[90%] text-[13px] leading-relaxed",
                msg.role === "user" ? "text-right text-white/90" : "text-white/75",
              )}
            >
              {msg.content}
            </p>
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

      <footer className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message about Day ${contextDay}…`}
            rows={2}
            className="min-h-0 border-white/15 bg-white/5 text-[13px] text-white placeholder:text-white/35 focus-visible:ring-primary"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="h-8 w-8 shrink-0 self-end"
          >
            <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Button>
        </div>
      </footer>
    </div>
  );
}
