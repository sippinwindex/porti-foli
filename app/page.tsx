'use client'

import { Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
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
  Loader,
  ChevronUp
} from 'lucide-react'

// Type definitions - fixed to match component expectations
interface Project {
  id: string
  title: string
  name: string
  description: string
  techStack: string[]
  github?: {
    stars: number
    forks: number
    url: string
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
  }
  deploymentScore?: number
  featured: boolean // Required - matches Interactive3DHero expectations
  category?: string
  lastUpdated?: string
}

interface LanguageData {
  name: string
  percentage: number
  color: string
  icon: string
  projects: number
  experience: number
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  commits?: number
}

interface ContactOption {
  icon: React.ElementType
  title: string
  description: string
  href: string
  color: string
}

interface PortfolioStats {
  totalProjects: number
  totalStars: number
  liveProjects: number
  totalForks?: number
  topLanguages?: string[]
  recentActivity: {
    activeProjects: number
  }
}

// Regular imports (keep lightweight components)
import ThemeToggle from '@/components/ThemeToggle'

// Enhanced dynamic imports with better error boundaries
const Enhanced3DNavigation = dynamic(
  () => import('@/components/3D/Enhanced3DNavigation').catch(() => import('@/components/Navigation')),
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
    loading: () => null
  }
)

// Enhanced Loading Skeletons with better visual hierarchy
function NavigationSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4 bg-lux-offwhite/90 dark:bg-lux-black/90 backdrop-blur-lg border-b border-lux-gray-200/50 dark:border-lux-gray-700/50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-viva-magenta-200 to-lux-gold-200 dark:from-viva-magenta-800 dark:to-lux-gold-800 rounded-xl animate-pulse" />
          <div className="w-32 h-6 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
        </div>
        <div className="hidden lg:flex items-center gap-2 bg-lux-gray-100/50 dark:bg-lux-gray-800/50 rounded-xl p-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-16 h-8 bg-lux-gray-200 dark:bg-lux-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-6 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-full animate-pulse" />
          <div className="w-24 h-8 bg-gradient-to-r from-viva-magenta-200 to-lux-gold-200 dark:from-viva-magenta-800 dark:to-lux-gold-800 rounded-lg animate-pulse" />
        </div>
      </div>
    </nav>
  )
}

function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-48 h-8 bg-gradient-to-r from-viva-magenta-200 to-lux-gold-200 dark:from-viva-magenta-800 dark:to-lux-gold-800 rounded-full animate-pulse" />
            <div className="space-y-4">
              <div className="w-full h-16 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-lg animate-pulse" />
              <div className="w-3/4 h-12 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
              <div className="w-5/6 h-4 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
              <div className="w-4/5 h-4 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="w-36 h-12 bg-gradient-to-r from-viva-magenta-200 to-lux-gold-200 dark:from-viva-magenta-800 dark:to-lux-gold-800 rounded-lg animate-pulse" />
              <div className="w-32 h-12 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-lg animate-pulse" />
            </div>
            <div className="flex gap-3 pt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-lux-gray-200 to-lux-gray-300 dark:from-lux-gray-800 dark:to-lux-gray-700 rounded-2xl animate-pulse" />
            <div className="absolute top-4 right-4 w-16 h-16 bg-lux-gray-300 dark:bg-lux-gray-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CodeBlocksSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="text-center">
        <div className="relative mb-6">
          <Loader className="w-16 h-16 text-viva-magenta-500 animate-spin mx-auto" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-lux-gold-300 border-t-transparent rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
        </div>
        <p className="text-lg text-lux-gray-600 dark:text-lux-gray-400 mb-2">Loading Interactive Code Showcase...</p>
        <p className="text-sm text-lux-gray-500 dark:text-lux-gray-500">Initializing 3D environment</p>
      </div>
      
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="absolute w-32 h-24 bg-lux-gray-200/30 dark:bg-lux-gray-800/30 rounded-lg animate-pulse"
            style={{
              left: `${15 + (i * 12)}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>
    </div>
  )
}

function LanguageSkeleton() {
  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="w-64 h-8 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-lg animate-pulse mx-auto mb-4" />
        <div className="w-48 h-4 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse mx-auto" />
      </div>
      
      {/* Circular arrangement skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96">
          {[1, 2, 3, 4, 5, 6].map(i => {
            const angle = (i / 6) * Math.PI * 2
            const radius = 150
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            
            return (
              <div
                key={i}
                className="absolute w-32 h-32 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-2xl animate-pulse"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            )
          })}
          
          {/* Center element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-viva-magenta-200 to-lux-gold-200 dark:from-viva-magenta-800 dark:to-lux-gold-800 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function ProjectsSkeleton() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="w-64 h-12 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="w-96 h-6 bg-lux-gray-200 dark:bg-lux-gray-800 rounded mx-auto animate-pulse" />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-4">
              <div className="h-48 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-t-2xl animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="w-3/4 h-6 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
                  <div className="w-5/6 h-4 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="w-16 h-6 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-full animate-pulse" />
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <div className="flex-1 h-10 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-lg animate-pulse" />
                  <div className="w-10 h-10 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats section skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="text-center p-6 bg-lux-gray-100/50 dark:bg-lux-gray-800/50 rounded-2xl">
              <div className="w-12 h-12 bg-lux-gray-200 dark:bg-lux-gray-700 rounded-full mx-auto mb-4 animate-pulse" />
              <div className="w-16 h-8 bg-lux-gray-200 dark:bg-lux-gray-700 rounded mx-auto mb-2 animate-pulse" />
              <div className="w-20 h-4 bg-lux-gray-200 dark:bg-lux-gray-700 rounded mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Enhanced main page loading component
function PageLoading() {
  const [loadingText, setLoadingText] = useState('Initializing...')
  
  useEffect(() => {
    const messages = [
      'Initializing...',
      'Loading 3D Environment...',
      'Preparing Interactive Elements...',
      'Almost Ready...'
    ]
    
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % messages.length
      setLoadingText(messages[index])
    }, 800)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-lux-black via-viva-magenta-900/20 to-lux-gold-900/20 flex items-center justify-center z-50">
      <div className="relative text-center">
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-viva-magenta-500 border-t-transparent"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-2 border-lux-gold-400 opacity-30"></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <Code className="w-8 h-8 text-viva-magenta-400 animate-pulse" />
          </div>
        </div>
        
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-lux-offwhite font-medium text-lg">{loadingText}</p>
          <div className="w-64 h-1 bg-lux-gray-800 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-viva-magenta-500 to-lux-gold-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Shared interfaces - ensure compatibility with component types
interface Project {
  id: string
  title: string
  name: string
  description: string
  techStack: string[]
  github?: {
    stars: number
    forks: number
    url: string
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
  }
  deploymentScore?: number
  featured: boolean // Required to match Interactive3DHero expectations
  category?: string
  lastUpdated?: string
}

interface LanguageData {
  name: string
  percentage: number
  color: string
  icon: string
  projects: number
  experience: number
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  commits?: number
}

interface ContactOption {
  icon: React.ElementType
  title: string
  description: string
  href: string
  color: string
}

// Memoized data to prevent recreation - with proper typing
const FEATURED_PROJECTS: Project[] = [
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
] as const

const LANGUAGE_DATA: LanguageData[] = [
  {
    name: 'TypeScript',
    percentage: 35,
    color: '#3178C6',
    icon: '⚡',
    projects: 12,
    experience: 3,
    proficiency: 'Expert',
    commits: 1250
  },
  {
    name: 'React',
    percentage: 28,
    color: '#BE3455',
    icon: '⚛️',
    projects: 15,
    experience: 4,
    proficiency: 'Expert',
    commits: 1100
  },
  {
    name: 'Next.js',
    percentage: 22,
    color: '#121212',
    icon: '▲',
    projects: 8,
    experience: 2,
    proficiency: 'Advanced',
    commits: 890
  },
  {
    name: 'Node.js',
    percentage: 18,
    color: '#98A869',
    icon: '🟢',
    projects: 10,
    experience: 3,
    proficiency: 'Advanced',
    commits: 750
  },
  {
    name: 'Python',
    percentage: 15,
    color: '#008080',
    icon: '🐍',
    projects: 6,
    experience: 2,
    proficiency: 'Intermediate',
    commits: 420
  },
  {
    name: 'Three.js',
    percentage: 12,
    color: '#D4AF37',
    icon: '🎮',
    projects: 4,
    experience: 1,
    proficiency: 'Intermediate',
    commits: 320
  }
]

const CONTACT_OPTIONS: ContactOption[] = [
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
  const [sectionsInView, setSectionsInView] = useState<Set<string>>(new Set(['hero']))
  const [showScrollTop, setShowScrollTop] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const shouldReduceMotion = useReducedMotion()

  // Memoized derived data
  const portfolioStats = useMemo(() => ({
    totalProjects: FEATURED_PROJECTS.length,
    totalStars: FEATURED_PROJECTS.reduce((acc, p) => acc + (p.github?.stars || 0), 0),
    liveProjects: FEATURED_PROJECTS.filter(p => p.vercel?.isLive).length,
    recentActivity: {
      activeProjects: 3
    }
  }), [])

  const techStack = useMemo(() => 
    ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Three.js'], []
  )

  // Enhanced mobile detection with resize throttling
  useEffect(() => {
    let ticking = false
    
    const checkMobile = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsMobile(window.innerWidth < 768)
          ticking = false
        })
        ticking = true
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Enhanced loading with preload hints
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, shouldReduceMotion ? 500 : 1500)
    
    return () => clearTimeout(timer)
  }, [shouldReduceMotion])

  // Enhanced scroll tracking with throttling
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 600)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Enhanced intersection observer with better performance
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
        rootMargin: isMobile ? '50px 0px' : '100px 0px' // Smaller margin on mobile
      }
    )

    // Use requestIdleCallback for better performance
    const observeSections = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          sections.forEach(sectionId => {
            const element = document.getElementById(sectionId)
            if (element && observerRef.current) {
              observerRef.current.observe(element)
            }
          })
        })
      } else {
        sections.forEach(sectionId => {
          const element = document.getElementById(sectionId)
          if (element && observerRef.current) {
            observerRef.current.observe(element)
          }
        })
      }
    }

    observeSections()

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isMobile])

  // Enhanced error boundary for dynamic imports
  const handleError = useCallback((error: Error) => {
    console.error('Component loading error:', error)
    // Could add error reporting here
  }, [])

  // Scroll to top functionality
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth'
    })
  }, [shouldReduceMotion])

  // Track analytics for section views
  const trackSectionView = useCallback((sectionId: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'section_view', {
        section_name: sectionId,
        page_title: 'Homepage'
      })
    }
  }, [])

  useEffect(() => {
    trackSectionView(currentSection)
  }, [currentSection, trackSectionView])

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className="relative min-h-screen bg-lux-offwhite dark:bg-lux-black text-lux-gray-900 dark:text-lux-offwhite overflow-x-hidden">
      <style jsx global>{`
        /* Enhanced performance optimizations */
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
        
        /* Improved z-index stacking */
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
        
        /* Enhanced mobile optimizations */
        @media (max-width: 768px) {
          .hero-particles,
          .hero-3d-background::before,
          .floating-code-blocks {
            display: none;
          }
          
          .glass-card {
            backdrop-filter: blur(8px);
          }
          
          section {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        /* Prefers reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Enhanced loading performance */
        .loading-skeleton {
          background: linear-gradient(90deg, 
            rgba(var(--lux-gray-200), 0.2) 25%, 
            rgba(var(--lux-gray-200), 0.4) 50%, 
            rgba(var(--lux-gray-200), 0.2) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Enhanced Navigation with error boundary */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Suspense fallback={<NavigationSkeleton />}>
          <Enhanced3DNavigation />
        </Suspense>
      </div>
      
      {/* Enhanced Theme Toggle */}
      <div className="fixed top-4 right-4" style={{ zIndex: 1001 }}>
        <ThemeToggle />
      </div>

      <main className="relative">
        {/* Hero Section with enhanced loading */}
        <section id="hero" className="scroll-section relative min-h-screen">
          {/* Optimized particle field loading */}
          {!isMobile && !shouldReduceMotion && (
            <div className="absolute inset-0" style={{ zIndex: 0 }}>
              <Suspense fallback={null}>
                <ParticleField 
                  particleCount={30}
                  colorScheme="multi"
                  animation="constellation"
                  showConnections={false}
                  interactive={false}
                  speed={0.5}
                />
              </Suspense>
            </div>
          )}
          
          <div className="relative" style={{ zIndex: 1 }}>
            <Suspense fallback={<HeroSkeleton />}>
              <Interactive3DHero projects={FEATURED_PROJECTS} />
            </Suspense>
          </div>
        </section>

        {/* Code Showcase with optimized loading */}
        <section id="code-showcase" className="scroll-section relative min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-lux-offwhite/50 via-viva-magenta-50/10 to-lux-gold-50/10 dark:from-lux-black/50 dark:via-viva-magenta-900/5 dark:to-lux-gold-900/5" />
          
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <motion.h2 
                className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
              >
                Interactive Code Showcase
              </motion.h2>
              <motion.p 
                className="text-xl text-lux-gray-600 dark:text-lux-gray-400"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
              >
                Explore my technology stack through interactive 3D code blocks
              </motion.p>
            </div>
            
            {sectionsInView.has('code-showcase') && !isMobile && (
              <Suspense fallback={<CodeBlocksSkeleton />}>
                <FloatingCodeBlocks 
                  techStack={techStack}
                  isVisible={currentSection === 'code-showcase'}
                  onBlockClick={(language) => {
                    console.log(`Clicked on ${language}`)
                    trackSectionView(`code-block-${language}`)
                  }}
                />
              </Suspense>
            )}
            
            {/* Mobile fallback */}
            {isMobile && sectionsInView.has('code-showcase') && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech}
                    className="p-6 glass-card rounded-xl text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="font-medium">{tech}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Enhanced About Section */}
        <section id="about" className="scroll-section relative py-20 bg-gradient-to-br from-lux-offwhite via-viva-magenta-50/20 to-lux-gold-50/20 dark:from-lux-black dark:via-viva-magenta-900/10 dark:to-lux-gold-900/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
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

            {/* Enhanced Stats Cards */}
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
                    className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.1 }}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-viva-magenta-100 to-viva-magenta-200 dark:from-viva-magenta-800 dark:to-viva-magenta-900">
                        <IconComponent className="w-6 h-6 text-viva-magenta-600 dark:text-viva-magenta-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2 gradient-text">{stat.value}</div>
                    <div className="text-sm text-lux-gray-600 dark:text-lux-gray-400 font-medium">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Language Visualization */}
        <section id="languages" className="scroll-section relative">
          <div className="text-center py-16">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-8"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
            >
              Technology <span className="gradient-text">Mastery</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-lux-gray-600 dark:text-lux-gray-400 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
            >
              Interactive visualization of my programming language proficiency
            </motion.p>
          </div>
          
          {sectionsInView.has('languages') && (
            <Suspense fallback={<LanguageSkeleton />}>
              <LanguageVisualization 
                languages={LANGUAGE_DATA}
                showStats={true}
                interactive={!isMobile && !shouldReduceMotion}
                layout="circle"
              />
            </Suspense>
          )}
        </section>

        {/* Enhanced Projects Section */}
        <section id="projects" className="scroll-section relative">
          {sectionsInView.has('projects') && (
            <Suspense fallback={<ProjectsSkeleton />}>
              <ScrollTriggered3DSections 
                projects={FEATURED_PROJECTS}
                stats={portfolioStats}
              />
            </Suspense>
          )}
        </section>

        {/* Enhanced Contact Section */}
        <section id="contact" className="scroll-section relative py-20 bg-gradient-to-br from-lux-gray-50 via-viva-magenta-50/20 to-lux-gold-50/20 dark:from-lux-gray-900 dark:via-viva-magenta-900/10 dark:to-lux-gold-900/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Let's Build Something <span className="gradient-text">Amazing</span>
              </h2>
              <p className="text-xl text-lux-gray-700 dark:text-lux-gray-300 mb-12 max-w-3xl mx-auto">
                Ready to bring your ideas to life? I'm available for freelance projects 
                and full-time opportunities.
              </p>
            </motion.div>

            {/* Enhanced Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {CONTACT_OPTIONS.map((contact, index) => {
                const IconComponent = contact.icon
                return (
                  <motion.a
                    key={contact.title}
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="glass-card p-8 text-center group transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
                    onClick={() => trackSectionView(`contact-${contact.title.toLowerCase()}`)}
                  >
                    <div className="flex justify-center mb-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${contact.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-viva-magenta-600 dark:group-hover:text-viva-magenta-400 transition-colors">
                      {contact.title}
                    </h3>
                    <p className="text-lux-gray-600 dark:text-lux-gray-400 group-hover:text-lux-gray-700 dark:group-hover:text-lux-gray-300 transition-colors">
                      {contact.description}
                    </p>
                  </motion.a>
                )
              })}
            </div>

            {/* Enhanced CTA Button */}
            <div className="text-center">
              <motion.a
                href="mailto:jafernandez94@gmail.com"
                className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                onClick={() => trackSectionView('cta-button')}
              >
                <span>Start a Project</span>
                <ArrowRight className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-lux-black text-center py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-lux-gray-400 mb-4 md:mb-0">
                © 2025 Juan Fernandez. Built with Next.js, Three.js, and ❤️
              </p>
              <div className="flex gap-4">
                <a href="/privacy" className="text-lux-gray-400 hover:text-lux-gray-300 transition-colors text-sm">
                  Privacy
                </a>
                <a href="/terms" className="text-lux-gray-400 hover:text-lux-gray-300 transition-colors text-sm">
                  Terms
                </a>
                <a href="/sitemap.xml" className="text-lux-gray-400 hover:text-lux-gray-300 transition-colors text-sm">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Enhanced Floating Actions */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              onClick={scrollToTop}
              className="p-3 bg-lux-gray-800 dark:bg-lux-gray-200 text-lux-gray-200 dark:text-lux-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Dino Game Button */}
        <motion.a
          href="/dinosaur"
          className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
          title="Play Synthwave Dino! 🎮"
          onClick={() => trackSectionView('dino-game-fab')}
        >
          <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </motion.a>
      </div>
    </div>
  )
}