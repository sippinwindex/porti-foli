import { NextRequest, NextResponse } from 'next/server'
// FIX: The searchRepositories method is what we need for sorting by stars.
import { githubAPI } from '@/lib/github-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'repos'
    
    const userAgent = request.headers.get('user-agent') || ''
    const isBot = /bot|crawler|spider/i.test(userAgent)
    
    if (isBot) {
      return NextResponse.json(
        { error: 'Bots are not allowed to access this endpoint' },
        { status: 403 }
      )
    }

    switch (type) {
      case 'repos':
        const repos = await githubAPI.getRepositories({
          sort: 'updated',
          direction: 'desc',
          per_page: 20
        })
        
        return NextResponse.json(repos, {
          headers: {
            'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
          },
        })

      case 'user':
        const user = await githubAPI.getUser()
        
        return NextResponse.json(user, {
          headers: {
            'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
          },
        })

      case 'stats':
        const stats = await githubAPI.getGitHubStats()
        
        return NextResponse.json(stats, {
          headers: {
            'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
          },
        })

      case 'featured':
        // FIX: Use the searchRepositories method which allows sorting by stars.
        // We pass an empty query to search all repos belonging to the user.
        const featured = await githubAPI.searchRepositories('', {
          sort: 'stars',
          order: 'desc',
          per_page: 6
        })
        
        return NextResponse.json(featured, {
          headers: {
            'Cache-Control': 's-maxage=600, stale-while-revalidate=1200',
          },
        })

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('GitHub API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch GitHub data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}