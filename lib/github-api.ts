// lib/github-api.ts - FIXED TYPE IMPORTS
import { Octokit } from '@octokit/rest'

// FIXED: Import utility functions as regular imports, not type imports
import { 
  isGitHubRepository, 
  isGitHubUser, 
  calculateRepositoryScore 
} from '@/utils/github-helpers'

// Keep type imports separate
import type { 
  GitHubRepository, 
  GitHubUser, 
  GitHubStats 
} from '@/types/github'

// Initialize Octokit only if running on server-side or client-side with proper check
const createOctokit = () => {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.warn('⚠️ GitHub token not found, some features may not work')
    return null
  }
  
  return new Octokit({
    auth: token,
  })
}

const octokit = createOctokit()

// Cache for repositories (simple in-memory cache)
let repositoriesCache: {
  data: GitHubRepository[] | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

// Cache for stats
let statsCache: {
  data: GitHubStats | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper function to check if we can make API calls
function canMakeAPICall(): boolean {
  return octokit !== null && (typeof window !== 'undefined' || typeof process !== 'undefined')
}

// Main API functions
export async function fetchGitHubUser(username: string = 'sippinwindex'): Promise<GitHubUser> {
  if (!octokit) {
    throw new Error('GitHub API not available - token missing')
  }

  try {
    const { data } = await octokit.rest.users.getByUsername({
      username,
    })

    const user: GitHubUser = {
      login: data.login,
      id: data.id,
      name: data.name,
      bio: data.bio,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      followers: data.followers,
      following: data.following,
      public_repos: data.public_repos,
      location: data.location,
      company: data.company,
      blog: data.blog,
      email: data.email,
      created_at: data.created_at,
      updated_at: data.updated_at,
      type: data.type as 'User' | 'Organization'
    }

    return user
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    throw new Error('Failed to fetch GitHub user data')
  }
}

export async function fetchGitHubRepositories(username: string = 'sippinwindex'): Promise<GitHubRepository[]> {
  if (!octokit) {
    throw new Error('GitHub API not available - token missing')
  }

  try {
    const { data } = await octokit.rest.repos.listForUser({
      username,
      type: 'owner',
      sort: 'updated',
      per_page: 100,
    })

    const repositories: GitHubRepository[] = data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      language: repo.language || null,
      topics: repo.topics || [],
      pushed_at: repo.pushed_at || '',
      updated_at: repo.updated_at || new Date().toISOString(),
      created_at: repo.created_at || new Date().toISOString(),
      homepage: repo.homepage || null,
      archived: repo.archived || false,
      private: repo.private || false,
      size: repo.size || 0,
      default_branch: repo.default_branch || 'main',
      open_issues_count: repo.open_issues_count || 0,
      disabled: repo.disabled || false,
      fork: repo.fork || false,
      watchers_count: repo.watchers_count || 0,
      has_issues: repo.has_issues || false,
      has_projects: repo.has_projects || false,
      has_wiki: repo.has_wiki || false,
      has_pages: repo.has_pages || false,
      has_downloads: repo.has_downloads || false,
      // FIXED: Proper license type handling with required string fields
      license: repo.license && repo.license.key && repo.license.name ? {
        key: repo.license.key,
        name: repo.license.name,
        spdx_id: repo.license.spdx_id || '',
        url: repo.license.url || '',
        node_id: repo.license.node_id || ''
      } : undefined,
      owner: {
        login: repo.owner?.login || username,
        id: repo.owner?.id || 0,
        avatar_url: repo.owner?.avatar_url || '',
        html_url: repo.owner?.html_url || '',
        type: (repo.owner?.type as 'User' | 'Organization') || 'User'
      }
    }))

    // FIXED: Now using imported function correctly
    return repositories.filter(repo => isGitHubRepository(repo))
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
    
    // FIXED: Now using imported function correctly
    const scoredRepositories = repositories.map(repo => ({
      ...repo,
      _score: calculateRepositoryScore(repo, repositories)
    })).sort((a, b) => (b._score || 0) - (a._score || 0))
    
    // Update cache
    repositoriesCache = {
      data: scoredRepositories,
      timestamp: now
    }
    
    return scoredRepositories
  } catch (error) {
    // If fetch fails and we have stale cache, return it
    if (repositoriesCache.data) {
      console.warn('⚠️ Using stale cache due to API error')
      return repositoriesCache.data
    }
    
    // Return empty array instead of throwing to prevent build failures
    console.error('❌ Failed to fetch repositories, returning empty array')
    return []
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

    const stats: GitHubStats = {
      user,
      repositories: repositories.length,
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
        activeProjects: repositories.filter(repo => {
          const pushedDate = new Date(repo.pushed_at)
          const threeMonthsAgo = new Date()
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
          return pushedDate > threeMonthsAgo && !repo.archived
        }).length,
      },
      topRepositories: repositories.slice(0, 10)
    }

    return stats
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
  statsCache = {
    data: null,
    timestamp: 0
  }
  console.log('🗑️ Repository cache cleared')
}

// ADDED: Missing exports for API routes
export function createGitHubAPI() {
  return {
    fetchUser: fetchGitHubUser,
    fetchRepositories: getCachedRepositories,
    fetchStats: fetchGitHubStats,
    clearCache: clearRepositoriesCache,
    getRepositories: getCachedRepositories,
  }
}

export async function getPortfolioRepositories(username: string = 'sippinwindex') {
  return getCachedRepositories(username)
}

// ADDED: Missing getCachedGitHubStats export (with caching)
export async function getCachedGitHubStats(username: string = 'sippinwindex'): Promise<GitHubStats> {
  const now = Date.now()
  
  // Check if cache is valid
  if (statsCache.data && (now - statsCache.timestamp) < CACHE_DURATION) {
    console.log('📦 Returning cached GitHub stats')
    return statsCache.data
  }

  console.log('🔄 Fetching fresh GitHub stats')
  
  try {
    const stats = await fetchGitHubStats(username)
    
    // Update cache
    statsCache = {
      data: stats,
      timestamp: now
    }
    
    return stats
  } catch (error) {
    // If fetch fails and we have stale cache, return it
    if (statsCache.data) {
      console.warn('⚠️ Using stale GitHub stats cache due to API error')
      return statsCache.data
    }
    
    throw error
  }
}

// Export default for backward compatibility
const githubAPI = {
  fetchGitHubUser,
  fetchGitHubRepositories,
  getCachedRepositories,
  fetchGitHubStats,
  getCachedGitHubStats,
  calculateLanguagePercentages,
  clearRepositoriesCache,
  createGitHubAPI,
  getPortfolioRepositories,
}

export default githubAPI