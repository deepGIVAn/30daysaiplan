"use client";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import { DashboardMobileNav } from "./dashboard-mobile-nav";
import { CaraLauncher } from "@/components/chat/cara-launcher";

interface DashboardShellProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  hideTopbar?: boolean;
  cara?: {
    bookSlug: string;
    /** Only true on /day/[n] pages. Hub pages must not claim the user is "on" a day. */
    onDayPage?: boolean;
    /** Active day when onDayPage; otherwise the suggested next day for soft tips. */
    contextDay: number;
    dayTitle?: string;
    totalDays?: number;
  };
}

export function DashboardShell({
  children,
  breadcrumbs = [],
  hideTopbar = false,
  cara,
}: DashboardShellProps) {
  return (
    <div className="flex h-full overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {!hideTopbar && <DashboardTopbar breadcrumbs={breadcrumbs} />}

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>

        <DashboardMobileNav />
      </div>

      {cara && (
        <CaraLauncher
          bookSlug={cara.bookSlug}
          onDayPage={!!cara.onDayPage}
          contextDay={cara.contextDay}
          dayTitle={cara.dayTitle}
          totalDays={cara.totalDays}
        />
      )}
    </div>
  );
}
