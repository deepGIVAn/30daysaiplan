import type { ContentChunk } from "@/types";
import { getContentChunks } from "@/lib/books/loader";

export function retrieveContext(
  bookSlug: string,
  query: string,
  contextDay?: number,
  limit = 5,
): ContentChunk[] {
  const chunks = getContentChunks(bookSlug);
  if (chunks.length === 0) return [];

  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 3);

  const scored = chunks.map((chunk) => {
    let score = 0;
    const text = chunk.text.toLowerCase();

    if (contextDay && chunk.dayNumber === contextDay) score += 10;
    if (contextDay && Math.abs(chunk.dayNumber - contextDay) === 1) score += 3;

    for (const term of queryTerms) {
      if (text.includes(term)) score += 2;
    }

    if (query.toLowerCase().includes(`day ${chunk.dayNumber}`)) score += 15;

    return { chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter((s) => s.score > 0)
    .map((s) => s.chunk);
}

export function formatChunksForPrompt(chunks: ContentChunk[]): string {
  return chunks
    .map(
      (c) =>
        `[Day ${c.dayNumber} — ${c.section}]\n${c.text}`,
    )
    .join("\n\n");
}
