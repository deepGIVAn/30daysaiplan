import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-full brand-gradient text-xs font-semibold text-primary-foreground">
              JJ
            </div>
            <span className="font-display text-sm font-semibold text-foreground">BOOK HUB</span>
          </Link>
        </div>
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
