// hooks/usePortfolioData.ts
'use client'

import { useState, useEffect, useCallback } from 'react'

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

  const fetchPortfolioData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Fetching portfolio data...')

      // Fetch all data in parallel with better error handling
      const [projectsRes, statsRes] = await Promise.allSettled([
        fetch('/api/projects').then(res => {
          if (!res.ok) {
            throw new Error(`Projects API error: ${res.status}`)
          }
          return res.json()
        }),
        fetch('/api/portfolio-stats').then(res => {
          if (!res.ok) {
            throw new Error(`Stats API error: ${res.status}`)
          }
          return res.json()
        })
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
        
        // Sort projects: featured first, then by order, then by stars
        projectsData.sort((a: EnhancedProject, b: EnhancedProject) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          
          if (a.order !== b.order) return a.order - b.order
          
          const starsA = a.github?.stars || 0
          const starsB = b.github?.stars || 0
          return starsB - starsA
        })
        
        setProjects(projectsData)
        console.log('✅ Projects loaded:', projectsData.length)
      } else if (projectsRes.status === 'rejected') {
        console.warn('⚠️ Projects API failed:', projectsRes.reason)
      }

      // Process stats
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value)
        console.log('✅ Portfolio stats loaded')
      } else if (statsRes.status === 'rejected') {
        console.warn('⚠️ Stats API failed:', statsRes.reason)
      }

    } catch (err) {
      console.error('❌ Portfolio data error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load portfolio data')
      
      // Set comprehensive fallback data so the site still works
      setProjects([
        {
          id: 'portfolio',
          slug: 'portfolio-website',
          name: 'Portfolio Website',
          title: 'Portfolio Website',
          description: 'Modern 3D portfolio website built with Next.js, Three.js, and Framer Motion',
          category: 'fullstack',
          status: 'completed',
          featured: true,
          order: 1,
          github: {
            url: 'https://github.com/sippinwindex',
            stars: 25,
            forks: 8,
            language: 'TypeScript',
            topics: ['react', 'nextjs', 'portfolio'],
            lastUpdated: new Date().toISOString()
          },
          vercel: {
            deploymentStatus: 'ready',
            liveUrl: 'https://juanfernandez.dev',
            isLive: true,
            buildStatus: 'success'
          },
          metadata: {
            images: ['/projects/portfolio.jpg'],
            tags: ['React', 'Next.js', 'TypeScript', 'Three.js', 'Framer Motion'],
            highlights: ['3D Animations', 'Real-time GitHub Integration', 'Responsive Design'],
            liveUrl: 'https://juanfernandez.dev'
          },
          techStack: ['Next.js', 'React', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
          lastActivity: new Date().toISOString(),
          deploymentScore: 95,
          // Legacy fields
          githubUrl: 'https://github.com/sippinwindex',
          liveUrl: 'https://juanfernandez.dev',
          image: '/projects/portfolio.jpg',
          tags: ['React', 'Next.js', 'TypeScript']
        },
        {
          id: 'ecommerce-app',
          slug: 'ecommerce-platform',
          name: 'E-commerce Platform',
          title: 'E-commerce Platform',
          description: 'Full-stack e-commerce platform with payment integration and admin dashboard',
          category: 'fullstack',
          status: 'completed',
          featured: true,
          order: 2,
          github: {
            url: 'https://github.com/sippinwindex/ecommerce',
            stars: 42,
            forks: 15,
            language: 'JavaScript',
            topics: ['ecommerce', 'react', 'nodejs'],
            lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          vercel: {
            deploymentStatus: 'ready',
            liveUrl: 'https://ecommerce-demo.vercel.app',
            isLive: true,
            buildStatus: 'success'
          },
          metadata: {
            images: ['/projects/ecommerce.jpg'],
            tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            highlights: ['Payment Integration', 'Admin Dashboard', 'Real-time Updates'],
            liveUrl: 'https://ecommerce-demo.vercel.app'
          },
          techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
          lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          deploymentScore: 88,
          // Legacy fields
          githubUrl: 'https://github.com/sippinwindex/ecommerce',
          liveUrl: 'https://ecommerce-demo.vercel.app',
          image: '/projects/ecommerce.jpg',
          tags: ['React', 'Node.js', 'MongoDB']
        }
      ])

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
  }, [])

  // Manual refetch function
  const refetch = useCallback(() => {
    console.log('🔄 Manual refetch triggered')
    fetchPortfolioData()
  }, [fetchPortfolioData])

  // Initial data fetch
  useEffect(() => {
    fetchPortfolioData()
  }, [fetchPortfolioData])

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh triggered')
      fetchPortfolioData()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [fetchPortfolioData])

  // Derived data - pre-computed for better performance
  const featuredProjects = projects.filter(project => project.featured)
  const liveProjects = projects.filter(project => 
    project.liveUrl || project.vercel?.isLive || project.metadata?.liveUrl
  )

  // Additional utility functions
  const getProjectsByCategory = useCallback((category: EnhancedProject['category']) => {
    return projects.filter(project => project.category === category)
  }, [projects])

  const getProjectsByStatus = useCallback((status: EnhancedProject['status']) => {
    return projects.filter(project => project.status === status)
  }, [projects])

  return {
    // Core data
    projects,
    stats,
    
    // Derived data
    featuredProjects,
    liveProjects,
    
    // State
    loading,
    error,
    
    // Actions
    refetch,
    
    // Utility functions
    getProjectsByCategory,
    getProjectsByStatus,
    
    // Additional computed values
    totalStars: projects.reduce((total, project) => total + (project.github?.stars || 0), 0),
    totalForks: projects.reduce((total, project) => total + (project.github?.forks || 0), 0),
    lastUpdated: new Date().toISOString()
  }
}

export default usePortfolioData