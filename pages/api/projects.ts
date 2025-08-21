// pages/api/projects.ts - COMPLETELY FIXED VERSION
import type { NextApiRequest, NextApiResponse } from 'next'

// Mock data with live deployment URLs
const enhancedMockProjects = [
  {
    id: 'portfolio-website',
    name: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'Modern portfolio website built with Next.js, featuring dynamic GitHub integration, elegant animations, and responsive design.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    category: 'Web Development',
    featured: true,
    status: 'completed',
    startDate: '2024-12-01',
    github: {
      stars: 15,
      forks: 3,
      url: 'https://github.com/sippinwindex/portfolio',
      language: 'TypeScript',
      lastUpdated: '2025-01-15'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://juan-fernandez.dev',
      deploymentStatus: 'READY'
    },
    liveUrl: 'https://juan-fernandez.dev',
    highlights: ['Responsive Design', 'GitHub Integration', 'Dark Mode']
  },
  {
    id: 'healthcare-dashboard',
    name: 'healthcare-dashboard',
    title: 'Healthcare Analytics Dashboard',
    description: 'Advanced healthcare analytics platform with real-time patient data visualization, predictive analytics, and secure HIPAA-compliant architecture.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Chart.js', 'AWS'],
    category: 'Healthcare',
    featured: true,
    status: 'completed',
    startDate: '2024-10-15',
    github: {
      stars: 28,
      forks: 7,
      url: 'https://github.com/sippinwindex/healthcare-dashboard',
      language: 'JavaScript',
      lastUpdated: '2025-01-10'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://healthcare-dashboard-demo.vercel.app',
      deploymentStatus: 'READY'
    },
    liveUrl: 'https://healthcare-dashboard-demo.vercel.app',
    highlights: ['HIPAA Compliant', 'Real-time Analytics', 'Predictive Models']
  },
  {
    id: 'ecommerce-suite',
    name: 'ecommerce-suite',
    title: 'E-commerce Management Suite',
    description: 'Full-stack e-commerce solution with inventory management, payment processing, analytics dashboard, and multi-vendor support.',
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'Redis'],
    category: 'E-commerce',
    featured: true,
    status: 'completed',
    startDate: '2024-09-01',
    github: {
      stars: 42,
      forks: 12,
      url: 'https://github.com/sippinwindex/ecommerce-suite',
      language: 'TypeScript',
      lastUpdated: '2025-01-12'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://ecommerce-suite-demo.vercel.app',
      deploymentStatus: 'READY'
    },
    liveUrl: 'https://ecommerce-suite-demo.vercel.app',
    highlights: ['Multi-vendor Support', 'Payment Integration', 'Analytics']
  },
  {
    id: 'financial-risk-tool',
    name: 'financial-risk-tool',
    title: 'Financial Risk Assessment Tool',
    description: 'Sophisticated financial risk analysis platform using machine learning algorithms for portfolio optimization and risk prediction.',
    techStack: ['Python', 'FastAPI', 'React', 'TensorFlow', 'Docker'],
    category: 'Finance',
    featured: true,
    status: 'completed',
    startDate: '2024-08-15',
    github: {
      stars: 35,
      forks: 8,
      url: 'https://github.com/sippinwindex/financial-risk-tool',
      language: 'Python',
      lastUpdated: '2025-01-08'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://financial-risk-tool.vercel.app',
      deploymentStatus: 'READY'
    },
    liveUrl: 'https://financial-risk-tool.vercel.app',
    highlights: ['ML Algorithms', 'Risk Prediction', 'Portfolio Optimization']
  },
  {
    id: 'ai-chatbot-platform',
    name: 'ai-chatbot-platform',
    title: 'AI Chatbot Platform',
    description: 'Intelligent chatbot platform with natural language processing, custom training capabilities, and seamless integration APIs.',
    techStack: ['Node.js', 'OpenAI API', 'MongoDB', 'Socket.io', 'Docker'],
    category: 'AI/ML',
    featured: false,
    status: 'completed',
    startDate: '2024-11-01',
    github: {
      stars: 22,
      forks: 5,
      url: 'https://github.com/sippinwindex/ai-chatbot-platform',
      language: 'JavaScript',
      lastUpdated: '2025-01-05'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://ai-chatbot-platform.vercel.app',
      deploymentStatus: 'READY'
    },
    liveUrl: 'https://ai-chatbot-platform.vercel.app',
    highlights: ['NLP Integration', 'Custom Training', 'API Integration']
  },
  {
    id: 'task-automation-tool',
    name: 'task-automation-tool',
    title: 'Task Automation Tool',
    description: 'Workflow automation platform for businesses to streamline repetitive tasks and improve operational efficiency.',
    techStack: ['Python', 'Django', 'Celery', 'PostgreSQL', 'Docker'],
    category: 'Productivity',
    featured: false,
    status: 'completed',
    startDate: '2024-07-20',
    github: {
      stars: 18,
      forks: 4,
      url: 'https://github.com/sippinwindex/task-automation-tool',
      language: 'Python',
      lastUpdated: '2024-12-28'
    },
    vercel: {
      isLive: false,
      deploymentStatus: 'not-deployed'
    },
    highlights: ['Workflow Automation', 'Business Integration', 'Efficiency Tools']
  }
]

// GitHub API integration with proper error handling
async function fetchGitHubProjects(): Promise<any[]> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME

  if (!GITHUB_TOKEN || !GITHUB_USERNAME) {
    console.warn('⚠️ GitHub credentials not found, using mock data')
    return enhancedMockProjects
  }

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos = await response.json()
    
    // Transform GitHub repos to portfolio format
    const transformedRepos = repos
      .filter((repo: any) => !repo.fork && !repo.archived)
      .map((repo: any) => ({
        id: repo.name,
        name: repo.name,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        description: repo.description || 'No description available',
        techStack: repo.topics || [repo.language].filter(Boolean),
        category: getCategoryFromTopics(repo.topics || []) || 'Development',
        featured: repo.stargazers_count > 5 || repo.name.includes('portfolio'),
        status: 'completed',
        startDate: repo.created_at,
        github: {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
          language: repo.language,
          lastUpdated: repo.updated_at
        },
        vercel: detectVercelDeployment(repo),
        liveUrl: repo.homepage || null,
        highlights: generateHighlights(repo)
      }))

    // Merge with enhanced mock data, prioritizing real GitHub data
    const mergedProjects = mergeMockWithGitHub(enhancedMockProjects, transformedRepos)
    
    return mergedProjects
  } catch (error) {
    console.error('❌ GitHub API fetch failed:', error)
    return enhancedMockProjects
  }
}

// Helper functions
function getCategoryFromTopics(topics: string[]): string {
  const categoryMap: Record<string, string> = {
    'healthcare': 'Healthcare',
    'ecommerce': 'E-commerce',
    'finance': 'Finance',
    'ai': 'AI/ML',
    'machine-learning': 'AI/ML',
    'productivity': 'Productivity',
    'web': 'Web Development',
    'mobile': 'Mobile Development',
    'game': 'Game Development'
  }

  for (const topic of topics) {
    if (categoryMap[topic.toLowerCase()]) {
      return categoryMap[topic.toLowerCase()]
    }
  }

  return 'Development'
}

function detectVercelDeployment(repo: any) {
  const homepage = repo.homepage
  if (homepage && (homepage.includes('vercel.app') || homepage.includes('.app'))) {
    return {
      isLive: true,
      liveUrl: homepage,
      deploymentStatus: 'READY'
    }
  }
  return {
    isLive: false,
    deploymentStatus: 'not-deployed'
  }
}

function generateHighlights(repo: any): string[] {
  const highlights: string[] = []
  
  if (repo.stargazers_count > 10) highlights.push('Popular Repository')
  if (repo.language) highlights.push(`${repo.language} Based`)
  if (repo.homepage) highlights.push('Live Demo Available')
  if (repo.topics?.length > 3) highlights.push('Well Documented')
  
  return highlights.slice(0, 3)
}

function mergeMockWithGitHub(mockProjects: any[], githubProjects: any[]): any[] {
  // Create a map of GitHub projects by name
  const githubMap = new Map(githubProjects.map(project => [project.name, project]))
  
  // Update mock projects with real GitHub data if available
  const updatedMockProjects = mockProjects.map(mockProject => {
    const githubProject = githubMap.get(mockProject.name)
    
    if (githubProject) {
      return {
        ...mockProject,
        github: githubProject.github,
        vercel: githubProject.vercel || mockProject.vercel,
        liveUrl: githubProject.liveUrl || mockProject.liveUrl
      }
    }
    
    return mockProject
  })

  // Add any additional GitHub projects not in mock data
  const additionalGithubProjects = githubProjects.filter(
    githubProject => !mockProjects.some(mockProject => mockProject.name === githubProject.name)
  )

  return [...updatedMockProjects, ...additionalGithubProjects]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔄 Fetching projects...')
    const projects = await fetchGitHubProjects()
    
    // Sort projects: featured first, then by stars/updated date
    const sortedProjects = projects.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      
      const aStars = a.github?.stars || 0
      const bStars = b.github?.stars || 0
      
      if (aStars !== bStars) return bStars - aStars
      
      const aDate = new Date(a.github?.lastUpdated || a.startDate || 0)
      const bDate = new Date(b.github?.lastUpdated || b.startDate || 0)
      
      return bDate.getTime() - aDate.getTime()
    })

    console.log(`✅ Successfully fetched ${sortedProjects.length} projects`)
    
    return res.status(200).json({
      success: true,
      projects: sortedProjects,
      meta: {
        total: sortedProjects.length,
        featured: sortedProjects.filter(p => p.featured).length,
        live: sortedProjects.filter(p => p.vercel?.isLive || p.liveUrl).length,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Projects API error:', error)
    
    return res.status(500).json({
      error: 'Failed to fetch projects',
      details: error instanceof Error ? error.message : 'Unknown error',
      fallback: enhancedMockProjects
    })
  }
}