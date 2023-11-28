import { Layout } from "@/components/Layout";
import { RepositoryList } from "@/components/Repository/RepositoryList";
import { getData } from "app/data-loader";
import { Metadata } from "next";

export async function generateMetadata({
  params
}: {
  params: { category: string };
}): Promise<Metadata | undefined> {
  const data = getData();
  const slug = decodeURI(params.category);
  const category = data.categories.find((l) => l.id === slug);

  return {
    title: `category ${category?.display} (${category?.count})`,
    description: `There are ${category?.count} repositories in the ${category?.display} category. Take the first step into collaborative coding, and be part of something bigger. Your code today could be the start of something amazing in the open-source community.`
  };
}

export default function Page({ params }: { params: { category: string } }) {
  return (
    <Layout>
      <RepositoryList categoryId={params.category} />
    </Layout>
  );
}
