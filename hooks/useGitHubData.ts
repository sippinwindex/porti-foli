// hooks/useGitHubData.ts - UPDATED VERSION
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
  totalProjects: number
  totalStars: number
  totalForks: number
  topLanguages: string[]
  publicRepos: number
  followers: number
  following: number
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

  // Fetch repositories - UPDATED API CALL
  const fetchRepositories = async () => {
    try {
      setError(null)
      
      console.log('🔄 Fetching GitHub repositories...')
      // Updated to match your current API structure
      const response = await fetch('/api/github?type=repos')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.repositories) {
        setRepositories(data.repositories)
        console.log(`✅ Fetched ${data.repositories.length} repositories`)
      } else {
        throw new Error(data.error || 'No repositories data received')
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repositories'
      console.error('❌ Error fetching repositories:', errorMessage)
      setError(errorMessage)
    }
  }

  // Fetch user data - UPDATED API CALL
  const fetchUser = async () => {
    try {
      setError(null)
      
      console.log('🔄 Fetching GitHub user...')
      const response = await fetch('/api/github?type=user')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.user) {
        setUser(data.user)
        console.log(`✅ Fetched user: ${data.user.name || data.user.login}`)
      } else {
        throw new Error(data.error || 'No user data received')
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data'
      console.error('❌ Error fetching user:', errorMessage)
      setError(errorMessage)
    }
  }

  // Fetch stats - UPDATED API CALL
  const fetchStats = async () => {
    try {
      setError(null)
      
      console.log('🔄 Fetching GitHub stats...')
      const response = await fetch('/api/github?type=stats')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.stats) {
        setStats(data.stats)
        console.log(`✅ Fetched stats: ${data.stats.totalProjects || 0} repos, ${data.stats.totalStars || 0} stars`)
      } else {
        throw new Error(data.error || 'No stats data received')
      }
      
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
      await Promise.allSettled([
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