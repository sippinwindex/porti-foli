// components/RealProjectShowcase.tsx - FIXED V2 with proper hook patterns
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import usePortfolioData from '@/hooks/usePortfolioData'

interface RealProjectShowcaseProps {
  className?: string
  maxProjects?: number
}

export default function RealProjectShowcase({ 
  className = '', 
  maxProjects = 6 
}: RealProjectShowcaseProps) {
  const [displayProjects, setDisplayProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get portfolio data from hook
  const { projects, stats, loading: portfolioLoading, error: portfolioError } = usePortfolioData()

  // FIXED: Memoize fallback projects to prevent recreation
  const fallbackProjects = useMemo(() => [
    {
      id: 'portfolio-website',
      name: 'Portfolio Website',
      description: 'Modern 3D portfolio with live GitHub integration and interactive animations',
      techStack: ['Next.js', 'Three.js', 'TypeScript', 'Framer Motion'],
      featured: true,
      github: { stars: 25, forks: 8, url: 'https://github.com/sippinwindex' },
      vercel: { isLive: true, liveUrl: 'https://juanfernandez.dev' }
    },
    {
      id: 'synthwave-runner',
      name: 'Synthwave Runner',
      description: 'Professional endless runner game with synthwave aesthetics',
      techStack: ['React', 'TypeScript', 'HTML5 Canvas'],
      featured: true,
      github: { stars: 15, forks: 4, url: 'https://github.com/sippinwindex' },
      vercel: { isLive: true, liveUrl: '/dino-game' }
    }
  ], [])

  // FIXED: Stable fetchRealProjects with proper dependencies
  const fetchRealProjects = useCallback(() => {
    setLoading(true)
    setError(null)

    try {
      // Use data from the hook
      if (projects && projects.length > 0) {
        const featuredProjects = projects
          .filter(project => project.featured)
          .slice(0, maxProjects)
        
        setDisplayProjects(featuredProjects)
      } else {
        // Use memoized fallback projects
        setDisplayProjects(fallbackProjects)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
      setDisplayProjects(fallbackProjects)
    } finally {
      setLoading(false)
    }
  }, [projects, maxProjects, fallbackProjects]) // FIXED: All dependencies included

  // FIXED: Effect only depends on portfolioLoading and fetchRealProjects
  useEffect(() => {
    if (!portfolioLoading) {
      fetchRealProjects()
    }
  }, [portfolioLoading, fetchRealProjects])

  // FIXED: Handle portfolio errors with stable dependency
  useEffect(() => {
    if (portfolioError) {
      setError(portfolioError)
      setLoading(false)
    }
  }, [portfolioError])

  // FIXED: Memoize loading component
  const LoadingComponent = useMemo(() => (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-viva-magenta-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lux-gray-300">Loading real projects...</p>
        </div>
      </div>
    </section>
  ), [className])

  // FIXED: Memoize error component with stable fetchRealProjects
  const ErrorComponent = useMemo(() => (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto px-6">
        <div className="glass-card p-8 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-red-400 mb-4">Failed to Load Projects</h3>
          <p className="text-lux-gray-300 mb-4">{error}</p>
          <button 
            onClick={fetchRealProjects}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    </section>
  ), [className, error, fetchRealProjects])

  if (loading) {
    return LoadingComponent
  }

  if (error) {
    return ErrorComponent
  }

  return (
    <section className={`py-20 bg-gradient-to-br from-lux-black to-lux-gray-900 ${className}`}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text-3d">Real Projects</span>
          </h2>
          <p className="text-xl text-lux-gray-300 max-w-3xl mx-auto">
            Live projects with real GitHub data and deployment status
          </p>
          
          {stats && (
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-md mx-auto">
              <div className="glass-card p-4 rounded-lg">
                <div className="text-2xl font-bold text-viva-magenta-400">{stats.totalProjects}</div>
                <div className="text-sm text-lux-gray-400">Total Projects</div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="text-2xl font-bold text-lux-gold">{stats.totalStars}</div>
                <div className="text-sm text-lux-gray-400">GitHub Stars</div>
              </div>
              <div className="glass-card p-4 rounded-lg">
                <div className="text-2xl font-bold text-lux-teal">{stats.liveProjects}</div>
                <div className="text-sm text-lux-gray-400">Live Apps</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="project-card-3d group"
            >
              <div className="project-card-inner">
                {/* Project Header */}
                <div className="p-6 border-b border-lux-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-viva-magenta-400 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex gap-2">
                      {project.featured && (
                        <span className="w-3 h-3 bg-viva-magenta-500 rounded-full animate-pulse" />
                      )}
                      {project.vercel?.isLive && (
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-lux-gray-300 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="p-6 border-b border-lux-gray-700">
                  <h4 className="text-sm font-semibold text-lux-gray-400 mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-viva-magenta-500/20 text-viva-magenta-300 rounded text-xs border border-viva-magenta-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="p-6">
                  {project.github && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-lg font-bold text-lux-gold">⭐ {project.github.stars}</div>
                        <div className="text-xs text-lux-gray-400">Stars</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-lux-teal">🔧 {project.github.forks}</div>
                        <div className="text-xs text-lux-gray-400">Forks</div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {project.github && (
                      <a
                        href={project.github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-3 py-2 bg-lux-gray-700 hover:bg-lux-gray-600 text-lux-gray-300 rounded-lg text-sm transition-colors"
                      >
                        Code
                      </a>
                    )}
                    {project.vercel?.isLive && project.vercel.liveUrl && (
                      <a
                        href={project.vercel.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-3 py-2 bg-viva-magenta-500 hover:bg-viva-magenta-600 text-white rounded-lg text-sm transition-colors"
                      >
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a href="/projects" className="btn-primary">
            View All Projects
          </a>
        </motion.div>
      </div>
    </section>
  )
}