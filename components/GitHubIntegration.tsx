// components/GitHubIntegration.tsx - FIXED: Using merged utils
import React, { useState, useEffect } from 'react'
import { AlertCircle, GitBranch, Star, GitFork, ExternalLink, Calendar } from 'lucide-react'
import { toBoolean, formatDateGitHub, getLanguageColor } from '@/lib/utils'

interface GitHubRepository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  topics: string[]
  homepage: string | null
  has_pages: boolean
}

interface GitHubIntegrationProps {
  username?: string
  maxRepos?: number
  showStats?: boolean | string  // Fixed: Allow string for query params
  className?: string
}

export default function GitHubIntegration({ 
  username = 'sippinwindex', 
  maxRepos = 6,
  showStats = true,
  className = ''
}: GitHubIntegrationProps) {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Convert showStats to boolean using utility function
  const shouldShowStats = toBoolean(showStats)

  useEffect(() => {
    async function fetchRepositories() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/github/repositories?username=${username}&limit=${maxRepos}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch repositories: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          setRepositories(data.repositories || [])
        } else {
          throw new Error(data.message || 'Failed to fetch repositories')
        }
      } catch (err) {
        console.error('GitHub integration error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchRepositories()
  }, [username, maxRepos])

  if (loading) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <GitBranch className="w-5 h-5 animate-spin" />
          <span>Loading repositories...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
      </div>
    )
  }

  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {shouldShowStats && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <GitBranch className="w-5 h-5 mr-2" />
            GitHub Repositories
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {repositories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Repositories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {totalStars}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stars</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalForks}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Forks</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="grid gap-4">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      {repo.name}
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </h4>
                  {repo.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {repo.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  {repo.language && (
                    <div className="flex items-center space-x-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      <span className="text-gray-600 dark:text-gray-400">
                        {repo.language}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Star className="w-4 h-4" />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <GitFork className="w-4 h-4" />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {formatDateGitHub(repo.updated_at)}</span>
                </div>
              </div>
              
              {repo.topics && repo.topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {repo.topics.slice(0, 5).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                  {repo.topics.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{repo.topics.length - 5} more
                    </span>
                  )}
                </div>
              )}
              
              {repo.homepage && (
                <div className="mt-2">
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline text-sm flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Live Demo
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {repositories.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No repositories found
          </div>
        )}
        
        {repositories.length > 0 && (
          <div className="mt-6 text-center">
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              View all repositories on GitHub
            </a>
          </div>
        )}
      </div>
    </div>
  )
}