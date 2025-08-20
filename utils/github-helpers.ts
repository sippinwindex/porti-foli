// utils/github-helpers.ts - Runtime utility functions for GitHub data
import type { GitHubRepository, GitHubUser } from '@/types/github'

// Type guard to check if an object is a valid GitHubRepository
export function isGitHubRepository(obj: any): obj is GitHubRepository {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.html_url === 'string' &&
    typeof obj.stargazers_count === 'number' &&
    typeof obj.forks_count === 'number' &&
    Array.isArray(obj.topics) &&
    typeof obj.pushed_at === 'string' &&
    typeof obj.updated_at === 'string' &&
    typeof obj.archived === 'boolean' &&
    typeof obj.fork === 'boolean'
  )
}

// Type guard to check if an object is a valid GitHubUser
export function isGitHubUser(obj: any): obj is GitHubUser {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.login === 'string' &&
    typeof obj.id === 'number' &&
    typeof obj.avatar_url === 'string' &&
    typeof obj.html_url === 'string' &&
    typeof obj.followers === 'number' &&
    typeof obj.following === 'number' &&
    typeof obj.public_repos === 'number'
  )
}

// Calculate a score for a repository based on various metrics
export function calculateRepositoryScore(
  repo: GitHubRepository, 
  allRepos: GitHubRepository[] = []
): number {
  let score = 0

  // Base score for having a description
  if (repo.description && repo.description.length > 10) {
    score += 20
  }

  // Stars (weighted, with diminishing returns)
  if (repo.stargazers_count > 0) {
    score += Math.min(repo.stargazers_count * 5, 40)
  }

  // Forks (indicates community engagement)
  if (repo.forks_count > 0) {
    score += Math.min(repo.forks_count * 3, 20)
  }

  // Recent activity (within last 3 months)
  const lastUpdate = new Date(repo.updated_at)
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  
  if (lastUpdate > threeMonthsAgo) {
    score += 15
  } else {
    // Penalize very old repositories
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    if (lastUpdate < sixMonthsAgo) {
      score -= 10
    }
  }

  // Topics/tags (indicates good documentation)
  if (repo.topics && repo.topics.length > 0) {
    score += Math.min(repo.topics.length * 2, 10)
  }

  // Language bonus (prefer certain languages for portfolio)
  const portfolioLanguages = [
    'TypeScript', 'JavaScript', 'Python', 'React', 'Next.js'
  ]
  if (repo.language && portfolioLanguages.includes(repo.language)) {
    score += 10
  }

  // Homepage/demo link bonus
  if (repo.homepage && repo.homepage.length > 0) {
    score += 15
  }

  // Size penalty for very large repos (might be data dumps)
  if (repo.size > 100000) { // > 100MB
    score -= 20
  }

  // Archived or disabled penalty
  if (repo.archived || repo.disabled) {
    score -= 30
  }

  // Fork penalty (we want original work)
  if (repo.fork) {
    score -= 25
  }

  // Bonus for repositories with good engagement ratio
  if (repo.stargazers_count > 0 && repo.forks_count > 0) {
    const engagementRatio = repo.forks_count / repo.stargazers_count
    if (engagementRatio > 0.1 && engagementRatio < 0.5) {
      score += 10 // Sweet spot for engagement
    }
  }

  // Relative score boost for top performers in the collection
  if (allRepos.length > 0) {
    const maxStars = Math.max(...allRepos.map(r => r.stargazers_count))
    const maxForks = Math.max(...allRepos.map(r => r.forks_count))
    
    if (maxStars > 0 && repo.stargazers_count === maxStars) {
      score += 20 // Boost for most starred repo
    }
    if (maxForks > 0 && repo.forks_count === maxForks) {
      score += 15 // Boost for most forked repo
    }
  }

  // Ensure score is not negative
  return Math.max(score, 0)
}

// Determine if a repository should be featured in portfolio
export function shouldFeatureRepository(
  repo: GitHubRepository,
  allRepos: GitHubRepository[] = []
): boolean {
  const score = calculateRepositoryScore(repo, allRepos)
  
  // Feature repositories with high scores
  if (score >= 80) return true
  
  // Feature repositories with explicit portfolio indicators
  const portfolioIndicators = [
    'portfolio', 'project', 'demo', 'showcase', 'featured'
  ]
  
  const hasPortfolioIndicator = (
    portfolioIndicators.some(indicator => 
      repo.name.toLowerCase().includes(indicator) ||
      repo.description?.toLowerCase().includes(indicator) ||
      repo.topics?.some(topic => topic.toLowerCase().includes(indicator))
    )
  )
  
  if (hasPortfolioIndicator && score >= 50) return true
  
  // Feature if it's in the top 25% by score
  if (allRepos.length > 0) {
    const scores = allRepos.map(r => calculateRepositoryScore(r, allRepos))
    scores.sort((a, b) => b - a)
    const top25PercentThreshold = scores[Math.floor(scores.length * 0.25)]
    
    return score >= top25PercentThreshold && score >= 60
  }
  
  return false
}

// Get portfolio-worthy repositories from a collection
export function getPortfolioRepositories(
  repos: GitHubRepository[],
  limit: number = 20
): GitHubRepository[] {
  if (!repos || repos.length === 0) return []
  
  // Filter out non-portfolio repositories
  const filtered = repos.filter(repo => {
    // Skip forks, archived, and disabled repos
    if (repo.fork || repo.archived || repo.disabled) return false
    
    // Skip repos without descriptions
    if (!repo.description || repo.description.length < 10) return false
    
    // Skip common non-portfolio repo patterns
    const skipPatterns = [
      /^\./, // dotfiles
      /readme$/i,
      /profile$/i,
      /config$/i,
      /template$/i,
      /boilerplate$/i,
      /test$/i,
      /playground$/i,
      /learning$/i,
      /tutorial$/i,
      /practice$/i,
      /scratch$/i,
      /tmp$/i,
      /temp$/i
    ]
    
    if (skipPatterns.some(pattern => pattern.test(repo.name))) return false
    
    return true
  })
  
  // Calculate scores and sort
  const scored = filtered.map(repo => ({
    ...repo,
    _portfolioScore: calculateRepositoryScore(repo, filtered)
  }))
  
  scored.sort((a, b) => (b._portfolioScore || 0) - (a._portfolioScore || 0))
  
  // Remove the temporary score property and return
  return scored.slice(0, limit).map(({ _portfolioScore, ...repo }) => repo)
}

// Format repository name for display
export function formatRepositoryName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/\bJs\b/g, 'JS')
    .replace(/\bTs\b/g, 'TS')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bUi\b/g, 'UI')
    .replace(/\bUx\b/g, 'UX')
    .replace(/\bDb\b/g, 'DB')
    .replace(/\bSql\b/g, 'SQL')
    .replace(/\bHtml\b/g, 'HTML')
    .replace(/\bCss\b/g, 'CSS')
    .replace(/\b3[Dd]\b/g, '3D')
}

// Extract technology stack from repository data
export function extractTechStack(repo: GitHubRepository): string[] {
  const techStack = new Set<string>()
  
  // Add primary language
  if (repo.language) {
    techStack.add(repo.language)
  }
  
  // Add technologies from topics
  const techTopics = repo.topics?.filter(topic => {
    const techKeywords = [
      'react', 'vue', 'angular', 'svelte',
      'nextjs', 'nuxtjs', 'gatsby',
      'nodejs', 'express', 'fastify',
      'django', 'flask', 'fastapi',
      'mongodb', 'postgresql', 'mysql', 'redis',
      'docker', 'kubernetes',
      'aws', 'azure', 'gcp',
      'typescript', 'javascript',
      'tailwindcss', 'bootstrap',
      'threejs', 'webgl',
      'graphql', 'rest-api',
      'webpack', 'vite', 'rollup'
    ]
    
    return techKeywords.includes(topic.toLowerCase())
  }) || []
  
  // Map topics to display names
  const topicMap: Record<string, string> = {
    'nextjs': 'Next.js',
    'nuxtjs': 'Nuxt.js',
    'nodejs': 'Node.js',
    'react': 'React',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'svelte': 'Svelte',
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'tailwindcss': 'Tailwind CSS',
    'threejs': 'Three.js',
    'webgl': 'WebGL',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'redis': 'Redis',
    'graphql': 'GraphQL',
    'rest-api': 'REST API',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'aws': 'AWS',
    'azure': 'Azure',
    'gcp': 'Google Cloud'
  }
  
  techTopics.forEach(topic => {
    const displayName = topicMap[topic.toLowerCase()] || 
                       topic.charAt(0).toUpperCase() + topic.slice(1)
    techStack.add(displayName)
  })
  
  // Limit to 6 technologies for display purposes
  return Array.from(techStack).slice(0, 6)
}

// Determine repository category based on language and topics
export function categorizeRepository(
  repo: GitHubRepository
): 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'data' | 'devtools' | 'other' {
  const { language, topics = [], description = '' } = repo
  const content = `${description} ${topics.join(' ')}`.toLowerCase()
  
  // Mobile development
  if (
    language === 'Swift' ||
    language === 'Kotlin' ||
    language === 'Dart' ||
    topics.includes('mobile') ||
    topics.includes('ios') ||
    topics.includes('android') ||
    topics.includes('react-native') ||
    topics.includes('flutter') ||
    content.includes('mobile')
  ) {
    return 'mobile'
  }
  
  // Data science and machine learning
  if (
    language === 'Python' && (
      topics.includes('machine-learning') ||
      topics.includes('data-science') ||
      topics.includes('ai') ||
      topics.includes('deep-learning') ||
      topics.includes('tensorflow') ||
      topics.includes('pytorch') ||
      content.includes('machine learning') ||
      content.includes('data science') ||
      content.includes('artificial intelligence')
    )
  ) {
    return 'data'
  }
  
  // Developer tools
  if (
    topics.includes('cli') ||
    topics.includes('tool') ||
    topics.includes('utility') ||
    topics.includes('automation') ||
    topics.includes('build-tool') ||
    content.includes('developer tool') ||
    content.includes('cli tool')
  ) {
    return 'devtools'
  }
  
  // Backend development
  if (
    topics.includes('backend') ||
    topics.includes('api') ||
    topics.includes('server') ||
    topics.includes('microservice') ||
    language === 'Go' ||
    language === 'Rust' ||
    (language === 'Python' && !content.includes('frontend')) ||
    (language === 'Java' && !content.includes('android')) ||
    content.includes('backend') ||
    content.includes('api server')
  ) {
    return 'backend'
  }
  
  // Frontend development
  if (
    language === 'HTML' ||
    language === 'CSS' ||
    topics.includes('frontend') ||
    topics.includes('ui') ||
    topics.includes('css') ||
    topics.includes('html') ||
    content.includes('frontend') ||
    content.includes('user interface')
  ) {
    return 'frontend'
  }
  
  // Full-stack development
  if (
    topics.includes('fullstack') ||
    topics.includes('full-stack') ||
    topics.includes('web-app') ||
    topics.includes('webapp') ||
    (language === 'TypeScript' && (
      topics.includes('react') ||
      topics.includes('nextjs') ||
      topics.includes('vue') ||
      topics.includes('angular')
    )) ||
    content.includes('full stack') ||
    content.includes('web application')
  ) {
    return 'fullstack'
  }
  
  // Default categorization based on language
  switch (language) {
    case 'JavaScript':
    case 'TypeScript':
      return topics.includes('node') ? 'fullstack' : 'frontend'
    case 'Python':
      return 'backend'
    default:
      return 'other'
  }
}

// Check if repository has a live demo/deployment
export function hasLiveDemo(repo: GitHubRepository): boolean {
  if (!repo.homepage) return false
  
  try {
    const url = new URL(repo.homepage)
    const hostname = url.hostname.toLowerCase()
    
    // Known deployment platforms
    const deploymentPlatforms = [
      'vercel.app',
      'netlify.app',
      'herokuapp.com',
      'github.io',
      'surge.sh',
      'firebase.app',
      'web.app'
    ]
    
    return deploymentPlatforms.some(platform => hostname.includes(platform))
  } catch {
    return false
  }
}

export default {
  isGitHubRepository,
  isGitHubUser,
  calculateRepositoryScore,
  shouldFeatureRepository,
  getPortfolioRepositories,
  formatRepositoryName,
  extractTechStack,
  categorizeRepository,
  hasLiveDemo
}