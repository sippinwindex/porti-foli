// Fix for the endDate property issue in app/projects/[slug]/page.tsx
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
  endDate?: string; // Make endDate optional to fix the TypeScript error
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
}

export interface PortfolioStats {
  totalProjects: number;
  totalCommits: number;
  totalStars: number;
  languagesUsed: string[];
  lastUpdated: string;
}

// Navigation types
export interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

// Theme types
export type ThemeType = 'light' | 'dark' | 'system';

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}