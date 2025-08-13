'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  message?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 z-50 bg-lux-offwhite dark:bg-lux-black flex items-center justify-center">
    <div className="text-center">
      <motion.div
        className="w-20 h-20 border-4 border-viva-magenta-500 border-t-transparent rounded-full mx-auto mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.h2
        className="text-2xl font-bold text-lux-gray-900 dark:text-lux-gray-50 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.h2>
      <motion.p
        className="text-viva-magenta-600 dark:text-viva-magenta-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Preparing your experience...
      </motion.p>
    </div>
  </div>
)

export default LoadingSpinner