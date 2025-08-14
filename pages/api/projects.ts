// pages/api/projects.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('🔄 Projects API called')
  
  try {
    // Try to fetch from GitHub API
    const githubResponse = await fetch(`${req.headers.origin || 'http://localhost:3000'}/api/github?type=repos`)
    
    let repos = []
    if (githubResponse.ok) {
      repos = await githubResponse.json()
      console.log(`📂 Fetched ${repos.length} repositories from GitHub`)
    } else {
      console.warn('⚠️ GitHub API failed, using fallback data')
    }
    
    // Transform GitHub repos to project format or use fallback
    const projects = repos.length > 0 ? repos.map((repo: any, index: number) => {
      const projectName = repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
      const isFeatured = repo.stargazers_count > 0 || repo.forks_count > 0 || index < 3
      
      return {
        id: repo.id.toString(),
        slug: repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: projectName,
        title: projectName, // for compatibility
        description: repo.description || 'A project built with modern technologies',
        category: determineCategoryFromRepo(repo),
        status: 'completed',
        featured: isFeatured,
        order: isFeatured ? index : index + 100,
        techStack: [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 5),
        tags: [repo.language, ...(repo.topics || [])].filter(Boolean), // for compatibility
        lastActivity: repo.updated_at,
        deploymentScore: Math.min(80 + (repo.stargazers_count * 5) + (repo.forks_count * 2), 100),
        github: {
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          topics: repo.topics || [],
          lastUpdated: repo.updated_at
        },
        githubUrl: repo.html_url, // for compatibility
        liveUrl: repo.homepage || undefined, // for compatibility
        image: `/images/projects/${repo.name.toLowerCase()}.jpg`, // for compatibility
        metadata: {
          images: [`/images/projects/${repo.name.toLowerCase()}.jpg`],
          tags: repo.topics || [],
          highlights: generateHighlights(repo),
          liveUrl: repo.homepage || undefined
        }
      }
    }) : [
      // Fallback project data
      {
        id: '1',
        slug: 'portfolio-website',
        name: 'Portfolio Website',
        title: 'Portfolio Website',
        description: 'Modern portfolio website built with Next.js 14, TypeScript, and Framer Motion',
        category: 'fullstack',
        status: 'completed',
        featured: true,
        order: 1,
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        lastActivity: new Date().toISOString(),
        deploymentScore: 95,
        github: {
          url: 'https://github.com/sippinwindex/portfolio',
          stars: 0,
          forks: 0,
          language: 'TypeScript',
          topics: ['portfolio', 'nextjs', 'typescript'],
          lastUpdated: new Date().toISOString()
        },
        githubUrl: 'https://github.com/sippinwindex/portfolio',
        liveUrl: req.headers.origin || 'https://workfolio-l051bapf-sippinwindex-projects.vercel.app',
        image: '/images/projects/portfolio.jpg',
        metadata: {
          images: ['/images/projects/portfolio.jpg'],
          tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
          highlights: ['Live Portfolio', 'Modern Design', '3D Animations'],
          liveUrl: req.headers.origin || 'https://workfolio-l051bapf-sippinwindex-projects.vercel.app'
        }
      }
    ]
    
    // Sort projects: featured first, then by deployment score
    projects.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.deploymentScore - a.deploymentScore
    })
    
    console.log(`✅ Projects processed: ${projects.length} (${projects.filter(p => p.featured).length} featured)`)
    
    return res.status(200).json({ projects })
    
  } catch (error) {
    console.error('❌ Projects API Error:', error)
    
    // Return fallback data
    return res.status(200).json({
      projects: [
        {
          id: '1',
          slug: 'portfolio-website',
          name: 'Portfolio Website',
          title: 'Portfolio Website',
          description: 'Modern portfolio website built with Next.js 14, TypeScript, and Framer Motion',
          category: 'fullstack',
          status: 'completed',
          featured: true,
          order: 1,
          techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
          tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
          lastActivity: new Date().toISOString(),
          deploymentScore: 95,
          github: {
            url: 'https://github.com/sippinwindex/portfolio',
            stars: 0,
            forks: 0,
            language: 'TypeScript',
            topics: ['portfolio', 'nextjs', 'typescript'],
            lastUpdated: new Date().toISOString()
          },
          githubUrl: 'https://github.com/sippinwindex/portfolio',
          liveUrl: req.headers.origin || 'https://workfolio-l051bapf-sippinwindex-projects.vercel.app',
          image: '/images/projects/portfolio.jpg',
          metadata: {
            images: ['/images/projects/portfolio.jpg'],
            tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
            highlights: ['Live Portfolio', 'Modern Design', '3D Animations'],
            liveUrl: req.headers.origin || 'https://workfolio-l051bapf-sippinwindex-projects.vercel.app'
          }
        }
      ]
    })
  }
}

// Helper functions
function determineCategoryFromRepo(repo: any): string {
  const language = repo.language?.toLowerCase() || ''
  const topics = repo.topics || []
  const description = repo.description?.toLowerCase() || ''
  
  if (topics.includes('mobile') || description.includes('mobile')) return 'mobile'
  if (topics.includes('backend') || topics.includes('api')) return 'backend'
  if (topics.includes('frontend') || language === 'css' || language === 'html') return 'frontend'
  if (language === 'typescript' || language === 'javascript') return 'fullstack'
  if (language === 'python') return 'data'
  
  return 'other'
}

function generateHighlights(repo: any): string[] {
  const highlights: string[] = []
  
  if (repo.stargazers_count > 0) highlights.push(`${repo.stargazers_count} GitHub Stars`)
  if (repo.forks_count > 0) highlights.push(`${repo.forks_count} Forks`)
  if (repo.homepage) highlights.push('Live Demo Available')
  if (repo.language) highlights.push(`Built with ${repo.language}`)
  if (repo.topics?.length > 0) highlights.push('Well Tagged')
  
  return highlights.slice(0, 3) // Limit to 3 highlights
}