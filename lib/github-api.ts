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
  avatar_url: string
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
  private token: string | undefined

  constructor(token?: string, username: string = 'sippinwindex') {
    this.username = username
    this.token = token || process.env.GITHUB_TOKEN
    
    // Initialize Octokit if we have a token
    if (this.token) {
      this.octokit = new Octokit({
        auth: this.token,
        userAgent: 'Portfolio-App/1.0.0',
        request: {
          timeout: 10000,
        }
      })
    }
  }

  private ensureAuthenticated(): boolean {
    if (!this.octokit) {
      console.warn('GitHub API not initialized - token may be missing')
      return false
    }
    return true
  }

  async getUser(): Promise<GitHubUser | null> {
    if (!this.ensureAuthenticated()) return null

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
    if (!this.ensureAuthenticated()) return []

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

      return filteredRepos as GitHubRepository[]
    } catch (error) {
      console.error('Error fetching repositories:', error)
      return []
    }
  }

  async getRepository(name: string): Promise<GitHubRepository | null> {
    if (!this.ensureAuthenticated()) return null

    try {
      const { data } = await this.octokit!.rest.repos.get({
        owner: this.username,
        repo: name,
      })

      return data as GitHubRepository
    } catch (error) {
      console.error(`Error fetching repository ${name}:`, error)
      return null
    }
  }

  async getRepositoryLanguages(name: string): Promise<Record<string, number>> {
    if (!this.ensureAuthenticated()) return {}

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

  async getGitHubStats(): Promise<GitHubStats | null> {
    if (!this.ensureAuthenticated()) return null

    try {
      const [user, repositories] = await Promise.all([
        this.getUser(),
        this.getRepositories({ per_page: 100 })
      ])

      if (!user) return null

      const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
      const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)

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
        languages: {}, // Would need to fetch languages for each repo
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

  // Rate limiting helpers
  async getRateLimit() {
    if (!this.ensureAuthenticated()) return null

    try {
      const { data } = await this.octokit!.rest.rateLimit.get()
      return data.rate
    } catch (error) {
      console.error('Error fetching rate limit:', error)
      return null
    }
  }
}

// Create server-side instance for API routes
export function createGitHubAPI(token?: string): GitHubAPI {
  return new GitHubAPI(token)
}

// Client-side instance (for browser use)
export const githubAPI = new GitHubAPI()

// Utility functions for portfolio projects
export async function getPortfolioRepositories(githubAPI: GitHubAPI) {
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
      
      // Skip if less than 1 star and not recently updated
      const isRecent = new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      if (repo.stargazers_count < 1 && !isRecent) return false
      
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

export async function getFeaturedRepositories(githubAPI: GitHubAPI) {
  try {
    const repositories = await getPortfolioRepositories(githubAPI)
    
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