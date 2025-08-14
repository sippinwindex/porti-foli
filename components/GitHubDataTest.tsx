// components/GitHubDataTest.tsx
'use client'

import { useState, useEffect } from 'react'

export default function GitHubDataTest() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('🔄 Testing GitHub API...')
        
        // Test the debug endpoint first
        const debugRes = await fetch('/api/debug')
        if (debugRes.ok) {
          const debugData = await debugRes.json()
          console.log('🔍 Debug data:', debugData)
        }

        // Test the actual GitHub endpoint
        const githubRes = await fetch('/api/github?type=user')
        if (!githubRes.ok) {
          throw new Error(`GitHub API failed: ${githubRes.status}`)
        }
        
        const userData = await githubRes.json()
        console.log('✅ GitHub user data:', userData)
        
        // Test repos endpoint
        const reposRes = await fetch('/api/github?type=repos')
        if (!reposRes.ok) {
          throw new Error(`Repos API failed: ${reposRes.status}`)
        }
        
        const reposData = await reposRes.json()
        console.log('✅ GitHub repos data:', reposData)
        
        setData({
          user: userData,
          repos: reposData,
          repoCount: reposData.length
        })
        
      } catch (err) {
        console.error('❌ Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="fixed top-4 left-4 bg-blue-500 text-white p-4 rounded-lg z-50">
        🔄 Testing GitHub API...
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed top-4 left-4 bg-red-500 text-white p-4 rounded-lg z-50 max-w-md">
        ❌ Error: {error}
        <br />
        <small>Check console for details</small>
      </div>
    )
  }

  return (
    <div className="fixed top-4 left-4 bg-green-500 text-white p-4 rounded-lg z-50 max-w-md">
      ✅ GitHub API Working!
      <br />
      User: {data?.user?.name}
      <br />
      Repos: {data?.repoCount}
      <br />
      <small>Check console for full data</small>
    </div>
  )
}