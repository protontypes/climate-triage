// AppDataContext.tsx
import {
  AppData,
  CountableCategory,
  CountableLanguage,
  CountableTag,
  Issue,
  Repository,
  RepositorySortDirection,
  RepositorySortMethod
} from "@/types/types";
import { getData } from "app/data-loader";
import React, { createContext, useEffect, useState } from "react";

type AppDataContextType = AppData & {
  filterRepositoriesByTag: (tag: string) => Repository[];
  filterRepositoriesByQuery: (query: string) => void;
  filterRepositoriesByLanguage: (languageId: string) => Repository[];
  filterRepositoriesByCategory: (categoryId: string) => Repository[];
  updateRepositorySortMethod: (
    sortMethod: RepositorySortMethod,
    sortDirection: RepositorySortDirection
  ) => void;
};

const DEFAULT_VALUE: AppDataContextType = {
  languages: [],
  categories: [],
  repositories: [],
  repositorySortMethod: RepositorySortMethod.ISSUE_AGE,
  repositorySortDirection: RepositorySortDirection.ASCENDING,
  tags: [],
  query: "",
  updateRepositorySortMethod: () => {},
  filterRepositoriesByTag: () => [],
  filterRepositoriesByQuery: () => {},
  filterRepositoriesByLanguage: () => [],
  filterRepositoriesByCategory: () => []
};

function getMostRecentIssue(repository: Repository): Issue {
  const sortedIssues = [...repository.issues].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });
  return sortedIssues[0];
}

const AppDataContext = createContext<AppDataContextType>(DEFAULT_VALUE);

const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const data = getData();
  const query = "";
  const {
    repositories: allRepositories
  }: {
    repositories: Repository[];
    languages: CountableLanguage[];
    categories: CountableCategory[];
    tags: CountableTag[];
  } = data;
  const [repositories, setRepositories] = useState<Repository[]>(allRepositories);

  // Set default sorting method & direction
  const [repositorySortMethod, setRepositorySortMethod] = useState<RepositorySortMethod>(
    RepositorySortMethod.ISSUE_AGE
  );
  const [repositorySortDirection, setRepositorySortDirection] = useState<RepositorySortDirection>(
    RepositorySortDirection.NONE
  );

  useEffect(() => {
    const { repositories } = data;
    setRepositories(repositories);
  }, [data]);

  const updateRepositorySortMethod = (
    sortMethod: RepositorySortMethod,
    sortDirection: RepositorySortDirection
  ) => {
    let nextSortDirection: RepositorySortDirection;
    if (sortMethod === repositorySortMethod) {
      switch (sortDirection) {
        case RepositorySortDirection.NONE:
          nextSortDirection = RepositorySortDirection.DESCENDING;
          break;
        case RepositorySortDirection.DESCENDING:
          nextSortDirection = RepositorySortDirection.ASCENDING;
          break;
        case RepositorySortDirection.ASCENDING:
        default:
          nextSortDirection = RepositorySortDirection.NONE;
          break;
      }
    } else {
      nextSortDirection = RepositorySortDirection.DESCENDING;
    }
    setRepositorySortMethod(sortMethod);
    setRepositorySortDirection(nextSortDirection);
    updateRepositoriesOnSortChange(sortMethod, nextSortDirection);
  };

  const updateRepositoriesOnSortChange = (sortMethod: RepositorySortMethod, order) => {
    let updatedRepositories: Repository[] = [...allRepositories];

    switch (sortMethod) {
      case RepositorySortMethod.ISSUE_AGE:
        updatedRepositories = updatedRepositories.sort((a, b) => {
          const newestIssueA = getMostRecentIssue(a).created_at;
          const newestIssueB = getMostRecentIssue(b).created_at;
          if (order === "Descending") {
            return new Date(newestIssueB).getTime() - new Date(newestIssueA).getTime();
          } else if (order === "Ascending") {
            return new Date(newestIssueA).getTime() - new Date(newestIssueB).getTime();
          } else {
            return 0;
          }
        });
        break;
      case RepositorySortMethod.PROJECT_AGE:
        updatedRepositories = updatedRepositories.sort((a, b) => {
          const newestIssueA = a.created_at;
          const newestIssueB = b.created_at;
          if (order === "Descending") {
            return new Date(newestIssueB).getTime() - new Date(newestIssueA).getTime();
          } else if (order === "Ascending") {
            return new Date(newestIssueA).getTime() - new Date(newestIssueB).getTime();
          } else {
            return 0;
          }
        });
        break;
      case RepositorySortMethod.STARS:
        updatedRepositories = updatedRepositories.sort((a, b) => {
          if (order === "Descending") {
            return b.stars - a.stars;
          } else if (order === "Ascending") {
            return a.stars - b.stars;
          } else {
            return 0;
          }
        });
        break;
      case RepositorySortMethod.DOWNLOADS:
        updatedRepositories = updatedRepositories.sort((a, b) => {
          if (order === "Descending") {
            return b.monthly_downloads - a.monthly_downloads;
          } else if (order === "Ascending") {
            return a.monthly_downloads - b.monthly_downloads;
          } else {
            return 0;
          }
        });
        break;
      default:
        break;
    }
    setRepositories(updatedRepositories);
  };

  const filterRepositoriesByTag = (tag: string) => {
    return repositories.filter((repository) => repository.tags?.some((t) => t.id === tag));
  };

  const filterRepositoriesByQuery = (query: string) => {
    if (query.length >= 3) {
      // Filter repositories based on query
      const filtered = allRepositories.filter((repository) => {
        const { name, owner, issues } = repository;
        const searchText = `${name} ${owner} ${issues.map((issue) => issue.title)}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });

      setRepositories(filtered);
    } else {
      setRepositories(allRepositories);
    }
  };

  const filterRepositoriesByLanguage = (languageId: string) => {
    return repositories.filter((repository) => repository.language.id === languageId);
  };

  const filterRepositoriesByCategory = (categoryId: string) => {
    return repositories.filter((repository) => repository.category.id === categoryId);
  };
  const value = {
    languages: data.languages,
    categories: data.categories,
    repositories,
    repositorySortMethod,
    repositorySortDirection,
    tags: data.tags,
    query,
    updateRepositorySortMethod,
    filterRepositoriesByTag,
    filterRepositoriesByQuery,
    filterRepositoriesByLanguage,
    filterRepositoriesByCategory
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export { AppDataContext, AppDataProvider };
