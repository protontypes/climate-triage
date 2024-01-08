// AppDataContext.tsx
import {
  AppData,
  CountableCategory,
  CountableLanguage,
  CountableTag,
  Issue,
  Repository,
  RepositorySortOrder
} from "@/types/types";
import { getData } from "app/data-loader";
import React, { createContext, useEffect, useState } from "react";

type AppDataContextType = AppData & {
  filterRepositoriesByTag: (tag: string) => Repository[];
  filterRepositoriesByQuery: (query: string) => void;
  filterRepositoriesByLanguage: (languageId: string) => Repository[];
  filterRepositoriesByCategory: (categoryId: string) => Repository[];
};

const DEFAULT_VALUE: AppDataContextType = {
  languages: [],
  categories: [],
  repositories: [],
  repositorySortOrder: RepositorySortOrder.NONE,
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
    RepositorySortOrder.NONE
  );

  useEffect(() => {
    const { repositories } = data;
    setRepositories(repositories);
  }, [data]);

  const updateRepositorySortOrder = (sortOrder: RepositorySortOrder) => {
    const isSetToDefaultSort = sortOrder === RepositorySortOrder.NONE;
    const shouldDeselect = !isSetToDefaultSort && sortOrder === repositorySortOrder;

    const finalSortOrder = shouldDeselect ? RepositorySortOrder.NONE : sortOrder;

    setRepositorySortOrder(finalSortOrder);
    updateRepositoriesOnSortChange(finalSortOrder);
  };

  const updateRepositoriesOnSortChange = (sortOrder: RepositorySortOrder) => {
    let updatedRepositories: Repository[] = [];

    // Find and return the newest issue in a given repository
    if (sortOrder === RepositorySortOrder.NEW_ISSUES) {
      updatedRepositories = [...allRepositories].sort((a, b) => {
        const newestIssueA = getNewestIssue(a).created_at;
        const newestIssueB = getNewestIssue(b).created_at;
        return new Date(newestIssueB).getTime() - new Date(newestIssueA).getTime();
      });
    }

    // Sort by number of stars
    if (sortOrder === RepositorySortOrder.MOST_STARS) {
      updatedRepositories = [...allRepositories].sort((a, b) => b.stars - a.stars);
    }

    // Sort by number of monthly downloads
    if (sortOrder === RepositorySortOrder.MOST_DOWNLOADS) {
      updatedRepositories = [...allRepositories].sort(
        (a, b) => b.monthly_downloads - a.monthly_downloads
      );
    }

    // Sort by newest project
    if (sortOrder === RepositorySortOrder.NEWEST) {
      updatedRepositories = [...allRepositories].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    if (sortOrder === RepositorySortOrder.NONE) {
      updatedRepositories = allRepositories;
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
