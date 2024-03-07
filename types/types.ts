// Nullable generic for nullable fields
type Nullable<T> = T | null;

// Describes a Tag, which is a programming language or a tag
export interface Tag {
  display: string;
  id: string;
}

// Describes a CountableTag, which is a Tag with a count
export interface CountableTag extends Tag {
  count: number;
}

export interface CountableLanguage extends Tag {
  count: number;
}

export interface CountableCategory extends Tag {
  count: number;
}

// Describes a Repository, which is a GitHub repository
export interface Repository {
  description: Nullable<string>;
  has_new_issues: boolean;
  id: string;
  issues: Issue[];
  language: Tag;
  last_modified: string;
  license?: string;
  name: string;
  owner: string;
  stars: number;
  stars_display: string;
  url: string;
  tags?: Tag[];
  category: Tag;
  monthly_downloads: number;
  created_at: string;
}

// Describes an Issue, which is a GitHub issue linked to a repository
export interface Issue {
  comments_count: number;
  created_at: string;
  id: string;
  labels: Label[];
  number: number;
  title: string;
  url: string;
}

// Describes a Label, which is a GitHub label
export interface Label {
  id: string;
  display: string;
}

export enum RepositorySortOrder {
  RECENT = "Recent issues",
  ISSUE_AGE = "Project age",
  MOST_DOWNLOADS = "Downloads",
  MOST_STARS = "Stars"
}

// Sorting types
export enum RepositorySortType {
  DESCENDING = "Descending",
  ASCENDING = "Ascending",
  NONE = "None"
}

// Describes the data that is retrieved from the GitHub API and used by the app
export interface AppData {
  languages: CountableLanguage[];
  categories: CountableCategory[];
  repositories: Repository[];
  repositorySortOrder: RepositorySortOrder;
  repositorySortType: RepositorySortType;
  tags: CountableTag[];
  query: string;
}

export interface Data {
  repositories: Repository[];
  languages: CountableLanguage[];
  tags: CountableTag[];
  categories: CountableCategory[];
}
