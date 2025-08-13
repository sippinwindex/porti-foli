'use client'

import Navigation from '@/components/Navigation'
import { AnimatedHero } from '@/components/AnimatedHero'
import Footer from '@/components/Footer'
import { Suspense } from 'react'
import dynamicImport from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getEnhancedProjects, getPortfolioStats } from '@/lib/portfolio-integration'
import type { EnhancedProject, PortfolioStats } from '@/lib/portfolio-integration'
// FIX: Added more icons from lucide-react for the button and helpers
import { Star, Gamepad2, Code, Zap, Globe, Rocket } from 'lucide-react'

export const dynamic = 'force-dynamic'

// Dynamic imports for 3D components with better loading states
const Interactive3DHero = dynamicImport(
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

const ScrollTriggered3DSections = dynamicImport(
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

const FloatingCodeBlocks = dynamicImport(
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

const LanguageVisualization = dynamicImport(
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

const ParticleField = dynamicImport(
  () => import('@/components/3D/ParticleField'),
  {
    ssr: false,
    loading: () => null // Particles are background only
  }
)

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
    const [fetchedProjects, fetchedStats] = await Promise.all([
      getEnhancedProjects(),
      getPortfolioStats()
    ])
    projects = fetchedProjects
    stats = fetchedStats
  } catch (error) {
    console.error('❌ Error fetching GitHub data:', error)
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
                onBlockClick={(tech: string) => console.log(`Clicked ${tech}`)}
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

        <noscript>
          <AnimatedHero />
        </noscript>
        
        {/* Contact & Floating Button Sections */}
        {/* ... (rest of your page content) ... */}

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
                {/* FIX: Replaced emoji with a Lucide React icon */}
                <Rocket className="w-6 h-6 group-hover:animate-bounce" />
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

// FIX: Replaced emoji strings with Lucide React icon names
function getLanguageIcon(language: string): string {
  const iconMap: Record<string, string> = {
    'JavaScript': 'Zap',
    'TypeScript': 'Braces',
    'React': 'Atom',
    'Next.js': 'Triangle',
    'Node.js': 'Server',
    'Python': 'BrainCircuit',
    'HTML': 'Code2',
    'CSS': 'Palette',
    'Three.js': 'Box',
    'MongoDB': 'Leaf',
    'PostgreSQL': 'Database',
    'Redis': 'Container'
  }
  return iconMap[language] || 'Code'
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