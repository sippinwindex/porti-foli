// lib/portfolio-integration.ts - Clean version with proper type handling
import { getCachedRepositories, getCachedGitHubStats } from './github-api'
import { getCachedProjectsWithStatus } from './vercel-api'

// Use any for GitHub repo to avoid type conflicts
type GitHubRepo = any
type VercelProject = any

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
    repository?: GitHubRepo
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
    caseStudyUrl?: string
    startDate?: string
    endDate?: string
  }
  
  // Computed metrics
  deploymentScore: number
  activityScore: number
  popularityScore: number
  overallScore: number
  techStack: string[]
  lastActivity: string
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

// Helper function to categorize repositories
function categorizeRepo(repo: GitHubRepo): EnhancedProject['category'] {
  const name = (repo.name || '').toLowerCase()
  const description = (repo.description || '').toLowerCase()
  const topics = repo.topics || []
  
  // Check topics first for more accurate categorization
  if (topics.some((topic: string) => ['react', 'vue', 'angular', 'frontend', 'ui', 'website'].includes(topic))) {
    return 'frontend'
  }
  if (topics.some((topic: string) => ['api', 'backend', 'server', 'node', 'express', 'django'].includes(topic))) {
    return 'backend'
  }
  if (topics.some((topic: string) => ['fullstack', 'full-stack', 'webapp', 'web-app'].includes(topic))) {
    return 'fullstack'
  }
  if (topics.some((topic: string) => ['mobile', 'react-native', 'flutter', 'ios', 'android'].includes(topic))) {
    return 'mobile'
  }
  if (topics.some((topic: string) => ['data', 'ml', 'ai', 'analytics', 'visualization'].includes(topic))) {
    return 'data'
  }
  
  // Fallback to name/description analysis
  if (name.includes('portfolio') || name.includes('website') || 
      description.includes('website') || description.includes('frontend')) {
    return 'frontend'
  }
  if (name.includes('api') || description.includes('backend') || description.includes('server')) {
    return 'backend'
  }
  if (name.includes('app') && (name.includes('web') || description.includes('fullstack'))) {
    return 'fullstack'
  }
  if (name.includes('mobile') || description.includes('mobile') || description.includes('react native')) {
    return 'mobile'
  }
  if (name.includes('data') || description.includes('analysis') || description.includes('visualization')) {
    return 'data'
  }
  
  return 'other'
}

// Helper function to determine if a project should be featured
function shouldBeFeatured(repo: GitHubRepo): boolean {
  const stars = repo.stargazers_count || 0
  const forks = repo.forks_count || 0
  const hasDescription = Boolean(repo.description && repo.description.length > 10)
  const hasTopics = Boolean(repo.topics && repo.topics.length > 0)
  const hasHomepage = Boolean(repo.homepage)
  const recentlyUpdated = new Date(repo.updated_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days
  
  // Score based on various factors
  let score = 0
  if (stars > 0) score += Math.min(stars * 2, 10) // Max 10 points for stars
  if (forks > 0) score += Math.min(forks * 3, 10) // Max 10 points for forks  
  if (hasDescription) score += 5
  if (hasTopics) score += 3
  if (hasHomepage) score += 5
  if (recentlyUpdated) score += 3
  
  return score >= 8 // Threshold for featuring
}

function extractTechStack(language: string, topics: string[]): string[] {
  const techStack = new Set<string>()
  
  // Add main language
  if (language) {
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
    const displayName = langMap[language] || language
    techStack.add(displayName)
  }
  
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

export async function getEnhancedProjects(): Promise<EnhancedProject[]> {
  try {
    console.log('🔄 Fetching enhanced projects...')
    
    // Get data from both sources
    const [repositories, vercelProjects] = await Promise.allSettled([
      getCachedRepositories(),
      getCachedProjectsWithStatus()
    ])
    
    const repos = repositories.status === 'fulfilled' ? repositories.value : []
    const vercelData = vercelProjects.status === 'fulfilled' ? vercelProjects.value : []
    
    console.log(`📊 Found ${repos.length} repositories and ${vercelData.length} Vercel projects`)
    
    if (repos.length === 0) {
      console.warn('⚠️ No repositories found, returning empty array')
      return []
    }
    
    // Transform GitHub repos to EnhancedProject format
    const enhancedProjects: EnhancedProject[] = repos
      .filter((repo: GitHubRepo) => {
        // Filter out non-portfolio repos
        const skipPatterns = [/^\./, /readme/i, /profile/i, /config/i]
        return !skipPatterns.some(pattern => pattern.test(repo.name))
      })
      .map((repo: GitHubRepo, index: number) => {
        // Find matching Vercel project
        const vercelMatch = vercelData.find((v: VercelProject) => 
          v?.project?.name?.toLowerCase().includes(repo.name.toLowerCase()) ||
          repo.name.toLowerCase().includes(v?.project?.name?.toLowerCase())
        )
        
        const category = categorizeRepo(repo)
        const featured = shouldBeFeatured(repo)
        
        // Calculate scores
        const deploymentScore = vercelMatch ? 
          ((vercelMatch as any).isLive ? 10 : 5) : 0
        const activityScore = Math.min(
          Math.floor((Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24 * -1)) + 10, 
          10
        )
        const popularityScore = Math.min((repo.stargazers_count || 0) + (repo.forks_count || 0) * 2, 10)
        const overallScore = (deploymentScore + activityScore + popularityScore) / 3
        
        const project: EnhancedProject = {
          id: repo.id?.toString() || `repo-${index}`,
          slug: repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: repo.name,
          description: repo.description || 'No description available',
          longDescription: repo.readme || repo.description || undefined,
          category,
          status: 'completed' as const,
          featured,
          order: featured ? index : index + 100,
          
          github: {
            url: repo.html_url,
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            language: repo.language,
            languages: repo.languages || {},
            topics: repo.topics || [],
            lastUpdated: repo.updated_at,
            readme: repo.readme,
            repository: repo
          },
          
          vercel: vercelMatch ? {
            deploymentStatus: vercelMatch,
            liveUrl: (vercelMatch as any).lastDeployment?.url,
            isLive: (vercelMatch as any).isLive || false,
            lastDeployed: (vercelMatch as any).lastDeployment?.createdAt,
            buildStatus: (vercelMatch as any).lastDeployment?.state === 'READY' ? 'success' : 
                       (vercelMatch as any).lastDeployment?.state === 'ERROR' ? 'error' : 'unknown'
          } : undefined,
          
          metadata: {
            customDescription: repo.description || undefined,
            images: repo.homepage ? [repo.homepage] : [],
            tags: repo.topics || [],
            highlights: repo.description ? [repo.description] : [],
            liveUrl: repo.homepage || (vercelMatch as any)?.lastDeployment?.url,
            demoUrl: repo.homepage || undefined
          },
          
          deploymentScore,
          activityScore,
          popularityScore,
          overallScore,
          techStack: extractTechStack(repo.language || '', repo.topics || []),
          lastActivity: repo.updated_at
        }
        
        return project
      })
      .sort((a, b) => {
        // Sort by featured first, then by overall score
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.overallScore - a.overallScore
      })
    
    console.log(`✅ Successfully processed ${enhancedProjects.length} enhanced projects`)
    return enhancedProjects
    
  } catch (error) {
    console.error('❌ Error in getEnhancedProjects:', error)
    return []
  }
}

export async function getPortfolioStats(): Promise<PortfolioStats> {
  try {
    console.log('📊 Calculating portfolio stats...')
    
    const [projects, githubStats] = await Promise.allSettled([
      getEnhancedProjects(),
      getCachedGitHubStats()
    ])
    
    const projectList = projects.status === 'fulfilled' ? projects.value : []
    const stats = githubStats.status === 'fulfilled' ? githubStats.value : null
    
    // Calculate category distribution
    const categoryStats = projectList.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Calculate deployment stats
    const deploymentStats = projectList.reduce((acc, project) => {
      if (project.vercel?.isLive) acc.successful++
      else if (project.vercel?.buildStatus === 'error') acc.failed++
      else if (project.vercel?.buildStatus === 'building') acc.building++
      else acc.pending++
      return acc
    }, { successful: 0, failed: 0, building: 0, pending: 0 })
    
    // Find most recent activity
    const lastCommit = projectList.reduce((latest, project) => {
      const projectDate = new Date(project.github?.lastUpdated || 0)
      return projectDate > new Date(latest) ? project.github?.lastUpdated || latest : latest
    }, new Date(0).toISOString())
    
    const lastDeployment = projectList.reduce((latest, project) => {
      const deployDate = new Date(project.vercel?.lastDeployed || 0)
      return deployDate > new Date(latest) ? project.vercel?.lastDeployed || latest : latest
    }, new Date(0).toISOString())
    
    const portfolioStats: PortfolioStats = {
      totalProjects: projectList.length,
      featuredProjects: projectList.filter(p => p.featured).length,
      liveProjects: projectList.filter(p => p.vercel?.isLive).length,
      totalStars: stats?.totalStars || 0,
      totalForks: stats?.totalForks || 0,
      languageStats: (stats as any)?.languages || {},
      categoryStats,
      deploymentStats,
      recentActivity: {
        lastCommit,
        lastDeployment,
        activeProjects: projectList.filter(p => 
          new Date(p.github?.lastUpdated || 0) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length
      }
    }
    
    console.log('✅ Portfolio stats calculated successfully')
    return portfolioStats
    
  } catch (error) {
    console.error('❌ Error calculating portfolio stats:', error)
    
    // Return basic fallback stats
    return {
      totalProjects: 0,
      featuredProjects: 0,
      liveProjects: 0,
      totalStars: 0,
      totalForks: 0,
      languageStats: {},
      categoryStats: {},
      deploymentStats: { successful: 0, failed: 0, building: 0, pending: 0 },
      recentActivity: {
        lastCommit: new Date().toISOString(),
        lastDeployment: new Date().toISOString(),
        activeProjects: 0,
      },
    }
  }
}

// Export functions for use in API routes and components
export async function getPortfolioData() {
  console.log('🚀 Getting complete portfolio data...')
  
  let projects: EnhancedProject[] = []
  let stats: PortfolioStats
  
  try {
    // Get projects and stats
    const [projectsResult, statsResult] = await Promise.allSettled([
      getEnhancedProjects(),
      getPortfolioStats()
    ])
    
    projects = projectsResult.status === 'fulfilled' ? projectsResult.value : []
    stats = statsResult.status === 'fulfilled' ? statsResult.value : {
      totalProjects: 0,
      featuredProjects: 0,
      liveProjects: 0,
      totalStars: 0,
      totalForks: 0,
      languageStats: {},
      categoryStats: {},
      deploymentStats: { successful: 0, failed: 0, building: 0, pending: 0 },
      recentActivity: {
        lastCommit: new Date().toISOString(),
        lastDeployment: new Date().toISOString(),
        activeProjects: 0,
      },
    }
    
    console.log(`✅ Portfolio data loaded: ${projects.length} projects`)
    
  } catch (error) {
    console.error('❌ Error getting portfolio data:', error)
    
    // Use basic fallback
    projects = []
    stats = {
      totalProjects: 0,
      featuredProjects: 0,
      liveProjects: 0,
      totalStars: 0,
      totalForks: 0,
      languageStats: {},
      categoryStats: {},
      deploymentStats: { successful: 0, failed: 0, building: 0, pending: 0 },
      recentActivity: {
        lastCommit: new Date().toISOString(),
        lastDeployment: new Date().toISOString(),
        activeProjects: 0,
      },
    }
  }
  
  return {
    projects,
    stats,
    lastUpdated: new Date().toISOString(),
  }
}