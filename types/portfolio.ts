// types/portfolio.ts - FIXED with unified type definitions
import type { GitHubRepository, GitHubStats } from './github'
import type { VercelProjectWithStatus, VercelStats } from './vercel'

// Re-export types that are needed by other modules
export type { GitHubRepository, GitHubStats } from './github'
export type { VercelProjectWithStatus, VercelStats } from './vercel'

// UNIFIED: Main portfolio project interface - covers all use cases
export interface PortfolioProject {
  // Core identification
  id: string
  name: string
  title?: string // Optional - falls back to name if not provided
  
  // Description and content
  description: string
  longDescription?: string
  
  // Technical details
  techStack: string[]
  tags?: string[]
  topics?: string[] // GitHub topics
  
  // Classification
  featured: boolean
  category?: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other'
  status?: 'completed' | 'in-progress' | 'planning' | 'archived'
  complexity?: 'beginner' | 'intermediate' | 'advanced'
  
  // Project metadata
  image?: string
  startDate?: string
  endDate?: string
  teamSize?: number
  role?: string
  client?: string
  
  // Learning and challenges
  challenges?: string[]
  learnings?: string[]
  highlights?: string[]
  metrics?: Record<string, any>
  
  // GitHub integration
  github?: {
    stars: number
    forks: number
    url: string
    topics?: string[]
    lastUpdated?: string
    language?: string
  }
  
  // Vercel integration
  vercel?: {
    isLive: boolean
    liveUrl?: string
    deploymentStatus?: string
  }
  
  // Legacy compatibility
  githubUrl?: string
  liveUrl?: string
}

// UNIFIED: Portfolio statistics interface
export interface PortfolioStats {
  // Core metrics
  totalProjects: number
  totalStars: number
  liveProjects: number
  
  // Extended metrics (optional for backward compatibility)
  totalForks?: number
  topLanguages?: string[]
  deploymentSuccessRate?: number
  
  // Activity metrics
  recentActivity?: {
    activeProjects: number
    lastUpdated?: string
  }
}

// Hook return type - unified interface
export interface UsePortfolioDataReturn {
  projects: PortfolioProject[]
  stats: PortfolioStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// ENHANCED: Extended project interface for advanced use cases
export interface EnhancedPortfolioProject {
  // Base properties (not extending to avoid conflicts)
  id: string
  slug: string
  name: string
  title?: string
  description: string
  longDescription?: string
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other'
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  featured: boolean
  order: number
  techStack: string[]
  
  // Enhanced GitHub integration (different structure than base)
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
  
  // Enhanced Vercel integration
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
  
  // Rich metadata
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
  lastActivity: string
  deploymentScore: number
  popularity: number
}

// Specialized interfaces for different component needs
export interface ScrollProject {
  id: string
  name: string
  title?: string
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

export interface HeroProject {
  id: string
  title?: string
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

// API response interfaces
export interface PortfolioAPIResponse<T = any> {
  success: boolean
  data?: T
  projects?: T[] // For projects endpoint
  error?: string
  message?: string
  timestamp: string
  source?: 'github' | 'vercel' | 'cache' | 'fallback' | 'mock'
  meta?: {
    hasGitHubIntegration?: boolean
    totalAvailable?: number
    cacheTime?: number
    filters?: Record<string, any>
    fallbackReason?: string
  }
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

// Configuration and sync interfaces
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

// Type guards and utilities
export function isPortfolioProject(obj: any): obj is PortfolioProject {
  return obj && 
         typeof obj.id === 'string' && 
         typeof obj.name === 'string' && 
         typeof obj.description === 'string' &&
         Array.isArray(obj.techStack) &&
         typeof obj.featured === 'boolean'
}

export function isEnhancedPortfolioProject(obj: any): obj is EnhancedPortfolioProject {
  return obj && 
         typeof obj.id === 'string' && 
         typeof obj.slug === 'string' && 
         typeof obj.metadata === 'object' &&
         typeof obj.deploymentScore === 'number'
}

// Conversion utilities
export function toScrollProject(project: PortfolioProject): ScrollProject {
  return {
    id: project.id,
    name: project.name,
    title: project.title,
    description: project.description,
    techStack: project.techStack,
    featured: project.featured,
    github: project.github || { stars: 0, forks: 0, url: '' },
    vercel: project.vercel || { isLive: false }
  }
}

export function toHeroProject(project: PortfolioProject): HeroProject {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    techStack: project.techStack,
    featured: project.featured,
    github: project.github || { stars: 0, forks: 0, url: '' },
    vercel: project.vercel || { isLive: false }
  }
}

// Enhanced project creation utility
export function createEnhancedProject(
  base: PortfolioProject, 
  githubRepo?: GitHubRepository,
  vercelProject?: VercelProjectWithStatus
): EnhancedPortfolioProject {
  return {
    // Copy base properties
    id: base.id,
    name: base.name,
    title: base.title,
    description: base.description,
    longDescription: base.longDescription,
    category: base.category || 'other',
    status: base.status || 'completed',
    featured: base.featured,
    techStack: base.techStack,
    
    // Enhanced properties
    slug: base.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    order: base.featured ? 1 : 10,
    
    github: githubRepo ? {
      repository: githubRepo,
      url: base.github?.url || githubRepo.html_url,
      stats: {
        stars: githubRepo.stargazers_count,
        forks: githubRepo.forks_count,
        watchers: githubRepo.watchers_count,
        issues: githubRepo.open_issues_count,
        prs: 0 // Would need additional API call
      },
      activity: {
        lastCommit: githubRepo.updated_at,
        commitsThisMonth: 0, // Would need additional API call
        contributors: 1 // Would need additional API call
      }
    } : base.github ? {
      repository: {} as GitHubRepository, // Fallback
      url: base.github.url,
      stats: {
        stars: base.github.stars,
        forks: base.github.forks,
        watchers: base.github.stars,
        issues: 0,
        prs: 0
      },
      activity: {
        lastCommit: base.github.lastUpdated || new Date().toISOString(),
        commitsThisMonth: 0,
        contributors: 1
      }
    } : undefined,
    
    vercel: vercelProject ? {
      project: vercelProject,
      deployments: 1,
      deploymentStatus: vercelProject.status?.state || 'unknown',
      lastDeployment: vercelProject.status ? {
        state: vercelProject.status.state,
        url: vercelProject.status.url,
        createdAt: new Date(vercelProject.status.created).toISOString()
      } : undefined,
      customDomains: [],
      isLive: vercelProject.status?.state === 'READY'
    } : base.vercel ? {
      project: {} as VercelProjectWithStatus, // Fallback
      deployments: 1,
      deploymentStatus: base.vercel.deploymentStatus,
      lastDeployment: undefined,
      customDomains: [],
      isLive: base.vercel.isLive
    } : undefined,
    
    metadata: {
      customDescription: base.longDescription,
      images: base.image ? [base.image] : [],
      tags: base.tags || [],
      highlights: base.highlights || [],
      challenges: base.challenges,
      learnings: base.learnings,
      client: base.client,
      teamSize: base.teamSize,
      role: base.role,
      liveUrl: base.liveUrl,
      demoUrl: base.liveUrl,
      caseStudyUrl: undefined,
      startDate: base.startDate,
      endDate: base.endDate
    },
    
    lastActivity: githubRepo?.updated_at || base.github?.lastUpdated || new Date().toISOString(),
    deploymentScore: calculateDeploymentScore(base),
    popularity: calculatePopularity(base)
  }
}

// Helper functions
function calculateDeploymentScore(project: PortfolioProject): number {
  let score = 60
  
  if (project.description) score += 10
  if (project.github?.stars && project.github.stars > 0) {
    score += Math.min(project.github.stars * 2, 20)
  }
  if (project.techStack && project.techStack.length > 0) score += 5
  if (project.vercel?.isLive) score += 15
  if (project.featured) score += 10
  
  return Math.min(score, 100)
}

function calculatePopularity(project: PortfolioProject): number {
  const stars = project.github?.stars || 0
  const forks = project.github?.forks || 0
  const featured = project.featured ? 10 : 0
  const hasLiveUrl = (project.liveUrl || project.vercel?.isLive) ? 5 : 0
  
  return stars * 2 + forks + featured + hasLiveUrl
}