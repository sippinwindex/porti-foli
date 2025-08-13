// lib/mock-data.ts
// Type-safe mock data that matches your component interfaces

export interface Project {
  id: string
  name: string
  title: string  // Added missing property
  description: string
  techStack: string[]
  featured: boolean  // Added missing property
  github?: {
    stars: number
    forks: number
    url: string
  }
  vercel?: {
    isLive: boolean
    liveUrl?: string
  }
  deploymentScore?: number
  category?: string
}

export interface PortfolioStats {
  totalProjects: number
  totalStars: number
  liveProjects: number
  totalForks?: number
  languageStats: Record<string, number>
  categoryStats: Record<string, number>
  deploymentStats: {
    successful: number
    failed: number
    building: number
    pending: number
  }
  recentActivity: {
    lastCommit: string
    lastDeployment: string
    activeProjects: number
  }
}

export const mockProjects: Project[] = [
  {
    id: 'healthcare-dashboard',
    name: 'AI Healthcare Dashboard',
    title: 'AI Healthcare Dashboard',  // Added title
    description: 'Real-time patient monitoring with predictive analytics',
    techStack: ['React', 'TypeScript', 'TensorFlow', 'Flask', 'PostgreSQL'],
    featured: true,  // Added featured
    github: { 
      stars: 45, 
      forks: 12, 
      url: 'https://github.com/sippinwindex/healthcare-dashboard' 
    },
    vercel: { 
      isLive: true, 
      liveUrl: 'https://healthcare-dashboard.vercel.app' 
    },
    deploymentScore: 95,
    category: 'fullstack'
  },
  {
    id: 'ecommerce-suite',
    name: 'E-Commerce Suite',
    title: 'E-Commerce Suite',
    description: 'Full-stack platform with AI recommendations and payment processing',
    techStack: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'TypeScript'],
    featured: true,
    github: { 
      stars: 32, 
      forks: 8, 
      url: 'https://github.com/sippinwindex/ecommerce-suite' 
    },
    vercel: { 
      isLive: true, 
      liveUrl: 'https://ecommerce-suite.vercel.app' 
    },
    deploymentScore: 92,
    category: 'fullstack'
  },
  {
    id: 'financial-risk-tool',
    name: 'Financial Risk Analyzer',
    title: 'Financial Risk Analyzer',
    description: 'Real-time market analysis with scenario modeling and risk assessment',
    techStack: ['Python', 'FastAPI', 'React', 'D3.js', 'PostgreSQL'],
    featured: true,
    github: { 
      stars: 28, 
      forks: 5, 
      url: 'https://github.com/sippinwindex/financial-risk' 
    },
    vercel: { 
      isLive: false 
    },
    deploymentScore: 88,
    category: 'data'
  },
  {
    id: 'portfolio-3d',
    name: '3D Portfolio Website',
    title: '3D Portfolio Website',
    description: 'Immersive portfolio with Three.js animations and WebGL effects',
    techStack: ['React', 'Three.js', 'GSAP', 'Framer Motion', 'TypeScript'],
    featured: true,
    github: { 
      stars: 67, 
      forks: 23, 
      url: 'https://github.com/sippinwindex/portfolio-3d' 
    },
    vercel: { 
      isLive: true, 
      liveUrl: 'https://portfolio-3d.vercel.app' 
    },
    deploymentScore: 98,
    category: 'frontend'
  },
  {
    id: 'chat-app',
    name: 'Real-time Chat App',
    title: 'Real-time Chat Application',
    description: 'WebSocket-based chat with video calling and file sharing',
    techStack: ['React', 'Socket.io', 'WebRTC', 'Express', 'MongoDB'],
    featured: false,
    github: { 
      stars: 41, 
      forks: 15, 
      url: 'https://github.com/sippinwindex/chat-app' 
    },
    vercel: { 
      isLive: true, 
      liveUrl: 'https://chat-app.vercel.app' 
    },
    deploymentScore: 89,
    category: 'fullstack'
  },
  {
    id: 'ml-platform',
    name: 'ML Model Platform',
    title: 'Machine Learning Platform',
    description: 'Deploy and monitor machine learning models with automated pipelines',
    techStack: ['Python', 'Docker', 'Kubernetes', 'React', 'TensorFlow'],
    featured: false,
    github: { 
      stars: 55, 
      forks: 18, 
      url: 'https://github.com/sippinwindex/ml-platform' 
    },
    vercel: { 
      isLive: true, 
      liveUrl: 'https://ml-platform.vercel.app' 
    },
    deploymentScore: 91,
    category: 'data'
  },
  {
    id: 'task-manager',
    name: 'Task Management App',
    title: 'Collaborative Task Manager',
    description: 'Team collaboration tool with real-time updates and project tracking',
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    featured: false,
    github: { 
      stars: 23, 
      forks: 7, 
      url: 'https://github.com/sippinwindex/task-manager' 
    },
    vercel: { 
      isLive: true, 
      liveUrl: 'https://task-manager.vercel.app' 
    },
    deploymentScore: 87,
    category: 'fullstack'
  },
  {
    id: 'weather-dashboard',
    name: 'Weather Dashboard',
    title: 'Interactive Weather Dashboard',
    description: 'Beautiful weather app with location-based forecasts and interactive maps',
    techStack: ['React', 'OpenWeather API', 'Mapbox', 'Chart.js'],
    featured: false,
    github: { 
      stars: 19, 
      forks: 4, 
      url: 'https://github.com/sippinwindex/weather-dashboard' 
    },
    vercel: { 
      isLive: true, 
      liveUrl: 'https://weather-dashboard.vercel.app' 
    },
    deploymentScore: 84,
    category: 'frontend'
  }
]

export const mockStats: PortfolioStats = {
  totalProjects: mockProjects.length,
  totalStars: mockProjects.reduce((acc, project) => acc + (project.github?.stars || 0), 0),
  liveProjects: mockProjects.filter(project => project.vercel?.isLive).length,
  totalForks: mockProjects.reduce((acc, project) => acc + (project.github?.forks || 0), 0),
  languageStats: {
    'React': 35,
    'TypeScript': 28,
    'Python': 22,
    'Node.js': 15,
    'Next.js': 12,
    'MongoDB': 10,
    'PostgreSQL': 8
  },
  categoryStats: {
    'fullstack': mockProjects.filter(p => p.category === 'fullstack').length,
    'frontend': mockProjects.filter(p => p.category === 'frontend').length,
    'data': mockProjects.filter(p => p.category === 'data').length
  },
  deploymentStats: {
    successful: mockProjects.filter(p => p.vercel?.isLive).length,
    failed: 1,
    building: 0,
    pending: mockProjects.filter(p => !p.vercel?.isLive).length
  },
  recentActivity: {
    lastCommit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    lastDeployment: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    activeProjects: mockProjects.filter(p => p.featured).length
  }
}