'use client'
import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Code, Zap, Palette, Globe } from 'lucide-react'

interface PageLoadingProps {
  onComplete?: () => void
  minDuration?: number
  maxDuration?: number
}

export default function PageLoading({ 
  onComplete, 
  minDuration = 800, 
  maxDuration = 1500 
}: PageLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing...')
  const [currentIcon, setCurrentIcon] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  const loadingMessages = [
    { text: 'Initializing...', icon: Code },
    { text: 'Loading Components...', icon: Zap },
    { text: 'Preparing Experience...', icon: Palette },
    { text: 'Almost Ready...', icon: Globe }
  ]

  // ✅ FIXED: Optimized loading sequence
  useEffect(() => {
    const duration = shouldReduceMotion ? minDuration : maxDuration
    const steps = loadingMessages.length
    const stepDuration = duration / steps
    
    let currentStep = 0
    
    const interval = setInterval(() => {
      currentStep++
      
      if (currentStep <= steps) {
        const messageIndex = Math.min(currentStep - 1, steps - 1)
        setLoadingText(loadingMessages[messageIndex].text)
        setCurrentIcon(messageIndex)
        setProgress((currentStep / steps) * 100)
      }
      
      if (currentStep >= steps) {
        clearInterval(interval)
        // Complete loading after a brief delay
        setTimeout(() => {
          onComplete?.()
        }, 200)
      }
    }, stepDuration)
    
    return () => clearInterval(interval)
  }, [shouldReduceMotion, minDuration, maxDuration, onComplete])

  const CurrentIcon = loadingMessages[currentIcon]?.icon || Code

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ✅ FIXED: Optimized background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(190, 52, 85, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="relative text-center max-w-md mx-auto px-6">
        {/* ✅ FIXED: Optimized loading spinner */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto relative">
            {/* Main spinner */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent"
              style={{
                borderTopColor: '#BE3455',
                borderRightColor: 'rgba(190, 52, 85, 0.3)',
                borderBottomColor: 'transparent',
                borderLeftColor: 'rgba(190, 52, 85, 0.1)'
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: shouldReduceMotion ? 2 : 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Secondary spinner */}
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: '#D4AF37',
                borderBottomColor: 'rgba(212, 175, 55, 0.2)'
              }}
              animate={{ rotate: -360 }}
              transition={{
                duration: shouldReduceMotion ? 3 : 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                key={currentIcon}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CurrentIcon 
                  className="w-8 h-8 text-white"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(190, 52, 85, 0.5))' }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Loading text and progress */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Loading message */}
          <motion.h2
            key={loadingText}
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ textShadow: '0 0 20px rgba(190, 52, 85, 0.3)' }}
          >
            {loadingText}
          </motion.h2>

          {/* Progress bar */}
          <div className="w-full">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #BE3455 0%, #D4AF37 100%)',
                  boxShadow: '0 0 10px rgba(190, 52, 85, 0.5)'
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: shouldReduceMotion ? 2 : 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating particles */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}