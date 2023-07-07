import { Metadata } from "next";

import "@/app/globals.css";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/organisms/header";
import { TailwindIndicator } from "@/components/atoms/TailwindIndicator";

export const metadata: Metadata = {
  title: {
    default: "Next.js AI Chatbot",
    template: `%s - Next.js AI Chatbot`,
  },
  description: "An AI-powered chatbot template built with Next.js and Vercel.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div
            style={{ backgroundImage: `url(/background.svg)` }}
            className="flex flex-col h-screen bg-background"
          >
            <Header />
            <main className="flex flex-col flex-1">{children}</main>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}