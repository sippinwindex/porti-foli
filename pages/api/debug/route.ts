// app/api/debug/route.ts
import { NextResponse } from 'next/server'

interface GitHubUser {
  name: string
  public_repos: number
  followers: number
  login: string
}

export async function GET() {
  const envVars = {
    GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
    GITHUB_USERNAME: process.env.NEXT_PUBLIC_GITHUB_USERNAME,
    VERCEL_TOKEN: !!process.env.VERCEL_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL
  }

  try {
    // Test GitHub API call
    const githubResponse = await fetch('https://api.github.com/users/sippinwindex', {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Portfolio-Debug/1.0.0'
      }
    })

    const githubStatus = {
      ok: githubResponse.ok,
      status: githubResponse.status,
      statusText: githubResponse.statusText
    }

    let githubData: GitHubUser | null = null
    if (githubResponse.ok) {
      githubData = await githubResponse.json() as GitHubUser
    }

    return NextResponse.json({
      environment: envVars,
      github: {
        status: githubStatus,
        userData: githubData ? {
          name: githubData.name,
          public_repos: githubData.public_repos,
          followers: githubData.followers
        } : null
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      environment: envVars,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}