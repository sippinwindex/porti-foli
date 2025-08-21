// app/projects/[slug]/page.tsx - FIXED: Server component with generateStaticParams
import { notFound } from 'next/navigation'
import { getEnhancedProjects } from '@/lib/portfolio-integration'
import { formatDate, getLanguageColor } from '@/lib/utils'
import { ExternalLink, GitBranch, Star, GitFork, Calendar, Globe } from 'lucide-react'

// Generate static params for all projects
export async function generateStaticParams() {
  try {
    const projects = await getEnhancedProjects()
    
    return projects.map((project) => ({
      slug: project.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Generate metadata for each project
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const projects = await getEnhancedProjects()
    const project = projects.find((p) => p.slug === params.slug)
    
    if (!project) {
      return {
        title: 'Project Not Found',
        description: 'The requested project could not be found.',
      }
    }
    
    return {
      title: `${project.title} | Portfolio`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        type: 'website',
      },
    }
  } catch (error) {
    return {
      title: 'Project | Portfolio',
      description: 'Project details',
    }
  }
}

// Server component - no "use client" directive
export default async function ProjectPage({ params }: { params: { slug: string } }) {
  try {
    const projects = await getEnhancedProjects()
    const project = projects.find((p) => p.slug === params.slug)
    
    if (!project) {
      notFound()
    }
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {project.description}
            </p>
            
            {/* Project Stats */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Star className="w-4 h-4" />
                <span>{project.github.stars} stars</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <GitFork className="w-4 h-4" />
                <span>{project.github.forks} forks</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Updated {formatDate(project.github.lastUpdated)}</span>
              </div>
              {project.github.language && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getLanguageColor(project.github.language) }}
                  />
                  <span>{project.github.language}</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {project.deploymentUrl && (
                <a
                  href={project.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              )}
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                View Code
              </a>
            </div>
          </div>
          
          {/* Technology Stack */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Topics */}
          {project.topics.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Topics</h2>
              <div className="flex flex-wrap gap-2">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Project Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</h3>
                  <p className="capitalize">{project.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</h3>
                  <p className="capitalize">{project.status}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Featured</h3>
                  <p>{project.featured ? 'Yes' : 'No'}</p>
                </div>
                {project.vercel && (
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Deployment</h3>
                    <p className={project.vercel.isLive ? 'text-green-600' : 'text-gray-500'}>
                      {project.vercel.isLive ? 'Live' : 'Not deployed'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Scores */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Project Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Deployment Score</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {project.deploymentScore}/100
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Activity Score</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {project.activityScore}/100
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Popularity Score</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {project.popularityScore}/100
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading project:', error)
    notFound()
  }
}