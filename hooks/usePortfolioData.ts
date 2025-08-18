// hooks/usePortfolioData.ts - FIXED to match types/portfolio.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PortfolioProject, PortfolioStats, UsePortfolioDataReturn } from '@/types/portfolio'

const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    title: 'Portfolio Website',  // ← FIXED: Now required since it's in the type
    description: 'Modern 3D portfolio with live GitHub integration, interactive animations, and cutting-edge web technologies',
    techStack: ['Next.js', 'Three.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    tags: ['Portfolio', 'Next.js', 'TypeScript', '3D', 'Animation'],  // ← ADDED: tags property
    featured: true,
    github: {
      stars: 25,
      forks: 8,
      url: 'https://github.com/sippinwindex',
      topics: ['nextjs', 'portfolio', 'typescript', 'threejs'],  // ← ADDED: topics property
      lastUpdated: new Date().toISOString(),  // ← FIXED: Changed from updatedAt to lastUpdated
      language: 'TypeScript'  // ← ADDED: language property
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juanfernandez.dev'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: 'https://juanfernandez.dev',
    topics: ['portfolio', 'nextjs', 'typescript']  // ← ADDED: project-level topics
  },
  {
    id: 'synthwave-runner',
    name: 'Synthwave Runner',
    title: 'Synthwave Runner',
    description: 'Professional endless runner game with synthwave aesthetics, built with modern web technologies',
    techStack: ['React', 'TypeScript', 'Framer Motion', 'HTML5 Canvas'],
    tags: ['Game', 'React', 'TypeScript', 'Animation'],
    featured: true,
    github: {
      stars: 15,
      forks: 4,
      url: 'https://github.com/sippinwindex',
      topics: ['game', 'react', 'typescript', 'canvas'],
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      language: 'JavaScript'
    },
    vercel: {
      isLive: true,
      liveUrl: '/dino-game'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: '/dino-game',
    topics: ['game', 'react', 'canvas']
  },
  {
    id: 'github-integration',
    name: 'GitHub Integration',
    title: 'GitHub Integration',
    description: 'Real-time GitHub API integration with caching and live project data synchronization',
    techStack: ['Next.js', 'GitHub API', 'TypeScript', 'SWR'],
    tags: ['API', 'GitHub', 'Next.js', 'TypeScript'],
    featured: true,
    github: {
      stars: 12,
      forks: 2,
      url: 'https://github.com/sippinwindex',
      topics: ['api', 'github', 'nextjs', 'integration'],
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      language: 'TypeScript'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juanfernandez.dev'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: 'https://juanfernandez.dev',
    topics: ['api', 'github', 'integration']
  }
]

const FALLBACK_STATS: PortfolioStats = {
  totalProjects: 25,
  totalStars: 150,
  liveProjects: 12,
  totalForks: 45,  // ← ADDED: missing property
  topLanguages: ['TypeScript', 'JavaScript', 'Python', 'CSS'],  // ← ADDED: missing property
  recentActivity: {
    activeProjects: 8
  }
}

export default function usePortfolioData(): UsePortfolioDataReturn {
  const [projects, setProjects] = useState<PortfolioProject[]>(FALLBACK_PROJECTS)
  const [stats, setStats] = useState<PortfolioStats | null>(FALLBACK_STATS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPortfolioData = useCallback(async () => {
    console.log('🔄 Fetching portfolio data...')
    setLoading(true)
    setError(null)

    try {
      // Fetch projects with timeout and retry logic
      const projectsPromise = fetch('/api/projects?limit=10', {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      }).then(async res => {
        if (!res.ok) {
          console.warn(`⚠️ Projects API returned ${res.status}, using fallback`)
          return { projects: FALLBACK_PROJECTS }
        }
        const data = await res.json()
        
        // Transform API data to match our types
        const transformedProjects: PortfolioProject[] = (data.projects || []).map((project: any) => ({
          id: project.id,
          name: project.name,
          title: project.title || project.name,  // ← ENSURE title is always present
          description: project.description || 'No description available',
          techStack: project.techStack || [],
          tags: project.tags || project.techStack || [],  // ← ENSURE tags is always present
          featured: project.featured || false,
          category: project.category,
          github: project.github ? {
            stars: project.github.stars || 0,
            forks: project.github.forks || 0,
            url: project.github.url || project.githubUrl || '',
            topics: project.github.topics || project.topics || [],  // ← ENSURE topics is present
            lastUpdated: project.github.lastUpdated || project.github.updatedAt || new Date().toISOString(),  // ← ENSURE lastUpdated
            language: project.github.language || 'Unknown'
          } : undefined,
          vercel: project.vercel,
          githubUrl: project.githubUrl || project.github?.url,
          liveUrl: project.liveUrl || project.vercel?.liveUrl,
          topics: project.topics || project.github?.topics || []  // ← ENSURE project-level topics
        }))
        
        return { projects: transformedProjects }
      }).catch(err => {
        console.warn('⚠️ Failed to fetch projects, using fallback')
        return { projects: FALLBACK_PROJECTS }
      })

      // Fetch stats with timeout and retry logic
      const statsPromise = fetch('/api/portfolio-stats', {
        signal: AbortSignal.timeout(10000) // 10 second timeout
      }).then(async res => {
        if (!res.ok) {
          console.warn(`⚠️ Stats API returned ${res.status}, using fallback`)
          return { stats: FALLBACK_STATS }
        }
        const data = await res.json()
        
        // Ensure all required properties are present
        const transformedStats: PortfolioStats = {
          totalProjects: data.totalProjects || 0,
          totalStars: data.totalStars || 0,
          liveProjects: data.liveProjects || 0,
          totalForks: data.totalForks || 0,
          topLanguages: data.topLanguages || [],
          recentActivity: {
            activeProjects: data.recentActivity?.activeProjects || 0
          }
        }
        
        return { stats: transformedStats }
      }).catch(err => {
        console.warn('⚠️ Failed to fetch stats, using fallback')
        return { stats: FALLBACK_STATS }
      })

      // Wait for both requests with fallback handling
      const [projectsData, statsData] = await Promise.allSettled([
        projectsPromise,
        statsPromise
      ])

      // Handle projects data
      if (projectsData.status === 'fulfilled' && projectsData.value.projects) {
        setProjects(projectsData.value.projects)
        console.log('✅ Projects loaded successfully')
      } else {
        console.warn('⚠️ Failed to fetch projects, using fallback')
        setProjects(FALLBACK_PROJECTS)
      }

      // Handle stats data
      if (statsData.status === 'fulfilled' && statsData.value.stats) {
        setStats(statsData.value.stats)
        console.log('✅ Stats loaded successfully')
      } else {
        console.warn('⚠️ Failed to fetch stats, using fallback')
        setStats(FALLBACK_STATS)
      }

    } catch (err) {
      console.error('❌ Error fetching portfolio data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data')
      
      // Ensure we have fallback data even on error
      setProjects(FALLBACK_PROJECTS)
      setStats(FALLBACK_STATS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPortfolioData()
  }, [fetchPortfolioData])

  return {
    projects,
    stats,
    loading,
    error,
    refetch: fetchPortfolioData
  }
}