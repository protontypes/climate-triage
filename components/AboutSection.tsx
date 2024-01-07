import config from "@/app/config.mts";
import Link from "next/link";
import { SectionTitle } from "./SectionTitle";

export const AboutSection = () => {
  return (
    <div>
      <SectionTitle className="mb-2" text="About" />
      <h1 className="hidden text-lg font-bold">{config.meta.title}</h1>
      <p className="text-gray-900 dark:text-silver-500">
        <strong>Discover a meaningful way to join open source projects by contributing to Good First Issues focused on climate
         and sustainability. Curious but unsure about the details?{" "}</strong>
        <Link href="/about/" className="text-primary underline">
         <strong>Read more...</strong>
        </Link>
      </p>
    </div>
  );
};
