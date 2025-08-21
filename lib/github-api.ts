// lib/github-api.ts - Missing Export Functions
import { unstable_cache } from 'next/cache'

// Types
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  visibility: 'public' | 'private'
  archived: boolean
  disabled: boolean
}

export interface GitHubUser {
  id: number
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubStats {
  user: GitHubUser
  repositories: GitHubRepository[]
  totalStars: number
  totalForks: number
  languageStats: Record<string, number>
  recentActivity: {
    totalCommits: number
    lastCommitDate: string
  }
}

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com'
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'sippinwindex'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

// Headers for GitHub API requests
const getHeaders = () => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-App'
  }
  
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`
  }
  
  return headers
}

// Fetch GitHub repositories
async function fetchGitHubRepositories(): Promise<GitHubRepository[]> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`,
      {
        headers: getHeaders(),
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos = await response.json()
    
    // Filter out forks and return only public repos
    return repos
      .filter((repo: any) => !repo.fork && !repo.archived)
      .map((repo: any): GitHubRepository => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        open_issues_count: repo.open_issues_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        topics: repo.topics || [],
        visibility: repo.visibility,
        archived: repo.archived,
        disabled: repo.disabled
      }))
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    return []
  }
}

// Fetch GitHub user data
async function fetchGitHubUser(): Promise<GitHubUser | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`,
      {
        headers: getHeaders(),
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const user = await response.json()
    
    return {
      id: user.id,
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    return null
  }
}

// Generate GitHub stats
async function generateGitHubStats(): Promise<GitHubStats | null> {
  try {
    const [user, repositories] = await Promise.all([
      fetchGitHubUser(),
      fetchGitHubRepositories()
    ])

    if (!user) {
      return null
    }

    // Calculate total stars and forks
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)

    // Calculate language statistics
    const languageStats: Record<string, number> = {}
    repositories.forEach(repo => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1
      }
    })

    // Get recent activity (most recent push)
    const sortedRepos = repositories.sort((a, b) => 
      new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    )
    const lastCommitDate = sortedRepos[0]?.pushed_at || user.updated_at

    return {
      user,
      repositories,
      totalStars,
      totalForks,
      languageStats,
      recentActivity: {
        totalCommits: repositories.length, // Approximate
        lastCommitDate
      }
    }
  } catch (error) {
    console.error('Error generating GitHub stats:', error)
    return null
  }
}

// Cached versions of the functions
export const getCachedRepositories = unstable_cache(
  fetchGitHubRepositories,
  ['github-repositories'],
  {
    tags: ['github-repos'],
    revalidate: 3600 // 1 hour
  }
)

export const getCachedGitHubUser = unstable_cache(
  fetchGitHubUser,
  ['github-user'],
  {
    tags: ['github-user'],
    revalidate: 3600 // 1 hour
  }
)

export const getCachedGitHubStats = unstable_cache(
  generateGitHubStats,
  ['github-stats'],
  {
    tags: ['github-stats'],
    revalidate: 3600 // 1 hour
  }
)

// Export non-cached versions as well
export { fetchGitHubRepositories, fetchGitHubUser, generateGitHubStats }