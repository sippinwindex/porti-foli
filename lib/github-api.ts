// lib/github-api.ts - FIXED: Complete GitHub API integration with correct types
import { unstable_cache } from 'next/cache'

// Types for GitHub API responses
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
  fork: boolean
  homepage: string | null  // Fixed: Added homepage property
  watchers_count: number   // Fixed: Added watchers_count property
  has_issues: boolean
  has_projects: boolean
  has_wiki: boolean
  has_pages: boolean       // Fixed: Added has_pages property
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
  location?: string | null
  company?: string | null
  blog?: string | null
  email?: string | null
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

// GitHub API configuration
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
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`
  }
  
  return headers
}

// Enhanced repository filtering for portfolio
function isPortfolioWorthy(repo: GitHubRepository): boolean {
  // Skip forks, archived, and disabled repos
  if (repo.fork || repo.archived || repo.disabled) return false
  
  // Must have a description
  if (!repo.description || repo.description.length < 10) return false
  
  // Skip common non-portfolio repo patterns
  const skipPatterns = [
    /^\./, // dotfiles
    /readme$/i,
    /profile$/i,
    /config$/i,
    /template$/i,
    /test$/i,
    /playground$/i,
    /learning$/i,
    /tutorial$/i,
    /practice$/i
  ]
  
  if (skipPatterns.some(pattern => pattern.test(repo.name))) return false
  
  // Boost score for repos with good indicators
  const portfolioBoosts = repo.stargazers_count > 0 ||
                         repo.has_pages ||
                         Boolean(repo.homepage) ||
                         repo.topics.length > 0 ||
                         repo.description.toLowerCase().includes('project')
  
  return portfolioBoosts
}

// Calculate repository score for sorting
function calculateRepoScore(repo: GitHubRepository): number {
  let score = 0
  
  // Stars and forks
  score += repo.stargazers_count * 3
  score += repo.forks_count * 2
  
  // Recent activity
  const lastUpdate = new Date(repo.updated_at)
  const monthsOld = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  score += Math.max(0, 20 - monthsOld) // Bonus for recent updates
  
  // Quality indicators
  if (repo.description && repo.description.length > 20) score += 10
  if (repo.homepage) score += 15
  if (repo.topics && repo.topics.length > 0) score += 5
  if (repo.has_pages) score += 10
  
  // Language bonus for popular web languages
  const webLanguages = ['TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS']
  if (repo.language && webLanguages.includes(repo.language)) score += 8
  
  return score
}

// Fetch GitHub repositories with enhanced filtering
async function fetchGitHubRepositories(): Promise<GitHubRepository[]> {
  try {
    console.log('🔄 Fetching GitHub repositories...')
    
    if (!GITHUB_TOKEN) {
      console.warn('⚠️ No GitHub token found - API will be rate limited')
    }
    
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`,
      {
        headers: getHeaders(),
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`)
    }

    const repos: GitHubRepository[] = await response.json()
    console.log(`📦 Found ${repos.length} total repositories`)
    
    // Filter for portfolio-worthy repos
    const portfolioRepos = repos
      .filter(isPortfolioWorthy)
      .map(repo => ({
        ...repo,
        // Add calculated score for sorting
        _score: calculateRepoScore(repo)
      }))
      .sort((a, b) => (b._score || 0) - (a._score || 0))
      .map(({ _score, ...repo }) => repo) // Remove score from final output
    
    console.log(`✨ Filtered to ${portfolioRepos.length} portfolio repositories`)
    
    return portfolioRepos
  } catch (error) {
    console.error('❌ Error fetching GitHub repositories:', error)
    return []
  }
}

// Fetch GitHub user data
async function fetchGitHubUser(): Promise<GitHubUser | null> {
  try {
    console.log('🔄 Fetching GitHub user data...')
    
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

    const user: GitHubUser = await response.json()
    console.log(`✅ Fetched user data for ${user.name || user.login}`)
    
    return user
  } catch (error) {
    console.error('❌ Error fetching GitHub user:', error)
    return null
  }
}

// Generate comprehensive GitHub stats
async function generateGitHubStats(): Promise<GitHubStats | null> {
  try {
    console.log('📊 Generating GitHub stats...')
    
    const [user, repositories] = await Promise.all([
      fetchGitHubUser(),
      fetchGitHubRepositories()
    ])

    if (!user) {
      console.error('❌ Could not fetch user data for stats')
      return null
    }

    // Calculate statistics
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)

    // Language statistics
    const languageStats: Record<string, number> = {}
    repositories.forEach(repo => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1
      }
    })

    // Find most recent activity
    const sortedByUpdate = repositories.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    const lastCommitDate = sortedByUpdate[0]?.updated_at || user.updated_at

    const stats: GitHubStats = {
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

    console.log(`✅ Generated stats: ${repositories.length} repos, ${totalStars} stars`)
    return stats
  } catch (error) {
    console.error('❌ Error generating GitHub stats:', error)
    return null
  }
}

// Cached versions of the functions for better performance
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

// Export non-cached versions as well for direct use
export { 
  fetchGitHubRepositories, 
  fetchGitHubUser, 
  generateGitHubStats,
  isPortfolioWorthy,
  calculateRepoScore
}