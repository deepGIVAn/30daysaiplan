import fs from "fs";
import path from "path";
import { createRequire } from "module";
import type { DayContent, PhaseId } from "../src/types";
import { getPhaseForDay } from "../src/lib/books/phases";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse") as (
  buffer: Buffer,
) => Promise<{ text: string }>;

const PDF_PATH =
  process.env.PDF_PATH ||
  "C:\\Users\\ankit\\Downloads\\THE 30-DAY AI PERSONAL BRAND PLAN.pdf";

const OUTPUT_DIR = path.join(
  process.cwd(),
  "content/books/30-day-ai-personal-brand-plan",
);

const DAY_TITLES: Record<number, string> = {
  1: "Conduct a Personal Brand Audit",
  2: "Identify Your Top 3 Brand Values",
  3: "Define Your Target Audience Persona",
  4: "Craft Your Brand Vision & Purpose",
  5: "Write Your One-Line Brand Positioning Statement",
  6: "Build Your Signature Story",
  7: "Identify Your Brand Differentiator",
  8: "Optimise Your LinkedIn Profile",
  9: "Update All Your Social Bios",
  10: "Record a 60-Second Branded Intro Video",
  11: "Build a Personal Visual Identity",
  12: "Define Your 3 Core Content Pillars",
  13: "Publish a Thought Leadership Post",
  14: "Join or Launch 2 Strategic Online Communities",
  15: "Collect 3 Strategic Testimonials",
  16: "Publish an Article or Blog",
  17: "Share a Success Story or Case Study",
  18: "Create a Lead Magnet (Guide, Checklist, or eBook)",
  19: "Offer Value — Free Consultation, Mentorship or Review",
  20: "Get Featured on a Podcast, Panel or Stage",
  21: "Highlight Proof of Authority",
  22: "Reach Out to 3 New Connections",
  23: "Engage Strategically on LinkedIn Posts",
  24: "Attend a Virtual or In-Person Networking Event",
  25: "Co-Create with a Partner",
  26: "Build Your Dream List (Clients, Partners, Platforms)",
  27: "Launch a 7-Day Brand-Aligned Challenge",
  28: "Build & Launch Your Personal Content Calendar",
  29: "Craft Your Signature Offer",
  30: "Build Your Brand Performance Tracker",
};

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/THE 30-DAY AI PERSONAL BRAND PLAN\s+\d+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractBetween(
  text: string,
  start: string,
  end: string,
): string | null {
  const startIdx = text.indexOf(start);
  if (startIdx === -1) return null;
  const from = startIdx + start.length;
  const endIdx = text.indexOf(end, from);
  if (endIdx === -1) return text.slice(from).trim();
  return text.slice(from, endIdx).trim();
}

function firstParagraph(text: string, maxLen = 400): string {
  const para = text.split("\n").find((line) => line.trim().length > 40);
  if (!para) return text.slice(0, maxLen).trim();
  return para.trim().slice(0, maxLen);
}

function extractBulletLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[•\-\d]+\.?\s*/, "").trim())
    .filter((line) => line.length > 10 && line.length < 200)
    .slice(0, 6);
}

function extractDaySection(fullText: string, dayNumber: number): string {
  const title = DAY_TITLES[dayNumber];
  const startMarker = `DAY ${dayNumber}:`;
  const nextMarker =
    dayNumber < 30 ? `DAY ${dayNumber + 1}:` : "Copyright © 2025";

  const startIdx = fullText.indexOf(startMarker);
  if (startIdx === -1) return "";

  const searchFrom = startIdx + startMarker.length;
  const nextIdx =
    dayNumber < 30
      ? fullText.indexOf(nextMarker, searchFrom)
      : fullText.length;

  return cleanText(
    fullText.slice(startIdx, nextIdx === -1 ? undefined : nextIdx),
  );
}

function buildDayContent(dayNumber: number, section: string): DayContent {
  const phase = getPhaseForDay(dayNumber).id as PhaseId;
  const title = DAY_TITLES[dayNumber];

  const objective =
    extractBetween(section, "Objective of the Day", "Why This Step Matters") ||
    extractBetween(section, "Objective of the Day", "What You") ||
    `Complete today's focus: ${title}.`;

  const whyItMatters =
    extractBetween(section, "Why This Step Matters", "What You") ||
    extractBetween(section, "Why This Step Matters", "DAY ") ||
    firstParagraph(section, 350);

  const workBlock =
    extractBetween(section, "What You", "AI POWER-UP") ||
    extractBetween(section, "What You", "Reflection") ||
    "";

  const actionBlock =
    extractBetween(section, "Today's Action Steps:", "Optional:") ||
    extractBetween(section, "Today's Action Steps:", "Tomorrow:") ||
    extractBetween(section, "Action Steps:", "Optional:") ||
    "";

  const reflectionBlock =
    extractBetween(section, "Reflection Exercise:", "Real-World Example:") ||
    extractBetween(section, "Reflection Exercise:", "Today's Action Steps:") ||
    extractBetween(section, "Reflection Exercise:", "AI POWER-UP") ||
    "";

  const aiBlock =
    extractBetween(section, "AI POWER-UP", "Reflection Exercise:") ||
    extractBetween(section, "AI POWER-UP", "Real-World Example:") ||
    extractBetween(section, "AI POWER-UP", "Today's Action Steps:") ||
    "";

  const optionalPost =
    extractBetween(section, "Optional: Post It!", "Tomorrow:") ||
    extractBetween(section, "Share a reflection online:", "Tomorrow:") ||
    undefined;

  const tomorrowPreview = section.includes("Tomorrow:")
    ? section.split("Tomorrow:").pop()?.split("\n")[0]?.trim()
    : dayNumber < 30
      ? `Day ${dayNumber + 1} – ${DAY_TITLES[dayNumber + 1]}`
      : undefined;

  const actionSteps = extractBulletLines(actionBlock);
  const reflectionPrompts = extractBulletLines(reflectionBlock);

  const defaultActions = [
    `Review today's objective for Day ${dayNumber}: ${title}`,
    "Complete the reflection exercise in your journal",
    "Use the AI Power-Up prompt to accelerate your work",
    "Check off each action step as you complete it",
    "Capture one key insight you didn't expect",
  ];

  const defaultReflections = [
    "What surprised me most about today's exercise?",
    "What is one action I will take this week based on today?",
    "How does today's work connect to my broader brand vision?",
  ];

  const aiPromptText =
    aiBlock.replace(/Prompt:/gi, "").trim() ||
    `I'm working on Day ${dayNumber} of my personal brand plan: "${title}". Help me complete today's exercises with practical, specific guidance based on my background. Ask me clarifying questions if needed.`;

  return {
    dayNumber,
    title,
    phase,
    objective: firstParagraph(objective, 500),
    whyItMatters: firstParagraph(whyItMatters, 500),
    workSummary:
      extractBulletLines(workBlock).length > 0
        ? extractBulletLines(workBlock)
        : [
            `Focus on: ${title}`,
            "Work through each section at your own pace (10–15 minutes)",
            "Use the AI prompt to sharpen your thinking",
          ],
    aiPrompts: [
      {
        label: "AI Power-Up Prompt",
        prompt: aiPromptText.slice(0, 2000),
      },
    ],
    reflectionPrompts:
      reflectionPrompts.length > 0 ? reflectionPrompts : defaultReflections,
    actionSteps: actionSteps.length > 0 ? actionSteps : defaultActions,
    optionalPost: optionalPost
      ? firstParagraph(optionalPost, 280)
      : `Share a reflection on completing Day ${dayNumber} of my personal brand journey.`,
    hashtags: ["#BrandAuthorityChallenge", "#JeromeJoseph", "#PersonalBrand"],
    tomorrowPreview,
  };
}

async function main() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`PDF not found at ${PDF_PATH}`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(PDF_PATH);
  const parsed = await pdfParse(buffer);
  const fullText = cleanText(parsed.text);

  const daysDir = path.join(OUTPUT_DIR, "days");
  const chunksDir = path.join(OUTPUT_DIR, "chunks");
  fs.mkdirSync(daysDir, { recursive: true });
  fs.mkdirSync(chunksDir, { recursive: true });

  const allChunks: {
    id: string;
    bookSlug: string;
    dayNumber: number;
    section: string;
    text: string;
  }[] = [];

  for (let day = 1; day <= 30; day++) {
    const section = extractDaySection(fullText, day);
    const content = buildDayContent(day, section);
    const fileName = `day-${String(day).padStart(2, "0")}.json`;
    fs.writeFileSync(
      path.join(daysDir, fileName),
      JSON.stringify(content, null, 2),
    );

    const chunkSections: [string, string][] = [
      ["objective", content.objective],
      ["whyItMatters", content.whyItMatters],
      ["workSummary", content.workSummary.join(" ")],
      ["aiPrompt", content.aiPrompts[0]?.prompt ?? ""],
      ["actionSteps", content.actionSteps.join(" ")],
    ];

    for (const [sectionName, text] of chunkSections) {
      if (!text.trim()) continue;
      allChunks.push({
        id: `day-${day}-${sectionName}`,
        bookSlug: "30-day-ai-personal-brand-plan",
        dayNumber: day,
        section: sectionName,
        text: text.slice(0, 1500),
      });
    }

    console.log(`Generated ${fileName}: ${content.title}`);
  }

  const bookMeta = {
    slug: "30-day-ai-personal-brand-plan",
    title: "The 30-Day AI Personal Brand Plan",
    tagline: "Build Influence, Visibility & Authority — One Day at a Time",
    description:
      "An action-based transformation guide with 30 daily steps to build your personal brand using AI — one intentional day at a time.",
    totalDays: 30,
    status: "available",
    durationLabel: "30 days · 10–15 min/day",
    author: "Dr. Jerome Joseph",
    publisher: "Global Brand Academy Pte Ltd",
    coverGradient: "from-amber-500 via-orange-600 to-rose-700",
    phases: [
      { id: "clarity", name: "Clarity", days: [1, 5] },
      { id: "foundation", name: "Foundation", days: [6, 10] },
      { id: "visibility", name: "Visibility", days: [11, 15] },
      { id: "authority", name: "Authority", days: [16, 20] },
      { id: "momentum", name: "Momentum", days: [21, 30] },
    ],
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "book.json"),
    JSON.stringify(bookMeta, null, 2),
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "chunks.json"),
    JSON.stringify(allChunks, null, 2),
  );

  console.log(`\nDone. ${allChunks.length} RAG chunks written.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
