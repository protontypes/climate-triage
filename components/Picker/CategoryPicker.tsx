import type { CountableCategory } from "@/types/types";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { SectionTitle } from "../SectionTitle";
import ActiveTagButton from "./ActiveTagButton";
import { PickerItem } from "./PickerItem";
type CategoryPickerProps = {
  activeTagId: string | string[] | undefined;
  categories: CountableCategory[];
  onCategoryPage: boolean;
  isCollapsedDefault?: boolean;
};

export const CategoryPicker = ({
  activeTagId,
  categories,
  onCategoryPage,
  isCollapsedDefault = true
}: CategoryPickerProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isCollapsedDefault);

  // Automatically collapse the sidebar after redirection
  useEffect(() => {
    setIsCollapsed(isCollapsedDefault);
  }, [isCollapsedDefault, onCategoryPage, activeTagId]);

  // Toggle the collapsible sidebar
  const toggleCollapsible = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="pt-6">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        onClick={toggleCollapsible}
        className={`flex cursor-pointer ${isCollapsed ? "sm:flex" : ""}`}
      >
        <SectionTitle text="Browse by Category" />
        <FontAwesomeIcon
          icon={faChevronDown}
          className={classNames(
            "mx-2 mt-[3px] text-gray-900 transition-transform duration-300 ease-in-out dark:text-silver-500",
            {
              ["rotate-0"]: isCollapsed,
              ["rotate-180"]: !isCollapsed
            }
          )}
        />

        {/* Display the active tag button when a category is selected, and the category picker is collapsed. */}
        {activeTagId && isCollapsed ? <ActiveTagButton data={activeTagId} /> : null}
      </div>
      <div
        className={classNames("-mx-1 mt-2 overflow-hidden duration-300 ease-in-out", {
          ["max-h-0 sm:max-h-20"]: isCollapsed,
          ["max-h-full"]: !isCollapsed
        })}
      >
        {categories
          .filter((c) => c.id)
          .sort((a, b) => b.count - a.count)
          .map((category) => {
            const isActive = onCategoryPage && category.id === activeTagId;
            return (
              <PickerItem
                className={classNames("group m-1 inline-block rounded-sm border px-2 py-1", {
                  ["active-pill"]: isActive,
                  ["border-silver-100 transition-all hover:border-primary hover:text-primary"]:
                    !isActive
                })}
                href={isActive ? "/" : `/category/${category.id}`}
                key={category.id}
                text={category.display}
                totalOccurrences={category.count}
              />
            );
          })}
      </div>
    </div>
  );
};
