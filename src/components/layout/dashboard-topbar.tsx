"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

interface DashboardTopbarProps {
  breadcrumbs: { label: string; href?: string }[];
}

export function DashboardTopbar({ breadcrumbs }: DashboardTopbarProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label ?? "Dashboard";

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
  }, []);

  const displayName = userEmail?.split("@")[0] ?? "Guest";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 page-padding">
      <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-md">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.75}
        />
        <input
          type="search"
          placeholder="Search your journey…"
          className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/25"
          aria-label="Search"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground lg:inline">
          ⌘F
        </kbd>
      </div>

      <p className="truncate text-sm font-semibold text-foreground sm:hidden">{pageTitle}</p>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <div className="ml-1 flex items-center gap-2.5 rounded-xl border border-border bg-surface py-1.5 pl-1.5 pr-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg brand-gradient text-xs font-semibold text-primary-foreground">
            {initials}
          </div>
          <div className="hidden min-w-0 lg:block">
            <p className="truncate text-sm font-semibold text-foreground capitalize">
              {displayName}
            </p>
            <p className="truncate text-fine text-muted-foreground">
              {userEmail ?? "Sign in to sync"}
            </p>
          </div>
        </div>
        {!userEmail && (
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-primary hover:opacity-80 sm:inline"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
