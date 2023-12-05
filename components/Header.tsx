import { Tag } from "@/types/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import config from "../app/config.mts";
import { useAppData } from "../hooks/useAppData";

export const Header = () => {
  const { tag: activeTagId, language: activeLanguageId } = useParams();
  const { languages, categories, tags } = useAppData();
  const activeFilter = [...languages, ...categories, ...tags].find(
    (t: Tag) => t.id === activeTagId || t.id === activeLanguageId
  );

  return (
    <header className="container mx-auto my-5 flex flex-col items-center bg-black-400 p-6 md:my-10 md:flex-row md:justify-between lg:max-w-6xl">
      <nav className="flex flex-wrap items-center md:justify-center">
        <Link href="/" title="Home" aria-label="Home">
          {config.meta.title}
          {/* <Image src="/verto.png" alt="verto.sh" className="h-12" width={320} height={52} /> */}
        </Link>
        {activeFilter ? (
          <span className="ml-8 cursor-pointer pt-4 text-4xl font-semibold text-silver-500">
            {activeFilter?.display}
          </span>
        ) : null}
      </nav>
    </header>
  );
};
