// app/api/projects/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🔄 Projects API called')
  
  try {
    // Fetch GitHub repos first
    const githubResponse = await fetch(`${process.env.VERCEL_URL || 'https://workfolio-l051bapf-sippinwindex-projects.vercel.app'}/api/github?type=repos`, {
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
      }
    })
    
    if (!githubResponse.ok) {
      console.error('Failed to fetch from GitHub API')
      // Return mock data if GitHub fails
      return NextResponse.json({
        projects: [
          {
            id: '1',
            slug: 'portfolio-website',
            name: 'Portfolio Website',
            description: 'Modern portfolio website with Next.js and TypeScript',
            category: 'fullstack',
            status: 'completed',
            featured: true,
            order: 1,
            techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
            lastActivity: new Date().toISOString(),
            deploymentScore: 95,
            github: {
              url: 'https://github.com/sippinwindex/portfolio',
              stars: 0,
              forks: 0,
              language: 'TypeScript',
              topics: ['portfolio', 'nextjs'],
              lastUpdated: new Date().toISOString()
            },
            metadata: {
              images: [],
              tags: ['Next.js', 'TypeScript'],
              highlights: [],
              liveUrl: 'https://workfolio-l051bapf-sippinwindex-projects.vercel.app'
            }
          }
        ]
      })
    }
    
    const repos = await githubResponse.json()
    
    // Transform GitHub repos to project format
    const projects = repos.map((repo: any, index: number) => ({
      id: repo.id.toString(),
      slug: repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      name: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      description: repo.description || 'A project built with modern technologies',
      category: 'fullstack',
      status: 'completed',
      featured: repo.stargazers_count > 0 || index < 3,
      order: index,
      techStack: [repo.language].filter(Boolean),
      lastActivity: repo.updated_at,
      deploymentScore: 80 + (repo.stargazers_count * 5),
      github: {
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics || [],
        lastUpdated: repo.updated_at
      },
      metadata: {
        images: [],
        tags: repo.topics || [],
        highlights: [],
        liveUrl: repo.homepage
      }
    }))
    
    console.log(`✅ Projects processed: ${projects.length}`)
    
    return NextResponse.json({ projects })
    
  } catch (error) {
    console.error('❌ Projects API Error:', error)
    
    // Return fallback data
    return NextResponse.json({
      projects: [
        {
          id: '1',
          slug: 'portfolio-website',
          name: 'Portfolio Website',
          description: 'Modern portfolio website with Next.js and TypeScript',
          category: 'fullstack',
          status: 'completed',
          featured: true,
          order: 1,
          techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
          lastActivity: new Date().toISOString(),
          deploymentScore: 95,
          github: {
            url: 'https://github.com/sippinwindex/portfolio',
            stars: 0,
            forks: 0,
            language: 'TypeScript',
            topics: ['portfolio', 'nextjs'],
            lastUpdated: new Date().toISOString()
          },
          metadata: {
            images: [],
            tags: ['Next.js', 'TypeScript'],
            highlights: [],
            liveUrl: 'https://workfolio-l051bapf-sippinwindex-projects.vercel.app'
          }
        }
      ]
    })
  }
}