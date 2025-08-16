'use client'

'use client'

import React, { useState, useEffect, useRef } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ParticleField from '@/components/3D/ParticleField'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import { 
  ExternalLink, Github, Filter, Grid, List, Star, GitFork, 
  Calendar, Code, Zap, Search, TrendingUp, Eye, Clock 
} from 'lucide-react'
import usePortfolioData from '@/hooks/usePortfolioData'

function ProjectShowcase() {
  const { projects, loading, error, refetch } = usePortfolioData()
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [activeTag, setActiveTag] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'updated'>('updated')
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })

  // Update filtered projects when projects data changes
  useEffect(() => {
    let filtered = projects

    // Filter by tag
    if (activeTag !== 'All') {
      filtered = filtered.filter(project => 
        project.tags?.includes(activeTag) || 
        project.techStack?.includes(activeTag) ||
        project.github?.topics?.includes(activeTag.toLowerCase())
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'stars':
          return (b.github?.stars || 0) - (a.github?.stars || 0)
        case 'updated':
        default:
          return new Date(b.github?.lastUpdated || 0).getTime() - new Date(a.github?.lastUpdated || 0).getTime()
      }
    })

    setFilteredProjects(filtered)
  }, [projects, activeTag, searchTerm, sortBy])

  // Get all unique tags from projects
  const allTags = React.useMemo(() => {
    const tagSet = new Set(['All'])
    projects.forEach(project => {
      project.tags?.forEach(tag => tagSet.add(tag))
      project.techStack?.forEach(tech => tagSet.add(tech))
      project.github?.topics?.forEach(topic => tagSet.add(topic))
    })
    return Array.from(tagSet).slice(0, 15) // Limit to prevent overflow
  }, [projects])

  const ProjectCard: React.FC<{ project: any; index: number }> = ({ project, index }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })

    const handleMouseMove = (e: React.MouseEvent) => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const rotateX = (e.clientY - centerY) / 20
      const rotateY = (centerX - e.clientX) / 20
      
      const glowX = ((e.clientX - rect.left) / rect.width) * 100
      const glowY = ((e.clientY - rect.top) / rect.height) * 100
      
      setRotation({ x: rotateX, y: rotateY })
      setGlowPosition({ x: glowX, y: glowY })
    }

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 })
      setGlowPosition({ x: 50, y: 50 })
    }

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative ${
          viewMode === 'grid' 
            ? 'h-auto' 
            : 'flex flex-col sm:flex-row h-auto'
        }`}
      >
        <div className={`project-card-3d relative overflow-hidden transition-all duration-500 ${
          viewMode === 'list' ? 'sm:w-full flex' : ''
        }`}>
          
          {/* Dynamic Glow Effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(190, 52, 85, 0.3) 0%, transparent 70%)`
            }}
          />

          {/* Project Header/Image */}
          <div className={`relative ${
            viewMode === 'list' ? 'sm:w-1/3 h-48' : 'h-56'
          }`}>
            {/* Gradient placeholder with tech stack pattern */}
            <div className="w-full h-full bg-gradient-to-br from-viva-magenta-500/20 via-lux-gold-500/10 to-lux-teal-500/20 flex items-center justify-center relative overflow-hidden">
              <Code className="w-16 h-16 text-viva-magenta-400/40" />
              
              {/* Animated tech stack background */}
              <div className="absolute inset-0 opacity-10">
                {project.techStack?.slice(0, 3).map((tech: string, i: number) => (
                  <motion.div
                    key={tech}
                    className="absolute text-xs font-mono text-viva-magenta-600 dark:text-viva-magenta-400"
                    style={{
                      left: `${20 + i * 25}%`,
                      top: `${30 + i * 15}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Status badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {project.featured && (
                <motion.span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-lux-gold-100 dark:bg-lux-gold-900/30 text-lux-gold-800 dark:text-lux-gold-300 border border-lux-gold-200 dark:border-lux-gold-700"
                  whileHover={{ scale: 1.1 }}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </motion.span>
              )}
              {(project.liveUrl || project.vercel?.isLive) && (
                <motion.span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Live
                </motion.span>
              )}
            </div>

            {/* GitHub stats overlay */}
            {project.github && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <motion.div 
                  className="glass-card px-2 py-1 rounded-md text-xs text-lux-gray-700 dark:text-lux-gray-300 border border-lux-gray-200/50 dark:border-lux-gray-700/50"
                  whileHover={{ scale: 1.1 }}
                >
                  <Star className="w-3 h-3 inline mr-1" />
                  {project.github.stars}
                </motion.div>
                <motion.div 
                  className="glass-card px-2 py-1 rounded-md text-xs text-lux-gray-700 dark:text-lux-gray-300 border border-lux-gray-200/50 dark:border-lux-gray-700/50"
                  whileHover={{ scale: 1.1 }}
                >
                  <GitFork className="w-3 h-3 inline mr-1" />
                  {project.github.forks}
                </motion.div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col justify-between flex-1 relative z-10">
            <div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-viva-magenta-600 dark:group-hover:text-viva-magenta-400 transition-colors">
                {project.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </h3>
              <p className="text-lux-gray-600 dark:text-lux-gray-400 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>
              
              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack?.slice(0, 4).map((tech: string) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1 bg-viva-magenta-50 dark:bg-viva-magenta-900/30 text-viva-magenta-700 dark:text-viva-magenta-300 text-xs rounded-full border border-viva-magenta-200 dark:border-viva-magenta-800"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(190, 52, 85, 0.2)" }}
                  >
                    {tech}
                  </motion.span>
                ))}
                {project.techStack && project.techStack.length > 4 && (
                  <span className="px-3 py-1 bg-lux-gray-100 dark:bg-lux-gray-800 text-lux-gray-600 dark:text-lux-gray-400 text-xs rounded-full">
                    +{project.techStack.length - 4}
                  </span>
                )}
              </div>

              {/* Detailed stats */}
              {project.github && (
                <div className="flex items-center gap-4 text-xs text-lux-gray-500 dark:text-lux-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(project.github.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  {project.github.language && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-viva-magenta-500" />
                      <span>{project.github.language}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                {project.githubUrl && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 glass-card rounded-full border border-lux-gray-200 dark:border-lux-gray-700 hover:border-viva-magenta-400 dark:hover:border-viva-magenta-600 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-4 h-4" />
                  </motion.a>
                )}
                {project.liveUrl && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 glass-card rounded-full border border-lux-gray-200 dark:border-lux-gray-700 hover:border-lux-teal-400 dark:hover:border-lux-teal-600 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                )}
              </div>
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  href={`/projects/${project.slug || project.id}`}
                  className="text-sm text-viva-magenta-600 dark:text-viva-magenta-400 hover:text-viva-magenta-700 dark:hover:text-viva-magenta-300 font-medium transition-colors"
                >
                  View Details →
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Scan line effect on hover */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-viva-magenta-500 to-transparent opacity-0 group-hover:opacity-100"
            animate={{
              top: ['0%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-viva-magenta-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-2xl font-bold text-lux-gray-900 dark:text-lux-gray-50 mb-2">
            Loading Projects
          </h2>
          <p className="text-lux-gray-600 dark:text-lux-gray-400">
            Fetching projects from GitHub and Vercel...
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
          className="text-center p-8 glass-card rounded-2xl border border-red-200 dark:border-red-800 max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Failed to Load Projects
          </h2>
          <p className="text-lux-gray-600 dark:text-lux-gray-400 mb-4">
            {error}
          </p>
          <motion.button
            onClick={refetch}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div ref={containerRef}>
      {/* Success indicator */}
      {projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 p-4 glass-card rounded-xl border border-green-200 dark:border-green-800 max-w-md mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
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
        </motion.div>
      )}

      {/* Enhanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6 border border-lux-gray-200/50 dark:border-lux-gray-700/50 mb-12"
      >
        {/* Search and Sort */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-lux-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-lux-gray-50 dark:bg-lux-gray-800 border border-lux-gray-200 dark:border-lux-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-viva-magenta-500 transition-all duration-300"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-lux-gray-50 dark:bg-lux-gray-800 border border-lux-gray-200 dark:border-lux-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-viva-magenta-500"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="name">Name</option>
            </select>
            
            <div className="flex gap-2">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-viva-magenta-500 text-white' 
                    : 'bg-lux-gray-100 dark:bg-lux-gray-800 text-lux-gray-600 dark:text-lux-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-viva-magenta-500 text-white' 
                    : 'bg-lux-gray-100 dark:bg-lux-gray-800 text-lux-gray-600 dark:text-lux-gray-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2">
          <Filter className="w-5 h-5 mr-2 text-lux-gray-400 mt-2" />
          {allTags.map(tag => (
            <motion.button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTag === tag
                  ? 'bg-viva-magenta-500 text-white shadow-lg'
                  : 'bg-lux-gray-100 dark:bg-lux-gray-800 text-lux-gray-600 dark:text-lux-gray-400 hover:bg-lux-gray-200 dark:hover:bg-lux-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.button>
          ))}
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
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-lux-gray-100 dark:bg-lux-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-lux-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-lux-gray-900 dark:text-lux-gray-50 mb-2">
            No projects found
          </h3>
          <p className="text-lux-gray-600 dark:text-lux-gray-400 mb-6">
            No projects match your current filters for "{activeTag}" {searchTerm && `and "${searchTerm}"`}.
          </p>
          <motion.button
            onClick={() => {
              setActiveTag('All')
              setSearchTerm('')
            }}
            className="px-6 py-3 bg-viva-magenta-500 text-white rounded-xl hover:bg-viva-magenta-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Filters
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

// Main page component
export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      
      {/* Particle Field Background */}
      <div className="fixed inset-0 z-0">
        <ParticleField 
          particleCount={50}
          colorScheme="viva-magenta"
          animation="float"
          interactive={false}
          speed={0.5}
        />
      </div>

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
                className="inline-flex items-center gap-2 px-4 py-2 bg-viva-magenta-50 dark:bg-viva-magenta-900/30 text-viva-magenta-700 dark:text-viva-magenta-300 rounded-full border border-viva-magenta-200 dark:border-viva-magenta-700 mb-6"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Live GitHub Integration</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                My{' '}
                <span className="bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-600 bg-clip-text text-transparent">
                  Projects
                </span>
              </h1>
              <p className="text-xl text-lux-gray-600 dark:text-lux-gray-300 max-w-3xl mx-auto leading-relaxed">
                A collection of projects showcasing my skills in full-stack development, 
                fetched live from GitHub and Vercel with real-time deployment status.
              </p>
            </motion.div>
            
            <ProjectShowcase />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}