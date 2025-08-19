// hooks/usePortfolioData.ts - COMPLETE FIX
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PortfolioProject, PortfolioStats, UsePortfolioDataReturn } from '@/types/portfolio'

const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    title: 'Portfolio Website', // Always provide title
    description: 'Modern 3D portfolio with live GitHub integration',
    techStack: ['Next.js', 'Three.js', 'TypeScript', 'Framer Motion'],
    tags: ['Portfolio', 'Next.js', 'TypeScript', '3D'],
    featured: true,
    github: {
      stars: 25,
      forks: 8,
      url: 'https://github.com/sippinwindex',
      topics: ['nextjs', 'portfolio', 'typescript'],
      lastUpdated: new Date().toISOString(),
      language: 'TypeScript'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juanfernandez.dev'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: 'https://juanfernandez.dev',
    topics: ['portfolio', 'nextjs', 'typescript']
  }
]

const FALLBACK_STATS: PortfolioStats = {
  totalProjects: 25,
  totalStars: 150,
  liveProjects: 12,
  totalForks: 45,
  topLanguages: ['TypeScript', 'JavaScript', 'Python'],
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
      // Fetch projects
      const projectsPromise = fetch('/api/projects?limit=10')
        .then(async res => {
          if (!res.ok) {
            console.warn(`⚠️ Projects API returned ${res.status}`)
            return { success: false, projects: FALLBACK_PROJECTS }
          }
          return res.json()
        })
        .catch(err => {
          console.warn('⚠️ Failed to fetch projects:', err)
          return { success: false, projects: FALLBACK_PROJECTS }
        })

      // Fetch stats  
      const statsPromise = fetch('/api/portfolio-stats')
        .then(async res => {
          if (!res.ok) {
            console.warn(`⚠️ Stats API returned ${res.status}`)
            return FALLBACK_STATS
          }
          return res.json()
        })
        .catch(err => {
          console.warn('⚠️ Failed to fetch stats:', err)
          return FALLBACK_STATS
        })

      const [projectsData, statsData] = await Promise.allSettled([
        projectsPromise,
        statsPromise
      ])

      // Handle projects
      if (projectsData.status === 'fulfilled') {
        const result = projectsData.value
        if (result.success && result.projects) {
          // Ensure all projects have required fields
          const validProjects = result.projects.map((p: any) => ({
            ...p,
            title: p.title || p.name, // Ensure title exists
            tags: p.tags || p.techStack || [],
            topics: p.topics || p.github?.topics || []
          }))
          setProjects(validProjects)
          console.log('✅ Projects loaded successfully')
        } else {
          setProjects(FALLBACK_PROJECTS)
        }
      }

      // Handle stats
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value)
        console.log('✅ Stats loaded successfully')
      }

    } catch (err) {
      console.error('❌ Error fetching portfolio data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
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