import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDayContent } from "@/lib/books/loader";
import { retrieveContext, formatChunksForPrompt } from "@/lib/rag/retrieve";
import { getOpenAIClient, COACH_SYSTEM_PROMPT } from "@/lib/openai/client";

export async function POST(request: Request) {
  try {
    const { message, bookSlug, contextDay } = await request.json();

    if (!message || !bookSlug) {
      return NextResponse.json({ error: "Missing message or bookSlug" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Add OPENAI_API_KEY to .env.local" },
        { status: 503 },
      );
    }

    const dayContent = contextDay ? getDayContent(bookSlug, contextDay) : null;
    const chunks = retrieveContext(bookSlug, message, contextDay);
    const contextText = formatChunksForPrompt(chunks);

    let userProgressContext = "";
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && contextDay) {
          const { data: progress } = await supabase
            .from("day_progress")
            .select("checklist_state, completed")
            .eq("user_id", user.id)
            .eq("book_slug", bookSlug)
            .eq("day_number", contextDay)
            .single();

          if (progress) {
            userProgressContext = `User progress on Day ${contextDay}: completed=${progress.completed}, checklist=${JSON.stringify(progress.checklist_state)}`;
          }

          await supabase.from("chat_messages").insert({
            user_id: user.id,
            book_slug: bookSlug,
            context_day: contextDay,
            role: "user",
            content: message,
          });
        }
      }
    }

    const systemMessage = `${COACH_SYSTEM_PROMPT}

BOOK CONTEXT:
${contextText}

${dayContent ? `CURRENT DAY (${contextDay}) DETAILS:
Title: ${dayContent.title}
Objective: ${dayContent.objective}
Action Steps: ${dayContent.actionSteps.join("; ")}
AI Prompt: ${dayContent.aiPrompts[0]?.prompt || "N/A"}` : ""}

${userProgressContext}`;

    const openai = getOpenAIClient();
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message },
      ],
      stream: true,
      max_tokens: 800,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullResponse += content;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
            );
          }
        }

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
                context_day: contextDay,
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
