import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import type { Issue } from "#types/types";

type IssueItemProps = {
  issue: Issue;
};

type IssueCommentNumProps = {
  numIssues: number;
};

const IssueCommentNum = ({ numIssues }: IssueCommentNumProps) => {
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: pre-existing, screen readers ignore aria-label on a plain div
    <div
      className="mt-1 flex w-10 flex-row items-center justify-end text-gray-500 dark:text-gray-400"
      aria-label={`${numIssues} comments`}
    >
      <span className="mr-2 text-sm leading-snug" aria-hidden="true">
        {numIssues}
      </span>
      <FontAwesomeIcon icon={faComment} aria-hidden="true" />
    </div>
  );
};

export const IssueItem = ({ issue }: IssueItemProps) => {
  return (
    <li key={issue.url} className="flex flex-row items-start justify-start py-1">
      <span className="min-w-[74px] pr-2 text-right leading-snug text-gray-500 dark:text-gray-400">
        #{issue.number}
      </span>
      <div className="flex flex-auto flex-row items-start">
        <Link
          className={`block flex-auto leading-snug transition-all hover:text-primary ${
            issue.comments_count > 0 ? "mr-4" : "mr-12"
          }`}
          href={issue.url}
          rel="noopener noreferrer"
          target="_blank"
          title={`Open issue #${issue.number} on GitHub`}
          aria-label={`Open issue #${issue.number}: ${issue.title} on GitHub`}
        >
          {issue.title.split(" ").map((word, i) => {
            if (word.length > 15) {
              // biome-ignore lint/suspicious/noArrayIndexKey: words can repeat and never reorder
              return <span key={i} className="break-all">{`${word} `}</span>;
            } else {
              // biome-ignore lint/suspicious/noArrayIndexKey: words can repeat and never reorder
              return <span key={i} className="break-keep">{`${word} `}</span>;
            }
          })}
        </Link>
        {issue.comments_count > 0 && <IssueCommentNum numIssues={issue.comments_count} />}
      </div>
    </li>
  );
};
