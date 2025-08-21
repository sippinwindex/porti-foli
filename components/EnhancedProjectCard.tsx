// components/EnhancedProjectCard.tsx - COMPLETELY FIXED VERSION
'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  GitFork, 
  Calendar, 
  Code, 
  ExternalLink, 
  Eye,
  TrendingUp,
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

interface PortfolioProject {
  id: string
  name: string
  title?: string
  description: string
  techStack: string[]
  tags?: string[]
  featured: boolean
  category?: string
  status?: string
  startDate?: string
  github?: {
    stars: number
    forks: number
    url: string
    topics?: string[]
    lastUpdated?: string
    language?: string
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
    deploymentStatus?: string
  }
  githubUrl?: string
  liveUrl?: string
  highlights?: string[]
}

interface EnhancedProjectCardProps {
  project: PortfolioProject
  index: number
  viewMode: 'grid' | 'list'
  onCardClick?: (project: PortfolioProject) => void
}

const EnhancedProjectCard = ({ project, index, viewMode, onCardClick }: EnhancedProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // Smart deployment detection with priority system
  const getLiveDeploymentInfo = useCallback(() => {
    // Priority 1: Vercel deployment with liveUrl
    if (project.vercel?.isLive && project.vercel.liveUrl) {
      return {
        hasLive: true,
        liveUrl: project.vercel.liveUrl,
        source: 'vercel',
        status: project.vercel.deploymentStatus || 'READY'
      }
    }

    // Priority 2: Direct liveUrl (could be any platform)
    if (project.liveUrl && isValidLiveUrl(project.liveUrl)) {
      return {
        hasLive: true,
        liveUrl: project.liveUrl,
        source: 'custom',
        status: 'READY'
      }
    }

    // Priority 3: GitHub homepage that looks like deployment
    if (project.github?.url && project.liveUrl) {
      const username = extractGitHubUsername(project.github.url)
      const repoName = extractRepoName(project.github.url)
      
      // Check for GitHub Pages pattern
      if (project.liveUrl.includes(`${username}.github.io`)) {
        return {
          hasLive: true,
          liveUrl: project.liveUrl,
          source: 'github-pages',
          status: 'READY'
        }
      }
    }

    return {
      hasLive: false,
      liveUrl: null,
      source: 'none',
      status: 'not-deployed'
    }
  }, [project])

  // Primary card click behavior - smart routing
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Don't trigger if clicking on action buttons
    if ((e.target as Element).closest('button')) {
      return
    }

    const liveInfo = getLiveDeploymentInfo()
    
    // Priority 1: If we have a live deployment, go there directly
    if (liveInfo.hasLive && liveInfo.liveUrl) {
      console.log(`🚀 Opening live deployment: ${liveInfo.liveUrl}`)
      window.open(liveInfo.liveUrl, '_blank', 'noopener,noreferrer')
      return
    }

    // Priority 2: If no live deployment but we have onCardClick (for project details page)
    if (onCardClick) {
      console.log(`📄 Opening project details: ${project.name}`)
      onCardClick(project)
      return
    }

    // Priority 3: Fallback to GitHub repository
    if (project.github?.url || project.githubUrl) {
      const githubUrl = project.github?.url || project.githubUrl
      console.log(`💻 Opening GitHub repository: ${githubUrl}`)
      window.open(githubUrl, '_blank', 'noopener,noreferrer')
    }
  }, [project, onCardClick, getLiveDeploymentInfo])

  // Individual button click handlers (prevent event bubbling)
  const handleLiveDemoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const liveInfo = getLiveDeploymentInfo()
    
    if (liveInfo.liveUrl) {
      console.log(`🚀 Live demo clicked: ${liveInfo.liveUrl}`)
      window.open(liveInfo.liveUrl, '_blank', 'noopener,noreferrer')
    }
  }, [getLiveDeploymentInfo])

  const handleGithubClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const githubUrl = project.github?.url || project.githubUrl
    if (githubUrl) {
      console.log(`💻 GitHub clicked: ${githubUrl}`)
      window.open(githubUrl, '_blank', 'noopener,noreferrer')
    }
  }, [project])

  const handleDetailsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(`📄 Details clicked: /projects/${project.id}`)
    window.location.href = `/projects/${project.id}`
  }, [project.id])

  // Helper functions
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently'
    
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
      case 'completed':
      case 'READY':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
      case 'failed':
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'building':
      case 'in-progress':
      case 'BUILDING':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  const liveInfo = getLiveDeploymentInfo()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
        viewMode === 'list' ? 'flex items-center' : 'flex flex-col'
      } cursor-pointer hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 hover:scale-[1.02]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ 
        y: viewMode === 'grid' ? -4 : 0,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}
    >
      {/* Grid View Header with enhanced visual feedback */}
      {viewMode === 'grid' && (
        <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
          </div>
          
          {/* Code Icon with rotation effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Code className="w-16 h-16 text-white opacity-90" />
              {liveInfo.hasLive && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {project.featured && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-semibold shadow-lg"
              >
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </motion.div>
            )}
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {liveInfo.hasLive && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 shadow-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                <span className="text-xs text-green-700 dark:text-green-300 font-semibold">Live</span>
              </motion.div>
            )}

            {/* Deployment Status */}
            {liveInfo.status && liveInfo.status !== 'not-deployed' && (
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2">
                {getDeploymentStatusIcon(liveInfo.status)}
              </div>
            )}
          </div>

          {/* Smart hover overlay */}
          {liveInfo.hasLive && (
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
            >
              <motion.div
                className="flex items-center px-6 py-3 bg-white text-gray-900 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLiveDemoClick}
              >
                <Globe className="w-4 h-4 mr-2" />
                Open Live Demo
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </motion.div>
            </motion.div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className={`${viewMode === 'grid' ? 'p-6' : 'flex-1 p-6'} ${viewMode === 'list' ? 'flex items-center' : ''}`}>
        {/* List View Layout */}
        {viewMode === 'list' ? (
          <div className="flex items-center w-full space-x-6">
            {/* Project Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                <Code className="w-8 h-8 text-white" />
                {liveInfo.hasLive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {project.title || project.name}
                    </h3>
                    {project.featured && (
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    )}
                    {liveInfo.hasLive && (
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
                      {project.category || 'Project'}
                    </span>
                    {project.github && (
                      <>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{project.github.stars || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="w-3 h-3" />
                          <span>{formatDate(project.github.lastUpdated)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons with Clear Hierarchy */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* Primary Action: Live Demo (if available) */}
                  {liveInfo.hasLive && (
                    <motion.button
                      onClick={handleLiveDemoClick}
                      className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="View Live Demo"
                    >
                      <Globe className="w-4 h-4" />
                    </motion.button>
                  )}
                  
                  {/* Secondary Action: GitHub */}
                  {(project.github?.url || project.githubUrl) && (
                    <motion.button
                      onClick={handleGithubClick}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="View Source Code"
                    >
                      <Github className="w-4 h-4" />
                    </motion.button>
                  )}

                  {/* Tertiary Action: Details */}
                  <motion.button
                    onClick={handleDetailsClick}
                    className="p-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View Layout with Better Actions */
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {project.title || project.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                    {project.category || 'Project'}
                  </span>
                  {liveInfo.status && liveInfo.status !== 'not-deployed' && getDeploymentStatusIcon(liveInfo.status)}
                </div>
              </div>
            </div>

            {/* Description */}
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

            {/* Stats */}
            {project.github && (
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{project.github.stars || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="w-4 h-4" />
                    <span>{project.github.forks || 0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">
                    {Math.min(60 + (project.github.stars || 0) * 5, 100)}/100
                  </span>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Updated {formatDate(project.github?.lastUpdated || project.startDate)}
            </div>

            {/* Action Buttons with Proper Priority */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                {/* Show buttons based on priority */}
                {liveInfo.hasLive ? (
                  // Primary: Live Demo
                  <motion.button
                    onClick={handleLiveDemoClick}
                    className="inline-flex items-center space-x-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Live Demo</span>
                  </motion.button>
                ) : (
                  // Primary: GitHub (if no live demo)
                  (project.github?.url || project.githubUrl) && (
                    <motion.button
                      onClick={handleGithubClick}
                      className="inline-flex items-center space-x-1 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 px-3 py-2 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-4 h-4" />
                      <span>View Code</span>
                    </motion.button>
                  )
                )}
                
                {/* Secondary: GitHub (when live demo exists) */}
                {liveInfo.hasLive && (project.github?.url || project.githubUrl) && (
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

                {/* Tertiary: Details */}
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

              {/* Live Status Indicator */}
              {liveInfo.hasLive && (
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {liveInfo.source === 'vercel' ? 'Vercel' : 'Live'}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

// Helper functions
function isValidLiveUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.toLowerCase()
    
    // Known deployment platforms
    const deploymentPlatforms = [
      'vercel.app',
      'netlify.app',
      'herokuapp.com',
      'github.io',
      'surge.sh',
      'firebase.app',
      'web.app',
      'cloudfront.net',
      'azurewebsites.net',
      'railway.app'
    ]
    
    return deploymentPlatforms.some(platform => 
      hostname.includes(platform) || hostname.endsWith(platform)
    ) || 
    // Custom domains that look like deployment URLs
    (!hostname.includes('github.com') && !hostname.includes('localhost'))
  } catch {
    return false
  }
}

function extractGitHubUsername(githubUrl: string): string {
  try {
    const match = githubUrl.match(/github\.com\/([^\/]+)/)
    return match ? match[1] : ''
  } catch {
    return ''
  }
}

function extractRepoName(githubUrl: string): string {
  try {
    const match = githubUrl.match(/github\.com\/[^\/]+\/([^\/]+)/)
    return match ? match[1] : ''
  } catch {
    return ''
  }
}

export { EnhancedProjectCard }
export default EnhancedProjectCard