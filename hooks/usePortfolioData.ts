// hooks/usePortfolioData.ts - Enhanced with better GitHub integration
import { useState, useEffect, useCallback } from 'react'
import type { PortfolioProject, PortfolioStats, UsePortfolioDataReturn } from '@/types/portfolio'

interface UsePortfolioDataOptions {
  autoFetch?: boolean
  refreshInterval?: number
  includePrivate?: boolean
  source?: 'auto' | 'github' | 'mock'
  limit?: number
}

export function usePortfolioData(options: UsePortfolioDataOptions = {}): UsePortfolioDataReturn {
  const {
    autoFetch = true,
    refreshInterval = 0, // No auto-refresh by default
    includePrivate = false,
    source = 'auto',
    limit = 20
  } = options

  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  // Cache duration: 5 minutes for better UX
  const CACHE_DURATION = 5 * 60 * 1000

  const shouldRefresh = useCallback(() => {
    return Date.now() - lastFetch > CACHE_DURATION
  }, [lastFetch])

  const fetchProjects = useCallback(async () => {
    try {
      setError(null)
      console.log('🔄 Fetching portfolio projects...')

      // Build query parameters
      const params = new URLSearchParams({
        limit: limit.toString(),
        source,
        ...(includePrivate && { includePrivate: 'true' })
      })

      const response = await fetch(`/api/projects?${params}`)
      
      if (!response.ok) {
        throw new Error(`Projects API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        const fetchedProjects = data.projects || []
        setProjects(fetchedProjects)
        
        console.log(`✅ Fetched ${fetchedProjects.length} projects from ${data.source}`)
        
        // Log live deployments for debugging
        const liveProjects = fetchedProjects.filter((p: PortfolioProject) => 
          p.vercel?.isLive || p.liveUrl
        )
        console.log(`📡 Found ${liveProjects.length} live deployments:`, 
          liveProjects.map((p: PortfolioProject) => ({ 
            name: p.name, 
            liveUrl: p.vercel?.liveUrl || p.liveUrl 
          }))
        )

        // Update last fetch timestamp
        setLastFetch(Date.now())
        
        return fetchedProjects
      } else {
        throw new Error(data.error || 'Failed to fetch projects')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects'
      console.error('❌ Error fetching projects:', errorMessage)
      setError(errorMessage)
      
      // Don't clear existing projects on error
      return projects
    }
  }, [source, limit, includePrivate, projects])

  const fetchStats = useCallback(async () => {
    try {
      console.log('📊 Fetching portfolio stats...')
      
      const response = await fetch('/api/portfolio-stats')
      
      if (!response.ok) {
        throw new Error(`Stats API error: ${response.status}`)
      }

      const statsData = await response.json()
      
      // Ensure we have proper PortfolioStats structure
      const formattedStats: PortfolioStats = {
        totalProjects: statsData.totalProjects || 0,
        totalStars: statsData.totalStars || 0,
        liveProjects: statsData.liveProjects || 0,
        totalForks: statsData.totalForks || 0,
        topLanguages: statsData.topLanguages || [],
        recentActivity: {
          activeProjects: statsData.recentActivity?.activeProjects || 0,
          lastUpdated: statsData.recentActivity?.lastUpdated || new Date().toISOString()
        }
      }
      
      setStats(formattedStats)
      console.log('✅ Portfolio stats updated:', formattedStats)
      
      return formattedStats
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats'
      console.error('❌ Error fetching stats:', errorMessage)
      
      // Set fallback stats on error
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
      return fallbackStats
    }
  }, [projects])

  const refetch = useCallback(async () => {
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      // Fetch projects and stats in parallel
      const [fetchedProjects] = await Promise.all([
        fetchProjects(),
        fetchStats()
      ])

      console.log('✅ Portfolio data refreshed successfully')
      
    } catch (err) {
      console.error('❌ Error during refetch:', err)
    } finally {
      setLoading(false)
    }
  }, [loading, fetchProjects, fetchStats])

  // Initial data fetch
  useEffect(() => {
    if (autoFetch && (projects.length === 0 || shouldRefresh())) {
      refetch()
    } else if (projects.length > 0) {
      // Update stats based on existing projects
      fetchStats()
      setLoading(false)
    }
  }, [autoFetch, shouldRefresh, refetch, fetchStats, projects.length])

  // Auto-refresh functionality
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

  // Refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && shouldRefresh()) {
        console.log('🔄 Page visible - refreshing portfolio data...')
        refetch()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [shouldRefresh, refetch])

  return {
    projects,
    stats,
    loading,
    error,
    refetch
  }
}

// Enhanced version with more options
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

  // Apply filters and sorting
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
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term) ||
        project.techStack?.some(tech => tech.toLowerCase().includes(term)) ||
        project.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
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
    allProjects: baseResult.projects, // Access to unfiltered projects
    filteredCount: filteredProjects.length,
    totalCount: baseResult.projects.length
  }
}

// Utility hooks for specific use cases
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

// Export the main hook as default
export default usePortfolioData