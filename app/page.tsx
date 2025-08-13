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
import { Star, Gamepad2, Code, Zap, Globe } from 'lucide-react'

// Dynamic imports for 3D components with better loading states
const Interactive3DHero = dynamic(
  () => import('@/components/3D/Interactive3DHero'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
          <p className="text-white/80 animate-pulse">Loading 3D Experience...</p>
        </div>
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
        <div className="text-center animate-pulse">
          <div className="w-64 h-8 bg-white/20 rounded mb-4 mx-auto"></div>
          <div className="w-96 h-6 bg-white/10 rounded mx-auto"></div>
        </div>
      </div>
    )
  }
)

// Add the new 3D components
const FloatingCodeBlocks = dynamic(
  () => import('@/components/3D/FloatingCodeBlocks'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-viva-magenta-50/10 to-lux-gold-50/10 dark:from-viva-magenta-900/10 dark:to-lux-gold-900/10 flex items-center justify-center">
        <div className="text-center">
          <Code className="w-16 h-16 mx-auto mb-4 text-viva-magenta-500 animate-pulse" />
          <p className="text-lux-gray-600 dark:text-lux-gray-400">Loading Tech Stack...</p>
        </div>
      </div>
    )
  }
)

const LanguageVisualization = dynamic(
  () => import('@/components/3D/LanguageVisualization'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-lux-teal-50/10 to-viva-magenta-50/10 dark:from-lux-teal-900/10 dark:to-viva-magenta-900/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lux-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lux-gray-600 dark:text-lux-gray-400">Loading Language Stats...</p>
        </div>
      </div>
    )
  }
)

const ParticleField = dynamic(
  () => import('@/components/3D/ParticleField'),
  {
    ssr: false,
    loading: () => null // Particles are background only
  }
)

type ProjectCategory = "fullstack" | "frontend" | "backend" | "mobile" | "data" | "other";

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
    
    try {
      projects = await getEnhancedProjects()
      stats = await getPortfolioStats()
      console.log('⚠️ Using fallback data from portfolio integration')
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError)
      projects = []
    }
  }

  // Type-safe project filtering
  const featuredProjects: EnhancedProject[] = projects.filter(project => project.featured)
  const heroProjects: EnhancedProject[] = projects.slice(0, 8)

  const heroProjectsFor3D = heroProjects.map(p => ({
    ...p,
    title: p.name,
  }))

  // Prepare data for new 3D components
  const techStack = Object.keys(stats.languageStats || {}).slice(0, 8)
  const languageData = Object.entries(stats.languageStats || {}).map(([name, percentage]) => ({
    name,
    percentage,
    color: getLanguageColor(name),
    icon: getLanguageIcon(name),
    projects: projects.filter(p => 
      p.techStack.some(tech => tech.toLowerCase() === name.toLowerCase())
    ).length,
    experience: getLanguageExperience(name),
    proficiency: getLanguageProficiency(percentage) as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
    commits: Math.floor(percentage * 50)
  }))

  return (
    <>
      <Navigation />
      
      {/* Particle Field Background */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={null}>
          <ParticleField 
            particleCount={100}
            interactive={true}
            colorScheme="multi"
            animation="constellation"
            showConnections={true}
            mouseInfluence={120}
            speed={1}
          />
        </Suspense>
      </div>

      <main className="relative z-10">
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

        {/* Tech Stack Section with Floating Code Blocks */}
        <section id="skills" className="relative py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                My Tech{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Arsenal
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Explore the technologies I work with through interactive 3D code blocks
              </p>
            </motion.div>

            <Suspense fallback={
              <div className="h-96 flex items-center justify-center">
                <Code className="w-16 h-16 text-primary animate-pulse" />
              </div>
            }>
              <FloatingCodeBlocks 
                techStack={techStack}
                isVisible={true}
                onBlockClick={(tech) => console.log(`Clicked ${tech}`)}
              />
            </Suspense>
          </div>
        </section>

        {/* Language Visualization Section */}
        <section id="expertise" className="relative py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Language{' '}
                <span className="bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 bg-clip-text text-transparent">
                  Expertise
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Interactive visualization of my programming language proficiency
              </p>
            </motion.div>

            <Suspense fallback={
              <div className="h-96 flex items-center justify-center">
                <Zap className="w-16 h-16 text-primary animate-pulse" />
              </div>
            }>
              <LanguageVisualization 
                languages={languageData}
                showStats={true}
                interactive={true}
                layout="circle"
              />
            </Suspense>
          </div>
        </section>

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

        {/* Enhanced GitHub Stats Display */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Live GitHub{' '}
                <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent">
                  Integration
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Real-time data from my repositories and deployments
              </p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              <motion.div 
                className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stats.totalProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Projects</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {stats.totalStars}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">GitHub Stars</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {stats.liveProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Live Projects</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {stats.recentActivity.activeProjects}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
              </motion.div>
            </div>

            {/* Enhanced Real Projects Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.slice(0, 6).map((project, index) => (
                <motion.div 
                  key={project.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {project.github && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{project.github.stars}</span>
                        </div>
                      )}
                      {project.vercel?.isLive && (
                        <Globe className="w-4 h-4 text-green-500" />
                      )}
                    </div>
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
                      <motion.span 
                        className="text-xs text-green-600 dark:text-green-400 font-medium"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ● Live
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Let's Build{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  Something Amazing
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Ready to bring your ideas to life? Let's discuss your next project.
              </p>
              
              <motion.a
                href="mailto:stormblazdesign@gmail.com"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get In Touch</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>
            </motion.div>
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
              <div className="relative flex items-center justify-center">
                <span className="text-2xl group-hover:animate-bounce">🦕</span>
                <Gamepad2 className="w-3 h-3 absolute -top-1 -right-1 opacity-75" />
              </div>
              
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Play Synthwave Dino! 🎮
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>

              <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 animate-ping"></div>
            </motion.button>
          </Link>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}

// Helper functions for language data transformation
function getLanguageColor(language: string): string {
  const colorMap: Record<string, string> = {
    'JavaScript': '#F7DF1E',
    'TypeScript': '#3178C6',
    'React': '#61DAFB',
    'Next.js': '#000000',
    'Node.js': '#339933',
    'Python': '#3776AB',
    'HTML': '#E34F26',
    'CSS': '#1572B6',
    'Three.js': '#049EF4',
    'MongoDB': '#47A248',
    'PostgreSQL': '#336791',
    'Redis': '#DC382D'
  }
  return colorMap[language] || '#6B7280'
}

function getLanguageIcon(language: string): string {
  const iconMap: Record<string, string> = {
    'JavaScript': '⚡',
    'TypeScript': '🔷',
    'React': '⚛️',
    'Next.js': '▲',
    'Node.js': '🟢',
    'Python': '🐍',
    'HTML': '🏗️',
    'CSS': '🎨',
    'Three.js': '🎮',
    'MongoDB': '🍃',
    'PostgreSQL': '🐘',
    'Redis': '📦'
  }
  return iconMap[language] || '💻'
}

function getLanguageExperience(language: string): number {
  const experienceMap: Record<string, number> = {
    'JavaScript': 6,
    'TypeScript': 4,
    'React': 4,
    'Next.js': 3,
    'Node.js': 4,
    'Python': 5,
    'HTML': 6,
    'CSS': 6,
    'Three.js': 2,
    'MongoDB': 3,
    'PostgreSQL': 4,
    'Redis': 2
  }
  return experienceMap[language] || 1
}

function getLanguageProficiency(percentage: number): string {
  if (percentage >= 25) return 'Expert'
  if (percentage >= 15) return 'Advanced'
  if (percentage >= 8) return 'Intermediate'
  return 'Beginner'
}