// components/RealProjectShowcase.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, Github, Filter, Grid, List, Star, GitFork, Calendar, Code, Zap, Eye } from 'lucide-react'

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  topics: string[]
  homepage: string | null
  private: boolean
  fork: boolean
  archived: boolean
}

interface EnhancedProject {
  id: string
  name: string
  description: string
  githubUrl: string
  liveUrl?: string
  featured: boolean
  techStack: string[]
  github: {
    stars: number
    forks: number
    language: string | null
    lastUpdated: string
  }
}

export default function RealProjectShowcase() {
  const [projects, setProjects] = useState<EnhancedProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<EnhancedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState('All')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    fetchRealProjects()
  }, [])

  useEffect(() => {
    if (activeTag === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => 
        project.techStack?.includes(activeTag) ||
        project.github?.language === activeTag
      ))
    }
  }, [projects, activeTag])

  const fetchRealProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Fetching real GitHub repositories...')
      
      const response = await fetch('/api/github?type=repos')
      if (!response.ok) {
        throw new Error(`GitHub API failed: ${response.status}`)
      }
      
      const reposData: GitHubRepo[] = await response.json()
      console.log(`✅ Fetched ${reposData.length} repositories`)
      
      // Filter and enhance repositories for portfolio
      const portfolioProjects = reposData
        .filter(repo => 
          !repo.fork && 
          !repo.archived && 
          !repo.private &&
          repo.description &&
          !repo.name.match(/^(\.github|config|dotfiles|profile|readme)$/i)
        )
        .slice(0, 12) // Limit to top 12 projects
        .map((repo, index) => {
          const techStack = [
            repo.language,
            ...repo.topics.slice(0, 4)
          ].filter(Boolean) as string[]
          
          return {
            id: repo.id.toString(),
            name: formatProjectName(repo.name),
            description: repo.description || 'A project built with modern technologies',
            githubUrl: repo.html_url,
            liveUrl: repo.homepage || undefined,
            featured: repo.stargazers_count > 0 || index < 6,
            techStack,
            github: {
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              lastUpdated: repo.updated_at,
            }
          }
        })
        .sort((a, b) => {
          // Featured first, then by stars
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.github.stars - a.github.stars
        })
      
      setProjects(portfolioProjects)
      console.log(`✅ Processed ${portfolioProjects.length} portfolio projects`)
      
    } catch (err) {
      console.error('❌ Failed to fetch projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to load projects')
      
      // Fallback to placeholder projects
      setProjects([{
        id: '1',
        name: 'Portfolio Website',
        description: 'Modern portfolio website built with Next.js, TypeScript, and Framer Motion',
        githubUrl: 'https://github.com/sippinwindex/portfolio',
        liveUrl: window.location.origin,
        featured: true,
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        github: {
          stars: 0,
          forks: 0,
          language: 'TypeScript',
          lastUpdated: new Date().toISOString(),
        }
      }])
    } finally {
      setLoading(false)
    }
  }

  const formatProjectName = (name: string): string => {
    return name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\bJs\b/g, 'JS')
      .replace(/\bTs\b/g, 'TS')
      .replace(/\bApi\b/g, 'API')
      .replace(/\bUi\b/g, 'UI')
  }

  // Get all unique tags
  const allTags = React.useMemo(() => {
    const tagSet = new Set(['All'])
    projects.forEach(project => {
      project.techStack?.forEach(tech => tagSet.add(tech))
      if (project.github?.language) tagSet.add(project.github.language)
    })
    return Array.from(tagSet).slice(0, 15)
  }, [projects])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Loading real projects from GitHub...
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
              <div className="flex space-x-2 mb-4">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-6 bg-muted rounded w-12"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Failed to load projects: {error}
            </p>
            <button
              onClick={fetchRealProjects}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Success indicator */}
      {projects.length > 0 && (
        <div className="text-center mb-8">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✅ Successfully loaded {projects.length} projects from GitHub
          </p>
        </div>
      )}

      {/* Filters and View Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
          <Filter className="w-5 h-5 mr-2 text-muted-foreground" />
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      <motion.div
        layout
        className={`grid gap-8 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group ${
                viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
              }`}
            >
              {/* Project Header */}
              <div className={`relative ${viewMode === 'list' ? 'sm:w-1/3 h-48' : 'h-56'}`}>
                {/* Placeholder image with gradient */}
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Code className="w-16 h-16 text-primary/40" />
                </div>
                
                {/* Project status badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {project.featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                  {project.liveUrl && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      <Eye className="w-3 h-3 mr-1" />
                      Live
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack?.slice(0, 3).map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack && project.techStack.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* GitHub stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{project.github.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      <span>{project.github.forks}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.github.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                      title="View on GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                        title="View Live Demo"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <span className="text-sm text-primary cursor-pointer hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects found for "{activeTag}". Try a different filter.
          </p>
        </div>
      )}
    </div>
  )
}