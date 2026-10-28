import type { Metadata } from "next";
import { getData } from "#app/data-loader";
import { Layout } from "#components/Layout";
import { RepositoryList } from "#components/Repository/RepositoryList";

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata | undefined> {
  const data = getData();
  const slug = decodeURI((await params).category);
  const category = data.categories.find((l) => l.id === slug);

  return {
    title: `Category: ${category?.display} (${category?.count})`,
    description: `There are ${category?.count} repositories in the ${category?.display} category. Take the first step into collaborative coding, and be part of something bigger. Your code today could be the start of something amazing in the open-source community.`
  };
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return (
    <Layout>
      <RepositoryList categoryId={category} />
    </Layout>
  );
}
