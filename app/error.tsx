'use client'

import { useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-muted-foreground mb-8">
            An error occurred while loading this page.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
      <Footer />
    </>
  )
}