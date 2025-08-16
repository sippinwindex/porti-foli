import { useState, useEffect, useCallback } from 'react'

export interface VercelProject {
  id: string
  name: string
  accountId: string
  createdAt: number
  framework: string | null
  devCommand: string | null
  buildCommand: string | null
  outputDirectory: string | null
  rootDirectory: string | null
  directoryListing: boolean
  nodeVersion: string
  targets: {
    production?: {
      id: string
      url: string
      alias: string[]
    }
  }
  latestDeployments: VercelDeployment[]
  link?: {
    type: 'github'
    repo: string
    repoId: number
    org?: string
    gitCredentialId?: string
  }
}

export interface VercelDeployment {
  uid: string
  name: string
  url: string
  created: number
  source?: 'git' | 'cli' | 'import'
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  readyState: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  type: 'LAMBDAS'
  creator: {
    uid: string
    username: string
  }
  inspectorUrl: string | null
  meta: {
    githubCommitRef?: string
    githubCommitSha?: string
    githubCommitMessage?: string
    githubCommitAuthorName?: string
    githubOrg?: string
    githubRepo?: string
  }
  target: 'production' | 'preview'
  aliasAssigned: boolean
  aliasError?: any
  aliasFinal?: string
  buildingAt?: number
  readyAt?: number
}

export interface VercelStats {
  totalProjects: number
  totalDeployments: number
  successfulDeployments: number
  failedDeployments: number
  buildingDeployments: number
  averageBuildTime: number
  deploymentFrequency: {
    thisWeek: number
    thisMonth: number
    last30Days: number[]
  }
  frameworkBreakdown: Record<string, number>
  recentActivity: {
    lastDeployment: string
    activeBuilds: number
    recentDeployments: VercelDeployment[]
  }
}

interface UseVercelDataOptions {
  refreshInterval?: number
  autoRefresh?: boolean
  includePreviews?: boolean
  limit?: number
}

interface UseVercelDataReturn {
  projects: VercelProject[]
  deployments: VercelDeployment[]
  stats: VercelStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  getProjectDeployments: (projectId: string) => Promise<VercelDeployment[]>
  lastUpdated: Date | null
}

export const useVercelData = (
  options: UseVercelDataOptions = {}
): UseVercelDataReturn => {
  const {
    refreshInterval = 300000, // 5 minutes default
    autoRefresh = false,
    includePreviews = true,
    limit = 50
  } = options

  const [projects, setProjects] = useState<VercelProject[]>([])
  const [deployments, setDeployments] = useState<VercelDeployment[]>([])
  const [stats, setStats] = useState<VercelStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchVercelData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Fetching Vercel data...')

      // Build query parameters
      const params = new URLSearchParams({
        limit: limit.toString(),
        includePreviews: includePreviews.toString()
      })

      // Fetch projects and deployments in parallel
      const [projectsRes, deploymentsRes] = await Promise.allSettled([
        fetch(`/api/vercel/projects?${params}`),
        fetch(`/api/vercel/deployments?${params}`)
      ])

      let projectsData: VercelProject[] = []
      let deploymentsData: VercelDeployment[] = []

      // Handle projects response
      if (projectsRes.status === 'fulfilled') {
        if (!projectsRes.value.ok) {
          throw new Error(`Vercel projects API error: ${projectsRes.value.status}`)
        }
        const projectsJson = await projectsRes.value.json()
        projectsData = projectsJson.projects || []
      } else {
        console.warn('⚠️ Failed to fetch Vercel projects:', projectsRes.reason)
      }

      // Handle deployments response
      if (deploymentsRes.status === 'fulfilled') {
        if (!deploymentsRes.value.ok) {
          console.warn('⚠️ Vercel deployments API error:', deploymentsRes.value.status)
        } else {
          const deploymentsJson = await deploymentsRes.value.json()
          deploymentsData = deploymentsJson.deployments || []
        }
      } else {
        console.warn('⚠️ Failed to fetch Vercel deployments:', deploymentsRes.reason)
      }

      // Calculate stats from the fetched data
      const calculatedStats = calculateVercelStats(projectsData, deploymentsData)

      setProjects(projectsData)
      setDeployments(deploymentsData)
      setStats(calculatedStats)
      setLastUpdated(new Date())

      console.log('✅ Vercel data loaded successfully', {
        projects: projectsData.length,
        deployments: deploymentsData.length,
        totalProjects: calculatedStats.totalProjects
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Vercel data'
      console.error('❌ Vercel data error:', errorMessage)
      setError(errorMessage)
      
      // Set fallback empty data on error
      setProjects([])
      setDeployments([])
      setStats({
        totalProjects: 0,
        totalDeployments: 0,
        successfulDeployments: 0,
        failedDeployments: 0,
        buildingDeployments: 0,
        averageBuildTime: 0,
        deploymentFrequency: { thisWeek: 0, thisMonth: 0, last30Days: [] },
        frameworkBreakdown: {},
        recentActivity: {
          lastDeployment: new Date().toISOString(),
          activeBuilds: 0,
          recentDeployments: []
        }
      })
    } finally {
      setLoading(false)
    }
  }, [limit, includePreviews])

  const getProjectDeployments = useCallback(async (projectId: string): Promise<VercelDeployment[]> => {
    try {
      console.log(`🔄 Fetching deployments for project: ${projectId}`)
      
      const response = await fetch(`/api/vercel/projects/${projectId}/deployments`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch deployments for project ${projectId}: ${response.status}`)
      }

      const data = await response.json()
      return data.deployments || []
    } catch (err) {
      console.error(`❌ Error fetching deployments for project ${projectId}:`, err)
      return []
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchVercelData()
  }, [fetchVercelData])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing Vercel data...')
      fetchVercelData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchVercelData])

  // Refresh when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && autoRefresh) {
        console.log('🔄 Page visible - refreshing Vercel data...')
        fetchVercelData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [autoRefresh, fetchVercelData])

  return {
    projects,
    deployments,
    stats,
    loading,
    error,
    refetch: fetchVercelData,
    getProjectDeployments,
    lastUpdated,
  }
}

// Helper function to calculate comprehensive Vercel stats
const calculateVercelStats = (
  projects: VercelProject[], 
  deployments: VercelDeployment[]
): VercelStats => {
  const now = Date.now()
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000)

  // Filter deployments by time
  const recentDeployments = deployments.filter(d => d.created >= oneWeekAgo)
  const monthlyDeployments = deployments.filter(d => d.created >= oneMonthAgo)
  
  // Count deployment states
  const successfulDeployments = deployments.filter(d => d.state === 'READY').length
  const failedDeployments = deployments.filter(d => d.state === 'ERROR').length
  const buildingDeployments = deployments.filter(d => 
    ['BUILDING', 'INITIALIZING', 'QUEUED'].includes(d.state)
  ).length

  // Calculate average build time (for completed deployments)
  const completedDeployments = deployments.filter(d => 
    d.readyAt && d.buildingAt && d.state === 'READY'
  )
  const averageBuildTime = completedDeployments.length > 0
    ? completedDeployments.reduce((sum, d) => 
        sum + (d.readyAt! - d.buildingAt!), 0
      ) / completedDeployments.length / 1000 // Convert to seconds
    : 0

  // Framework breakdown
  const frameworkBreakdown: Record<string, number> = {}
  projects.forEach(project => {
    const framework = project.framework || 'Unknown'
    frameworkBreakdown[framework] = (frameworkBreakdown[framework] || 0) + 1
  })

  // Daily deployment frequency for last 30 days
  const last30Days: number[] = []
  for (let i = 29; i >= 0; i--) {
    const dayStart = now - (i * 24 * 60 * 60 * 1000)
    const dayEnd = dayStart + (24 * 60 * 60 * 1000)
    const dayDeployments = deployments.filter(d => 
      d.created >= dayStart && d.created < dayEnd
    ).length
    last30Days.push(dayDeployments)
  }

  // Recent activity
  const sortedDeployments = [...deployments].sort((a, b) => b.created - a.created)
  const lastDeployment = sortedDeployments[0]?.created 
    ? new Date(sortedDeployments[0].created).toISOString()
    : new Date().toISOString()

  return {
    totalProjects: projects.length,
    totalDeployments: deployments.length,
    successfulDeployments,
    failedDeployments,
    buildingDeployments,
    averageBuildTime: Math.round(averageBuildTime),
    deploymentFrequency: {
      thisWeek: recentDeployments.length,
      thisMonth: monthlyDeployments.length,
      last30Days
    },
    frameworkBreakdown,
    recentActivity: {
      lastDeployment,
      activeBuilds: buildingDeployments,
      recentDeployments: sortedDeployments.slice(0, 10)
    }
  }
}

// Helper function to get deployment status color
export const getDeploymentStatusColor = (state: VercelDeployment['state']): string => {
  switch (state) {
    case 'READY':
      return 'green'
    case 'ERROR':
    case 'CANCELED':
      return 'red'
    case 'BUILDING':
    case 'INITIALIZING':
    case 'QUEUED':
      return 'yellow'
    default:
      return 'gray'
  }
}

// Helper function to format build time
export const formatBuildTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.round((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }
}

export default useVercelData