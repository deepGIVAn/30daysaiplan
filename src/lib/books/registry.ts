import type { BookRegistryEntry } from "@/types";

export const BOOK_REGISTRY: BookRegistryEntry[] = [
  {
    slug: "30-day-ai-personal-brand-plan",
    title: "The 30-Day AI Personal Brand Plan",
    tagline: "Build Influence, Visibility & Authority — One Day at a Time",
    status: "available",
    totalDays: 30,
    durationLabel: "30 days · 10–15 min/day",
    coverGradient: "from-amber-500 via-orange-600 to-rose-700",
  },
  {
    slug: "brand-playbook",
    title: "The Brand Playbook",
    tagline: "88 Game-Changing Strategies to Win in the Marketplace",
    status: "coming_soon",
    totalDays: 0,
    durationLabel: "Coming soon",
    coverGradient: "from-slate-600 to-slate-800",
  },
  {
    slug: "ai-customer-acquisition-playbook",
    title: "The AI Customer Acquisition Playbook",
    tagline: "Attract, Nurture & Convert Customers at Scale",
    status: "coming_soon",
    totalDays: 0,
    durationLabel: "Coming soon",
    coverGradient: "from-blue-600 to-indigo-800",
  },
  {
    slug: "internal-branding",
    title: "Internal Branding",
    tagline: "Building Your Brand from Within",
    status: "coming_soon",
    totalDays: 0,
    durationLabel: "Coming soon",
    coverGradient: "from-emerald-600 to-teal-800",
  },
  {
    slug: "stand-out",
    title: "Stand Out!",
    tagline: "30 Principles to Grow Your Personal Brand",
    status: "coming_soon",
    totalDays: 0,
    durationLabel: "Coming soon",
    coverGradient: "from-violet-600 to-purple-800",
  },
  {
    slug: "get-aligned",
    title: "Get Aligned",
    tagline: "10 Principles to Grow Your Internal Brand",
    status: "coming_soon",
    totalDays: 0,
    durationLabel: "Coming soon",
    coverGradient: "from-cyan-600 to-blue-800",
  },
];

export function getBookFromRegistry(slug: string) {
  return BOOK_REGISTRY.find((book) => book.slug === slug);
}

export function getAvailableBooks() {
  return BOOK_REGISTRY.filter((book) => book.status === "available");
}
