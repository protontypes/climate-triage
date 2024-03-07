"use client";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LaunchBannerClose(): JSX.Element {
  const onClose = () => {
    const element = document.getElementById("launch-banner");
    if (element) {
      element.remove();
    }
  };

  return (
    <button
      data-dismiss-target="#launch-banner"
      type="button"
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
      onClick={onClose}
    >
      <FontAwesomeIcon icon={faXmark} className="size-3" />
      <span className="sr-only">Close banner</span>
    </button>
  );
}
