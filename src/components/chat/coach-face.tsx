"use client";

import { cn } from "@/lib/utils";

const COACH_FACE_SRC = "/media/coach-face.mp4";

interface CoachFaceProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "bare";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-14 w-14",
  lg: "h-24 w-24",
  xl: "h-28 w-28",
};

export function CoachFace({ size = "md", variant = "default", className }: CoachFaceProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-full",
        variant === "default" && "border border-white/15 bg-black",
        variant === "bare" && "shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
        sizeClasses[size],
        className,
      )}
    >
      <video
        src={COACH_FACE_SRC}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
        aria-hidden
      />
    </div>
  );
}
