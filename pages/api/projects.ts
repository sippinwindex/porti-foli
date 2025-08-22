// pages/api/projects.ts - FIXED: Complete repository loading
import type { NextApiRequest, NextApiResponse } from 'next'
import { getEnhancedProjects, getPortfolioStats, type EnhancedProject, type PortfolioStats } from '@/lib/portfolio-integration'

// API Response Types
interface ProjectAPIResponse {
  success: boolean
  projects: ReturnType<typeof transformToAPIFormat>[]
  meta: {
    total: number
    featured: number
    live: number
    categories?: string[]
    totalStars?: number
    source: string
    timestamp: string
    filters?: {
      featured: boolean
      category: string
      sort: string
      limit: number
    }
  }
  stats?: PortfolioStats
  _debug?: {
    hasGitHubIntegration: boolean
    hasVercelIntegration: boolean
    projectsSource: string
    cacheStrategy: string
    repositoriesFound: number
    filteredRepositories: number
  }
}

interface ErrorAPIResponse {
  success: false
  error: string
  message: string
  details?: any
  projects: []
  meta: {
    total: number
    featured: number
    live: number
    source: string
    timestamp: string
  }
}

// Transform enhanced project to API response format for compatibility
function transformToAPIFormat(project: EnhancedProject) {
  return {
    id: project.id,
    name: project.name,
    title: project.title,
    description: project.description,
    techStack: project.techStack,
    tags: project.topics,
    featured: project.featured,
    category: project.category,
    status: project.status,
    
    // GitHub integration
    github: {
      stars: project.github.stars,
      forks: project.github.forks,
      url: project.github.url,
      language: project.github.language,
      lastUpdated: project.github.lastUpdated,
      topics: project.topics
    },
    
    // Vercel integration
    vercel: project.vercel ? {
      isLive: project.vercel.isLive,
      liveUrl: project.vercel.liveUrl,
      deploymentStatus: project.vercel.deploymentStatus,
      lastDeployed: project.vercel.lastDeployed
    } : undefined,
    
    // Legacy compatibility
    githubUrl: project.github.url,
    liveUrl: project.deploymentUrl, // Primary deployment URL
    
    // Metadata
    highlights: [`${project.github.stars} GitHub stars`, `Category: ${project.category}`],
    startDate: new Date(project.github.repository.created_at).toISOString().split('T')[0],
    
    // Computed metrics for sorting/filtering
    deploymentScore: project.deploymentScore,
    popularityScore: project.popularityScore,
    lastActivity: project.lastActivity,
    
    // URLs with clear priority for frontend logic
    primaryUrl: project.primaryUrl, // The URL to open when clicked
    deploymentUrl: project.deploymentUrl, // Live demo if available
    repositoryUrl: project.repositoryUrl // Always GitHub repo
  }
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ProjectAPIResponse | ErrorAPIResponse>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      message: 'Only GET requests are supported',
      projects: [],
      meta: {
        total: 0,
        featured: 0,
        live: 0,
        source: 'error',
        timestamp: new Date().toISOString()
      }
    })
  }

  try {
    console.log('🔄 Projects API: Fetching enhanced projects...')
    
    // FIXED: Get query parameters with proper defaults for unlimited loading
    const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit
    const featured = Array.isArray(req.query.featured) ? req.query.featured[0] : req.query.featured || 'false'
    const category = Array.isArray(req.query.category) ? req.query.category[0] : req.query.category || 'all'
    const sort = Array.isArray(req.query.sort) ? req.query.sort[0] : req.query.sort || 'featured'
    const includeStats = Array.isArray(req.query.includeStats) ? req.query.includeStats[0] : req.query.includeStats || 'false'

    // FIXED: Default to showing ALL projects (no limit) unless specifically requested
    const limitNum = limit ? parseInt(limit as string) : 0 // 0 means no limit

    console.log(`📊 Query params: limit=${limitNum || 'unlimited'}, featured=${featured}, category=${category}, sort=${sort}`)

    // Fetch enhanced projects from integration layer
    const allProjects = await getEnhancedProjects()
    
    console.log(`📦 Raw projects from integration: ${allProjects.length}`)
    
    if (allProjects.length === 0) {
      console.warn('⚠️ No projects found from integration layer')
      return res.status(200).json({
        success: true,
        projects: [],
        meta: {
          total: 0,
          featured: 0,
          live: 0,
          source: 'integration-empty',
          timestamp: new Date().toISOString()
        },
        _debug: {
          hasGitHubIntegration: !!process.env.GITHUB_TOKEN,
          hasVercelIntegration: !!process.env.VERCEL_TOKEN,
          projectsSource: 'integration-layer',
          cacheStrategy: 'server-side-cached',
          repositoriesFound: 0,
          filteredRepositories: 0
        }
      })
    }

    // Apply filters
    let filteredProjects = [...allProjects]
    console.log(`🔽 Starting with ${filteredProjects.length} projects`)

    // Filter by featured
    if (featured === 'true') {
      filteredProjects = filteredProjects.filter(project => project.featured)
      console.log(`⭐ After featured filter: ${filteredProjects.length} projects`)
    }

    // Filter by category
    if (category !== 'all') {
      filteredProjects = filteredProjects.filter(project => project.category === category)
      console.log(`📁 After category filter (${category}): ${filteredProjects.length} projects`)
    }

    // Apply sorting
    switch (sort) {
      case 'featured':
        // Already sorted by featured first in integration layer
        break
      case 'stars':
        filteredProjects.sort((a, b) => b.github.stars - a.github.stars)
        break
      case 'updated':
        filteredProjects.sort((a, b) => 
          new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        )
        break
      case 'name':
        filteredProjects.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'score':
        filteredProjects.sort((a, b) => b.overallScore - a.overallScore)
        break
    }

    console.log(`🔄 After sorting by ${sort}: ${filteredProjects.length} projects`)

    // FIXED: Apply limit only if specified and greater than 0
    if (limitNum > 0 && limitNum < filteredProjects.length) {
      filteredProjects = filteredProjects.slice(0, limitNum)
      console.log(`✂️ After limit (${limitNum}): ${filteredProjects.length} projects`)
    }

    // Transform to API format
    const transformedProjects = filteredProjects.map(transformToAPIFormat)

    // Calculate metadata
    const meta = {
      total: transformedProjects.length,
      featured: transformedProjects.filter(p => p.featured).length,
      live: transformedProjects.filter(p => p.vercel?.isLive || p.deploymentUrl).length,
      categories: [...new Set(transformedProjects.map(p => p.category))],
      totalStars: transformedProjects.reduce((sum, p) => sum + (p.github?.stars || 0), 0),
      source: 'integration',
      timestamp: new Date().toISOString(),
      filters: {
        featured: featured === 'true',
        category,
        sort,
        limit: limitNum
      }
    }

    // Optionally include portfolio stats
    let stats: PortfolioStats | undefined = undefined
    if (includeStats === 'true') {
      try {
        stats = await getPortfolioStats()
      } catch (error) {
        console.warn('⚠️ Could not fetch portfolio stats:', error)
      }
    }

    console.log(`✅ Projects API: Returning ${transformedProjects.length} projects`)

    // Set cache headers for performance
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')

    return res.status(200).json({
      success: true,
      projects: transformedProjects,
      meta,
      stats,
      _debug: {
        hasGitHubIntegration: !!process.env.GITHUB_TOKEN,
        hasVercelIntegration: !!process.env.VERCEL_TOKEN,
        projectsSource: 'enhanced-integration',
        cacheStrategy: 'server-side-cached',
        repositoriesFound: allProjects.length,
        filteredRepositories: transformedProjects.length
      }
    })

  } catch (error) {
    console.error('❌ Projects API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const isAPIError = errorMessage.includes('API')
    const isNetworkError = errorMessage.includes('fetch')
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
      message: errorMessage,
      details: {
        type: isAPIError ? 'api_error' : isNetworkError ? 'network_error' : 'server_error',
        hasGitHubToken: !!process.env.GITHUB_TOKEN,
        hasVercelToken: !!process.env.VERCEL_TOKEN,
        timestamp: new Date().toISOString()
      },
      projects: [],
      meta: {
        total: 0,
        featured: 0,
        live: 0,
        source: 'error-fallback',
        timestamp: new Date().toISOString()
      }
    })
  }
}