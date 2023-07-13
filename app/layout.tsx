import Head from "next/head";

import "@/app/globals.css";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/organisms/header";
import { TailwindIndicator } from "@/components/atoms/TailwindIndicator";

// export const metadata: Metadata = {
//   title: {
//     default: "Salesforce SOQL Generator",
//     template: `SOQL Converter`,
//   },
//   description:
//     '"Experience the power of AI with our GPT-driven tool, adeptly transforming English natural language into Salesforce SOQL queries. ' +
//     "Streamline your data management process, minimize coding efforts, and maximize productivity. " +
//     "Ideal for beginners and seasoned Salesforce users alike, our tool offers unparalleled ease-of-use and accuracy in generating " +
//     "SOQL queries. " +
//     'Revolutionize your Salesforce experience today, boost efficiency, and unlock deeper insights from your data."',
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
//   icons: {
//     icon: "/icon.ico",
//     shortcut: "/favicon-16x16.png",
//     apple: "/apple-touch-icon.png",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Next.js",
//     description: "The React Framework for the Web",
//     siteId: "1467726470533754880",
//     creator: "@nextjs",
//     creatorId: "1467726470533754880",
//     images: ["https://nextjs.org/og.png"],
//   },
// };

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>AI-Powered English to SOQL Converter</title>
        <meta
          name="description"
          content="Leverage the power of AI with our GPT-driven tool that converts English natural language to Salesforce SOQL queries.
          Ideal for beginners and experts alike, it saves time, reduces coding errors, and provides deeper insights from your data."
        />
        <meta
          name="keywords"
          content="Salesforce, SOQL, AI, GPT, Natural Language Processing, Query Converter"
        />
        <meta
          property="og:title"
          content="AI-Powered English to SOQL Converter"
        />
        <meta
          property="og:description"
          content="Leverage the power of AI with our GPT-driven tool that converts English natural language to Salesforce SOQL queries. Ideal for beginners and experts alike, it saves time, reduces coding errors, and provides deeper insights from your data."
        />
        <meta
          property="og:image"
          content="https://www.asksalesforce.ai/OGIMage.jpg"
        />
        <meta property="og:url" content="https://www.asksalesforce.ai/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://www.asksalesforce.ai/ShareOgImage.jpg"
        />

        <link rel="icon" href="icon.ico" />
      </Head>
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
