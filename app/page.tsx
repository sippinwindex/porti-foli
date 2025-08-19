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
  ChevronUp,
  Briefcase,
  Heart,
  Coffee,
  Clock
} from 'lucide-react'

// Enhanced Type definitions with better structure
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
  featured: boolean
  category?: string
  lastUpdated?: string
  imageUrl?: string
  demoVideo?: string
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
  frameworks?: string[]
}

interface ContactOption {
  icon: React.ElementType
  title: string
  description: string
  href: string
  color: string
  external?: boolean
}

interface PortfolioStats {
  totalProjects: number
  totalStars: number
  liveProjects: number
  totalForks?: number
  topLanguages?: string[]
  totalCommits?: number
  yearsExperience?: number
  recentActivity: {
    activeProjects: number
    lastCommit?: string
  }
}

interface SectionVisibility {
  hero: boolean
  codeShowcase: boolean
  about: boolean
  languages: boolean
  projects: boolean
  contact: boolean
}

// Navigation component import
import Navigation from '@/components/Navigation'

// Enhanced Dynamic imports with better error handling and types
const Interactive3DHero = dynamic(
  () => import('@/components/3D/Interactive3DHero').catch(() => {
    console.warn('Failed to load Interactive3DHero, using fallback')
    return { default: () => <HeroSkeleton /> }
  }),
  { 
    ssr: false,
    loading: () => <HeroSkeleton />
  }
)

const FloatingCodeBlocks = dynamic(
  () => import('@/components/3D/FloatingCodeBlocks').catch(() => {
    console.warn('Failed to load FloatingCodeBlocks, using fallback')
    return { default: () => <CodeBlocksSkeleton /> }
  }),
  { 
    ssr: false,
    loading: () => <CodeBlocksSkeleton />
  }
)

const LanguageVisualization = dynamic(
  () => import('@/components/3D/LanguageVisualization').catch(() => {
    console.warn('Failed to load LanguageVisualization, using fallback')
    return { default: () => <LanguageSkeleton /> }
  }),
  { 
    ssr: false,
    loading: () => <LanguageSkeleton />
  }
)

const ScrollTriggered3DSections = dynamic(
  () => import('@/components/3D/ScrollTriggered3DSections').catch(() => {
    console.warn('Failed to load ScrollTriggered3DSections, using fallback')
    return { default: () => <ProjectsSkeleton /> }
  }),
  { 
    ssr: false,
    loading: () => <ProjectsSkeleton />
  }
)

const ParticleField = dynamic(
  () => import('@/components/3D/ParticleField').catch(() => {
    console.warn('Failed to load ParticleField, using fallback')
    return { default: () => null }
  }),
  { 
    ssr: false,
    loading: () => null
  }
)

// Enhanced Loading Skeletons with better animations
function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-48 h-8 bg-gradient-to-r from-viva-magenta-200 to-lux-gold-200 dark:from-viva-magenta-800 dark:to-lux-gold-800 rounded-full animate-pulse" />
            <div className="space-y-4">
              <div className="w-full h-16 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="w-3/4 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="w-5/6 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="w-4/5 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="flex gap-4 pt-4">
              <div className="w-36 h-12 bg-gradient-to-r from-viva-magenta-200 to-lux-gold-200 dark:from-viva-magenta-800 dark:to-lux-gold-800 rounded-lg animate-pulse" />
              <div className="w-32 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="w-12 h-12 text-viva-magenta-500 animate-spin" />
            </div>
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
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">Loading Interactive Code Showcase...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Initializing 3D environment</p>
      </div>
      
      {/* Background floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-24 bg-gray-200/30 dark:bg-gray-800/30 rounded-lg"
            style={{
              left: `${15 + (i * 12)}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}

function LanguageSkeleton() {
  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="w-64 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mx-auto mb-4" />
        <div className="w-48 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto" />
      </div>
      
      {/* Circular arrangement skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96">
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2
            const radius = 150
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            
            return (
              <motion.div
                key={i}
                className="absolute w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                animate={{
                  scale: [0.9, 1.1, 0.9],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )
          })}
          
          {/* Center element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-viva-magenta-500 to-lux-gold-500 rounded-full animate-pulse" />
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
          <div className="w-64 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="w-96 h-6 bg-gray-200 dark:bg-gray-800 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Enhanced Page Loading with progress tracking
function PageLoading() {
  const [loadingText, setLoadingText] = useState('Initializing...')
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const messages = [
      'Initializing...',
      'Loading 3D Environment...',
      'Preparing Interactive Elements...',
      'Setting up Animations...',
      'Almost Ready...'
    ]
    
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % messages.length
      setLoadingText(messages[index])
      setProgress((index + 1) * 20)
    }, 600)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-lux-black via-viva-magenta-900/20 to-lux-gold-900/20 flex items-center justify-center z-50">
      <div className="relative text-center max-w-md mx-auto px-4">
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-viva-magenta-500 border-t-transparent mx-auto"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-2 border-lux-gold-400 opacity-30 mx-auto"></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <Code className="w-8 h-8 text-viva-magenta-400 animate-pulse" />
          </div>
        </div>
        
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lux-offwhite font-medium text-lg">{loadingText}</p>
          <div className="w-full h-2 bg-lux-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-viva-magenta-500 to-lux-gold-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-lux-gray-400 text-sm">{progress}% Complete</p>
        </motion.div>
      </div>
    </div>
  )
}

// Enhanced Sample data with more comprehensive information
const FEATURED_PROJECTS: Project[] = [
  {
    id: 'portfolio-3d',
    title: '3D Interactive Portfolio',
    name: '3D Interactive Portfolio',
    description: 'Immersive portfolio showcasing cutting-edge web technologies with Three.js, dynamic animations, and real-time GitHub integration. Features advanced particle systems and interactive 3D elements.',
    techStack: ['Next.js', 'Three.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WebGL'],
    github: {
      stars: 47,
      forks: 15,
      url: 'https://github.com/sippinwindex/portfolio'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://portfolio.vercel.app'
    },
    deploymentScore: 98,
    featured: true,
    category: 'Portfolio',
    lastUpdated: '2025-01-15'
  },
  {
    id: 'gamegraft',
    title: 'GameGraft Discovery Platform',
    name: 'GameGraft',
    description: 'Comprehensive game discovery platform with real-time API integration, advanced filtering, dynamic user interfaces, and personalized recommendations powered by machine learning.',
    techStack: ['React', 'Flask', 'PostgreSQL', 'RAWG API', 'Redis', 'Docker'],
    github: {
      stars: 31,
      forks: 9,
      url: 'https://github.com/sippinwindex/gamegraft'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://gamegraft.vercel.app'
    },
    deploymentScore: 96,
    featured: true,
    category: 'Web App',
    lastUpdated: '2025-01-10'
  },
  {
    id: 'squadup',
    title: 'SquadUp Gaming Hub',
    name: 'SquadUp',
    description: 'Real-time gaming collaboration platform with live voting system, team formation tools, tournament brackets, and integrated voice chat using Server-Sent Events and WebSocket technology.',
    techStack: ['React', 'Flask', 'JWT', 'SQLAlchemy', 'SSE', 'WebSockets', 'AWS'],
    github: {
      stars: 38,
      forks: 18,
      url: 'https://github.com/sippinwindex/squadup'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://squadup.vercel.app'
    },
    deploymentScore: 94,
    featured: true,
    category: 'Gaming',
    lastUpdated: '2025-01-08'
  },
  {
    id: 'ai-dashboard',
    title: 'AI Analytics Dashboard',
    name: 'AI Analytics Dashboard',
    description: 'Advanced analytics dashboard with AI-powered insights, real-time data visualization, and predictive modeling for business intelligence.',
    techStack: ['Vue.js', 'Python', 'TensorFlow', 'D3.js', 'FastAPI', 'MongoDB'],
    github: {
      stars: 23,
      forks: 7,
      url: 'https://github.com/sippinwindex/ai-dashboard'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://ai-dashboard.vercel.app'
    },
    deploymentScore: 91,
    featured: true,
    category: 'AI/ML',
    lastUpdated: '2025-01-05'
  }
]

const LANGUAGE_DATA: LanguageData[] = [
  {
    name: 'TypeScript',
    percentage: 35,
    color: 'var(--primary-600)',
    icon: '⚡',
    projects: 15,
    experience: 3,
    proficiency: 'Expert',
    commits: 1380,
    frameworks: ['React', 'Next.js', 'Node.js', 'Express']
  },
  {
    name: 'React',
    percentage: 28,
    color: 'var(--viva-magenta)',
    icon: '⚛️',
    projects: 18,
    experience: 4,
    proficiency: 'Expert',
    commits: 1250,
    frameworks: ['Next.js', 'Gatsby', 'React Native']
  },
  {
    name: 'Next.js',
    percentage: 22,
    color: 'var(--lux-black)',
    icon: '▲',
    projects: 10,
    experience: 2,
    proficiency: 'Advanced',
    commits: 950,
    frameworks: ['App Router', 'Pages Router', 'API Routes']
  },
  {
    name: 'Node.js',
    percentage: 18,
    color: 'var(--lux-sage)',
    icon: '🟢',
    projects: 12,
    experience: 3,
    proficiency: 'Advanced',
    commits: 820,
    frameworks: ['Express', 'Fastify', 'NestJS']
  },
  {
    name: 'Python',
    percentage: 15,
    color: 'var(--lux-teal)',
    icon: '🐍',
    projects: 8,
    experience: 2,
    proficiency: 'Advanced',
    commits: 510,
    frameworks: ['Flask', 'Django', 'FastAPI']
  },
  {
    name: 'Three.js',
    percentage: 12,
    color: 'var(--lux-gold)',
    icon: '🎮',
    projects: 5,
    experience: 1,
    proficiency: 'Intermediate',
    commits: 380,
    frameworks: ['React Three Fiber', 'A-Frame', 'Babylon.js']
  }
]

const CONTACT_OPTIONS: ContactOption[] = [
  {
    icon: Mail,
    title: 'Email',
    description: 'jafernandez94@gmail.com',
    href: 'mailto:jafernandez94@gmail.com',
    color: 'from-viva-magenta-500 to-lux-gold-500',
    external: false
  },
  {
    icon: Linkedin,
    title: 'LinkedIn',
    description: 'Connect professionally',
    href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
    color: 'from-blue-600 to-blue-700',
    external: true
  },
  {
    icon: Github,
    title: 'GitHub',
    description: 'View my repositories',
    href: 'https://github.com/sippinwindex',
    color: 'from-gray-700 to-gray-900',
    external: true
  },
  {
    icon: Download,
    title: 'Resume',
    description: 'Download my CV',
    href: '/resume.pdf',
    color: 'from-emerald-600 to-emerald-700',
    external: false
  }
]

// Enhanced Main Component
export default function HomePage() {
  // State management with better typing
  const [isLoading, setIsLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState('hero')
  const [isMobile, setIsMobile] = useState(false)
  const [sectionsInView, setSectionsInView] = useState<SectionVisibility>({
    hero: true,
    codeShowcase: false,
    about: false,
    languages: false,
    projects: false,
    contact: false
  })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  
  // Refs for better performance
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReduceMotion = useReducedMotion()

  // Enhanced memoized calculations
  const portfolioStats = useMemo((): PortfolioStats => ({
    totalProjects: FEATURED_PROJECTS.length,
    totalStars: FEATURED_PROJECTS.reduce((acc, p) => acc + (p.github?.stars || 0), 0),
    liveProjects: FEATURED_PROJECTS.filter(p => p.vercel?.isLive).length,
    totalForks: FEATURED_PROJECTS.reduce((acc, p) => acc + (p.github?.forks || 0), 0),
    topLanguages: LANGUAGE_DATA.slice(0, 3).map(lang => lang.name),
    totalCommits: LANGUAGE_DATA.reduce((acc, lang) => acc + (lang.commits || 0), 0),
    yearsExperience: 5,
    recentActivity: {
      activeProjects: 4,
      lastCommit: '2025-01-15T10:30:00Z'
    }
  }), [])

  const techStack = useMemo(() => 
    ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Three.js'], []
  )

  // Enhanced mobile detection with debouncing
  useEffect(() => {
    let ticking = false
    
    const checkMobile = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const mobile = window.innerWidth < 768
          setIsMobile(mobile)
          ticking = false
        })
        ticking = true
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Enhanced loading with better UX
  useEffect(() => {
    const minLoadTime = shouldReduceMotion ? 800 : 2000
    const maxLoadTime = shouldReduceMotion ? 1200 : 3000
    
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, Math.random() * (maxLoadTime - minLoadTime) + minLoadTime)
    
    return () => clearTimeout(timer)
  }, [shouldReduceMotion])

  // Enhanced scroll tracking with performance optimization
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          setShowScrollTop(scrollY > 800)
          setIsScrolling(true)
          
          // Clear existing timeout
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }
          
          // Set new timeout to detect scroll end
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false)
          }, 150)
          
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Enhanced intersection observer with better performance
  useEffect(() => {
    const sections = ['hero', 'code-showcase', 'about', 'languages', 'projects', 'contact']
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const updates: Partial<SectionVisibility> = {}
        
        entries.forEach(entry => {
          const sectionId = entry.target.id as keyof SectionVisibility
          updates[sectionId] = entry.isIntersecting
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setCurrentSection(entry.target.id)
          }
        })
        
        setSectionsInView(prev => ({ ...prev, ...updates }))
      },
      { 
        threshold: [0.1, 0.3, 0.5],
        rootMargin: isMobile ? '50px 0px' : '100px 0px'
      }
    )

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

  // Enhanced utility functions
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth'
    })
  }, [shouldReduceMotion])

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'start'
      })
    }
  }, [shouldReduceMotion])

  const trackSectionView = useCallback((sectionId: string, additionalData?: Record<string, any>) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'section_view', {
        section_name: sectionId,
        page_title: 'Homepage',
        ...additionalData
      })
    }
  }, [])

  const trackInteraction = useCallback((action: string, target: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'user_interaction', {
        action,
        target,
        timestamp: new Date().toISOString()
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
        /* Enhanced Performance optimizations */
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
        
        /* Enhanced Z-index stacking system */
        #hero { z-index: var(--z-base, 1); }
        #code-showcase { z-index: calc(var(--z-base, 1) + 1); }
        #about { z-index: calc(var(--z-base, 1) + 2); }
        #languages { z-index: calc(var(--z-base, 1) + 3); }
        #projects { z-index: calc(var(--z-base, 1) + 4); }
        #contact { z-index: calc(var(--z-base, 1) + 5); }
        
        .scroll-section {
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }
        
        /* Enhanced Mobile optimizations */
        @media (max-width: 768px) {
          .hero-particles,
          .hero-3d-background::before,
          .floating-code-blocks {
            display: none;
          }
          
          .glass-card {
            backdrop-filter: var(--glass-blur, blur(10px));
          }
          
          section {
            padding-left: var(--container-padding, 1rem);
            padding-right: var(--container-padding, 1rem);
          }
          
          .hero-title {
            font-size: clamp(2rem, 8vw, 4rem);
          }
          
          .hero-subtitle {
            font-size: clamp(1.2rem, 5vw, 2rem);
          }
        }
        
        /* Enhanced scroll behavior */
        .scroll-indicator {
          opacity: ${isScrolling ? '0.5' : '1'};
          transition: opacity 0.3s ease;
        }
        
        /* Enhanced reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .parallax-element {
            transform: none !important;
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--lux-gray-200, #e5e5e5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: var(--viva-magenta-500, #be185d);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: var(--viva-magenta-600, #9d174d);
        }
      `}</style>

      {/* Enhanced Navigation */}
      <Navigation />

      <main className="relative">
        {/* Enhanced Hero Section */}
        <section id="hero" className="scroll-section relative min-h-screen">
          {!isMobile && !shouldReduceMotion && (
            <div className="absolute inset-0" style={{ zIndex: 0 }}>
              <Suspense fallback={null}>
                <ParticleField 
                  particleCount={isMobile ? 15 : 35}
                  colorScheme="multi"
                  animation="constellation"
                  showConnections={!isMobile}
                  interactive={!shouldReduceMotion}
                  speed={0.3}
                />
              </Suspense>
            </div>
          )}
          
          <div className="relative" style={{ zIndex: 1 }}>
            <Suspense fallback={<HeroSkeleton />}>
              <Interactive3DHero 
                projects={FEATURED_PROJECTS}
              />
            </Suspense>
          </div>
        </section>

        {/* Enhanced Code Showcase */}
        <section id="code-showcase" className="scroll-section relative min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-lux-offwhite/50 via-viva-magenta-50/10 to-lux-gold-50/10 dark:from-lux-black/50 dark:via-viva-magenta-900/5 dark:to-lux-gold-900/5" />
          
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <motion.h2 
                className="hero-title text-4xl md:text-6xl font-bold mb-6 gradient-text"
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
            
            {sectionsInView.codeShowcase && !isMobile && (
              <Suspense fallback={<CodeBlocksSkeleton />}>
                <FloatingCodeBlocks 
                  techStack={techStack}
                  isVisible={currentSection === 'code-showcase'}
                  onBlockClick={(language) => {
                    trackInteraction('code_block_click', language)
                    console.log(`Clicked on ${language}`)
                  }}
                />
              </Suspense>
            )}
            
            {/* Enhanced Mobile fallback */}
            {(isMobile || !sectionsInView.codeShowcase) && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech}
                    className="p-6 glass-card rounded-xl text-center cursor-pointer hover:scale-105 transition-transform duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => trackInteraction('mobile_tech_click', tech)}
                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                  >
                    <div className="text-3xl mb-3">
                      {tech === 'React' ? '⚛️' : 
                       tech === 'TypeScript' ? '⚡' : 
                       tech === 'Next.js' ? '▲' : 
                       tech === 'Node.js' ? '🟢' : 
                       tech === 'Python' ? '🐍' : '🎮'}
                    </div>
                    <div className="font-semibold text-lg">{tech}</div>
                    <div className="text-sm text-lux-gray-500 dark:text-lux-gray-400 mt-2">
                      {LANGUAGE_DATA.find(lang => lang.name === tech)?.proficiency || 'Advanced'}
                    </div>
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
              <h2 className="hero-title text-4xl md:text-6xl font-bold text-lux-gray-900 dark:text-lux-offwhite mb-8">
                About <span className="gradient-text">Me</span>
              </h2>
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-xl text-lux-gray-700 dark:text-lux-gray-300 leading-relaxed">
                  Hi, I'm <span className="font-semibold text-viva-magenta-600 dark:text-viva-magenta-400">Juan A. Fernandez</span>, 
                  a Full-Stack Developer based in Miami, Florida. With over 5 years of experience, 
                  I specialize in creating immersive digital experiences that blend cutting-edge technology 
                  with exceptional user experience.
                </p>
                <p className="text-lg text-lux-gray-600 dark:text-lux-gray-400 leading-relaxed">
                  My unique background combines software development expertise with healthcare data analysis 
                  and UX research. This diverse experience allows me to approach problems from multiple angles, 
                  ensuring both technical excellence and user-centered design in every project.
                </p>
                <p className="text-lg text-lux-gray-600 dark:text-lux-gray-400 leading-relaxed">
                  I'm passionate about emerging technologies like WebGL, Three.js, and modern React patterns, 
                  with a strong focus on accessibility, performance optimization, and scalable architecture.
                </p>
              </div>
            </motion.div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { 
                  label: "Projects Built", 
                  value: `${portfolioStats.totalProjects}+`, 
                  icon: Code, 
                  color: "viva-magenta",
                  description: "Production applications"
                },
                { 
                  label: "GitHub Stars", 
                  value: `${portfolioStats.totalStars}+`, 
                  icon: Star, 
                  color: "lux-gold",
                  description: "Community recognition"
                },
                { 
                  label: "Years Experience", 
                  value: `${portfolioStats.yearsExperience}+`, 
                  icon: Award, 
                  color: "lux-teal",
                  description: "Professional development"
                },
                { 
                  label: "Total Commits", 
                  value: `${Math.floor((portfolioStats.totalCommits || 0) / 100)}k+`, 
                  icon: GitBranch, 
                  color: "lux-sage",
                  description: "Code contributions"
                }
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    className="glass-card p-6 text-center hover-lift hover-scale transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: shouldReduceMotion ? 0.1 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.1 }}
                    whileHover={{ 
                      scale: shouldReduceMotion ? 1 : 1.05,
                      y: shouldReduceMotion ? 0 : -5
                    }}
                    onClick={() => trackInteraction('stat_card_click', stat.label)}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-viva-magenta-100 to-viva-magenta-200 dark:from-viva-magenta-800 dark:to-viva-magenta-900">
                        <IconComponent className="w-6 h-6 text-viva-magenta-600 dark:text-viva-magenta-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2 gradient-text">{stat.value}</div>
                    <div className="text-sm text-lux-gray-600 dark:text-lux-gray-400 font-medium mb-1">{stat.label}</div>
                    <div className="text-xs text-lux-gray-500 dark:text-lux-gray-500">{stat.description}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Skills Preview */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.3 }}
            >
              <p className="text-lg text-lux-gray-600 dark:text-lux-gray-400 mb-6">
                Specialized in: {portfolioStats.topLanguages?.join(' • ')}
              </p>
              <motion.button
                onClick={() => scrollToSection('languages')}
                className="btn-secondary inline-flex items-center gap-2 px-6 py-3"
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
              >
                <span>Explore My Skills</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Language Visualization */}
        <section id="languages" className="scroll-section relative">
          <div className="text-center py-16">
            <motion.h2 
              className="hero-title text-4xl md:text-6xl font-bold mb-8"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
            >
              Technology <span className="gradient-text">Mastery</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-lux-gray-600 dark:text-lux-gray-400 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
            >
              Interactive visualization of my programming language proficiency and framework expertise
            </motion.p>
          </div>
          
          {sectionsInView.languages && (
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
          {sectionsInView.projects && (
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
              <h2 className="hero-title text-4xl md:text-6xl font-bold mb-8">
                Let's Build Something <span className="gradient-text">Amazing</span>
              </h2>
              <p className="text-xl text-lux-gray-700 dark:text-lux-gray-300 mb-8 max-w-3xl mx-auto">
                Ready to bring your ideas to life? I'm available for freelance projects, 
                full-time opportunities, and consulting work.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-lux-gray-600 dark:text-lux-gray-400">
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Remote & Local (Miami, FL)
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Usually responds within 24 hours
                </span>
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Available for new projects
                </span>
              </div>
            </motion.div>

            {/* Enhanced Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {CONTACT_OPTIONS.map((contact, index) => {
                const IconComponent = contact.icon
                return (
                  <motion.a
                    key={contact.title}
                    href={contact.href}
                    target={contact.external ? '_blank' : undefined}
                    rel={contact.external ? 'noopener noreferrer' : undefined}
                    className="glass-card p-6 text-center group card-hover"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
                    whileHover={{ 
                      scale: shouldReduceMotion ? 1 : 1.03,
                      y: shouldReduceMotion ? 0 : -5
                    }}
                    onClick={() => trackInteraction('contact_click', contact.title.toLowerCase())}
                  >
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${contact.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-viva-magenta-600 dark:group-hover:text-viva-magenta-400 transition-colors">
                      {contact.title}
                    </h3>
                    <p className="text-sm text-lux-gray-600 dark:text-lux-gray-400 group-hover:text-lux-gray-700 dark:group-hover:text-lux-gray-300 transition-colors">
                      {contact.description}
                    </p>
                    {contact.external && (
                      <ExternalLink className="w-4 h-4 mx-auto mt-2 text-lux-gray-400 group-hover:text-lux-gray-600 dark:group-hover:text-lux-gray-300 transition-colors" />
                    )}
                  </motion.a>
                )
              })}
            </div>

            {/* Enhanced CTA Section */}
            <div className="text-center space-y-6">
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.3 }}
              >
                <motion.a
                  href="mailto:jafernandez94@gmail.com?subject=Let's work together&body=Hi Juan, I'd like to discuss a project with you."
                  className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                  onClick={() => trackInteraction('cta_primary', 'email')}
                >
                  <Mail className="w-5 h-5" />
                  <span>Start a Project</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
                
                <motion.a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                  onClick={() => trackInteraction('cta_secondary', 'resume')}
                >
                  <Download className="w-5 h-5" />
                  <span>View Resume</span>
                </motion.a>
              </motion.div>
              
              <motion.p
                className="text-sm text-lux-gray-500 dark:text-lux-gray-400 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.5 }}
              >
                Whether you're a startup looking to build an MVP or an enterprise needing to scale, 
                I'm here to help turn your vision into reality.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-lux-black text-center py-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-viva-magenta-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lux-gold-500 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col space-y-8">
              {/* Logo/Brand */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
              >
                <h3 className="text-2xl font-bold gradient-text mb-2">Juan Fernandez</h3>
                <p className="text-lux-gray-400">Full-Stack Developer & 3D Web Specialist</p>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                className="flex flex-wrap justify-center gap-6 text-sm"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
              >
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-lux-gray-400 hover:text-lux-gray-300 transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="text-lux-gray-400 hover:text-lux-gray-300 transition-colors"
                >
                  Projects
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-lux-gray-400 hover:text-lux-gray-300 transition-colors"
                >
                  Contact
                </button>
                <a 
                  href="/privacy" 
                  className="text-lux-gray-400 hover:text-lux-gray-300 transition-colors"
                >
                  Privacy
                </a>
                <a 
                  href="/terms" 
                  className="text-lux-gray-400 hover:text-lux-gray-300 transition-colors"
                >
                  Terms
                </a>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="flex justify-center gap-4"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
              >
                {CONTACT_OPTIONS.filter(contact => contact.external).map((social) => {
                  const IconComponent = social.icon
                  return (
                    <motion.a
                      key={social.title}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-lux-gray-800 hover:bg-lux-gray-700 rounded-full transition-colors"
                      whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
                      onClick={() => trackInteraction('footer_social', social.title)}
                    >
                      <IconComponent className="w-5 h-5 text-lux-gray-300" />
                    </motion.a>
                  )
                })}
              </motion.div>

              {/* Copyright */}
              <motion.div
                className="border-t border-lux-gray-800 pt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.3 }}
              >
                <p className="text-lux-gray-400 mb-2">
                  © 2025 Juan Fernandez. Built with{' '}
                  <Heart className="w-4 h-4 inline-block text-red-500 mx-1" />
                  using Next.js, Three.js, and{' '}
                  <Coffee className="w-4 h-4 inline-block text-amber-600 mx-1" />
                </p>
                <p className="text-xs text-lux-gray-500">
                  Designed for performance, accessibility, and exceptional user experience
                </p>
              </motion.div>
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
              className="p-3 bg-lux-gray-800 dark:bg-lux-gray-200 text-lux-gray-200 dark:text-lux-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-5 h-5 group-hover:animate-bounce" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Synthwave Dino Game Button */}
        <motion.a
          href="/dino-game"
          className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
          title="Play Synthwave Dino! 🎮"
          onClick={() => trackInteraction('dino_game', 'floating_button')}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Play className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-75 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500" />
        </motion.a>

        {/* Quick Contact FAB */}
        <motion.a
          href="mailto:jafernandez94@gmail.com?subject=Quick Contact from Portfolio"
          className="p-4 bg-gradient-to-r from-viva-magenta-500 to-lux-gold-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
          title="Quick Email Contact"
          onClick={() => trackInteraction('quick_contact', 'floating_button')}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-viva-magenta-400 to-lux-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Mail className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-viva-magenta-400 opacity-75 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500" />
        </motion.a>
      </div>

      {/* Enhanced Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-lux-gray-200 dark:bg-lux-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-viva-magenta-500 to-lux-gold-500"
          style={{
            scaleX: sectionsInView.hero ? 0.16 : 
                   sectionsInView.codeShowcase ? 0.33 : 
                   sectionsInView.about ? 0.5 : 
                   sectionsInView.languages ? 0.66 : 
                   sectionsInView.projects ? 0.83 : 
                   sectionsInView.contact ? 1 : 0,
            transformOrigin: "left"
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Enhanced Mobile Menu Indicator */}
      {isMobile && (
        <div className="fixed bottom-4 left-4 z-40">
          <motion.div
            className="flex items-center gap-2 px-4 py-2 bg-lux-gray-900/80 backdrop-blur-md rounded-full text-xs text-lux-gray-300"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="w-2 h-2 rounded-full bg-viva-magenta-500 animate-pulse" />
            <span>Section: {currentSection.replace('-', ' ')}</span>
          </motion.div>
        </div>
      )}

      {/* Performance Monitor (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 text-white text-xs p-2 rounded font-mono">
          <div>Section: {currentSection}</div>
          <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
          <div>Reduced Motion: {shouldReduceMotion ? 'Yes' : 'No'}</div>
          <div>Scrolling: {isScrolling ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  )
}