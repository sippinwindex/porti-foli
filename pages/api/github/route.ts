import { NextRequest, NextResponse } from 'next/server'
import { githubAPI } from '@/lib/github-api'

export async function GET(request: NextRequest) {
  try {
    // Early return if GitHub API is not available (during build or missing tokens)
    if (typeof window === 'undefined' && !process.env.GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub API not configured' },
        { status: 503 }
      )
    }

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
      case 'repos': {
        const repos = await githubAPI.getRepositories({
          sort: 'updated',
          direction: 'desc',
          per_page: 20
        })
        
        return NextResponse.json(repos || [], {
          headers: {
            'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
          },
        })
      }

      case 'user': {
        const user = await githubAPI.getUser()
        
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          )
        }
        
        return NextResponse.json(user, {
          headers: {
            'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
          },
        })
      }

      case 'stats': {
        const stats = await githubAPI.getGitHubStats()
        
        return NextResponse.json(stats || {
          totalRepositories: 0,
          totalStars: 0,
          totalForks: 0,
          languages: {},
          recentActivity: {
            totalCommits: 0,
            lastWeekCommits: 0,
            activeRepositories: 0
          }
        }, {
          headers: {
            'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
          },
        })
      }

      case 'featured': {
        try {
          // Try search method first
          const featured = await githubAPI.searchRepositories('', {
            sort: 'stars',
            order: 'desc',
            per_page: 6
          })
          
          return NextResponse.json(featured || [], {
            headers: {
              'Cache-Control': 's-maxage=600, stale-while-revalidate=1200',
            },
          })
        } catch (searchError) {
          console.warn('Search failed, falling back to regular repos:', searchError)
          
          // Fallback to regular repos and sort by stars
          const repos = await githubAPI.getRepositories({
            sort: 'updated',
            direction: 'desc',
            per_page: 20
          })
          
          const sortedByStars = (repos || [])
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6)
          
          return NextResponse.json(sortedByStars, {
            headers: {
              'Cache-Control': 's-maxage=600, stale-while-revalidate=1200',
            },
          })
        }
      }

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter. Use: repos, user, stats, or featured' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('GitHub API Error:', error)
    
    // Don't expose sensitive error details in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return NextResponse.json(
      {
        error: 'Failed to fetch GitHub data',
        message: isDevelopment && error instanceof Error ? error.message : 'Service temporarily unavailable'
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