"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthMarketingPanel } from "@/components/auth/auth-marketing-panel";
import { cn } from "@/lib/utils";

interface AuthScreenProps {
  mode: "login" | "signup";
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const isSignup = mode === "signup";

  return (
    <div className="flex h-full min-h-0 w-full">
      <AuthMarketingPanel />

      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-[linear-gradient(180deg,#f8f9fb_0%,#f4f5f7_55%,#eef0f3_100%)] px-5 py-10 lg:w-1/2 lg:px-10 xl:px-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-20 left-8 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <Image
                src="/media/book-cover.png"
                alt="The 30-Day AI Personal Brand Plan"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="font-display text-[24px] font-semibold leading-snug tracking-tight text-foreground sm:text-[28px]">
              Welcome to The 30 Day AI Personal Brand Plan
            </h2>
            <p className="mt-2 text-[14px] text-muted-foreground">
              {isSignup
                ? "Create your account to save progress across devices."
                : "Sign in to continue your 30-day brand journey."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-border bg-white p-1 shadow-sm">
            <Link
              href="/login"
              className={cn(
                "rounded-lg px-4 py-2.5 text-center text-[13px] font-semibold transition-colors",
                !isSignup
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={cn(
                "rounded-lg px-4 py-2.5 text-center text-[13px] font-semibold transition-colors",
                isSignup
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Sign up
            </Link>
          </div>

          <AuthForm mode={mode} />
        </div>
      </div>
    </div>
  );
}
