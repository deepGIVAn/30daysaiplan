"use client";

import { AnimatedShaderBackground } from "@/components/ui/animated-shader-hero";

export function AuthMarketingPanel() {
  return (
    <div className="relative hidden h-full w-1/2 overflow-hidden bg-black lg:block">
      <AnimatedShaderBackground />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-start p-8 xl:p-10">
        <div className="max-w-[620px] xl:max-w-[680px]">
          <h1 className="whitespace-nowrap text-left font-display text-[32px] font-light leading-tight tracking-tight text-white xl:text-[42px]">
            The 30-Day AI Personal Brand Plan
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed text-white/65 xl:text-[15px]">
            A bold AI-powered roadmap to help you stand out quickly with a personal brand that
            attracts opportunities, builds credibility, and positions you as an authority. In a
            noisy world, those who win are the ones who build their brand with intention, speed,
            and strategy. This book gives you a simple, actionable plan powered by AI to build a
            brand that truly connects and inspires.
          </p>
        </div>
      </div>
    </div>
  );
}
