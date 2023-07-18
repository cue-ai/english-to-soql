import QueryResult from "./QueryResult";
import { Metadata } from "next";


type MetaProps = {
  params: { id: string }
}


export async function generateMetadata(
    { params }: MetaProps
): Promise<Metadata> {
  // read route params
  const id = params.id

  // we want to get the data then can pass in as props
  const res = await fetch(`/api/query/${id}`, {
    method: "GET",
  });
  const { code, userContent, result } = await res.json();

  return {
    openGraph: {
      title: "Salesforce SOQL Generator",
      description:
          "Transforming English natural language into Salesforce SOQL queries",
      images: [`https://www.asksalesforce.ai/ogShare?code=${code}&userContent=${userContent}&totalSize=${result.totalSize}`],
    },
    twitter: {
      card: "summary_large_image",
      title: "Salesforce SOQL Generator",
      description:
          '"Transforming English natural language into Salesforce SOQL queries',
      images: [`https://www.asksalesforce.ai/ogShare?code=${code}&userContent=${userContent}&totalSize=${result.totalSize}`],
    },
  }
}


export default function QueryPage({ params }: { params: { id: string } }) {
  return <QueryResult id={params.id} />;
}
