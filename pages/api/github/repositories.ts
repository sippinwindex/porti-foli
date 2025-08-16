// pages/api/github/repositories.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedRepositories, GitHubRepository } from '@/lib/github-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('🔄 GitHub Repositories API called')

  // Check for GitHub token
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  if (!GITHUB_TOKEN) {
    console.error('❌ No GitHub token found in environment variables')
    return res.status(503).json({ 
      error: 'GitHub token not configured',
      details: 'GITHUB_TOKEN environment variable is missing'
    })
  }

  try {
    // FIXED: Use getCachedRepositories directly instead of createGitHubAPI
    console.log('🔄 Fetching repositories with cached function...')
    
    // Get query parameters
    const { 
      type = 'portfolio',
      limit = '20',
      sort = 'updated'
    } = req.query

    let repositories: GitHubRepository[] = []

    if (type === 'portfolio') {
      console.log('🔄 Fetching portfolio repositories...')
      // FIXED: Call getCachedRepositories directly
      const allRepos = await getCachedRepositories()
      
      // Filter for portfolio-worthy repositories
      repositories = allRepos.filter(repo => {
        // Skip if no description
        if (!repo.description) return false
        
        // Skip if less than 2 stars and not recently updated
        const isRecent = new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        if (repo.stargazers_count < 2 && !isRecent) return false
        
        // Skip common non-portfolio repos
        const skipPatterns = [
          /^dotfiles$/i,
          /^\.github$/i,
          /^config$/i,
          /test/i,
          /playground/i,
          /sandbox/i,
          /learning/i,
          /tutorial/i,
          /practice/i
        ]
        
        return !skipPatterns.some(pattern => pattern.test(repo.name))
      })
      
    } else if (type === 'all') {
      console.log('🔄 Fetching all repositories...')
      repositories = await getCachedRepositories()
      
    } else {
      return res.status(400).json({ 
        error: 'Invalid type parameter',
        details: 'Type must be "portfolio" or "all"'
      })
    }

    // Apply sorting
    if (sort === 'stars') {
      repositories.sort((a, b) => b.stargazers_count - a.stargazers_count)
    } else if (sort === 'updated') {
      repositories.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    } else if (sort === 'created') {
      repositories.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    }

    // Apply limit if specified
    const limitNum = parseInt(limit as string)
    if (limitNum > 0) {
      repositories = repositories.slice(0, limitNum)
    }

    console.log(`✅ Successfully fetched ${repositories.length} repositories`)

    // Set cache headers (cache for 30 minutes)
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
    
    return res.status(200).json({
      repositories,
      count: repositories.length,
      type,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ GitHub Repositories API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isRateLimit = errorMessage.includes('rate limit') || errorMessage.includes('403')
    const isAuth = errorMessage.includes('401') || errorMessage.includes('Bad credentials')
    
    let statusCode = 500
    let userMessage = 'Failed to fetch GitHub repositories'
    
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