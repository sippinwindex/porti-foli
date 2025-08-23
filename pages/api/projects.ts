// pages/api/projects.ts - FIXED: Show ALL repositories without any limits
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
      limit: number | null
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

// Transform enhanced project to API response format
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
    console.log('🚀 Projects API: Fetching ALL projects with NO LIMITS...')
    
    // Get query parameters
    const limit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit
    const featured = Array.isArray(req.query.featured) ? req.query.featured[0] : req.query.featured || 'false'
    const category = Array.isArray(req.query.category) ? req.query.category[0] : req.query.category || 'all'
    const sort = Array.isArray(req.query.sort) ? req.query.sort[0] : req.query.sort || 'featured'
    const includeStats = Array.isArray(req.query.includeStats) ? req.query.includeStats[0] : req.query.includeStats || 'false'

    // FIXED: Default to NO LIMIT unless explicitly requested
    const limitNum = limit && parseInt(limit as string) > 0 ? parseInt(limit as string) : null

    console.log(`📊 Query params: limit=${limitNum || 'UNLIMITED'}, featured=${featured}, category=${category}, sort=${sort}`)

    // Fetch ALL enhanced projects from integration layer
    const allProjects = await getEnhancedProjects()
    
    console.log(`📦 Fetched ${allProjects.length} total projects from GitHub/Vercel integration`)
    
    if (allProjects.length === 0) {
      console.warn('⚠️ No projects found - check GitHub token and API access')
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

    // Filter by featured status
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

    // FIXED: Default to showing ALL projects unless explicitly limited
    const finalProjects = limitNum && limitNum > 0 && limitNum < 1000 
      ? filteredProjects.slice(0, limitNum)
      : filteredProjects // NO LIMIT - return ALL filtered projects

    if (limitNum && limitNum > 0) {
      console.log(`✂️ Applied explicit limit of ${limitNum}: showing ${finalProjects.length} projects`)
    } else {
      console.log(`🌟 NO LIMIT APPLIED: Returning ALL ${finalProjects.length} projects`)
    }

    // Transform to API format
    const transformedProjects = finalProjects.map(transformToAPIFormat)

    // Calculate metadata
    const liveProjectsCount = transformedProjects.filter(p => 
      p.vercel?.isLive || p.deploymentUrl
    ).length

    const meta = {
      total: transformedProjects.length,
      featured: transformedProjects.filter(p => p.featured).length,
      live: liveProjectsCount,
      categories: [...new Set(transformedProjects.map(p => p.category))],
      totalStars: transformedProjects.reduce((sum, p) => sum + (p.github?.stars || 0), 0),
      source: 'integration-unlimited',
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
        console.log(`📊 Portfolio stats: ${stats.totalProjects} projects, ${stats.totalStars} stars`)
      } catch (error) {
        console.warn('⚠️ Could not fetch portfolio stats:', error)
      }
    }

    console.log(`✅ SUCCESS: Returning ${transformedProjects.length} projects`)
    console.log(`📈 Project breakdown: ${meta.featured} featured, ${meta.live} live, ${meta.totalStars} total stars`)

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
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
      message: errorMessage,
      details: {
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