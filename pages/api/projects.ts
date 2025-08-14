// pages/api/projects.ts
import { NextApiRequest, NextApiResponse } from 'next'

interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  archived: boolean
  disabled: boolean
  visibility: 'public' | 'private'
  fork: boolean
}

interface ProjectResponse {
  id: string
  name: string
  description: string
  githubUrl: string
  liveUrl?: string
  techStack: string[]
  tags?: string[]
  featured: boolean
  github?: {
    stars: number
    forks: number
    url: string
    lastUpdated: string
    language?: string
    topics?: string[]
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
  }
  slug?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProjectResponse[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Set up GitHub API headers
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Website'
    }

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
    }

    // Fetch repositories from GitHub
    const response = await fetch(
      'https://api.github.com/users/sippinwindex/repos?type=owner&sort=updated&per_page=50',
      { headers }
    )

    if (!response.ok) {
      console.warn(`GitHub API error: ${response.status}`)
      return res.status(200).json(getFallbackProjects())
    }

    const repositories: GitHubRepository[] = await response.json()

    // Filter and transform repositories for your 3D components
    const projects = repositories
      .filter(repo => 
        !repo.fork && 
        !repo.archived && 
        !repo.disabled && 
        repo.visibility === 'public' &&
        repo.name !== 'sippinwindex'
      )
      .map(repo => ({
        id: repo.id.toString(),
        name: repo.name,
        description: repo.description || `A ${repo.language || 'web'} project showcasing modern development practices`,
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || undefined,
        techStack: [...(repo.topics || []), ...(repo.language ? [repo.language] : [])].slice(0, 6),
        tags: repo.topics || [],
        featured: determineFeatured(repo),
        github: {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
          lastUpdated: repo.updated_at,
          language: repo.language,
          topics: repo.topics
        },
        vercel: {
          isLive: !!(repo.homepage),
          liveUrl: repo.homepage || undefined
        },
        slug: repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
      }))
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        if (a.github!.stars !== b.github!.stars) {
          return b.github!.stars - a.github!.stars
        }
        return new Date(b.github!.lastUpdated).getTime() - new Date(a.github!.lastUpdated).getTime()
      })

    // Set cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
    
    return res.status(200).json(projects)

  } catch (error) {
    console.error('Projects API error:', error)
    return res.status(200).json(getFallbackProjects())
  }
}

function determineFeatured(repo: GitHubRepository): boolean {
  const featuredKeywords = ['portfolio', 'website', 'app', 'dashboard', 'platform']
  const repoName = repo.name.toLowerCase()
  const repoDesc = (repo.description || '').toLowerCase()
  
  if (repo.stargazers_count >= 5) return true
  if (repo.homepage && repo.homepage.trim()) return true
  if (featuredKeywords.some(keyword => 
    repoName.includes(keyword) || repoDesc.includes(keyword)
  )) return true
  if (repo.topics && repo.topics.some(topic => 
    ['react', 'nextjs', 'typescript', 'portfolio', 'webapp'].includes(topic)
  )) return true
  
  return false
}

function getFallbackProjects(): ProjectResponse[] {
  return [
    {
      id: 'portfolio-website',
      name: 'portfolio-website',
      description: 'Modern 3D portfolio website with interactive animations, built using Next.js, Three.js, and Framer Motion',
      githubUrl: 'https://github.com/sippinwindex',
      liveUrl: 'https://juanfernandez.dev',
      techStack: ['React', 'Next.js', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
      tags: ['react', 'nextjs', 'typescript', 'threejs', 'portfolio'],
      featured: true,
      github: {
        stars: 25,
        forks: 8,
        url: 'https://github.com/sippinwindex',
        lastUpdated: new Date().toISOString(),
        language: 'TypeScript',
        topics: ['react', 'nextjs', 'portfolio', 'threejs']
      },
      vercel: {
        isLive: true,
        liveUrl: 'https://juanfernandez.dev'
      },
      slug: 'portfolio-website'
    },
    {
      id: 'ecommerce-suite',
      name: 'ecommerce-suite',
      description: 'Full-stack e-commerce platform with advanced shopping cart, payment integration, and admin dashboard',
      githubUrl: 'https://github.com/sippinwindex',
      liveUrl: 'https://ecommerce-demo.vercel.app',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redux', 'Express'],
      tags: ['react', 'nodejs', 'ecommerce', 'postgresql'],
      featured: true,
      github: {
        stars: 18,
        forks: 5,
        url: 'https://github.com/sippinwindex',
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
        language: 'JavaScript',
        topics: ['react', 'nodejs', 'ecommerce']
      },
      vercel: {
        isLive: true,
        liveUrl: 'https://ecommerce-demo.vercel.app'
      },
      slug: 'ecommerce-suite'
    },
    {
      id: 'healthcare-dashboard',
      name: 'healthcare-dashboard',
      description: 'Healthcare management dashboard with patient records, appointment scheduling, and data visualization',
      githubUrl: 'https://github.com/sippinwindex',
      liveUrl: 'https://healthcare-dash.vercel.app',
      techStack: ['React', 'Next.js', 'MongoDB', 'Chart.js', 'TypeScript', 'Tailwind'],
      tags: ['react', 'nextjs', 'healthcare', 'dashboard'],
      featured: true,
      github: {
        stars: 12,
        forks: 3,
        url: 'https://github.com/sippinwindex',
        lastUpdated: new Date(Date.now() - 172800000).toISOString(),
        language: 'TypeScript',
        topics: ['react', 'dashboard', 'healthcare']
      },
      vercel: {
        isLive: true,
        liveUrl: 'https://healthcare-dash.vercel.app'
      },
      slug: 'healthcare-dashboard'
    },
    {
      id: 'financial-analysis',
      name: 'financial-analysis',
      description: 'Financial analysis tool with real-time stock data, portfolio tracking, and investment insights',
      githubUrl: 'https://github.com/sippinwindex',
      techStack: ['Python', 'React', 'FastAPI', 'PostgreSQL', 'Chart.js', 'Pandas'],
      tags: ['python', 'react', 'finance', 'analytics'],
      featured: false,
      github: {
        stars: 8,
        forks: 2,
        url: 'https://github.com/sippinwindex',
        lastUpdated: new Date(Date.now() - 259200000).toISOString(),
        language: 'Python',
        topics: ['finance', 'analytics', 'python']
      },
      vercel: {
        isLive: false
      },
      slug: 'financial-analysis'
    },
    {
      id: 'task-manager-pro',
      name: 'task-manager-pro',
      description: 'Advanced task management application with team collaboration, real-time updates, and project tracking',
      githubUrl: 'https://github.com/sippinwindex',
      liveUrl: 'https://taskmanager-pro.vercel.app',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Redux', 'Material-UI'],
      tags: ['react', 'nodejs', 'realtime', 'collaboration'],
      featured: false,
      github: {
        stars: 6,
        forks: 1,
        url: 'https://github.com/sippinwindex',
        lastUpdated: new Date(Date.now() - 345600000).toISOString(),
        language: 'JavaScript',
        topics: ['react', 'collaboration', 'productivity']
      },
      vercel: {
        isLive: true,
        liveUrl: 'https://taskmanager-pro.vercel.app'
      },
      slug: 'task-manager-pro'
    },
    {
      id: 'weather-insights',
      name: 'weather-insights',
      description: 'Weather application with detailed forecasts, location-based alerts, and beautiful data visualizations',
      githubUrl: 'https://github.com/sippinwindex',
      liveUrl: 'https://weather-insights.vercel.app',
      techStack: ['React', 'TypeScript', 'Weather API', 'Chart.js', 'Tailwind CSS', 'Framer Motion'],
      tags: ['react', 'typescript', 'weather', 'api'],
      featured: false,
      github: {
        stars: 4,
        forks: 1,
        url: 'https://github.com/sippinwindex',
        lastUpdated: new Date(Date.now() - 432000000).toISOString(),
        language: 'TypeScript',
        topics: ['weather', 'api', 'visualization']
      },
      vercel: {
        isLive: true,
        liveUrl: 'https://weather-insights.vercel.app'
      },
      slug: 'weather-insights'
    }
  ]
}