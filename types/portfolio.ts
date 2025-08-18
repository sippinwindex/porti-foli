// types/portfolio.ts - FIXED to match usePortfolioData hook
import type { GitHubRepository, GitHubStats } from './github'
import type { VercelProjectWithStatus, VercelStats } from './vercel'

// Re-export types that are needed by other modules
export type { GitHubRepository, GitHubStats } from './github'
export type { VercelProjectWithStatus, VercelStats } from './vercel'

export interface PortfolioProject {
  id: string
  name: string
  title?: string  // ← FIXED: Made optional to match hook
  description: string
  longDescription?: string
  techStack: string[]
  tags?: string[]  // ← FIXED: Made optional and added
  featured: boolean
  category?: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other'
  status?: 'completed' | 'in-progress' | 'planning' | 'archived'
  image?: string
  startDate?: string
  endDate?: string
  challenges?: string[]
  learnings?: string[]
  metrics?: Record<string, any>
  github?: {
    stars: number
    forks: number
    url: string
    topics?: string[]  // ← FIXED: Added topics
    lastUpdated?: string  // ← FIXED: Changed from updatedAt to lastUpdated
    language?: string
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
    deploymentStatus?: string
  }
  githubUrl?: string
  liveUrl?: string
  // ADDED: Additional properties for compatibility
  topics?: string[]  // ← ADDED: For GitHub topics at project level
  complexity?: 'beginner' | 'intermediate' | 'advanced'
  teamSize?: number
  role?: string
  client?: string
  highlights?: string[]
}

export interface PortfolioStats {
  totalProjects: number
  totalStars: number
  liveProjects: number
  recentActivity?: {
    activeProjects: number
  }
  // Additional stats properties for compatibility
  totalForks?: number
  topLanguages?: string[]
  deploymentSuccessRate?: number
}

export interface UsePortfolioDataReturn {
  projects: PortfolioProject[]
  stats: PortfolioStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Interface that matches ScrollTriggered3DSections expectations
export interface ScrollProject {
  id: string
  name: string
  title?: string  // ← FIXED: Made optional
  description: string
  techStack: string[]
  featured: boolean
  github: {
    stars: number
    forks: number
    url: string
  }
  vercel: {
    isLive: boolean
    liveUrl?: string
  }
}

// Interface for Hero section projects
export interface HeroProject {
  id: string
  title?: string  // ← FIXED: Made optional
  description: string
  techStack: string[]
  featured: boolean
  github: {
    stars: number
    forks: number
    url: string
  }
  vercel: {
    isLive: boolean
    liveUrl?: string
  }
}

// Enhanced project with full GitHub and Vercel integration
export interface EnhancedPortfolioProject {
  id: string
  slug: string
  name: string
  title?: string  // ← FIXED: Made optional
  description: string
  longDescription?: string
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other'
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  featured: boolean
  order: number
  
  // GitHub integration
  github?: {
    repository: GitHubRepository
    url?: string
    stats: {
      stars: number
      forks: number
      watchers: number
      issues: number
      prs: number
    }
    activity: {
      lastCommit: string
      commitsThisMonth: number
      contributors: number
    }
  }
  
  // Vercel integration
  vercel?: {
    project: VercelProjectWithStatus
    deployments: number
    deploymentStatus?: string
    lastDeployment?: {
      state: string
      url: string
      createdAt: string
    }
    customDomains: string[]
    isLive: boolean
  }
  
  // Custom metadata
  metadata: {
    customDescription?: string
    images: string[]
    tags: string[]
    highlights: string[]
    challenges?: string[]
    learnings?: string[]
    client?: string
    teamSize?: number
    role?: string
    liveUrl?: string
    demoUrl?: string
    caseStudyUrl?: string
    startDate?: string
    endDate?: string
  }
  
  // Computed properties
  techStack: string[]
  lastActivity: string
  deploymentScore: number
  popularity: number
}

// Portfolio analytics and insights
export interface PortfolioAnalytics {
  github: GitHubStats
  vercel: VercelStats
  overview: {
    totalProjects: number
    featuredProjects: number
    liveProjects: number
    archivedProjects: number
    totalStars: number
    totalForks: number
    successfulDeployments: number
    deploymentSuccessRate: number
  }
  languages: {
    [language: string]: {
      percentage: number
      projects: number
      stars: number
    }
  }
  activity: {
    lastCommit: string
    lastDeployment: string
    commitsThisMonth: number
    deploymentsThisMonth: number
    activeProjects: number
  }
  trends: {
    starsGrowth: number
    projectsGrowth: number
    deploymentFrequency: number
    popularRepositories: string[]
    trendingTechnologies: string[]
  }
}

// Portfolio configuration
export interface PortfolioConfig {
  github: {
    username: string
    includePrivate: boolean
    excludeRepos: string[]
    featuredRepos: string[]
  }
  vercel: {
    teamId?: string
    includePreview: boolean
    excludeProjects: string[]
    featuredProjects: string[]
  }
  display: {
    projectsPerPage: number
    defaultSort: 'featured' | 'stars' | 'updated' | 'created'
    defaultFilter: 'all' | 'featured' | 'live'
    showPrivateRepos: boolean
    showArchivedProjects: boolean
  }
  cache: {
    githubCacheDuration: number
    vercelCacheDuration: number
    statsCacheDuration: number
  }
}

// API integration types
export interface PortfolioAPIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
  cached?: boolean
  source?: 'github' | 'vercel' | 'cache' | 'fallback'
}

export interface PortfolioSyncStatus {
  github: {
    lastSync: string
    status: 'success' | 'error' | 'syncing'
    repositoriesCount: number
    error?: string
  }
  vercel: {
    lastSync: string
    status: 'success' | 'error' | 'syncing'
    projectsCount: number
    error?: string
  }
  overall: {
    lastFullSync: string
    status: 'healthy' | 'degraded' | 'error'
    nextSync: string
  }
}