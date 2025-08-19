// pages/api/test.ts - Clean, no duplicates
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const envVars = {
    hasGitHubToken: !!process.env.GITHUB_TOKEN,
    githubTokenLength: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0,
    githubUsername: process.env.GITHUB_USERNAME || 'sippinwindex',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'development'
  }

  return res.status(200).json({
    message: 'API is working! 🚀',
    environment: envVars,
    timestamp: new Date().toISOString(),
    status: 'healthy'
  })
}