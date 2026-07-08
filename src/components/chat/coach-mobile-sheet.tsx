"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoachEmbed } from "@/components/chat/coach-embed";
import { CoachFace } from "@/components/chat/coach-face";

interface CoachMobileSheetProps {
  bookSlug: string;
  contextDay: number;
  dayTitle?: string;
}

export function CoachMobileSheet({ bookSlug, contextDay, dayTitle }: CoachMobileSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[4.5rem] right-5 z-40 overflow-hidden rounded-full border-2 border-black shadow-lg active:scale-95 transition-transform lg:hidden"
        aria-label="Open CARA"
      >
        <CoachFace size="md" className="h-12 w-12 border-0" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close coach"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-black",
            )}
          >
            <div className="flex items-center justify-end border-b border-white/10 px-3 py-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <CoachEmbed
                bookSlug={bookSlug}
                contextDay={contextDay}
                dayTitle={dayTitle}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
