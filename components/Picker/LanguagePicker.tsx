import { CountableLanguage } from "@/types/types";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { SectionTitle } from "../SectionTitle";
import ActiveTagButton from "./ActiveTagButton";
import { PickerItem } from "./PickerItem";
type LanguagePickerProps = {
  activeTagId: string | string[] | undefined;
  languages: CountableLanguage[];
  onLanguagePage: boolean;
  isCollapsedDefault?: boolean;
};

export const LanguagePicker = ({
  activeTagId,
  languages,
  onLanguagePage,
  isCollapsedDefault = true
}: LanguagePickerProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isCollapsedDefault);

  // Automatically collapse the sidebar after redirection
  useEffect(() => {
    setIsCollapsed(isCollapsedDefault);
  }, [isCollapsedDefault, onLanguagePage, activeTagId]);

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
        <SectionTitle className="mb-2" text="Browse by Language" />
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

        {/* Display the active tag button when a language is selected, and the language picker is collapsed. */}
        {activeTagId && isCollapsed ? <ActiveTagButton data={activeTagId} /> : null}
      </div>
      <div
        className={classNames("-mx-1 overflow-hidden duration-300 ease-in-out", {
          ["max-h-0 sm:max-h-20"]: isCollapsed,
          ["max-h-full"]: !isCollapsed
        })}
      >
        {languages
          .sort((a, b) => b.count - a.count)
          .map((language) => {
            return (
              <PickerItem
                className={`group m-1 inline-block rounded-sm border px-2 py-1 ${
                  onLanguagePage && language.id === activeTagId
                    ? "active-pill"
                    : "border-silver-100 transition-all hover:border-primary hover:text-primary"
                }`}
                href={`/language/${language.id}`}
                key={language.id}
                text={language.display}
                totalOccurrences={language.count}
              />
            );
          })}
      </div>
    </div>
  );
};
