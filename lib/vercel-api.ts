// lib/vercel-api.ts
export interface VercelProject {
  id: string
  name: string
  description?: string
  framework: string | null
  targets?: {
    production?: {
      id: string
      domain: string
      url: string
    }
  }
  latestDeployments?: VercelDeployment[]
  analytics?: {
    id: string
    enabledAt: number
    disabledAt?: number
  }
  env?: {
    name: string
    value: string
    target: string[]
  }[]
  gitRepository?: {
    type: 'github' | 'gitlab' | 'bitbucket'
    repo: string
    org?: string
  }
  link?: {
    type: 'github'
    repo: string
    repoId: number
    org?: string
    gitCredentialId?: string
    sourceless?: boolean
    productionBranch?: string
  }
  updatedAt: number
  createdAt: number
}

export interface VercelDeployment {
  uid: string
  name: string
  url: string
  created: number
  source: 'cli' | 'git' | 'import' | 'clone/repo'
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  readyState: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  type: 'LAMBDAS'
  creator: {
    uid: string
    email?: string
    username?: string
    githubLogin?: string
  }
  inspectorUrl: string | null
  meta?: {
    githubCommitSha?: string
    githubCommitMessage?: string
    githubCommitAuthorName?: string
    githubCommitRef?: string
    githubRepo?: string
    githubOrg?: string
  }
  target?: string | null
  aliasError?: any | null
  aliasAssigned?: number | null
  isRollbackCandidate?: boolean | null
  buildingAt?: number
  readyAt?: number
}

export interface VercelDomain {
  name: string
  apexName: string
  projectId: string
  redirect?: string | null
  redirectStatusCode?: (307 | 301 | 302 | 308) | null
  gitBranch?: string | null
  updatedAt?: number
  createdAt?: number
  verified: boolean
  verification?: {
    type: string
    domain: string
    value: string
    reason: string
  }[]
}

export interface VercelAnalytics {
  id: string
  projectId: string
  enabledAt: number
  disabledAt?: number
  hasData: boolean
}

export interface DeploymentStatus {
  url: string
  state: VercelDeployment['state']
  createdAt: number
  readyAt?: number
  buildTime?: number
  commitSha?: string
  commitMessage?: string
  branch?: string
  isProduction: boolean
}

class VercelAPI {
  private token: string
  private baseURL = 'https://api.vercel.com'

  constructor(token?: string) {
    this.token = token || process.env.VERCEL_TOKEN || ''
    if (!this.token) {
      throw new Error('Vercel token is required')
    }
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Vercel API error (${response.status}): ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      throw error
    }
  }

  async getProjects(): Promise<VercelProject[]> {
    try {
      const response = await this.fetch('/v9/projects')
      return response.projects || []
    } catch (error) {
      console.error('Error fetching Vercel projects:', error)
      return []
    }
  }

  async getProject(projectId: string): Promise<VercelProject | null> {
    try {
      const project = await this.fetch(`/v9/projects/${projectId}`)
      return project
    } catch (error) {
      console.error(`Error fetching project ${projectId}:`, error)
      return null
    }
  }

  async getProjectByName(name: string): Promise<VercelProject | null> {
    try {
      const projects = await this.getProjects()
      return projects.find(p => p.name === name) || null
    } catch (error) {
      console.error(`Error finding project ${name}:`, error)
      return null
    }
  }

  async getDeployments(projectId?: string, options: {
    limit?: number
    since?: number
    until?: number
    state?: VercelDeployment['state']
    target?: 'production' | 'staging'
  } = {}): Promise<VercelDeployment[]> {
    try {
      const params = new URLSearchParams()
      
      if (projectId) params.append('projectId', projectId)
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.since) params.append('since', options.since.toString())
      if (options.until) params.append('until', options.until.toString())
      if (options.state) params.append('state', options.state)
      if (options.target) params.append('target', options.target)

      const response = await this.fetch(`/v6/deployments?${params}`)
      return response.deployments || []
    } catch (error) {
      console.error('Error fetching deployments:', error)
      return []
    }
  }

  async getDeployment(deploymentId: string): Promise<VercelDeployment | null> {
    try {
      const deployment = await this.fetch(`/v13/deployments/${deploymentId}`)
      return deployment
    } catch (error) {
      console.error(`Error fetching deployment ${deploymentId}:`, error)
      return null
    }
  }

  async getProjectDeployments(projectId: string, options: {
    limit?: number
    target?: 'production' | 'staging'
  } = {}): Promise<VercelDeployment[]> {
    return this.getDeployments(projectId, options)
  }

  async getLatestDeployment(projectId: string, target: 'production' | 'staging' = 'production'): Promise<VercelDeployment | null> {
    try {
      const deployments = await this.getProjectDeployments(projectId, { 
        limit: 1,
        target 
      })
      return deployments[0] || null
    } catch (error) {
      console.error(`Error fetching latest deployment for ${projectId}:`, error)
      return null
    }
  }

  async getProjectDomains(projectId: string): Promise<VercelDomain[]> {
    try {
      const response = await this.fetch(`/v9/projects/${projectId}/domains`)
      return response.domains || []
    } catch (error) {
      console.error(`Error fetching domains for project ${projectId}:`, error)
      return []
    }
  }

  async getDeploymentStatus(projectId: string): Promise<DeploymentStatus | null> {
    try {
      const deployment = await this.getLatestDeployment(projectId, 'production')
      
      if (!deployment) return null

      return {
        url: `https://${deployment.url}`,
        state: deployment.state,
        createdAt: deployment.created,
        readyAt: deployment.readyAt,
        buildTime: deployment.readyAt && deployment.buildingAt 
          ? deployment.readyAt - deployment.buildingAt 
          : undefined,
        commitSha: deployment.meta?.githubCommitSha,
        commitMessage: deployment.meta?.githubCommitMessage,
        branch: deployment.meta?.githubCommitRef,
        isProduction: deployment.target === 'production',
      }
    } catch (error) {
      console.error(`Error getting deployment status for ${projectId}:`, error)
      return null
    }
  }

  async getProjectAnalytics(projectId: string): Promise<VercelAnalytics | null> {
    try {
      const response = await this.fetch(`/v1/analytics`)
      const analytics = response.analytics?.find((a: any) => a.projectId === projectId)
      return analytics || null
    } catch (error) {
      console.error(`Error fetching analytics for project ${projectId}:`, error)
      return null
    }
  }

  // Helper method to get comprehensive project information
  async getProjectInfo(projectIdOrName: string): Promise<{
    project: VercelProject | null
    latestDeployment: VercelDeployment | null
    deploymentStatus: DeploymentStatus | null
    domains: VercelDomain[]
    analytics: VercelAnalytics | null
  }> {
    try {
      // Try to get project by ID first, then by name
      let project = await this.getProject(projectIdOrName)
      if (!project) {
        project = await this.getProjectByName(projectIdOrName)
      }

      if (!project) {
        return {
          project: null,
          latestDeployment: null,
          deploymentStatus: null,
          domains: [],
          analytics: null,
        }
      }

      const [latestDeployment, deploymentStatus, domains, analytics] = await Promise.all([
        this.getLatestDeployment(project.id),
        this.getDeploymentStatus(project.id),
        this.getProjectDomains(project.id),
        this.getProjectAnalytics(project.id),
      ])

      return {
        project,
        latestDeployment,
        deploymentStatus,
        domains,
        analytics,
      }
    } catch (error) {
      console.error(`Error getting project info for ${projectIdOrName}:`, error)
      return {
        project: null,
        latestDeployment: null,
        deploymentStatus: null,
        domains: [],
        analytics: null,
      }
    }
  }

  // Get deployment logs (requires deployment ID)
  async getDeploymentLogs(deploymentId: string, direction: 'forward' | 'backward' = 'backward', limit = 100) {
    try {
      const params = new URLSearchParams({
        direction,
        limit: limit.toString(),
      })

      const response = await this.fetch(`/v2/deployments/${deploymentId}/events?${params}`)
      return response
    } catch (error) {
      console.error(`Error fetching logs for deployment ${deploymentId}:`, error)
      return null
    }
  }

  // Check if a deployment is live and accessible
  async checkDeploymentHealth(url: string): Promise<{
    isAccessible: boolean
    statusCode?: number
    responseTime?: number
    error?: string
  }> {
    const startTime = Date.now()
    
    try {
      // Create AbortController for timeout functionality
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal, // Use AbortController instead of timeout
      })

      clearTimeout(timeoutId)

      return {
        isAccessible: response.ok,
        statusCode: response.status,
        responseTime: Date.now() - startTime,
      }
    } catch (error) {
      return {
        isAccessible: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

// Export singleton instance
export const vercelAPI = new VercelAPI()

// Utility functions for common operations
export async function getPortfolioProjects(): Promise<VercelProject[]> {
  try {
    const projects = await vercelAPI.getProjects()
    
    // Filter for portfolio-worthy projects
    return projects.filter(project => {
      // Skip if no description or looks like a test project
      if (!project.description && !project.gitRepository) return false
      
      // Skip common non-portfolio project names
      const skipPatterns = [
        /test/i,
        /playground/i,
        /sandbox/i,
        /demo/i,
        /example/i,
        /template/i,
        /boilerplate/i,
        /starter/i,
      ]
      
      if (skipPatterns.some(pattern => pattern.test(project.name))) {
        return false
      }

      return true
    })
  } catch (error) {
    console.error('Error fetching portfolio projects:', error)
    return []
  }
}

export async function getProjectsWithDeploymentStatus(): Promise<Array<{
  project: VercelProject
  status: DeploymentStatus | null
  liveUrl?: string
}>> {
  try {
    const projects = await getPortfolioProjects()
    
    const projectsWithStatus = await Promise.all(
      projects.map(async (project) => {
        const status = await vercelAPI.getDeploymentStatus(project.id)
        const domains = await vercelAPI.getProjectDomains(project.id)
        
        // Prefer custom domain over Vercel URL
        const customDomain = domains.find(d => !d.name.includes('.vercel.app'))
        const liveUrl = customDomain 
          ? `https://${customDomain.name}`
          : status?.url

        return {
          project,
          status,
          liveUrl,
        }
      })
    )

    return projectsWithStatus
  } catch (error) {
    console.error('Error fetching projects with deployment status:', error)
    return []
  }
}

// Cache implementation for Vercel data
const vercelCache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export function getCachedVercelData<T>(key: string): T | null {
  const cached = vercelCache.get(key)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data
  }
  vercelCache.delete(key)
  return null
}

export function setCachedVercelData<T>(key: string, data: T, ttlMinutes: number = 30) {
  vercelCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000
  })
}

export async function getCachedProjectsWithStatus() {
  const cacheKey = 'vercel-projects-status'
  let projects = getCachedVercelData<Array<{
    project: VercelProject
    status: DeploymentStatus | null
    liveUrl?: string
  }>>(cacheKey)
  
  if (!projects) {
    projects = await getProjectsWithDeploymentStatus()
    setCachedVercelData(cacheKey, projects, 15) // Cache for 15 minutes
  }
  
  return projects
}