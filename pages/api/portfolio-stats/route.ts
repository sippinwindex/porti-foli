// app/api/portfolio-stats/route.ts
import { NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'sippinwindex'

async function fetchFromGitHub(endpoint: string) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}

export async function GET() {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 503 }
      )
    }

    console.log('🔄 Calculating portfolio stats...')

    const [user, repos] = await Promise.all([
      fetchFromGitHub(`/users/${GITHUB_USERNAME}`),
      fetchFromGitHub(`/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner`)
    ])

    const portfolioRepos = repos.filter((repo: any) => 
      !repo.fork && !repo.archived && repo.description
    )

    const totalStars = portfolioRepos.reduce(
      (sum: number, repo: any) => sum + repo.stargazers_count, 
      0
    )
    const totalForks = portfolioRepos.reduce(
      (sum: number, repo: any) => sum + repo.forks_count, 
      0
    )

    // Calculate language distribution
    const languages: Record<string, number> = {}
    portfolioRepos.forEach((repo: any) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })

    // Convert to percentages
    const totalRepos = Object.values(languages).reduce((sum: number, count: number) => sum + count, 0)
    const languageStats: Record<string, number> = {}
    Object.entries(languages).forEach(([lang, count]: [string, number]) => {
      languageStats[lang] = Math.round((count / totalRepos) * 100)
    })

    // Calculate category distribution
    const categoryStats: Record<string, number> = {}
    portfolioRepos.forEach((repo: any) => {
      const category = determineCategory(repo.language, repo.topics || [])
      categoryStats[category] = (categoryStats[category] || 0) + 1
    })

    // Featured projects (high stars or recent activity)
    const featuredProjects = portfolioRepos.filter((repo: any) => 
      repo.stargazers_count > 0 || repo.forks_count > 0
    ).length

    // Live projects (have homepage)
    const liveProjects = portfolioRepos.filter((repo: any) => 
      repo.homepage && repo.homepage.trim()
    ).length

    // Recent activity
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    const activeProjects = portfolioRepos.filter((repo: any) => 
      new Date(repo.pushed_at) > lastWeek
    ).length

    const stats = {
      totalProjects: portfolioRepos.length,
      featuredProjects,
      liveProjects,
      totalStars,
      totalForks,
      languageStats,
      categoryStats,
      deploymentStats: {
        successful: liveProjects,
        failed: 0,
        building: 0,
        pending: portfolioRepos.length - liveProjects
      },
      recentActivity: {
        lastCommit: portfolioRepos[0]?.pushed_at || new Date().toISOString(),
        lastDeployment: new Date().toISOString(),
        activeProjects
      }
    }

    console.log(`✅ Stats calculated: ${stats.totalStars} stars, ${stats.totalProjects} projects`)

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    })

  } catch (error) {
    console.error('❌ Portfolio stats error:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to calculate portfolio stats',
        message: error instanceof Error ? error.message : 'Service temporarily unavailable'
      },
      { status: 500 }
    )
  }
}

function determineCategory(language: string | null, topics: string[]): string {
  if (topics.includes('mobile') || topics.includes('react-native')) return 'mobile'
  if (topics.includes('data') || topics.includes('machine-learning')) return 'data'
  if (topics.includes('backend') || topics.includes('api') || language === 'Python') return 'backend'
  if (topics.includes('frontend') || language === 'JavaScript') return 'frontend'
  if (topics.includes('fullstack') || language === 'TypeScript') return 'fullstack'
  return 'other'
}