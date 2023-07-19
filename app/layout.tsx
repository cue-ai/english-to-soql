import "@/app/globals.css";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Script from 'next/script'
import { TailwindIndicator } from "@/components/atoms/TailwindIndicator";
import { Metadata } from "next";


export async function generateMetadata(
): Promise<Metadata> {
  return {
    title: {
      default: "AskSalesforce.ai",
      template: `%s - SOQL Generator`,
    },
    description:
        `Supercharge your team’s productivity with our free English to SOQL tool that makes Salesforce querying a breeze. 
        Say hello to seamless data management and lightning-fast insights.`,
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
  }

}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      {process.env.NODE_ENV === "production" && <Script id="show-banner">
        {
          `(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "i1ftyjvyb0");`
        }
      </Script>}
    </head>
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

            <main className="flex flex-col flex-1 ">{children}</main>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
