import config from "@/app/config.mts";
import Link from "next/link";
import { SectionTitle } from "./SectionTitle";

export const AboutSection = () => {
  return (
    <div>
      <SectionTitle className="mb-2" text="About" />
      <h1 className="hidden text-lg font-bold">{config.meta.title}</h1>
      <p className="text-gray-900 dark:text-silver-500">
        Launch your open source journey in climate and sustainability. Explore current Good First
        Issues from open source initiatives focused on protecting natural resources. Still don't
        know where to start?
        <Link href={config.links.community} className="text-primary underline">
          <strong>Ask the community.</strong>
        </Link>
      </p>
    </div>
  );
};
