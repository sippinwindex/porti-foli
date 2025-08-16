// pages/api/github/stats.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createGitHubAPI } from '@/lib/github-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('🔄 GitHub Stats API called')

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
    // Create GitHub API instance with server-side token
    const githubAPI = createGitHubAPI(GITHUB_TOKEN)
    
    console.log('🔄 Fetching GitHub stats...')
    
    // Get user and repository stats
    const [user, repositories] = await Promise.all([
      githubAPI.getUser(),
      githubAPI.getRepositories({ per_page: 100 })
    ])

    if (!user) {
      throw new Error('Failed to fetch user data')
    }

    // Calculate stats
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)
    
    // Language distribution
    const languages: Record<string, number> = {}
    repositories.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentRepos = repositories.filter(repo => 
      new Date(repo.pushed_at) > thirtyDaysAgo
    )

    const stats = {
      user: {
        login: user.login,
        name: user.name,
        bio: user.bio,
        location: user.location,
        company: user.company,
        blog: user.blog,
        avatar_url: user.avatar_url,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        created_at: user.created_at
      },
      repositories: {
        total: user.public_repos,
        analyzed: repositories.length,
        total_stars: totalStars,
        total_forks: totalForks,
        languages,
        recent_activity: {
          active_repos_30_days: recentRepos.length,
          most_recent_push: repositories.length > 0 ? repositories[0].pushed_at : null
        }
      },
      portfolio: {
        featured_repos: repositories.filter(repo => 
          repo.stargazers_count > 0 || 
          new Date(repo.updated_at) > thirtyDaysAgo
        ).length,
        top_language: Object.keys(languages).reduce((a, b) => 
          languages[a] > languages[b] ? a : b, 
          Object.keys(languages)[0] || 'JavaScript'
        )
      }
    }

    console.log(`✅ Successfully calculated GitHub stats:`, {
      repos: stats.repositories.total,
      stars: stats.repositories.total_stars,
      forks: stats.repositories.total_forks
    })

    // Set cache headers (cache for 1 hour)
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
    
    return res.status(200).json({
      ...stats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ GitHub Stats API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isRateLimit = errorMessage.includes('rate limit') || errorMessage.includes('403')
    const isAuth = errorMessage.includes('401') || errorMessage.includes('Bad credentials')
    
    let statusCode = 500
    let userMessage = 'Failed to fetch GitHub stats'
    
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