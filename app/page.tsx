'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import Navigation from '@/components/Navigation'
import { AnimatedHero } from '@/components/AnimatedHero'
import Footer from '@/components/Footer'
import { Suspense, useEffect, useState } from 'react'
import dynamicImport from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { EnhancedProject, PortfolioStats } from '@/lib/portfolio-integration'
import { Star, Gamepad2, Code, Zap, Globe, Rocket } from 'lucide-react'

// Dynamic imports for 3D components
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

const ScrollTriggered3DSections = dynamicImport(() => import('@/components/3D/ScrollTriggered3DSections'), { ssr: false })
const FloatingCodeBlocks = dynamicImport(() => import('@/components/3D/FloatingCodeBlocks'), { ssr: false })
const LanguageVisualization = dynamicImport(() => import('@/components/3D/LanguageVisualization'), { ssr: false })
const ParticleField = dynamicImport(() => import('@/components/3D/ParticleField'), { ssr: false })

export default function HomePage() {
  // State for real portfolio data
  const [projects, setProjects] = useState<EnhancedProject[]>([])
  const [stats, setStats] = useState<PortfolioStats>({
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
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real data client-side after component mounts
  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        console.log('🔄 Fetching portfolio data client-side...')
        
        // Fetch from your API routes instead of direct lib calls
        const [projectsRes, statsRes] = await Promise.all([
          fetch('/api/projects').then(res => res.ok ? res.json() : { projects: [] }),
          fetch('/api/portfolio-stats').then(res => res.ok ? res.json() : null)
        ])

        if (projectsRes?.projects) {
          setProjects(projectsRes.projects)
          console.log(`✅ Loaded ${projectsRes.projects.length} projects`)
        }

        if (statsRes) {
          setStats(statsRes)
          console.log('✅ Loaded portfolio stats')
        }

      } catch (err) {
        console.error('❌ Error fetching portfolio data:', err)
        setError('Unable to load portfolio data')
        
        // Set some default/mock data so the site still works
        setStats({
          totalProjects: 12,
          featuredProjects: 6,
          liveProjects: 8,
          totalStars: 150,
          totalForks: 45,
          languageStats: {
            'JavaScript': 35,
            'TypeScript': 25,
            'React': 20,
            'Python': 15,
            'Node.js': 5
          },
          categoryStats: {
            'fullstack': 5,
            'frontend': 4,
            'backend': 2,
            'mobile': 1
          },
          deploymentStats: { successful: 8, failed: 1, building: 1, pending: 2 },
          recentActivity: {
            lastCommit: new Date().toISOString(),
            lastDeployment: new Date().toISOString(),
            activeProjects: 6,
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolioData()
  }, [])

  // Process data for components
  const featuredProjects = projects.filter(project => project.featured)
  const heroProjects = projects.slice(0, 8)
  const heroProjectsFor3D = heroProjects.map(p => ({ ...p, title: p.name }))
  
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

  // Show loading state while fetching real data
  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-8"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Loading Portfolio</h2>
            <p className="text-white/80">Fetching projects from GitHub & Vercel...</p>
            {error && (
              <p className="text-red-400 mt-4 max-w-md mx-auto">
                {error} - Using fallback data
              </p>
            )}
          </div>
        </div>
      </>
    )
  }

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
        {/* Data Status Indicator */}
        {error && (
          <div className="fixed top-20 right-4 z-50 bg-yellow-500/90 text-black px-4 py-2 rounded-lg text-sm">
            Using demo data - API unavailable
          </div>
        )}

        {/* Stats Badge */}
        <div className="fixed top-20 left-4 z-50 bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm">
          {stats.totalProjects} Projects • {stats.totalStars} Stars • {stats.liveProjects} Live
        </div>

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

        {/* Tech Stack Section */}
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
                Real-time data from GitHub showing {Object.keys(stats.languageStats).length} technologies
              </p>
            </motion.div>

            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Code className="w-16 h-16 text-primary animate-pulse" /></div>}>
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
                Live GitHub statistics across {projects.length} active repositories
              </p>
            </motion.div>

            <Suspense fallback={<div className="h-96 flex items-center justify-center"><Zap className="w-16 h-16 text-primary animate-pulse" /></div>}>
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

// Helper functions (same as before)
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