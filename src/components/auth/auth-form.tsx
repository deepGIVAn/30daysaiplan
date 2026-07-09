"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { migrateLocalProgressToServer } from "@/lib/progress/local";

const BOOK_DASHBOARD = "/books/30-day-ai-personal-brand-plan";
const BOOK_SLUG = "30-day-ai-personal-brand-plan";
const TOTAL_DAYS = 30;
const GUEST_COOKIE = "bookhub_guest";

interface AuthFormProps {
  mode: "login" | "signup";
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.75}
        />
        {children}
      </div>
    </div>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isSignup = mode === "signup";

  function continueAsGuest() {
    document.cookie = `${GUEST_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    router.push(BOOK_DASHBOARD);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured. Create a .env.local file in the project root with your Supabase URL and anon key, then restart the dev server.",
      );
      setLoading(false);
      return;
    }

    let supabase;
    try {
      supabase = createClient();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect to Supabase.");
      setLoading(false);
      return;
    }

    if (isSignup) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email.split("@")[0] },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else if (data.session) {
        document.cookie = `${GUEST_COOKIE}=; path=/; max-age=0`;
        try {
          await migrateLocalProgressToServer(BOOK_SLUG, TOTAL_DAYS);
        } catch {
          setError("Account created, but some local progress could not be synced.");
        }
        router.push(BOOK_DASHBOARD);
        router.refresh();
      } else {
        setMessage("Check your email to confirm your account, or log in if email confirmation is disabled.");
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      } else {
        document.cookie = `${GUEST_COOKIE}=; path=/; max-age=0`;
        try {
          await migrateLocalProgressToServer(BOOK_SLUG, TOTAL_DAYS);
        } catch {
          setError("Signed in, but some local progress could not be synced. Your data is still on this device.");
        }
        router.push(BOOK_DASHBOARD);
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-7">
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <Field label="Display name" icon={User}>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="h-11 bg-[#fafbfc] pl-10"
            />
          </Field>
        )}

        <Field label="Email" icon={Mail}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="h-11 bg-[#fafbfc] pl-10"
          />
        </Field>

        <Field label="Password" icon={Lock}>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="h-11 bg-[#fafbfc] pl-10"
          />
        </Field>

        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-600">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-xl border border-success/20 bg-success/10 px-3 py-2.5 text-sm text-success">
            {message}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
          {!loading && <ArrowRight className="h-4 w-4" strokeWidth={1.75} />}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <p className="relative mx-auto w-fit bg-white px-3 text-[12px] text-muted-foreground">
          or
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full border-dashed"
        onClick={continueAsGuest}
      >
        Continue as guest
      </Button>

      <p className="mt-6 text-center text-[13px] leading-relaxed text-muted-foreground">
        {isSignup ? (
          <>
            By creating an account, you agree to save your journey progress securely with your
            profile.
          </>
        ) : (
          <>Guest mode saves progress on this device only.</>
        )}
      </p>
    </div>
  );
}
