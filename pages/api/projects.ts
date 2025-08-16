// pages/api/projects.ts
import type { NextApiRequest, NextApiResponse } from 'next'

// Mock project data to prevent 500 errors
const mockProjects = [
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    title: 'Portfolio Website',
    description: 'Modern 3D portfolio with live GitHub integration, interactive animations, and cutting-edge web technologies',
    techStack: ['Next.js', 'Three.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    featured: true,
    github: {
      stars: 25,
      forks: 8,
      url: 'https://github.com/sippinwindex'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juanfernandez.dev'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: 'https://juanfernandez.dev'
  },
  {
    id: 'synthwave-runner',
    name: 'Synthwave Runner',
    title: 'Synthwave Runner',
    description: 'Professional endless runner game with synthwave aesthetics, built with modern web technologies',
    techStack: ['React', 'TypeScript', 'Framer Motion', 'HTML5 Canvas'],
    featured: true,
    github: {
      stars: 15,
      forks: 4,
      url: 'https://github.com/sippinwindex'
    },
    vercel: {
      isLive: true,
      liveUrl: '/dino-game'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: '/dino-game'
  },
  {
    id: 'github-integration',
    name: 'GitHub Integration',
    title: 'GitHub Integration',
    description: 'Real-time GitHub API integration with caching and live project data synchronization',
    techStack: ['Next.js', 'GitHub API', 'TypeScript', 'SWR'],
    featured: true,
    github: {
      stars: 12,
      forks: 2,
      url: 'https://github.com/sippinwindex'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juanfernandez.dev'
    },
    githubUrl: 'https://github.com/sippinwindex',
    liveUrl: 'https://juanfernandez.dev'
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔄 Projects API called')
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const { 
      limit = '10',
      sort = 'featured',
      featured = 'false'
    } = req.query

    let projects = [...mockProjects]
    
    // Apply filtering
    if (featured === 'true') {
      projects = projects.filter(p => p.featured)
    }
    
    // Apply sorting
    if (sort === 'featured') {
      projects.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return 0
      })
    }
    
    // Apply limit
    const limitNum = parseInt(limit as string)
    if (limitNum > 0) {
      projects = projects.slice(0, limitNum)
    }

    console.log(`✅ Successfully returned ${projects.length} projects`)

    // Set cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return res.status(200).json({
      success: true,
      projects,
      count: projects.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Projects API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return res.status(500).json({
      error: 'Failed to fetch projects',
      details: errorMessage,
      projects: mockProjects.slice(0, 3), // Fallback data
      timestamp: new Date().toISOString()
    })
  }
}