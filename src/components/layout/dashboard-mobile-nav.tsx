"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarCheck, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BOOK_SLUG = "30-day-ai-personal-brand-plan";

export function DashboardMobileNav() {
  const pathname = usePathname();

  const links = [
    {
      href: `/books/${BOOK_SLUG}`,
      label: "Home",
      icon: LayoutDashboard,
      active: pathname === `/books/${BOOK_SLUG}`,
    },
    {
      href: `/books/${BOOK_SLUG}/today`,
      label: "Today",
      icon: CalendarCheck,
      active:
        pathname.startsWith(`/books/${BOOK_SLUG}/day`) ||
        pathname.endsWith("/today"),
    },
    {
      href: `/books/${BOOK_SLUG}/progress`,
      label: "Progress",
      icon: BarChart3,
      active: pathname.endsWith("/progress"),
    },
    {
      href: "/about",
      label: "About",
      icon: User,
      active: pathname === "/about",
    },
  ];

  return (
    <nav className="flex shrink-0 items-center justify-around border-t border-border bg-surface px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-colors",
            link.active
              ? "bg-primary-soft text-primary"
              : "text-muted-foreground",
          )}
        >
          <link.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
