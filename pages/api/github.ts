// pages/api/github.ts
import type { NextApiRequest, NextApiResponse } from 'next'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = 'sippinwindex'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('🔄 GitHub API called')

  if (!GITHUB_TOKEN) {
    console.error('❌ No GitHub token found')
    return res.status(503).json({ error: 'GitHub token not configured' })
  }

  try {
    const { type = 'user' } = req.query
    
    console.log(`🔄 Fetching GitHub ${type}...`)
    
    if (type === 'user') {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Portfolio/1.0.0'
        }
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const userData = await response.json()
      console.log('✅ GitHub user data fetched:', userData.name)
      
      return res.status(200).json(userData)
    }
    
    if (type === 'repos' || type === 'featured') {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20&type=owner`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Portfolio/1.0.0'
        }
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const reposData = await response.json()
      
      // Filter out forks and archived repos
      const filteredRepos = reposData.filter((repo: any) => 
        !repo.fork && !repo.archived && repo.description
      )
      
      console.log(`✅ GitHub repos fetched: ${filteredRepos.length}`)
      
      return res.status(200).json(filteredRepos)
    }

    return res.status(400).json({ error: 'Invalid type parameter. Use: user, repos, or featured' })
    
  } catch (error) {
    console.error('❌ GitHub API Error:', error)
    return res.status(500).json({
      error: 'Failed to fetch GitHub data',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}