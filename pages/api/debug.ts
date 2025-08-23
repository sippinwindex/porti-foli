// pages/api/debug.ts - Debug API to test integrations
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedRepositories } from '@/lib/github-api'
import { getCachedProjectsWithStatus, debugVercelIntegration } from '@/lib/vercel-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('🔧 DEBUG API: Testing all integrations...')

  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      hasGitHubToken: !!process.env.GITHUB_TOKEN,
      hasVercelToken: !!process.env.VERCEL_TOKEN,
      githubUsername: process.env.GITHUB_USERNAME || null,
      nodeEnv: process.env.NODE_ENV
    },
    github: {
      status: 'testing' as 'testing' | 'success' | 'error',
      repositoryCount: 0,
      error: null as string | null,
      sampleRepos: [] as string[]
    },
    vercel: {
      status: 'testing' as 'testing' | 'success' | 'error' | 'disabled',
      projectCount: 0,
      liveProjects: 0,
      error: null as string | null,
      sampleProjects: [] as string[]
    },
    integration: {
      status: 'testing' as 'testing' | 'success' | 'error' | 'skipped',
      matchedProjects: 0,
      unmatchedGithubRepos: [] as string[],
      unmatchedVercelProjects: [] as string[]
    }
  }

  // Test GitHub Integration
  try {
    console.log('🔄 Testing GitHub API...')
    const repositories = await getCachedRepositories()
    
    results.github.status = 'success'
    results.github.repositoryCount = repositories.length
    results.github.sampleRepos = repositories.slice(0, 5).map(repo => 
      `${repo.name} (⭐${repo.stargazers_count})`
    )
    
    console.log(`✅ GitHub: ${repositories.length} repositories found`)
  } catch (error) {
    results.github.status = 'error'
    results.github.error = error instanceof Error ? error.message : 'Unknown GitHub error'
    console.error('❌ GitHub error:', results.github.error)
  }

  // Test Vercel Integration
  try {
    console.log('🔄 Testing Vercel API...')
    const debugResult = await debugVercelIntegration()
    
    if (debugResult.success) {
      const projectsWithStatus = await getCachedProjectsWithStatus()
      
      results.vercel.status = 'success'
      results.vercel.projectCount = projectsWithStatus.length
      results.vercel.liveProjects = projectsWithStatus.filter(p => p.isLive).length
      results.vercel.sampleProjects = projectsWithStatus.slice(0, 5).map(project => 
        `${project.project.name} ${project.isLive ? '🟢' : '🔴'}`
      )
      
      console.log(`✅ Vercel: ${projectsWithStatus.length} projects found, ${results.vercel.liveProjects} live`)
    } else {
      results.vercel.status = 'disabled'
      results.vercel.error = debugResult.reason || 'Unknown reason'
      console.log(`⚠️ Vercel: ${debugResult.reason}`)
    }
  } catch (error) {
    results.vercel.status = 'error'
    results.vercel.error = error instanceof Error ? error.message : 'Unknown Vercel error'
    console.error('❌ Vercel error:', results.vercel.error)
  }

  // Test Integration Matching
  if (results.github.status === 'success' && results.vercel.status === 'success') {
    try {
      console.log('🔄 Testing GitHub-Vercel matching...')
      
      const repositories = await getCachedRepositories()
      const vercelProjects = await getCachedProjectsWithStatus()
      
      let matchedCount = 0
      const unmatchedGithub: string[] = []
      const unmatchedVercel: string[] = []
      
      // Track which Vercel projects get matched
      const matchedVercelIds = new Set<string>()
      
      // Try to match each GitHub repo
      for (const repo of repositories.slice(0, 10)) { // Test first 10 to avoid timeout
        const match = vercelProjects.find(vp => 
          vp.project.name.toLowerCase() === repo.name.toLowerCase() ||
          vp.project.name.toLowerCase().includes(repo.name.toLowerCase()) ||
          repo.name.toLowerCase().includes(vp.project.name.toLowerCase())
        )
        
        if (match) {
          matchedCount++
          matchedVercelIds.add(match.project.id)
          console.log(`✅ Match: ${repo.name} → ${match.project.name}`)
        } else {
          unmatchedGithub.push(repo.name)
        }
      }
      
      // Find unmatched Vercel projects
      vercelProjects.forEach(vp => {
        if (!matchedVercelIds.has(vp.project.id)) {
          unmatchedVercel.push(vp.project.name)
        }
      })
      
      results.integration.status = 'success'
      results.integration.matchedProjects = matchedCount
      results.integration.unmatchedGithubRepos = unmatchedGithub.slice(0, 5)
      results.integration.unmatchedVercelProjects = unmatchedVercel.slice(0, 5)
      
      console.log(`🔗 Integration: ${matchedCount} matches found`)
    } catch (error) {
      results.integration.status = 'error'
      console.error('❌ Integration error:', error)
    }
  } else {
    results.integration.status = 'skipped'
  }

  // Overall status
  const overallStatus = 
    results.github.status === 'success' && 
    (results.vercel.status === 'success' || results.vercel.status === 'disabled')
      ? 'healthy'
      : 'issues'

  console.log(`🎯 DEBUG COMPLETE: ${overallStatus.toUpperCase()}`)

  // Set no-cache headers for debug endpoint
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  
  return res.status(200).json({
    status: overallStatus,
    ...results,
    recommendations: generateRecommendations(results)
  })
}

function generateRecommendations(results: any): string[] {
  const recommendations: string[] = []

  if (!results.environment.hasGitHubToken) {
    recommendations.push('Add GITHUB_TOKEN to environment variables')
  }

  if (!results.environment.hasVercelToken) {
    recommendations.push('Add VERCEL_TOKEN to environment variables for deployment status')
  }

  if (results.github.status === 'error') {
    recommendations.push('Check GitHub token permissions (needs: public_repo, read:user)')
  }

  if (results.github.repositoryCount === 0) {
    recommendations.push('Verify GitHub username and repository visibility')
  }

  if (results.vercel.status === 'error') {
    recommendations.push('Check Vercel token validity and permissions')
  }

  if (results.integration.matchedProjects === 0 && results.github.repositoryCount > 0 && results.vercel.projectCount > 0) {
    recommendations.push('Repository and project names may not match - consider renaming for better integration')
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ All integrations are working correctly!')
  }

  return recommendations
}