// pages/api/projects.ts - Enhanced with live deployment detection
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedRepositories } from '@/lib/github-api'
import { getCachedProjectsWithStatus } from '@/lib/vercel-api'
import type { GitHubRepository } from '@/types/github'
import type { PortfolioProject } from '@/types/portfolio'

// Enhanced project transformation with better live deployment detection
function transformGitHubRepoToProject(repo: GitHubRepository, vercelData?: any): PortfolioProject {
  
  // Intelligent category determination
  const determineCategory = (): 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other' => {
    const { language, topics = [], description = '' } = repo
    const content = `${description} ${topics.join(' ')}`.toLowerCase()

    if (topics.includes('mobile') || content.includes('mobile') || content.includes('react-native')) return 'mobile'
    if (topics.includes('data') || content.includes('machine-learning') || content.includes('ai') || language === 'Python') return 'data'
    if (topics.includes('backend') || content.includes('api') || content.includes('server')) return 'backend'
    if (content.includes('frontend') || language === 'HTML' || language === 'CSS') return 'frontend'
    if (content.includes('fullstack') || language === 'TypeScript' || topics.includes('nextjs')) return 'fullstack'
    return 'other'
  }

  // Smart tech stack extraction
  const extractTechStack = () => {
    const techStack = new Set<string>()
    
    if (repo.language) techStack.add(repo.language)
    
    const techTopics = repo.topics?.filter((topic: string) => 
      ['react', 'nextjs', 'vue', 'angular', 'node', 'express', 'django', 
       'flask', 'mongodb', 'postgresql', 'docker', 'aws', 'typescript',
       'tailwind', 'framer-motion', 'threejs', 'webgl'].includes(topic.toLowerCase())
    ) || []

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
  }

  // Enhanced live deployment detection
  const detectLiveDeployment = () => {
    // Priority 1: Vercel deployment is live
    if (vercelData && vercelData.status?.state === 'READY' && vercelData.liveUrl) {
      return {
        isLive: true,
        liveUrl: vercelData.liveUrl,
        deploymentStatus: 'READY',
        source: 'vercel'
      }
    }

    // Priority 2: GitHub Pages (check if has_pages is true)
    if (repo.has_pages && repo.homepage) {
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
    if (vercelData && vercelData.status) {
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
  }

  // Calculate deployment score with live deployment bonus
  const calculateDeploymentScore = () => {
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
  }

  // Determine if featured with better logic
  const isFeatured = () => {
    const liveInfo = detectLiveDeployment()
    return repo.stargazers_count > 3 || 
           repo.topics?.includes('featured') ||
           liveInfo.isLive ||
           calculateDeploymentScore() > 85 ||
           repo.topics?.includes('portfolio')
  }

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
      stars: repo.stargazers_count,
      forks: repo.forks_count,
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
    highlights: [
      `${repo.stargazers_count} GitHub stars`,
      `Written in ${repo.language || 'JavaScript'}`,
      ...(liveInfo.isLive ? [`Live deployment on ${liveInfo.source}`] : []),
      ...(repo.topics?.length > 0 ? [`Technologies: ${repo.topics.slice(0, 3).join(', ')}`] : [])
    ].filter(Boolean)
  }
}

// Helper functions
function isValidDeploymentUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.toLowerCase()
    
    // Known deployment platforms
    const deploymentPlatforms = [
      'vercel.app',
      'netlify.app',
      'herokuapp.com',
      'github.io',
      'surge.sh',
      'firebase.app',
      'web.app',
      'cloudfront.net',
      'azurewebsites.net',
      'railway.app'
    ]
    
    return deploymentPlatforms.some(platform => 
      hostname.includes(platform) || hostname.endsWith(platform)
    ) || 
    // Custom domains that look like deployment URLs
    (!hostname.includes('github.com') && !hostname.includes('localhost'))
  } catch {
    return false
  }
}

function formatProjectName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bJs\b/g, 'JS')
    .replace(/\bTs\b/g, 'TS')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bUi\b/g, 'UI')
    .replace(/\bDb\b/g, 'DB')
    .replace(/\b3[Dd]\b/g, '3D')
}

function generateProjectImage(name: string, language: string | null): string {
  // Generate a placeholder image URL or return a default
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  return `/images/projects/${slug}.jpg`
}

// Enhanced mock projects for fallback
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
      'Advanced 3D animations with Three.js',
      'Professional UI/UX with glass morphism'
    ]
  },
  {
    id: 'synthwave-runner-game', 
    name: 'synthwave-runner',
    title: 'Synthwave Runner Game',
    description: 'High-performance endless runner game with retro synthwave aesthetics and smooth HTML5 Canvas animations',
    techStack: ['React', 'TypeScript', 'HTML5 Canvas', 'Framer Motion', 'Web Audio API'],
    tags: ['game', 'canvas', 'typescript', 'synthwave'],
    featured: true,
    category: 'frontend',
    status: 'completed',
    image: '/images/projects/synthwave-runner.jpg',
    github: {
      stars: 15,
      forks: 4,
      url: 'https://github.com/sippinwindex/synthwave-runner',
      topics: ['game', 'canvas', 'typescript', 'synthwave'],
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
    complexity: 'intermediate',
    teamSize: 1,
    role: 'Game Developer',
    highlights: [
      '15 GitHub stars',
      'Live deployment on vercel',
      '60 FPS performance optimization',
      'Retro synthwave aesthetic design'
    ]
  },
  {
    id: 'github-integration-system',
    name: 'github-integration',
    title: 'GitHub Integration System',
    description: 'Sophisticated GitHub API integration with caching, rate limiting, and real-time data synchronization',
    techStack: ['Next.js', 'GitHub API', 'TypeScript', 'SWR', 'Redis', 'Webhook'],
    tags: ['api', 'github', 'real-time', 'caching'],
    featured: true,
    category: 'backend',
    status: 'completed',
    image: '/images/projects/github-integration.jpg',
    github: {
      stars: 12,
      forks: 2,
      url: 'https://github.com/sippinwindex/github-integration',
      topics: ['github-api', 'webhook', 'real-time', 'caching'],
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      language: 'TypeScript'
    },
    githubUrl: 'https://github.com/sippinwindex/github-integration',
    complexity: 'advanced',
    teamSize: 1,
    role: 'Backend Developer',
    highlights: [
      '12 GitHub stars',
      'Written in TypeScript',
      'Intelligent caching with 5-minute TTL',
      'Real-time webhook integration'
    ]
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { 
    limit = '20',
    sort = 'featured',
    featured = 'false',
    source = 'auto'
  } = req.query

  try {
    console.log('🔄 Enhanced Projects API called with live deployment detection')
    
    let projects: PortfolioProject[] = []
    let dataSource = 'mock'

    // Try GitHub first if available
    if (source === 'github' || source === 'auto') {
      try {
        console.log('🔄 Attempting to fetch real GitHub data with Vercel integration...')
        
        const [githubRepos, vercelProjects] = await Promise.all([
          getCachedRepositories().catch(() => []),
          getCachedProjectsWithStatus().catch(() => [])
        ])

        if (githubRepos && githubRepos.length > 0) {
          console.log(`✅ Found ${githubRepos.length} GitHub repositories`)
          console.log(`✅ Found ${vercelProjects.length} Vercel projects`)
          
          // Transform GitHub repos to portfolio projects with Vercel data
          projects = githubRepos
            .filter((repo: GitHubRepository) => {
              // Filter for portfolio-worthy repos
              return repo.description && 
                     !repo.archived && 
                     !repo.fork &&
                     !['config', 'dotfiles', '.github', 'profile'].includes(repo.name.toLowerCase()) &&
                     repo.stargazers_count >= 0 // Include all repos, even with 0 stars
            })
            .map((repo: GitHubRepository) => {
              // Find matching Vercel project
              const vercelData = vercelProjects.find((v: any) => 
                v?.project?.name?.toLowerCase() === repo.name.toLowerCase()
              )
              
              return transformGitHubRepoToProject(repo, vercelData)
            })
            .slice(0, parseInt(limit as string))

          dataSource = 'github'
          console.log(`✅ Transformed ${projects.length} GitHub projects with live deployment detection`)
          
          // Log live deployment status
          const liveProjects = projects.filter(p => p.vercel?.isLive || p.liveUrl)
          console.log(`📡 Found ${liveProjects.length} live deployments`)
        }
      } catch (error) {
        console.warn('⚠️ GitHub integration failed:', error)
      }
    }

    // Fallback to enhanced mock projects
    if (projects.length === 0) {
      console.log('📦 Using enhanced mock projects with live deployment simulation')
      projects = [...enhancedMockProjects]
      dataSource = 'mock'
    }

    // Apply filtering
    if (featured === 'true') {
      projects = projects.filter((p: PortfolioProject) => p.featured)
    }
    
    // Apply sorting
    if (sort === 'featured') {
      projects.sort((a: PortfolioProject, b: PortfolioProject) => {
        // Featured first, then live deployments, then by stars
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        
        const aLive = a.vercel?.isLive || Boolean(a.liveUrl)
        const bLive = b.vercel?.isLive || Boolean(b.liveUrl)
        if (aLive && !bLive) return -1
        if (!aLive && bLive) return 1
        
        return (b.github?.stars || 0) - (a.github?.stars || 0)
      })
    } else if (sort === 'stars') {
      projects.sort((a: PortfolioProject, b: PortfolioProject) => (b.github?.stars || 0) - (a.github?.stars || 0))
    } else if (sort === 'updated') {
      projects.sort((a: PortfolioProject, b: PortfolioProject) => 
        new Date(b.github?.lastUpdated || 0).getTime() - new Date(a.github?.lastUpdated || 0).getTime()
      )
    }
    
    // Apply final limit
    const limitNum = parseInt(limit as string)
    if (limitNum > 0) {
      projects = projects.slice(0, limitNum)
    }

    console.log(`✅ Successfully returned ${projects.length} projects from ${dataSource}`)

    // Set appropriate cache headers
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
        filters: { featured, sort, limit }
      }
    })

  } catch (error) {
    console.error('❌ Enhanced Projects API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const limitNum = parseInt(limit as string) || 20
    
    // Always return data, even on error
    return res.status(200).json({
      success: false,
      projects: enhancedMockProjects.slice(0, limitNum),
      count: enhancedMockProjects.length,
      source: 'fallback',
      error: errorMessage,
      timestamp: new Date().toISOString(),
      meta: {
        hasGitHubIntegration: false,
        fallbackReason: errorMessage
      }
    })
  }
}