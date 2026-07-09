import Image from "next/image";
import { ArrowRight } from "lucide-react";

const WEBSITE_URL = "https://jeromejoseph.com";

function SocialIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <SocialIcon className={className}>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S.02 4.88.02 3.5 1.14 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.5h4.56V23H.22V8.5zM8.34 8.5h4.37v1.98h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7V23h-4.56v-6.7c0-1.6-.03-3.66-2.23-3.66-2.23 0-2.57 1.74-2.57 3.54V23H8.34V8.5z" />
    </SocialIcon>
  );
}

function YouTubeIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <SocialIcon className={className}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </SocialIcon>
  );
}

function InstagramIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <SocialIcon className={className}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11.25 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </SocialIcon>
  );
}

function FacebookIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <SocialIcon className={className}>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3.1l.9-3H13v-2c0-.6.4-1 1-1z" />
    </SocialIcon>
  );
}

function TikTokIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <SocialIcon className={className}>
      <path d="M14.5 3c.4 2.3 1.8 4.1 4 4.7v2.5c-1.4-.1-2.7-.5-3.8-1.2v5.7c0 3.4-2.7 6.1-6.1 6.1S2.5 18.1 2.5 14.7 5.2 8.6 8.6 8.6c.3 0 .7 0 1 .1v2.7c-.3-.1-.6-.1-1-.1-1.9 0-3.4 1.5-3.4 3.4s1.5 3.4 3.4 3.4 3.4-1.5 3.4-3.4V3h2.5z" />
    </SocialIcon>
  );
}

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jeromebrandguru",
    icon: LinkedInIcon,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/jeromejoseph",
    icon: YouTubeIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/jeromebrandguy",
    icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/jeromejoseph",
    icon: FacebookIcon,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@jeromebrandguy",
    icon: TikTokIcon,
  },
] as const;

export function AboutAuthorSection() {
  return (
    <section className="flex min-h-full flex-1 flex-col overflow-hidden bg-white dark:bg-[#0A0B11]">
      <div className="grid min-h-full flex-1 lg:h-full lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Copy */}
        <div className="relative z-10 order-2 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:order-1 lg:h-full lg:overflow-y-auto lg:px-12 xl:px-16 lg:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-900 dark:text-white/70">
            About the author
          </p>

          <h1 className="mt-3 font-display text-[36px] font-semibold leading-[1.02] tracking-tight text-neutral-950 dark:text-white sm:text-[44px] lg:text-[52px]">
            Dr. Jerome Joseph
          </h1>

          <p className="mt-3 text-[16px] font-semibold leading-snug text-neutral-900 dark:text-white sm:text-[18px]">
            Globally Recognised Brand &amp; Business Growth Expert
          </p>

          <div className="mt-7 max-w-[520px] space-y-4 text-[15px] leading-[1.65] text-neutral-600 dark:text-white/70 sm:text-[16px]">
            <p>
              Dr. Jerome Joseph is a globally recognised Brand &amp; Business Growth Expert with
              over 30 years of experience working with{" "}
              <strong className="font-semibold text-neutral-950 dark:text-white">
                1,000 brands across 40 countries
              </strong>
              , including Fortune 500 companies.
            </p>
            <p>
              A{" "}
              <strong className="font-semibold text-neutral-950 dark:text-white">
                Certified Speaking Professional (CSP)
              </strong>{" "}
              — a distinction held by only the top 12% of speakers worldwide — and inductee into
              the{" "}
              <strong className="font-semibold text-neutral-950 dark:text-white">
                Asia Speaker Hall of Fame
              </strong>
              , he has inspired over 1.2 million people through keynotes, masterclasses, and
              coaching.
            </p>
            <p>
              Ranked{" "}
              <strong className="font-semibold text-neutral-950 dark:text-white">
                No. 2 Global Brand Thought Leader
              </strong>{" "}
              in 2020 &amp; 2022, and{" "}
              <strong className="font-semibold text-neutral-950 dark:text-white">
                bestselling author of 12 books
              </strong>
              , Dr. Jerome helps leaders and organisations build brands that stand out, scale, and
              last.
            </p>
            <p>
              With <em>The 30-Day AI Personal Brand Plan</em>, he brings his proven branding
              methodology together with AI — so you can build influence, visibility, and authority
              one intentional day at a time.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Check out his website
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>

          <div className="mt-8">
            <p className="text-[12px] font-medium text-neutral-500 dark:text-white/45">
              Follow Dr. Jerome Joseph
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground dark:border-white/15 dark:text-white/75 dark:hover:border-primary dark:hover:bg-primary dark:hover:text-primary-foreground"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Photo — soft left fade into copy */}
        <div className="relative order-1 min-h-[280px] sm:min-h-[340px] lg:order-2 lg:h-full lg:min-h-0">
          <Image
            src="/media/author-Jerome-Joseph.jpg"
            alt="Dr. Jerome Joseph speaking on stage"
            fill
            priority
            unoptimized
            className="object-cover object-[center_12%]"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[28%] bg-gradient-to-r from-white via-white/60 to-transparent max-lg:hidden dark:from-[#0A0B11] dark:via-[#0A0B11]/60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-gradient-to-t from-white to-transparent lg:hidden dark:from-[#0A0B11]"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
