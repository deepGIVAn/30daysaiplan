"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  BarChart3,
  Library,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

const BOOK_SLUG = "30-day-ai-personal-brand-plan";

const MENU_LINKS = [
  {
    label: "Dashboard",
    href: `/books/${BOOK_SLUG}`,
    icon: LayoutDashboard,
    match: (p: string) => p === `/books/${BOOK_SLUG}`,
  },
  {
    label: "Today's task",
    href: `/books/${BOOK_SLUG}/today`,
    icon: CalendarCheck,
    match: (p: string) =>
      p.startsWith(`/books/${BOOK_SLUG}/day`) || p.endsWith("/today"),
  },
  {
    label: "Progress",
    href: `/books/${BOOK_SLUG}/progress`,
    icon: BarChart3,
    match: (p: string) => p.endsWith("/progress"),
  },
];

const GENERAL_LINKS = [
  { label: "Book library", href: "/books", icon: Library },
  { label: "About", href: "/about", icon: User },
];

function SidebarLink({
  href,
  active,
  icon: Icon,
  label,
  badge,
}: {
  href: string;
  active: boolean;
  icon: React.ElementType;
  label: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-colors",
        active
          ? "bg-white/10 font-semibold text-primary"
          : "text-white/55 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
          {badge}
        </span>
      )}
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setUserEmail(data.user?.email ?? null);
      });
    } catch {
      // signed-out
    }
  }, [pathname]);

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUserEmail(null);
      router.refresh();
    } catch {
      // ignore
    }
  }

  return (
    <aside className="relative hidden h-full w-[var(--sidebar-width)] shrink-0 flex-col overflow-hidden bg-[#0A0B11] px-4 py-6 md:flex">
      <Image
        src="/media/sidebar-bg.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#0A0B11]/40" aria-hidden />

      <Link href="/" className="relative z-10 mb-8 flex items-start gap-3 px-2">
        <Image
          src="/media/book-cover.png"
          alt="The 30-Day AI Personal Brand Plan"
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-lg object-cover shadow-sm"
        />
        <span className="font-display text-[13px] font-semibold leading-snug text-white">
          The 30-Day AI Personal Brand Plan
        </span>
      </Link>

      <nav className="relative z-10 flex-1 space-y-6 overflow-y-auto">
        <div>
          <div className="space-y-1">
            {MENU_LINKS.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                active={link.match(pathname)}
                icon={link.icon}
                label={link.label}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-medium text-white/35">General</p>
          <div className="space-y-1">
            {GENERAL_LINKS.map((link) => (
              <SidebarLink
                key={link.label}
                href={link.href}
                active={pathname === link.href}
                icon={link.icon}
                label={link.label}
              />
            ))}
            {userEmail ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-white/55 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
                Sign out
              </button>
            ) : (
              <SidebarLink
                href="/login"
                active={pathname === "/login"}
                icon={LogIn}
                label="Log in"
              />
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
