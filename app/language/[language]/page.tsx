import type { Metadata } from "next";
import { getData } from "#app/data-loader";
import { Layout } from "#components/Layout";
import { RepositoryList } from "#components/Repository/RepositoryList";

export async function generateMetadata({
  params
}: {
  params: Promise<{ language: string }>;
}): Promise<Metadata | undefined> {
  const data = getData();
  const slug = decodeURI((await params).language);
  const language = data.languages.find((l) => l.id === slug);

  return {
    title: `Language: ${language?.display} (${language?.count})`,
    description: `There are ${language?.count} repositories in the ${language?.display} language.`
  };
}

export default async function Page({ params }: { params: Promise<{ language: string }> }) {
  const { language } = await params;
  return (
    <Layout>
      <RepositoryList languageId={language} />
    </Layout>
  );
}
