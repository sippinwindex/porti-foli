// components/GitHubAPITest.tsx
'use client'

import { useState, useEffect } from 'react'
import { Github, Star, GitFork, ExternalLink, AlertCircle, CheckCircle, X } from 'lucide-react'

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  topics: string[]
  homepage: string | null
  private: boolean
  fork: boolean
  archived: boolean
}

export default function GitHubAPITest() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [testResults, setTestResults] = useState<{
    userAPI: boolean
    reposAPI: boolean
    tokenValid: boolean
    repoCount: number
  }>({
    userAPI: false,
    reposAPI: false,
    tokenValid: false,
    repoCount: 0
  })

  useEffect(() => {
    runGitHubAPITests()
  }, [])

  const runGitHubAPITests = async () => {
    setLoading(true)
    setError(null)
    
    const results = {
      userAPI: false,
      reposAPI: false,
      tokenValid: false,
      repoCount: 0
    }

    try {
      console.log('🧪 Testing GitHub API endpoints...')
      
      // Test 1: Check if API test endpoint works
      console.log('📍 Testing API infrastructure...')
      const testRes = await fetch('/api/test')
      if (testRes.ok) {
        const testData = await testRes.json()
        console.log('✅ API infrastructure working:', testData)
        results.tokenValid = testData.env?.hasGitHubToken || false
      }

      // Test 2: Test GitHub user endpoint
      console.log('📍 Testing GitHub user API...')
      const userRes = await fetch('/api/github?type=user')
      if (userRes.ok) {
        const userData = await userRes.json()
        console.log('✅ GitHub user API working:', userData.name || userData.login)
        setUser(userData)
        results.userAPI = true
      } else {
        const errorData = await userRes.json().catch(() => ({ error: `HTTP ${userRes.status}` }))
        console.error('❌ GitHub user API failed:', errorData)
        throw new Error(`User API failed: ${errorData.error || userRes.status}`)
      }

      // Test 3: Test GitHub repos endpoint
      console.log('📍 Testing GitHub repos API...')
      const reposRes = await fetch('/api/github?type=repos')
      if (reposRes.ok) {
        const reposData = await reposRes.json()
        console.log('✅ GitHub repos API working:', `${reposData.length} repositories`)
        
        // Filter repos for portfolio
        const portfolioRepos = reposData.filter((repo: GitHubRepo) => 
          !repo.fork && 
          !repo.archived && 
          !repo.private &&
          repo.description &&
          !repo.name.match(/^(\.github|config|dotfiles|profile)$/i)
        )
        
        setRepos(portfolioRepos)
        results.reposAPI = true
        results.repoCount = portfolioRepos.length
        
        console.log(`📊 Portfolio-worthy repos: ${portfolioRepos.length}/${reposData.length}`)
        
        // Log first few repos for inspection
        portfolioRepos.slice(0, 3).forEach((repo: GitHubRepo) => {
          console.log(`📁 ${repo.name}: ${repo.description?.slice(0, 50)}...`)
        })
        
      } else {
        const errorData = await reposRes.json().catch(() => ({ error: `HTTP ${reposRes.status}` }))
        console.error('❌ GitHub repos API failed:', errorData)
        throw new Error(`Repos API failed: ${errorData.error || reposRes.status}`)
      }

      // Test 4: Test projects API endpoint
      console.log('📍 Testing projects integration API...')
      const projectsRes = await fetch('/api/projects')
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        console.log('✅ Projects API working:', `${projectsData.projects?.length || 0} projects`)
      } else {
        console.warn('⚠️ Projects API failed, but GitHub APIs work')
      }

      setTestResults(results)
      
    } catch (err) {
      console.error('❌ GitHub API Test Failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setTestResults(results)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 w-96 max-h-[80vh] overflow-y-auto bg-card border border-border rounded-xl shadow-xl z-50">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            <h3 className="font-semibold">GitHub API Test</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Running tests...
          </div>
        )}
        
        {!loading && (
          <div className="space-y-2">
            <TestResult 
              label="GitHub Token" 
              passed={testResults.tokenValid}
              details={testResults.tokenValid ? "Token configured" : "No token found"}
            />
            <TestResult 
              label="User API" 
              passed={testResults.userAPI}
              details={user ? `Loaded: ${user.name || user.login}` : "Failed to load user"}
            />
            <TestResult 
              label="Repos API" 
              passed={testResults.reposAPI}
              details={`Found ${testResults.repoCount} portfolio repos`}
            />
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        
        <button
          onClick={runGitHubAPITests}
          disabled={loading}
          className="mt-3 w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Retest APIs'}
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar_url} 
              alt={user.name || user.login}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium">{user.name || user.login}</div>
              <div className="text-sm text-muted-foreground">
                {user.public_repos} repos • {user.followers} followers
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Repository List */}
      {repos.length > 0 && (
        <div className="p-4">
          <h4 className="font-medium mb-3">Portfolio Repositories ({repos.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {repos.slice(0, 10).map((repo) => (
              <div key={repo.id} className="p-2 bg-muted/50 rounded text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-primary">{repo.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      {repo.forks_count}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {repo.description?.slice(0, 80)}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {repo.language && (
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                        {repo.language}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(repo.updated_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TestResult({ label, passed, details }: { 
  label: string
  passed: boolean
  details: string 
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {passed ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-500" />
      )}
      <span className={passed ? "text-green-600" : "text-red-600"}>
        {label}
      </span>
      <span className="text-muted-foreground text-xs">
        {details}
      </span>
    </div>
  )
}