// types/vercel.ts
export interface VercelProject {
  id: string
  name: string
  accountId: string
  createdAt: number
  updatedAt: number
  link?: {
    type: string
    repo: string
    repoId: number
    org?: string
  }
  live?: boolean
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
  meta: Record<string, any>
  target: 'production' | 'staging' | null
  aliasError?: {
    code: string
    message: string
  }
  aliasAssigned?: boolean
  isRollbackCandidate?: boolean
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

export interface VercelDomain {
  name: string
  apexName: string
  projectId: string
  redirect?: string
  redirectStatusCode?: number
  gitBranch?: string
  updatedAt?: number
  createdAt?: number
  verified: boolean
  verification?: Array<{
    type: string
    domain: string
    value: string
    reason: string
  }>
}

export interface VercelTeam {
  id: string
  slug: string
  name: string
  createdAt: number
  avatar?: string
}

export interface VercelUser {
  uid: string
  email: string
  name?: string
  username: string
  avatar?: string
  defaultTeamId?: string
}

export interface VercelProjectWithStatus {
  project: VercelProject
  status?: VercelDeployment
  liveUrl?: string
  deployments?: VercelDeployment[]
  domains?: VercelDomain[]
}

export interface VercelStats {
  totalProjects: number
  liveProjects: number
  totalDeployments: number
  successfulDeployments: number
  failedDeployments: number
  buildingDeployments: number
  lastDeployment?: {
    url: string
    state: string
    createdAt: number
  }
  deploymentsByState: {
    READY: number
    BUILDING: number
    ERROR: number
    CANCELED: number
    QUEUED: number
    INITIALIZING: number
  }
}

export interface VercelAPIResponse<T = any> {
  data?: T
  error?: {
    code: string
    message: string
  }
  pagination?: {
    count: number
    next?: string
    prev?: string
  }
}

export interface VercelProjectsResponse extends VercelAPIResponse {
  projects: VercelProject[]
}

export interface VercelDeploymentsResponse extends VercelAPIResponse {
  deployments: VercelDeployment[]
}

export interface VercelDomainsResponse extends VercelAPIResponse {
  domains: VercelDomain[]
}

// Enums for better type safety
export enum VercelDeploymentState {
  BUILDING = 'BUILDING',
  ERROR = 'ERROR',
  INITIALIZING = 'INITIALIZING',
  QUEUED = 'QUEUED',
  READY = 'READY',
  CANCELED = 'CANCELED'
}

export enum VercelTarget {
  PRODUCTION = 'production',
  STAGING = 'staging'
}

// Utility types for API operations
export interface VercelAPIConfig {
  token: string
  teamId?: string
  endpoint?: string
}

export interface VercelProjectCreateOptions {
  name: string
  framework?: string
  gitRepository?: {
    type: 'github' | 'gitlab' | 'bitbucket'
    repo: string
  }
  buildCommand?: string
  devCommand?: string
  installCommand?: string
  outputDirectory?: string
  publicSource?: boolean
  rootDirectory?: string
  serverlessFunctionRegion?: string
  environmentVariables?: Array<{
    key: string
    value: string
    target: string[]
  }>
}

export interface VercelDeploymentCreateOptions {
  name: string
  files: Array<{
    file: string
    data: string | Buffer
  }>
  projectSettings?: {
    framework?: string
    buildCommand?: string
    devCommand?: string
    installCommand?: string
    outputDirectory?: string
  }
  target?: 'production' | 'staging'
  meta?: Record<string, string>
  env?: Record<string, string>
  build?: {
    env?: Record<string, string>
  }
}

// Hook return types
export interface UseVercelProjectsReturn {
  projects: VercelProject[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseVercelDeploymentsReturn {
  deployments: VercelDeployment[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseVercelStatsReturn {
  stats: VercelStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Integration types for portfolio
export interface PortfolioVercelData {
  projectId: string
  projectName: string
  isLive: boolean
  liveUrl?: string
  lastDeployment?: {
    state: VercelDeploymentState
    url: string
    createdAt: number
  }
  deploymentCount: number
  successRate: number
  customDomains: string[]
}

// Error types
export interface VercelError {
  code: string
  message: string
  action?: string
  link?: string
  stack?: string
}

export interface VercelRateLimit {
  limit: number
  remaining: number
  reset: number
}

// Webhook types
export interface VercelWebhookEvent {
  type: 'deployment' | 'deployment.succeeded' | 'deployment.failed' | 'deployment.canceled'
  createdAt: number
  data: {
    deployment: VercelDeployment
    project: VercelProject
    team?: VercelTeam
  }
}