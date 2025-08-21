// lib/vercel-api.ts - FIXED: Complete Vercel API integration
import { unstable_cache } from 'next/cache'

export interface VercelProject {
  id: string
  name: string
  accountId: string
  createdAt: number
  updatedAt: number
  framework?: string | null
  link?: {
    type: string
    repo: string
    repoId: number
    org?: string
  }
  targets?: {
    production?: {
      id: string
      domain: string
      url: string
    }
  }
}

export interface VercelDeployment {
  uid: string
  name: string
  url: string
  created: number
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  type: 'LAMBDAS'
  readyState: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  target: 'production' | 'staging' | null
  meta: Record<string, any>
  creator: {
    uid: string
    email?: string
    username?: string
  }
  inspectorUrl: string | null
  projectId: string
  buildingAt?: number
  readyAt?: number
}

export interface ProjectWithStatus {
  project: VercelProject
  status?: VercelDeployment
  liveUrl?: string
  isLive: boolean
  lastDeployment?: VercelDeployment
}

// Vercel API configuration
const VERCEL_API_BASE = 'https://api.vercel.com'
const VERCEL_TOKEN = process.env.VERCEL_TOKEN

// Headers for Vercel API requests
const getHeaders = () => {
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  
  if (VERCEL_TOKEN) {
    headers['Authorization'] = `Bearer ${VERCEL_TOKEN}`
  }
  
  return headers
}

// Check if Vercel integration is available
function isVercelAvailable(): boolean {
  if (!VERCEL_TOKEN) {
    console.warn('⚠️ Vercel token not found - deployment status will be unavailable')
    return false
  }
  return true
}

// Fetch Vercel projects
async function fetchVercelProjects(): Promise<VercelProject[]> {
  if (!isVercelAvailable()) {
    return []
  }

  try {
    console.log('🔄 Fetching Vercel projects...')
    
    const response = await fetch(`${VERCEL_API_BASE}/v9/projects`, {
      headers: getHeaders(),
      next: { revalidate: 1800 } // Cache for 30 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Vercel API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const projects: VercelProject[] = data.projects || []
    
    console.log(`📦 Found ${projects.length} Vercel projects`)
    return projects
  } catch (error) {
    console.error('❌ Error fetching Vercel projects:', error)
    return []
  }
}

// Fetch latest deployment for a project
async function fetchLatestDeployment(projectId: string): Promise<VercelDeployment | null> {
  if (!isVercelAvailable()) {
    return null
  }

  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v6/deployments?projectId=${projectId}&limit=1`,
      {
        headers: getHeaders(),
        next: { revalidate: 900 } // Cache for 15 minutes
      }
    )

    if (!response.ok) {
      console.warn(`⚠️ Could not fetch deployments for project ${projectId}: ${response.status}`)
      return null
    }

    const data = await response.json()
    const deployments: VercelDeployment[] = data.deployments || []
    
    return deployments[0] || null
  } catch (error) {
    console.error(`❌ Error fetching deployment for project ${projectId}:`, error)
    return null
  }
}

// Get live URL for a deployment
function getLiveUrl(deployment: VercelDeployment): string {
  // Try alias first, then fallback to deployment URL
  if (deployment.meta?.alias) {
    return `https://${deployment.meta.alias}`
  }
  return `https://${deployment.url}`
}

// Fetch projects with their deployment status
async function fetchProjectsWithStatus(): Promise<ProjectWithStatus[]> {
  try {
    console.log('🔄 Fetching Vercel projects with deployment status...')
    
    const projects = await fetchVercelProjects()
    
    if (projects.length === 0) {
      console.log('📝 No Vercel projects found or Vercel not configured')
      return []
    }

    const projectsWithStatus: ProjectWithStatus[] = []

    // Fetch deployment status for each project (in batches to avoid rate limits)
    const batchSize = 5
    for (let i = 0; i < projects.length; i += batchSize) {
      const batch = projects.slice(i, i + batchSize)
      
      const statusPromises = batch.map(async (project) => {
        const deployment = await fetchLatestDeployment(project.id)
        
        let liveUrl: string | undefined
        let isLive = false
        
        if (deployment) {
          isLive = deployment.state === 'READY'
          if (isLive) {
            liveUrl = getLiveUrl(deployment)
          }
        }

        return {
          project,
          status: deployment || undefined,
          liveUrl,
          isLive,
          lastDeployment: deployment || undefined
        }
      })

      const batchResults = await Promise.all(statusPromises)
      projectsWithStatus.push(...batchResults)
      
      // Small delay between batches to be nice to the API
      if (i + batchSize < projects.length) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    const liveProjectsCount = projectsWithStatus.filter(p => p.isLive).length
    console.log(`✅ Processed ${projectsWithStatus.length} projects, ${liveProjectsCount} live`)
    
    return projectsWithStatus
  } catch (error) {
    console.error('❌ Error fetching projects with status:', error)
    return []
  }
}

// Match GitHub repo with Vercel project
export function matchGitHubRepoWithVercel(
  repoName: string, 
  vercelProjects: ProjectWithStatus[]
): ProjectWithStatus | undefined {
  // Try exact name match first
  let match = vercelProjects.find(vp => 
    vp.project.name.toLowerCase() === repoName.toLowerCase()
  )
  
  if (match) return match
  
  // Try partial matches
  match = vercelProjects.find(vp => 
    vp.project.name.toLowerCase().includes(repoName.toLowerCase()) ||
    repoName.toLowerCase().includes(vp.project.name.toLowerCase())
  )
  
  if (match) return match
  
  // Try matching GitHub repo link
  match = vercelProjects.find(vp => 
    vp.project.link?.repo?.toLowerCase() === repoName.toLowerCase()
  )
  
  return match
}

// Get deployment URL priority order
export function getDeploymentUrl(
  vercelProject?: ProjectWithStatus,
  githubHomepage?: string | null
): string | undefined {
  // Priority 1: Live Vercel deployment
  if (vercelProject?.isLive && vercelProject.liveUrl) {
    return vercelProject.liveUrl
  }
  
  // Priority 2: Vercel production target
  if (vercelProject?.project.targets?.production?.url) {
    return `https://${vercelProject.project.targets.production.url}`
  }
  
  // Priority 3: GitHub homepage (might be deployment)
  if (githubHomepage && isValidDeploymentUrl(githubHomepage)) {
    return githubHomepage
  }
  
  return undefined
}

// Check if URL looks like a deployment (not just GitHub repo)
function isValidDeploymentUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()
    
    // Known deployment platforms
    const deploymentPlatforms = [
      'vercel.app',
      'netlify.app',
      'herokuapp.com',
      'github.io',
      'surge.sh',
      'firebase.app',
      'web.app',
      'railway.app'
    ]
    
    return deploymentPlatforms.some(platform => hostname.includes(platform)) ||
           !hostname.includes('github.com') // Not a GitHub repo URL
  } catch {
    return false
  }
}

// Cached version for better performance
export const getCachedProjectsWithStatus = unstable_cache(
  fetchProjectsWithStatus,
  ['vercel-projects-status'],
  {
    tags: ['vercel-projects'],
    revalidate: 1800 // 30 minutes
  }
)

// Export functions
export {
  fetchVercelProjects,
  fetchLatestDeployment,
  fetchProjectsWithStatus,
  isVercelAvailable,
  getLiveUrl,
  isValidDeploymentUrl
}