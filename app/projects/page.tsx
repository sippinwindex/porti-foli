// app/projects/page.tsx - FIXED: Load ALL repositories without limits
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

// Import utilities from our fixed files
import { formatDate, getLanguageColor, toBoolean } from '@/lib/utils'
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

// Types matching our fixed API response
interface ProjectData {
  id: string
  name: string
  title: string
  description: string
  techStack: string[]
  tags: string[]
  featured: boolean
  category: string
  status: string
  github: {
    stars: number
    forks: number
    url: string
    language: string | null
    lastUpdated: string
    topics: string[]
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
    deploymentStatus: string
    lastDeployed?: string
  }
  primaryUrl: string
  deploymentUrl?: string
  repositoryUrl: string
  deploymentScore: number
  popularityScore: number
  activityScore: number
  lastActivity: string
}

interface PortfolioStats {
  totalProjects: number
  featuredProjects: number
  liveProjects: number
  totalStars: number
  totalForks: number
  topLanguages: Array<{
    name: string
    count: number
    percentage: number
  }>
}

// FIXED: Custom hook to fetch ALL data from our API without limits
function useProjectsData() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Fetching ALL projects from API...')
      
      // FIXED: Fetch ALL projects by not passing a limit parameter
      const response = await fetch('/api/projects?includeStats=true')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch projects')
      }
      
      console.log(`✅ Loaded ${data.projects?.length || 0} projects from API`)
      console.log('📊 Debug info:', data._debug)
      
      setProjects(data.projects || [])
      setStats(data.stats || null)
    } catch (err) {
      console.error('❌ Error fetching projects:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    projects,
    stats,
    loading,
    error,
    refetch: fetchData
  }
}

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

// Enhanced Project Card using our API data structure
function ProjectCardWrapper({ 
  project, 
  index, 
  viewMode, 
  onCardClick 
}: {
  project: ProjectData
  index: number
  viewMode: 'grid' | 'list'
  onCardClick: (project: ProjectData) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative glass-card border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-300 ${
        viewMode === 'list' ? 'flex items-center' : 'flex flex-col'
      } cursor-pointer hover-3d enhanced-glow-effect`}
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
                      {project.title}
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
                  {project.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                    {project.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1 mb-4">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>

            <ProjectStats project={project} />

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <div className="flex space-x-3">
                {project.github.url && (
                  <span className="inline-flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </span>
                )}
                
                {project.vercel?.isLive && (
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

// Enhanced Project Stats Component
function ProjectStats({ project }: { project: ProjectData }) {
  const formatDateAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500" />
        <span>{project.github.stars}</span>
      </div>
      <div className="flex items-center gap-1">
        <GitFork className="w-4 h-4 text-blue-500" />
        <span>{project.github.forks}</span>
      </div>
      <div className="flex items-center gap-1">
        <Activity className="w-4 h-4 text-green-500" />
        <span>{project.activityScore}/100</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        <span>Updated {formatDateAgo(project.github.lastUpdated)}</span>
      </div>
    </div>
  )
}

// Enhanced Project Status Component
function ProjectStatus({ project }: { project: ProjectData }) {
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
    if (project.deploymentUrl) {
      const isVercel = project.deploymentUrl.includes('vercel.app')
      const isNetlify = project.deploymentUrl.includes('netlify.app')
      const isGitHubPages = project.deploymentUrl.includes('github.io')
      
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
    
    // GitHub repository status
    return {
      icon: <Github className="w-4 h-4" />,
      text: 'Repository',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      dotColor: 'bg-gray-500'
    }
  }

  const status = getStatusInfo()

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}>
      <div className={`w-2 h-2 rounded-full ${status.dotColor}`} />
      {status.icon}
      <span>{status.text}</span>
    </div>
  )
}

// Main Project Showcase Component
function ProjectShowcase() {
  const { projects, stats, loading, error, refetch } = useProjectsData()
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([])
  const [activeTag, setActiveTag] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'updated' | 'featured'>('featured')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [visibleProjects, setVisibleProjects] = useState(12) // Start with 12, load more as needed
  
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })

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
        const allTags = [
          ...project.tags,
          ...project.techStack,
          ...project.github.topics
        ].map(tag => tag.toLowerCase())
        
        return allTags.includes(activeTag.toLowerCase())
      })
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.github.language?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'stars':
          return b.github.stars - a.github.stars
        case 'updated':
          return new Date(b.github.lastUpdated).getTime() - new Date(a.github.lastUpdated).getTime()
        case 'featured':
        default:
          // Featured first, then live deployments, then by stars
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          
          const aLive = a.vercel?.isLive || Boolean(a.deploymentUrl)
          const bLive = b.vercel?.isLive || Boolean(b.deploymentUrl)
          if (aLive && !bLive) return -1
          if (!aLive && bLive) return 1
          
          return b.github.stars - a.github.stars
      }
    })

    setFilteredProjects(filtered)
  }, [projects, activeTag, searchTerm, sortBy, categoryFilter])

  // Get all unique tags
  const allTags = React.useMemo(() => {
    const tagSet = new Set(['All'])
    projects.forEach(project => {
      project.tags.forEach(tag => tagSet.add(tag))
      project.techStack.forEach(tech => tagSet.add(tech))
      project.github.topics.forEach(topic => tagSet.add(topic))
    })
    return Array.from(tagSet).slice(0, 20)
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
    setVisibleProjects(prev => prev + 12)
  }

  // Handle card click
  const handleCardClick = useCallback((project: ProjectData) => {
    // Priority 1: Live deployment
    if (project.vercel?.isLive && project.vercel.liveUrl) {
      window.open(project.vercel.liveUrl, '_blank', 'noopener,noreferrer')
      return
    }

    if (project.deploymentUrl) {
      window.open(project.deploymentUrl, '_blank', 'noopener,noreferrer')
      return
    }

    // Priority 2: GitHub repository
    if (project.github.url) {
      window.open(project.github.url, '_blank', 'noopener,noreferrer')
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
            Loading All Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching all repositories from GitHub and deployment platforms...
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
          className="text-center mb-8 p-6 glass-card backdrop-blur-sm rounded-xl border border-green-200 dark:border-green-800 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✅
            </motion.div>
            <span className="text-sm font-medium">
              Successfully loaded ALL {projects.length} projects from GitHub
            </span>
          </div>
          
          {/* GitHub Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalStars}
              </div>
              <div className="text-xs text-gray-500">Total Stars</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.liveProjects}
              </div>
              <div className="text-xs text-gray-500">Live Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalProjects}
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
        className="glass-hero backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 mb-12 glow-effect-enhanced"
      >
        {/* Search and Sort Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, technologies, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Projects Grid/List */}
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
              key={project.id}
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
            className="flex items-center gap-2 px-8 py-4 btn-viva-enhanced font-semibold mx-auto"
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
              className="px-6 py-3 btn-viva-enhanced"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All Filters
            </motion.button>
            <motion.button
              onClick={refetch}
              className="flex items-center gap-2 px-6 py-3 btn-secondary glass-card hover-lift"
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
          Loading All Projects...
        </motion.p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen unified-portfolio-background overflow-x-hidden">
      {/* Enhanced Unified Background with your theme system */}
      <div className="unified-portfolio-background">
        <div className="particle-field-container">
          {!isMobile && (
            <Suspense>
              <ParticleField 
                colorScheme={isLoading ? 'light-mode' : 'brand'}
                animation="constellation"
                interactive={true}
                speed={0.3}
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-[1000]">
        <Suspense fallback={<NavigationSkeleton />}>
          <Navigation />
        </Suspense>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-[1001]">
        <ThemeToggle variant="floating" size="md" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                All Projects
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discover my complete portfolio of projects, applications, and experiments. 
              Each project showcases different technologies, methodologies, and creative solutions 
              to real-world problems.
            </p>
            
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-8 text-sm text-gray-500 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-500" />
                <span>Full-Stack Development</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-500" />
                <span>Live Deployments</span>
              </div>
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-purple-500" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span>Actively Maintained</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Project Showcase */}
          <ProjectShowcase />
        </div>
      </main>

      {/* Footer */}
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  )
}