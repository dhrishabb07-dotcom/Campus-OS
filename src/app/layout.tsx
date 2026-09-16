import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { Toaster } from "@/components/shared/toaster";

export const metadata: Metadata = {
  title: {
    template: "%s — CampusOS",
    default: "CampusOS — Your entire college life. One calm workspace.",
  },
  description:
    "CampusOS brings your schedule, tasks, subjects, and attendance into one focused academic workspace.",
  keywords: ["student", "academic", "productivity", "schedule", "tasks"],
  authors: [{ name: "CampusOS" }],
  creator: "CampusOS",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111113" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full`}
    >
      <body className="h-full antialiased">
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
