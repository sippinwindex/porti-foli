// pages/api/test.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ 
    message: '✅ API Routes are working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    env: {
      hasGitHubToken: !!process.env.GITHUB_TOKEN,
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL
    }
  })
}