import { Repository } from "@/types/types";
import Link from "next/link";

type RepositoryLinkTitleProps = {
  isIssueOpen: boolean;
  repositoryName: Repository["name"];
  repositoryOwner: Repository["owner"];
  repositoryUrl: Repository["url"];
};

export const RepositoryLinkTitle = ({
  isIssueOpen,
  repositoryName,
  repositoryOwner,
  repositoryUrl
}: RepositoryLinkTitleProps) => {
  return (
    <Link
      className={`text-xl font-bold transition-all group-hover:text-primary ${
        isIssueOpen ? "text-primary max-md:w-[50%] md:truncate" : ""
      }`}
      href={repositoryUrl}
      rel="noopener noreferrer"
      target="_blank"
      title={`Open ${repositoryOwner}/${repositoryName} on GitHub`}
      aria-label={`${repositoryOwner} / ${repositoryName}`}
    >
      {repositoryOwner} / {repositoryName}
    </Link>
  );
};
