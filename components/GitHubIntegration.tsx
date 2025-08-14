// components/GitHubIntegration.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, Star, GitFork, ExternalLink, Calendar } from 'lucide-react'

interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
  topics: string[]
  homepage: string | null
}

interface GitHubUser {
  login: string
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  avatar_url: string
}

export const GitHubIntegration: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔄 Fetching GitHub data from API routes...')
        
        // Fetch user data from our API route
        const userResponse = await fetch('/api/github?type=user')
        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user data: ${userResponse.status}`)
        }
        const userData = await userResponse.json()
        setUser(userData)
        console.log('✅ User data loaded:', userData.name)

        // Fetch repositories from our API route
        const reposResponse = await fetch('/api/github?type=featured')
        if (!reposResponse.ok) {
          throw new Error(`Failed to fetch repositories: ${reposResponse.status}`)
        }
        const reposData = await reposResponse.json()
        setRepos(reposData)
        console.log('✅ Repositories loaded:', reposData.length)

      } catch (err) {
        console.error('❌ GitHub integration error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      HTML: '#e34c26',
      CSS: '#1572B6'
    }
    return colors[language] || '#858585'
  }

  if (loading) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              GitHub Integration
            </h2>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading GitHub data...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">GitHub Integration</h2>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 dark:text-red-400">
                Failed to load GitHub data: {error}
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            Open Source
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {' '}Contributions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Check out my latest projects and contributions on GitHub
          </p>
        </motion.div>

        {/* GitHub Profile Stats */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="bg-card rounded-2xl p-8 shadow-lg border max-w-md w-full">
              <div className="text-center">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary/20"
                />
                <h3 className="text-xl font-bold mb-2">
                  {user.name || user.login}
                </h3>
                {user.bio && (
                  <p className="text-muted-foreground mb-4">{user.bio}</p>
                )}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {user.public_repos}
                    </div>
                    <div className="text-sm text-muted-foreground">Repos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {user.followers}
                    </div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {user.following}
                    </div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold truncate">
                  {repo.name}
                </h3>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {repo.description || 'No description available'}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {repo.language && (
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {repo.stargazers_count}
                  </div>
                  <div className="flex items-center">
                    <GitFork className="w-4 h-4 mr-1" />
                    {repo.forks_count}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Updated {formatDate(repo.updated_at)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://github.com/sippinwindex"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5 mr-2" />
            <span>View All Repositories</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default GitHubIntegration