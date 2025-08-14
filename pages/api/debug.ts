// pages/api/debug.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check environment variables
  const env = {
    hasGitHubToken: !!process.env.GITHUB_TOKEN,
    hasGitHubUsername: !!process.env.GITHUB_USERNAME,
    hasVercelToken: !!process.env.VERCEL_TOKEN,
    hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    vercelEnv: process.env.VERCEL_ENV,
  }

  // Test GitHub token (safely, without exposing it)
  let tokenStatus = 'Not configured'
  if (process.env.GITHUB_TOKEN) {
    const token = process.env.GITHUB_TOKEN
    if (token.startsWith('github_pat_') || token.startsWith('ghp_')) {
      tokenStatus = `Configured (${token.slice(0, 10)}...)`
    } else {
      tokenStatus = 'Invalid format'
    }
  }

  res.status(200).json({
    message: '🐛 Debug Information',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: {
      host: req.headers.host,
      'user-agent': req.headers['user-agent']?.slice(0, 50),
      origin: req.headers.origin,
    },
    env,
    github: {
      tokenStatus,
      username: process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'sippinwindex',
    },
    apis: {
      testEndpoint: '/api/test',
      githubUserEndpoint: '/api/github?type=user',
      githubReposEndpoint: '/api/github?type=repos',
      projectsEndpoint: '/api/projects',
    },
    tips: [
      'Check if your GitHub token has the right permissions',
      'Make sure GITHUB_TOKEN is set in Vercel environment variables',
      'Test the API endpoints directly in your browser',
      'Check the Vercel Function logs for any errors',
    ]
  })
}