"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

interface DashboardTopbarProps {
  breadcrumbs: { label: string; href?: string }[];
}

export function DashboardTopbar({ breadcrumbs }: DashboardTopbarProps) {
  const pathname = usePathname();
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

  const displayName = userEmail?.split("@")[0] ?? "Guest";
  const initials = displayName.slice(0, 2).toUpperCase();

  const accountChip = (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface py-1.5 pl-1.5 pr-3 transition-colors hover:border-foreground/15">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg brand-gradient text-xs font-semibold text-primary-foreground">
        {initials}
      </div>
      <div className="hidden min-w-0 lg:block">
        <p className="truncate text-sm font-semibold text-foreground capitalize">
          {displayName}
        </p>
        <p className="truncate text-fine text-muted-foreground">
          {userEmail ?? "On this device"}
        </p>
      </div>
    </div>
  );

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 page-padding">
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <span key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && <span className="shrink-0 text-muted-foreground/60">/</span>}
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="truncate text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "truncate font-semibold text-foreground"
                      : "truncate text-muted-foreground"
                  }
                >
                  {crumb.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />
        {userEmail ? (
          <div className="ml-1">{accountChip}</div>
        ) : (
          <Link href="/login" className="ml-1" aria-label="Log in">
            {accountChip}
          </Link>
        )}
      </div>
    </header>
  );
}
