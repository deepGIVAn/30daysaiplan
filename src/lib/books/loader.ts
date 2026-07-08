import fs from "fs";
import path from "path";
import type { BookMeta, ContentChunk, DayContent } from "@/types";

const CONTENT_ROOT = path.join(process.cwd(), "content/books");

export function getBookMeta(slug: string): BookMeta | null {
  const filePath = path.join(CONTENT_ROOT, slug, "book.json");
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as BookMeta;
}

export function getDayContent(slug: string, dayNumber: number): DayContent | null {
  const filePath = path.join(
    CONTENT_ROOT,
    slug,
    "days",
    `day-${String(dayNumber).padStart(2, "0")}.json`,
  );
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as DayContent;
}

export function getAllDays(slug: string): DayContent[] {
  const daysDir = path.join(CONTENT_ROOT, slug, "days");
  if (!fs.existsSync(daysDir)) return [];

  return fs
    .readdirSync(daysDir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(daysDir, f), "utf-8")))
    .map((d) => d as DayContent);
}

export function getContentChunks(slug: string): ContentChunk[] {
  const filePath = path.join(CONTENT_ROOT, slug, "chunks.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ContentChunk[];
}
