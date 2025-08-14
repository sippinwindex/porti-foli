// hooks/usePortfolioData.ts
'use client'

import { useState, useEffect } from 'react'

export interface EnhancedProject {
  id: string
  slug: string
  name: string
  title?: string // For backward compatibility
  description: string
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other'
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  featured: boolean
  order: number
  github?: {
    url: string
    stars: number
    forks: number
    language: string | null
    topics: string[]
    lastUpdated: string
  }
  vercel?: {
    deploymentStatus: any
    liveUrl?: string
    isLive: boolean
    buildStatus: 'success' | 'error' | 'building' | 'pending' | 'unknown'
  }
  metadata: {
    images: string[]
    tags: string[]
    highlights: string[]
    liveUrl?: string
  }
  techStack: string[]
  lastActivity: string
  deploymentScore: number
  // Legacy fields for compatibility
  githubUrl?: string
  liveUrl?: string
  image?: string
  tags?: string[]
}

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
  }
}

export function usePortfolioData() {
  const [projects, setProjects] = useState<EnhancedProject[]>([])
  const [stats, setStats] = useState<PortfolioStats>({
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
    },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔄 Fetching portfolio data...')

        // Fetch all data in parallel
        const [projectsRes, statsRes] = await Promise.allSettled([
          fetch('/api/projects').then(res => res.ok ? res.json() : { projects: [] }),
          fetch('/api/portfolio-stats').then(res => res.ok ? res.json() : null)
        ])

        // Process projects
        if (projectsRes.status === 'fulfilled' && projectsRes.value?.projects) {
          const projectsData = projectsRes.value.projects.map((project: any) => ({
            ...project,
            // Add legacy fields for compatibility
            title: project.name,
            githubUrl: project.github?.url,
            liveUrl: project.metadata?.liveUrl || project.vercel?.liveUrl,
            image: project.metadata?.images?.[0] || '/projects/placeholder.jpg',
            tags: project.techStack || project.metadata?.tags || []
          }))
          
          setProjects(projectsData)
          console.log('✅ Projects loaded:', projectsData.length)
        }

        // Process stats
        if (statsRes.status === 'fulfilled' && statsRes.value) {
          setStats(statsRes.value)
          console.log('✅ Portfolio stats loaded')
        }

      } catch (err) {
        console.error('❌ Portfolio data error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load portfolio data')
        
        // Set fallback data so the site still works
        setStats({
          totalProjects: 12,
          featuredProjects: 6,
          liveProjects: 8,
          totalStars: 150,
          totalForks: 45,
          languageStats: {
            'JavaScript': 35,
            'TypeScript': 25,
            'React': 20,
            'Python': 15,
            'Node.js': 5
          },
          categoryStats: {
            'fullstack': 5,
            'frontend': 4,
            'backend': 2,
            'mobile': 1
          },
          deploymentStats: { successful: 8, failed: 1, building: 1, pending: 2 },
          recentActivity: {
            lastCommit: new Date().toISOString(),
            lastDeployment: new Date().toISOString(),
            activeProjects: 6,
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolioData()
  }, [])

  // Derived data
  const featuredProjects = projects.filter(project => project.featured)
  const liveProjects = projects.filter(project => 
    project.liveUrl || project.vercel?.isLive || project.metadata?.liveUrl
  )

  return {
    projects,
    stats,
    featuredProjects,
    liveProjects,
    loading,
    error,
    refetch: () => window.location.reload()
  }
}

export default usePortfolioData