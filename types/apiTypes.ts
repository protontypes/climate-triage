export interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  last_synced_at: Date;
  repository: Repository;
  created_at: Date;
  updated_at: Date;
  avatar_url: string;
  language: null | string;
  category: null | string;
  sub_category: string;
  issues: Issue[];
}

export interface Issue {
  uuid: string;
  number: number;
  title: string;
  labels: string[];
  comments_count: number;
  created_at: Date;
  updated_at: Date;
  html_url: string;
}

export interface Repository {
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
  default_branch: DefaultBranch;
  last_synced_at: Date;
  etag: null;
  topics: string[];
  latest_commit_sha: null;
  homepage: null | string;
  language: null | string;
  has_issues: boolean;
  has_wiki: null;
  has_pages: null;
  mirror_url: null;
  source_name: null;
  license: null | string;
  status: null;
  scm: SCM;
  pull_requests_enabled: boolean;
  icon_url: string;
  metadata: Metadata;
  created_at: Date;
  updated_at: Date;
  dependencies_parsed_at: Date | null;
  dependency_job_id: null | string;
  html_url: string;
  commit_stats: CommitStats | null;
  previous_names: string[];
  tags_count: number;
  repository_url: string;
  tags_url: string;
  releases_url: string;
  manifests_url: string;
  owner_url: string;
  download_url: string;
  host: Host;
}

export interface CommitStats {
  total_commits: number;
  total_committers: number;
  mean_commits: number | string;
  dds: number | string;
  last_synced_commit: string;
}

export enum DefaultBranch {
  Dev = "dev",
  Devel = "devel",
  Develop = "develop",
  Development = "development",
  GhPages = "gh-pages",
  Main = "main",
  MainDev = "main-dev",
  Master = "master",
  Trunk = "trunk"
}

export interface Host {
  name: Name;
  url: string;
  kind: Kind;
  repositories_count: number;
  owners_count: number;
  icon_url: string;
  host_url: string;
  repositories_url: string;
  repository_names_url: string;
  owners_url: string;
}

export enum Kind {
  Github = "github"
}

export enum Name {
  GitHub = "GitHub"
}

export interface Metadata {
  files: { [key: string]: null | string };
  funding?: Funding | null;
}

export interface Funding {
  github?: string[] | null | string;
  patreon?: null | string;
  open_collective?: null | string;
  ko_fi?: null;
  tidelift?: null;
  community_bridge?: null;
  liberapay?: null | string;
  issuehunt?: null;
  otechie?: null;
  lfx_crowdfunding?: null;
  custom?: string[] | null | string;
}

export enum SCM {
  Git = "git"
}
