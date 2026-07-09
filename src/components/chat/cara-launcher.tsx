"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import gsap from "gsap";
import { CoachEmbed } from "@/components/chat/coach-embed";
import { CoachFace } from "@/components/chat/coach-face";
import { cn } from "@/lib/utils";

interface CaraLauncherProps {
  bookSlug: string;
  onDayPage?: boolean;
  contextDay: number;
  dayTitle?: string;
  totalDays?: number;
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

export function CaraLauncher({
  bookSlug,
  onDayPage = false,
  contextDay,
  dayTitle,
  totalDays,
}: CaraLauncherProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const close = useCallback(() => {
    if (!backdropRef.current || !panelRef.current || !tabRef.current) {
      setOpen(false);
      setMounted(false);
      return;
    }

    timelineRef.current?.kill();
    timelineRef.current = gsap.timeline({
      onComplete: () => {
        setOpen(false);
        setMounted(false);
      },
    });

    const panelClose = isMobile
      ? { y: "100%", opacity: 0.9, duration: 0.42, ease: "power3.in" }
      : { x: "100%", opacity: 0.85, duration: 0.42, ease: "power3.in" };

    timelineRef.current
      .to(panelRef.current, panelClose)
      .to(
        backdropRef.current,
        { opacity: 0, duration: 0.28, ease: "power2.in" },
        "-=0.22",
      )
      .to(
        tabRef.current,
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
        "-=0.2",
      );
  }, [isMobile]);

  const openPanel = useCallback(() => {
    setOpen(true);
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !mounted) return;
    if (!backdropRef.current || !panelRef.current || !tabRef.current) return;

    timelineRef.current?.kill();
    gsap.set(backdropRef.current, { opacity: 0 });

    if (isMobile) {
      gsap.set(panelRef.current, { y: "100%", x: 0, opacity: 0.9 });
      gsap.set(tabRef.current, { y: 6, opacity: 0.4, scale: 0.92 });
    } else {
      gsap.set(panelRef.current, { x: "100%", y: 0, opacity: 0.85 });
      gsap.set(tabRef.current, { x: 8, opacity: 0.4, scale: 0.92 });
    }

    timelineRef.current = gsap.timeline();
    timelineRef.current
      .to(backdropRef.current, { opacity: 1, duration: 0.32, ease: "power2.out" })
      .to(
        panelRef.current,
        isMobile
          ? { y: 0, opacity: 1, duration: 0.62, ease: "power3.out" }
          : { x: 0, opacity: 1, duration: 0.58, ease: "power3.out" },
        "-=0.12",
      )
      .to(
        tabRef.current,
        isMobile
          ? { y: 10, opacity: 0, scale: 0.88, duration: 0.28, ease: "power2.in" }
          : { x: 12, opacity: 0, scale: 0.88, duration: 0.28, ease: "power2.in" },
        "-=0.45",
      );
  }, [open, mounted, isMobile]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    const tab = tabRef.current;
    if (!tab) return;

    function onEnter() {
      if (open) return;
      gsap.to(tab, {
        x: isMobile ? 0 : -4,
        y: isMobile ? -4 : 0,
        scale: 1.03,
        duration: 0.35,
        ease: "power2.out",
      });
    }

    function onLeave() {
      if (open) return;
      gsap.to(tab, { x: 0, y: 0, scale: 1, duration: 0.35, ease: "power2.out" });
    }

    tab.addEventListener("mouseenter", onEnter);
    tab.addEventListener("mouseleave", onLeave);
    return () => {
      tab.removeEventListener("mouseenter", onEnter);
      tab.removeEventListener("mouseleave", onLeave);
    };
  }, [open, isMobile]);

  return (
    <>
      <button
        ref={tabRef}
        type="button"
        onClick={openPanel}
        className={cn(
          "fixed bottom-[4.5rem] right-5 z-40 flex flex-col items-center gap-1.5 border-0 bg-transparent p-0 shadow-none md:bottom-6",
        )}
        aria-label="Open CARA"
        aria-expanded={open}
      >
        <CoachFace
          variant="bare"
          size="xl"
          className="h-[56px] w-[56px] lg:h-[64px] lg:w-[64px]"
        />
        <span className="font-display text-xs font-semibold tracking-wide text-foreground">
          CARA
        </span>
      </button>

      {mounted && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex",
            isMobile ? "items-end" : "justify-end",
          )}
        >
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={close}
            aria-hidden
          />

          <div
            ref={panelRef}
            className={cn(
              "relative flex flex-col overflow-hidden bg-black",
              isMobile
                ? "h-[88vh] w-full rounded-t-2xl shadow-[0_-12px_40px_rgba(0,0,0,0.35)]"
                : "h-full w-full max-w-[380px] shadow-[-12px_0_40px_rgba(0,0,0,0.35)]",
            )}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close CARA"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <CoachEmbed
              bookSlug={bookSlug}
              onDayPage={onDayPage}
              contextDay={contextDay}
              dayTitle={dayTitle}
              totalDays={totalDays}
            />
          </div>
        </div>
      )}
    </>
  );
}
