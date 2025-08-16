// hooks/usePortfolioData.ts
'use client'

import { useState, useEffect } from 'react'
import type { PortfolioProject, PortfolioStats, UsePortfolioDataReturn } from '@/types/portfolio'

const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    title: 'Portfolio Website',
    description: 'Modern 3D portfolio with live GitHub integration, interactive animations, and cutting-edge web technologies',
    techStack: ['Next.js', 'Three.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    featured: true,
    github: {
      stars: 25,
      forks: 8,
      url: 'https://github.com/sippinwindex'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juanfernandez.dev'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: 'https://juanfernandez.dev'
  },
  {
    id: 'synthwave-runner',
    name: 'Synthwave Runner',
    title: 'Synthwave Runner',
    description: 'Professional endless runner game with synthwave aesthetics, built with modern web technologies',
    techStack: ['React', 'TypeScript', 'Framer Motion', 'HTML5 Canvas'],
    featured: true,
    github: {
      stars: 15,
      forks: 4,
      url: 'https://github.com/sippinwindex'
    },
    vercel: {
      isLive: true,
      liveUrl: '/dino-game'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: '/dino-game'
  },
  {
    id: 'github-integration',
    name: 'GitHub Integration',
    title: 'GitHub Integration', 
    description: 'Real-time GitHub API integration with caching and live project data synchronization',
    techStack: ['Next.js', 'GitHub API', 'TypeScript', 'SWR'],
    featured: true,
    github: {
      stars: 12,
      forks: 2,
      url: 'https://github.com/sippinwindex'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juanfernandez.dev'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: 'https://juanfernandez.dev'
  }
]

const FALLBACK_STATS: PortfolioStats = {
  totalProjects: 25,
  totalStars: 150,
  liveProjects: 12,
  recentActivity: {
    activeProjects: 8
  }
}

export default function usePortfolioData(): UsePortfolioDataReturn {
  const [projects, setProjects] = useState<PortfolioProject[]>(FALLBACK_PROJECTS)
  const [stats, setStats] = useState<PortfolioStats | null>(FALLBACK_STATS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolioData = async () => {
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
          return data
        }).catch(err => {
          console.warn('⚠️ Failed to fetch projects, using fallback')
          return { projects: FALLBACK_PROJECTS }
        })

        // Fetch stats with timeout and retry logic
        const statsPromise = fetch('/api/github/stats', {
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }).then(async res => {
          if (!res.ok) {
            console.warn(`⚠️ Stats API returned ${res.status}, using fallback`)
            return { stats: FALLBACK_STATS }
          }
          const data = await res.json()
          return data
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
    }

    fetchPortfolioData()
  }, [])

  return {
    projects,
    stats,
    loading,
    error
  }
}