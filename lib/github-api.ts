// lib/github-api.ts - Complete GitHub API implementation with missing exports

import { Octokit } from '@octokit/rest'

// Types
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
  homepage: string | null
  archived: boolean
  private: boolean
}

export interface GitHubUser {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  followers: number
  following: number
  public_repos: number
}

export interface GitHubStats {
  user: GitHubUser
  repositories: GitHubRepository[]
  totalStars: number
  totalForks: number
  languageStats: Record<string, number>
  recentActivity: {
    lastCommit: string
    commitsThisMonth: number
  }
}

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

// Cache for repositories (simple in-memory cache)
let repositoriesCache: {
  data: GitHubRepository[] | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Main API functions
export async function fetchGitHubUser(username: string = 'sippinwindex'): Promise<GitHubUser> {
  try {
    const { data } = await octokit.rest.users.getByUsername({
      username,
    })

    return {
      login: data.login,
      name: data.name,
      bio: data.bio,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      followers: data.followers,
      following: data.following,
      public_repos: data.public_repos,
    }
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    throw new Error('Failed to fetch GitHub user data')
  }
}

export async function fetchGitHubRepositories(username: string = 'sippinwindex'): Promise<GitHubRepository[]> {
  try {
    const { data } = await octokit.rest.repos.listForUser({
      username,
      type: 'owner',
      sort: 'updated',
      per_page: 100,
    })

    return data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      pushed_at: repo.pushed_at || '',
      updated_at: repo.updated_at,
      homepage: repo.homepage,
      archived: repo.archived,
      private: repo.private,
    }))
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error)
    throw new Error('Failed to fetch GitHub repositories')
  }
}

// FIXED: Add the missing getCachedRepositories export
export async function getCachedRepositories(username: string = 'sippinwindex'): Promise<GitHubRepository[]> {
  const now = Date.now()
  
  // Check if cache is valid
  if (repositoriesCache.data && (now - repositoriesCache.timestamp) < CACHE_DURATION) {
    console.log('📦 Returning cached repositories')
    return repositoriesCache.data
  }

  console.log('🔄 Fetching fresh repositories from GitHub')
  
  try {
    const repositories = await fetchGitHubRepositories(username)
    
    // Update cache
    repositoriesCache = {
      data: repositories,
      timestamp: now
    }
    
    return repositories
  } catch (error) {
    // If fetch fails and we have stale cache, return it
    if (repositoriesCache.data) {
      console.warn('⚠️ Using stale cache due to API error')
      return repositoriesCache.data
    }
    
    throw error
  }
}

export async function fetchGitHubStats(username: string = 'sippinwindex'): Promise<GitHubStats> {
  try {
    const [user, repositories] = await Promise.all([
      fetchGitHubUser(username),
      getCachedRepositories(username),
    ])

    // Calculate stats
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)

    // Language statistics
    const languageStats: Record<string, number> = {}
    repositories.forEach(repo => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1
      }
    })

    // Recent activity (simplified)
    const recentRepo = repositories.sort((a, b) => 
      new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    )[0]

    return {
      user,
      repositories,
      totalStars,
      totalForks,
      languageStats,
      recentActivity: {
        lastCommit: recentRepo?.pushed_at || new Date().toISOString(),
        commitsThisMonth: repositories.filter(repo => {
          const pushedDate = new Date(repo.pushed_at)
          const oneMonthAgo = new Date()
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
          return pushedDate > oneMonthAgo
        }).length,
      },
    }
  } catch (error) {
    console.error('Error fetching GitHub stats:', error)
    throw new Error('Failed to fetch GitHub statistics')
  }
}

// Helper functions
export function calculateLanguagePercentages(languageStats: Record<string, number>) {
  const total = Object.values(languageStats).reduce((sum, count) => sum + count, 0)
  
  if (total === 0) return []

  return Object.entries(languageStats)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
}

// Clear cache function (useful for testing)
export function clearRepositoriesCache() {
  repositoriesCache = {
    data: null,
    timestamp: 0
  }
  console.log('🗑️ Repository cache cleared')
}

// Export default for backward compatibility
export default {
  fetchGitHubUser,
  fetchGitHubRepositories,
  getCachedRepositories,
  fetchGitHubStats,
  calculateLanguagePercentages,
  clearRepositoriesCache,
}