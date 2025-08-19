// pages/api/portfolio-stats.ts - Fixed with proper types
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCachedGitHubStats } from '@/lib/github-api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('📊 Portfolio Stats API called')
  
  try {
    // Default fallback stats with proper types
    let stats = {
      totalProjects: 25,
      totalStars: 150,
      liveProjects: 12,
      totalForks: 45,
      topLanguages: ['TypeScript', 'JavaScript', 'Python'] as string[],
      recentActivity: {
        activeProjects: 8,
        lastUpdated: new Date().toISOString()
      }
    }

    // Try to get real GitHub stats first
    try {
      console.log('🔄 Fetching GitHub stats...')
      const githubStats = await getCachedGitHubStats('sippinwindex')
      
      // Calculate portfolio stats from GitHub data with proper type casting
      const languageEntries = Object.entries(githubStats.languageStats || {})
      const topLanguages = languageEntries
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([lang]) => lang) as string[]

      stats = {
        totalProjects: typeof githubStats.repositories === 'number' 
          ? githubStats.repositories 
          : Array.isArray(githubStats.repositories) 
            ? githubStats.repositories.length 
            : 0,
        totalStars: githubStats.totalStars || 0,
        liveProjects: Math.floor((githubStats.totalStars || 0) / 3), // Estimate based on stars
        totalForks: githubStats.totalForks || 0,
        topLanguages: topLanguages.length > 0 ? topLanguages : ['TypeScript', 'JavaScript', 'Python'],
        recentActivity: {
          activeProjects: githubStats.recentActivity?.activeProjects || 0,
          lastUpdated: new Date().toISOString()
        }
      }
      
      console.log('✅ GitHub stats integrated successfully')
      
    } catch (githubError) {
      console.warn('⚠️ GitHub stats failed, trying projects API fallback...', githubError)
      
      // Always try projects API as fallback (using your mock data)
      try {
        const baseUrl = req.headers.origin || 
                       (req.headers.host?.includes('localhost') ? 'http://localhost:3000' : `https://${req.headers.host}`)
        
        const projectsResponse = await fetch(`${baseUrl}/api/projects`)
        
        if (projectsResponse.ok) {
          const { projects } = await projectsResponse.json()
          console.log(`📈 Calculating stats from ${projects.length} projects`)
          
          // Extract tech stack and ensure it's string[]
          const allTechStack = projects.flatMap((p: any) => p.techStack || [])
          const uniqueTechStack = [...new Set(allTechStack)].filter((tech): tech is string => 
            typeof tech === 'string'
          )
          
          // Calculate stats from your mock projects
          stats = {
            totalProjects: projects.length,
            totalStars: projects.reduce((sum: number, project: any) => 
              sum + (project.github?.stars || 0), 0),
            liveProjects: projects.filter((project: any) => 
              project.vercel?.isLive || project.liveUrl).length,
            totalForks: projects.reduce((sum: number, project: any) => 
              sum + (project.github?.forks || 0), 0),
            topLanguages: uniqueTechStack.slice(0, 5),
            recentActivity: {
              activeProjects: projects.filter((project: any) => project.featured).length,
              lastUpdated: new Date().toISOString()
            }
          }
          
          console.log('✅ Projects API used successfully')
        }
      } catch (projectsError) {
        console.warn('⚠️ Projects API failed, using default stats:', projectsError)
      }
    }
    
    console.log('✅ Portfolio stats calculated:', {
      totalProjects: stats.totalProjects,
      totalStars: stats.totalStars,
      activeProjects: stats.recentActivity.activeProjects
    })
    
    // Set cache headers for performance
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600')
    
    return res.status(200).json(stats)
    
  } catch (error) {
    console.error('❌ Portfolio Stats API Error:', error)
    
    // Always return some data, even if there's an error - with proper types
    return res.status(200).json({
      totalProjects: 25,
      totalStars: 150,
      liveProjects: 12,
      totalForks: 45,
      topLanguages: ['TypeScript', 'JavaScript', 'Python'] as string[],
      recentActivity: {
        activeProjects: 8,
        lastUpdated: new Date().toISOString()
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}