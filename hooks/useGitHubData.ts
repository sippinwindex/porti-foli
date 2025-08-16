// hooks/useGitHubData.ts
import { useState, useEffect } from 'react'

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  topics: string[]
  homepage: string | null
}

interface GitHubUser {
  login: string
  name: string
  bio: string
  avatar_url: string
  public_repos: number
  followers: number
  following: number
  location: string
  company: string
  blog: string
}

interface GitHubStats {
  user: GitHubUser
  repositories: {
    total: number
    analyzed: number
    total_stars: number
    total_forks: number
    languages: Record<string, number>
    recent_activity: {
      active_repos_30_days: number
      most_recent_push: string | null
    }
  }
  portfolio: {
    featured_repos: number
    top_language: string
  }
}

interface UseGitHubDataOptions {
  autoFetch?: boolean
  cacheTimeout?: number
}

interface UseGitHubDataReturn {
  // Data
  repositories: GitHubRepo[]
  user: GitHubUser | null
  stats: GitHubStats | null
  
  // State
  loading: boolean
  error: string | null
  
  // Actions
  fetchRepositories: () => Promise<void>
  fetchUser: () => Promise<void>
  fetchStats: () => Promise<void>
  refetchAll: () => Promise<void>
  clearError: () => void
}

export function useGitHubData(options: UseGitHubDataOptions = {}): UseGitHubDataReturn {
  const { autoFetch = true, cacheTimeout = 30 * 60 * 1000 } = options // 30 minutes default cache

  // State
  const [repositories, setRepositories] = useState<GitHubRepo[]>([])
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cache management
  const [lastFetch, setLastFetch] = useState<number>(0)

  const shouldRefetch = () => {
    return Date.now() - lastFetch > cacheTimeout
  }

  // Fetch repositories
  const fetchRepositories = async () => {
    try {
      setError(null)
      
      console.log('🔄 Fetching GitHub repositories...')
      const response = await fetch('/api/github/repositories?type=portfolio&limit=20')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setRepositories(data.repositories || [])
      
      console.log(`✅ Fetched ${data.repositories?.length || 0} repositories`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repositories'
      console.error('❌ Error fetching repositories:', errorMessage)
      setError(errorMessage)
    }
  }

  // Fetch user data
  const fetchUser = async () => {
    try {
      setError(null)
      
      console.log('🔄 Fetching GitHub user...')
      const response = await fetch('/api/github?type=user')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const userData = await response.json()
      setUser(userData)
      
      console.log(`✅ Fetched user: ${userData.name || userData.login}`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data'
      console.error('❌ Error fetching user:', errorMessage)
      setError(errorMessage)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    try {
      setError(null)
      
      console.log('🔄 Fetching GitHub stats...')
      const response = await fetch('/api/github/stats')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const statsData = await response.json()
      setStats(statsData)
      
      console.log(`✅ Fetched stats: ${statsData.repositories?.total || 0} repos, ${statsData.repositories?.total_stars || 0} stars`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats'
      console.error('❌ Error fetching stats:', errorMessage)
      setError(errorMessage)
    }
  }

  // Fetch all data
  const refetchAll = async () => {
    if (loading) return
    
    setLoading(true)
    setError(null)
    
    try {
      await Promise.all([
        fetchRepositories(),
        fetchUser(),
        fetchStats()
      ])
      setLastFetch(Date.now())
    } catch (err) {
      console.error('❌ Error in refetchAll:', err)
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Auto-fetch on mount and when cache expires
  useEffect(() => {
    if (autoFetch && (repositories.length === 0 || shouldRefetch())) {
      refetchAll()
    }
  }, [autoFetch])

  // Expose methods for manual fetching
  const fetchRepositoriesWithLoading = async () => {
    setLoading(true)
    try {
      await fetchRepositories()
    } finally {
      setLoading(false)
    }
  }

  const fetchUserWithLoading = async () => {
    setLoading(true)
    try {
      await fetchUser()
    } finally {
      setLoading(false)
    }
  }

  const fetchStatsWithLoading = async () => {
    setLoading(true)
    try {
      await fetchStats()
    } finally {
      setLoading(false)
    }
  }

  return {
    // Data
    repositories,
    user,
    stats,
    
    // State
    loading,
    error,
    
    // Actions
    fetchRepositories: fetchRepositoriesWithLoading,
    fetchUser: fetchUserWithLoading,
    fetchStats: fetchStatsWithLoading,
    refetchAll,
    clearError
  }
}

export default useGitHubData