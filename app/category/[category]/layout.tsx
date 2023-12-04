import { getData } from "@/app/data-loader";

// Generate segments for [category]
export function generateStaticParams() {
  return getData()
    .categories.filter((c) => c.id)
    .map((c) => ({
      category: c.id
    }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
