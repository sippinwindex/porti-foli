// lib/vercel-api.ts - COMPLETE Vercel API integration
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
    console.log('🔧 Vercel not configured - skipping Vercel projects')
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
      console.error(`❌ Vercel API error: ${response.status} - ${errorText}`)
      return []
    }

    const data = await response.json()
    const projects: VercelProject[] = data.projects || []
    
    console.log(`📦 Found ${projects.length} Vercel projects`)
    
    // Debug: Log project names
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name} (ID: ${project.id})`)
    })
    
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

        const projectWithStatus: ProjectWithStatus = {
          project,
          status: deployment || undefined,
          liveUrl,
          isLive,
          lastDeployment: deployment || undefined
        }

        console.log(`📊 ${project.name}: ${isLive ? '🟢 Live' : '🔴 Not Live'} ${liveUrl ? `(${liveUrl})` : ''}`)

        return projectWithStatus
      })

      const batchResults = await Promise.all(statusPromises)
      projectsWithStatus.push(...batchResults)
      
      // Small delay between batches to be nice to the API
      if (i + batchSize < projects.length) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    const liveProjectsCount = projectsWithStatus.filter(p => p.isLive).length
    console.log(`✅ Processed ${projectsWithStatus.length} Vercel projects, ${liveProjectsCount} are live`)
    
    return projectsWithStatus
  } catch (error) {
    console.error('❌ Error fetching projects with status:', error)
    return []
  }
}

// ENHANCED: Match GitHub repo with Vercel project using multiple strategies
export function matchGitHubRepoWithVercel(
  repoName: string, 
  vercelProjects: ProjectWithStatus[]
): ProjectWithStatus | undefined {
  if (!vercelProjects || vercelProjects.length === 0) {
    return undefined
  }

  console.log(`🔍 Matching GitHub repo "${repoName}" with ${vercelProjects.length} Vercel projects...`)
  
  // Strategy 1: Exact name match (case-insensitive)
  let match = vercelProjects.find(vp => 
    vp.project.name.toLowerCase() === repoName.toLowerCase()
  )
  
  if (match) {
    console.log(`✅ Exact match: ${repoName} → ${match.project.name}`)
    return match
  }
  
  // Strategy 2: Remove common prefixes/suffixes and try again
  const cleanRepoName = repoName
    .replace(/^(my-|the-|a-)/i, '') // Remove common prefixes
    .replace(/-?(app|project|website|site|portfolio|demo)$/i, '') // Remove common suffixes
  
  if (cleanRepoName !== repoName) {
    match = vercelProjects.find(vp => 
      vp.project.name.toLowerCase() === cleanRepoName.toLowerCase()
    )
    
    if (match) {
      console.log(`✅ Clean name match: ${repoName} → ${match.project.name} (via "${cleanRepoName}")`)
      return match
    }
  }
  
  // Strategy 3: Partial matches (contains)
  match = vercelProjects.find(vp => {
    const projectName = vp.project.name.toLowerCase()
    const repoLower = repoName.toLowerCase()
    
    return projectName.includes(repoLower) || repoLower.includes(projectName)
  })
  
  if (match) {
    console.log(`✅ Partial match: ${repoName} → ${match.project.name}`)
    return match
  }
  
  // Strategy 4: GitHub repo link match
  match = vercelProjects.find(vp => 
    vp.project.link?.repo?.toLowerCase() === repoName.toLowerCase()
  )
  
  if (match) {
    console.log(`✅ GitHub link match: ${repoName} → ${match.project.name}`)
    return match
  }
  
  // Strategy 5: Fuzzy matching with common transformations
  const repoTransforms = [
    repoName.replace(/-/g, ''), // Remove dashes
    repoName.replace(/_/g, ''), // Remove underscores  
    repoName.replace(/[-_]/g, ''), // Remove all separators
    repoName.replace(/[-_]/g, '-'), // Normalize to dashes
  ]
  
  for (const transform of repoTransforms) {
    match = vercelProjects.find(vp => 
      vp.project.name.toLowerCase() === transform.toLowerCase()
    )
    
    if (match) {
      console.log(`✅ Transform match: ${repoName} → ${match.project.name} (via "${transform}")`)
      return match
    }
  }
  
  console.log(`⚠️ No match found for: ${repoName}`)
  return undefined
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
      'railway.app',
      'render.com',
      'fly.dev'
    ]
    
    const isDeploymentPlatform = deploymentPlatforms.some(platform => hostname.includes(platform))
    const isNotGitHub = !hostname.includes('github.com')
    
    return isDeploymentPlatform || (isNotGitHub && !hostname.includes('localhost'))
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

// Debug function to test Vercel integration
async function debugVercelIntegration() {
  console.log('🔧 DEBUG: Testing Vercel integration...')
  console.log(`🔑 Vercel token present: ${!!VERCEL_TOKEN}`)
  
  if (!VERCEL_TOKEN) {
    console.log('❌ No Vercel token - integration disabled')
    return { success: false, reason: 'No token' }
  }
  
  try {
    const projects = await fetchVercelProjects()
    console.log(`📊 Debug results: ${projects.length} projects found`)
    
    // Test fetching status for first project
    if (projects.length > 0) {
      const firstProject = projects[0]
      console.log(`🧪 Testing deployment fetch for: ${firstProject.name}`)
      const deployment = await fetchLatestDeployment(firstProject.id)
      console.log(`📦 Deployment result:`, {
        found: !!deployment,
        state: deployment?.state,
        url: deployment?.url
      })
    }
    
    return { success: true, projects: projects.length }
  } catch (error) {
    console.error('❌ Debug error:', error)
    return { success: false, reason: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Export functions
export {
  fetchVercelProjects,
  fetchLatestDeployment,
  fetchProjectsWithStatus,
  isVercelAvailable,
  getLiveUrl,
  isValidDeploymentUrl,
  debugVercelIntegration
}