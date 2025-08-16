// lib/portfolio-adapter.ts - Bridge between legacy and enhanced portfolio types

import type { 
  PortfolioProject as LegacyProject,
  EnhancedPortfolioProject as EnhancedProject,
  PortfolioStats,
  GitHubRepository,
} from '@/types/portfolio'

import { getEnhancedProjects, getPortfolioStats, EnhancedProject as SourceEnhancedProject } from './portfolio-integration'

// =============================================================================
// LEGACY PROJECT ADAPTER
// =============================================================================

/**
 * Converts EnhancedProject back to legacy Project format
 * for compatibility with existing project detail pages
 */
export function convertToLegacyProject(enhanced: SourceEnhancedProject): LegacyProject {
  return {
    id: enhanced.id,
    name: enhanced.name,  // ← FIX: Add required name property
    title: enhanced.name,  // ← FIX: Use name since title doesn't exist
    description: enhanced.description,
    longDescription: enhanced.longDescription || enhanced.description,
    techStack: enhanced.techStack || [],  // ← FIX: Add required techStack property
    tags: enhanced.techStack?.length > 0 ? enhanced.techStack : (enhanced.metadata?.tags || []),
    image: enhanced.metadata?.images?.[0] || '/images/projects/placeholder.jpg',
    githubUrl: enhanced.github?.url || '',
    liveUrl: enhanced.metadata?.liveUrl || enhanced.vercel?.liveUrl || '',
    featured: enhanced.featured,
    status: enhanced.status,
    category: enhanced.category,
    // FIX: Use safe property access and provide defaults
    startDate: new Date().toISOString(), // Default since startDate doesn't exist in metadata
    endDate: undefined, // Default since endDate doesn't exist in metadata
    challenges: [], // Default since challenges doesn't exist in metadata
    learnings: [], // Default since learnings doesn't exist in metadata
    metrics: {}, // Default since metrics doesn't exist on enhanced
    github: enhanced.github ? {
      stars: enhanced.github.stars,  // ← FIX: Use stars directly, not stats.stars
      forks: enhanced.github.forks,  // ← FIX: Use forks directly, not stats.forks
      url: enhanced.github.url || '',
      topics: enhanced.github.topics || [],
      lastUpdated: enhanced.github.lastUpdated
    } : undefined,
    vercel: enhanced.vercel ? {
      isLive: enhanced.vercel.isLive,
      liveUrl: enhanced.vercel.liveUrl,  // ← FIX: Use liveUrl directly, not project.name
      deploymentStatus: enhanced.vercel.deploymentStatus
    } : undefined
  }
}

/**
 * Converts legacy Project to EnhancedProject format
 * for use with new 3D components
 */
export function convertToEnhancedProject(legacy: LegacyProject): EnhancedProject {
  return {
    id: legacy.id,
    slug: legacy.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    name: legacy.name || legacy.title,
    title: legacy.title,
    description: legacy.description,
    longDescription: legacy.longDescription,
    category: mapLegacyCategory(legacy.category || 'other'),
    status: mapLegacyStatus(legacy.status || 'completed'),
    featured: legacy.featured,
    order: 0,
    
    github: legacy.githubUrl ? {
      repository: {} as GitHubRepository,
      url: legacy.githubUrl,  // ← FIX: Add url property
      stats: {  // ← FIX: Use stats object structure
        stars: legacy.github?.stars || 0,
        forks: legacy.github?.forks || 0,
        watchers: 0,
        issues: 0,
        prs: 0
      },
      activity: {  // ← FIX: Use activity object structure
        lastCommit: legacy.github?.lastUpdated || legacy.endDate || new Date().toISOString(),
        commitsThisMonth: 0,
        contributors: 1
      }
    } : undefined,
    
    vercel: legacy.liveUrl ? {
      project: {} as any,  // ← FIX: Add required project property
      deployments: 1,
      deploymentStatus: legacy.vercel?.deploymentStatus || 'ready',
      lastDeployment: {
        state: 'READY',
        url: legacy.liveUrl,
        createdAt: new Date().toISOString()
      },
      customDomains: [],
      isLive: true
      // ← REMOVE: liveUrl doesn't exist in this interface
    } : undefined,
    
    metadata: {
      customDescription: legacy.longDescription,
      images: [legacy.image || '/images/projects/placeholder.jpg'],
      tags: legacy.tags || [],
      highlights: generateHighlights(legacy),
      challenges: legacy.challenges || [],  // ← ADD: Now that we added it to metadata interface
      learnings: legacy.learnings || [],    // ← ADD: Now that we added it to metadata interface
      liveUrl: legacy.liveUrl,
      startDate: legacy.startDate,          // ← ADD: Now that we added it to metadata interface
      endDate: legacy.endDate               // ← ADD: Now that we added it to metadata interface
    },
    
    techStack: legacy.techStack || legacy.tags || [],
    lastActivity: legacy.endDate || new Date().toISOString(),
    deploymentScore: calculateDeploymentScore(legacy),
    popularity: legacy.github?.stars || 0
  }
}

// =============================================================================
// PORTFOLIO DATA ADAPTERS
// =============================================================================

/**
 * Get projects in legacy format for existing project detail pages
 */
export async function getLegacyProjects(): Promise<LegacyProject[]> {
  try {
    const enhancedProjects = await getEnhancedProjects()
    return enhancedProjects.map(convertToLegacyProject)
  } catch (error) {
    console.error('Error fetching legacy projects:', error)
    return []
  }
}

/**
 * Get a single project by slug in legacy format
 */
export async function getLegacyProjectBySlug(slug: string): Promise<LegacyProject | null> {
  try {
    const enhancedProjects = await getEnhancedProjects()
    const enhanced = enhancedProjects.find(p => p.slug === slug || p.id === slug)
    return enhanced ? convertToLegacyProject(enhanced) : null
  } catch (error) {
    console.error(`Error fetching legacy project ${slug}:`, error)
    return null
  }
}

/**
 * Get portfolio stats in legacy format if needed
 */
export async function getLegacyPortfolioStats() {
  try {
    const stats = await getPortfolioStats()
    
    return {
      totalProjects: stats.totalProjects,
      totalCommits: 500, // Placeholder
      totalStars: stats.totalStars,
      languagesUsed: Object.keys(stats.languageStats || {}),
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching legacy portfolio stats:', error)
    return {
      totalProjects: 0,
      totalCommits: 0,
      totalStars: 0,
      languagesUsed: [],
      lastUpdated: new Date().toISOString()
    }
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function mapLegacyCategory(category: string): EnhancedProject['category'] {
  const categoryMap: Record<string, EnhancedProject['category']> = {
    'full-stack': 'fullstack',
    'fullstack': 'fullstack',
    'frontend': 'frontend',
    'front-end': 'frontend',
    'backend': 'backend',
    'back-end': 'backend',
    'mobile': 'mobile',
    'data': 'data',
    'machine-learning': 'data',
    'ai': 'data',
    'data-science': 'data'
  }
  return categoryMap[category?.toLowerCase()] || 'other'
}

function mapLegacyStatus(status: string): EnhancedProject['status'] {
  const statusMap: Record<string, EnhancedProject['status']> = {
    'completed': 'completed',
    'complete': 'completed',
    'finished': 'completed',
    'in-progress': 'in-progress',
    'in progress': 'in-progress',
    'ongoing': 'in-progress',
    'planning': 'planning',
    'planned': 'planning',
    'archived': 'archived',
    'deprecated': 'archived'
  }
  return statusMap[status?.toLowerCase()] || 'completed'
}

function generateHighlights(project: LegacyProject): string[] {
  const highlights: string[] = []
  if (project.featured) highlights.push('Featured Project')
  if (project.liveUrl) highlights.push('Live Demo Available')
  if (project.githubUrl) highlights.push('Open Source')
  if (project.metrics && Object.keys(project.metrics).length > 0) highlights.push('Performance Metrics Tracked')
  if (project.challenges && project.challenges.length > 3) highlights.push('Complex Technical Challenges')
  if (project.tags?.includes('TypeScript')) highlights.push('Built with TypeScript')
  if (project.tags?.includes('React')) highlights.push('React Application')
  return highlights
}

function calculateDeploymentScore(project: LegacyProject): number {
  let score = 60
  if (project.description?.length > 50) score += 5
  if (project.longDescription?.length > 100) score += 5
  if (project.image && project.image !== '/images/projects/placeholder.jpg') score += 5
  if (project.tags?.length >= 3) score += 5
  if (project.tags?.length >= 5) score += 5
  if (project.tags?.includes('TypeScript')) score += 10
  if (project.tags?.includes('React')) score += 5
  if (project.tags?.includes('Next.js')) score += 10
  if (project.liveUrl) score += 15
  if (project.githubUrl) score += 10
  if (project.featured) score += 10
  if (project.challenges?.length > 0) score += 5
  if (project.learnings?.length > 0) score += 5
  if (project.metrics && Object.keys(project.metrics).length > 0) score += 10
  if (project.status === 'completed') score += 10
  return Math.min(score, 100)
}

// =============================================================================
// TYPE-SAFE PROJECT CREATION
// =============================================================================

export function createProject(data: Partial<LegacyProject>): LegacyProject {
  return {
    id: data.id || generateProjectId(),
    name: data.name || data.title || 'Untitled Project',  // ← FIX: Ensure name exists
    title: data.title || data.name || 'Untitled Project',
    description: data.description || '',
    longDescription: data.longDescription || data.description || '',
    techStack: data.techStack || data.tags || [],  // ← FIX: Ensure techStack exists
    image: data.image || '/images/projects/placeholder.jpg',
    tags: data.tags || data.techStack || [],
    githubUrl: data.githubUrl || '',
    liveUrl: data.liveUrl || '',
    featured: data.featured || false,
    status: data.status || 'completed',
    category: data.category || 'other',
    startDate: data.startDate || new Date().toISOString(),
    endDate: data.endDate,
    challenges: data.challenges || [],
    learnings: data.learnings || [],
    metrics: data.metrics || {}
  }
}

function generateProjectId(): string {
  return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// =============================================================================
// MOCK DATA GENERATORS (for development)
// =============================================================================

export function generateMockLegacyProjects(count: number = 6): LegacyProject[] {
  const mockProjects: LegacyProject[] = []
  for (let i = 0; i < count; i++) {
    mockProjects.push(createProject({
      id: `mock-project-${i + 1}`,
      name: `Mock Project ${i + 1}`,  // ← FIX: Add name property
      title: `Mock Project ${i + 1}`,
      description: `This is a mock project for development and testing purposes. Project ${i + 1} demonstrates various features.`,
      longDescription: `Extended description for mock project ${i + 1}. This project showcases modern web development practices and technologies.`,
      techStack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],  // ← FIX: Use techStack instead of tags
      tags: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      featured: i < 3,
      status: 'completed',
      category: i % 2 === 0 ? 'fullstack' : 'frontend',
      githubUrl: `https://github.com/sippinwindex/mock-project-${i + 1}`,
      liveUrl: i % 2 === 0 ? `https://mock-project-${i + 1}.vercel.app` : '',
      metrics: {
        performanceScore: `${85 + i * 2}%`,
        buildTime: `${20 + i}s`
      }
    }))
  }
  return mockProjects
}

// =============================================================================
// SEARCH & FILTER UTILITIES
// =============================================================================

export function searchLegacyProjects(
  projects: LegacyProject[],
  query: string,
  filters: {
    category?: string;
    status?: string;
    featured?: boolean;
    tags?: string[];
  } = {}
): LegacyProject[] {
  let filtered = projects
  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    filtered = filtered.filter(project =>
      project.title?.toLowerCase().includes(searchTerm) ||
      project.description?.toLowerCase().includes(searchTerm) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
  if (filters.category) {
    filtered = filtered.filter(project => project.category?.toLowerCase() === filters.category!.toLowerCase())
  }
  if (filters.status) {
    filtered = filtered.filter(project => project.status?.toLowerCase() === filters.status!.toLowerCase())
  }
  if (typeof filters.featured === 'boolean') {
    filtered = filtered.filter(project => project.featured === filters.featured)
  }
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(project =>
      filters.tags!.some(tag => 
        project.tags?.some(projectTag => 
          projectTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    )
  }
  return filtered
}

export default {
  convertToLegacyProject,
  convertToEnhancedProject,
  getLegacyProjects,
  getLegacyProjectBySlug,
  getLegacyPortfolioStats,
  createProject,
  generateMockLegacyProjects,
  searchLegacyProjects
}