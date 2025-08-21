// lib/portfolio-integration.ts - FIXED: Complete portfolio integration logic
import { getCachedRepositories, GitHubRepository, getCachedGitHubStats } from './github-api'
import { getCachedProjectsWithStatus, ProjectWithStatus, matchGitHubRepoWithVercel, getDeploymentUrl } from './vercel-api'

export interface EnhancedProject {
  // Core identification
  id: string
  slug: string
  name: string
  title: string
  description: string
  
  // Classification and metadata
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other'
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  featured: boolean
  order: number
  
  // Technical details
  techStack: string[]
  topics: string[]
  
  // GitHub integration
  github: {
    url: string
    stars: number
    forks: number
    language: string | null
    lastUpdated: string
    hasPages: boolean
    repository: GitHubRepository
  }
  
  // Vercel integration (optional)
  vercel?: {
    isLive: boolean
    liveUrl?: string
    projectName?: string
    deploymentStatus: string
    lastDeployed?: string
  }
  
  // URLs with priority logic
  primaryUrl: string // Either live deployment or GitHub repo
  deploymentUrl?: string // Live deployment if available
  repositoryUrl: string // Always GitHub repo
  
  // Computed metrics
  deploymentScore: number
  activityScore: number
  popularityScore: number
  overallScore: number
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
  topLanguages: Array<{
    name: string
    count: number
    percentage: number
  }>
}

// Enhanced categorization with better logic
function categorizeRepository(repo: GitHubRepository): EnhancedProject['category'] {
  const { language, topics = [], description = '' } = repo
  const content = `${description} ${topics.join(' ')}`.toLowerCase()

  // Mobile development indicators
  if (
    language === 'Swift' ||
    language === 'Kotlin' ||
    language === 'Dart' ||
    topics.some(t => ['mobile', 'ios', 'android', 'react-native', 'flutter'].includes(t.toLowerCase())) ||
    content.includes('mobile') ||
    content.includes('react native') ||
    content.includes('flutter')
  ) {
    return 'mobile'
  }

  // Data science and machine learning
  if (
    language === 'Python' && (
      topics.some(t => ['machine-learning', 'data-science', 'ai', 'ml', 'tensorflow', 'pytorch'].includes(t.toLowerCase())) ||
      content.includes('machine learning') ||
      content.includes('data science') ||
      content.includes('artificial intelligence') ||
      content.includes('neural network')
    )
  ) {
    return 'data'
  }

  // Backend development
  if (
    topics.some(t => ['backend', 'api', 'server', 'microservice', 'rest-api', 'graphql'].includes(t.toLowerCase())) ||
    language === 'Go' ||
    language === 'Rust' ||
    (language === 'Python' && 
     (topics.some(t => ['django', 'flask', 'fastapi'].includes(t.toLowerCase())) ||
      content.includes('api') ||
      content.includes('backend'))) ||
    content.includes('rest api') ||
    content.includes('graphql api')
  ) {
    return 'backend'
  }

  // Frontend development
  if (
    language === 'HTML' ||
    language === 'CSS' ||
    topics.some(t => ['frontend', 'ui', 'css', 'html', 'sass', 'scss'].includes(t.toLowerCase())) ||
    content.includes('frontend') ||
    content.includes('user interface') ||
    content.includes('ui component')
  ) {
    return 'frontend'
  }

  // Full-stack development (most common for portfolio projects)
  if (
    topics.some(t => ['fullstack', 'full-stack', 'web-app', 'webapp', 'nextjs', 'react', 'vue', 'angular'].includes(t.toLowerCase())) ||
    (language === 'TypeScript' || language === 'JavaScript') ||
    content.includes('full stack') ||
    content.includes('web application') ||
    content.includes('full-stack')
  ) {
    return 'fullstack'
  }

  // Default to fullstack for web technologies
  if (language === 'JavaScript' || language === 'TypeScript') {
    return 'fullstack'
  }

  return 'other'
}

// Determine if project should be featured
function shouldBeFeatured(repo: GitHubRepository, vercelProject?: ProjectWithStatus): boolean {
  let score = 0

  // Stars and engagement
  score += repo.stargazers_count * 3
  score += repo.forks_count * 2

  // Quality indicators
  if (repo.description && repo.description.length > 20) score += 10
  if (repo.homepage) score += 15
  if (repo.topics && repo.topics.length > 2) score += 8
  if (repo.has_pages) score += 12

  // Live deployment bonus
  if (vercelProject?.isLive) score += 20

  // Recent activity
  const lastUpdate = new Date(repo.updated_at)
  const daysOld = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
  if (daysOld < 30) score += 15
  else if (daysOld < 90) score += 8

  // Featured keywords in name or description
  const featuredKeywords = ['portfolio', 'project', 'app', 'platform', 'tool', 'dashboard']
  const hasKeyword = featuredKeywords.some(keyword => 
    repo.name.toLowerCase().includes(keyword) ||
    repo.description?.toLowerCase().includes(keyword)
  )
  if (hasKeyword) score += 10

  return score >= 40 // Threshold for featuring
}

// Extract technology stack from repository
function extractTechStack(repo: GitHubRepository): string[] {
  const techStack = new Set<string>()
  
  // Add primary language
  if (repo.language) {
    techStack.add(repo.language)
  }
  
  // Technology mapping from topics
  const techMap: Record<string, string> = {
    'nextjs': 'Next.js',
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'svelte': 'Svelte',
    'nodejs': 'Node.js',
    'express': 'Express',
    'fastapi': 'FastAPI',
    'django': 'Django',
    'flask': 'Flask',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'redis': 'Redis',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'aws': 'AWS',
    'vercel': 'Vercel',
    'netlify': 'Netlify',
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'python': 'Python',
    'tailwindcss': 'Tailwind CSS',
    'css': 'CSS',
    'html': 'HTML',
    'sass': 'Sass',
    'graphql': 'GraphQL',
    'rest-api': 'REST API',
    'prisma': 'Prisma',
    'drizzle': 'Drizzle ORM'
  }
  
  // Add technologies from topics
  repo.topics?.forEach(topic => {
    const tech = techMap[topic.toLowerCase()]
    if (tech) {
      techStack.add(tech)
    }
  })
  
  // Limit to 6 most relevant technologies
  return Array.from(techStack).slice(0, 6)
}

// Calculate various scores for ranking
function calculateScores(repo: GitHubRepository, vercelProject?: ProjectWithStatus) {
  // Deployment score
  let deploymentScore = 50
  if (repo.description) deploymentScore += 10
  if (repo.stargazers_count > 0) deploymentScore += Math.min(repo.stargazers_count * 2, 30)
  if (repo.topics && repo.topics.length > 0) deploymentScore += 5
  if (vercelProject?.isLive) deploymentScore += 20
  if (repo.homepage) deploymentScore += 10
  deploymentScore = Math.min(deploymentScore, 100)

  // Activity score
  const lastUpdate = new Date(repo.updated_at)
  const daysOld = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
  let activityScore = Math.max(0, 100 - (daysOld / 30) * 20)

  // Popularity score
  const popularityScore = Math.min(
    (repo.stargazers_count * 3) + (repo.forks_count * 2) + (repo.watchers_count || 0),
    100
  )

  // Overall score (weighted average)
  const overallScore = (deploymentScore * 0.4) + (activityScore * 0.3) + (popularityScore * 0.3)

  return {
    deploymentScore: Math.round(deploymentScore),
    activityScore: Math.round(activityScore),
    popularityScore: Math.round(popularityScore),
    overallScore: Math.round(overallScore)
  }
}

// Main function to get enhanced projects
export async function getEnhancedProjects(): Promise<EnhancedProject[]> {
  try {
    console.log('🔄 Creating enhanced portfolio projects...')
    
    // Fetch data from both sources
    const [repositories, vercelProjects] = await Promise.allSettled([
      getCachedRepositories(),
      getCachedProjectsWithStatus()
    ])
    
    const repos = repositories.status === 'fulfilled' ? repositories.value : []
    const vercelData = vercelProjects.status === 'fulfilled' ? vercelProjects.value : []
    
    console.log(`📊 Processing ${repos.length} repositories with ${vercelData.length} Vercel projects`)
    
    if (repos.length === 0) {
      console.warn('⚠️ No repositories found')
      return []
    }
    
    // Transform repositories to enhanced projects
    const enhancedProjects: EnhancedProject[] = repos.map((repo, index) => {
      // Find matching Vercel project
      const vercelMatch = matchGitHubRepoWithVercel(repo.name, vercelData)
      
      // Determine URLs with priority logic
      const deploymentUrl = getDeploymentUrl(vercelMatch, repo.homepage)
      const primaryUrl = deploymentUrl || repo.html_url
      const repositoryUrl = repo.html_url
      
      // Calculate all scores
      const scores = calculateScores(repo, vercelMatch)
      
      // Determine category and features
      const category = categorizeRepository(repo)
      const featured = shouldBeFeatured(repo, vercelMatch)
      const techStack = extractTechStack(repo)
      
      const project: EnhancedProject = {
        // Core identification
        id: repo.id.toString(),
        slug: repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: repo.name,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || 'No description available',
        
        // Classification
        category,
        status: 'completed' as const,
        featured,
        order: featured ? index : index + 100,
        
        // Technical details
        techStack,
        topics: repo.topics || [],
        
        // GitHub integration
        github: {
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          lastUpdated: repo.updated_at,
          hasPages: repo.has_pages,
          repository: repo
        },
        
        // Vercel integration (if available)
        vercel: vercelMatch ? {
          isLive: vercelMatch.isLive,
          liveUrl: vercelMatch.liveUrl,
          projectName: vercelMatch.project.name,
          deploymentStatus: vercelMatch.status?.state || 'unknown',
          lastDeployed: vercelMatch.status ? new Date(vercelMatch.status.created).toISOString() : undefined
        } : undefined,
        
        // URLs with clear priority
        primaryUrl,
        deploymentUrl,
        repositoryUrl,
        
        // Computed metrics
        ...scores,
        lastActivity: repo.updated_at
      }
      
      return project
    })
    
    // Sort projects: featured first, then by overall score
    enhancedProjects.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.overallScore - a.overallScore
    })
    
    const liveCount = enhancedProjects.filter(p => p.vercel?.isLive).length
    const featuredCount = enhancedProjects.filter(p => p.featured).length
    
    console.log(`✅ Created ${enhancedProjects.length} enhanced projects (${featuredCount} featured, ${liveCount} live)`)
    
    return enhancedProjects
    
  } catch (error) {
    console.error('❌ Error creating enhanced projects:', error)
    return []
  }
}

// Calculate portfolio statistics
export async function getPortfolioStats(): Promise<PortfolioStats> {
  try {
    console.log('📊 Calculating portfolio statistics...')
    
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
      if (project.vercel?.isLive) {
        acc.successful++
      } else if (project.vercel?.deploymentStatus === 'ERROR') {
        acc.failed++
      } else if (project.vercel?.deploymentStatus === 'BUILDING') {
        acc.building++
      } else {
        acc.pending++
      }
      return acc
    }, { successful: 0, failed: 0, building: 0, pending: 0 })
    
    // Language statistics with percentages
    const languageStats = stats?.languageStats || {}
    const totalLanguageCount = Object.values(languageStats).reduce((sum, count) => sum + count, 0)
    const topLanguages = Object.entries(languageStats)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalLanguageCount > 0 ? Math.round((count / totalLanguageCount) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
    
    // Recent activity
    const lastCommit = projectList.reduce((latest, project) => {
      const projectDate = new Date(project.github.lastUpdated)
      return projectDate > new Date(latest) ? project.github.lastUpdated : latest
    }, new Date(0).toISOString())
    
    const lastDeployment = projectList.reduce((latest, project) => {
      if (!project.vercel?.lastDeployed) return latest
      const deployDate = new Date(project.vercel.lastDeployed)
      return deployDate > new Date(latest) ? project.vercel.lastDeployed : latest
    }, new Date(0).toISOString())
    
    const portfolioStats: PortfolioStats = {
      totalProjects: projectList.length,
      featuredProjects: projectList.filter(p => p.featured).length,
      liveProjects: projectList.filter(p => p.vercel?.isLive).length,
      totalStars: stats?.totalStars || projectList.reduce((sum, p) => sum + p.github.stars, 0),
      totalForks: stats?.totalForks || projectList.reduce((sum, p) => sum + p.github.forks, 0),
      languageStats,
      categoryStats,
      deploymentStats,
      recentActivity: {
        lastCommit,
        lastDeployment,
        activeProjects: projectList.filter(p => 
          new Date(p.github.lastUpdated) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length
      },
      topLanguages
    }
    
    console.log('✅ Portfolio statistics calculated successfully')
    return portfolioStats
    
  } catch (error) {
    console.error('❌ Error calculating portfolio stats:', error)
    
    // Return fallback stats
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
        activeProjects: 0
      },
      topLanguages: []
    }
  }
}

// Export main data fetching function
export async function getPortfolioData() {
  console.log('🚀 Getting complete portfolio data...')
  
  const [projectsResult, statsResult] = await Promise.allSettled([
    getEnhancedProjects(),
    getPortfolioStats()
  ])
  
  const projects = projectsResult.status === 'fulfilled' ? projectsResult.value : []
  const stats = statsResult.status === 'fulfilled' ? statsResult.value : {
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
      activeProjects: 0
    },
    topLanguages: []
  }
  
  console.log(`✅ Portfolio data ready: ${projects.length} projects`)
  
  return {
    projects,
    stats,
    lastUpdated: new Date().toISOString(),
    source: 'integrated'
  }
}