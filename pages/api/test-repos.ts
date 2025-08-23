// pages/api/test-repos.ts - Test API to see ALL your repositories
import type { NextApiRequest, NextApiResponse } from 'next'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = 'sippinwindex'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('🔧 TEST: Fetching ALL GitHub repositories (no filtering)...')

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'No GitHub token' })
  }

  try {
    const allRepos: any[] = []
    let page = 1
    let hasMorePages = true

    // Fetch ALL pages without any filtering
    while (hasMorePages && page <= 20) {
      console.log(`📄 Fetching page ${page}...`)
      
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100&page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-Test'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const repos = await response.json()
      console.log(`📦 Page ${page}: Found ${repos.length} repositories`)
      
      if (repos.length === 0) {
        hasMorePages = false
      } else {
        allRepos.push(...repos)
        page++
      }
    }

    console.log(`📊 TOTAL REPOSITORIES FOUND: ${allRepos.length}`)

    // Analyze repository types
    const analysis = {
      total: allRepos.length,
      owned: allRepos.filter(r => !r.fork).length,
      forks: allRepos.filter(r => r.fork).length,
      archived: allRepos.filter(r => r.archived).length,
      private: allRepos.filter(r => r.private).length,
      public: allRepos.filter(r => !r.private).length,
      withDescription: allRepos.filter(r => r.description).length,
      withoutDescription: allRepos.filter(r => !r.description).length,
      withHomepage: allRepos.filter(r => r.homepage).length,
      withTopics: allRepos.filter(r => r.topics && r.topics.length > 0).length,
      languages: [...new Set(allRepos.map(r => r.language).filter(Boolean))],
      recentlyUpdated: allRepos.filter(r => {
        const lastUpdate = new Date(r.updated_at)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        return lastUpdate > sixMonthsAgo
      }).length
    }

    // Show first 20 repositories with details
    const sampleRepos = allRepos.slice(0, 20).map(repo => ({
      name: repo.name,
      description: repo.description || 'No description',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || 'None',
      updated: repo.updated_at,
      isArchived: repo.archived,
      isFork: repo.fork,
      isPrivate: repo.private,
      homepage: repo.homepage || 'None',
      topics: repo.topics || []
    }))

    return res.status(200).json({
      success: true,
      message: `Found ${allRepos.length} total repositories`,
      analysis,
      sampleRepositories: sampleRepos,
      recommendations: generateRecommendations(analysis),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Test API Error:', error)
    return res.status(500).json({
      error: 'Failed to fetch repositories',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

function generateRecommendations(analysis: any): string[] {
  const recommendations: string[] = []

  if (analysis.total === 0) {
    recommendations.push('❌ No repositories found - check GitHub username and token')
  } else if (analysis.total < 5) {
    recommendations.push('⚠️ Very few repositories found - are most of your repos private?')
  } else {
    recommendations.push(`✅ Found ${analysis.total} repositories - good repository count!`)
  }

  if (analysis.forks > analysis.owned) {
    recommendations.push(`📝 You have ${analysis.forks} forks vs ${analysis.owned} owned repos - forks are filtered out`)
  }

  if (analysis.archived > 0) {
    recommendations.push(`📦 ${analysis.archived} archived repos found - these may be filtered out`)
  }

  if (analysis.withoutDescription > analysis.withDescription) {
    recommendations.push(`📄 ${analysis.withoutDescription} repos have no description - add descriptions for better portfolio display`)
  }

  if (analysis.recentlyUpdated < 5) {
    recommendations.push('⏰ Few recently updated repos - consider updating or creating new projects')
  }

  return recommendations
}