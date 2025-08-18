'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Linkedin, 
  Github, 
  ExternalLink, 
  Download, 
  ArrowRight, 
  Code, 
  Star, 
  GitBranch,
  Calendar,
  Play,
  Zap,
  Award,
  Users,
  TrendingUp,
  Globe,
  Menu,
  X,
  Loader
} from 'lucide-react'

// Regular imports (keep lightweight components)
import ThemeToggle from '@/components/ThemeToggle'

// Lazy load heavy 3D components with loading states
const Enhanced3DNavigation = dynamic(
  () => import('@/components/3D/Enhanced3DNavigation'),
  { 
    ssr: false,
    loading: () => <NavigationSkeleton />
  }
)

const Interactive3DHero = dynamic(
  () => import('@/components/3D/Interactive3DHero'),
  { 
    ssr: false,
    loading: () => <HeroSkeleton />
  }
)

const FloatingCodeBlocks = dynamic(
  () => import('@/components/3D/FloatingCodeBlocks'),
  { 
    ssr: false,
    loading: () => <CodeBlocksSkeleton />
  }
)

const LanguageVisualization = dynamic(
  () => import('@/components/3D/LanguageVisualization'),
  { 
    ssr: false,
    loading: () => <LanguageSkeleton />
  }
)

const ScrollTriggered3DSections = dynamic(
  () => import('@/components/3D/ScrollTriggered3DSections'),
  { 
    ssr: false,
    loading: () => <ProjectsSkeleton />
  }
)

const ParticleField = dynamic(
  () => import('@/components/3D/ParticleField'),
  { 
    ssr: false,
    loading: () => null // No loading state for background element
  }
)

// Loading Skeletons for each component
function NavigationSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4 bg-lux-offwhite/80 dark:bg-lux-black/80 backdrop-blur-md border-b border-lux-gray-200/50 dark:border-lux-gray-700/50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-32 h-8 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-8 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </nav>
  )
}

function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-48 h-8 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-full mb-6 animate-pulse" />
            <div className="w-full h-16 bg-lux-gray-200 dark:bg-lux-gray-800 rounded mb-4 animate-pulse" />
            <div className="w-3/4 h-12 bg-lux-gray-200 dark:bg-lux-gray-800 rounded mb-6 animate-pulse" />
            <div className="space-y-2 mb-8">
              <div className="w-full h-4 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
              <div className="w-5/6 h-4 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
            </div>
            <div className="flex gap-4">
              <div className="w-32 h-12 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-lg animate-pulse" />
              <div className="w-32 h-12 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="w-full h-96 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function CodeBlocksSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 text-viva-magenta-500 animate-spin mx-auto mb-4" />
        <p className="text-lux-gray-600 dark:text-lux-gray-400">Loading Code Showcase...</p>
      </div>
    </div>
  )
}

function LanguageSkeleton() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="grid grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="w-40 h-40 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}

function ProjectsSkeleton() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="w-64 h-12 bg-lux-gray-200 dark:bg-lux-gray-800 rounded mx-auto mb-16 animate-pulse" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Main page loading component
function PageLoading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-lux-black via-viva-magenta-900/20 to-lux-gold-900/20 flex items-center justify-center z-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-viva-magenta-500 border-t-transparent"></div>
        <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-2 border-lux-gold-400 opacity-30"></div>
        <div className="absolute inset-4 flex items-center justify-center">
          <Code className="w-8 h-8 text-viva-magenta-400 animate-pulse" />
        </div>
      </div>
      <motion.p 
        className="absolute bottom-20 text-lux-offwhite font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Initializing 3D Experience...
      </motion.p>
    </div>
  )
}

// Data (same as before)
const featuredProjects = [
  {
    id: 'portfolio-3d',
    title: '3D Portfolio Experience',
    name: '3D Portfolio Experience',
    description: 'Immersive portfolio showcasing cutting-edge web technologies with Three.js, dynamic animations, and real-time GitHub integration.',
    techStack: ['Next.js', 'Three.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    github: {
      stars: 42,
      forks: 12,
      url: 'https://github.com/sippinwindex/portfolio'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://portfolio.vercel.app'
    },
    deploymentScore: 98,
    featured: true
  },
  {
    id: 'gamegraft',
    title: 'GameGraft',
    name: 'GameGraft',
    description: 'Game discovery platform with real-time API integration, advanced filtering, and dynamic user interfaces.',
    techStack: ['React', 'Flask', 'PostgreSQL', 'RAWG API'],
    github: {
      stars: 28,
      forks: 8,
      url: 'https://github.com/sippinwindex/gamegraft'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://gamegraft.vercel.app'
    },
    deploymentScore: 95,
    featured: true
  },
  {
    id: 'squadup',
    title: 'SquadUp',
    name: 'SquadUp',
    description: 'Gaming collaboration platform with real-time features, live voting system using Server-Sent Events.',
    techStack: ['React', 'Flask', 'JWT', 'SQLAlchemy', 'SSE'],
    github: {
      stars: 35,
      forks: 15,
      url: 'https://github.com/sippinwindex/squadup'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://squadup.vercel.app'
    },
    deploymentScore: 92,
    featured: true
  }
]

const portfolioStats = {
  totalProjects: featuredProjects.length,
  totalStars: featuredProjects.reduce((acc, p) => acc + (p.github?.stars || 0), 0),
  liveProjects: featuredProjects.filter(p => p.vercel?.isLive).length,
  recentActivity: {
    activeProjects: 3
  }
}

const languageData = [
  {
    name: 'TypeScript',
    percentage: 35,
    color: '#3178C6',
    icon: '⚡',
    projects: 12,
    experience: 3,
    proficiency: 'Expert' as const,
    commits: 1250
  },
  {
    name: 'React',
    percentage: 28,
    color: '#BE3455',
    icon: '⚛️',
    projects: 15,
    experience: 4,
    proficiency: 'Expert' as const,
    commits: 1100
  },
  {
    name: 'Next.js',
    percentage: 22,
    color: '#121212',
    icon: '▲',
    projects: 8,
    experience: 2,
    proficiency: 'Advanced' as const,
    commits: 890
  },
  {
    name: 'Node.js',
    percentage: 18,
    color: '#98A869',
    icon: '🟢',
    projects: 10,
    experience: 3,
    proficiency: 'Advanced' as const,
    commits: 750
  },
  {
    name: 'Python',
    percentage: 15,
    color: '#008080',
    icon: '🐍',
    projects: 6,
    experience: 2,
    proficiency: 'Intermediate' as const,
    commits: 420
  },
  {
    name: 'Three.js',
    percentage: 12,
    color: '#D4AF37',
    icon: '🎮',
    projects: 4,
    experience: 1,
    proficiency: 'Intermediate' as const,
    commits: 320
  }
]

const techStack = ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Three.js']

const contactOptions = [
  {
    icon: Mail,
    title: 'Email',
    description: 'jafernandez94@gmail.com',
    href: 'mailto:jafernandez94@gmail.com',
    color: 'from-viva-magenta-500 to-lux-gold-500'
  },
  {
    icon: Linkedin,
    title: 'LinkedIn',
    description: 'Connect professionally',
    href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
    color: 'from-viva-magenta-600 to-viva-magenta-700'
  },
  {
    icon: Github,
    title: 'GitHub',
    description: 'View my repositories',
    href: 'https://github.com/sippinwindex',
    color: 'from-lux-gray-700 to-lux-gray-900'
  }
]

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState('hero')
  const [isMobile, setIsMobile] = useState(false)
  const [sectionsInView, setSectionsInView] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initial loading
  useEffect(() => {
    // Shorter initial load for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Lazy load sections as they come into view
  useEffect(() => {
    const sections = ['hero', 'code-showcase', 'about', 'languages', 'projects', 'contact']
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id)
            setSectionsInView(prev => new Set(prev).add(entry.target.id))
          }
        })
      },
      { 
        threshold: 0.1,
        rootMargin: '100px 0px' // Load slightly before entering viewport
      }
    )

    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId)
      if (element && observerRef.current) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className="relative min-h-screen bg-lux-offwhite dark:bg-lux-black text-lux-gray-900 dark:text-lux-offwhite overflow-x-hidden">
      <style jsx global>{`
        /* Performance optimizations */
        * {
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        main {
          isolation: isolate;
        }
        
        section {
          position: relative;
          contain: layout style paint;
          will-change: auto;
        }
        
        #hero { z-index: 1; }
        #code-showcase { z-index: 2; }
        #about { z-index: 3; }
        #languages { z-index: 4; }
        #projects { z-index: 5; }
        #contact { z-index: 6; }
        
        .scroll-section {
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }
        
        @media (max-width: 768px) {
          .hero-particles,
          .hero-3d-background::before {
            display: none;
          }
          
          .glass-card {
            backdrop-filter: blur(8px);
          }
        }
      `}</style>

      {/* Lazy loaded Navigation */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Suspense fallback={<NavigationSkeleton />}>
          <Enhanced3DNavigation />
        </Suspense>
      </div>
      
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4" style={{ zIndex: 1001 }}>
        <ThemeToggle />
      </div>

      <main className="relative">
        {/* Hero Section */}
        <section id="hero" className="scroll-section relative min-h-screen">
          {/* Lazy load particles only when not mobile */}
          {!isMobile && (
            <div className="absolute inset-0" style={{ zIndex: 0 }}>
              <Suspense fallback={null}>
                <ParticleField 
                  particleCount={50}
                  colorScheme="multi"
                  animation="constellation"
                  showConnections={false}
                  interactive={false}
                  speed={0.5}
                />
              </Suspense>
            </div>
          )}
          
          {/* Lazy loaded Hero */}
          <div className="relative" style={{ zIndex: 1 }}>
            <Suspense fallback={<HeroSkeleton />}>
              <Interactive3DHero projects={featuredProjects} />
            </Suspense>
          </div>
        </section>

        {/* Code Showcase - Only load when scrolled near */}
        <section id="code-showcase" className="scroll-section relative min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-lux-offwhite/50 via-viva-magenta-50/10 to-lux-gold-50/10 dark:from-lux-black/50 dark:via-viva-magenta-900/5 dark:to-lux-gold-900/5" />
          
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <motion.h2 
                className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Interactive Code Showcase
              </motion.h2>
              <motion.p 
                className="text-xl text-lux-gray-600 dark:text-lux-gray-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Explore my technology stack through interactive 3D code blocks
              </motion.p>
            </div>
            
            {/* Only render when section is in view */}
            {sectionsInView.has('code-showcase') && (
              <Suspense fallback={<CodeBlocksSkeleton />}>
                <FloatingCodeBlocks 
                  techStack={techStack}
                  isVisible={currentSection === 'code-showcase'}
                  onBlockClick={(language) => {
                    console.log(`Clicked on ${language}`)
                  }}
                />
              </Suspense>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="scroll-section relative py-20 bg-gradient-to-br from-lux-offwhite via-viva-magenta-50/20 to-lux-gold-50/20 dark:from-lux-black dark:via-viva-magenta-900/10 dark:to-lux-gold-900/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-lux-gray-900 dark:text-lux-offwhite mb-8">
                About <span className="gradient-text">Me</span>
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-lux-gray-700 dark:text-lux-gray-300 mb-6 leading-relaxed">
                  Hi, I'm Juan A. Fernandez, a Full-Stack Developer based in Miami, Florida. 
                  With a strong foundation in software development and UI/UX design, I blend 
                  analytical precision from my background as a healthcare data analyst with 
                  creative, user-centered design from UX research.
                </p>
                <p className="text-lg text-lux-gray-600 dark:text-lux-gray-400 leading-relaxed">
                  I'm passionate about creating seamless digital experiences that prioritize 
                  accessibility and performance. I have hands-on experience developing applications 
                  that integrate real-time APIs, authentication systems, and dynamic interfaces.
                </p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { label: "Projects Built", value: "15+", icon: Code, color: "viva-magenta" },
                { label: "GitHub Stars", value: "105+", icon: Star, color: "lux-gold" },
                { label: "Years Experience", value: "5+", icon: Award, color: "lux-teal" },
                { label: "Happy Clients", value: "12+", icon: Users, color: "lux-sage" }
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    className="glass-card p-6 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-viva-magenta-600 dark:text-viva-magenta-400" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-lux-gray-600 dark:text-lux-gray-400">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Language Visualization - Only load when in view */}
        <section id="languages" className="scroll-section relative">
          <div className="text-center py-16">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Technology <span className="gradient-text">Mastery</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-lux-gray-600 dark:text-lux-gray-400 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Interactive visualization of my programming language proficiency
            </motion.p>
          </div>
          
          {sectionsInView.has('languages') && (
            <Suspense fallback={<LanguageSkeleton />}>
              <LanguageVisualization 
                languages={languageData}
                showStats={true}
                interactive={!isMobile}
                layout="circle"
              />
            </Suspense>
          )}
        </section>

        {/* Projects Section - Only load when in view */}
        <section id="projects" className="scroll-section relative">
          {sectionsInView.has('projects') && (
            <Suspense fallback={<ProjectsSkeleton />}>
              <ScrollTriggered3DSections 
                projects={featuredProjects}
                stats={portfolioStats}
              />
            </Suspense>
          )}
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-section relative py-20 bg-gradient-to-br from-lux-gray-50 via-viva-magenta-50/20 to-lux-gold-50/20 dark:from-lux-gray-900 dark:via-viva-magenta-900/10 dark:to-lux-gold-900/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Let's Build Something <span className="gradient-text">Amazing</span>
              </h2>
              <p className="text-xl text-lux-gray-700 dark:text-lux-gray-300 mb-12 max-w-3xl mx-auto">
                Ready to bring your ideas to life? I'm available for freelance projects 
                and full-time opportunities.
              </p>
            </motion.div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactOptions.map((contact, index) => {
                const IconComponent = contact.icon
                return (
                  <motion.a
                    key={contact.title}
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="glass-card p-8 text-center group transform transition-all duration-300 hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${contact.color} shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{contact.title}</h3>
                    <p className="text-lux-gray-600 dark:text-lux-gray-400">{contact.description}</p>
                  </motion.a>
                )
              })}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <motion.a
                href="mailto:jafernandez94@gmail.com"
                className="btn-primary inline-flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span>Start a Project</span>
                <ArrowRight className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-lux-black text-center py-8">
          <div className="container mx-auto px-4">
            <p className="text-lux-gray-400">
              © 2025 Juan Fernandez. Built with Next.js, Three.js, and ❤️
            </p>
          </div>
        </footer>
      </main>

      {/* Dino Game Button */}
      <motion.a
        href="/dinosaur"
        className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Play Synthwave Dino! 🎮"
      >
        <Play className="w-6 h-6" />
      </motion.a>
    </div>
  )
}