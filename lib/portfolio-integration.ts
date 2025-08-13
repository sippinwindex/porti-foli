// lib/portfolio-integration.ts - Updated with Real GitHub Integration
import { getCachedRepositories, getCachedGitHubStats, GitHubRepository } from './github-api'
import { getCachedProjectsWithStatus } from './vercel-api'

// Re-export GitHubRepository from github-api for consistency
export type { GitHubRepository }

export interface EnhancedProject {
  id: string
  slug: string
  name: string
  description: string
  longDescription?: string
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other'
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  featured: boolean
  order: number
  
  // GitHub data
  github?: {
    url: string
    stars: number
    forks: number
    language: string | null
    languages: Record<string, number>
    topics: string[]
    lastUpdated: string
    readme?: string
    repository?: GitHubRepository
  }
  
  // Vercel data
  vercel?: {
    deploymentStatus: any
    liveUrl?: string
    isLive: boolean
    lastDeployed?: string
    buildStatus: 'success' | 'error' | 'building' | 'pending' | 'unknown'
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
  }
  
  // Computed properties
  techStack: string[]
  lastActivity: string
  deploymentScore: number
}

export interface PortfolioStats {
  totalProjects: number
  featuredProjects: number
  liveProjects: number
  totalStars: number
  totalForks: number
  languageStats: Record<string, number>
  categoryStats: Record<string, number>
  deploymentStats: {
    successful: number
    failed: number
    building: number
    pending: number
  }
  recentActivity: {
    lastCommit: string
    lastDeployment: string
    activeProjects: number
  }
}

class RealPortfolioIntegration {
  
  // Fetch real projects from GitHub
  async getRealGitHubProjects(): Promise<EnhancedProject[]> {
    try {
      console.log('🔄 Fetching real GitHub repositories...')
      
      const repositories = await getCachedRepositories()
      
      if (!repositories || repositories.length === 0) {
        console.warn('⚠️ No repositories found, using mock data')
        return this.getMockProjects()
      }
      
      console.log(`✅ Found ${repositories.length} repositories`)
      
      // Get Vercel deployment data
      const vercelProjects = await getCachedProjectsWithStatus().catch(() => [])
      
      // Transform GitHub repos to EnhancedProject format
      const enhancedProjects: EnhancedProject[] = repositories
        .filter(repo => {
          // Filter out non-portfolio repos
          const skipPatterns = [/^\./, /readme/i, /profile/i, /config/i]
          return !skipPatterns.some(pattern => pattern.test(repo.name)) && repo.description
        })
        .slice(0, 20) // Limit to top 20 projects
        .map((repo, index) => {
          
          // Find matching Vercel project
          const vercelProject = vercelProjects.find(v => 
            v.project.name.toLowerCase() === repo.name.toLowerCase()
          )
          
          // Determine category based on languages and topics
          const category = this.determineCategory(repo.languages || {}, repo.topics || [])
          
          // Calculate deployment score
          const deploymentScore = this.calculateDeploymentScore(repo, vercelProject?.status)
          
          // Determine if featured (high stars, recent activity, or specific topics)
          const featured = repo.stargazers_count > 2 || 
                          repo.topics?.includes('featured') ||
                          deploymentScore > 90 ||
                          index < 6 // Top 6 are featured
          
          return {
            id: repo.id.toString(),
            slug: repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            name: this.formatProjectName(repo.name),
            description: repo.description || 'A project built with modern web technologies',
            longDescription: repo.readme ? repo.readme.slice(0, 500) + '...' : undefined,
            category,
            status: 'completed' as const,
            featured,
            order: featured ? index : index + 100,
            
            github: {
              url: repo.html_url,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              languages: repo.languages || {},
              topics: repo.topics || [],
              lastUpdated: repo.updated_at,
              readme: repo.readme
            },
            
            vercel: vercelProject ? {
              deploymentStatus: vercelProject.status,
              liveUrl: vercelProject.liveUrl,
              isLive: vercelProject.status?.state === 'READY',
              lastDeployed: vercelProject.status ? new Date(vercelProject.status.createdAt).toISOString() : undefined,
              buildStatus: this.getBuildStatus(vercelProject.status?.state)
            } : undefined,
            
            metadata: {
              images: [`/projects/${repo.name.toLowerCase()}.jpg`],
              tags: repo.topics || [],
              highlights: this.generateHighlights(repo),
              liveUrl: vercelProject?.liveUrl || repo.homepage || undefined
            },
            
            techStack: this.extractTechStack(repo.languages || {}, repo.topics || []),
            lastActivity: repo.updated_at,
            deploymentScore
          }
        })
        .sort((a, b) => {
          // Sort featured first, then by deployment score
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.deploymentScore - a.deploymentScore
        })
      
      console.log(`✅ Processed ${enhancedProjects.length} enhanced projects`)
      return enhancedProjects
      
    } catch (error) {
      console.error('❌ Error fetching real GitHub projects:', error)
      return this.getMockProjects()
    }
  }
  
  // Get real portfolio stats
  async getRealPortfolioStats(): Promise<PortfolioStats> {
    try {
      console.log('🔄 Fetching real portfolio stats...')
      
      const [githubStats, projects] = await Promise.all([
        getCachedGitHubStats(),
        this.getRealGitHubProjects()
      ])
      
      const stats: PortfolioStats = {
        totalProjects: githubStats.totalRepositories,
        featuredProjects: projects.filter(p => p.featured).length,
        liveProjects: projects.filter(p => p.vercel?.isLive || p.metadata.liveUrl).length,
        totalStars: githubStats.totalStars,
        totalForks: githubStats.totalForks,
        languageStats: this.processLanguageStats(githubStats.languages),
        categoryStats: this.getCategoryStats(projects),
        deploymentStats: this.getDeploymentStats(projects),
        recentActivity: {
          lastCommit: projects[0]?.lastActivity || new Date().toISOString(),
          lastDeployment: projects.find(p => p.vercel?.lastDeployed)?.vercel?.lastDeployed || new Date().toISOString(),
          activeProjects: githubStats.recentActivity.activeRepositories
        }
      }
      
      console.log('✅ Portfolio stats calculated:', {
        totalProjects: stats.totalProjects,
        totalStars: stats.totalStars,
        liveProjects: stats.liveProjects
      })
      
      return stats
      
    } catch (error) {
      console.error('❌ Error fetching real portfolio stats:', error)
      return this.getMockStats()
    }
  }
  
  // Helper methods
  private determineCategory(languages: Record<string, number>, topics: string[]): EnhancedProject['category'] {
    // Check topics first for explicit categorization
    if (topics.includes('mobile') || topics.includes('ios') || topics.includes('android')) return 'mobile'
    if (topics.includes('data') || topics.includes('machine-learning') || topics.includes('ai')) return 'data'
    if (topics.includes('backend') || topics.includes('api')) return 'backend'
    if (topics.includes('frontend') || topics.includes('ui')) return 'frontend'
    if (topics.includes('fullstack')) return 'fullstack'
    
    // Infer from languages
    const topLanguages = Object.keys(languages).slice(0, 3)
    
    if (topLanguages.includes('Python') && topLanguages.includes('Jupyter Notebook')) return 'data'
    if (topLanguages.includes('Swift') || topLanguages.includes('Kotlin')) return 'mobile'
    if (topLanguages.includes('JavaScript') && topLanguages.includes('HTML')) return 'frontend'
    if (topLanguages.includes('TypeScript') && topLanguages.includes('Python')) return 'fullstack'
    if (topLanguages.includes('JavaScript') || topLanguages.includes('TypeScript')) return 'fullstack'
    
    return 'other'
  }
  
  private extractTechStack(languages: Record<string, number>, topics: string[]): string[] {
    const techStack = new Set<string>()
    
    // Add main languages
    Object.keys(languages).slice(0, 5).forEach(lang => {
      // Map common languages to display names
      const langMap: Record<string, string> = {
        'JavaScript': 'JavaScript',
        'TypeScript': 'TypeScript',
        'Python': 'Python',
        'HTML': 'HTML',
        'CSS': 'CSS',
        'Java': 'Java',
        'C++': 'C++',
        'Go': 'Go',
        'Rust': 'Rust'
      }
      const displayName = langMap[lang] || lang
      techStack.add(displayName)
    })
    
    // Add framework/technology topics
    const techTopics = topics.filter(topic => 
      ['react', 'vue', 'angular', 'nextjs', 'express', 'django', 'flask', 'node', 'mongodb', 'postgresql'].includes(topic.toLowerCase())
    )
    
    techTopics.forEach(topic => {
      const topicMap: Record<string, string> = {
        'nextjs': 'Next.js',
        'react': 'React',
        'vue': 'Vue.js',
        'angular': 'Angular',
        'express': 'Express',
        'django': 'Django',
        'flask': 'Flask',
        'node': 'Node.js',
        'mongodb': 'MongoDB',
        'postgresql': 'PostgreSQL'
      }
      const displayName = topicMap[topic.toLowerCase()] || topic
      techStack.add(displayName)
    })
    
    return Array.from(techStack).slice(0, 6)
  }
  
  private calculateDeploymentScore(repo: any, vercelStatus?: any): number {
    let score = 60
    
    // GitHub metrics
    if (repo.description) score += 10
    if (repo.stargazers_count > 0) score += 5
    if (repo.stargazers_count > 5) score += 10
    if (repo.forks_count > 0) score += 5
    if (repo.topics && repo.topics.length > 0) score += 5
    
    // Recent activity
    const lastUpdate = new Date(repo.updated_at)
    const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate < 30) score += 10
    else if (daysSinceUpdate < 90) score += 5
    
    // Vercel deployment
    if (vercelStatus) {
      if (vercelStatus.state === 'READY') score += 15
      else if (vercelStatus.state === 'BUILDING') score += 5
    }
    
    return Math.min(score, 100)
  }
  
  private formatProjectName(name: string): string {
    return name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\bJs\b/g, 'JS')
      .replace(/\bTs\b/g, 'TS')
      .replace(/\bApi\b/g, 'API')
      .replace(/\bUi\b/g, 'UI')
      .replace(/\bDb\b/g, 'DB')
  }
  
  private generateHighlights(repo: any): string[] {
    const highlights: string[] = []
    
    if (repo.stargazers_count > 10) highlights.push(`${repo.stargazers_count}+ GitHub stars`)
    if (repo.forks_count > 5) highlights.push(`${repo.forks_count}+ forks from community`)
    if (repo.topics && repo.topics.includes('featured')) highlights.push('Featured project')
    if (repo.language === 'TypeScript') highlights.push('Built with TypeScript')
    if (repo.topics && repo.topics.includes('react')) highlights.push('React-powered application')
    
    return highlights
  }
  
  private getBuildStatus(vercelState?: string): EnhancedProject['vercel']['buildStatus'] {
    switch (vercelState) {
      case 'READY': return 'success'
      case 'ERROR': return 'error'
      case 'BUILDING': return 'building'
      case 'QUEUED':
      case 'INITIALIZING': return 'pending'
      default: return 'unknown'
    }
  }
  
  private processLanguageStats(languages: Record<string, number>): Record<string, number> {
    const total = Object.values(languages).reduce((sum, count) => sum + count, 0)
    const stats: Record<string, number> = {}
    
    Object.entries(languages).forEach(([lang, count]) => {
      const percentage = Math.round((count / total) * 100)
      if (percentage > 1) { // Only include languages with >1% usage
        stats[lang] = percentage
      }
    })
    
    return stats
  }
  
  private getCategoryStats(projects: EnhancedProject[]): Record<string, number> {
    const stats: Record<string, number> = {}
    projects.forEach(project => {
      stats[project.category] = (stats[project.category] || 0) + 1
    })
    return stats
  }
  
  private getDeploymentStats(projects: EnhancedProject[]) {
    return {
      successful: projects.filter(p => p.vercel?.buildStatus === 'success').length,
      failed: projects.filter(p => p.vercel?.buildStatus === 'error').length,
      building: projects.filter(p => p.vercel?.buildStatus === 'building').length,
      pending: projects.filter(p => p.vercel?.buildStatus === 'pending').length
    }
  }
  
  // Fallback mock data
  private getMockProjects(): EnhancedProject[] {
    const { mockProjects } = require('./mock-data')
    return mockProjects.map((p: any, index: number) => ({
      ...p,
      slug: p.id,
      lastActivity: new Date().toISOString(),
      deploymentScore: 85,
      order: index,
      metadata: {
        images: [],
        tags: p.techStack,
        highlights: [],
      },
      techStack: p.techStack,
    }))
  }
  
  private getMockStats(): PortfolioStats {
    const { mockStats } = require('./mock-data')
    return mockStats
  }
}

// Export singleton instance
const realPortfolioIntegration = new RealPortfolioIntegration()

// Main export functions
export async function getEnhancedProjects(): Promise<EnhancedProject[]> {
  return realPortfolioIntegration.getRealGitHubProjects()
}

export async function getPortfolioStats(): Promise<PortfolioStats> {
  return realPortfolioIntegration.getRealPortfolioStats()
}

export async function getProjectBySlug(slug: string): Promise<EnhancedProject | null> {
  const projects = await getEnhancedProjects()
  return projects.find(p => p.slug === slug) || null
}

export async function getFeaturedProjects(): Promise<EnhancedProject[]> {
  const projects = await getEnhancedProjects()
  return projects.filter(p => p.featured)
}