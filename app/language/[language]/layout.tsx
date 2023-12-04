import { getData } from "@/app/data-loader";

// Generate segments for [language]
export function generateStaticParams() {
  return getData()
    .languages.filter((l) => l.id)
    .map((l) => ({
      language: l.id
    }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
