// hooks/usePortfolioData.ts - COMPLETELY FIXED VERSION
import { useState, useEffect, useCallback, useRef } from 'react'
import type { PortfolioProject, PortfolioStats, UsePortfolioDataReturn } from '@/types/portfolio'

interface UsePortfolioDataOptions {
  autoFetch?: boolean
  refreshInterval?: number
  includePrivate?: boolean
  source?: 'auto' | 'github' | 'mock'
  limit?: number
  retryAttempts?: number
  retryDelay?: number
}

export function usePortfolioData(options: UsePortfolioDataOptions = {}): UsePortfolioDataReturn {
  const {
    autoFetch = true,
    refreshInterval = 0,
    includePrivate = false,
    source = 'auto',
    limit = 20,
    retryAttempts = 3,
    retryDelay = 1000
  } = options

  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)
  
  // Use refs to prevent stale closures
  const currentAttempt = useRef(0)
  const abortController = useRef<AbortController | null>(null)

  // FIXED: Enhanced retry mechanism
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const fetchWithRetry = useCallback(async <T>(
    fetchFn: () => Promise<T>,
    context: string
  ): Promise<T> => {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        if (abortController.current?.signal.aborted) {
          throw new Error('Request aborted')
        }
        
        console.log(`🔄 ${context} (attempt ${attempt}/${retryAttempts})`)
        const result = await fetchFn()
        console.log(`✅ ${context} succeeded`)
        return result
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Unknown error')
        console.warn(`⚠️ ${context} attempt ${attempt} failed:`, lastError.message)
        
        if (attempt < retryAttempts) {
          await delay(retryDelay * attempt) // Exponential backoff
        }
      }
    }
    
    throw lastError || new Error(`Failed after ${retryAttempts} attempts`)
  }, [retryAttempts, retryDelay])

  // FIXED: Enhanced project fetching with better error handling
  const fetchProjects = useCallback(async (): Promise<PortfolioProject[]> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      source,
      ...(includePrivate && { includePrivate: 'true' })
    })

    return fetchWithRetry(async () => {
      const response = await fetch(`/api/projects?${params}`, {
        signal: abortController.current?.signal
      })
      
      if (!response.ok) {
        throw new Error(`Projects API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Projects API returned unsuccessful response')
      }

      const fetchedProjects = Array.isArray(data.projects) ? data.projects : []
      
      // FIXED: Validate project structure
      const validProjects = fetchedProjects.filter((project: any) => {
        return project &&
               typeof project.id === 'string' &&
               typeof project.name === 'string' &&
               typeof project.description === 'string' &&
               Array.isArray(project.techStack) &&
               typeof project.featured === 'boolean'
      })

      console.log(`✅ Fetched ${validProjects.length}/${fetchedProjects.length} valid projects from ${data.source}`)
      
      // Log live deployments for debugging
      const liveProjects = validProjects.filter((p: PortfolioProject) => 
        p.vercel?.isLive || p.liveUrl
      )
      console.log(`📡 Found ${liveProjects.length} live deployments`)

      return validProjects
    }, 'Fetch Projects')
  }, [source, limit, includePrivate, fetchWithRetry])

  // FIXED: Enhanced stats fetching
  const fetchStats = useCallback(async (): Promise<PortfolioStats> => {
    return fetchWithRetry(async () => {
      const response = await fetch('/api/portfolio-stats', {
        signal: abortController.current?.signal
      })
      
      if (!response.ok) {
        throw new Error(`Stats API error: ${response.status}`)
      }

      const statsData = await response.json()
      
      // FIXED: Ensure proper PortfolioStats structure with validation
      const validatedStats: PortfolioStats = {
        totalProjects: typeof statsData.totalProjects === 'number' ? statsData.totalProjects : 0,
        totalStars: typeof statsData.totalStars === 'number' ? statsData.totalStars : 0,
        liveProjects: typeof statsData.liveProjects === 'number' ? statsData.liveProjects : 0,
        totalForks: typeof statsData.totalForks === 'number' ? statsData.totalForks : 0,
        topLanguages: Array.isArray(statsData.topLanguages) ? statsData.topLanguages : [],
        deploymentSuccessRate: typeof statsData.deploymentSuccessRate === 'number' ? statsData.deploymentSuccessRate : undefined,
        recentActivity: statsData.recentActivity && typeof statsData.recentActivity === 'object' ? {
          activeProjects: typeof statsData.recentActivity.activeProjects === 'number' ? statsData.recentActivity.activeProjects : 0,
          lastUpdated: typeof statsData.recentActivity.lastUpdated === 'string' ? statsData.recentActivity.lastUpdated : new Date().toISOString()
        } : {
          activeProjects: 0,
          lastUpdated: new Date().toISOString()
        }
      }
      
      console.log('✅ Portfolio stats validated:', validatedStats)
      return validatedStats
    }, 'Fetch Stats')
  }, [fetchWithRetry])

  // FIXED: Main refetch function with proper error handling
  const refetch = useCallback(async () => {
    if (loading) {
      console.log('🔄 Refetch already in progress, skipping...')
      return
    }

    // Cancel any ongoing requests
    if (abortController.current) {
      abortController.current.abort()
    }
    abortController.current = new AbortController()

    setLoading(true)
    setError(null)
    currentAttempt.current++
    const thisAttempt = currentAttempt.current

    try {
      console.log('🔄 Starting portfolio data refetch...')
      
      // Fetch projects and stats in parallel
      const [fetchedProjects, fetchedStats] = await Promise.allSettled([
        fetchProjects(),
        fetchStats()
      ])

      // Check if this is still the current attempt
      if (currentAttempt.current !== thisAttempt) {
        console.log('⏭️ Newer request in progress, ignoring results')
        return
      }

      // Handle projects result
      if (fetchedProjects.status === 'fulfilled') {
        setProjects(fetchedProjects.value)
      } else {
        console.warn('⚠️ Projects fetch failed:', fetchedProjects.reason)
        // Keep existing projects on error, don't clear them
      }

      // Handle stats result  
      if (fetchedStats.status === 'fulfilled') {
        setStats(fetchedStats.value)
      } else {
        console.warn('⚠️ Stats fetch failed:', fetchedStats.reason)
        // Generate fallback stats from current projects
        if (projects.length > 0) {
          const fallbackStats: PortfolioStats = {
            totalProjects: projects.length,
            totalStars: projects.reduce((sum, p) => sum + (p.github?.stars || 0), 0),
            liveProjects: projects.filter(p => p.vercel?.isLive || p.liveUrl).length,
            totalForks: projects.reduce((sum, p) => sum + (p.github?.forks || 0), 0),
            topLanguages: [...new Set(projects.flatMap(p => p.techStack || []))].slice(0, 5),
            recentActivity: {
              activeProjects: projects.filter(p => p.featured).length,
              lastUpdated: new Date().toISOString()
            }
          }
          setStats(fallbackStats)
        }
      }

      // Update timestamp if at least one fetch succeeded
      if (fetchedProjects.status === 'fulfilled' || fetchedStats.status === 'fulfilled') {
        setLastFetch(Date.now())
        console.log('✅ Portfolio data refetch completed successfully')
      } else {
        throw new Error('Both projects and stats fetch failed')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during refetch'
      console.error('❌ Portfolio data refetch failed:', errorMessage)
      
      // Only set error if we don't have any existing data
      if (projects.length === 0 && !stats) {
        setError(errorMessage)
      } else {
        console.log('📦 Keeping existing data despite fetch error')
      }
    } finally {
      setLoading(false)
    }
  }, [loading, fetchProjects, fetchStats, projects])

  // FIXED: Cache duration check
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  const shouldRefresh = useCallback(() => {
    return Date.now() - lastFetch > CACHE_DURATION
  }, [lastFetch])

  // FIXED: Initial data fetch
  useEffect(() => {
    if (autoFetch && (projects.length === 0 || shouldRefresh())) {
      console.log('🚀 Initial portfolio data fetch triggered')
      refetch()
    }
  }, [autoFetch, shouldRefresh, refetch, projects.length])

  // FIXED: Auto-refresh functionality
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return

    const interval = setInterval(() => {
      if (shouldRefresh()) {
        console.log('🔄 Auto-refreshing portfolio data...')
        refetch()
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval, shouldRefresh, refetch])

  // FIXED: Refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && shouldRefresh()) {
        console.log('👁️ Page visible - refreshing portfolio data...')
        refetch()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [shouldRefresh, refetch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort()
      }
    }
  }, [])

  return {
    projects,
    stats,
    loading,
    error,
    refetch
  }
}

// FIXED: Enhanced version with better filtering and sorting
export function useEnhancedPortfolioData(options: UsePortfolioDataOptions & {
  featured?: boolean
  sortBy?: 'name' | 'stars' | 'updated' | 'featured'
  searchTerm?: string
  category?: string
} = {}) {
  const {
    featured,
    sortBy = 'featured',
    searchTerm = '',
    category,
    ...baseOptions
  } = options

  const baseResult = usePortfolioData(baseOptions)
  const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>([])

  // FIXED: Apply filters and sorting with better validation
  useEffect(() => {
    if (!baseResult.projects.length) {
      setFilteredProjects([])
      return
    }

    let filtered = [...baseResult.projects]

    // Filter by featured
    if (featured !== undefined) {
      filtered = filtered.filter(project => project.featured === featured)
    }

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(project => project.category === category)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(term) ||
        (project.title && project.title.toLowerCase().includes(term)) ||
        project.description.toLowerCase().includes(term) ||
        project.techStack.some(tech => tech.toLowerCase().includes(term)) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(term)))
      )
    }

    // Apply sorting with safe comparisons
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.title || a.name).localeCompare(b.title || b.name)
        case 'stars':
          return (b.github?.stars || 0) - (a.github?.stars || 0)
        case 'updated':
          const aDate = new Date(a.github?.lastUpdated || '2020-01-01').getTime()
          const bDate = new Date(b.github?.lastUpdated || '2020-01-01').getTime()
          return bDate - aDate
        case 'featured':
        default:
          // Featured first, then live deployments, then by stars
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          
          const aLive = a.vercel?.isLive || Boolean(a.liveUrl)
          const bLive = b.vercel?.isLive || Boolean(b.liveUrl)
          if (aLive && !bLive) return -1
          if (!aLive && bLive) return 1
          
          return (b.github?.stars || 0) - (a.github?.stars || 0)
      }
    })

    setFilteredProjects(filtered)
  }, [baseResult.projects, featured, sortBy, searchTerm, category])

  return {
    ...baseResult,
    projects: filteredProjects,
    allProjects: baseResult.projects,
    filteredCount: filteredProjects.length,
    totalCount: baseResult.projects.length
  }
}

// FIXED: Utility hooks for specific use cases
export function useFeaturedProjects(limit = 6) {
  return useEnhancedPortfolioData({
    featured: true,
    limit,
    sortBy: 'featured'
  })
}

export function useLiveProjects(limit = 10) {
  const { projects, ...rest } = usePortfolioData({ limit })
  
  const liveProjects = projects.filter(project => 
    project.vercel?.isLive || project.liveUrl
  )

  return {
    ...rest,
    projects: liveProjects
  }
}

export function useProjectsByCategory(category: string, limit = 10) {
  return useEnhancedPortfolioData({
    category,
    limit,
    sortBy: 'featured'
  })
}

export default usePortfolioData