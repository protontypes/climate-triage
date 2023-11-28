export interface Issue {
  uuid: string;
  node_id: string;
  number: number;
  state: string;
  title: string;
  user: string;
  labels: string[];
  assignees: string;
  locked: boolean;
  comments_count: number;
  pull_request: boolean;
  closed_at: null;
  author_association: string;
  state_reason: null;
  created_at: Date;
  updated_at: Date;
  time_to_close: null;
  merged_at: null;
  dependency_metadata: null;
  url: string;
  html_url: string;
}

export interface Project {
  id: number;
  name: string;
  url: string;
  last_synced_at: Date;
  repository: Repo;
  owner: Owner;
  packages: Package[];
  commits: Commits;
  issues_stats: IssuesStats;
  events: Events;
  keywords: string[];
  dependencies: ProjectDependency[];
  score: number;
  created_at: Date;
  updated_at: Date;
  avatar_url: string;
  language: string;
  project_url: string;
  html_url: string;
  issues: Issue[];
}

export interface Commits {
  full_name: string;
  default_branch: string;
  committers: Committer[];
  total_commits: number;
  total_committers: number;
  total_bot_commits: number;
  total_bot_committers: number;
  mean_commits: number;
  dds: number;
  past_year_committers: Committer[];
  past_year_total_commits: number;
  past_year_total_committers: number;
  past_year_total_bot_commits: number;
  past_year_total_bot_committers: number;
  past_year_mean_commits: number;
  past_year_dds: number;
  last_synced_at: Date;
  last_synced_commit: string;
  created_at: Date;
  updated_at: Date;
  host: CommitsHost;
}

export interface Committer {
  name: string;
  email: string;
  login: null | string;
  count: number;
}

export interface CommitsHost {
  name: string;
  url: string;
  kind: string;
  last_synced_at: Date;
  repositories_count: number;
  commits_count: number;
  host_url: string;
  repositories_url: string;
}

export interface ProjectDependency {
  ecosystem: Ecosystem;
  filepath: string;
  sha: null;
  kind: FluffyKind;
  created_at: Date;
  updated_at: Date;
  repository_link: string;
  dependencies: DependencyDependency[];
}

export interface DependencyDependency {
  id: number;
  package_name: string;
  ecosystem: Ecosystem;
  requirements: string;
  direct: boolean;
  kind: PurpleKind | null;
  optional: boolean;
}

export enum Ecosystem {
  Actions = "actions",
  Pypi = "pypi"
}

export enum PurpleKind {
  Composite = "composite",
  Develop = "develop",
  Runtime = "runtime"
}

export enum FluffyKind {
  Lockfile = "lockfile",
  Manifest = "manifest"
}

export interface Events {
  total: { [key: string]: number };
  last_year: { [key: string]: number };
}

export interface IssuesStats {
  full_name: string;
  html_url: string;
  last_synced_at: Date;
  status: string;
  issues_count: number;
  pull_requests_count: number;
  avg_time_to_close_issue: number;
  avg_time_to_close_pull_request: number;
  issues_closed_count: number;
  pull_requests_closed_count: number;
  pull_request_authors_count: number;
  issue_authors_count: number;
  avg_comments_per_issue: number;
  avg_comments_per_pull_request: number;
  merged_pull_requests_count: number;
  bot_issues_count: number;
  bot_pull_requests_count: number;
  past_year_issues_count: number;
  past_year_pull_requests_count: number;
  past_year_avg_time_to_close_issue: number;
  past_year_avg_time_to_close_pull_request: number;
  past_year_issues_closed_count: number;
  past_year_pull_requests_closed_count: number;
  past_year_pull_request_authors_count: number;
  past_year_issue_authors_count: number;
  past_year_avg_comments_per_issue: number;
  past_year_avg_comments_per_pull_request: number;
  past_year_bot_issues_count: number;
  past_year_bot_pull_requests_count: number;
  past_year_merged_pull_requests_count: number;
  created_at: Date;
  updated_at: Date;
  repository_url: string;
  issues_url: string;
  issue_labels_count: IssueLabelsCount;
  pull_request_labels_count: PullRequestLabelsCount;
  issue_author_associations_count: AuthorAssociationsCount;
  pull_request_author_associations_count: AuthorAssociationsCount;
  issue_authors: { [key: string]: number };
  pull_request_authors: { [key: string]: number };
  host: IssuesStatsHost;
  past_year_issue_labels_count: IssueLabelsCount;
  past_year_pull_request_labels_count: PullRequestLabelsCount;
  past_year_issue_author_associations_count: AuthorAssociationsCount;
  past_year_pull_request_author_associations_count: AuthorAssociationsCount;
  past_year_issue_authors: { [key: string]: number };
  past_year_pull_request_authors: { [key: string]: number };
}

export interface IssuesStatsHost {
  name: string;
  url: string;
  kind: string;
  last_synced_at: Date;
  repositories_count: number;
  issues_count: number;
  pull_requests_count: number;
  authors_count: number;
  icon_url: string;
  host_url: string;
  repositories_url: string;
}

export interface AuthorAssociationsCount {
  MEMBER: number;
  NONE: number;
  COLLABORATOR: number;
  CONTRIBUTOR: number;
}

export interface IssueLabelsCount {
  enhancement: number;
  bug: number;
  documentation: number;
  automation: number;
  "good first issue": number;
  question: number;
}

export interface PullRequestLabelsCount {
  dependencies: number;
}

export interface Owner {
  login: string;
  name: string;
  uuid: string;
  kind: string;
  description: string;
  email: string;
  website: string;
  location: string;
  twitter: string;
  company: null;
  icon_url: string;
  repositories_count: number;
  last_synced_at: Date;
  metadata: OwnerMetadata;
  html_url: string;
  created_at: Date;
  updated_at: Date;
  owner_url: string;
  repositories_url: string;
}

export interface OwnerMetadata {
  has_sponsors_listing: boolean;
}

export interface Package {
  name: string;
  ecosystem: Ecosystem;
  description: string;
  homepage: string;
  licenses: string;
  normalized_licenses: string[];
  repository_url: string;
  // keywords_array: any[];
  namespace: null;
  versions_count: number;
  first_release_published_at: Date;
  latest_release_published_at: Date;
  latest_release_number: string;
  last_synced_at: Date;
  created_at: Date;
  updated_at: Date;
  registry_url: string;
  install_command: string;
  documentation_url: string;
  metadata: PackageMetadata;
  repo_metadata: Repo;
  repo_metadata_updated_at: Date;
  dependent_packages_count: number;
  downloads: number;
  downloads_period: string;
  dependent_repos_count: number;
  rankings: Rankings;
  purl: string;
  // advisories: any[];
  docker_usage_url: string;
  docker_dependents_count: number;
  docker_downloads_count: number;
  usage_url: string;
  dependent_repositories_url: string;
  versions_url: string;
  dependent_packages_url: string;
  related_packages_url: string;
  maintainers: Maintainer[];
  registry: Registry;
}

export interface Maintainer {
  uuid: string;
  login: string;
  name: null;
  email: null;
  url: null;
  packages_count: number;
  html_url: string;
  role: null;
  created_at: Date;
  updated_at: Date;
  packages_url: string;
}

export interface PackageMetadata {
  funding: null;
  classifiers: string[];
  normalized_name: string;
}

export interface Rankings {
  downloads: number;
  dependent_repos_count: number;
  dependent_packages_count: number;
  stargazers_count: number;
  forks_count: number;
  docker_downloads_count: number;
  average: number;
}

export interface Registry {
  name: string;
  url: string;
  ecosystem: Ecosystem;
  default: boolean;
  packages_count: number;
  maintainers_count: number;
  namespaces_count: number;
  keywords_count: number;
  github: Ecosystem;
  metadata: RegistryMetadata;
  icon_url: string;
  created_at: Date;
  updated_at: Date;
  packages_url: string;
  maintainers_url: string;
  namespaces_url: string;
}

export interface RegistryMetadata {
  funded_packages_count: number;
}

export interface Repo {
  uuid: string;
  full_name: string;
  owner: string;
  description: string;
  archived: boolean;
  fork: boolean;
  pushed_at: Date;
  size: number;
  stargazers_count: number;
  open_issues_count: number;
  forks_count: number;
  subscribers_count: number;
  default_branch: string;
  last_synced_at: Date;
  etag: null;
  topics: string[];
  latest_commit_sha: null;
  homepage: string;
  language: string;
  has_issues: boolean;
  has_wiki: null;
  has_pages: null;
  mirror_url: null;
  source_name: null;
  license: string;
  status: null;
  scm: string;
  pull_requests_enabled: boolean;
  icon_url: string;
  metadata: RepositoryMetadata;
  created_at: Date;
  updated_at: Date;
  dependencies_parsed_at: Date;
  dependency_job_id: null;
  html_url: string;
  commit_stats: CommitStats;
  previous_names: string[];
  tags_count: number;
  repository_url: string;
  tags_url: string;
  releases_url: string;
  manifests_url: string;
  owner_url: string;
  download_url: string;
  host: RepositoryHost;
  owner_record?: Owner;
  tags?: Tag[];
}

export interface CommitStats {
  total_commits: number;
  total_committers: number;
  mean_commits: string;
  dds: number;
  last_synced_commit: string;
}

export interface RepositoryHost {
  name: string;
  url: string;
  kind: string;
  repositories_count: number;
  owners_count: number;
  icon_url: string;
  host_url: string;
  repositories_url: string;
  repository_names_url: string;
  owners_url: string;
}

export interface RepositoryMetadata {
  files: Files;
}

export interface Files {
  readme: string;
  changelog: string;
  contributing: string;
  funding: null;
  license: string;
  code_of_conduct: string;
  threat_model: null;
  audit: null;
  citation: string;
  codeowners: null;
  security: null;
  support: null;
  governance: null;
}

export interface Tag {
  name: string;
  sha: string;
  kind: TagKind;
  published_at: Date;
  download_url: string;
  html_url: string;
  dependencies_parsed_at: null;
  dependency_job_id: null;
  tag_url: string;
  manifests_url: string;
}

export enum TagKind {
  Commit = "commit"
}
