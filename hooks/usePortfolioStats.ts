import { useState, useEffect, useCallback } from 'react'

export interface PortfolioStats {
  totalProjects: number
  featuredProjects: number
  liveProjects: number
  totalStars: number
  totalForks: number
  languageStats: Record<string, number>
  categoryStats: Record<string, number>
  deploymentStats: {
    successful: number
    failed: number
    building: number
    pending: number
  }
  recentActivity: {
    lastCommit: string
    lastDeployment: string
    activeProjects: number
    commitsLastMonth: number
    languageBreakdown: Record<string, number>
    topTopics: string[]
  }
  topLanguages: Array<{
    name: string
    percentage: number
    count: number
  }>
  growthMetrics: {
    starsThisMonth: number
    forksThisMonth: number
    deploymentsThisMonth: number
    newProjectsThisMonth: number
  }
}

interface UsePortfolioStatsOptions {
  refreshInterval?: number
  autoRefresh?: boolean
  includePrivate?: boolean
}

interface UsePortfolioStatsReturn {
  stats: PortfolioStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  lastUpdated: Date | null
}

export const usePortfolioStats = (
  options: UsePortfolioStatsOptions = {}
): UsePortfolioStatsReturn => {
  const {
    refreshInterval = 300000, // 5 minutes default
    autoRefresh = false,
    includePrivate = false
  } = options

  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Fetching portfolio stats...')

      // Fetch stats from API with optional private repos
      const url = new URL('/api/portfolio-stats', window.location.origin)
      if (includePrivate) {
        url.searchParams.set('includePrivate', 'true')
      }

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(`Portfolio stats API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Ensure all required fields exist with defaults
      const enhancedStats: PortfolioStats = {
        totalProjects: data.totalProjects || 0,
        featuredProjects: data.featuredProjects || 0,
        liveProjects: data.liveProjects || 0,
        totalStars: data.totalStars || 0,
        totalForks: data.totalForks || 0,
        languageStats: data.languageStats || {},
        categoryStats: data.categoryStats || {},
        deploymentStats: {
          successful: data.deploymentStats?.successful || 0,
          failed: data.deploymentStats?.failed || 0,
          building: data.deploymentStats?.building || 0,
          pending: data.deploymentStats?.pending || 0,
        },
        recentActivity: {
          lastCommit: data.recentActivity?.lastCommit || new Date().toISOString(),
          lastDeployment: data.recentActivity?.lastDeployment || new Date().toISOString(),
          activeProjects: data.recentActivity?.activeProjects || 0,
          commitsLastMonth: data.recentActivity?.commitsLastMonth || 0,
          languageBreakdown: data.recentActivity?.languageBreakdown || {},
          topTopics: data.recentActivity?.topTopics || [],
        },
        topLanguages: data.topLanguages || [],
        growthMetrics: {
          starsThisMonth: data.growthMetrics?.starsThisMonth || 0,
          forksThisMonth: data.growthMetrics?.forksThisMonth || 0,
          deploymentsThisMonth: data.growthMetrics?.deploymentsThisMonth || 0,
          newProjectsThisMonth: data.growthMetrics?.newProjectsThisMonth || 0,
        },
      }

      setStats(enhancedStats)
      setLastUpdated(new Date())
      
      console.log('✅ Portfolio stats loaded successfully', {
        totalProjects: enhancedStats.totalProjects,
        totalStars: enhancedStats.totalStars,
        liveProjects: enhancedStats.liveProjects
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio stats'
      console.error('❌ Portfolio stats error:', errorMessage)
      setError(errorMessage)
      
      // Set fallback empty stats on error
      setStats({
        totalProjects: 0,
        featuredProjects: 0,
        liveProjects: 0,
        totalStars: 0,
        totalForks: 0,
        languageStats: {},
        categoryStats: {},
        deploymentStats: { successful: 0, failed: 0, building: 0, pending: 0 },
        recentActivity: {
          lastCommit: new Date().toISOString(),
          lastDeployment: new Date().toISOString(),
          activeProjects: 0,
          commitsLastMonth: 0,
          languageBreakdown: {},
          topTopics: [],
        },
        topLanguages: [],
        growthMetrics: {
          starsThisMonth: 0,
          forksThisMonth: 0,
          deploymentsThisMonth: 0,
          newProjectsThisMonth: 0,
        },
      })
    } finally {
      setLoading(false)
    }
  }, [includePrivate])

  // Initial fetch
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing portfolio stats...')
      fetchStats()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchStats])

  // Refresh when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && autoRefresh) {
        console.log('🔄 Page visible - refreshing portfolio stats...')
        fetchStats()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [autoRefresh, fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    lastUpdated,
  }
}

// Helper function to calculate percentages for language stats
export const calculateLanguagePercentages = (
  languageStats: Record<string, number>
): Array<{ name: string; percentage: number; count: number }> => {
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

// Helper function to get growth trend
export const getGrowthTrend = (
  current: number,
  previous: number
): 'up' | 'down' | 'neutral' => {
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return 'neutral'
}

export default usePortfolioStats