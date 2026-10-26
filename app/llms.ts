import type { Data } from "@/types/types";
import config from "./config.mts";

type CountedLink = { id: string; display: string; count: number };

// https://llmstxt.org. Tags are left out: there are about a hundred, mostly overlapping
// categories and languages.
export function buildLlmsTxt(data: Data): string {
  const { siteUrl } = config.meta;

  const section = (title: string, path: string, items: CountedLink[]) =>
    [
      `## ${title}`,
      ...items
        .filter((i) => i.id)
        .sort((a, b) => b.count - a.count)
        .map(
          (i) =>
            `- [${i.display}](${siteUrl}/${path}/${i.id}): ${i.count} ${i.count === 1 ? "project" : "projects"}`
        )
    ].join("\n");

  return [
    `# ${config.meta.siteName}`,
    `> ${config.meta.description}`,
    `${data.repositories.length} projects from OpenSustain.tech, rebuilt hourly from the [ecosyste.ms OST API](https://ost.ecosyste.ms/api/v1/issues/openclimateaction). Query the API directly for structured or filtered data.`,
    section("Categories", "category", data.categories),
    section("Languages", "language", data.languages),
    [
      "## Optional",
      `- [About](${siteUrl}/about): Background on the project and its partners`,
      `- [Source code](${config.links.github})`,
      `- [Community](${config.links.community}): Discord server`
    ].join("\n")
  ].join("\n\n");
}
