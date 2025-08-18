// lib/portfolio-adapter.ts - FIXED type error
// This file adapts between different project formats

import type { PortfolioProject, EnhancedPortfolioProject } from '@/types/portfolio'
import type { GitHubRepository } from '@/types/github'  // ← ADDED: Import complete type

// Adapter to convert legacy project format to enhanced format
export function adaptLegacyProject(legacy: PortfolioProject): EnhancedPortfolioProject {
  return {
    id: legacy.id,
    slug: legacy.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    name: legacy.name || legacy.title || 'Untitled Project',  // ← FIXED: Added fallback
    title: legacy.title || legacy.name || 'Untitled Project',  // ← FIXED: Added fallback
    description: legacy.description || 'No description available',  // ← FIXED: Added fallback
    longDescription: legacy.longDescription,
    category: legacy.category || 'other',  // ← FIXED: Added fallback
    status: legacy.status || 'completed',  // ← FIXED: Added fallback
    featured: legacy.featured || false,
    order: legacy.featured ? 1 : 10,

    // GitHub integration
    github: legacy.github ? {
      repository: {
        // Complete GitHubRepository object with all required properties
        id: parseInt(legacy.id) || 0,
        name: legacy.name,
        full_name: `sippinwindex/${legacy.name}`,
        html_url: legacy.github.url,
        description: legacy.description,
        stargazers_count: legacy.github.stars,
        forks_count: legacy.github.forks,
        language: legacy.github.language || null,
        topics: legacy.github.topics || [],
        pushed_at: legacy.github.lastUpdated || new Date().toISOString(),
        updated_at: legacy.github.lastUpdated || new Date().toISOString(),
        created_at: new Date().toISOString(),
        homepage: legacy.liveUrl || null,
        archived: false,
        private: false,
        size: 0,
        default_branch: 'main',
        open_issues_count: 0,
        disabled: false,
        fork: false,
        // ADDED: Missing required properties from GitHubRepository
        watchers_count: legacy.github.stars, // Usually same as stars
        has_issues: true,
        has_projects: true,
        has_wiki: true,
        has_pages: Boolean(legacy.liveUrl),
        has_downloads: true,
        license: undefined,  // ← FIXED: Use undefined instead of null
        owner: {
          login: 'sippinwindex',
          id: 12345,
          avatar_url: 'https://github.com/sippinwindex.png',
          html_url: 'https://github.com/sippinwindex',
          type: 'User' as const
        }
      },
      url: legacy.github.url,
      stats: {
        stars: legacy.github.stars,
        forks: legacy.github.forks,
        watchers: legacy.github.stars,
        issues: 0,
        prs: 0
      },
      activity: {
        lastCommit: legacy.github.lastUpdated || new Date().toISOString(),
        commitsThisMonth: 5,
        contributors: 1
      }
    } : undefined,

    // Vercel integration
    vercel: legacy.vercel ? {
      project: {
        project: {
          id: legacy.id,
          name: legacy.name,
          accountId: 'account-id',
          createdAt: Date.now(),
          updatedAt: Date.now()
        },
        status: legacy.vercel.isLive ? {
          uid: 'deployment-id',
          name: legacy.name,
          url: legacy.vercel.liveUrl || '',
          created: Date.now(),
          state: 'READY' as const,
          type: 'LAMBDAS' as const,
          meta: {},
          target: 'production' as const,
          creator: {
            uid: 'user-id',
            username: 'sippinwindex'
          },
          inspectorUrl: null,
          projectId: legacy.id,
          readyAt: Date.now()
        } : undefined,
        liveUrl: legacy.vercel.liveUrl
      },
      deployments: 1,
      deploymentStatus: legacy.vercel.deploymentStatus || (legacy.vercel.isLive ? 'deployed' : 'not-deployed'),
      lastDeployment: legacy.vercel.isLive ? {
        state: 'READY',
        url: legacy.vercel.liveUrl || '',
        createdAt: new Date().toISOString()
      } : undefined,
      customDomains: [],
      isLive: legacy.vercel.isLive
    } : undefined,

    // Custom metadata
    metadata: {
      customDescription: legacy.longDescription,
      images: legacy.image ? [legacy.image] : [],
      tags: legacy.tags || [],
      highlights: legacy.highlights || [],
      challenges: legacy.challenges,
      learnings: legacy.learnings,
      client: legacy.client,
      teamSize: legacy.teamSize,
      role: legacy.role,
      liveUrl: legacy.liveUrl,
      demoUrl: legacy.liveUrl,
      caseStudyUrl: undefined,
      startDate: legacy.startDate,
      endDate: legacy.endDate
    },

    // Computed properties
    techStack: legacy.techStack || [],
    lastActivity: legacy.github?.lastUpdated || new Date().toISOString(),
    deploymentScore: calculateDeploymentScore(legacy),
    popularity: calculatePopularity(legacy)
  }
}

// Helper function to calculate deployment score
function calculateDeploymentScore(project: PortfolioProject): number {
  let score = 60

  if (project.description) score += 10
  if (project.github?.stars && project.github.stars > 0) score += Math.min(project.github.stars * 2, 20)
  if (project.techStack && project.techStack.length > 0) score += 5
  if (project.vercel?.isLive) score += 15
  if (project.featured) score += 10

  return Math.min(score, 100)
}

// Helper function to calculate popularity
function calculatePopularity(project: PortfolioProject): number {
  const stars = project.github?.stars || 0
  const forks = project.github?.forks || 0
  const featured = project.featured ? 10 : 0
  const hasLiveUrl = (project.liveUrl || project.vercel?.isLive) ? 5 : 0
  
  return stars * 2 + forks + featured + hasLiveUrl
}

// Adapter to convert enhanced project back to simple format
export function adaptEnhancedProject(enhanced: EnhancedPortfolioProject): PortfolioProject {
  return {
    id: enhanced.id,
    name: enhanced.name,
    title: enhanced.title,
    description: enhanced.description,
    longDescription: enhanced.longDescription,
    techStack: enhanced.techStack,
    tags: enhanced.metadata.tags,
    featured: enhanced.featured,
    category: enhanced.category,
    status: enhanced.status,
    image: enhanced.metadata.images[0],
    startDate: enhanced.metadata.startDate,
    endDate: enhanced.metadata.endDate,
    challenges: enhanced.metadata.challenges,
    learnings: enhanced.metadata.learnings,
    metrics: undefined,
    github: enhanced.github ? {
      stars: enhanced.github.stats.stars,
      forks: enhanced.github.stats.forks,
      url: enhanced.github.url || enhanced.github.repository.html_url,
      topics: enhanced.github.repository.topics,
      lastUpdated: enhanced.github.activity.lastCommit,
      language: enhanced.github.repository.language || undefined
    } : undefined,
    vercel: enhanced.vercel ? {
      isLive: enhanced.vercel.isLive,
      liveUrl: enhanced.vercel.project.liveUrl,
      deploymentStatus: enhanced.vercel.deploymentStatus
    } : undefined,
    githubUrl: enhanced.github?.url || enhanced.github?.repository.html_url,
    liveUrl: enhanced.metadata.liveUrl,
    topics: enhanced.metadata.tags,
    complexity: undefined,
    teamSize: enhanced.metadata.teamSize,
    role: enhanced.metadata.role,
    client: enhanced.metadata.client,
    highlights: enhanced.metadata.highlights
  }
}

// Batch adapter functions
export function adaptLegacyProjects(legacyProjects: PortfolioProject[]): EnhancedPortfolioProject[] {
  return legacyProjects.map(adaptLegacyProject)
}

export function adaptEnhancedProjects(enhancedProjects: EnhancedPortfolioProject[]): PortfolioProject[] {
  return enhancedProjects.map(adaptEnhancedProject)
}

// Type guards
export function isLegacyProject(project: any): project is PortfolioProject {
  return typeof project === 'object' && 
         typeof project.id === 'string' && 
         typeof project.name === 'string' &&
         typeof project.description === 'string'
}

export function isEnhancedProject(project: any): project is EnhancedPortfolioProject {
  return typeof project === 'object' && 
         typeof project.id === 'string' && 
         typeof project.slug === 'string' &&
         typeof project.metadata === 'object'
}

// Default export
const portfolioAdapter = {
  adaptLegacyProject,
  adaptEnhancedProject,
  adaptLegacyProjects,
  adaptEnhancedProjects,
  isLegacyProject,
  isEnhancedProject,
  calculateDeploymentScore,
  calculatePopularity
}

export default portfolioAdapter