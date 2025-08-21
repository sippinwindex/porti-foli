'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ProjectDetailsProps {
  project: {
    slug: string
    title: string
    description: string
    content: string
  }
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Project Details
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Current theme: <span className="font-mono">{theme}</span>
      </p>
      
      <div className="space-y-2">
        <p><strong>Slug:</strong> {project.slug}</p>
        <p><strong>Title:</strong> {project.title}</p>
        <p><strong>Description:</strong> {project.description}</p>
      </div>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
      >
        Toggle Theme
      </button>
    </div>
  )
}