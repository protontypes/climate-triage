import { RepositorySortOrder } from "../../types";
import { SectionTitle } from "../SectionTitle";

type SortPickerProps = {
  activeSort: RepositorySortOrder;
  sortOptions: RepositorySortOrder[];
  onSortOrderSelect: (sortOrder: RepositorySortOrder) => void;
};

export const SortPicker = ({ activeSort, sortOptions, onSortOrderSelect }: SortPickerProps) => {
  return (
    <div
      className="flex flex-col justify-between pt-6 lg:flex-row lg:items-center lg:pt-0"
      id="repositories-list"
    >
      <div>
        <SectionTitle className="mb-2" text="Sort Repositories" />
      </div>
      <div>
        {sortOptions.map((sortOption) => {
          return (
            <button
              key={sortOption}
              onClick={() => onSortOrderSelect(sortOption)}
              className={`group m-1 inline-block rounded-sm border px-2 py-1 ${
                activeSort === sortOption
                  ? "active-pill"
                  : "border-silver-100 transition-all hover:border-yellow hover:text-yellow"
              }`}
            >
              {sortOption}
            </button>
          );
        })}
      </div>
    </div>
  );
};
