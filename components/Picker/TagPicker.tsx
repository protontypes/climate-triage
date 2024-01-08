import { CountableTag } from "@/types/types";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { ShowMoreButton } from "../Button/ShowMoreButton";
import { SectionTitle } from "../SectionTitle";
import ActiveTagButton from "./ActiveTagButton";
import { PickerItem } from "./PickerItem";

type TagPickerProps = {
  activeTagId: string | string[] | undefined;
  onTagPage: boolean;
  tags: CountableTag[];
  isCollapsedDefault?: boolean;
};

export const TagPicker = ({
  tags,
  activeTagId,
  onTagPage,
  isCollapsedDefault = true
}: TagPickerProps) => {
  const limitStep = 15;
  const [limit, setLimit] = useState(limitStep);
  const hasMore = tags.length > limit;

  const [isCollapsed, setIsCollapsed] = useState<boolean>(isCollapsedDefault);

  // showLess button is only visible when the limit value exceeds by limitStep(i.e 15)
  const isShowLessVisible = limit > limitStep;

  // Automatically collapse the sidebar after redirection
  useEffect(() => {
    setIsCollapsed(isCollapsedDefault);
  }, [isCollapsedDefault, activeTagId]);

  const toggleCollapsible = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleShowMore = () => {
    setLimit((limit) => limit + limitStep);
  };
  const handleShowLess = () => {
    setLimit(limitStep);
  };

  return (
    <div className="pt-6">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        onClick={toggleCollapsible}
        className={`flex cursor-pointer ${isCollapsed ? "sm:flex" : ""}`}
      >
        <SectionTitle text="Browse by tag" />
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
        <button
          className={`${
            !isShowLessVisible ? "md:hidden" : "md:inline-block"
          } active-pill group mb-2 ml-2 hidden cursor-pointer rounded-sm border px-2 py-1 transition-all hover:bg-primary hover:text-white`}
          onClick={handleShowLess}
        >
          Show Less
        </button>
        {/* Display the active tag button when a tag is selected, and the tag picker is collapsed. */}
        {activeTagId && isCollapsed && <ActiveTagButton data={activeTagId} />}
      </div>
      <div
        className={classNames("-mx-1 mt-2 overflow-hidden duration-300 ease-in-out", {
          ["max-h-0 sm:max-h-20"]: isCollapsed,
          ["max-h-full"]: !isCollapsed
        })}
      >
        {tags
          .sort((a, b) => b.count - a.count)
          .slice(0, limit)
          .map((tag) => {
            const isActive = onTagPage && tag.id === activeTagId;
            return (
              <PickerItem
                className={classNames("group m-1 inline-block rounded-sm border px-2 py-1", {
                  ["active-pill"]: isActive,
                  ["border-silver-100 transition-all hover:border-primary hover:text-primary"]:
                    !isActive
                })}
                href={isActive ? "/" : `/tag/${tag.id}`}
                key={tag.id}
                text={tag.display}
                totalOccurrences={tag.count}
              />
            );
          })}
        <ShowMoreButton hasMore={hasMore} onClick={handleShowMore} />
      </div>
    </div>
  );
};
