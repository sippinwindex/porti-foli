// types/api.ts - API Response Types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface ProjectsResponse extends APIResponse {
  data: {
    projects: any[]
    meta: {
      total: number
      featured: number
      live: number
      timestamp: string
    }
  }
}

export interface GitHubResponse extends APIResponse {
  data: {
    user?: any
    repos?: any[]
    rateLimit?: {
      limit: number
      remaining: number
      reset: number
    }
  }
}