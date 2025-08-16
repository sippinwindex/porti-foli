'use client'

// app/dino-game/page.tsx
'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Zap, Shield, Star, Magnet } from 'lucide-react'
import Link from 'next/link'

// Re-implement the dino game directly in the page to avoid import issues
export default function DinoGamePage() {
  const gameRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  // Initialize high score from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('synthwave-runner-high')
      if (saved) setHighScore(parseInt(saved))
    }
  }, [])

  const startGame = () => {
    setScore(0)
    setGameState('playing')
  }

  const gameOver = () => {
    setGameState('gameOver')
    if (score > highScore) {
      setHighScore(score)
      if (typeof window !== 'undefined') {
        localStorage.setItem('synthwave-runner-high', score.toString())
      }
    }
  }

  const handleClick = () => {
    if (gameState === 'menu') {
      startGame()
    } else if (gameState === 'gameOver') {
      startGame()
    } else if (gameState === 'playing') {
      // Jump logic would go here
      setScore(prev => prev + 10)
      
      // Simple game over simulation for demo
      if (Math.random() < 0.1) {
        gameOver()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-50 p-6"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link 
            href="/"
            className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors group"
          >
            <motion.div
              whileHover={{ x: -5 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.div>
            <span className="font-semibold">Back to Portfolio</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent">
                Synthwave Runner
              </h1>
              <p className="text-sm text-gray-400">Professional Endless Runner</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Game Container */}
      <motion.main 
        className="flex flex-col items-center justify-center px-4 py-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-6xl h-[600px] relative">
          <div 
            ref={gameRef}
            onClick={handleClick}
            className="w-full h-full overflow-hidden relative cursor-pointer select-none rounded-2xl border-2 border-white/20 shadow-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
          >
            {/* Game UI */}
            <div className="absolute top-4 left-4 z-30 text-white font-mono space-y-1">
              <p className="text-2xl drop-shadow-lg">{score.toLocaleString()}</p>
              <p className="text-sm opacity-80">HI: {highScore.toLocaleString()}</p>
            </div>

            {/* Game State Overlay */}
            {gameState !== 'playing' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/60 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-center space-y-6"
                >
                  <h1 className={`text-6xl font-bold bg-gradient-to-r ${gameState === 'gameOver' ? 'from-red-500 via-yellow-500 to-orange-500' : 'from-pink-500 via-cyan-500 to-yellow-500'} bg-clip-text text-transparent`}>
                    {gameState === 'menu' ? 'SYNTHWAVE RUNNER' : 'GAME OVER'}
                  </h1>
                  {gameState === 'menu' && <p className="text-cyan-300 text-lg">Click to start the endless runner!</p>}
                  {gameState === 'gameOver' && <div className="text-white text-xl">Final Score: {score.toLocaleString()}</div>}
                  <motion.button 
                    onClick={handleClick} 
                    className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-lg font-bold text-lg backdrop-blur-md" 
                    whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={24} />
                    {gameState === 'menu' ? 'START GAME' : 'PLAY AGAIN'}
                  </motion.button>
                </motion.div>
              </div>
            )}

            {/* Simple Game Visual */}
            {gameState === 'playing' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 rounded-lg"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            )}

            {/* Scanline effect */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-5" 
              style={{ 
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)` 
              }} 
            />
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <motion.button
            onClick={handleClick}
            className="btn-primary px-6 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {gameState === 'menu' ? 'Start Game' : gameState === 'playing' ? 'Click to Jump!' : 'Play Again'}
          </motion.button>
          
          <motion.button
            onClick={() => setGameState('menu')}
            className="btn-secondary px-6 py-3 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>

          <Link href="/">
            <motion.button
              className="btn-ghost px-6 py-3 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              Home
            </motion.button>
          </Link>
        </div>

        {/* Instructions */}
        <motion.div
          className="text-center mt-8 text-gray-400 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="mb-2"><strong>Controls:</strong> Click anywhere to jump and score points!</p>
          <p><strong>Objective:</strong> This is a simplified demo version of the synthwave runner game.</p>
        </motion.div>
      </motion.main>

      {/* Custom CSS */}
      <style jsx>{`
        .btn-primary {
          background: linear-gradient(135deg, #ec4899, #f59e0b);
          color: white;
          border: none;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          box-shadow: 0 10px 30px rgba(236, 72, 153, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: #f59e0b;
          border: 2px solid #f59e0b;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: rgba(245, 158, 11, 0.1);
        }

        .btn-ghost {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .btn-ghost:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}