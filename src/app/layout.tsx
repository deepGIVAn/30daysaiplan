import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BOOK HUB — Dr. Jerome Joseph",
    template: "%s | BOOK HUB",
  },
  description: "30-Day AI Personal Brand Plan — Interactive Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="h-full antialiased">
        <ThemeProvider>
          <div className="relative h-full overflow-hidden">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
