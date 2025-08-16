// types/github.ts
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  pushed_at: string
  updated_at: string
  created_at: string
  homepage: string | null
  archived: boolean
  private: boolean
  size: number
  default_branch: string
  open_issues_count: number
  disabled: boolean
  fork: boolean
  watchers_count: number
  has_issues: boolean
  has_projects: boolean
  has_wiki: boolean
  has_pages: boolean
  has_downloads: boolean
  license?: {
    key: string
    name: string
    spdx_id: string
    url: string
    node_id: string
  }
  owner: {
    login: string
    id: number
    avatar_url: string
    html_url: string
    type: 'User' | 'Organization'
  }
}

export interface GitHubUser {
  login: string
  id: number
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  followers: number
  following: number
  public_repos: number
  location?: string | null
  company?: string | null
  blog?: string | null
  email?: string | null
  created_at: string
  updated_at: string
  type: 'User' | 'Organization'
}

export interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    committer: {
      name: string
      email: string
      date: string
    }
    message: string
    tree: {
      sha: string
      url: string
    }
  }
  author?: GitHubUser
  committer?: GitHubUser
  html_url: string
}

export interface GitHubLanguageStats {
  [language: string]: number
}

export interface GitHubStats {
  user: GitHubUser
  repositories: number | GitHubRepository[]
  totalStars: number
  totalForks: number
  languageStats: GitHubLanguageStats
  recentActivity: {
    lastCommit: string
    commitsThisMonth: number
    activeProjects?: number
  }
  topRepositories: GitHubRepository[]
  contributionStats?: {
    totalCommits: number
    totalPRs: number
    totalIssues: number
    contributionCalendar: Array<{
      date: string
      count: number
    }>
  }
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  body: string | null
  state: 'open' | 'closed'
  created_at: string
  updated_at: string
  closed_at?: string
  html_url: string
  user: GitHubUser
  assignees: GitHubUser[]
  labels: Array<{
    id: number
    name: string
    color: string
    description: string | null
  }>
}

export interface GitHubPullRequest {
  id: number
  number: number
  title: string
  body: string | null
  state: 'open' | 'closed' | 'merged'
  created_at: string
  updated_at: string
  closed_at?: string
  merged_at?: string
  html_url: string
  user: GitHubUser
  head: {
    ref: string
    sha: string
    repo: GitHubRepository
  }
  base: {
    ref: string
    sha: string
    repo: GitHubRepository
  }
  mergeable: boolean | null
  merged: boolean
  draft: boolean
}

export interface GitHubRelease {
  id: number
  tag_name: string
  name: string | null
  body: string | null
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: string | null
  html_url: string
  author: GitHubUser
  assets: Array<{
    id: number
    name: string
    size: number
    download_count: number
    browser_download_url: string
  }>
}

export interface GitHubBranch {
  name: string
  commit: {
    sha: string
    url: string
  }
  protected: boolean
}

export interface GitHubContributor {
  login: string
  id: number
  avatar_url: string
  html_url: string
  contributions: number
  type: 'User' | 'Bot'
}

// API Response types
export interface GitHubAPIResponse<T = any> {
  data?: T
  status: number
  headers: Record<string, string>
  rateLimit?: {
    limit: number
    remaining: number
    reset: number
    used: number
  }
}

export interface GitHubSearchResponse<T> {
  total_count: number
  incomplete_results: boolean
  items: T[]
}

export interface GitHubRateLimit {
  limit: number
  remaining: number
  reset: number
  used: number
  resource: string
}

// Enums for better type safety
export enum GitHubRepositoryVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INTERNAL = 'internal'
}

export enum GitHubRepositorySort {
  CREATED = 'created',
  UPDATED = 'updated',
  PUSHED = 'pushed',
  FULL_NAME = 'full_name'
}

export enum GitHubIssueState {
  OPEN = 'open',
  CLOSED = 'closed',
  ALL = 'all'
}

// API Configuration
export interface GitHubAPIConfig {
  token: string
  username?: string
  baseURL?: string
  timeout?: number
}

// Hook return types
export interface UseGitHubRepositoriesReturn {
  repositories: GitHubRepository[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseGitHubUserReturn {
  user: GitHubUser | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseGitHubStatsReturn {
  stats: GitHubStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Integration types for portfolio
export interface PortfolioGitHubData {
  repositoryId: number
  repositoryName: string
  stars: number
  forks: number
  language: string | null
  topics: string[]
  lastCommit: string
  url: string
  isArchived: boolean
  hasPages: boolean
  license?: string
}

// Error types
export interface GitHubError {
  message: string
  documentation_url?: string
  status?: number
  code?: string
}

// Webhook types
export interface GitHubWebhookEvent {
  action: string
  repository: GitHubRepository
  sender: GitHubUser
  number?: number
  pull_request?: GitHubPullRequest
  issue?: GitHubIssue
  ref?: string
  before?: string
  after?: string
  commits?: GitHubCommit[]
}

// Cache types
export interface GitHubCacheEntry<T> {
  data: T
  timestamp: number
  etag?: string
  lastModified?: string
}

export interface GitHubCacheOptions {
  duration: number
  key: string
  etag?: string
  lastModified?: string
}