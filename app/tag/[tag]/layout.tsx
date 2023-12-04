import { getData } from "@/app/data-loader";

// Generate segments for [tag]
export function generateStaticParams() {
  return getData()
    .tags.filter((t) => t.id)
    .map((t) => ({
      tag: t.id
    }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
