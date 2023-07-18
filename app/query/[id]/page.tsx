import QueryResult from "./QueryResult";
import { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    title: "Salesforce SOQL Generator",
    description:
      "Transforming English natural language into Salesforce SOQL queries",
    images: [`https://www.asksalesforce.ai/ogShare?id=${4}`],
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
