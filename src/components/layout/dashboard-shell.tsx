"use client";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import { DashboardMobileNav } from "./dashboard-mobile-nav";
import { CaraLauncher } from "@/components/chat/cara-launcher";

interface DashboardShellProps {
  children: React.ReactNode;
  breadcrumbs: { label: string; href?: string }[];
  cara?: {
    bookSlug: string;
    contextDay: number;
    dayTitle?: string;
  };
}

export function DashboardShell({ children, breadcrumbs, cara }: DashboardShellProps) {
  return (
    <div className="flex h-full overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardTopbar breadcrumbs={breadcrumbs} />

        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>

        <DashboardMobileNav />
      </div>

      {cara && (
        <CaraLauncher
          bookSlug={cara.bookSlug}
          contextDay={cara.contextDay}
          dayTitle={cara.dayTitle}
        />
      )}
    </div>
  );
}
