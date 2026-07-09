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

      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-[#0A0B11] px-5 py-10 lg:w-1/2 lg:px-10 xl:px-14">
        <Image
          src="/media/auth-right-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center scale-x-[-1]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#0A0B11]/35" aria-hidden />

        <div className="relative z-10 w-full max-w-[440px]">
          <div className="mb-6 flex justify-center">
            <Image
              src="/media/book-mockup-transparent.png"
              alt="The 30-Day AI Personal Brand Plan"
              width={1604}
              height={1536}
              priority
              className="h-[132px] w-auto object-contain sm:h-[154px]"
            />
          </div>

          <div className="mb-8 text-center">
            <h2 className="font-display text-[24px] font-semibold leading-snug tracking-tight text-white sm:text-[28px]">
              Welcome to The 30 Day AI Personal Brand Plan
            </h2>
            <p className="mt-2 text-[14px] text-white/55">
              {isSignup
                ? "Create your account to save progress across devices."
                : "Log in to continue your 30-day brand journey."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            <Link
              href="/login"
              className={cn(
                "rounded-lg px-4 py-2.5 text-center text-[13px] font-semibold transition-colors",
                !isSignup
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-white/55 hover:text-white",
              )}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className={cn(
                "rounded-lg px-4 py-2.5 text-center text-[13px] font-semibold transition-colors",
                isSignup
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-white/55 hover:text-white",
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
