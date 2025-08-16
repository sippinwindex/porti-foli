// types/portfolio.ts
import type { GitHubRepository, GitHubStats } from './github'
import type { VercelProjectWithStatus, VercelStats } from './vercel'

export interface PortfolioProject {
  id: string
  name: string
  title: string
  description: string
  techStack: string[]
  tags?: string[]  // ← ADD THIS LINE - missing tags property
  featured: boolean
  github?: {
    stars: number
    forks: number
    url: string  // Always required for consistency
    topics?: string[]  // ← ADD THIS LINE - for GitHub topics
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
  }
  githubUrl?: string
  liveUrl?: string
}

export interface PortfolioStats {
  totalProjects: number
  totalStars: number
  liveProjects: number
  recentActivity?: {
    activeProjects: number
  }
}

export interface UsePortfolioDataReturn {
  projects: PortfolioProject[]
  stats: PortfolioStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>  // ← ADD THIS LINE - the missing refetch function
}

// Interface that matches ScrollTriggered3DSections expectations
export interface ScrollProject {
  id: string
  name: string  // Required by ScrollTriggered3DSections
  title: string
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
  title: string
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
  title: string
  description: string
  longDescription?: string
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other'
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  featured: boolean
  order: number
  
  // GitHub integration
  github?: {
    repository: GitHubRepository
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
    client?: string
    teamSize?: number
    role?: string
    liveUrl?: string
    demoUrl?: string
    caseStudyUrl?: string
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