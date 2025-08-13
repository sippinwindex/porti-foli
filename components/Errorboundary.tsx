'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-lux-offwhite dark:bg-lux-black flex items-center justify-center text-center p-8">
          <div className="max-w-md">
            <motion.div
              className="flex justify-center mb-6"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-16 h-16 text-viva-magenta-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-lux-gray-900 dark:text-lux-gray-50 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-lux-gray-600 dark:text-lux-gray-400 mb-6">
              Don't worry, even the best applications have hiccups. Let's get you back on track!
            </p>
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-5 h-5" />
              Restart
            </motion.button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary