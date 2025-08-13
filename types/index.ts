// types/index.ts - Unified Portfolio Type Definitions

// =============================================================================
// CORE PROJECT TYPES
// =============================================================================

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  status: string;
  startDate: string;
  endDate?: string; // Optional to fix TypeScript error
  category: string;
  challenges: string[];
  learnings: string[];
  metrics: ProjectMetric[];
}

export interface ProjectMetric {
  label: string;
  value: string;
  description?: string;
}

// Enhanced project interface for GitHub/Vercel integration
export interface EnhancedProject {
  id: string
  slug: string
  name: string
  title: string // Added for compatibility with your existing Project type
  description: string
  longDescription?: string
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'other'
  status: 'completed' | 'in-progress' | 'planning' | 'archived'
  featured: boolean
  order: number
  
  // GitHub data
  github?: {
    url: string
    stars: number
    forks: number
    language: string | null
    languages: Record<string, number>
    topics: string[]
    lastUpdated: string
    readme?: string
    repository?: GitHubRepository
  }
  
  // Vercel data
  vercel?: {
    deploymentStatus: any
    liveUrl?: string
    isLive: boolean
    lastDeployed?: string
    buildStatus: 'success' | 'error' | 'building' | 'pending' | 'unknown'
  }
  
  // Custom metadata
  metadata: {
    customDescription?: string
    images: string[]
    tags: string[]
    highlights: string[]
    client?: string
    teamSize?: number
    role?: string
    liveUrl?: string
    demoUrl?: string
    startDate?: string
    endDate?: string
    challenges?: string[]
    learnings?: string[]
    metrics?: ProjectMetric[]
  }
  
  // Computed properties
  techStack: string[]
  lastActivity: string
  deploymentScore: number
}

// =============================================================================
// GITHUB INTEGRATION TYPES
// =============================================================================

export interface GitHubRepository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  // Enhanced fields for better integration
  full_name?: string;
  homepage?: string | null;
  created_at?: string;
  pushed_at?: string;
  size?: number;
  default_branch?: string;
  open_issues_count?: number;
  archived?: boolean;
  disabled?: boolean;
  private?: boolean;
  fork?: boolean;
  languages?: Record<string, number>;
  readme?: string;
  latest_commit?: {
    sha: string;
    message: string;
    author: string;
    date: string;
  };
}

export interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubStats {
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
  recentActivity: {
    totalCommits: number;
    lastWeekCommits: number;
    activeRepositories: number;
  };
}

// =============================================================================
// PORTFOLIO STATS TYPES
// =============================================================================

export interface PortfolioStats {
  totalProjects: number;
  featuredProjects: number;
  liveProjects: number;
  totalStars: number;
  totalForks: number;
  languageStats: Record<string, number>;
  categoryStats: Record<string, number>;
  deploymentStats: {
    successful: number;
    failed: number;
    building: number;
    pending: number;
  };
  recentActivity: {
    lastCommit: string;
    lastDeployment: string;
    activeProjects: number;
  };
  // Legacy compatibility
  totalCommits?: number;
  languagesUsed?: string[];
  lastUpdated?: string;
}

// =============================================================================
// 3D COMPONENT TYPES
// =============================================================================

// Language data for 3D visualization
export interface LanguageData {
  name: string;
  percentage: number;
  color: string;
  icon: string;
  projects: number;
  experience: number; // years
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  commits?: number;
}

// Particle field configuration
export interface ParticleConfig {
  particleCount?: number;
  interactive?: boolean;
  colorScheme?: 'viva-magenta' | 'lux-gold' | 'multi' | 'cyberpunk';
  animation?: 'float' | 'spiral' | 'wave' | 'constellation' | 'matrix';
  responsive?: boolean;
  showConnections?: boolean;
  mouseInfluence?: number;
  speed?: number;
}

// Code block data for floating visualization
export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  icon: React.ElementType;
  color: string;
  position: { x: number; y: number; z: number };
}

// =============================================================================
// NAVIGATION & UI TYPES
// =============================================================================

export interface NavItem {
  href: string;
  label: string;
  external?: boolean;
  icon?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  color: string;
}

export interface ContactMethod {
  type: 'email' | 'calendar' | 'phone' | 'social';
  label: string;
  value: string;
  icon: string;
  description: string;
  primary?: boolean;
}

// =============================================================================
// THEME TYPES
// =============================================================================

export type ThemeType = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  attribute?: string;
  defaultTheme?: ThemeType;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
}

// =============================================================================
// SKILLS & EXPERIENCE TYPES
// =============================================================================

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'design' | 'soft';
  level: number; // 1-5
  years: number;
  icon: string;
  certified?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  achievements: string[];
  location?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: string;
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'inquiry' | 'project' | 'collaboration' | 'other';
}

export interface NewsletterFormData {
  email: string;
  preferences?: string[];
}

// =============================================================================
// CONTENT MANAGEMENT TYPES
// =============================================================================

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  image?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface CaseStudy {
  id: string;
  project: EnhancedProject;
  problem: string;
  solution: string;
  impact: string;
  process: {
    phase: string;
    duration: string;
    description: string;
    activities: string[];
    deliverables?: string[];
  }[];
  technical: {
    architecture: {
      frontend: string[];
      backend: string[];
      database: string[];
      infrastructure: string[];
      tools: string[];
      apis?: string[];
    };
    challenges: {
      challenge: string;
      solution: string;
      impact: string;
      learnings?: string[];
    }[];
    decisions: {
      decision: string;
      reasoning: string;
      alternatives: string[];
      outcome: string;
    }[];
  };
  results: {
    metrics: {
      label: string;
      value: string;
      description: string;
      type: 'percentage' | 'number' | 'currency' | 'time';
    }[];
    feedback: {
      quote: string;
      author: string;
      role: string;
      company: string;
    }[];
    achievements: string[];
    impact: string;
  };
  nextSteps?: string[];
}

// =============================================================================
// VERCEL INTEGRATION TYPES
// =============================================================================

export interface VercelProject {
  id: string;
  name: string;
  description?: string;
  framework: string | null;
  targets?: {
    production?: {
      id: string;
      domain: string;
      url: string;
    };
  };
  latestDeployments?: VercelDeployment[];
  analytics?: {
    id: string;
    enabledAt: number;
    disabledAt?: number;
  };
  env?: {
    name: string;
    value: string;
    target: string[];
  }[];
  gitRepository?: {
    type: 'github' | 'gitlab' | 'bitbucket';
    repo: string;
    org?: string;
  };
  link?: {
    type: 'github';
    repo: string;
    repoId: number;
    org?: string;
    gitCredentialId?: string;
    sourceless?: boolean;
    productionBranch?: string;
  };
  updatedAt: number;
  createdAt: number;
}

export interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  source: 'cli' | 'git' | 'import' | 'clone/repo';
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
  readyState: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
  type: 'LAMBDAS';
  creator: {
    uid: string;
    email?: string;
    username?: string;
    githubLogin?: string;
  };
  inspectorUrl: string | null;
  meta?: {
    githubCommitSha?: string;
    githubCommitMessage?: string;
    githubCommitAuthorName?: string;
    githubCommitRef?: string;
    githubRepo?: string;
    githubOrg?: string;
  };
  target?: string | null;
  aliasError?: any | null;
  aliasAssigned?: number | null;
  isRollbackCandidate?: boolean | null;
  buildingAt?: number;
  readyAt?: number;
}

export interface DeploymentStatus {
  url: string;
  state: VercelDeployment['state'];
  createdAt: number;
  readyAt?: number;
  buildTime?: number;
  commitSha?: string;
  commitMessage?: string;
  branch?: string;
  isProduction: boolean;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

// Generic loading state
export interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated?: string;
}

// Pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
}

// Search/Filter
export interface FilterOptions {
  category?: string;
  technology?: string;
  status?: string;
  featured?: boolean;
  sortBy?: 'name' | 'date' | 'stars' | 'updated';
  sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// TYPE GUARDS & UTILITIES
// =============================================================================

// Type guard for enhanced projects
export function isEnhancedProject(project: any): project is EnhancedProject {
  return (
    typeof project === 'object' &&
    project !== null &&
    typeof project.id === 'string' &&
    typeof project.name === 'string' &&
    typeof project.description === 'string' &&
    Array.isArray(project.techStack)
  );
}

// Type guard for GitHub repository
export function isGitHubRepository(repo: any): repo is GitHubRepository {
  return (
    typeof repo === 'object' &&
    repo !== null &&
    typeof repo.id === 'number' &&
    typeof repo.name === 'string' &&
    typeof repo.html_url === 'string'
  );
}

// Convert legacy Project to EnhancedProject
export function convertToEnhancedProject(project: Project): EnhancedProject {
  return {
    id: project.id,
    slug: project.id.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    name: project.title,
    title: project.title,
    description: project.description,
    longDescription: project.longDescription,
    category: (project.category as EnhancedProject['category']) || 'other',
    status: (project.status as EnhancedProject['status']) || 'completed',
    featured: project.featured,
    order: 0,
    github: project.githubUrl ? {
      url: project.githubUrl,
      stars: 0,
      forks: 0,
      language: null,
      languages: {},
      topics: project.tags,
      lastUpdated: new Date().toISOString()
    } : undefined,
    vercel: project.liveUrl ? {
      deploymentStatus: null,
      liveUrl: project.liveUrl,
      isLive: true,
      buildStatus: 'success' as const
    } : undefined,
    metadata: {
      images: [project.image],
      tags: project.tags,
      highlights: [],
      liveUrl: project.liveUrl,
      startDate: project.startDate,
      endDate: project.endDate,
      challenges: project.challenges,
      learnings: project.learnings,
      metrics: project.metrics
    },
    techStack: project.tags,
    lastActivity: new Date().toISOString(),
    deploymentScore: project.liveUrl ? 90 : 70
  };
}

// =============================================================================
// EXPORT ALL TYPES
// =============================================================================

export type {
  // Legacy compatibility exports
  Project as LegacyProject,
  PortfolioStats as LegacyPortfolioStats
};