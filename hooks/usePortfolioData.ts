import { useState, useEffect, useCallback } from 'react'

// Types
export interface EnhancedProject {
  id: string
  name: string
  title: string // alias for name
  description: string
  category: string
  featured: boolean
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
    commitsLastMonth: number
    languageBreakdown: Record<string, number>
    topTopics: string[]
  }
  topLanguages: Array<{
    name: string
    percentage: number
    count: number
  }>
  growthMetrics?: {
    starsThisMonth: number
    forksThisMonth: number
    deploymentsThisMonth: number
    newProjectsThisMonth: number
  }
}

// FIXED: Add stats to the return type interface
export interface UsePortfolioDataReturn {
  projects: EnhancedProject[]
  stats: PortfolioStats | null  // ← This was missing!
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  lastUpdated: Date | null
}

export function usePortfolioData(): UsePortfolioDataReturn {
  const [projects, setProjects] = useState<EnhancedProject[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

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
          image: project.metadata?.images?.[0],
          tags: project.metadata?.tags || project.techStack,
        }))
        setProjects(projectsData)
        console.log('✅ Projects loaded:', projectsData.length)
      } else {
        console.warn('⚠️ Failed to fetch projects, using fallback')
        setProjects(getFallbackProjects())
      }

      // Process stats
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value)
        console.log('✅ Stats loaded successfully')
      } else {
        console.warn('⚠️ Failed to fetch stats, using fallback')
        setStats(getFallbackStats())
      }

      setLastUpdated(new Date())

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio data'
      console.error('❌ Portfolio data error:', errorMessage)
      setError(errorMessage)
      
      // Set fallback data on error
      setProjects(getFallbackProjects())
      setStats(getFallbackStats())
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchPortfolioData()
  }, [fetchPortfolioData])

  return {
    projects,
    stats,
    loading,
    error,
    refetch: fetchPortfolioData,
    lastUpdated,
  }
}

// Fallback data for when APIs are not available
function getFallbackProjects(): EnhancedProject[] {
  return [
    {
      id: 'portfolio-3d',
      name: 'Interactive 3D Portfolio',
      title: 'Interactive 3D Portfolio',
      description: 'A cutting-edge portfolio website with 3D animations, GitHub integration, and real-time deployment status.',
      category: 'Featured',
      featured: true,
      github: {
        url: 'https://github.com/sippinwindex/porti-foli',
        stars: 0,
        forks: 0,
        language: 'TypeScript',
        topics: ['nextjs', 'threejs', 'portfolio', '3d'],
        lastUpdated: new Date().toISOString(),
      },
      vercel: {
        deploymentStatus: 'success',
        liveUrl: 'https://juan-fernandez.dev',
        isLive: true,
        buildStatus: 'success',
      },
      metadata: {
        images: ['/images/projects/portfolio.jpg'],
        tags: ['React', 'Next.js', 'Three.js', 'TypeScript'],
        highlights: ['3D Animations', 'GitHub Integration', 'Real-time Updates'],
        liveUrl: 'https://juan-fernandez.dev',
      },
      techStack: ['React', 'Next.js', 'Three.js', 'TypeScript', 'Tailwind CSS'],
      lastActivity: new Date().toISOString(),
      deploymentScore: 95,
      githubUrl: 'https://github.com/sippinwindex/porti-foli',
      liveUrl: 'https://juan-fernandez.dev',
      image: '/images/projects/portfolio.jpg',
      tags: ['React', 'Next.js', 'Three.js'],
    },
    {
      id: 'ecommerce-platform',
      name: 'E-commerce Platform',
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment processing, inventory management, and analytics dashboard.',
      category: 'Web Development',
      featured: true,
      github: {
        url: 'https://github.com/sippinwindex/ecommerce',
        stars: 12,
        forks: 3,
        language: 'JavaScript',
        topics: ['ecommerce', 'nodejs', 'react'],
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
      },
      vercel: {
        deploymentStatus: 'success',
        liveUrl: 'https://demo-ecommerce.vercel.app',
        isLive: true,
        buildStatus: 'success',
      },
      metadata: {
        images: ['/images/projects/ecommerce.jpg'],
        tags: ['React', 'Node.js', 'PostgreSQL'],
        highlights: ['Payment Integration', 'Admin Dashboard', 'Real-time Analytics'],
      },
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
      lastActivity: new Date(Date.now() - 86400000).toISOString(),
      deploymentScore: 88,
    },
    {
      id: 'ai-chatbot',
      name: 'AI Chat Assistant',
      title: 'AI Chat Assistant',
      description: 'Intelligent chatbot with natural language processing, context awareness, and multi-language support.',
      category: 'AI/ML',
      featured: false,
      github: {
        url: 'https://github.com/sippinwindex/ai-chat',
        stars: 8,
        forks: 2,
        language: 'Python',
        topics: ['ai', 'chatbot', 'nlp'],
        lastUpdated: new Date(Date.now() - 172800000).toISOString(),
      },
      vercel: {
        deploymentStatus: 'building',
        isLive: false,
        buildStatus: 'building',
      },
      metadata: {
        images: ['/images/projects/ai-chat.jpg'],
        tags: ['Python', 'TensorFlow', 'React'],
        highlights: ['NLP', 'Context Awareness', 'Multi-language'],
      },
      techStack: ['Python', 'TensorFlow', 'React', 'FastAPI'],
      lastActivity: new Date(Date.now() - 172800000).toISOString(),
      deploymentScore: 76,
    }
  ]
}

function getFallbackStats(): PortfolioStats {
  return {
    totalProjects: 25,
    featuredProjects: 6,
    liveProjects: 18,
    totalStars: 150,
    totalForks: 42,
    languageStats: {
      'TypeScript': 12,
      'JavaScript': 8,
      'Python': 3,
      'Go': 2,
    },
    categoryStats: {
      'Web Development': 15,
      'Mobile Apps': 5,
      'AI/ML': 3,
      'DevOps': 2,
    },
    deploymentStats: {
      successful: 22,
      failed: 2,
      building: 1,
      pending: 0,
    },
    recentActivity: {
      lastCommit: new Date().toISOString(),
      lastDeployment: new Date().toISOString(),
      activeProjects: 8,
      commitsLastMonth: 85,
      languageBreakdown: {
        'TypeScript': 45,
        'JavaScript': 30,
        'Python': 15,
        'CSS': 10,
      },
      topTopics: ['React', 'Next.js', 'Node.js', 'TypeScript', 'AI'],
    },
    topLanguages: [
      { name: 'TypeScript', percentage: 45, count: 12 },
      { name: 'JavaScript', percentage: 30, count: 8 },
      { name: 'Python', percentage: 15, count: 3 },
      { name: 'Go', percentage: 10, count: 2 },
    ],
    growthMetrics: {
      starsThisMonth: 12,
      forksThisMonth: 5,
      deploymentsThisMonth: 8,
      newProjectsThisMonth: 2,
    },
  }
}

export default usePortfolioData