// hooks/usePortfolioData.ts
import { useState, useEffect, useCallback } from 'react'

interface GitHubStats {
  stars: number
  forks: number
  url: string
  lastUpdated: string
  language?: string
  topics?: string[]
}

interface VercelStats {
  isLive: boolean
  liveUrl?: string
  deploymentStatus?: 'ready' | 'building' | 'error'
}

interface Project {
  id: string
  name: string
  description: string
  githubUrl: string
  liveUrl?: string
  techStack: string[]
  tags?: string[]
  featured: boolean
  github?: GitHubStats
  vercel?: VercelStats
  slug?: string
}

// For 3D components compatibility
interface EnhancedProject extends Project {
  title?: string // Optional title that can be derived from name
}

interface PortfolioStats {
  totalProjects: number
  totalStars: number
  totalForks: number
  liveProjects: number
  recentActivity: {
    commitsLastMonth: number
    activeProjects: number
    languageBreakdown: Record<string, number>
    topTopics: string[]
  }
  topLanguages: Array<{
    name: string
    percentage: number
    count: number
  }>
}

interface UsePortfolioDataReturn {
  projects: EnhancedProject[]
  stats: PortfolioStats | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const usePortfolioData = (): UsePortfolioDataReturn => {
  const [projects, setProjects] = useState<EnhancedProject[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch projects and stats in parallel
      const [projectsResponse, statsResponse] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/portfolio-stats')
      ])

      if (!projectsResponse.ok) {
        throw new Error(`Projects API error: ${projectsResponse.status}`)
      }

      if (!statsResponse.ok) {
        throw new Error(`Stats API error: ${statsResponse.status}`)
      }

      const [projectsData, statsData] = await Promise.all([
        projectsResponse.json(),
        statsResponse.json()
      ])

      // Transform and enhance project data
      const enhancedProjects: EnhancedProject[] = projectsData.map((project: any) => ({
        id: project.id?.toString() || project.name,
        name: project.name,
        title: project.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), // Add title for 3D components
        description: project.description || 'No description available',
        githubUrl: project.html_url || project.githubUrl || '',
        liveUrl: project.homepage || project.liveUrl || '',
        techStack: project.topics || project.techStack || [],
        tags: project.topics || project.tags || [],
        featured: project.featured || false,
        github: {
          stars: project.stargazers_count || 0,
          forks: project.forks_count || 0,
          url: project.html_url || '',
          lastUpdated: project.updated_at || project.pushed_at || new Date().toISOString(),
          language: project.language,
          topics: project.topics || []
        },
        vercel: {
          isLive: !!(project.homepage || project.liveUrl),
          liveUrl: project.homepage || project.liveUrl,
          deploymentStatus: project.homepage ? 'ready' : undefined
        },
        slug: project.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || project.id
      }))

      // Sort projects: featured first, then by stars, then by last updated
      enhancedProjects.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        
        const starsA = a.github?.stars || 0
        const starsB = b.github?.stars || 0
        if (starsA !== starsB) return starsB - starsA
        
        const dateA = new Date(a.github?.lastUpdated || 0).getTime()
        const dateB = new Date(b.github?.lastUpdated || 0).getTime()
        return dateB - dateA
      })

      setProjects(enhancedProjects)
      setStats(statsData)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio data'
      setError(errorMessage)
      console.error('Portfolio data fetch error:', err)

      // Set fallback data on error
      setProjects([
        {
          id: 'portfolio',
          name: 'Portfolio Website',
          title: 'Portfolio Website',
          description: 'Modern 3D portfolio website built with Next.js, Three.js, and Framer Motion',
          githubUrl: 'https://github.com/sippinwindex',
          liveUrl: 'https://juanfernandez.dev',
          techStack: ['Next.js', 'React', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
          tags: ['react', 'nextjs', 'typescript', 'threejs'],
          featured: true,
          github: {
            stars: 25,
            forks: 8,
            url: 'https://github.com/sippinwindex',
            lastUpdated: new Date().toISOString(),
            language: 'TypeScript',
            topics: ['react', 'nextjs', 'portfolio']
          },
          vercel: {
            isLive: true,
            liveUrl: 'https://juanfernandez.dev',
            deploymentStatus: 'ready'
          },
          slug: 'portfolio-website'
        }
      ])

      setStats({
        totalProjects: 25,
        totalStars: 150,
        totalForks: 45,
        liveProjects: 12,
        recentActivity: {
          commitsLastMonth: 85,
          activeProjects: 8,
          languageBreakdown: {
            'TypeScript': 12,
            'JavaScript': 8,
            'Python': 3,
            'CSS': 2
          },
          topTopics: ['react', 'nextjs', 'typescript', 'tailwindcss']
        },
        topLanguages: [
          { name: 'TypeScript', percentage: 48, count: 12 },
          { name: 'JavaScript', percentage: 32, count: 8 },
          { name: 'Python', percentage: 12, count: 3 },
          { name: 'CSS', percentage: 8, count: 2 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [fetchData])

  return {
    projects,
    stats,
    loading,
    error,
    refetch
  }
}

export default usePortfolioData