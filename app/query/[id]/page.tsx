import QueryResult from "@/app/query/[id]/QueryResult";
import { Metadata } from "next";

export const metadata: Metadata = {
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
