// app/api/test/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: '✅ API Routes are working!',
    timestamp: new Date().toISOString(),
    env: {
      hasGitHubToken: !!process.env.GITHUB_TOKEN,
      nodeEnv: process.env.NODE_ENV
    }
  })
}