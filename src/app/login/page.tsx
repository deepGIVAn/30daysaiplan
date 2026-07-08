import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/auth/auth-screen";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sign In" };

const BOOK_DASHBOARD = "/books/30-day-ai-personal-brand-plan";

export default async function LoginPage() {
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect(BOOK_DASHBOARD);
  }

  return <AuthScreen mode="login" />;
}
