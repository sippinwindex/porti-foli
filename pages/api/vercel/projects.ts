// pages/api/vercel/projects.ts - Vercel projects API endpoint
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedProjectsWithStatus } from '@/lib/vercel-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('🔄 Vercel Projects API called')

  // Check for Vercel token
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN
  if (!VERCEL_TOKEN) {
    console.warn('⚠️ No Vercel token found - returning empty projects')
    return res.status(200).json({ 
      projects: [],
      count: 0,
      message: 'Vercel integration not configured',
      timestamp: new Date().toISOString()
    })
  }

  try {
    console.log('🔄 Fetching Vercel projects with deployment status...')
    
    // Get query parameters
    const { 
      limit = '50',
      includePreviews = 'true'
    } = req.query

    // Fetch projects with status
    const projectsWithStatus = await getCachedProjectsWithStatus()
    
    // Apply limit if specified
    const limitNum = parseInt(limit as string)
    const limitedProjects = limitNum > 0 
      ? projectsWithStatus.slice(0, limitNum)
      : projectsWithStatus

    // Filter previews if requested
    const finalProjects = includePreviews === 'false'
      ? limitedProjects.filter(p => p.status?.target === 'production' || !p.status?.target)
      : limitedProjects

    console.log(`✅ Successfully fetched ${finalProjects.length} Vercel projects`)

    // Set cache headers (cache for 30 minutes)
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
    
    return res.status(200).json({
      projects: finalProjects,
      count: finalProjects.length,
      meta: {
        totalProjects: projectsWithStatus.length,
        liveProjects: projectsWithStatus.filter(p => p.isLive).length,
        hasVercelIntegration: true,
        filters: {
          limit: limitNum,
          includePreviews: includePreviews === 'true'
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Vercel Projects API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isRateLimit = errorMessage.includes('rate limit') || errorMessage.includes('429')
    const isAuth = errorMessage.includes('401') || errorMessage.includes('403')
    
    let statusCode = 500
    let userMessage = 'Failed to fetch Vercel projects'
    
    if (isAuth) {
      statusCode = 401
      userMessage = 'Vercel authentication failed - check your token'
    } else if (isRateLimit) {
      statusCode = 429
      userMessage = 'Vercel rate limit exceeded - try again later'
    }
    
    return res.status(statusCode).json({
      error: userMessage,
      details: errorMessage,
      projects: [],
      count: 0,
      timestamp: new Date().toISOString()
    })
  }
}