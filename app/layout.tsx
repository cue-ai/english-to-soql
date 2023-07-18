import "@/app/globals.css";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/organisms/header";
import { TailwindIndicator } from "@/components/atoms/TailwindIndicator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Salesforce SOQL Generator",
    template: `%s - SOQL Converter`,
  },
  description:
    `This is a Salesforce SOQL assistant that takes in natural language and constructs and runs SOQL commands for you. 
    This allows anyone who doesn't have a thorough understanding of SOQL to make any queries they want`,
  icons: {
    icon: "/icon.ico",
  },
  openGraph: {
    title: "Salesforce SOQL Generator",
    description:
      "Transforming English natural language into Salesforce SOQL queries",
    images: ["https://www.asksalesforce.ai/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salesforce SOQL Generator",
    description:
      '"Transforming English natural language into Salesforce SOQL queries',
    images: ["https://www.asksalesforce.ai/og"],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
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
            className="flex flex-col h-full min-h-screen bg-background"
          >
            <Header />
            <main className="flex flex-col flex-1 ">{children}</main>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
