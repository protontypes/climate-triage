import { CountableCategory, CountableLanguage, CountableTag, Repository, Tag } from "@/types/types";

/**
 * Returns an array of languages with a count of how many repositories use them.
 * Filters out languages with less than 1 repositories and sorts the remaining languages alphabetically.
 * @param repositories An array of Repository objects.
 * @returns An array of CountableLanguage objects representing the filtered and sorted languages.
 */
export const getFilteredLanguages = (repositories: Repository[]) =>
  Object.values(
    repositories.reduce(
      (arr: { [key: string]: CountableLanguage }, repo: Repository) => {
        // group languages by id and count them
        const { id, display } = repo.language;
        if (arr[id] === undefined) arr[id] = { id, display, count: 1 };
        else arr[id].count++;
        return arr;
      },
      {} as { [key: string]: CountableLanguage }
    )
  )
    // Ignore language with less than 1 repositories
    .filter((language) => {
      if (language.count >= 1) return true;
      console.log(
        `Ignoring language "${language.display}" because it has less than 1 repositories.`
      );
      return false;
    })
    // Sort alphabetically
    .sort((a, b) => a.display.localeCompare(b.display));

/**
 * Returns an array of tags that are associated with at least 3 repositories.
 * @param repositories An array of Repository objects.
 * @returns An array of CountableTag objects.
 */
export const getFilteredTags = (repositories: Repository[]) =>
  Object.values(
    repositories
      .filter((repo) => repo.tags !== undefined)
      .flatMap((repo) => repo.tags as Tag[])
      .reduce(
        (arr: { [key: string]: CountableTag }, tag: Tag) => {
          // group tags by id and count them
          const { id, display } = tag;
          if (arr[id] === undefined) arr[id] = { id, display, count: 1 };
          else arr[id].count++;
          return arr;
        },
        {} as { [key: string]: CountableTag }
      )
  )
    // Ignore tags with less than 3 repositories
    .filter((tag) => {
      if (tag.count >= 3) return true;
      console.log(`Ignoring tag "${tag.display}" because it has less than 3 repositories.`);
      return false;
    })
    // Sort by count desc
    .sort((a, b) => b.count - a.count);

/**
 * Returns an array of languages with a count of how many repositories use them.
 * Filters out categories with less than 1 repositories and sorts the remaining languages alphabetically.
 * @param repositories An array of Repository objects.
 * @returns An array of CountableCategory objects representing the filtered and sorted languages.
 */
export const getFilteredCategories = (repositories: Repository[]) =>
  Object.values(
    repositories.reduce(
      (arr: { [key: string]: CountableCategory }, repo: Repository) => {
        // group categories by name and count them
        const { id, display } = repo.category;
        if (arr[id] === undefined) arr[id] = { id, display, count: 1 };
        else arr[id].count++;
        return arr;
      },
      {} as { [key: string]: CountableCategory }
    )
  )
    // Ignore categories with less than 1 repositories
    .filter((category) => {
      if (category.count >= 3) return true;
      console.log(`Ignoring category "${category.id}" because it has less than 1 repositories.`);
      return false;
    })
    // Sort alphabetically
    .sort((a, b) => a.id.localeCompare(b.id));
