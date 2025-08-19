// hooks/useGitHubData.ts - COMPLETE FIX
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
  repositories: GitHubRepo[]
  user: GitHubUser | null
  stats: GitHubStats | null
  loading: boolean
  error: string | null
  fetchRepositories: () => Promise<void>
  fetchUser: () => Promise<void>
  fetchStats: () => Promise<void>
  refetchAll: () => Promise<void>
  clearError: () => void
}

export function useGitHubData(options: UseGitHubDataOptions = {}): UseGitHubDataReturn {
  const { autoFetch = true, cacheTimeout = 30 * 60 * 1000 } = options

  const [repositories, setRepositories] = useState<GitHubRepo[]>([])
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  const shouldRefetch = () => Date.now() - lastFetch > cacheTimeout

  const fetchRepositories = async () => {
    try {
      setError(null)
      console.log('🔄 Fetching GitHub repositories...')
      
      // Use the correct API endpoint
      const response = await fetch('/api/github/repositories')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.repositories) {
        setRepositories(data.repositories)
        console.log(`✅ Fetched ${data.repositories.length} repositories`)
      } else {
        throw new Error('No repositories data received')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repositories'
      console.error('❌ Error fetching repositories:', errorMessage)
      setError(errorMessage)
    }
  }

  const fetchUser = async () => {
    try {
      setError(null)
      console.log('🔄 Fetching GitHub user...')
      
      // Use correct endpoint with query param
      const response = await fetch('/api/github?type=user')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const userData = await response.json()
      
      if (userData) {
        setUser(userData)
        console.log(`✅ Fetched user: ${userData.name || userData.login}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user'
      console.error('❌ Error fetching user:', errorMessage)
      setError(errorMessage)
    }
  }

  const fetchStats = async () => {
    try {
      setError(null)
      console.log('🔄 Fetching GitHub stats...')
      
      const response = await fetch('/api/github/stats')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.stats) {
        // Transform stats to match expected format
        const transformedStats: GitHubStats = {
          totalProjects: typeof data.stats.repositories === 'number' 
            ? data.stats.repositories 
            : Array.isArray(data.stats.repositories) 
              ? data.stats.repositories.length 
              : 0,
          totalStars: data.stats.totalStars || 0,
          totalForks: data.stats.totalForks || 0,
          topLanguages: Object.keys(data.stats.languageStats || {}).slice(0, 5),
          publicRepos: data.stats.user?.public_repos || 0,
          followers: data.stats.user?.followers || 0,
          following: data.stats.user?.following || 0
        }
        setStats(transformedStats)
        console.log(`✅ Fetched stats: ${transformedStats.totalProjects} repos`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats'
      console.error('❌ Error fetching stats:', errorMessage)
      setError(errorMessage)
    }
  }

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

  const clearError = () => setError(null)

  useEffect(() => {
    if (autoFetch && (repositories.length === 0 || shouldRefetch())) {
      refetchAll()
    }
  }, [autoFetch])

  return {
    repositories,
    user,
    stats,
    loading,
    error,
    fetchRepositories: async () => {
      setLoading(true)
      try {
        await fetchRepositories()
      } finally {
        setLoading(false)
      }
    },
    fetchUser: async () => {
      setLoading(true)
      try {
        await fetchUser()
      } finally {
        setLoading(false)
      }
    },
    fetchStats: async () => {
      setLoading(true)
      try {
        await fetchStats()
      } finally {
        setLoading(false)
      }
    },
    refetchAll,
    clearError
  }
}

export default useGitHubData