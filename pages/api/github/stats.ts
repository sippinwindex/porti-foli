// pages/api/github/stats.ts - FIX
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedGitHubStats } from '@/lib/github-api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  
  if (!GITHUB_TOKEN) {
    console.error('❌ No GitHub token found')
    // Return fallback data instead of error
    return res.status(200).json({
      success: true,
      stats: {
        repositories: 0,
        totalStars: 0,
        totalForks: 0,
        languageStats: {},
        user: null,
        recentActivity: {
          lastCommit: new Date().toISOString(),
          commitsThisMonth: 0
        }
      },
      timestamp: new Date().toISOString()
    })
  }

  try {
    const stats = await getCachedGitHubStats('sippinwindex')
    
    // Ensure repositories is a number
    const formattedStats = {
      ...stats,
      repositories: typeof stats.repositories === 'number' 
        ? stats.repositories 
        : Array.isArray(stats.repositories)
          ? stats.repositories.length
          : 0
    }
    
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
    
    return res.status(200).json({
      success: true,
      stats: formattedStats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ GitHub Stats API Error:', error)
    
    // Return fallback data instead of error
    return res.status(200).json({
      success: true,
      stats: {
        repositories: 0,
        totalStars: 0,
        totalForks: 0,
        languageStats: {},
        user: null,
        recentActivity: {
          lastCommit: new Date().toISOString(),
          commitsThisMonth: 0
        }
      },
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}