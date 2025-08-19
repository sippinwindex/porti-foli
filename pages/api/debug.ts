// pages/api/debug.ts - Clean debug endpoint
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const debugInfo = {
    environment: {
      hasGitHubToken: !!process.env.GITHUB_TOKEN,
      githubTokenLength: process.env.GITHUB_TOKEN?.length || 0,
      githubTokenPrefix: process.env.GITHUB_TOKEN?.substring(0, 10) || 'none',
      githubUsername: process.env.GITHUB_USERNAME || 'sippinwindex',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || 'development',
    },
    api: {
      '/api/test': 'Basic API test',
      '/api/debug': 'This debug endpoint',
      '/api/github?type=user': 'GitHub user data',
      '/api/github/repositories': 'GitHub repositories',
      '/api/github/stats': 'GitHub statistics',
      '/api/projects': 'Portfolio projects (mock data)',
      '/api/portfolio-stats': 'Portfolio statistics'
    },
    nextSteps: [
      '1. Ensure GITHUB_TOKEN is set in environment',
      '2. Test each API endpoint',
      '3. Update hooks to use correct endpoints',
      '4. Test frontend components',
      '5. Deploy to Vercel'
    ],
    timestamp: new Date().toISOString()
  }

  return res.status(200).json(debugInfo)
}