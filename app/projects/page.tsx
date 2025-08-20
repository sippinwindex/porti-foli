'use client'

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  ExternalLink, Github, Filter, Grid, List, Star, GitFork, 
  Calendar, Code, Zap, Search, TrendingUp, Eye, Clock, Loader,
  Globe, AlertCircle, ChevronDown, Play, Pause, Rocket, Activity,
  Users, CheckCircle, XCircle, RefreshCw
} from 'lucide-react'

// Your existing imports
import usePortfolioData from '@/hooks/usePortfolioData'
import { EnhancedProjectCard } from '@/components/EnhancedProjectShowcase'
import type { PortfolioProject } from '@/types/portfolio'
import ThemeToggle from '@/components/ThemeToggle'

// Lazy load heavy components
const Navigation = dynamic(() => import('@/components/Navigation'), { 
  ssr: false,
  loading: () => <NavigationSkeleton />
})

const Footer = dynamic(() => import('@/components/Footer'), { 
  ssr: false,
  loading: () => <FooterSkeleton />
})

const ParticleField = dynamic(() => import('@/components/3D/ParticleField'), { 
  ssr: false,
  loading: () => null
})

// Loading Skeletons
function NavigationSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto h-full flex justify-between items-center px-4">
        <div className="w-32 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </nav>
  )
}

function FooterSkeleton() {
  return (
    <footer className="bg-gray-900 text-center py-8">
      <div className="container mx-auto px-4">
        <div className="w-64 h-4 bg-gray-700 rounded mx-auto animate-pulse" />
      </div>
    </footer>
  )
}

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}

// Enhanced Project Card Wrapper to match your existing component
function ProjectCardWrapper({ 
  project, 
  index, 
  viewMode, 
  onCardClick 
}: {
  project: PortfolioProject
  index: number
  viewMode: 'grid' | 'list'
  onCardClick: (project: PortfolioProject) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
        viewMode === 'list' ? 'flex items-center' : 'flex flex-col'
      } cursor-pointer hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600`}
      onClick={() => onCardClick(project)}
      whileHover={{ 
        y: viewMode === 'grid' ? -4 : 0,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}
    >
      {/* Grid View Header */}
      {viewMode === 'grid' && (
        <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <Code className="w-16 h-16 text-white opacity-90" />
          </div>

          {/* Status badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {project.featured && (
              <div className="flex items-center px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-semibold shadow-lg">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4">
            <ProjectStatus project={project} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`${viewMode === 'grid' ? 'p-6' : 'flex-1 p-6'} ${viewMode === 'list' ? 'flex items-center' : ''}`}>
        {viewMode === 'list' ? (
          /* List View */
          <div className="flex items-center w-full space-x-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Code className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {project.title || project.name}
                    </h3>
                    {project.featured && <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                    {project.description}
                  </p>

                  <ProjectStats project={project} />
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <ProjectStatus project={project} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View */
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {project.title || project.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                    {project.category || 'Project'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1 mb-4">
              {(project.techStack || []).slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                >
                  {tech}
                </span>
              ))}
              {(project.techStack || []).length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  +{(project.techStack || []).length - 4}
                </span>
              )}
            </div>

            <ProjectStats project={project} />

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <div className="flex space-x-3">
                {(project.github?.url || project.githubUrl) && (
                  <span className="inline-flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </span>
                )}
                
                {(project.vercel?.isLive || project.liveUrl) && (
                  <span className="inline-flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                    <Globe className="w-4 h-4" />
                    <span>Live</span>
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Enhanced Project Stats Component with GitHub data
function ProjectStats({ project }: { project: PortfolioProject }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const getActivityScore = () => {
    const stars = project.github?.stars || 0
    const forks = project.github?.forks || 0
    const isRecent = project.github?.lastUpdated ? 
      new Date(project.github.lastUpdated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false
    
    return Math.min(60 + (stars * 2) + (forks * 3) + (isRecent ? 20 : 0), 100)
  }

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
      {project.github && (
        <>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{project.github.stars || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4 text-blue-500" />
            <span>{project.github.forks || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-green-500" />
            <span>{getActivityScore()}/100</span>
          </div>
        </>
      )}
      {project.github?.lastUpdated && (
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>Updated {formatDate(project.github.lastUpdated)}</span>
        </div>
      )}
    </div>
  )
}

// Enhanced Project Status Component with deployment info
function ProjectStatus({ project }: { project: PortfolioProject }) {
  const getStatusInfo = () => {
    // Check Vercel deployment first
    if (project.vercel?.isLive) {
      return {
        icon: <Globe className="w-4 h-4" />,
        text: 'Live on Vercel',
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        dotColor: 'bg-green-500'
      }
    }
    
    // Check general live URL
    if (project.liveUrl) {
      const isVercel = project.liveUrl.includes('vercel.app')
      const isNetlify = project.liveUrl.includes('netlify.app')
      const isGitHubPages = project.liveUrl.includes('github.io')
      
      let platform = 'Live'
      if (isVercel) platform = 'Vercel'
      else if (isNetlify) platform = 'Netlify'
      else if (isGitHubPages) platform = 'GitHub Pages'
      
      return {
        icon: <Globe className="w-4 h-4" />,
        text: `Live on ${platform}`,
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        dotColor: 'bg-green-500'
      }
    }
    
    // Check Vercel status
    if (project.vercel?.deploymentStatus) {
      switch (project.vercel.deploymentStatus) {
        case 'BUILDING':
        case 'building':
          return {
            icon: <Loader className="w-4 h-4 animate-spin" />,
            text: 'Building',
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
            dotColor: 'bg-yellow-500'
          }
        case 'ERROR':
        case 'error':
        case 'failed':
          return {
            icon: <XCircle className="w-4 h-4" />,
            text: 'Build Failed',
            color: 'text-red-500',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            dotColor: 'bg-red-500'
          }
        case 'READY':
        case 'ready':
          return {
            icon: <CheckCircle className="w-4 h-4" />,
            text: 'Ready',
            color: 'text-blue-500',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            dotColor: 'bg-blue-500'
          }
      }
    }
    
    // GitHub repository status
    if (project.github?.url || project.githubUrl) {
      return {
        icon: <Github className="w-4 h-4" />,
        text: 'Repository',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-700',
        dotColor: 'bg-gray-500'
      }
    }
    
    return {
      icon: <Code className="w-4 h-4" />,
      text: 'Project',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      dotColor: 'bg-gray-500'
    }
  }

  const status = getStatusInfo()

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}>
      <div className={`w-2 h-2 rounded-full ${status.dotColor} ${status.text.includes('Building') ? 'animate-pulse' : ''}`} />
      {status.icon}
      <span>{status.text}</span>
    </div>
  )
}

// Main Project Showcase Component
function ProjectShowcase() {
  const { projects, stats, loading, error, refetch } = usePortfolioData()
  const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>([])
  const [activeTag, setActiveTag] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'updated' | 'featured'>('featured')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isMobile, setIsMobile] = useState(false)
  const [visibleProjects, setVisibleProjects] = useState(9)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term)
    }, 300),
    []
  )

  // Update filtered projects when data changes
  useEffect(() => {
    if (!projects.length) return

    let filtered = [...projects]

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter)
    }

    // Filter by tag
    if (activeTag !== 'All') {
      filtered = filtered.filter(project => {
        const projectTags = project.tags || []
        const techStackTags = project.techStack || []
        const githubTopics = project.github?.topics || []
        const projectTopics = project.topics || []
        
        const allTags = [
          ...projectTags,
          ...techStackTags,
          ...githubTopics,
          ...projectTopics
        ].map(tag => tag.toLowerCase())
        
        return allTags.includes(activeTag.toLowerCase())
      })
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.title || project.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.github?.language?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.title || a.name).localeCompare(b.title || b.name)
        case 'stars':
          return (b.github?.stars || 0) - (a.github?.stars || 0)
        case 'updated':
          const aDate = new Date(a.github?.lastUpdated || '2020-01-01').getTime()
          const bDate = new Date(b.github?.lastUpdated || '2020-01-01').getTime()
          return bDate - aDate
        case 'featured':
        default:
          // Featured first, then live deployments, then by stars
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          
          const aLive = a.vercel?.isLive || Boolean(a.liveUrl)
          const bLive = b.vercel?.isLive || Boolean(b.liveUrl)
          if (aLive && !bLive) return -1
          if (!aLive && bLive) return 1
          
          return (b.github?.stars || 0) - (a.github?.stars || 0)
      }
    })

    setFilteredProjects(filtered)
  }, [projects, activeTag, searchTerm, sortBy, categoryFilter])

  // Get all unique tags from all project data sources
  const allTags = React.useMemo(() => {
    const tagSet = new Set(['All'])
    projects.forEach(project => {
      const projectTags = project.tags || []
      const techStackTags = project.techStack || []
      const githubTopics = project.github?.topics || []
      const projectTopics = project.topics || []
      
      projectTags.forEach(tag => tagSet.add(tag))
      techStackTags.forEach(tech => tagSet.add(tech))
      githubTopics.forEach(topic => tagSet.add(topic))
      projectTopics.forEach(topic => tagSet.add(topic))
    })
    return Array.from(tagSet).slice(0, 20) // Limit to prevent overflow
  }, [projects])

  // Get unique categories
  const categories = React.useMemo(() => {
    const categorySet = new Set(['all'])
    projects.forEach(project => {
      if (project.category) {
        categorySet.add(project.category)
      }
    })
    return Array.from(categorySet)
  }, [projects])

  // Load more projects
  const loadMore = () => {
    setVisibleProjects(prev => prev + 6)
  }

  // Handle card click - enhanced with better navigation logic
  const handleCardClick = useCallback((project: PortfolioProject) => {
    // Priority 1: Live deployment
    const hasLiveDeployment = Boolean(
      project.vercel?.isLive || 
      project.liveUrl || 
      project.vercel?.liveUrl
    )

    if (hasLiveDeployment) {
      const liveUrl = project.vercel?.liveUrl || project.liveUrl
      if (liveUrl) {
        window.open(liveUrl, '_blank', 'noopener,noreferrer')
        return
      }
    }

    // Priority 2: Project details with ID
    if (project.id) {
      window.location.href = `/projects/${project.id}`
      return
    }

    // Priority 4: GitHub repository
    if (project.github?.url || project.githubUrl) {
      const githubUrl = project.github?.url || project.githubUrl
      window.open(githubUrl, '_blank', 'noopener,noreferrer')
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            Loading Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching projects from GitHub and deployment platforms...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-red-200 dark:border-red-800 max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Failed to Load Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <motion.button
            onClick={refetch}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div ref={containerRef}>
      {/* Success indicator with GitHub stats */}
      {projects.length > 0 && stats && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-green-200 dark:border-green-800 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✅
            </motion.div>
            <span className="text-sm font-medium">
              Successfully loaded {projects.length} projects from GitHub
            </span>
          </div>
          
          {/* GitHub Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalStars || 0}
              </div>
              <div className="text-xs text-gray-500">Total Stars</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.liveProjects || 0}
              </div>
              <div className="text-xs text-gray-500">Live Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalProjects || 0}
              </div>
              <div className="text-xs text-gray-500">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.topLanguages?.length || 0}
              </div>
              <div className="text-xs text-gray-500">Languages</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 mb-12"
      >
        {/* Search and Sort Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, technologies, or descriptions..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="featured">Featured First</option>
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="name">Name</option>
            </select>
            
            <div className="flex gap-2">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Grid View"
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="List View"
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <motion.button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeTag === tag
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Results summary */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredProjects.slice(0, visibleProjects).length} of {filteredProjects.length} projects
            {activeTag !== 'All' && ` tagged with "${activeTag}"`}
            {categoryFilter !== 'all' && ` in ${categoryFilter} category`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      </motion.div>

      {/* Projects Grid/List with Enhanced Cards */}
      <motion.div
        layout
        className={`grid gap-8 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.slice(0, visibleProjects).map((project, index) => (
            <ProjectCardWrapper
              key={project.id || project.name || index}
              project={project}
              index={index}
              viewMode={viewMode}
              onCardClick={handleCardClick}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {filteredProjects.length > visibleProjects && (
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.button
            onClick={loadMore}
            className="flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronDown className="w-5 h-5" />
            Load More Projects ({filteredProjects.length - visibleProjects} remaining)
          </motion.button>
        </motion.div>
      )}

      {/* Empty state */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No projects match your current filters.
            {activeTag !== 'All' && ` Try removing the "${activeTag}" tag filter`}
            {searchTerm && ` or changing your search term`}.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              onClick={() => {
                setActiveTag('All')
                setCategoryFilter('all')
                setSearchTerm('')
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All Filters
            </motion.button>
            <motion.button
              onClick={refetch}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Main page component
export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 flex items-center justify-center z-[9999]">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-500 border-t-transparent"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-2 border-purple-400 opacity-30"></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <Code className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
        </div>
        <motion.p 
          className="absolute bottom-20 text-gray-600 dark:text-gray-300 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading Projects...
        </motion.p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 overflow-x-hidden">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-[1000]">
        <Suspense fallback={<NavigationSkeleton />}>
          <Navigation />
        </Suspense>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-[1001]">
        <ThemeToggle />
      </div>

      {/* Particle Field Background - Only on desktop */}
      {!isMobile && (
        <div className="fixed inset-0 z-0">
          <ParticleField 
            particleCount={50}
            colorScheme="cyberpunk"
            animation="float"
            interactive={false}
            speed={0.5}
          />
        </div>
      )}

      {/* Animated Background Elements - Only on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
      )}

      <main className="relative z-10 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-700 mb-6"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Github className="w-4 h-4" />
                <span className="text-sm font-medium">Live GitHub Integration</span>
                <Rocket className="w-4 h-4" />
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                My{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                  Projects
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                A comprehensive showcase of my development work, featuring live GitHub data, 
                real-time deployment status, and interactive project exploration.
              </p>
            </motion.div>
            
            <ProjectShowcase />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  )
}