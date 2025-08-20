// Updated app/page.tsx - Fixed project linking behavior while preserving existing design
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
  Clock,
  AlertCircle
} from 'lucide-react'

// Import your custom hooks
import usePortfolioData from '@/hooks/usePortfolioData'
import { useGitHubData } from '@/hooks/useGitHubData'

// ✅ ADDED: Import LocationWelcomeMessage component
import LocationWelcomeMessage from '@/components/LocationWelcomeMessage'

// Enhanced Type definitions that match your actual PortfolioProject interface
interface PortfolioProject {
  id: string
  name: string
  title?: string
  description: string
  techStack: string[]
  featured: boolean
  github?: {
    stars: number
    forks: number
    url: string
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
  }
  githubUrl?: string
  liveUrl?: string
}

// FIXED: Enhanced Project interface for 3D components with proper linking data
interface Project {
  id: string
  title: string // Required for 3D components
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
  deploymentScore?: number // Optional for display
  featured: boolean
  category?: string
  lastUpdated?: string // Optional for display
  imageUrl?: string // Optional for display
  // FIXED: Add linking behavior properties
  primaryAction?: 'live' | 'github' | 'details'
  clickUrl?: string
  hasLiveDeployment?: boolean
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
  working?: boolean
}

// PortfolioStats interface that matches both your types and usage
interface PortfolioStats {
  totalProjects: number
  totalStars: number
  liveProjects: number // Added for compatibility
  totalForks?: number
  topLanguages?: string[]
  totalCommits?: number
  yearsExperience?: number
  recentActivity: { // Added for compatibility
    activeProjects: number
    lastCommit?: string
  }
}

// GitHubStats interface for compatibility
interface GitHubStats {
  totalProjects: number
  totalStars: number
  totalForks?: number
  topLanguages?: string[]
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

// Enhanced Dynamic imports with better error handling
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

// FIXED: Enhanced 3D Projects component with click handler support
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

// FIXED: Helper function to determine the best click action for a project
function getProjectClickAction(project: PortfolioProject): {
  action: 'live' | 'github' | 'details'
  url?: string
  hasLive: boolean
} {
  // Priority 1: Vercel live deployment
  if (project.vercel?.isLive && project.vercel.liveUrl) {
    return {
      action: 'live',
      url: project.vercel.liveUrl,
      hasLive: true
    }
  }

  // Priority 2: Any live URL that looks like a deployment
  if (project.liveUrl && isValidDeploymentUrl(project.liveUrl)) {
    return {
      action: 'live',
      url: project.liveUrl,
      hasLive: true
    }
  }

  // Priority 3: GitHub repository
  if (project.github?.url || project.githubUrl) {
    return {
      action: 'github',
      url: project.github?.url || project.githubUrl,
      hasLive: false
    }
  }

  // Fallback: Project details page
  return {
    action: 'details',
    url: `/projects/${project.id}`,
    hasLive: false
  }
}

// FIXED: Helper function to validate deployment URLs
function isValidDeploymentUrl(url: string): boolean {
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

// Enhanced Loading Skeletons (unchanged)
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

// Enhanced Page Loading (unchanged)
function PageLoading() {
  const [loadingText, setLoadingText] = useState('Initializing...')
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const messages = [
      'Initializing...',
      'Loading GitHub Data...',
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

// Updated language data with realistic values for 2+ years experience (unchanged)
const LANGUAGE_DATA: LanguageData[] = [
  {
    name: 'TypeScript',
    percentage: 35,
    color: 'var(--primary-600)',
    icon: '⚡',
    projects: 8,
    experience: 2,
    proficiency: 'Advanced',
    commits: 450,
    frameworks: ['React', 'Next.js', 'Node.js', 'Express']
  },
  {
    name: 'React',
    percentage: 28,
    color: 'var(--viva-magenta)',
    icon: '⚛️',
    projects: 12,
    experience: 2,
    proficiency: 'Advanced',
    commits: 520,
    frameworks: ['Next.js', 'Create React App', 'Vite']
  },
  {
    name: 'Next.js',
    percentage: 22,
    color: 'var(--lux-black)',
    icon: '▲',
    projects: 6,
    experience: 1,
    proficiency: 'Advanced',
    commits: 340,
    frameworks: ['App Router', 'Pages Router', 'API Routes']
  },
  {
    name: 'Node.js',
    percentage: 18,
    color: 'var(--lux-sage)',
    icon: '🟢',
    projects: 7,
    experience: 2,
    proficiency: 'Advanced',
    commits: 260,
    frameworks: ['Express', 'Fastify']
  },
  {
    name: 'Python',
    percentage: 15,
    color: 'var(--lux-teal)',
    icon: '🐍',
    projects: 4,
    experience: 1,
    proficiency: 'Intermediate',
    commits: 140,
    frameworks: ['Flask', 'Django']
  },
  {
    name: 'Three.js',
    percentage: 12,
    color: 'var(--lux-gold)',
    icon: '🎮',
    projects: 3,
    experience: 1,
    proficiency: 'Intermediate',
    commits: 80,
    frameworks: ['React Three Fiber', 'Vanilla Three.js']
  }
]

// Updated contact options with verified working links (unchanged)
const CONTACT_OPTIONS: ContactOption[] = [
  {
    icon: Mail,
    title: 'Email',
    description: 'jafernandez94@gmail.com',
    href: 'mailto:jafernandez94@gmail.com',
    color: 'from-viva-magenta-500 to-lux-gold-500',
    external: false,
    working: true
  },
  {
    icon: Linkedin,
    title: 'LinkedIn',
    description: 'Connect professionally',
    href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
    color: 'from-blue-600 to-blue-700',
    external: true,
    working: true
  },
  {
    icon: Github,
    title: 'GitHub',
    description: 'View my repositories',
    href: 'https://github.com/sippinwindex',
    color: 'from-gray-700 to-gray-900',
    external: true,
    working: true
  },
  {
    icon: Download,
    title: 'Resume',
    description: 'Download my CV',
    href: 'https://flowcv.com/resume/moac4k9d8767',
    color: 'from-emerald-600 to-emerald-700',
    external: true,
    working: true
  }
]

// Enhanced Main Component
export default function HomePage() {
  // Use real data hooks with proper error handling
  const { projects, stats, loading: portfolioLoading, error: portfolioError } = usePortfolioData()
  const { repositories, user, stats: githubStats, loading: githubLoading, error: githubError } = useGitHubData()
  
  // State management
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
  
  // ✅ ADDED: Location welcome message state with smart timing
  const [showLocationMessage, setShowLocationMessage] = useState(false)
  const [hasShownLocationMessage, setHasShownLocationMessage] = useState(false)
  
  // Refs for better performance
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReduceMotion = useReducedMotion()

  // FIXED: Enhanced project click handler for 3D components
  const handleProjectClick = useCallback((clickedProject: Project) => {
    console.log('🎯 3D Project clicked:', clickedProject.name)
    
    // Use the enhanced click action logic
    const { action, url } = clickedProject.primaryAction && clickedProject.clickUrl 
      ? { action: clickedProject.primaryAction, url: clickedProject.clickUrl }
      : getProjectClickAction(clickedProject as PortfolioProject)

    console.log(`🔗 Action: ${action}, URL: ${url}`)

    if (url) {
      if (action === 'details') {
        // Navigate to project details page
        window.location.href = url
      } else {
        // Open live demo or GitHub in new tab
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    }
  }, [])

  // Enhanced portfolio stats with proper type handling and realistic values
  const portfolioStats = useMemo((): PortfolioStats => {
    // FIXED: Enhanced project transformation with click behavior
    const transformedProjects: Project[] = projects.map(p => {
      const clickAction = getProjectClickAction(p)
      
      return {
        id: p.id,
        title: p.title || p.name, // Use title if available, fallback to name
        name: p.name,
        description: p.description,
        techStack: p.techStack || [],
        github: p.github,
        vercel: p.vercel,
        deploymentScore: 85, // Generate a reasonable score since not in PortfolioProject
        featured: p.featured,
        category: 'fullstack', // Default category since not in PortfolioProject
        lastUpdated: new Date().toISOString(), // Generate current date since not in PortfolioProject
        imageUrl: `/images/projects/${p.id}.jpg`, // Generate image path since not in PortfolioProject
        // FIXED: Add linking behavior data
        primaryAction: clickAction.action,
        clickUrl: clickAction.url,
        hasLiveDeployment: clickAction.hasLive
      }
    })

    // Use real GitHub data if available, fallback to processed data
    const realProjects = transformedProjects.length > 0 ? transformedProjects : []
    
    // Handle both GitHubStats and PortfolioStats types
    const realStats = stats || githubStats
    
    // Create a compatible PortfolioStats object
    const result: PortfolioStats = {
      totalProjects: realProjects.length || realStats?.totalProjects || 8,
      totalStars: realStats?.totalStars || realProjects.reduce((acc, p) => acc + (p.github?.stars || 0), 0) || 25,
      liveProjects: realProjects.filter(p => p.hasLiveDeployment).length || 6, // FIXED: Use hasLiveDeployment
      totalForks: realStats?.totalForks || realProjects.reduce((acc, p) => acc + (p.github?.forks || 0), 0) || 12,
      topLanguages: realStats?.topLanguages || LANGUAGE_DATA.slice(0, 3).map(lang => lang.name),
      totalCommits: LANGUAGE_DATA.reduce((acc, lang) => acc + (lang.commits || 0), 0),
      yearsExperience: 2,
      recentActivity: { // Always provide recentActivity since it's required
        activeProjects: realProjects.filter(p => p.featured).length || 4,
        lastCommit: new Date().toISOString()
      }
    }
    
    return result
  }, [projects, stats, githubStats])

  // FIXED: Transform projects for 3D components with proper linking behavior
  const transformedProjects = useMemo((): Project[] => {
    const transformed = projects.map(p => {
      const clickAction = getProjectClickAction(p)
      
      return {
        id: p.id,
        title: p.title || p.name, // Ensure title is always available
        name: p.name,
        description: p.description,
        techStack: p.techStack || [],
        github: p.github,
        vercel: p.vercel,
        deploymentScore: Math.floor(Math.random() * 30) + 70, // Generate score (70-100)
        featured: p.featured,
        category: 'fullstack', // Default category
        lastUpdated: new Date().toISOString(), // Current date
        imageUrl: `/images/projects/${p.id}.jpg`, // Generate image path
        // FIXED: Add linking behavior data for 3D components
        primaryAction: clickAction.action,
        clickUrl: clickAction.url,
        hasLiveDeployment: clickAction.hasLive
      }
    })

    // Log project linking behavior for debugging
    console.log('🏠 Home Page Project Click Behavior:')
    transformed.forEach(project => {
      console.log(`  📦 ${project.name}:`, {
        primaryAction: project.primaryAction,
        clickUrl: project.clickUrl,
        hasLive: project.hasLiveDeployment,
        featured: project.featured
      })
    })

    return transformed
  }, [projects])

  const techStack = useMemo(() => 
    ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Three.js'], []
  )

  // Enhanced mobile detection (unchanged)
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

  // Enhanced loading with GitHub data waiting (unchanged)
  useEffect(() => {
    const minLoadTime = shouldReduceMotion ? 800 : 2000
    const maxLoadTime = shouldReduceMotion ? 1200 : 3000
    
    // Wait for either data to load or timeout
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, Math.random() * (maxLoadTime - minLoadTime) + minLoadTime)
    
    // If data loads quickly, end loading early
    if (!portfolioLoading && !githubLoading) {
      setTimeout(() => setIsLoading(false), 500)
    }
    
    return () => clearTimeout(timer)
  }, [shouldReduceMotion, portfolioLoading, githubLoading])

  // ✅ ADDED: Smart location message timing - shows after user has seen hero section (unchanged)
  useEffect(() => {
    if (currentSection === 'hero' && !hasShownLocationMessage && !isLoading) {
      // Show after 4 seconds on hero section, giving user time to appreciate the 3D content
      const timer = setTimeout(() => {
        setShowLocationMessage(true)
        setHasShownLocationMessage(true)
      }, 4000)
      
      return () => clearTimeout(timer)
    } else if (currentSection !== 'hero') {
      // Hide when user scrolls away from hero
      setShowLocationMessage(false)
    }
  }, [currentSection, hasShownLocationMessage, isLoading])

  // Enhanced scroll tracking (unchanged)
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          setShowScrollTop(scrollY > 800)
          setIsScrolling(true)
          
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }
          
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

  // Enhanced intersection observer (unchanged)
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
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId)
        if (element && observerRef.current) {
          observerRef.current.observe(element)
        }
      })
    }

    observeSections()

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isMobile])

  // Utility functions (unchanged)
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

  // Error handling for data loading issues
  const hasErrors = portfolioError || githubError
  const isDataLoading = portfolioLoading || githubLoading

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className="relative min-h-screen bg-lux-offwhite dark:bg-lux-black text-lux-gray-900 dark:text-lux-offwhite overflow-x-hidden">
      {/* Error notification for data loading issues */}
      {hasErrors && (
        <div className="fixed top-20 right-4 z-50 max-w-sm">
          <motion.div
            className="bg-amber-100 dark:bg-amber-900/50 border border-amber-400 dark:border-amber-600 rounded-lg p-4 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                  Data Loading Issue
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Using fallback data. Some features may be limited.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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
                projects={transformedProjects}
                onProjectClick={handleProjectClick}
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

        {/* Enhanced About Section with correct data */}
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
                  a Full-Stack Developer based in Miami, Florida. With over 2+ years of focused experience, 
                  I specialize in creating immersive digital experiences that blend cutting-edge technology 
                  with exceptional user experience.
                </p>
                <p className="text-lg text-lux-gray-600 dark:text-lux-gray-400 leading-relaxed">
                  My background combines software development expertise with UX research and data analysis. 
                  This diverse experience allows me to approach problems from multiple angles, 
                  ensuring both technical excellence and user-centered design in every project.
                </p>
                <p className="text-lg text-lux-gray-600 dark:text-lux-gray-400 leading-relaxed">
                  I'm passionate about emerging technologies like WebGL, Three.js, and modern React patterns, 
                  with a strong focus on accessibility, performance optimization, and scalable architecture.
                </p>
              </div>
            </motion.div>

            {/* Enhanced Stats Cards with realistic data for 2+ years */}
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

        {/* FIXED: Enhanced Projects Section with click handler */}
        <section id="projects" className="scroll-section relative">
          {sectionsInView.projects && (
            <Suspense fallback={<ProjectsSkeleton />}>
              <ScrollTriggered3DSections 
                projects={transformedProjects.slice(0, 6)}
                stats={portfolioStats}
                onProjectClick={handleProjectClick}
              />
            </Suspense>
          )}
        </section>

        {/* Enhanced Contact Section with verified links */}
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

            {/* Enhanced Contact Options with status indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {CONTACT_OPTIONS.map((contact, index) => {
                const IconComponent = contact.icon
                return (
                  <motion.a
                    key={contact.title}
                    href={contact.href}
                    target={contact.external ? '_blank' : undefined}
                    rel={contact.external ? 'noopener noreferrer' : undefined}
                    className="glass-card p-6 text-center group card-hover relative"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
                    whileHover={{ 
                      scale: shouldReduceMotion ? 1 : 1.03,
                      y: shouldReduceMotion ? 0 : -5
                    }}
                  >
                    {/* Working status indicator */}
                    {contact.working && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                    
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
                >
                  <Mail className="w-5 h-5" />
                  <span>Start a Project</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
                
                <motion.a
                  href="https://flowcv.com/resume/moac4k9d8767"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                >
                  <ExternalLink className="w-5 h-5" />
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
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-viva-magenta-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lux-gold-500 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col space-y-8">
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
              </motion.div>

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
                    >
                      <IconComponent className="w-5 h-5 text-lux-gray-300" />
                    </motion.a>
                  )
                })}
              </motion.div>

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

        {/* Quick Contact FAB */}
        <motion.a
          href="mailto:jafernandez94@gmail.com?subject=Quick Contact from Portfolio"
          className="p-4 bg-gradient-to-r from-viva-magenta-500 to-lux-gold-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.1 }}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
          title="Quick Email Contact"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-viva-magenta-400 to-lux-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Mail className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-viva-magenta-400 opacity-75 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500" />
        </motion.a>
      </div>

      {/* ✅ ADDED: Location Welcome Message - Optimally placed for UX */}
      <AnimatePresence>
        {showLocationMessage && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
            <LocationWelcomeMessage />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}