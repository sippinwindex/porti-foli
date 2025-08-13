// lib/vercel-api.ts
export interface VercelProject {
  id: string
  name: string
  accountId: string
  updatedAt: number
  createdAt: number
}

export interface VercelDeployment {
  uid: string
  name: string
  url: string
  created: number
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  type: 'LAMBDAS'
  readyState: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED'
  alias?: string[]
}

export interface ProjectWithStatus {
  project: VercelProject
  status?: VercelDeployment
  liveUrl?: string
}

class VercelAPI {
  private baseUrl = 'https://api.vercel.com'
  private token: string | null = null
  private cache: ProjectWithStatus[] = []
  private cacheExpiry: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    // Only set token on client side
    if (typeof window !== 'undefined') {
      this.token = process.env.VERCEL_TOKEN || null
    }
  }

  private isAvailable(): boolean {
    if (typeof window === 'undefined') {
      console.warn('Vercel API not available during SSR/build time')
      return false
    }

    if (!this.token) {
      console.warn('Vercel token not found - deployment status will be unavailable')
      return false
    }

    return true
  }

  private isCacheValid(): boolean {
    return Date.now() < this.cacheExpiry && this.cache.length > 0
  }

  async getProjects(): Promise<VercelProject[]> {
    if (!this.isAvailable()) {
      return []
    }

    try {
      const response = await fetch(`${this.baseUrl}/v9/projects`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.status}`)
      }

      const data = await response.json()
      return data.projects || []
    } catch (error) {
      console.error('Failed to fetch Vercel projects:', error)
      return []
    }
  }

  async getLatestDeployment(projectId: string): Promise<VercelDeployment | null> {
    if (!this.isAvailable()) {
      return null
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/v6/deployments?projectId=${projectId}&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.status}`)
      }

      const data = await response.json()
      return data.deployments?.[0] || null
    } catch (error) {
      console.error('Failed to fetch Vercel deployment:', error)
      return null
    }
  }

  async getProjectsWithStatus(forceRefresh = false): Promise<ProjectWithStatus[]> {
    if (!this.isAvailable()) {
      return []
    }

    // Return cached data if valid
    if (!forceRefresh && this.isCacheValid()) {
      return this.cache
    }

    try {
      const projects = await this.getProjects()
      const projectsWithStatus: ProjectWithStatus[] = []

      // Get deployment status for each project
      for (const project of projects) {
        const deployment = await this.getLatestDeployment(project.id)
        
        let liveUrl: string | undefined
        if (deployment && deployment.state === 'READY') {
          liveUrl = deployment.alias?.[0] || `https://${deployment.url}`
        }

        projectsWithStatus.push({
          project,
          status: deployment || undefined,
          liveUrl,
        })
      }

      // Update cache
      this.cache = projectsWithStatus
      this.cacheExpiry = Date.now() + this.CACHE_DURATION

      return projectsWithStatus
    } catch (error) {
      console.error('Failed to fetch projects with status:', error)
      return this.cache.length > 0 ? this.cache : []
    }
  }

  // Clear cache manually
  clearCache(): void {
    this.cache = []
    this.cacheExpiry = 0
  }

  // Get cache status
  getCacheInfo(): { size: number; expiresAt: Date; isValid: boolean } {
    return {
      size: this.cache.length,
      expiresAt: new Date(this.cacheExpiry),
      isValid: this.isCacheValid(),
    }
  }
}

// Export singleton instance
export const vercelAPI = new VercelAPI()

// Convenience functions
export async function getCachedProjectsWithStatus(forceRefresh = false): Promise<ProjectWithStatus[]> {
  return vercelAPI.getProjectsWithStatus(forceRefresh)
}

export function clearVercelCache(): void {
  vercelAPI.clearCache()
}

export function getVercelCacheInfo() {
  return vercelAPI.getCacheInfo()
}