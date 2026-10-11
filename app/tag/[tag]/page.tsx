import type { Metadata } from "next";
import { getData } from "@/app/data-loader";
import { Layout } from "@/components/Layout";
import { RepositoryList } from "@/components/Repository/RepositoryList";

export async function generateMetadata({
  params
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata | undefined> {
  const data = getData();
  const slug = decodeURI((await params).tag);
  const tag = data.tags.find((t) => t.id === slug);

  return {
    title: `Tag: ${tag?.display} (${tag?.count})`,
    description: `There are ${tag?.count} repositories tagged ${tag?.display} on OST.`
  };
}

export default async function Page({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return (
    <Layout>
      <RepositoryList tagId={tag} />
    </Layout>
  );
}
