'use client'

import Navigation from '@/components/Navigation'
import { AnimatedHero } from '@/components/AnimatedHero'
import Footer from '@/components/Footer'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getEnhancedProjects, getPortfolioStats } from '@/lib/portfolio-integration'
import type { EnhancedProject, PortfolioStats } from '@/lib/portfolio-integration'
import { Star, Gamepad2 } from 'lucide-react'

// Dynamic imports for 3D components
const Interactive3DHero = dynamic(
  () => import('@/components/3D/Interactive3DHero'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }
)

const ScrollTriggered3DSections = dynamic(
  () => import('@/components/3D/ScrollTriggered3DSections'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-900/50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-64 h-8 bg-white/20 rounded mb-4 mx-auto"></div>
          <div className="w-96 h-6 bg-white/10 rounded mx-auto"></div>
        </div>
      </div>
    )
  }
)

type ProjectCategory = "fullstack" | "frontend" | "backend" | "mobile" | "data" | "other";
const VALID_CATEGORIES: ProjectCategory[] = ["fullstack", "frontend", "backend", "mobile", "data", "other"];

const isProjectCategory = (category: any): category is ProjectCategory => {
  return typeof category === 'string' && VALID_CATEGORIES.includes(category as ProjectCategory);
};

export default async function HomePage() {
  // Fetch real data from GitHub API
  let projects: EnhancedProject[] = []
  let stats: PortfolioStats = {
    totalProjects: 0,
    featuredProjects: 0,
    liveProjects: 0,
    totalStars: 0,
    totalForks: 0,
    languageStats: {},
    categoryStats: {},
    deploymentStats: { successful: 0, failed: 0, building: 0, pending: 0 },
    recentActivity: {
      lastCommit: new Date().toISOString(),
      lastDeployment: new Date().toISOString(),
      activeProjects: 0,
    },
  }

  try {
    // Fetch real GitHub data using your portfolio integration
    console.log('🚀 Fetching real GitHub data...')
    
    const [fetchedProjects, fetchedStats] = await Promise.all([
      getEnhancedProjects(),
      getPortfolioStats()
    ])
    
    projects = fetchedProjects
    stats = fetchedStats
    
    console.log(`✅ Loaded ${projects.length} real projects from GitHub API`)
    console.log(`📊 Stats: ${stats.totalStars} stars, ${stats.liveProjects} live projects`)
    
  } catch (error) {
    console.error('❌ Error fetching GitHub data:', error)
    
    // The portfolio integration already handles fallback to mock data internally
    // So we still try to get the projects even if there's an error
    try {
      projects = await getEnhancedProjects()
      stats = await getPortfolioStats()
      console.log('⚠️ Using fallback data from portfolio integration')
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError)
      // Use basic fallback with empty data
      projects = []
      stats = {
        totalProjects: 0,
        featuredProjects: 0,
        liveProjects: 0,
        totalStars: 0,
        totalForks: 0,
        languageStats: {},
        categoryStats: {},
        deploymentStats: { successful: 0, failed: 0, building: 0, pending: 0 },
        recentActivity: {
          lastCommit: new Date().toISOString(),
          lastDeployment: new Date().toISOString(),
          activeProjects: 0,
        },
      }
    }
  }

  // Type-safe project filtering
  const featuredProjects: EnhancedProject[] = projects.filter(project => project.featured)
  const heroProjects: EnhancedProject[] = projects.slice(0, 8)

  const heroProjectsFor3D = heroProjects.map(p => ({
    ...p,
    title: p.name,
  }))

  return (
    <>
      <Navigation />
      <main className="relative">
        {/* 3D Interactive Hero Section */}
        <Suspense fallback={
          <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/80">Loading 3D Experience...</p>
            </div>
          </div>
        }>
          <Interactive3DHero projects={heroProjectsFor3D} />
        </Suspense>

        {/* Scroll-Triggered 3D Sections */}
        <Suspense fallback={
          <div className="min-h-screen bg-slate-900/50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/80">Loading Projects...</p>
            </div>
          </div>
        }>
          <ScrollTriggered3DSections projects={projects} stats={stats} />
        </Suspense>

        {/* Fallback to regular hero if 3D fails */}
        <noscript>
          <AnimatedHero />
        </noscript>

        {/* GitHub Stats Display */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Live GitHub Integration
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Real-time data from my repositories and deployments
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stats.totalProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
              </div>
              <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {stats.totalStars}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">GitHub Stars</div>
              </div>
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stats.liveProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Live Projects</div>
              </div>
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {stats.recentActivity.activeProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
              </div>
            </div>

            {/* Real Projects Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.slice(0, 6).map((project) => (
                <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    {project.github && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Star className="w-4 h-4" />
                        <span>{project.github.stars}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {project.github && (
                      <a
                        href={project.github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        View on GitHub
                      </a>
                    )}
                    {project.vercel?.isLive && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ● Live
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Floating Dino Game Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: 2,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Link href="/dinosaur">
            <motion.button
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -10, 10, -10, 0],
                transition: { duration: 0.5 }
              }}
              whileTap={{ scale: 0.9 }}
              className="group relative bg-gradient-to-r from-cyan-500 via-blue-500 to-magenta-500 hover:from-cyan-400 hover:via-blue-400 hover:to-magenta-400 text-white p-4 rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
              aria-label="Play Synthwave Dino Game"
            >
              {/* Cute dino using emoji + game icon combo */}
              <div className="relative flex items-center justify-center">
                <span className="text-2xl group-hover:animate-bounce">🦕</span>
                <Gamepad2 className="w-3 h-3 absolute -top-1 -right-1 opacity-75" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Play Synthwave Dino! 🎮
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>

              {/* Pulse animation ring */}
              <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 animate-ping"></div>
            </motion.button>
          </Link>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}