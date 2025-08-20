// pages/api/projects.ts - FIXED VERSION with correct imports
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedRepositories } from '@/lib/github-api'
import { getCachedProjectsWithStatus } from '@/lib/vercel-api'

// FIXED: Import GitHubRepository type correctly from types file
import type { GitHubRepository } from '@/types/github'
import type { PortfolioProject } from '@/types/portfolio'

// FIXED: Enhanced project transformation with unified types
function transformGitHubRepoToProject(repo: GitHubRepository, vercelData?: any): PortfolioProject {
  
  // FIXED: Intelligent category determination with validation
  const determineCategory = (): 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other' => {
    try {
      const { language, topics = [], description = '' } = repo
      const content = `${description} ${topics.join(' ')}`.toLowerCase()

      if (topics.includes('mobile') || content.includes('mobile') || content.includes('react-native')) return 'mobile'
      if (topics.includes('data') || topics.includes('machine-learning') || topics.includes('ai') || language === 'Python') return 'data'
      if (topics.includes('backend') || content.includes('api') || content.includes('server')) return 'backend'
      if (content.includes('frontend') || language === 'HTML' || language === 'CSS') return 'frontend'
      if (content.includes('fullstack') || language === 'TypeScript' || topics.includes('nextjs')) return 'fullstack'
      return 'other'
    } catch (error) {
      console.warn('Error determining category:', error)
      return 'other'
    }
  }

  // FIXED: Smart tech stack extraction with error handling
  const extractTechStack = (): string[] => {
    try {
      const techStack = new Set<string>()
      
      if (repo.language) techStack.add(repo.language)
      
      const techTopics = (repo.topics || []).filter((topic: string) => 
        ['react', 'nextjs', 'vue', 'angular', 'node', 'express', 'django', 
         'flask', 'mongodb', 'postgresql', 'docker', 'aws', 'typescript',
         'tailwind', 'framer-motion', 'threejs', 'webgl'].includes(topic.toLowerCase())
      )

      techTopics.forEach((topic: string) => {
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
          'postgresql': 'PostgreSQL',
          'typescript': 'TypeScript',
          'tailwind': 'Tailwind CSS',
          'framer-motion': 'Framer Motion',
          'threejs': 'Three.js',
          'webgl': 'WebGL'
        }
        techStack.add(topicMap[topic.toLowerCase()] || topic)
      })

      return Array.from(techStack).slice(0, 6)
    } catch (error) {
      console.warn('Error extracting tech stack:', error)
      return repo.language ? [repo.language] : []
    }
  }

  // FIXED: Enhanced live deployment detection with validation
  const detectLiveDeployment = () => {
    try {
      // Priority 1: Vercel deployment is live
      if (vercelData?.status?.state === 'READY' && vercelData.liveUrl) {
        return {
          isLive: true,
          liveUrl: vercelData.liveUrl,
          deploymentStatus: 'READY',
          source: 'vercel'
        }
      }

      // Priority 2: GitHub Pages (check if has_pages is true)
      if (repo.has_pages && repo.homepage && isValidDeploymentUrl(repo.homepage)) {
        return {
          isLive: true,
          liveUrl: repo.homepage,
          deploymentStatus: 'READY',
          source: 'github-pages'
        }
      }

      // Priority 3: Any homepage URL that looks like a live deployment
      if (repo.homepage && isValidDeploymentUrl(repo.homepage)) {
        return {
          isLive: true,
          liveUrl: repo.homepage,
          deploymentStatus: 'READY',
          source: 'custom'
        }
      }

      // Priority 4: Vercel deployment exists but may not be ready
      if (vercelData?.status) {
        return {
          isLive: false,
          liveUrl: vercelData.liveUrl,
          deploymentStatus: vercelData.status.state,
          source: 'vercel'
        }
      }

      return {
        isLive: false,
        liveUrl: undefined,
        deploymentStatus: 'not-deployed',
        source: 'none'
      }
    } catch (error) {
      console.warn('Error detecting live deployment:', error)
      return {
        isLive: false,
        liveUrl: undefined,
        deploymentStatus: 'error',
        source: 'error'
      }
    }
  }

  // FIXED: Safe deployment score calculation
  const calculateDeploymentScore = () => {
    try {
      let score = 60

      if (repo.description) score += 10
      if (repo.stargazers_count > 0) score += Math.min(repo.stargazers_count * 2, 20)
      if (repo.topics && repo.topics.length > 0) score += 5
      
      const liveInfo = detectLiveDeployment()
      if (liveInfo.isLive) score += 20 // Big bonus for live deployments
      else if (liveInfo.source === 'vercel') score += 10 // Some bonus for Vercel setup

      const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceUpdate < 30) score += 10
      else if (daysSinceUpdate < 90) score += 5

      return Math.min(score, 100)
    } catch (error) {
      console.warn('Error calculating deployment score:', error)
      return 60
    }
  }

  // FIXED: Safe featured determination
  const isFeatured = () => {
    try {
      const liveInfo = detectLiveDeployment()
      return repo.stargazers_count > 3 || 
             (repo.topics || []).includes('featured') ||
             liveInfo.isLive ||
             calculateDeploymentScore() > 85 ||
             (repo.topics || []).includes('portfolio')
    } catch (error) {
      console.warn('Error determining featured status:', error)
      return false
    }
  }

  try {
    const liveInfo = detectLiveDeployment()

    return {
      id: repo.id.toString(),
      name: repo.name,
      title: formatProjectName(repo.name),
      description: repo.description || 'A project built with modern web technologies',
      longDescription: repo.description ? 
        `${repo.description}. This project demonstrates modern development practices and showcases technical expertise in ${repo.language || 'web development'}.` : 
        undefined,
      techStack: extractTechStack(),
      tags: repo.topics || [],
      featured: isFeatured(),
      category: determineCategory(),
      status: 'completed' as const,
      image: generateProjectImage(repo.name, repo.language),
      github: {
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        url: repo.html_url,
        topics: repo.topics || [],
        lastUpdated: repo.updated_at,
        language: repo.language || undefined
      },
      vercel: liveInfo.source === 'vercel' ? {
        isLive: liveInfo.isLive,
        liveUrl: liveInfo.liveUrl,
        deploymentStatus: liveInfo.deploymentStatus
      } : undefined,
      githubUrl: repo.html_url,
      liveUrl: liveInfo.liveUrl,
      topics: repo.topics || [],
      complexity: repo.stargazers_count > 10 ? 'advanced' : repo.stargazers_count > 2 ? 'intermediate' : 'beginner',
      teamSize: 1,
      role: 'Full-Stack Developer',
      highlights: generateHighlights(repo, liveInfo)
    }
  } catch (error) {
    console.error('Error transforming GitHub repo to project:', error)
    // Return minimal valid project
    return {
      id: repo.id.toString(),
      name: repo.name,
      title: repo.name,
      description: repo.description || 'A development project',
      techStack: repo.language ? [repo.language] : [],
      featured: false,
      category: 'other' as const,
      status: 'completed' as const,
      github: {
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        url: repo.html_url,
        topics: repo.topics || [],
        lastUpdated: repo.updated_at,
        language: repo.language || undefined
      },
      githubUrl: repo.html_url,
      highlights: []
    }
  }
}

// Helper functions
function isValidDeploymentUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.toLowerCase()
    
    const deploymentPlatforms = [
      'vercel.app', 'netlify.app', 'herokuapp.com', 'github.io',
      'surge.sh', 'firebase.app', 'web.app', 'cloudfront.net',
      'azurewebsites.net', 'railway.app'
    ]
    
    return deploymentPlatforms.some(platform => 
      hostname.includes(platform) || hostname.endsWith(platform)
    ) || (!hostname.includes('github.com') && !hostname.includes('localhost'))
  } catch {
    return false
  }
}

function formatProjectName(name: string): string {
  try {
    return name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\bJs\b/g, 'JS')
      .replace(/\bTs\b/g, 'TS')
      .replace(/\bApi\b/g, 'API')
      .replace(/\bUi\b/g, 'UI')
      .replace(/\bDb\b/g, 'DB')
      .replace(/\b3[Dd]\b/g, '3D')
  } catch {
    return name
  }
}

function generateProjectImage(name: string, language: string | null): string {
  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
    return `/images/projects/${slug}.jpg`
  } catch {
    return '/images/projects/default.jpg'
  }
}

function generateHighlights(repo: GitHubRepository, liveInfo: any): string[] {
  try {
    const highlights: string[] = []
    
    if (repo.stargazers_count > 0) highlights.push(`${repo.stargazers_count} GitHub stars`)
    if (repo.language) highlights.push(`Written in ${repo.language}`)
    if (liveInfo.isLive) highlights.push(`Live deployment on ${liveInfo.source}`)
    if (repo.topics && repo.topics.length > 0) {
      highlights.push(`Technologies: ${repo.topics.slice(0, 3).join(', ')}`)
    }
    
    return highlights.filter(Boolean)
  } catch {
    return []
  }
}

// Enhanced mock projects for reliable fallback
const enhancedMockProjects: PortfolioProject[] = [
  {
    id: 'portfolio-website',
    name: 'portfolio-website',
    title: '3D Interactive Portfolio',
    description: 'Modern 3D portfolio with live GitHub integration, interactive animations, and cutting-edge web technologies',
    longDescription: 'A sophisticated portfolio showcasing advanced React/Next.js development with real-time GitHub API integration, 3D animations using Framer Motion, and professional UI/UX design.',
    techStack: ['Next.js 14', 'Three.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'GitHub API'],
    tags: ['portfolio', 'nextjs', 'typescript', '3d', 'github-api'],
    featured: true,
    category: 'fullstack',
    status: 'completed',
    image: '/images/projects/portfolio-website.jpg',
    github: {
      stars: 25,
      forks: 8,
      url: 'https://github.com/sippinwindex/portfolio',
      topics: ['nextjs', 'portfolio', 'typescript', '3d', 'github-api'],
      lastUpdated: new Date().toISOString(),
      language: 'TypeScript'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juan-fernandez.dev',
      deploymentStatus: 'READY'
    },
    githubUrl: 'https://github.com/sippinwindex/portfolio',
    liveUrl: 'https://juan-fernandez.dev',
    topics: ['portfolio', 'nextjs', 'typescript', '3d'],
    complexity: 'advanced',
    teamSize: 1,
    role: 'Lead Full-Stack Developer',
    highlights: [
      '25 GitHub stars',
      'Live deployment on vercel',
      'Real-time GitHub API integration',
      'Advanced 3D animations with Three.js'
    ]
  },
  {
    id: 'synthwave-runner-game', 
    name: 'synthwave-runner',
    title: 'Synthwave Runner Game',
    description: 'High-performance endless runner game with retro synthwave aesthetics and smooth HTML5 Canvas animations',
    techStack: ['React', 'TypeScript', 'HTML5 Canvas', 'Framer Motion'],
    tags: ['game', 'canvas', 'typescript', 'synthwave'],
    featured: true,
    category: 'frontend',
    status: 'completed',
    github: {
      stars: 15,
      forks: 4,
      url: 'https://github.com/sippinwindex/synthwave-runner',
      topics: ['game', 'canvas', 'typescript'],
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      language: 'TypeScript'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juan-fernandez.dev/dino-game',
      deploymentStatus: 'READY'
    },
    githubUrl: 'https://github.com/sippinwindex/synthwave-runner',
    liveUrl: 'https://juan-fernandez.dev/dino-game',
    highlights: ['15 GitHub stars', 'Live deployment', '60 FPS performance']
  }
]

// FIXED: Main API handler with comprehensive error handling
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { 
    limit = '20',
    sort = 'featured',
    featured = 'false',
    source = 'auto'
  } = req.query

  console.log('🔄 Enhanced Projects API called with live deployment detection')
  
  try {
    let projects: PortfolioProject[] = []
    let dataSource = 'mock'
    let integrationErrors: string[] = []

    // Try GitHub first with proper error isolation
    if (source === 'github' || source === 'auto') {
      try {
        console.log('🔄 Attempting to fetch real GitHub data with Vercel integration...')
        
        const [githubRepos, vercelProjects] = await Promise.allSettled([
          getCachedRepositories(),
          getCachedProjectsWithStatus()
        ])

        let repos: GitHubRepository[] = []
        let vercelData: any[] = []

        // Handle GitHub results
        if (githubRepos.status === 'fulfilled' && githubRepos.value.length > 0) {
          repos = githubRepos.value
          console.log(`✅ Found ${repos.length} GitHub repositories`)
        } else {
          integrationErrors.push(`GitHub: ${githubRepos.status === 'rejected' ? githubRepos.reason : 'No repositories'}`)
        }

        // Handle Vercel results
        if (vercelProjects.status === 'fulfilled') {
          vercelData = vercelProjects.value
          console.log(`✅ Found ${vercelData.length} Vercel projects`)
        } else {
          integrationErrors.push(`Vercel: ${vercelProjects.reason}`)
          vercelData = []
        }

        // Transform repositories if we have them
        if (repos.length > 0) {
          projects = repos
            .filter((repo: GitHubRepository) => {
              return repo && 
                     repo.description && 
                     !repo.archived && 
                     !repo.fork &&
                     !['config', 'dotfiles', '.github', 'profile'].includes(repo.name.toLowerCase()) &&
                     repo.stargazers_count >= 0
            })
            .map((repo: GitHubRepository) => {
              const vercelProject = vercelData.find((v: any) => 
                v?.project?.name?.toLowerCase() === repo.name.toLowerCase()
              )
              
              return transformGitHubRepoToProject(repo, vercelProject)
            })
            .slice(0, parseInt(limit as string))

          dataSource = 'github'
          console.log(`✅ Transformed ${projects.length} GitHub projects`)
          
          const liveProjects = projects.filter(p => p.vercel?.isLive || p.liveUrl)
          console.log(`📡 Found ${liveProjects.length} live deployments`)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown GitHub integration error'
        console.warn('⚠️ GitHub integration failed:', errorMessage)
        integrationErrors.push(`GitHub Integration: ${errorMessage}`)
      }
    }

    // Fallback to enhanced mock projects
    if (projects.length === 0) {
      console.log('📦 Using enhanced mock projects')
      projects = [...enhancedMockProjects]
      dataSource = 'mock'
    }

    // Apply filtering and sorting
    if (featured === 'true') {
      projects = projects.filter((p: PortfolioProject) => p.featured)
    }
    
    if (sort === 'featured') {
      projects.sort((a: PortfolioProject, b: PortfolioProject) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        
        const aLive = a.vercel?.isLive || Boolean(a.liveUrl)
        const bLive = b.vercel?.isLive || Boolean(b.liveUrl)
        if (aLive && !bLive) return -1
        if (!aLive && bLive) return 1
        
        return (b.github?.stars || 0) - (a.github?.stars || 0)
      })
    } else if (sort === 'stars') {
      projects.sort((a, b) => (b.github?.stars || 0) - (a.github?.stars || 0))
    } else if (sort === 'updated') {
      projects.sort((a, b) => {
        const aTime = new Date(a.github?.lastUpdated || 0).getTime()
        const bTime = new Date(b.github?.lastUpdated || 0).getTime()
        return bTime - aTime
      })
    }
    
    const limitNum = parseInt(limit as string)
    if (limitNum > 0) {
      projects = projects.slice(0, limitNum)
    }

    console.log(`✅ Successfully returned ${projects.length} projects from ${dataSource}`)

    const cacheTime = dataSource === 'github' ? 300 : 1800
    res.setHeader('Cache-Control', `public, s-maxage=${cacheTime}, stale-while-revalidate=${cacheTime * 2}`)
    
    return res.status(200).json({
      success: true,
      projects,
      count: projects.length,
      source: dataSource,
      timestamp: new Date().toISOString(),
      meta: {
        hasGitHubIntegration: dataSource === 'github',
        hasLiveDeployments: projects.filter(p => p.vercel?.isLive || p.liveUrl).length,
        totalAvailable: projects.length,
        cacheTime,
        filters: { featured, sort, limit },
        integrationErrors: integrationErrors.length > 0 ? integrationErrors : undefined
      }
    })

  } catch (error) {
    console.error('❌ Critical Projects API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const limitNum = parseInt(limit as string) || 20
    
    return res.status(200).json({
      success: false,
      projects: enhancedMockProjects.slice(0, limitNum),
      count: Math.min(enhancedMockProjects.length, limitNum),
      source: 'emergency-fallback',
      error: errorMessage,
      timestamp: new Date().toISOString(),
      meta: {
        hasGitHubIntegration: false,
        fallbackReason: errorMessage,
        emergencyMode: true
      }
    })
  }
}