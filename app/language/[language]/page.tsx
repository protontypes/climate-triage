import { Layout } from "@/components/Layout";
import { RepositoryList } from "@/components/Repository/RepositoryList";
import { getData } from "app/data-loader";
import { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: { language: string };
}): Promise<Metadata | undefined> {
  const data = getData();
  const slug = decodeURI(params.language);
  const language = data.languages.find((l) => l.id === slug);

  return {
    title: `Language: ${language?.display} (${language?.count})`,
    description: `There are ${language?.count} repositories in the ${language?.display} language.`
  };
}

export default function Page({ params }: { params: { language: string } }) {
  return (
    <Layout>
      <RepositoryList languageId={params.language} />
    </Layout>
  );
}
