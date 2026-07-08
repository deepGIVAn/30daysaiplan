import Image from "next/image";

export function AuthMarketingPanel() {
  return (
    <div className="relative hidden h-full w-1/2 flex-col items-center justify-center gap-4 overflow-hidden bg-[#0A0B11] px-10 py-6 lg:flex xl:gap-5 xl:px-14">
      <div className="w-full shrink-0 text-center">
        <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight text-white xl:text-[30px]">
          The 30 Day AI Personal Brand Plan
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-white/55 xl:text-[15px]">
          A bold AI-powered roadmap to help you stand out quickly with a personal brand that
          attracts opportunities, builds credibility, and positions you as an authority. In a noisy
          world, those who win build their brand with intention, speed, and strategy. This book gives
          you a simple, actionable AI plan to build a brand that truly connects and inspires.
        </p>
      </div>

      <Image
        src="/media/book-mockup-transparent.png"
        alt="The 30-Day AI Personal Brand Plan by Dr. Jerome Joseph"
        width={1604}
        height={1536}
        priority
        className="h-[220px] w-full max-w-[420px] shrink-0 object-contain xl:h-[260px] xl:max-w-[480px]"
      />

      <div className="w-full shrink-0 text-center">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-primary">
          ABOUT THE AUTHOR
        </p>
        <h2 className="mt-1.5 font-display text-[18px] font-semibold text-white xl:text-[20px]">
          Dr Jerome Joseph, CSP
        </h2>
        <p className="mt-2.5 text-[13px] leading-relaxed text-white/50 xl:text-[14px]">
          Dr. Jerome Joseph is a global authority in branding and personal brand leadership —
          ranked No. 2 Global Brand Thought Leader in 2020 &amp; 2022. With 30+ years across 1,000
          brands in 40 countries, he authored Asia&apos;s first book on Personal Branding in 2007.
          With The 30-Day AI Personal Brand Plan, he blends proven branding principles with AI to
          help you build influence, visibility, and authority — faster than ever.
        </p>
      </div>
    </div>
  );
}
