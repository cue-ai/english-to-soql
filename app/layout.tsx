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
    template: `SOQL Converter`,
  },
  description:
    '"Experience the power of AI with our GPT-driven tool, adeptly transforming English natural language into Salesforce SOQL queries. ' +
    "Streamline your data management process, minimize coding efforts, and maximize productivity. " +
    "Ideal for beginners and seasoned Salesforce users alike, our tool offers unparalleled ease-of-use and accuracy in generating " +
    "SOQL queries. " +
    'Revolutionize your Salesforce experience today, boost efficiency, and unlock deeper insights from your data."',
  icons: {
    icon: "/icon.ico",
  },
  openGraph: {
    title: "Salesforce SOQL Generator",
    description:
      "Transforming English natural language into Salesforce SOQL queries",
    images: ["https://www.asksalesforce.ai/og"],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/*<link rel="icon" href="icon.ico" />*/}</head>
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
            <main className="flex flex-col flex-1">{children}</main>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
