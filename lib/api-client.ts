// lib/api-client.ts - Client-side API helper
class APIClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (typeof window !== 'undefined' ? window.location.origin : '')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  async getProjects() {
    return this.request('/projects')
  }

  async getGitHubUser() {
    return this.request('/github?type=user')
  }

  async getGitHubRepos() {
    return this.request('/github?type=repos')
  }

  async getDeploymentStatus() {
    return this.request('/deployment-status')
  }

  async refreshCache() {
    return this.request('/refresh-cache', { method: 'POST' })
  }
}

export const apiClient = new APIClient()