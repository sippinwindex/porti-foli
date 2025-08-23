// app/projects/page.tsx - FIXED: Remove hardcoded limits and show ALL projects
'use client'

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { 
  ExternalLink, Github, Filter, Grid, List, Star, GitFork, 
  Calendar, Code, Zap, Search, TrendingUp, Eye, Clock, Loader,
  Globe, AlertCircle, ChevronDown, Play, Pause, Rocket, Activity,
  Users, CheckCircle, XCircle, RefreshCw, ArrowRight, Mail
} from 'lucide-react'

// Dynamic imports with enhanced error handling
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

// Types (keeping your existing structure)
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

// Enhanced theme-aware configuration
function useThemeAwareConfig() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return React.useMemo(() => {
    if (!mounted) return { 
      isDark: false, 
      particleConfig: {
        particleCount: 30,
        colorScheme: 'light-mode' as const,
        animation: 'constellation' as const,
        interactive: true,
        speed: 0.4,
        className: "w-full h-full"
      }, 
      backgroundClass: '' 
    }
    
    const isDark = resolvedTheme === 'dark'
    
    return {
      isDark,
      particleConfig: {
        particleCount: 30,
        colorScheme: (isDark ? 'brand' : 'light-mode') as 'cyberpunk' | 'synthwave' | 'cosmic' | 'aurora' | 'viva-magenta' | 'brand' | 'monochrome' | 'light-mode',
        animation: 'constellation' as 'float' | 'drift' | 'spiral' | 'chaos' | 'constellation' | 'flow' | 'orbit',
        interactive: true,
        speed: 0.4,
        className: "w-full h-full"
      },
      backgroundClass: isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900'
        : 'bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20'
    }
  }, [resolvedTheme, mounted])
}

// FIXED: Updated hook to fetch ALL projects without limits
function useProjectsData() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Fetching ALL projects from API (NO LIMITS)...')
      
      // FIXED: Remove any limit parameter to get ALL projects
      const response = await fetch('/api/projects?includeStats=true')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch projects')
      }
      
      console.log(`✅ Loaded ${data.projects?.length || 0} projects from API`)
      console.log(`📊 Stats: ${data.stats?.totalProjects || 0} total, ${data.stats?.liveProjects || 0} live`)
      
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
        <div className="w-32 h-8 bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 rounded animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-8 bg-blue-200 dark:bg-blue-800 rounded animate-pulse" />
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

function PageLoading() {
  const [loadingText, setLoadingText] = useState('Initializing...')
  const [progress, setProgress] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  
  useEffect(() => {
    const messages = [
      'Initializing...',
      'Loading ALL GitHub repositories...',
      'Fetching Project Details...',
      'Preparing 3D Environment...',
      'Almost Ready...'
    ]
    
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % messages.length
      setLoadingText(messages[index])
      setProgress((index + 1) * 20)
    }, shouldReduceMotion ? 300 : 600)
    
    return () => clearInterval(interval)
  }, [shouldReduceMotion])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 flex items-center justify-center z-50">
      <div className="relative text-center max-w-md mx-auto px-4">
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-2 border-cyan-400 opacity-30 mx-auto" />
          <div className="absolute inset-4 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
        </div>
        
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">{loadingText}</p>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{progress}% Complete</p>
        </motion.div>
      </div>
    </div>
  )
}

// Enhanced Project Card with 3D effects
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
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden transition-all duration-500 ${
        viewMode === 'list' ? 'flex items-center' : 'flex flex-col'
      } cursor-pointer`}
      onClick={() => onCardClick(project)}
      whileHover={{ 
        y: shouldReduceMotion ? 0 : (viewMode === 'grid' ? -8 : 0),
        scale: shouldReduceMotion ? 1 : 1.02,
        boxShadow: '0 25px 50px rgba(59, 130, 246, 0.15)'
      }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
    >
      {/* Enhanced 3D Header for Grid View */}
      {viewMode === 'grid' && (
        <div className="relative h-48 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 overflow-hidden">
          {/* 3D Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(59,130,246,0.1)_0%,transparent_50%,rgba(6,182,212,0.1)_100%)]" />
          </div>
          
          {/* Floating elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative"
              whileHover={{ 
                rotateY: shouldReduceMotion ? 0 : 15,
                rotateX: shouldReduceMotion ? 0 : 5
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <Code className="w-10 h-10 text-white" />
              </div>
              
              {/* Floating tech indicators */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
            </motion.div>
          </div>

          {/* Status badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {project.featured && (
              <motion.div 
                className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold shadow-lg"
                whileHover={{ scale: 1.1 }}
              >
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </motion.div>
            )}
          </div>

          <div className="absolute top-4 right-4">
            <ProjectStatus project={project} />
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content */}
      <div className={`${viewMode === 'grid' ? 'p-6' : 'flex-1 p-6'} ${viewMode === 'list' ? 'flex items-center' : ''}`}>
        {viewMode === 'list' ? (
          /* Enhanced List View */
          <div className="flex items-center w-full space-x-6">
            <div className="flex-shrink-0">
              <motion.div 
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg"
                whileHover={{ 
                  scale: shouldReduceMotion ? 1 : 1.1,
                  rotate: shouldReduceMotion ? 0 : 5
                }}
              >
                <Code className="w-8 h-8 text-white" />
              </motion.div>
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
          /* Enhanced Grid View */
          <>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 capitalize">
                    {project.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Enhanced Tech Stack */}
            <div className="flex flex-wrap gap-1 mb-4">
              {project.techStack.slice(0, 4).map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: techIndex * 0.1 }}
                >
                  {tech}
                </motion.span>
              ))}
              {project.techStack.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>

            <ProjectStats project={project} />

            {/* Enhanced Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <div className="flex space-x-3">
                {project.github.url && (
                  <motion.span 
                    className="inline-flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400"
                    whileHover={{ scale: 1.05, color: '#374151' }}
                  >
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </motion.span>
                )}
                
                {project.vercel?.isLive && (
                  <motion.span 
                    className="inline-flex items-center space-x-1 text-sm text-green-600 dark:text-green-400"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Live</span>
                  </motion.span>
                )}
              </div>
              
              <motion.div
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ x: 5 }}
              >
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* 3D Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/10 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />
    </motion.div>
  )
}

// Project Stats (enhanced with animations)
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
      <motion.div 
        className="flex items-center gap-1"
        whileHover={{ scale: 1.1, color: '#eab308' }}
      >
        <Star className="w-4 h-4 text-yellow-500" />
        <span>{project.github.stars}</span>
      </motion.div>
      <motion.div 
        className="flex items-center gap-1"
        whileHover={{ scale: 1.1, color: '#3b82f6' }}
      >
        <GitFork className="w-4 h-4 text-blue-500" />
        <span>{project.github.forks}</span>
      </motion.div>
      <motion.div 
        className="flex items-center gap-1"
        whileHover={{ scale: 1.1, color: '#10b981' }}
      >
        <Activity className="w-4 h-4 text-green-500" />
        <span>{project.activityScore}/100</span>
      </motion.div>
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        <span>Updated {formatDateAgo(project.github.lastUpdated)}</span>
      </div>
    </div>
  )
}

// Project Status (enhanced with blue theme)
function ProjectStatus({ project }: { project: ProjectData }) {
  const getStatusInfo = () => {
    if (project.vercel?.isLive) {
      return {
        icon: <Globe className="w-4 h-4" />,
        text: 'Live on Vercel',
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        dotColor: 'bg-green-500'
      }
    }
    
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
    
    return {
      icon: <Github className="w-4 h-4" />,
      text: 'Repository',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      dotColor: 'bg-blue-500'
    }
  }

  const status = getStatusInfo()

  return (
    <motion.div 
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div 
        className={`w-2 h-2 rounded-full ${status.dotColor}`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {status.icon}
      <span>{status.text}</span>
    </motion.div>
  )
}

// FIXED: Main Project Showcase - Remove visibleProjects limit
function ProjectShowcase() {
  const { projects, stats, loading, error, refetch } = useProjectsData()
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([])
  const [activeTag, setActiveTag] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'updated' | 'featured'>('featured')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  // FIXED: Remove visibleProjects limit - show ALL projects
  
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })
  const shouldReduceMotion = useReducedMotion()

  // Your existing filtering logic...
  useEffect(() => {
    if (!projects.length) return

    let filtered = [...projects]

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter)
    }

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

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.github.language?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

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

  const allTags = React.useMemo(() => {
    const tagSet = new Set(['All'])
    projects.forEach(project => {
      project.tags.forEach(tag => tagSet.add(tag))
      project.techStack.forEach(tech => tagSet.add(tech))
      project.github.topics.forEach(topic => tagSet.add(topic))
    })
    return Array.from(tagSet).slice(0, 20)
  }, [projects])

  const categories = React.useMemo(() => {
    const categorySet = new Set(['all'])
    projects.forEach(project => {
      if (project.category) {
        categorySet.add(project.category)
      }
    })
    return Array.from(categorySet)
  }, [projects])

  const handleCardClick = useCallback((project: ProjectData) => {
    if (project.vercel?.isLive && project.vercel.liveUrl) {
      window.open(project.vercel.liveUrl, '_blank', 'noopener,noreferrer')
      return
    }

    if (project.deploymentUrl) {
      window.open(project.deploymentUrl, '_blank', 'noopener,noreferrer')
      return
    }

    if (project.github.url) {
      window.open(project.github.url, '_blank', 'noopener,noreferrer')
    }
  }, [])

  if (loading) {
    return <PageLoading />
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
      {/* Success indicator with enhanced blue theme */}
      {projects.length > 0 && stats && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-700/50 max-w-4xl mx-auto shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✅
            </motion.div>
            <span className="text-sm font-medium">
              Successfully loaded ALL {projects.length} projects from GitHub
            </span>
          </div>
          
          {/* Enhanced Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalStars}
              </div>
              <div className="text-xs text-gray-500">Total Stars</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.liveProjects}
              </div>
              <div className="text-xs text-gray-500">Live Projects</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {stats.totalProjects}
              </div>
              <div className="text-xs text-gray-500">Total Projects</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {stats.topLanguages?.length || 0}
              </div>
              <div className="text-xs text-gray-500">Languages</div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Filters with blue theme */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 mb-12 shadow-lg"
      >
        {/* Search and Sort Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              type="text"
              placeholder="Search projects, technologies, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
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
              className="px-4 py-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
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
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
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

        {/* Enhanced Tag filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <motion.button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeTag === tag
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40'
                }`}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Results summary */}
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Showing {filteredProjects.length} of {projects.length} projects
            {activeTag !== 'All' && ` tagged with "${activeTag}"`}
            {categoryFilter !== 'all' && ` in ${categoryFilter} category`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      </motion.div>

      {/* Enhanced 3D Background Element */}
      {isInView && !shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-full blur-2xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </div>
      )}

      {/* FIXED: Projects Grid/List - Show ALL projects */}
      <motion.div
        layout
        className={`grid gap-8 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {/* FIXED: Show ALL filtered projects, not just a limited number */}
          {filteredProjects.map((project, index) => (
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

      {/* FIXED: Remove Load More Button since we show ALL projects */}
      {/* No more load more button needed */}

      {/* Enhanced Empty state */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-blue-400" />
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
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
            >
              Clear All Filters
            </motion.button>
            <motion.button
              onClick={refetch}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
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

// Main page component with enhanced theme
export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { isDark, particleConfig, backgroundClass } = useThemeAwareConfig()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, shouldReduceMotion ? 400 : 1000)
    return () => clearTimeout(timer)
  }, [shouldReduceMotion])

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className={`relative min-h-screen ${backgroundClass} transition-colors duration-500 overflow-x-hidden`}>
      {/* Enhanced Unified Background with blue/cyan theme */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 transition-colors duration-500 ${backgroundClass}`} />
        
        <div className="absolute inset-0">
          <div 
            className={`absolute inset-0 transition-opacity duration-500 ${
              isDark
                ? 'bg-gradient-to-br from-blue-900/10 via-cyan-900/5 to-teal-900/10'
                : 'bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-teal-50/40'
            }`}
          />
          <div 
            className={`absolute inset-0 transition-opacity duration-700 ${
              isDark
                ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.05)_0%,transparent_50%)]'
                : 'bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.04)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.03)_0%,transparent_50%)]'
            }`}
          />
        </div>
        
        {!shouldReduceMotion && (
          <Suspense fallback={null}>
            <div className="absolute inset-0 z-1">
              <ParticleField {...particleConfig} />
            </div>
          </Suspense>
        )}
      </div>

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-[1000]">
        <Suspense fallback={<NavigationSkeleton />}>
          <Navigation />
        </Suspense>
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Enhanced Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6"
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.05, rotate: shouldReduceMotion ? 0 : 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                All Projects
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Discover my complete portfolio of projects, applications, and experiments. 
              Each project showcases different technologies, methodologies, and creative solutions 
              to real-world problems.
            </p>
            
            {/* Enhanced Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-8 text-sm text-gray-500 dark:text-gray-400"
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1, color: '#3b82f6' }}
              >
                <Code className="w-4 h-4 text-blue-500" />
                <span>Full-Stack Development</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1, color: '#10b981' }}
              >
                <Globe className="w-4 h-4 text-green-500" />
                <span>Live Deployments</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1, color: '#8b5cf6' }}
              >
                <Github className="w-4 h-4 text-purple-500" />
                <span>Open Source</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1, color: '#f59e0b' }}
              >
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span>Actively Maintained</span>
              </motion.div>
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