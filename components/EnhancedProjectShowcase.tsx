// components/EnhancedProjectShowcase.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  GitFork, 
  Calendar, 
  Code, 
  ExternalLink, 
  Eye,
  TrendingUp,
  Filter,
  Grid,
  List,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from 'lucide-react'
import type { EnhancedProject } from '@/lib/portfolio-integration'

interface EnhancedProjectShowcaseProps {
  initialProjects?: EnhancedProject[]
  showFilters?: boolean
  showSearch?: boolean
  showStats?: boolean
  defaultView?: 'grid' | 'list'
  featuredFirst?: boolean
}

export default function EnhancedProjectShowcase({
  initialProjects = [],
  showFilters = true,
  showSearch = true,
  showStats = true,
  defaultView = 'grid',
  featuredFirst = true
}: EnhancedProjectShowcaseProps) {
  const [projects, setProjects] = useState<EnhancedProject[]>(initialProjects)
  const [filteredProjects, setFilteredProjects] = useState<EnhancedProject[]>(initialProjects)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name' | 'score'>('score')

  const categories = ['all', 'fullstack', 'frontend', 'backend', 'data', 'mobile', 'other']

  useEffect(() => {
    if (initialProjects.length === 0) {
      fetchProjects()
    }
  }, [])

  useEffect(() => {
    filterAndSortProjects()
  }, [projects, selectedCategory, searchTerm, sortBy])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProjects = () => {
    let filtered = [...projects]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.techStack.some(tech => tech.toLowerCase().includes(term))
      )
    }

    // Sort projects
    filtered.sort((a, b) => {
      // Featured projects first if enabled
      if (featuredFirst) {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
      }

      switch (sortBy) {
        case 'updated':
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        case 'stars':
          return (b.github?.stars || 0) - (a.github?.stars || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'score':
          return b.deploymentScore - a.deploymentScore
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const getDeploymentStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'building':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  const ProjectCard = ({ project, index }: { project: EnhancedProject; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 group ${
        viewMode === 'list' ? 'flex items-center p-6' : 'flex flex-col'
      }`}
    >
      {/* Project Image/Icon */}
      {viewMode === 'grid' && (
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <Code className="w-12 h-12 text-white opacity-80" />
          </div>
          {project.featured && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </span>
            </div>
          )}
          {project.vercel?.isLive && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-700 dark:text-green-300 font-medium">Live</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`${viewMode === 'grid' ? 'p-6' : 'flex-1'}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                {project.category}
              </span>
              {project.vercel && getDeploymentStatusIcon(project.vercel.buildStatus)}
            </div>
          </div>
          
          {viewMode === 'list' && project.featured && (
            <Star className="w-5 h-5 text-yellow-500" />
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.techStack.slice(0, viewMode === 'list' ? 6 : 4).map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > (viewMode === 'list' ? 6 : 4) && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              +{project.techStack.length - (viewMode === 'list' ? 6 : 4)}
            </span>
          )}
        </div>

        {/* Stats */}
        {project.github && (
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>{project.github.stars}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitFork className="w-4 h-4" />
              <span>{project.github.forks}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(project.lastActivity)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{project.deploymentScore}/100</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            {project.github && (
              <a
                href={project.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Code className="w-4 h-4" />
                <span>Code</span>
              </a>
            )}
            
            {(project.vercel?.liveUrl || project.metadata.liveUrl) && (
              <a
                href={project.vercel?.liveUrl || project.metadata.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}

            <a
              href={`/projects/${project.slug}`}
              className="inline-flex items-center space-x-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Details</span>
            </a>
          </div>

          {project.vercel?.isLive && (
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600 dark:text-green-400">Live</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          {/* Search */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Category Filter */}
          {showFilters && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          )}

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="score">Score</option>
            <option value="updated">Last Updated</option>
            <option value="stars">Stars</option>
            <option value="name">Name</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredProjects.length} of {projects.length} projects
        {searchTerm && (
          <span> matching "{searchTerm}"</span>
        )}
      </div>

      {/* Projects */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="flex space-x-2 mb-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : filteredProjects.length > 0 ? (
          <motion.div
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}