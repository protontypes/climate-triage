// AppDataContext.tsx
import {
  AppData,
  CountableCategory,
  CountableLanguage,
  CountableTag,
  Issue,
  Repository,
  RepositorySortOrder,
  RepositorySortType
} from "@/types/types";
import { getData } from "app/data-loader";
import React, { createContext, useEffect, useState } from "react";

type AppDataContextType = AppData & {
  filterRepositoriesByTag: (tag: string) => Repository[];
  filterRepositoriesByQuery: (query: string) => void;
  filterRepositoriesByLanguage: (languageId: string) => Repository[];
  filterRepositoriesByCategory: (categoryId: string) => Repository[];
  updateRepositorySortOrder: (sortOrder: RepositorySortOrder, sortType: RepositorySortType) => void;
};

const DEFAULT_VALUE: AppDataContextType = {
  languages: [],
  categories: [],
  repositories: [],
  repositorySortOrder: RepositorySortOrder.ISSUE_AGE,
  repositorySortType: RepositorySortType.ASCENDING,
  tags: [],
  query: "",
  updateRepositorySortOrder: () => {},
  filterRepositoriesByTag: () => [],
  filterRepositoriesByQuery: () => {},
  filterRepositoriesByLanguage: () => [],
  filterRepositoriesByCategory: () => []
};

function getNewestIssue(repository: Repository): Issue {
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
  const [repositorySortOrder, setRepositorySortOrder] = useState<RepositorySortOrder>(
    RepositorySortOrder.ISSUE_AGE
  );
  const [repositorySortType, setRepositorySortType] = useState<RepositorySortType>(
    RepositorySortType.NONE
  );

  useEffect(() => {
    const { repositories } = data;
    setRepositories(repositories);
  }, [data]);

  const updateRepositorySortOrder = (
    sortOrder: RepositorySortOrder,
    sortType: RepositorySortType
  ) => {
    let nextSortType: RepositorySortType;
    if (sortOrder === repositorySortOrder) {
      switch (sortType) {
        case RepositorySortType.NONE:
          nextSortType = RepositorySortType.DESCENDING;
          break;
        case RepositorySortType.DESCENDING:
          nextSortType = RepositorySortType.ASCENDING;
          break;
        case RepositorySortType.ASCENDING:
        default:
          nextSortType = RepositorySortType.NONE;
          break;
      }
    } else {
      nextSortType = RepositorySortType.DESCENDING;
    }
    setRepositorySortOrder(sortOrder);
    setRepositorySortType(nextSortType);
    updateRepositoriesOnSortChange(sortOrder, nextSortType);
  };

  const updateRepositoriesOnSortChange = (sortOrder: RepositorySortOrder, order) => {
    let updatedRepositories: Repository[] = [...allRepositories];

    switch (sortOrder) {
      case RepositorySortOrder.ISSUE_AGE:
        updatedRepositories = updatedRepositories.sort((a, b) => {
          const newestIssueA = getNewestIssue(a).created_at;
          const newestIssueB = getNewestIssue(b).created_at;
          if (order === "Descending") {
            return new Date(newestIssueB).getTime() - new Date(newestIssueA).getTime();
          } else if (order === "Ascending") {
            return new Date(newestIssueA).getTime() - new Date(newestIssueB).getTime();
          } else {
            return 0;
          }
        });
        break;
      case RepositorySortOrder.MOST_STARS:
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
      case RepositorySortOrder.MOST_DOWNLOADS:
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
    repositorySortOrder,
    repositorySortType,
    tags: data.tags,
    query,
    updateRepositorySortOrder,
    filterRepositoriesByTag,
    filterRepositoriesByQuery,
    filterRepositoriesByLanguage,
    filterRepositoriesByCategory
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export { AppDataContext, AppDataProvider };
