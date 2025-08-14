// app/api/projects/route.ts
import { NextResponse } from 'next/server'

interface EnhancedProject {
  id: string
  slug: string
  name: string
  description: string
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other'
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  featured: boolean
  order: number
  github?: {
    url: string
    stars: number
    forks: number
    language: string | null
    topics: string[]
    lastUpdated: string
  }
  vercel?: {
    deploymentStatus: any
    liveUrl?: string
    isLive: boolean
    buildStatus: 'success' | 'error' | 'building' | 'pending' | 'unknown'
  }
  metadata: {
    images: string[]
    tags: string[]
    highlights: string[]
    liveUrl?: string
  }
  techStack: string[]
  lastActivity: string
  deploymentScore: number
}

async function fetchGitHubRepos() {
  try {
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/github?type=repos`, {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      }
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API failed: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error)
    return []
  }
}

function determineCategory(language: string | null, topics: string[]): EnhancedProject['category'] {
  if (topics.includes('mobile') || topics.includes('react-native')) return 'mobile'
  if (topics.includes('data') || topics.includes('machine-learning') || topics.includes('ai')) return 'data'
  if (topics.includes('backend') || topics.includes('api') || language === 'Python') return 'backend'
  if (topics.includes('frontend') || language === 'JavaScript') return 'frontend'
  if (topics.includes('fullstack') || language === 'TypeScript') return 'fullstack'
  return 'other'
}

function generateTechStack(language: string | null, topics: string[]): string[] {
  const techStack = new Set<string>()
  
  if (language) techStack.add(language)
  
  const techTopics = topics.filter(topic => 
    ['react', 'nextjs', 'vue', 'angular', 'node', 'express', 'django', 'flask'].includes(topic.toLowerCase())
  )
  
  techTopics.forEach(topic => {
    const techMap: Record<string, string> = {
      'nextjs': 'Next.js',
      'react': 'React',
      'vue': 'Vue.js',
      'angular': 'Angular',
      'node': 'Node.js',
      'express': 'Express',
      'django': 'Django',
      'flask': 'Flask'
    }
    techStack.add(techMap[topic.toLowerCase()] || topic)
  })
  
  return Array.from(techStack).slice(0, 6)
}

function calculateDeploymentScore(repo: any): number {
  let score = 60
  
  if (repo.description) score += 10
  if (repo.stargazers_count > 0) score += Math.min(repo.stargazers_count * 5, 20)
  if (repo.topics && repo.topics.length > 0) score += 10
  
  const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceUpdate < 30) score += 10
  
  return Math.min(score, 100)
}

export async function GET() {
  try {
    console.log('🔄 Fetching enhanced projects...')
    
    const githubRepos = await fetchGitHubRepos()
    
    if (!githubRepos || githubRepos.length === 0) {
      console.warn('⚠️ No GitHub repos found, returning empty array')
      return NextResponse.json({ projects: [] })
    }
    
    const enhancedProjects: EnhancedProject[] = githubRepos.map((repo: any, index: number) => {
      const category = determineCategory(repo.language, repo.topics || [])
      const techStack = generateTechStack(repo.language, repo.topics || [])
      const deploymentScore = calculateDeploymentScore(repo)
      const featured = repo.stargazers_count > 0 || repo.forks_count > 0 || index < 6
      
      return {
        id: repo.id.toString(),
        slug: repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        description: repo.description || 'A project built with modern web technologies',
        category,
        status: 'completed' as const,
        featured,
        order: featured ? index : index + 100,
        
        github: {
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          topics: repo.topics || [],
          lastUpdated: repo.updated_at
        },
        
        vercel: repo.homepage ? {
          deploymentStatus: 'READY',
          liveUrl: repo.homepage,
          isLive: true,
          buildStatus: 'success' as const
        } : undefined,
        
        metadata: {
          images: [`/projects/${repo.name.toLowerCase()}.jpg`],
          tags: repo.topics || [],
          highlights: [],
          liveUrl: repo.homepage
        },
        
        techStack,
        lastActivity: repo.updated_at,
        deploymentScore
      }
    })
    
    // Sort: featured first, then by deployment score
    enhancedProjects.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.deploymentScore - a.deploymentScore
    })
    
    console.log(`✅ Generated ${enhancedProjects.length} enhanced projects`)
    
    // Return in the format your homepage expects
    return NextResponse.json({ 
      projects: enhancedProjects 
    }, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    })
    
  } catch (error) {
    console.error('❌ Projects API Error:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to fetch projects',
        message: error instanceof Error ? error.message : 'Service temporarily unavailable'
      },
      { status: 500 }
    )
  }
}