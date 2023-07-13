import QueryResult from "@/app/query/[id]/QueryResult";
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
    images: ["https://www.asksalesforce.ai/ogShare"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salesforce SOQL Generator",
    description:
      '"Transforming English natural language into Salesforce SOQL queries',
    images: ["https://www.asksalesforce.ai/ogShare"],
  },
};

export default function QueryPage({ params }: { params: { id: string } }) {
  return <QueryResult id={params.id} />;
}
