import config from "@/app/config.mts";
import Link from "next/link";
import { SectionTitle } from "./SectionTitle";

export const AboutSection = () => {
  return (
    <div>
      <SectionTitle className="mb-2" text="About" />
      <h1 className="hidden text-lg font-bold">{config.meta.title}</h1>
      <p className="text-gray-900 dark:text-silver-500">
        Find your impactful open source contribution to climate technology and sustainability.{" "}
        <Link href="/about/" className="text-primary underline">
          Read more...
        </Link>
      </p>
    </div>
  );
};
