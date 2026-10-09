import { RepositorySortDirection, RepositorySortMethod } from "@/types/types";
import { faCaretDown, faCaretUp, faShuffle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { SectionTitle } from "../SectionTitle";

type SortPickerProps = {
  activeSort: RepositorySortMethod;
  sortDirection: RepositorySortDirection;
  sortOptions: RepositorySortMethod[];
  onSortMethodSelect: (
    sortMethod: RepositorySortMethod,
    sortDirection: RepositorySortDirection
  ) => void;
};
export const SortPicker = ({
  activeSort,
  sortOptions,
  onSortMethodSelect,
  sortDirection
}: SortPickerProps) => {
  return (
    <div
      className="flex flex-col justify-between pt-6 lg:flex-row lg:items-center lg:pt-0"
      id="repositories-list"
    >
      <div>
        <SectionTitle className="mb-2 md:mb-0" text="Sort By" />
      </div>
      <div className="-mx-1">
        {sortOptions.map((sortOption) => {
          const isActive = activeSort === sortOption;
          return (
            <button
              key={sortOption}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSortMethodSelect(sortOption, sortDirection)}
              className={classNames("group m-1 inline-block rounded-sm border px-2 py-1", {
                ["active-pill"]: isActive,
                ["border-silver-100 transition-all hover:border-primary hover:text-primary"]:
                  !isActive
              })}
            >
              {sortOption}
              {isActive && (
                <>
                  {sortDirection === RepositorySortDirection.ASCENDING && (
                    <FontAwesomeIcon icon={faCaretUp} className="ms-1" aria-hidden="true" />
                  )}
                  {sortDirection === RepositorySortDirection.DESCENDING && (
                    <FontAwesomeIcon icon={faCaretDown} className="ms-1" aria-hidden="true" />
                  )}
                  {sortDirection === RepositorySortDirection.NONE && (
                    <FontAwesomeIcon icon={faShuffle} className="ms-1" aria-hidden="true" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
