"use client";

import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo, useState } from "react";
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
    repositorySortDirection,
    repositorySortMethod,
    updateRepositorySortMethod,
    filterRepositoriesByTag,
    filterRepositoriesByLanguage,
    filterRepositoriesByCategory
  } = useAppData();
  const repos: Repository[] = useMemo(() => {
    if (languageId) {
      return filterRepositoriesByLanguage(languageId);
    }

    if (categoryId) {
      return filterRepositoriesByCategory(categoryId);
    }

    if (tagId) {
      return filterRepositoriesByTag(tagId);
    }

    return repositories;
  }, [
    repositories,
    languageId,
    categoryId,
    tagId,
    filterRepositoriesByLanguage,
    filterRepositoriesByCategory,
    filterRepositoriesByTag
  ]);

  const visibleRepos = useMemo(() => repos.slice(0, items), [repos, items]);

  const loadMore = useCallback(() => {
    setItems((prev) => prev + itemsPerScroll);
  }, [itemsPerScroll]);

  return (
    <main className="grow md:max-w-sm lg:max-w-none">
      <div className="px-6">
        <SortPicker
          activeSort={repositorySortMethod}
          sortOptions={REPOSITORY_SORT_OPTIONS}
          onSortMethodSelect={updateRepositorySortMethod}
          sortDirection={repositorySortDirection}
        />
        <SearchBar />
        <InfiniteScroll
          className="pt-6"
          dataLength={items}
          next={loadMore}
          hasMore={items < repos.length}
          loader={<Loader />}
        >
          {visibleRepos.map((repository, index) => {
            // NOTE - We sometimes get duplicate values back from GitHub API,
            // so fall back to the list index to keep keys unique but stable.
            const key = `${repository.id}_${index}`;

            return <RepositoryItem key={key} repository={repository} />;
          })}
        </InfiniteScroll>
      </div>
    </main>
  );
};
