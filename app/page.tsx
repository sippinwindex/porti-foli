'use client'

import React, { Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react'
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
  AlertCircle,
  Code2,
  FileType,
  Terminal,
  Database,
  Settings,
  Layers,
  Swords,
  Target,
  Trophy,
  Gamepad2,
  Phone,
  MapPin,
  Send,
  MessageCircle
} from 'lucide-react'

// ✅ CORRECT PATH - This should work
import '../styles/robot-fight.css'

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
  icon: string // ✅ FIXED: Changed to string to match LanguageVisualization component
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
  subtitle?: string
  priority?: number
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
  game: boolean  // ← ADDED
}

// Navigation component import
import Navigation from '@/components/Navigation'

// ✅ PERFORMANCE: Enhanced Dynamic imports with better error handling and reduced loading weight
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

// ✅ ENHANCED: Enhanced Rock 'Em Sock 'Em Game import with error handling
const EnhancedRockEmSockEm = dynamic(
  () => import('@/components/RockEmSockEm').catch(() => {
    console.warn('Failed to load RockEmSockEm, using fallback')
    return { default: () => <GameSkeleton /> }
  }),
  { 
    ssr: false,
    loading: () => <GameSkeleton />
  }
)

// ✅ PERFORMANCE: Location message styles - optimized positioning
const locationMessageStyles = {
  position: 'fixed' as const,
  top: '6rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 998,
  pointerEvents: 'none' as const,
  maxWidth: '24rem',
  width: '100%',
  padding: '0 1rem'
}

const mobileLocationMessageStyles = {
  ...locationMessageStyles,
  top: '5rem',
  left: '0.75rem',
  right: '0.75rem',
  transform: 'none',
  maxWidth: 'none'
}

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

// ✅ PERFORMANCE: Enhanced ParticleField import with optimized loading
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

// ✅ ENHANCED: Game Error Boundary Component
class GameErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center p-8 bg-red-900/20 rounded-lg border border-red-500/30">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-400 mb-2">Game Loading Error</h3>
            <p className="text-gray-300 mb-4">
              The game encountered an issue. Please refresh the page to try again.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// ✅ PERFORMANCE: Optimized Game Skeleton with reduced animations
function GameSkeleton() {
  return (
    <div className="min-h-[500px] flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Dual spinning rings */}
          <div className="w-32 h-32 border-4 border-viva-magenta-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="absolute inset-0 w-32 h-32 border-4 border-lux-gold-300 border-t-transparent rounded-full animate-spin mx-auto" 
               style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-viva-magenta-500 to-lux-gold-500 rounded-lg flex items-center justify-center">
              <Swords className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Loading text with typewriter effect */}
        <div className="space-y-3">
          <p className="text-xl text-gray-300 mb-2 font-mono">Loading Enhanced Combat System...</p>
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-viva-magenta-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          
          {/* Feature list */}
          <div className="mt-6 space-y-2 text-sm text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Real-time combat engine</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Advanced AI opponents</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-green-400" />
              <span>Performance tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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

// ✅ PERFORMANCE: Optimized Loading Skeletons with reduced DOM complexity
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

// ✅ PERFORMANCE: Optimized Page Loading with reduced animations on mobile
function PageLoading() {
  const [loadingText, setLoadingText] = useState('Initializing...')
  const [progress, setProgress] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  
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
    }, shouldReduceMotion ? 300 : 600)
    
    return () => clearInterval(interval)
  }, [shouldReduceMotion])

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

// ✅ PERFORMANCE: Updated language data with string icon identifiers
const LANGUAGE_DATA: LanguageData[] = [
  {
    name: 'TypeScript',
    percentage: 35,
    color: '#3178c6',
    icon: 'zap', // ✅ FIXED: String identifier instead of component
    projects: 8,
    experience: 2,
    proficiency: 'Advanced',
    commits: 450,
    frameworks: ['React', 'Next.js', 'Node.js', 'Express']
  },
  {
    name: 'React',
    percentage: 28,
    color: '#61dafb',
    icon: 'code-2', // ✅ FIXED: String identifier instead of component
    projects: 12,
    experience: 2,
    proficiency: 'Advanced',
    commits: 520,
    frameworks: ['Next.js', 'Create React App', 'Vite']
  },
  {
    name: 'Next.js',
    percentage: 22,
    color: '#000000',
    icon: 'layers', // ✅ FIXED: String identifier instead of component
    projects: 6,
    experience: 1,
    proficiency: 'Advanced',
    commits: 340,
    frameworks: ['App Router', 'Pages Router', 'API Routes']
  },
  {
    name: 'Node.js',
    percentage: 18,
    color: '#68a063',
    icon: 'terminal', // ✅ FIXED: String identifier instead of component
    projects: 7,
    experience: 2,
    proficiency: 'Advanced',
    commits: 260,
    frameworks: ['Express', 'Fastify']
  },
  {
    name: 'Python',
    percentage: 15,
    color: '#3776ab',
    icon: 'file-type', // ✅ FIXED: String identifier instead of component
    projects: 4,
    experience: 1,
    proficiency: 'Intermediate',
    commits: 140,
    frameworks: ['Flask', 'Django']
  },
  {
    name: 'Three.js',
    percentage: 12,
    color: '#049ef4',
    icon: 'settings', // ✅ FIXED: String identifier instead of component
    projects: 3,
    experience: 1,
    proficiency: 'Intermediate',
    commits: 80,
    frameworks: ['React Three Fiber', 'Vanilla Three.js']
  }
]

// ✅ ENHANCED: Updated contact options with enhanced visual data and priorities
const CONTACT_OPTIONS: ContactOption[] = [
  {
    icon: Mail,
    title: 'Email',
    description: 'jafernandez94@gmail.com',
    subtitle: 'Direct line of communication',
    href: 'mailto:jafernandez94@gmail.com',
    color: 'from-viva-magenta-500 to-lux-gold-500',
    external: false,
    working: true,
    priority: 1
  },
  {
    icon: Linkedin,
    title: 'LinkedIn',
    description: 'Professional Network',
    subtitle: 'Connect & collaborate',
    href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
    color: 'from-blue-600 to-blue-700',
    external: true,
    working: true,
    priority: 2
  },
  {
    icon: Github,
    title: 'GitHub',
    description: 'Code Portfolio',
    subtitle: 'Explore my repositories',
    href: 'https://github.com/sippinwindex',
    color: 'from-gray-700 to-gray-900',
    external: true,
    working: true,
    priority: 3
  },
  {
    icon: Download,
    title: 'Resume',
    description: 'CV Download',
    subtitle: 'Professional experience',
    href: 'https://flowcv.com/resume/moac4k9d8767',
    color: 'from-emerald-600 to-emerald-700',
    external: true,
    working: true,
    priority: 4
  }
]

// Helper function to get tech icon component from string
function getTechIcon(tech: string): React.ElementType {
  switch (tech) {
    case 'React': return Code2
    case 'TypeScript': return Zap
    case 'Next.js': return Layers
    case 'Node.js': return Terminal
    case 'Python': return FileType
    case 'Three.js': return Settings
    default: return Code
  }
}

// Helper function to get icon component from string identifier
function getIconComponent(iconName: string): React.ElementType {
  switch (iconName) {
    case 'zap': return Zap
    case 'code-2': return Code2
    case 'layers': return Layers
    case 'terminal': return Terminal
    case 'file-type': return FileType
    case 'settings': return Settings
    default: return Code
  }
}

// ✅ PERFORMANCE: Enhanced theme detection hook with debouncing
function useOptimizedThemeDetection() {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const detectTheme = () => {
      const htmlElement = document.documentElement
      const hasExplicitDarkClass = htmlElement.classList.contains('dark')
      const hasExplicitLightClass = htmlElement.classList.contains('light')
      
      if (hasExplicitDarkClass) {
        setCurrentTheme('dark')
      } else if (hasExplicitLightClass) {
        setCurrentTheme('light')
      } else {
        // Fallback to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setCurrentTheme(prefersDark ? 'dark' : 'light')
      }
    }

    // Initial detection
    detectTheme()

    // Watch for theme changes
    const observer = new MutationObserver(detectTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', detectTheme)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', detectTheme)
    }
  }, [])

  return currentTheme
}

// ✅ PERFORMANCE: Debounce helper function for performance optimization
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// ✅ ENHANCED: Main Component with all optimizations applied
export default function HomePage() {
  // Use real data hooks with proper error handling
  const { projects, stats, loading: portfolioLoading, error: portfolioError } = usePortfolioData()
  const { repositories, user, stats: githubStats, loading: githubLoading, error: githubError } = useGitHubData()
  
  // ✅ PERFORMANCE: Enhanced theme detection for particle field
  const currentTheme = useOptimizedThemeDetection()
  
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState('hero')
  const [isMobile, setIsMobile] = useState(false)
  
  // ✅ PERFORMANCE: Debounced section visibility updates to prevent cascade
  const [sectionsInView, setSectionsInView] = useState<SectionVisibility>({
    hero: true,
    codeShowcase: false,
    about: false,
    languages: false,
    projects: false,
    contact: false,
    game: false
  })

  // ✅ PERFORMANCE: Debounced section updates to prevent performance issues
  const debouncedSetSectionsInView = useCallback(
    debounce((updates: Partial<SectionVisibility>) => {
      setSectionsInView(prev => ({ ...prev, ...updates }))
    }, 100), // 100ms debounce
    []
  )
  
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  
  // ✅ PERFORMANCE: Simplified location message timing with reduced delay
  const [showLocationMessage, setShowLocationMessage] = useState(false)
  const [hasShownLocationMessage, setHasShownLocationMessage] = useState(false)

  // ✅ ADDED: Game state management
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    maxCombo: 0,
    perfectHits: 0
  })
  
  // Refs for better performance
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReduceMotion = useReducedMotion()

  // ✅ ADDED: Game event handlers
  const handleGameStart = useCallback(() => {
    console.log('🎮 Game started')
    setGameStats(prev => ({ ...prev, gamesPlayed: prev.gamesPlayed + 1 }))
  }, [])

  const handleGameEnd = useCallback((winner: 'player' | 'npc', stats: any) => {
    console.log('🏆 Game ended:', winner, stats)
    setGameStats(prev => ({
      ...prev,
      wins: winner === 'player' ? prev.wins + 1 : prev.wins,
      maxCombo: Math.max(prev.maxCombo, stats.maxCombo || 0),
      perfectHits: prev.perfectHits + (stats.perfectHits || 0)
    }))
  }, [])

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

  // ✅ PERFORMANCE: Particle field configuration with reduced particle count and conditional rendering
  const particleConfig = useMemo(() => {
    const baseConfig = {
      particleCount: isMobile ? 15 : 25, // ✅ REDUCED from 60
      animation: 'constellation' as const,
      interactive: !shouldReduceMotion && !isMobile, // ✅ DISABLE on mobile
      speed: 0.3, // ✅ REDUCED speed
      className: "w-full h-full"
    }

    // ✅ STABLE color scheme selection
    if (currentTheme === 'light') {
      return { ...baseConfig, colorScheme: 'light-mode' as const }
    }
    return { ...baseConfig, colorScheme: 'aurora' as const }
  }, [currentTheme, isMobile, shouldReduceMotion]) // ✅ MINIMAL dependencies

  // ✅ PERFORMANCE: Memoize heavy components to prevent re-renders
  const MemoizedParticleField = useMemo(() => {
    if (shouldReduceMotion) return null
    
    return (
      <Suspense fallback={null}>
        <div className="particle-field-container">
          <ParticleField {...particleConfig} />
        </div>
      </Suspense>
    )
  }, [particleConfig, shouldReduceMotion])

  // ✅ PERFORMANCE: Helper variable for conditional 3D rendering
  const shouldRender3D = !shouldReduceMotion && !isMobile

  // Utility functions
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

  // Enhanced mobile detection
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

  // ✅ PERFORMANCE: Enhanced loading with GitHub data waiting and reduced load times
  useEffect(() => {
    const minLoadTime = shouldReduceMotion ? 400 : 1000 // ✅ REDUCED
    const maxLoadTime = shouldReduceMotion ? 600 : 1500 // ✅ REDUCED
    
    // Wait for either data to load or timeout
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, Math.random() * (maxLoadTime - minLoadTime) + minLoadTime)
    
    // If data loads quickly, end loading early
    if (!portfolioLoading && !githubLoading) {
      setTimeout(() => setIsLoading(false), 250) // ✅ REDUCED delay
    }
    
    return () => clearTimeout(timer)
  }, [shouldReduceMotion, portfolioLoading, githubLoading])

  // ✅ PERFORMANCE: Simplified location message timing with reduced delay
  useEffect(() => {
    if (currentSection === 'hero' && !hasShownLocationMessage && !isLoading) {
      const timer = setTimeout(() => {
        console.log('HomePage: Showing location message')
        setShowLocationMessage(true)
        setHasShownLocationMessage(true)
      }, 2000) // ✅ REDUCED delay from 3000ms
      
      return () => clearTimeout(timer)
    } else if (currentSection !== 'hero' && showLocationMessage) {
      console.log('HomePage: Hiding location message due to section change')
      setShowLocationMessage(false)
    }
  }, [currentSection, hasShownLocationMessage, isLoading, showLocationMessage])

  // Enhanced responsive handling for location message
  useEffect(() => {
    if (!showLocationMessage) return

    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile)
      }
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [showLocationMessage, isMobile])

  // Keyboard accessibility for location message
  useEffect(() => {
    if (!showLocationMessage) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showLocationMessage) {
        console.log('HomePage: Location message dismissed via Escape key')
        setShowLocationMessage(false)
        setHasShownLocationMessage(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showLocationMessage])

  // Enhanced scroll tracking
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

  // ✅ PERFORMANCE: Enhanced intersection observer with debounced updates
  useEffect(() => {
    const sections = ['hero', 'code-showcase', 'about', 'languages', 'projects', 'contact', 'game']
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const updates: Partial<SectionVisibility> = {}
        
        entries.forEach(entry => {
          const sectionId = entry.target.id as keyof SectionVisibility
          updates[sectionId] = entry.isIntersecting
          
          // ✅ THROTTLE current section updates
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            requestAnimationFrame(() => {
              setCurrentSection(entry.target.id)
            })
          }
        })
        
        debouncedSetSectionsInView(updates)
      },
      { 
        threshold: [0.1, 0.3],
        rootMargin: isMobile ? '20px 0px' : '50px 0px' // ✅ REDUCED margins
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
  }, [isMobile, debouncedSetSectionsInView])

  // Error handling for data loading issues
  const hasErrors = portfolioError || githubError
  const isDataLoading = portfolioLoading || githubLoading

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className="relative min-h-screen text-lux-gray-900 dark:text-lux-offwhite overflow-x-hidden">
      {/* ✅ UNIFIED BACKGROUND SYSTEM - Uses CSS background only, NO JavaScript background components */}
      <div className="unified-portfolio-background" />
      
      {/* ✅ PERFORMANCE: Conditional particle field rendering with memoization */}
      {shouldRender3D && MemoizedParticleField}

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

      <main className="relative z-10 scroll-section">
        {/* ✅ Hero Section - NO background, uses unified system */}
        <section id="hero" className="scroll-section relative min-h-screen">
          <div className="relative z-10">
            <Suspense fallback={<HeroSkeleton />}>
              {shouldRender3D ? (
                <Interactive3DHero 
                  projects={transformedProjects}
                  onProjectClick={handleProjectClick}
                />
              ) : (
                <Interactive3DHero 
                  projects={transformedProjects}
                  onProjectClick={handleProjectClick}
                />
              )}
            </Suspense>
          </div>
        </section>

        {/* ✅ Code Showcase - NO background, uses unified system */}
        <section id="code-showcase" className="scroll-section relative min-h-screen">
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
            
            {/* FIXED: Only show 3D on desktop when section is in view */}
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
            
            {/* ✅ Enhanced themed fallback with consistent styling */}
            {(!sectionsInView.codeShowcase || isMobile) && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {techStack.map((tech, index) => {
                  const IconComponent = getTechIcon(tech)
                  const langData = LANGUAGE_DATA.find(lang => lang.name === tech)
                  
                  return (
                    <motion.div
                      key={tech}
                      className="group relative p-6 rounded-xl glass-card text-center cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-viva-magenta-500/20 dark:hover:shadow-viva-magenta-400/20"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: index * 0.1,
                        duration: shouldReduceMotion ? 0.1 : 0.6,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        scale: shouldReduceMotion ? 1 : 1.05,
                        y: shouldReduceMotion ? 0 : -8
                      }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-viva-magenta-500/0 via-lux-gold-500/0 to-viva-magenta-600/0 group-hover:from-viva-magenta-500/10 group-hover:via-lux-gold-500/5 group-hover:to-viva-magenta-600/10 transition-all duration-500" />
                      
                      {/* Icon container with proper theming */}
                      <div className="relative flex justify-center mb-4">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-viva-magenta-500/20 via-viva-magenta-600/15 to-lux-gold-500/20 group-hover:from-viva-magenta-400/30 group-hover:via-viva-magenta-500/25 group-hover:to-lux-gold-400/30 border border-viva-magenta-400/20 group-hover:border-viva-magenta-300/40 transition-all duration-500 group-hover:scale-110">
                          <IconComponent className="w-8 h-8 text-viva-magenta-600 dark:text-viva-magenta-400 group-hover:text-viva-magenta-500 dark:group-hover:text-viva-magenta-300 transition-all duration-300" />
                        </div>
                        
                        {/* Animated background glow */}
                        <div className="absolute inset-0 rounded-lg bg-viva-magenta-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 scale-150" />
                      </div>
                      
                      {/* Tech name with gradient text */}
                      <div className="relative">
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100 group-hover:bg-gradient-to-r group-hover:from-viva-magenta-600 group-hover:to-lux-gold-600 dark:group-hover:from-viva-magenta-400 dark:group-hover:to-lux-gold-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {tech}
                        </h3>
                        
                        {/* Proficiency level */}
                        <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 mb-3">
                          {langData?.proficiency || 'Advanced'}
                        </div>
                        
                        {/* Stats row */}
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                          <span className="flex items-center gap-1">
                            <Code className="w-3 h-3" />
                            {langData?.projects || 5}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {langData?.experience || 2}y
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {langData?.percentage || 25}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Subtle animated border */}
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-viva-magenta-400/30 transition-all duration-500" />
                      
                      {/* Corner accent */}
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-lux-gold-400 opacity-0 group-hover:opacity-60 transition-all duration-300 animate-pulse" />
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ✅ About Section - NO background, uses unified system */}
        <section id="about" className="scroll-section relative py-20">
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

            {/* ✅ Enhanced Stats Cards with consistent theming */}
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
                    className="relative p-6 text-center glass-card hover:border-viva-magenta-400/40 dark:hover:border-viva-magenta-400/40 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-xl hover:shadow-viva-magenta-500/20 dark:hover:shadow-viva-magenta-400/20"
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
                      <div className="p-3 rounded-lg bg-gradient-to-br from-viva-magenta-100 to-viva-magenta-200 dark:from-viva-magenta-800 dark:to-viva-magenta-900 group-hover:from-viva-magenta-200 group-hover:to-viva-magenta-300 dark:group-hover:from-viva-magenta-700 dark:group-hover:to-viva-magenta-800 transition-all duration-300">
                        <IconComponent className="w-6 h-6 text-viva-magenta-600 dark:text-viva-magenta-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2 gradient-text">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">{stat.description}</div>
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

        {/* ✅ Language Visualization - NO background, uses unified system */}
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

        {/* ✅ Projects Section - NO background, uses unified system */}
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

        {/* ✅ Game Section - Custom dark styling but NO individual background */}
        <section id="game" className="scroll-section relative min-h-screen flex items-center justify-center">
          {/* Dark overlay for game section only */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-lux-black/90 to-gray-800/80 backdrop-blur-sm" />
          
          {/* Animated background elements - only render when section is visible */}
          {sectionsInView.game && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-viva-magenta-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lux-gold-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-lux-teal-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          )}

          {/* Grid pattern overlay - only when section is visible */}
          {sectionsInView.game && (
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(190, 52, 85, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(190, 52, 85, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          )}
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Enhanced Game Header with stats */}
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
              >
                <h2 className="hero-title text-4xl md:text-6xl font-bold mb-6 text-white">
                  Ready to <span className="gradient-text">Battle?</span>
                </h2>
                <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
                  Challenge yourself with this enhanced retro-inspired Rock 'Em Sock 'Em robot game!
                </p>
                
                {/* Game features */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    Real-time combat system
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Perfect hit mechanics
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    Advanced combo system
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    Performance tracking
                  </span>
                </div>

                {/* Personal game stats */}
                {gameStats.gamesPlayed > 0 && (
                  <div className="flex justify-center gap-6 text-xs text-gray-500 bg-black/30 rounded-lg p-3 max-w-md mx-auto">
                    <span>Games: {gameStats.gamesPlayed}</span>
                    <span>Wins: {gameStats.wins}</span>
                    {gameStats.maxCombo > 0 && <span>Best Combo: {gameStats.maxCombo}</span>}
                    {gameStats.perfectHits > 0 && <span>Perfect Hits: {gameStats.perfectHits}</span>}
                  </div>
                )}
              </motion.div>

              {/* Enhanced Game Container with Error Boundary */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.8, ease: "easeOut" }}
              >
                <div className="relative max-w-4xl mx-auto">
                  {/* Enhanced glowing border effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-viva-magenta-500 via-lux-gold-500 to-viva-magenta-500 rounded-2xl blur opacity-30 animate-pulse" />
                  
                  {/* Game wrapper with proper error handling */}
                  <div className="relative bg-gradient-to-br from-gray-900/95 via-lux-black/98 to-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
                    {/* Top accent bar */}
                    <div className="h-1 bg-gradient-to-r from-viva-magenta-500 via-lux-gold-500 to-viva-magenta-500" />
                    
                    {/* Game component container with performance optimization */}
                    <div className="p-4 sm:p-6 lg:p-8">
                      <Suspense fallback={<GameSkeleton />}>
                        <GameErrorBoundary>
                          <EnhancedRockEmSockEm />
                        </GameErrorBoundary>
                      </Suspense>
                    </div>
                    
                    {/* Bottom accent bar */}
                    <div className="h-1 bg-gradient-to-r from-viva-magenta-500 via-lux-gold-500 to-viva-magenta-500" />
                  </div>
                </div>

                {/* Enhanced floating game info */}
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-gray-600/30">
                    <span className="text-xs text-gray-300 flex items-center gap-1">
                      <Gamepad2 className="w-3 h-3" />
                      Enhanced Combat
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-gray-600/30">
                    <span className="text-xs text-gray-300 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Real-time Engine
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-gray-600/30">
                    <span className="text-xs text-gray-300 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Performance Tracked
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Enhanced call-to-action below game */}
              <motion.div
                className="text-center mt-16"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.3 }}
              >
                <p className="text-lg text-gray-300 mb-6">
                  Enjoyed the enhanced gaming experience? Let's collaborate on your next interactive project!
                </p>
                <motion.button
                  onClick={() => scrollToSection('contact')}
                  className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                >
                  <Mail className="w-5 h-5" />
                  <span>Get In Touch</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ✅ ENHANCED: Contact Section with Visually Appealing Cards */}
        <section id="contact" className="scroll-section relative py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
            >
              <h2 className="hero-title text-4xl md:text-6xl font-bold mb-8">
                <span className="gradient-text">Get In Touch</span>
              </h2>
              <p className="text-xl text-lux-gray-700 dark:text-lux-gray-300 mb-8 max-w-3xl mx-auto">
                I'm always interested in new opportunities and collaborations. 
                Let's discuss how we can work together.
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

            {/* ✅ ENHANCED: Visually Appealing Contact Cards with Enhanced Effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
              {CONTACT_OPTIONS.slice(0, 4).map((contact, index) => {
                const IconComponent = contact.icon
                const isPrimary = index === 0 // Email is primary
                
                return (
                  <motion.a
                    key={contact.title}
                    href={contact.href}
                    target={contact.external ? '_blank' : undefined}
                    rel={contact.external ? 'noopener noreferrer' : undefined}
                    className={`
                      group relative overflow-hidden rounded-2xl 
                      ${isPrimary ? 'md:col-span-2' : ''} 
                      transition-all duration-500 transform hover:scale-[1.02]
                      bg-gradient-to-br ${contact.color}
                      p-1 hover:shadow-2xl hover:shadow-viva-magenta-500/25 dark:hover:shadow-viva-magenta-400/25
                    `}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: shouldReduceMotion ? 0 : index * 0.1,
                      duration: shouldReduceMotion ? 0.1 : 0.6,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: shouldReduceMotion ? 1 : 1.02,
                      y: shouldReduceMotion ? 0 : -8
                    }}
                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  >
                    {/* Card Content Container */}
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 h-full flex flex-col justify-between min-h-[200px]">
                      {/* Working status indicator */}
                      {contact.working && (
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                        </div>
                      )}
                      
                      {/* Priority badge for email */}
                      {isPrimary && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-viva-magenta-100 dark:bg-viva-magenta-900/50 text-viva-magenta-700 dark:text-viva-magenta-300 text-xs font-bold rounded-full">
                          PRIMARY
                        </div>
                      )}
                      
                      {/* Icon Section */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="relative">
                          <div className={`
                            p-4 rounded-xl bg-gradient-to-br ${contact.color} 
                            shadow-lg group-hover:shadow-xl transition-all duration-300
                            group-hover:scale-110 group-hover:rotate-3
                          `}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          {/* Glow effect */}
                          <div className={`
                            absolute inset-0 rounded-xl bg-gradient-to-br ${contact.color} 
                            opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500 scale-150
                          `} />
                        </div>
                        
                        {/* External link indicator */}
                        {contact.external && (
                          <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                            <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-viva-magenta-600 dark:group-hover:text-viva-magenta-400 transition-colors duration-300">
                            {contact.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                            {contact.description}
                          </p>
                          {contact.subtitle && (
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                              {contact.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Section */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 group-hover:border-viva-magenta-200 dark:group-hover:border-viva-magenta-800 transition-colors duration-300">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-viva-magenta-600 dark:group-hover:text-viva-magenta-400 transition-colors duration-300">
                          {contact.external ? 'Visit' : 'Contact'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-viva-magenta-500 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      
                      {/* Hover overlay effect */}
                      <div className={`
                        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 
                        bg-gradient-to-br ${contact.color} transition-all duration-500
                      `} />
                    </div>
                    
                    {/* Card border glow */}
                    <div className={`
                      absolute inset-0 rounded-2xl border-2 border-transparent 
                      group-hover:border-white/20 transition-all duration-500
                    `} />
                  </motion.a>
                )
              })}
            </div>

            {/* ✅ ENHANCED: Call-to-Action Section with Floating Effects */}
            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.3 }}
            >
              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <motion.a
                  href="mailto:jafernandez94@gmail.com?subject=Project Collaboration&body=Hi Juan, I'd like to discuss a project with you."
                  className="group relative overflow-hidden btn-primary inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold rounded-2xl"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  
                  <Mail className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Send Message</span>
                  <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  
                  {/* Floating particles effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 2) * 40}%`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '1s'
                        }}
                      />
                    ))}
                  </div>
                </motion.a>
                
                <motion.a
                  href="https://flowcv.com/resume/moac4k9d8767"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden btn-secondary inline-flex items-center gap-3 px-10 py-5 text-lg font-semibold rounded-2xl"
                  whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                >
                  <Download className="w-6 h-6 group-hover:animate-bounce" />
                  <span>View Resume</span>
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </motion.a>
              </div>
              
              {/* Alternative contact methods */}
              <div className="pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Prefer a different platform?
                </p>
                <div className="flex justify-center gap-4">
                  {[
                    { icon: MessageCircle, label: 'LinkedIn Message', href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', color: 'blue' },
                    { icon: Github, label: 'GitHub Follow', href: 'https://github.com/sippinwindex', color: 'gray' },
                    { icon: Phone, label: 'Schedule Call', href: 'mailto:jafernandez94@gmail.com?subject=Schedule a Call', color: 'green' }
                  ].map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          group p-4 rounded-xl bg-${item.color}-50 dark:bg-${item.color}-900/20 
                          hover:bg-${item.color}-100 dark:hover:bg-${item.color}-800/30
                          border border-${item.color}-200 dark:border-${item.color}-700
                          hover:border-${item.color}-300 dark:hover:border-${item.color}-600
                          transition-all duration-300 hover:scale-110 hover:shadow-lg
                        `}
                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.1, rotate: shouldReduceMotion ? 0 : 5 }}
                        whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                        title={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <IconComponent className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                      </motion.a>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ✅ Enhanced Footer - Uses dark styling but no competing background */}
        <footer className="relative py-16 text-center overflow-hidden">
          {/* Dark footer overlay */}
          <div className="absolute inset-0 bg-lux-black/90 backdrop-blur-sm" />
          
          {/* Subtle footer background effects */}
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
                  onClick={() => scrollToSection('game')}
                  className="text-lux-gray-400 hover:text-lux-gray-300 transition-colors"
                >
                  Game
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
              className="p-3 glass-card hover:shadow-xl transition-all duration-300 group backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
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

      {/* ✅ Location Welcome Message - Optimally placed for UX */}
      <AnimatePresence>
        {showLocationMessage && (
          <motion.div
            style={isMobile ? mobileLocationMessageStyles : locationMessageStyles}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: shouldReduceMotion ? 0.1 : 0.3,
              ease: "easeOut"
            }}
          >
            <div 
              className="pointer-events-auto w-full"
              style={{ pointerEvents: 'auto' }}
            >
              <LocationWelcomeMessage 
                onClose={() => {
                  console.log('HomePage: Location message closed')
                  setShowLocationMessage(false)
                  setHasShownLocationMessage(true)
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}