// components/EnhancedProjectShowcase.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
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
  Zap,
  Github,
  Globe,
  ArrowUpRight,
  Activity,
  Users
} from 'lucide-react'
import type { EnhancedProject } from '@/lib/portfolio-integration'

interface EnhancedProjectShowcaseProps {
  initialProjects?: EnhancedProject[]
  showFilters?: boolean
  showSearch?: boolean
  showStats?: boolean
  defaultView?: 'grid' | 'list'
  featuredFirst?: boolean
  onCardClick?: (project: EnhancedProject) => void
}

// Enhanced Project Card Component
interface EnhancedProjectCardProps {
  project: EnhancedProject
  index: number
  viewMode: 'grid' | 'list'
  onCardClick?: (project: EnhancedProject) => void
}

const EnhancedProjectCard = ({ project, index, viewMode, onCardClick }: EnhancedProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

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

  const hasLiveDemo = project.vercel?.liveUrl || project.metadata.liveUrl
  const canClickCard = !hasLiveDemo && onCardClick

  const handleCardClick = () => {
    if (canClickCard) {
      onCardClick!(project)
    }
  }

  const handleLiveDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const liveUrl = project.vercel?.liveUrl || project.metadata.liveUrl
    if (liveUrl) {
      window.open(liveUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleGithubClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (project.github?.url) {
      window.open(project.github.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Navigate to project details
    window.location.href = `/projects/${project.slug}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
        viewMode === 'list' ? 'flex items-center' : 'flex flex-col'
      } ${canClickCard ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ 
        y: viewMode === 'grid' ? -4 : 0,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}
    >
      {/* Grid View Header Image */}
      {viewMode === 'grid' && (
        <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
          </div>
          
          {/* Code Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.5 }}
            >
              <Code className="w-16 h-16 text-white opacity-90" />
            </motion.div>
          </div>

          {/* Featured Badge */}
          {project.featured && (
            <motion.div 
              className="absolute top-4 left-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-semibold shadow-lg">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </div>
            </motion.div>
          )}

          {/* Live Status */}
          {project.vercel?.isLive && (
            <motion.div 
              className="absolute top-4 right-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                <span className="text-xs text-green-700 dark:text-green-300 font-semibold">Live</span>
              </div>
            </motion.div>
          )}

          {/* Deployment Status */}
          {project.vercel && (
            <div className="absolute bottom-4 right-4">
              {getDeploymentStatusIcon(project.vercel.buildStatus)}
            </div>
          )}

          {/* Hover Overlay for Live Demo */}
          {hasLiveDemo && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ pointerEvents: 'auto' }}
              onClick={handleLiveDemoClick}
            >
              <motion.button
                className="flex items-center px-6 py-3 bg-white text-gray-900 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-4 h-4 mr-2" />
                View Live Demo
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </motion.button>
            </motion.div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`${viewMode === 'grid' ? 'p-6' : 'flex-1 p-6'} ${viewMode === 'list' ? 'flex items-center' : ''}`}>
        {/* List View Layout */}
        {viewMode === 'list' ? (
          <div className="flex items-center w-full space-x-6">
            {/* Project Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Code className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {project.name}
                    </h3>
                    {project.featured && (
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    )}
                    {project.vercel?.isLive && (
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                    {project.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="capitalize text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {project.category}
                    </span>
                    {project.github && (
                      <>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{project.github.stars}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="w-3 h-3" />
                          <span>{formatDate(project.lastActivity)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  {project.github && (
                    <motion.button
                      onClick={handleGithubClick}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-4 h-4" />
                    </motion.button>
                  )}
                  
                  {hasLiveDemo && (
                    <motion.button
                      onClick={handleLiveDemoClick}
                      className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Globe className="w-4 h-4" />
                    </motion.button>
                  )}

                  <motion.button
                    onClick={handleDetailsClick}
                    className="p-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View Layout */
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {project.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                    {project.category}
                  </span>
                  {project.vercel && getDeploymentStatusIcon(project.vercel.buildStatus)}
                </div>
              </div>
            </div>

            {/* Description */}
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

            {/* Stats */}
            {project.github && (
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{project.github.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="w-4 h-4" />
                    <span>{project.github.forks}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">{project.deploymentScore}/100</span>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Updated {formatDate(project.lastActivity)}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                {project.github && (
                  <motion.button
                    onClick={handleGithubClick}
                    className="inline-flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </motion.button>
                )}
                
                {hasLiveDemo && (
                  <motion.button
                    onClick={handleLiveDemoClick}
                    className="inline-flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Live Demo</span>
                  </motion.button>
                )}

                <motion.button
                  onClick={handleDetailsClick}
                  className="inline-flex items-center space-x-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Details</span>
                </motion.button>
              </div>

              {project.vercel?.isLive && (
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default function EnhancedProjectShowcase({
  initialProjects = [],
  showFilters = true,
  showSearch = true,
  showStats = true,
  defaultView = 'grid',
  featuredFirst = true,
  onCardClick
}: EnhancedProjectShowcaseProps) {
  const [projects, setProjects] = useState<EnhancedProject[]>(initialProjects)
  const [filteredProjects, setFilteredProjects] = useState<EnhancedProject[]>(initialProjects)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name' | 'score'>('score')

  const categories = ['all', 'fullstack', 'frontend', 'backend', 'data', 'mobile', 'other']

  // ✅ FIX: Memoize fetchProjects to avoid unnecessary re-renders
  const fetchProjects = useCallback(async () => {
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
  }, [])

  // ✅ FIX: Memoize filterAndSortProjects function
  const filterAndSortProjects = useCallback(() => {
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
  }, [projects, selectedCategory, searchTerm, sortBy, featuredFirst])

  // ✅ FIX: Include initialProjects.length dependency
  useEffect(() => {
    if (initialProjects.length === 0) {
      fetchProjects()
    }
  }, [initialProjects.length, fetchProjects])

  // ✅ FIX: Include filterAndSortProjects dependency
  useEffect(() => {
    filterAndSortProjects()
  }, [filterAndSortProjects])

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
          <motion.button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Grid className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <List className="w-4 h-4" />
          </motion.button>
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
              <EnhancedProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                viewMode={viewMode}
                onCardClick={onCardClick}
              />
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