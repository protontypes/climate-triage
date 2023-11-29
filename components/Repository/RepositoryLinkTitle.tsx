import Link from "next/link";
import { Repository } from "../../types";

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
  repositoryUrl,
}: RepositoryLinkTitleProps) => {
  return (
    <Link
      className={`text-xl font-bold transition-all group-hover:text-yellow ${
        isIssueOpen ? "text-yellow max-md:w-[50%] md:truncate" : ""
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
