// pages/api/github/stats.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedGitHubStats } from '@/lib/github-api'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('🔄 GitHub Stats API called')

  // Check for GitHub token
  if (!GITHUB_TOKEN) {
    console.error('❌ No GitHub token found in environment variables')
    return res.status(503).json({ 
      error: 'GitHub token not configured',
      details: 'GITHUB_TOKEN environment variable is missing'
    })
  }

  try {
    // FIXED: Use getCachedGitHubStats directly instead of createGitHubAPI
    console.log('🔄 Fetching GitHub stats...')
    
    // Get query parameters
    const { username = 'sippinwindex' } = req.query

    // FIXED: Call getCachedGitHubStats directly
    const stats = await getCachedGitHubStats(username as string)

    console.log('✅ Successfully fetched GitHub stats:', {
      totalStars: stats.totalStars,
      totalForks: stats.totalForks,
      repositories: typeof stats.repositories === 'number' ? stats.repositories : stats.repositories.length
    })

    // Set cache headers (cache for 30 minutes)
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
    
    return res.status(200).json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ GitHub Stats API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isRateLimit = errorMessage.includes('rate limit') || errorMessage.includes('403')
    const isAuth = errorMessage.includes('401') || errorMessage.includes('Bad credentials')
    
    let statusCode = 500
    let userMessage = 'Failed to fetch GitHub statistics'
    
    if (isAuth) {
      statusCode = 401
      userMessage = 'GitHub authentication failed - check your token'
    } else if (isRateLimit) {
      statusCode = 429
      userMessage = 'GitHub rate limit exceeded - try again later'
    }
    
    return res.status(statusCode).json({
      error: userMessage,
      details: errorMessage,
      timestamp: new Date().toISOString()
    })
  }
}