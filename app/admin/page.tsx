// Move these exports to the VERY TOP - before any other code
export const dynamic = 'force-dynamic'
export const revalidate = false

'use client'

import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import ProjectEditModal from '@/components/ProjectEditModal'
import { getSmartProjects, SmartProjectData } from '@/lib/smart-project-manager'

// Simple password protection
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'your-secret-password-123'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [projects, setProjects] = useState<SmartProjectData[]>([])
  const [selectedProject, setSelectedProject] = useState<SmartProjectData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  // Auto-authenticate in development
  useEffect(() => {
    if (isDevelopment) {
      setIsAuthenticated(true)
      loadProjects()
    } else {
      // Check if already authenticated in session
      const sessionAuth = sessionStorage.getItem('admin-auth')
      if (sessionAuth === 'true') {
        setIsAuthenticated(true)
        loadProjects()
      }
    }
  }, [isDevelopment])

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin-auth', 'true')
      loadProjects()
    } else {
      alert('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin-auth')
    setPassword('')
  }

  const loadProjects = async () => {
    setLoading(true)
    try {
      const projectData = await getSmartProjects()
      setProjects(projectData)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (project: SmartProjectData) => {
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  const handleSaveProject = () => {
    setIsEditModalOpen(false)
    loadProjects() // Refresh the list
  }

  // Redirect in production if not on localhost or vercel preview
  useEffect(() => {
    if (typeof window !== 'undefined' && !isDevelopment) {
      const hostname = window.location.hostname
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
      const isVercelPreview = hostname.includes('vercel.app')
      const isYourDomain = hostname === 'juanfernandez.dev' // Replace with your domain
      
      // Only allow access from specific sources
      if (!isLocalhost && !isVercelPreview && !isYourDomain) {
        redirect('/')
      }
    }
  }, [isDevelopment])

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Portfolio Admin
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Enter password to access admin panel
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Access Admin Panel
              </button>
            </div>

            {isDevelopment && (
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Development Mode:</strong> Admin access is automatically granted in development.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Admin interface
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Portfolio Admin
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your project portfolio
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={loadProjects}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {project.customizable.customDescription || project.description}
                      </p>
                    </div>
                    {(project.customizable.featured ?? project.autoGenerated.featured) && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>⭐ {project.githubData.stars}</span>
                    <span>🍴 {project.githubData.forks}</span>
                    <span className="capitalize">{project.customizable.category || project.autoGenerated.category}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.autoGenerated.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {project.vercelData?.isLive && (
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Score: {project.autoGenerated.deploymentScore}
                      </span>
                    </div>

                    <button
                      onClick={() => openEditModal(project)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <ProjectEditModal
        project={selectedProject}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  )
}