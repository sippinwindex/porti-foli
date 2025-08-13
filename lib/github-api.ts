// lib/github-api.ts
import { Octokit } from '@octokit/rest'

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  default_branch: string
  open_issues_count: number
  archived: boolean
  disabled: boolean
  private: boolean
  fork: boolean
  languages?: Record<string, number>
  readme?: string
  latest_commit?: {
    sha: string
    message: string
    author: string
    date: string
  }
}

export interface GitHubUser {
  login: string
  id: number
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface GitHubStats {
  totalRepositories: number
  totalStars: number
  totalForks: number
  languages: Record<string, number>
  recentActivity: {
    totalCommits: number
    lastWeekCommits: number
    activeRepositories: number
  }
}

class GitHubAPI {
  private octokit: Octokit | null = null
  private username: string
  private isClientSide: boolean = false

  constructor(token?: string, username: string = 'sippinwindex') {
    this.username = username
    this.isClientSide = typeof window !== 'undefined'
    
    // Only initialize Octokit on the client side
    if (this.isClientSide) {
      const authToken = token || process.env.GITHUB_TOKEN
      if (authToken) {
        this.octokit = new Octokit({
          auth: authToken,
          userAgent: 'Portfolio-App/1.0.0',
          request: {
            timeout: 10000,
          }
        })
      }
    }
  }

  private ensureClientSide(): boolean {
    if (!this.isClientSide) {
      console.warn('GitHub API not available during SSR/build time')
      return false
    }

    if (!this.octokit) {
      console.warn('GitHub API not properly initialized - token may be missing')
      return false
    }

    return true
  }

  async getUser(): Promise<GitHubUser | null> {
    if (!this.ensureClientSide()) return null

    try {
      const { data } = await this.octokit!.rest.users.getByUsername({
        username: this.username,
      })
      return data as GitHubUser
    } catch (error) {
      console.error('Error fetching GitHub user:', error)
      return null
    }
  }

  async getRepositories(options: {
    sort?: 'created' | 'updated' | 'pushed' | 'full_name'
    direction?: 'asc' | 'desc'
    per_page?: number
    page?: number
    type?: 'all' | 'owner' | 'member'
  } = {}): Promise<GitHubRepository[]> {
    if (!this.ensureClientSide()) return []

    try {
      const {
        sort = 'updated',
        direction = 'desc',
        per_page = 100,
        type = 'owner'
      } = options

      const { data } = await this.octokit!.rest.repos.listForUser({
        username: this.username,
        sort,
        direction,
        per_page,
        type,
      })

      // Filter out forks and archived repos by default
      const filteredRepos = data.filter(repo => !repo.fork && !repo.archived)

      // Enhance repositories with additional data (with error handling)
      const enhancedRepos = await Promise.allSettled(
        filteredRepos.map(async (repo) => {
          try {
            const [languages, readme, latestCommit] = await Promise.allSettled([
              this.getRepositoryLanguages(repo.name),
              this.getRepositoryReadme(repo.name),
              this.getLatestCommit(repo.name, repo.default_branch),
            ])

            return {
              ...repo,
              languages: languages.status === 'fulfilled' ? languages.value : {},
              readme: readme.status === 'fulfilled' ? readme.value : undefined,
              latest_commit: latestCommit.status === 'fulfilled' ? latestCommit.value : undefined,
            } as GitHubRepository
          } catch (error) {
            console.warn(`Error enhancing repo ${repo.name}:`, error)
            return repo as GitHubRepository
          }
        })
      )

      return enhancedRepos
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<GitHubRepository>).value)
    } catch (error) {
      console.error('Error fetching repositories:', error)
      return []
    }
  }

  async getRepository(name: string): Promise<GitHubRepository | null> {
    if (!this.ensureClientSide()) return null

    try {
      const { data } = await this.octokit!.rest.repos.get({
        owner: this.username,
        repo: name,
      })

      const [languages, readme, latestCommit] = await Promise.allSettled([
        this.getRepositoryLanguages(name),
        this.getRepositoryReadme(name),
        this.getLatestCommit(name, data.default_branch),
      ])

      return {
        ...data,
        languages: languages.status === 'fulfilled' ? languages.value : {},
        readme: readme.status === 'fulfilled' ? readme.value : undefined,
        latest_commit: latestCommit.status === 'fulfilled' ? latestCommit.value : undefined,
      } as GitHubRepository
    } catch (error) {
      console.error(`Error fetching repository ${name}:`, error)
      return null
    }
  }

  private async getRepositoryLanguages(name: string): Promise<Record<string, number>> {
    if (!this.ensureClientSide()) return {}

    try {
      const { data } = await this.octokit!.rest.repos.listLanguages({
        owner: this.username,
        repo: name,
      })
      return data
    } catch (error) {
      console.warn(`Error fetching languages for ${name}:`, error)
      return {}
    }
  }

  private async getRepositoryReadme(name: string): Promise<string | undefined> {
    if (!this.ensureClientSide()) return undefined

    try {
      const { data } = await this.octokit!.rest.repos.getReadme({
        owner: this.username,
        repo: name,
      })
      
      if (data.content && data.encoding === 'base64') {
        return atob(data.content)
      }
      return undefined
    } catch (error) {
      // README not found is common, don't log as error
      return undefined
    }
  }

  private async getLatestCommit(name: string, branch: string = 'main') {
    if (!this.ensureClientSide()) return undefined

    try {
      const { data } = await this.octokit!.rest.repos.listCommits({
        owner: this.username,
        repo: name,
        sha: branch,
        per_page: 1,
      })

      if (data.length > 0) {
        const commit = data[0]
        return {
          sha: commit.sha,
          message: commit.commit.message.split('\n')[0], // First line only
          author: commit.commit.author?.name || 'Unknown',
          date: commit.commit.author?.date || new Date().toISOString(),
        }
      }
      return undefined
    } catch (error) {
      console.warn(`Error fetching latest commit for ${name}:`, error)
      return undefined
    }
  }

  async getGitHubStats(): Promise<GitHubStats | null> {
    if (!this.ensureClientSide()) return null

    try {
      const [user, repositories] = await Promise.all([
        this.getUser(),
        this.getRepositories({ per_page: 100 })
      ])

      if (!user) return null

      const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
      const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)

      // Aggregate language statistics
      const languages: Record<string, number> = {}
      repositories.forEach(repo => {
        if (repo.languages) {
          Object.entries(repo.languages).forEach(([lang, bytes]) => {
            languages[lang] = (languages[lang] || 0) + bytes
          })
        }
      })

      // Calculate recent activity (last week)
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 7)

      const recentRepos = repositories.filter(repo => 
        new Date(repo.pushed_at) > lastWeek
      )

      return {
        totalRepositories: user.public_repos,
        totalStars,
        totalForks,
        languages,
        recentActivity: {
          totalCommits: 0, // Would need commits API for accurate count
          lastWeekCommits: 0, // Would need commits API for accurate count
          activeRepositories: recentRepos.length,
        }
      }
    } catch (error) {
      console.error('Error calculating GitHub stats:', error)
      return null
    }
  }

  async searchRepositories(query: string, options: {
    sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated'
    order?: 'desc' | 'asc'
    per_page?: number
  } = {}): Promise<GitHubRepository[]> {
    if (!this.ensureClientSide()) return []

    try {
      const { sort = 'updated', order = 'desc', per_page = 30 } = options
      
      const searchQuery = `user:${this.username} ${query}`
      
      const { data } = await this.octokit!.rest.search.repos({
        q: searchQuery,
        sort,
        order,
        per_page,
      })

      return data.items as GitHubRepository[]
    } catch (error) {
      console.error('Error searching repositories:', error)
      return []
    }
  }

  // Rate limiting helpers
  async getRateLimit() {
    if (!this.ensureClientSide()) return null

    try {
      const { data } = await this.octokit!.rest.rateLimit.get()
      return data.rate
    } catch (error) {
      console.error('Error fetching rate limit:', error)
      return null
    }
  }

  async waitForRateLimit() {
    const rateLimit = await this.getRateLimit()
    if (rateLimit && rateLimit.remaining === 0) {
      const resetTime = new Date(rateLimit.reset * 1000)
      const waitTime = resetTime.getTime() - Date.now()
      
      if (waitTime > 0) {
        console.log(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000)} seconds...`)
        await new Promise(resolve => setTimeout(resolve, waitTime + 1000))
      }
    }
  }
}

// Export singleton instance - will be safe during build
export const githubAPI = new GitHubAPI()

// Utility functions for common operations
export async function getPortfolioRepositories() {
  try {
    const repositories = await githubAPI.getRepositories({
      sort: 'updated',
      direction: 'desc',
      per_page: 50
    })

    // Filter for portfolio-worthy repositories
    return repositories.filter(repo => {
      // Skip if no description
      if (!repo.description) return false
      
      // Skip if less than 2 stars and not recently updated
      const isRecent = new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      if (repo.stargazers_count < 2 && !isRecent) return false
      
      // Skip common non-portfolio repos
      const skipPatterns = [
        /^dotfiles$/i,
        /^\.github$/i,
        /^config$/i,
        /test/i,
        /playground/i,
        /sandbox/i,
        /learning/i,
        /tutorial/i,
        /practice/i
      ]
      
      return !skipPatterns.some(pattern => pattern.test(repo.name))
    })
  } catch (error) {
    console.error('Error fetching portfolio repositories:', error)
    return []
  }
}

export async function getFeaturedRepositories() {
  try {
    const repositories = await getPortfolioRepositories()
    
    // Sort by combination of stars, forks, and recent activity
    return repositories
      .sort((a, b) => {
        const scoreA = a.stargazers_count * 2 + a.forks_count + (new Date(a.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 5 : 0)
        const scoreB = b.stargazers_count * 2 + b.forks_count + (new Date(b.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 5 : 0)
        return scoreB - scoreA
      })
      .slice(0, 6) // Top 6 repositories
  } catch (error) {
    console.error('Error fetching featured repositories:', error)
    return []
  }
}

// Cache implementation for better performance
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data
  }
  cache.delete(key)
  return null
}

export function setCachedData<T>(key: string, data: T, ttlMinutes: number = 60) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000
  })
}

// Cached versions of main functions
export async function getCachedRepositories() {
  const cacheKey = 'github-repositories'
  let repositories = getCachedData<GitHubRepository[]>(cacheKey)
  
  if (!repositories) {
    repositories = await getPortfolioRepositories()
    setCachedData(cacheKey, repositories, 30) // Cache for 30 minutes
  }
  
  return repositories
}

export async function getCachedGitHubStats() {
  const cacheKey = 'github-stats'
  let stats = getCachedData<GitHubStats>(cacheKey)
  
  if (!stats) {
    stats = await githubAPI.getGitHubStats()
    setCachedData(cacheKey, stats, 60) // Cache for 1 hour
  }
  
  return stats
}