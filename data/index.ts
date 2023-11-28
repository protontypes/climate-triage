import { Data, Repository } from "@/types/types";
import slugify from "slugify";
import { GetAllProjects } from "./ecosystems";
import { getFilteredCategories, getFilteredLanguages, getFilteredTags } from "./shared";
import { writeDataFile } from "./utils";

function formatStars(stars: number): string {
  if (stars < 1000) {
    return stars.toString();
  } else if (stars < 1000000) {
    return (stars / 1000).toFixed(1) + "K";
  } else {
    return (stars / 1000000).toFixed(1) + "M";
  }
}

const main = async () => {
  console.log(
    "⚠️ This command must be run from the root of the project directory with `pnpm prebuild`"
  );
  try {
    const repositories = (await GetAllProjects()).map(
      ({ id, name, url, language, category, repository, issues }) => {
        const { description, owner, stargazers_count, license, last_synced_at, topics } =
          repository;
        return {
          id: id.toString(),
          owner,
          name,
          description,
          url,
          stars: stargazers_count,
          stars_display: formatStars(stargazers_count),
          license: license ?? undefined, // TODO: Handle null better here
          last_modified: last_synced_at.toString(),
          language: {
            id: language ? slugify(language, { lower: true }) : "na", // TODO: Handle null better here
            display: language ?? "N/A"
          },
          has_new_issues: false, // TODO: Keep this as is unless there's a way to determine the value
          category: {
            id: slugify(category, { lower: true }),
            display: category
          },
          issues: issues.map(
            ({ uuid, comments_count, created_at, number, title, labels, html_url }) => ({
              id: uuid,
              comments_count,
              created_at: created_at.toString(),
              number,
              title,
              labels: labels.map((label) => ({ id: label, display: label })),
              url: html_url
            })
          ),
          tags: topics.map((t) => ({
            display: slugify(t, { lower: true }),
            id: t
          }))
        } as Repository;
      }
    );

    // Get a list of distinct languages with counts for use with filtering in the UI
    const filteredLanguages = getFilteredLanguages(repositories);

    // Get a list of distinct tags with counts for use with filtering in the UI
    const filteredTags = getFilteredTags(repositories);

    // Get a list of distinct categories with counts for use with filtering in the UI
    const filteredCategories = getFilteredCategories(repositories);

    const data: Data = {
      // Sort the repositories randomly so that the list isn't always the same
      repositories: repositories.sort(() => Math.random() - 0.5),
      languages: filteredLanguages,
      tags: filteredTags,
      categories: filteredCategories
    };

    await Promise.all([writeDataFile(data)]);

    console.log("Data generation complete.");
  } catch (e) {
    console.error(e);
  }
};

main();
