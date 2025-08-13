import Navigation from '@/components/Navigation' // FIX: Changed from { Navigation }
import { AnimatedHero } from '@/components/AnimatedHero'
import Footer from '@/components/Footer' // FIX: Changed from { Footer }
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { mockProjects, mockStats } from '@/lib/mock-data'
import type { Project } from '@/lib/mock-data'

// Dynamic imports for 3D components to avoid SSR issues
const Interactive3DHero = dynamic(
  () => import('@/components/3D/Interactive3DHero'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen bg-gradient-to-br from-lux-offwhite to-viva-magenta-50/20 dark:from-lux-black dark:to-viva-magenta-900/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-viva-magenta-500"></div>
      </div>
    )
  }
)

const ScrollTriggered3DSections = dynamic(
  () => import('@/components/3D/ScrollTriggered3DSections'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-lux-gray-50 to-lux-gold-50/20 dark:from-lux-gray-900 dark:to-lux-gold-900/10 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-64 h-8 bg-viva-magenta-200 dark:bg-viva-magenta-800 rounded mb-4 mx-auto"></div>
          <div className="w-96 h-6 bg-lux-gray-200 dark:bg-lux-gray-700 rounded mx-auto"></div>
        </div>
      </div>
    )
  }
)

export default function HomePage() {
  // Type-safe project filtering
  const featuredProjects: Project[] = mockProjects.filter(project => project.featured)
  const heroProjects: Project[] = mockProjects.slice(0, 8)

  return (
    <>
      <Navigation />
      <main className="relative">
        {/* 3D Interactive Hero Section */}
        <Suspense fallback={
          <div className="h-screen bg-gradient-to-br from-lux-offwhite to-viva-magenta-50/20 dark:from-lux-black dark:to-viva-magenta-900/10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-viva-magenta-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lux-gray-600 dark:text-lux-gray-400">Loading 3D Experience...</p>
            </div>
          </div>
        }>
          <Interactive3DHero projects={heroProjects} />
        </Suspense>

        {/* Scroll-Triggered 3D Sections */}
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-lux-gray-50 to-lux-gold-50/20 dark:from-lux-gray-900 dark:to-lux-gold-900/10 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-lux-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lux-gray-600 dark:text-lux-gray-400">Loading Projects...</p>
            </div>
          </div>
        }>
          <ScrollTriggered3DSections projects={mockProjects} stats={mockStats} />
        </Suspense>

        {/* Fallback to regular hero if 3D fails */}
        <noscript>
          <AnimatedHero />
        </noscript>
      </main>
      <Footer />
    </>
  )
}