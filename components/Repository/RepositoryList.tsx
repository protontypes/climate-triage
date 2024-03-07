"use client";

import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { Repository } from "types/types";
import { REPOSITORY_SORT_OPTIONS } from "../../constants";
import { useAppData } from "../../hooks/useAppData";
import { SortPicker } from "../Picker/SortPicker";
import { RepositoryItem } from "./RepositoryItem";
import { SearchBar } from "./SearchBar";

type RepositoryListProps = {
  languageId?: string;
  categoryId?: string;
  tagId?: string;
};

const Loader = () => (
  <div className="w-full p-4">
    <div className="flex items-center justify-center">
      <FontAwesomeIcon icon={faCircleNotch} spin />
    </div>
  </div>
);

export const RepositoryList = ({ languageId, categoryId, tagId }: RepositoryListProps) => {
  const itemsPerScroll = 15;
  const [items, setItems] = useState(itemsPerScroll);
  const {
    repositories,
    repositorySortType,
    repositorySortOrder,
    seeRecentIssues,
    updateRepositorySortOrder,
    filterRepositoriesByTag,
    filterRepositoriesByLanguage,
    filterRepositoriesByCategory
  } = useAppData();
  let repos: Repository[] = repositories;

  if (languageId) {
    repos = filterRepositoriesByLanguage(languageId);
  }

  if (categoryId) {
    repos = filterRepositoriesByCategory(categoryId);
  }

  if (tagId) {
    repos = filterRepositoriesByTag(tagId);
  }

  return (
    <main className="grow md:max-w-sm lg:max-w-none">
      <div className="px-6">
        <SortPicker
          seeRecentIssues={seeRecentIssues}
          activeSort={repositorySortOrder}
          sortOptions={REPOSITORY_SORT_OPTIONS}
          onSortOrderSelect={updateRepositorySortOrder}
          sortType={repositorySortType}
        />
        <SearchBar />
        <InfiniteScroll
          className="pt-6"
          dataLength={items}
          next={() => setItems(items + itemsPerScroll)}
          hasMore={items < repos.length}
          loader={<Loader />}
        >
          {repos.slice(0, items).map((repository) => {
            // NOTE - We sometimes get duplicate values back from GitHub API
            // meaning we can't simply rely on the id as the key
            const key = `${repository.id}_${new Date().getTime()}_${Math.random()}`;

            return <RepositoryItem key={key} repository={repository} />;
          })}
        </InfiniteScroll>
      </div>
    </main>
  );
};
