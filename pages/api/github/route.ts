// app/api/github/route.ts
import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = 'sippinwindex'

export async function GET(request: NextRequest) {
  console.log('🔄 GitHub API called')
  
  if (!GITHUB_TOKEN) {
    console.error('❌ No GitHub token found')
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 503 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'user'
    
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
      console.log('✅ GitHub user data fetched')
      
      return NextResponse.json(userData)
    }
    
    if (type === 'repos' || type === 'featured') {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`, {
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
      
      return NextResponse.json(filteredRepos)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    
  } catch (error) {
    console.error('❌ GitHub API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}