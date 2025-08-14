// app/api/github/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  archived: boolean
  fork: boolean
}

interface GitHubUser {
  login: string
  id: number
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  avatar_url: string
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'sippinwindex'

async function fetchFromGitHub(endpoint: string) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Portfolio-App/1.0.0'
    }
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}

export async function GET(request: NextRequest) {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'repos'
    
    console.log(`🔄 GitHub API request: ${type}`)
    
    switch (type) {
      case 'repos':
      case 'featured': {
        const repos: GitHubRepository[] = await fetchFromGitHub(
          `/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=50&type=owner`
        )
        
        // Filter out forks and archived repos, focus on portfolio-worthy projects
        const portfolioRepos = repos.filter(repo => 
          !repo.fork && 
          !repo.archived && 
          repo.description && 
          !repo.name.match(/^(dotfiles|config|\.github)$/i)
        ).slice(0, type === 'featured' ? 6 : 20)

        console.log(`✅ Found ${portfolioRepos.length} repositories`)
        
        return NextResponse.json(portfolioRepos, {
          headers: {
            'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
          },
        })
      }

      case 'user': {
        const user: GitHubUser = await fetchFromGitHub(`/users/${GITHUB_USERNAME}`)
        
        console.log(`✅ Found user: ${user.name}`)
        
        return NextResponse.json(user, {
          headers: {
            'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
          },
        })
      }

      case 'stats': {
        const [user, repos] = await Promise.all([
          fetchFromGitHub(`/users/${GITHUB_USERNAME}`),
          fetchFromGitHub(`/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner`)
        ])

        const portfolioRepos = repos.filter((repo: GitHubRepository) => 
          !repo.fork && !repo.archived
        )

        const totalStars = portfolioRepos.reduce(
          (sum: number, repo: GitHubRepository) => sum + repo.stargazers_count, 
          0
        )
        const totalForks = portfolioRepos.reduce(
          (sum: number, repo: GitHubRepository) => sum + repo.forks_count, 
          0
        )

        const languages: Record<string, number> = {}
        portfolioRepos.forEach((repo: GitHubRepository) => {
          if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1
          }
        })

        const stats = {
          totalRepositories: user.public_repos,
          totalStars,
          totalForks,
          languages,
          recentActivity: {
            totalCommits: 0,
            lastWeekCommits: 0,
            activeRepositories: portfolioRepos.filter((repo: GitHubRepository) => {
              const lastWeek = new Date()
              lastWeek.setDate(lastWeek.getDate() - 7)
              return new Date(repo.pushed_at) > lastWeek
            }).length
          }
        }

        console.log(`✅ Stats: ${stats.totalStars} stars, ${stats.totalForks} forks`)
        
        return NextResponse.json(stats, {
          headers: {
            'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
          },
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: repos, user, stats, or featured' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('❌ GitHub API Error:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to fetch GitHub data',
        message: error instanceof Error ? error.message : 'Service temporarily unavailable'
      },
      { status: 500 }
    )
  }
}