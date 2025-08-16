// hooks/usePortfolioData.ts
import { useState, useEffect } from 'react'

interface PortfolioProject {
  id: string
  name: string
  description: string
  githubUrl: string
  liveUrl?: string
  techStack: string[]
  tags: string[]
  featured: boolean
  github: {
    stars: number
    forks: number
    url: string
    lastUpdated: string
    language?: string
    topics: string[]
  }
  vercel?: {
    url?: string
    status?: string
    lastDeployed?: string
    isLive?: boolean
  }
  slug: string
}

interface UsePortfolioDataOptions {
  autoFetch?: boolean
  filterFeatured?: boolean
  limit?: number
}

interface UsePortfolioDataReturn {
  projects: PortfolioProject[]
  featuredProjects: PortfolioProject[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  clearError: () => void
}

export function usePortfolioData(options: UsePortfolioDataOptions = {}): UsePortfolioDataReturn {
  const { autoFetch = true, filterFeatured = false, limit } = options

  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setError(null)
      console.log('🔄 Fetching portfolio projects...')

      const response = await fetch('/api/projects')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch projects: ${response.status}`)
      }

      let projectsData = await response.json()
      
      // Ensure we have an array
      if (!Array.isArray(projectsData)) {
        console.warn('⚠️ Projects API returned non-array data, using empty array')
        projectsData = []
      }

      // Apply filters
      if (filterFeatured) {
        projectsData = projectsData.filter((p: PortfolioProject) => p.featured)
      }

      if (limit && limit > 0) {
        projectsData = projectsData.slice(0, limit)
      }

      setProjects(projectsData)
      console.log(`✅ Successfully loaded ${projectsData.length} portfolio projects`)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio projects'
      console.error('❌ Error fetching portfolio projects:', errorMessage)
      setError(errorMessage)
      
      // Fallback to sample data to prevent total failure
      setProjects([
        {
          id: 'portfolio-website',
          name: 'Portfolio Website',
          description: 'Personal portfolio website built with Next.js, TypeScript, and Framer Motion',
          githubUrl: 'https://github.com/sippinwindex/portfolio',
          liveUrl: window.location.origin,
          techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
          tags: ['web', 'portfolio', 'frontend'],
          featured: true,
          github: {
            stars: 0,
            forks: 0,
            url: 'https://github.com/sippinwindex/portfolio',
            lastUpdated: new Date().toISOString(),
            language: 'TypeScript',
            topics: ['portfolio', 'nextjs', 'typescript']
          },
          vercel: {
            url: window.location.origin,
            status: 'ready',
            isLive: true,
            lastDeployed: new Date().toISOString()
          },
          slug: 'portfolio-website'
        }
      ])
    }
  }

  const refetch = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      await fetchProjects()
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      refetch()
    }
  }, [autoFetch])

  // Derived data
  const featuredProjects = projects.filter(project => project.featured)

  return {
    projects,
    featuredProjects,
    loading,
    error,
    refetch,
    clearError
  }
}

export default usePortfolioData