// pages/api/projects.ts - ENHANCED with real GitHub integration
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedRepositories } from '@/lib/github-api'
import { getCachedProjectsWithStatus } from '@/lib/vercel-api'
import type { GitHubRepository } from '@/types/github'
import type { PortfolioProject } from '@/types/portfolio'

// Enhanced project transformation
function transformGitHubRepoToProject(repo: GitHubRepository, vercelData?: any): PortfolioProject {
  // Intelligent category determination
  const determineCategory = (): 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other' => {
    const { language, topics = [], description = '' } = repo
    const content = `${description} ${topics.join(' ')}`.toLowerCase()

    if (topics.includes('mobile') || content.includes('mobile')) return 'mobile'
    if (topics.includes('data') || content.includes('machine-learning') || content.includes('ai')) return 'data'
    if (topics.includes('backend') || content.includes('api') || language === 'Python') return 'backend'
    if (content.includes('frontend') || language === 'HTML' || language === 'CSS') return 'frontend'
    if (content.includes('fullstack') || language === 'TypeScript') return 'fullstack'
    return 'other'
  }

  // Smart tech stack extraction
  const extractTechStack = () => {
    const techStack = new Set<string>()
    
    if (repo.language) techStack.add(repo.language)
    
    const techTopics = repo.topics?.filter((topic: string) => 
      ['react', 'nextjs', 'vue', 'angular', 'node', 'express', 'django', 
       'flask', 'mongodb', 'postgresql', 'docker', 'aws', 'typescript'].includes(topic.toLowerCase())
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
        'typescript': 'TypeScript'
      }
      techStack.add(topicMap[topic.toLowerCase()] || topic)
    })

    return Array.from(techStack).slice(0, 6)
  }

  // Calculate deployment score
  const calculateDeploymentScore = () => {
    let score = 60

    if (repo.description) score += 10
    if (repo.stargazers_count > 0) score += Math.min(repo.stargazers_count * 2, 20)
    if (repo.topics && repo.topics.length > 0) score += 5
    if (vercelData?.isLive) score += 15

    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate < 30) score += 10

    return Math.min(score, 100)
  }

  // Determine if featured
  const isFeatured = () => {
    return repo.stargazers_count > 2 || 
           repo.topics?.includes('featured') ||
           calculateDeploymentScore() > 85 ||
           vercelData?.isLive
  }

  return {
    id: repo.id.toString(),
    name: repo.name,
    title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    description: repo.description || 'A project built with modern web technologies',
    longDescription: repo.description ? `${repo.description}. This project demonstrates modern development practices and showcases technical expertise in ${repo.language || 'web development'}.` : undefined,
    techStack: extractTechStack(),
    tags: repo.topics || [],
    featured: isFeatured(),
    category: determineCategory() as 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other',
    status: 'completed' as const,
    github: {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      topics: repo.topics || [],
      lastUpdated: repo.updated_at,
      language: repo.language || undefined
    },
    vercel: vercelData ? {
      isLive: vercelData.status?.state === 'READY',
      liveUrl: vercelData.liveUrl,
      deploymentStatus: vercelData.status?.state || 'unknown'
    } : undefined,
    githubUrl: repo.html_url,
    liveUrl: vercelData?.liveUrl || repo.homepage || undefined,
    topics: repo.topics || [],
    complexity: repo.stargazers_count > 10 ? 'advanced' : repo.stargazers_count > 2 ? 'intermediate' : 'beginner',
    teamSize: 1,
    role: 'Full-Stack Developer',
    highlights: [
      `${repo.stargazers_count} GitHub stars`,
      `Written in ${repo.language || 'JavaScript'}`,
      ...(vercelData?.isLive ? ['Live deployment'] : []),
      ...(repo.topics?.length > 0 ? [`Technologies: ${repo.topics.slice(0, 3).join(', ')}`] : [])
    ].filter(Boolean)
  }
}

// Enhanced mock projects that match your sophisticated implementation
const enhancedMockProjects: PortfolioProject[] = [
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    title: '3D Interactive Portfolio',
    description: 'Modern 3D portfolio with live GitHub integration, interactive animations, and cutting-edge web technologies',
    longDescription: 'A sophisticated portfolio showcasing advanced React/Next.js development with real-time GitHub API integration, 3D animations using Framer Motion, and professional UI/UX design.',
    techStack: ['Next.js 14', 'Three.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'GitHub API'],
    tags: ['Portfolio', 'Next.js', 'TypeScript', '3D', 'GitHub Integration'],
    featured: true,
    category: 'fullstack',
    status: 'completed',
    github: {
      stars: 25,
      forks: 8,
      url: 'https://github.com/sippinwindex',
      topics: ['nextjs', 'portfolio', 'typescript', '3d', 'github-api'],
      lastUpdated: new Date().toISOString(),
      language: 'TypeScript'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juanfernandez.dev',
      deploymentStatus: 'READY'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: 'https://juanfernandez.dev',
    topics: ['portfolio', 'nextjs', 'typescript', '3d'],
    complexity: 'advanced',
    teamSize: 1,
    role: 'Lead Full-Stack Developer',
    highlights: [
      'Real-time GitHub API integration',
      'Advanced 3D animations with Three.js',
      'Professional UI/UX with glass morphism',
      'Mobile-first responsive design',
      'Optimized performance with 95+ Lighthouse score'
    ]
  },
  {
    id: 'synthwave-runner-game', 
    name: 'Synthwave Runner',
    title: 'Professional Browser Game',
    description: 'High-performance endless runner game with retro synthwave aesthetics and smooth HTML5 Canvas animations',
    techStack: ['React', 'TypeScript', 'HTML5 Canvas', 'Framer Motion', 'Web Audio API'],
    tags: ['Game', 'Canvas', 'TypeScript', 'Performance'],
    featured: true,
    category: 'frontend',
    status: 'completed',
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
      liveUrl: '/dino-game',
      deploymentStatus: 'READY'
    },
    complexity: 'intermediate',
    teamSize: 1,
    role: 'Game Developer',
    highlights: [
      '60 FPS performance optimization',
      'Retro synthwave aesthetic design',
      'Responsive touch and keyboard controls',
      'Web Audio API integration for sound'
    ]
  },
  {
    id: 'github-integration-system',
    name: 'GitHub Integration System', 
    title: 'Real-Time GitHub Data Sync',
    description: 'Sophisticated GitHub API integration with caching, rate limiting, and real-time data synchronization',
    techStack: ['Next.js', 'GitHub API', 'TypeScript', 'SWR', 'Redis', 'Webhook'],
    tags: ['API Integration', 'GitHub', 'Real-time', 'Caching'],
    featured: true,
    category: 'backend',
    status: 'completed',
    github: {
      stars: 12,
      forks: 2,
      url: 'https://github.com/sippinwindex/github-integration',
      topics: ['github-api', 'webhook', 'real-time', 'caching'],
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      language: 'TypeScript'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juanfernandez.dev/projects',
      deploymentStatus: 'READY'
    },
    complexity: 'advanced',
    teamSize: 1,
    role: 'Backend Developer',
    highlights: [
      'Intelligent caching with 5-minute TTL',
      'Rate limit handling with exponential backoff',
      'Real-time webhook integration',
      'Graceful fallback strategies'
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

  // Extract query parameters at the top level so they're accessible throughout
  const { 
    limit = '20',
    sort = 'featured',
    featured = 'false',
    source = 'auto' // auto, github, mock
  } = req.query

  try {
    console.log('🔄 Enhanced Projects API called')
    
    let projects: PortfolioProject[] = []
    let dataSource = 'mock'

    // Strategy: Try GitHub first if available, fallback to enhanced mock
    if (source === 'github' || source === 'auto') {
      try {
        console.log('🔄 Attempting to fetch real GitHub data...')
        
        const [githubRepos, vercelProjects] = await Promise.all([
          getCachedRepositories().catch(() => []),
          getCachedProjectsWithStatus().catch(() => [])
        ])

        if (githubRepos && githubRepos.length > 0) {
          console.log(`✅ Found ${githubRepos.length} GitHub repositories`)
          
          // Transform GitHub repos to portfolio projects
          projects = githubRepos
            .filter((repo: GitHubRepository) => {
              // Filter for portfolio-worthy repos
              return repo.description && 
                     !repo.archived && 
                     !repo.fork &&
                     !['config', 'dotfiles', '.github'].includes(repo.name.toLowerCase())
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
          console.log(`✅ Transformed ${projects.length} GitHub projects`)
        }
      } catch (error) {
        console.warn('⚠️ GitHub integration failed:', error)
      }
    }

    // Fallback to enhanced mock projects
    if (projects.length === 0) {
      console.log('📦 Using enhanced mock projects')
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
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
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
    const cacheTime = dataSource === 'github' ? 300 : 1800 // 5 min for GitHub, 30 min for mock
    res.setHeader('Cache-Control', `public, s-maxage=${cacheTime}, stale-while-revalidate=${cacheTime * 2}`)
    
    return res.status(200).json({
      success: true,
      projects,
      count: projects.length,
      source: dataSource,
      timestamp: new Date().toISOString(),
      meta: {
        hasGitHubIntegration: dataSource === 'github',
        totalAvailable: dataSource === 'github' ? projects.length : enhancedMockProjects.length,
        cacheTime,
        filters: { featured, sort, limit }
      }
    })

  } catch (error) {
    console.error('❌ Enhanced Projects API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const limitNum = parseInt(limit as string) || 20
    
    // Always return data, even on error - use enhanced mock as ultimate fallback
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