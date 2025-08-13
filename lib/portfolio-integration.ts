// lib/portfolio-integration.ts
import { projectMetadata } from './project-data'
import { 
  githubAPI, 
  getCachedRepositories, 
  type GitHubRepository 
} from './github-api'
import { 
  vercelAPI, 
  getCachedProjectsWithStatus, 
  type VercelProject, 
  type DeploymentStatus 
} from './vercel-api'

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
    repository: GitHubRepository
    url: string
    stars: number
    forks: number
    language: string | null
    languages: Record<string, number>
    topics: string[]
    lastUpdated: string
    readme?: string
    latestCommit?: {
      sha: string
      message: string
      author: string
      date: string
    }
  }
  
  // Vercel data
  vercel?: {
    project: VercelProject
    deploymentStatus: DeploymentStatus | null
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
    caseStudy?: any
  }
  
  // Computed properties
  techStack: string[]
  lastActivity: string
  deploymentScore: number // 0-100 based on activity, stars, deployment status
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

class PortfolioIntegration {
  private repositoryMap = new Map<string, GitHubRepository>()
  private vercelProjectMap = new Map<string, VercelProject>()
  private enhancedProjects = new Map<string, EnhancedProject>()

  async initialize() {
    try {
      await this.loadGitHubData()
      await this.loadVercelData()
      await this.buildEnhancedProjects()
    } catch (error) {
      console.error('Error initializing portfolio integration:', error)
    }
  }

  private async loadGitHubData() {
    try {
      const repositories = await getCachedRepositories()
      this.repositoryMap.clear()
      
      repositories.forEach(repo => {
        this.repositoryMap.set(repo.name, repo)
      })
      
      console.log(`Loaded ${repositories.length} GitHub repositories`)
    } catch (error) {
      console.error('Error loading GitHub data:', error)
    }
  }

  private async loadVercelData() {
    try {
      const projectsWithStatus = await getCachedProjectsWithStatus()
      this.vercelProjectMap.clear()
      
      projectsWithStatus.forEach(({ project }) => {
        this.vercelProjectMap.set(project.name, project)
      })
      
      console.log(`Loaded ${projectsWithStatus.length} Vercel projects`)
    } catch (error) {
      console.error('Error loading Vercel data:', error)
    }
  }

  private async buildEnhancedProjects() {
    this.enhancedProjects.clear()

    // Start with projects from metadata
    for (const [slug, metadata] of Object.entries(projectMetadata)) {
      const enhanced = await this.createEnhancedProject(slug, metadata)
      if (enhanced) {
        this.enhancedProjects.set(slug, enhanced)
      }
    }

    // Add GitHub repos that aren't in metadata
    for (const [repoName, repo] of this.repositoryMap.entries()) {
      if (!this.findProjectByGitHubRepo(repoName)) {
        const enhanced = await this.createEnhancedProjectFromGitHub(repo)
        if (enhanced) {
          this.enhancedProjects.set(enhanced.slug, enhanced)
        }
      }
    }

    console.log(`Built ${this.enhancedProjects.size} enhanced projects`)
  }

  private findProjectByGitHubRepo(repoName: string): EnhancedProject | null {
    for (const project of this.enhancedProjects.values()) {
      if (project.github?.repository.name === repoName) {
        return project
      }
    }
    return null
  }

  private async createEnhancedProject(slug: string, metadata: any): Promise<EnhancedProject | null> {
    try {
      // Try to find matching GitHub repo
      const githubRepo = this.findMatchingGitHubRepo(slug, metadata)
      
      // Try to find matching Vercel project
      const vercelProject = this.findMatchingVercelProject(slug, metadata)
      const vercelStatus = vercelProject 
        ? await vercelAPI.getDeploymentStatus(vercelProject.id)
        : null

      const enhanced: EnhancedProject = {
        id: slug,
        slug,
        name: metadata.customDescription?.split(' - ')[0] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: metadata.customDescription || 'No description available',
        longDescription: metadata.caseStudy?.solution,
        category: metadata.category || 'other',
        status: metadata.status || 'completed',
        featured: metadata.featured || false,
        order: metadata.order || 999,

        github: githubRepo ? {
          repository: githubRepo,
          url: githubRepo.html_url,
          stars: githubRepo.stargazers_count,
          forks: githubRepo.forks_count,
          language: githubRepo.language,
          languages: githubRepo.languages || {},
          topics: githubRepo.topics || [],
          lastUpdated: githubRepo.updated_at,
          readme: githubRepo.readme,
          latestCommit: githubRepo.latest_commit,
        } : undefined,

        vercel: vercelProject ? {
          project: vercelProject,
          deploymentStatus: vercelStatus,
          liveUrl: metadata.liveUrl || vercelStatus?.url,
          isLive: vercelStatus?.state === 'READY',
          lastDeployed: vercelStatus ? new Date(vercelStatus.createdAt).toISOString() : undefined,
          buildStatus: this.getBuildStatus(vercelStatus?.state),
        } : undefined,

        metadata: {
          customDescription: metadata.customDescription,
          images: metadata.images || [],
          tags: metadata.tags || [],
          highlights: metadata.highlights || [],
          client: metadata.client,
          teamSize: metadata.teamSize,
          role: metadata.role,
          liveUrl: metadata.liveUrl,
          caseStudy: metadata.caseStudy,
        },

        techStack: this.extractTechStack(githubRepo, metadata),
        lastActivity: this.getLastActivity(githubRepo, vercelStatus),
        deploymentScore: this.calculateDeploymentScore(githubRepo, vercelStatus),
      }

      return enhanced
    } catch (error) {
      console.error(`Error creating enhanced project for ${slug}:`, error)
      return null
    }
  }

  private async createEnhancedProjectFromGitHub(repo: GitHubRepository): Promise<EnhancedProject | null> {
    try {
      // Skip repos that don't look like portfolio projects
      if (!this.isPortfolioWorthy(repo)) {
        return null
      }

      const slug = repo.name
      const vercelProject = this.vercelProjectMap.get(repo.name)
      const vercelStatus = vercelProject 
        ? await vercelAPI.getDeploymentStatus(vercelProject.id)
        : null

      const enhanced: EnhancedProject = {
        id: slug,
        slug,
        name: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || 'No description available',
        category: this.inferCategory(repo),
        status: 'completed',
        featured: false,
        order: 999,

        github: {
          repository: repo,
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          languages: repo.languages || {},
          topics: repo.topics || [],
          lastUpdated: repo.updated_at,
          readme: repo.readme,
          latestCommit: repo.latest_commit,
        },

        vercel: vercelProject ? {
          project: vercelProject,
          deploymentStatus: vercelStatus,
          liveUrl: vercelStatus?.url,
          isLive: vercelStatus?.state === 'READY',
          lastDeployed: vercelStatus ? new Date(vercelStatus.createdAt).toISOString() : undefined,
          buildStatus: this.getBuildStatus(vercelStatus?.state),
        } : undefined,

        metadata: {
          images: [],
          tags: repo.topics || [],
          highlights: [],
        },

        techStack: this.extractTechStack(repo),
        lastActivity: this.getLastActivity(repo, vercelStatus),
        deploymentScore: this.calculateDeploymentScore(repo, vercelStatus),
      }

      return enhanced
    } catch (error) {
      console.error(`Error creating enhanced project from GitHub repo ${repo.name}:`, error)
      return null
    }
  }

  private findMatchingGitHubRepo(slug: string, metadata: any): GitHubRepository | null {
    // Direct match by name
    let repo = this.repositoryMap.get(slug)
    if (repo) return repo

    // Try variations
    const variations = [
      slug.replace(/-/g, ''),
      slug.replace(/-/g, '_'),
      slug.replace(/_/g, '-'),
    ]

    for (const variation of variations) {
      repo = this.repositoryMap.get(variation)
      if (repo) return repo
    }

    // Try by description matching
    if (metadata.customDescription) {
      for (const repo of this.repositoryMap.values()) {
        if (repo.description && repo.description.toLowerCase().includes(metadata.customDescription.toLowerCase().split(' ')[0])) {
          return repo
        }
      }
    }

    return null
  }

  private findMatchingVercelProject(slug: string, metadata: any): VercelProject | null {
    // Direct match by name
    let project = this.vercelProjectMap.get(slug)
    if (project) return project

    // Try variations
    const variations = [
      slug.replace(/-/g, ''),
      slug.replace(/-/g, '_'),
      slug.replace(/_/g, '-'),
    ]

    for (const variation of variations) {
      project = this.vercelProjectMap.get(variation)
      if (project) return project
    }

    return null
  }

  private isPortfolioWorthy(repo: GitHubRepository): boolean {
    // Must have description
    if (!repo.description) return false

    // Skip if no activity in last year
    const lastYear = new Date()
    lastYear.setFullYear(lastYear.getFullYear() - 1)
    if (new Date(repo.updated_at) < lastYear && repo.stargazers_count === 0) return false

    // Skip common non-portfolio patterns
    const skipPatterns = [
      /^dotfiles$/i,
      /^\.github$/i,
      /^config$/i,
      /test/i,
      /playground/i,
      /sandbox/i,
      /learning/i,
      /tutorial/i,
      /practice/i,
      /^readme$/i,
      /^profile$/i,
    ]

    return !skipPatterns.some(pattern => pattern.test(repo.name))
  }

  private inferCategory(repo: GitHubRepository): EnhancedProject['category'] {
    const description = (repo.description || '').toLowerCase()
    const topics = repo.topics || []
    const language = (repo.language || '').toLowerCase()

    if (topics.includes('react') || topics.includes('vue') || topics.includes('angular') || language === 'javascript' || language === 'typescript') {
      return 'frontend'
    }
    if (topics.includes('express') || topics.includes('fastapi') || topics.includes('django') || language === 'python' || language === 'node') {
      return 'backend'
    }
    if (topics.includes('mobile') || topics.includes('ios') || topics.includes('android') || language === 'swift' || language === 'kotlin') {
      return 'mobile'
    }
    if (topics.includes('data') || topics.includes('machine-learning') || topics.includes('ai') || description.includes('data')) {
      return 'data'
    }
    if (topics.includes('fullstack') || description.includes('full-stack') || description.includes('fullstack')) {
      return 'fullstack'
    }

    return 'other'
  }

  private extractTechStack(repo?: GitHubRepository, metadata?: any): string[] {
    const techStack = new Set<string>()

    // From metadata
    if (metadata?.tags) {
      metadata.tags.forEach((tag: string) => techStack.add(tag))
    }

    // From GitHub repo
    if (repo) {
      if (repo.language) {
        techStack.add(repo.language)
      }
      
      if (repo.topics) {
        repo.topics.forEach(topic => {
          // Convert common topics to tech stack items
          const techMap: Record<string, string> = {
            'javascript': 'JavaScript',
            'typescript': 'TypeScript',
            'react': 'React',
            'nextjs': 'Next.js',
            'vue': 'Vue.js',
            'angular': 'Angular',
            'nodejs': 'Node.js',
            'express': 'Express.js',
            'python': 'Python',
            'django': 'Django',
            'flask': 'Flask',
            'fastapi': 'FastAPI',
            'postgresql': 'PostgreSQL',
            'mongodb': 'MongoDB',
            'redis': 'Redis',
            'docker': 'Docker',
            'aws': 'AWS',
            'vercel': 'Vercel',
          }
          
          const mappedTech = techMap[topic.toLowerCase()] || topic
          techStack.add(mappedTech)
        })
      }

      // Infer from languages
      if (repo.languages) {
        Object.keys(repo.languages).forEach(lang => {
          techStack.add(lang)
        })
      }
    }

    return Array.from(techStack)
  }

  private getLastActivity(repo?: GitHubRepository, vercelStatus?: DeploymentStatus | null): string {
    const dates = []
    
    if (repo?.updated_at) {
      dates.push(new Date(repo.updated_at))
    }
    
    if (vercelStatus?.createdAt) {
      dates.push(new Date(vercelStatus.createdAt))
    }

    if (dates.length === 0) {
      return new Date().toISOString()
    }

    return new Date(Math.max(...dates.map(d => d.getTime()))).toISOString()
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

  private calculateDeploymentScore(repo?: GitHubRepository, vercelStatus?: DeploymentStatus | null): number {
    let score = 0

    // GitHub metrics (40 points max)
    if (repo) {
      score += Math.min(repo.stargazers_count * 2, 20) // Stars (max 20)
      score += Math.min(repo.forks_count * 3, 10) // Forks (max 10)
      
      // Recent activity (10 points)
      const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceUpdate < 30) score += 10
      else if (daysSinceUpdate < 90) score += 5
    }

    // Vercel deployment (30 points max)
    if (vercelStatus) {
      if (vercelStatus.state === 'READY') score += 20
      else if (vercelStatus.state === 'BUILDING') score += 10
      
      // Recent deployment (10 points)
      const daysSinceDeployment = (Date.now() - vercelStatus.createdAt) / (1000 * 60 * 60 * 24)
      if (daysSinceDeployment < 7) score += 10
      else if (daysSinceDeployment < 30) score += 5
    }

    // Has description (10 points)
    if (repo?.description || vercelStatus) score += 10

    // Has homepage/live URL (20 points)
    if (repo?.homepage || vercelStatus?.url) score += 20

    return Math.min(score, 100)
  }

  // Public methods
  async getEnhancedProjects(): Promise<EnhancedProject[]> {
    if (this.enhancedProjects.size === 0) {
      await this.initialize()
    }
    
    return Array.from(this.enhancedProjects.values())
      .sort((a, b) => {
        // Featured projects first
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        
        // Then by order
        if (a.order !== b.order) return a.order - b.order
        
        // Then by deployment score
        return b.deploymentScore - a.deploymentScore
      })
  }

  async getFeaturedProjects(): Promise<EnhancedProject[]> {
    const projects = await this.getEnhancedProjects()
    return projects.filter(p => p.featured)
  }

  async getProjectBySlug(slug: string): Promise<EnhancedProject | null> {
    if (this.enhancedProjects.size === 0) {
      await this.initialize()
    }
    
    return this.enhancedProjects.get(slug) || null
  }

  async getPortfolioStats(): Promise<PortfolioStats> {
    const projects = await this.getEnhancedProjects()
    
    const stats: PortfolioStats = {
      totalProjects: projects.length,
      featuredProjects: projects.filter(p => p.featured).length,
      liveProjects: projects.filter(p => p.vercel?.isLive).length,
      totalStars: projects.reduce((sum, p) => sum + (p.github?.stars || 0), 0),
      totalForks: projects.reduce((sum, p) => sum + (p.github?.forks || 0), 0),
      languageStats: {},
      categoryStats: {},
      deploymentStats: {
        successful: 0,
        failed: 0,
        building: 0,
        pending: 0,
      },
      recentActivity: {
        lastCommit: '',
        lastDeployment: '',
        activeProjects: 0,
      },
    }

    // Calculate language stats
    projects.forEach(project => {
      project.techStack.forEach(tech => {
        stats.languageStats[tech] = (stats.languageStats[tech] || 0) + 1
      })
    })

    // Calculate category stats
    projects.forEach(project => {
      stats.categoryStats[project.category] = (stats.categoryStats[project.category] || 0) + 1
    })

    // Calculate deployment stats
    projects.forEach(project => {
      if (project.vercel?.buildStatus) {
        switch (project.vercel.buildStatus) {
          case 'success':
            stats.deploymentStats.successful++
            break
          case 'error':
            stats.deploymentStats.failed++
            break
          case 'building':
            stats.deploymentStats.building++
            break
          case 'pending':
            stats.deploymentStats.pending++
            break
        }
      }
    })

    // Find recent activity
    const lastActivities = projects
      .map(p => new Date(p.lastActivity))
      .sort((a, b) => b.getTime() - a.getTime())

    if (lastActivities.length > 0) {
      stats.recentActivity.lastCommit = lastActivities[0].toISOString()
      stats.recentActivity.lastDeployment = lastActivities[0].toISOString()
      
      // Count projects with activity in last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      stats.recentActivity.activeProjects = projects.filter(p => 
        new Date(p.lastActivity) > thirtyDaysAgo
      ).length
    }

    return stats
  }

  async refreshData() {
    await this.initialize()
  }
}

// Export singleton instance
export const portfolioIntegration = new PortfolioIntegration()

// Utility functions
export async function getEnhancedProjects() {
  return portfolioIntegration.getEnhancedProjects()
}

export async function getFeaturedProjects() {
  return portfolioIntegration.getFeaturedProjects()
}

export async function getProjectBySlug(slug: string) {
  return portfolioIntegration.getProjectBySlug(slug)
}

export async function getPortfolioStats() {
  return portfolioIntegration.getPortfolioStats()
}