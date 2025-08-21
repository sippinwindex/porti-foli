'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { Home, ArrowLeft, RotateCcw, Heart, Zap, ChevronDown, Play, Volume2, VolumeX } from 'lucide-react'

// Game interfaces
interface Obstacle {
  id: number
  x: number
  type: 'cactus' | 'rock' | 'bird'
  height: number
  width: number
  y: number
}

interface PowerUp {
  id: number
  x: number
  y: number
  type: 'shield' | 'magnet' | 'star'
  collected: boolean
}

interface Collectible {
  id: number
  x: number
  y: number
  collected: boolean
  value: number
}

export default function EnhancedSynthwave404() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<HTMLDivElement>(null)
  const dinoRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  
  // ✅ FIX: Add mounted state for SSR safety
  const [mounted, setMounted] = useState(false)
  
  // Scroll tracking
  const { scrollYProgress } = useScroll()
  const headerY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const gameY = useTransform(scrollYProgress, [0.3, 1], [100, 0])
  const gameOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1])

  // 404 Page states
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [clickCount, setClickCount] = useState(0)
  const [isDancing, setIsDancing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for smooth mouse following
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const dinoX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const dinoY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(dinoY, [-300, 300], [15, -15])
  const rotateY = useTransform(dinoX, [-300, 300], [-25, 25])
  const scale = useTransform(dinoX, [-300, 300], [0.8, 1.2])

  // Game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu')
  const [score, setScore] = useState(0)
  
  // ✅ FIX: Safe localStorage access
  const [highScore, setHighScore] = useState<number>(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // ✅ FIX: Initialize highScore safely after mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('synthwave-runner-high')
      setHighScore(savedHighScore ? parseInt(savedHighScore) : 0)
    }
  }, [])

  // Game objects using refs for real-time updates
  const playerY = useRef(0)
  const velocity = useRef(0)
  const isJumping = useRef(false)
  const isDucking = useRef(false)
  const obstacles = useRef<Obstacle[]>([])
  const powerUps = useRef<PowerUp[]>([])
  const collectibles = useRef<Collectible[]>([])
  const speed = useRef(6)
  const distance = useRef(0)
  const backgroundOffset = useRef(0)
  const groundOffset = useRef(0)

  // Power-up states
  const shieldActive = useRef(false)
  const shieldTimeLeft = useRef(0)
  const magnetActive = useRef(false)
  const magnetTimeLeft = useRef(0)

  // Game constants
  const GRAVITY = 0.8
  const JUMP_FORCE = useRef(-16)

  const GROUND_Y = 120
  const PLAYER_X = 100
  const PLAYER_WIDTH = 48
  const PLAYER_HEIGHT = 48
  const GAME_WIDTH = 800
  const GAME_HEIGHT = 400

  // ✅ FIX: Safe mouse movement tracking
  useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        
        setMousePosition({ x, y })
        mouseX.set(x * 0.1)
        mouseY.set(y * 0.1)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY, mounted])

  // Dinosaur click handler
  const handleDinoClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    
    if (newCount >= 5) {
      setIsDancing(true)
      setTimeout(() => {
        setIsDancing(false)
        setClickCount(0)
      }, 3000)
    }
  }

  // ✅ FIX: Safe sound effects
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled || !mounted || typeof window === 'undefined') return
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = type
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) { 
      console.log('Audio not supported') 
    }
  }, [soundEnabled, mounted])

  const playJumpSound = useCallback(() => playSound(523, 0.1, 'square'), [playSound])
  const playCollectSound = useCallback(() => playSound(880, 0.05, 'triangle'), [playSound])
  const playPowerUpSound = useCallback(() => playSound(660, 0.2, 'sine'), [playSound])
  const playHitSound = useCallback(() => playSound(200, 0.4, 'sawtooth'), [playSound])

  // Game initialization
  const initGame = useCallback(() => {
    setScore(0)
    playerY.current = 0
    velocity.current = 0
    isJumping.current = false
    isDucking.current = false
    obstacles.current = []
    powerUps.current = []
    collectibles.current = []
    speed.current = 6
    distance.current = 0
    backgroundOffset.current = 0
    groundOffset.current = 0
    shieldActive.current = false
    shieldTimeLeft.current = 0
    magnetActive.current = false
    magnetTimeLeft.current = 0
    lastTimeRef.current = 0
  }, [])

  const jump = useCallback(() => {
    if (!isJumping.current && playerY.current <= 5) {
      velocity.current = JUMP_FORCE.current
      isJumping.current = true
      playJumpSound()
    }
  }, [playJumpSound])

  const startDucking = useCallback(() => {
    if (!isJumping.current) {
      isDucking.current = true
    }
  }, [])

  const stopDucking = useCallback(() => {
    isDucking.current = false
  }, [])

  const startGame = useCallback(() => {
    initGame()
    setGameState('playing')
  }, [initGame])

  const restartGame = useCallback(() => {
    initGame()
    setGameState('playing')
  }, [initGame])

  // ✅ FIX: Safe input handling
  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'playing') {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault()
          jump()
        } else if (e.code === 'ArrowDown') {
          e.preventDefault()
          startDucking()
        }
      } else if (gameState === 'menu' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        startGame()
      } else if (gameState === 'gameOver' && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        restartGame()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        stopDucking()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState, jump, startDucking, stopDucking, startGame, restartGame, mounted])

  // Collision detection
  const checkCollision = useCallback((rect1: any, rect2: any) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    )
  }, [])

  // Main game loop
  const gameLoop = useCallback((currentTime: number) => {
    if (gameState !== 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop)
      return
    }

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = currentTime
      animationRef.current = requestAnimationFrame(gameLoop)
      return
    }

    const deltaTime = Math.min(currentTime - lastTimeRef.current, 50)
    const normalizedDelta = deltaTime / 16.67
    lastTimeRef.current = currentTime

    // Player physics
    velocity.current += GRAVITY * normalizedDelta
    playerY.current += velocity.current * normalizedDelta

    if (playerY.current <= 0) {
      playerY.current = 0
      velocity.current = 0
      isJumping.current = false
    }

    // Update game speed and visuals
    speed.current = Math.min(6 + distance.current * 0.001, 15)
    distance.current += speed.current * 0.1
    backgroundOffset.current = (backgroundOffset.current + speed.current * 0.5) % GAME_WIDTH
    groundOffset.current = (groundOffset.current + speed.current) % GAME_WIDTH

    // Spawn obstacles
    if (obstacles.current.length === 0 || 
        obstacles.current[obstacles.current.length - 1].x < GAME_WIDTH - 200 - Math.random() * 200) {
      if (Math.random() < 0.02) {
        const obstacleTypes: Array<{type: Obstacle['type'], width: number, height: number, y: number}> = [
          { type: 'cactus', width: 25, height: 50, y: GAME_HEIGHT - GROUND_Y - 50 },
          { type: 'rock', width: 30, height: 30, y: GAME_HEIGHT - GROUND_Y - 30 }
        ]

        if (distance.current > 500) {
          obstacleTypes.push({ type: 'bird', width: 35, height: 25, y: GAME_HEIGHT - GROUND_Y - 100 })
        }

        const obstacle = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]
        obstacles.current.push({
          id: Date.now(),
          x: GAME_WIDTH,
          ...obstacle
        })
      }
    }

    // Update obstacles
    obstacles.current = obstacles.current.filter(obstacle => {
      obstacle.x -= speed.current
      return obstacle.x > -100
    })

    // Spawn power-ups occasionally
    if (Math.random() < 0.003) {
      const types: PowerUp['type'][] = ['shield', 'magnet', 'star']
      powerUps.current.push({
        id: Date.now(),
        x: GAME_WIDTH,
        y: GAME_HEIGHT - GROUND_Y - 100 - Math.random() * 50,
        type: types[Math.floor(Math.random() * types.length)],
        collected: false
      })
    }

    // Update power-ups
    powerUps.current = powerUps.current.filter(powerUp => {
      powerUp.x -= speed.current
      return powerUp.x > -100
    })

    // Spawn collectibles
    if (Math.random() < 0.015) {
      collectibles.current.push({
        id: Date.now(),
        x: GAME_WIDTH,
        y: GAME_HEIGHT - GROUND_Y - 80 - Math.random() * 60,
        collected: false,
        value: 50
      })
    }

    // Update collectibles
    collectibles.current = collectibles.current.filter(collectible => {
      collectible.x -= speed.current
      return collectible.x > -100
    })

    // Collision detection
    const playerHeight = isDucking.current ? PLAYER_HEIGHT / 2 : PLAYER_HEIGHT
    const playerRect = {
      x: PLAYER_X,
      y: GAME_HEIGHT - GROUND_Y - playerHeight - playerY.current,
      width: PLAYER_WIDTH,
      height: playerHeight
    }

    // Check obstacle collisions (only if shield is not active)
    if (!shieldActive.current) {
      for (const obstacle of obstacles.current) {
        const obstacleRect = {
          x: obstacle.x,
          y: obstacle.y,
          width: obstacle.width,
          height: obstacle.height
        }

        if (checkCollision(playerRect, obstacleRect)) {
          playHitSound()
          setGameState('gameOver')
          if (score > highScore) {
            setHighScore(score)
            // ✅ FIX: Safe localStorage update
            if (typeof window !== 'undefined') {
              localStorage.setItem('synthwave-runner-high', score.toString())
            }
          }
          return
        }
      }
    }

    // Check power-up collisions
    const magnetRange = magnetActive.current ? 80 : 0
    powerUps.current.forEach(powerUp => {
      if (!powerUp.collected) {
        const dist = Math.hypot(
          powerUp.x + 15 - (playerRect.x + playerRect.width / 2),
          powerUp.y + 15 - (playerRect.y + playerRect.height / 2)
        )

        if (dist < 30 + magnetRange) {
          powerUp.collected = true
          playPowerUpSound()

          if (powerUp.type === 'shield') {
            shieldActive.current = true
            shieldTimeLeft.current = 5000
          } else if (powerUp.type === 'magnet') {
            magnetActive.current = true
            magnetTimeLeft.current = 8000
          } else if (powerUp.type === 'star') {
            setScore(s => s + 500)
          }
        }
      }
    })

    // Check collectible collisions
    collectibles.current.forEach(collectible => {
      if (!collectible.collected) {
        const dist = Math.hypot(
          collectible.x + 10 - (playerRect.x + playerRect.width / 2),
          collectible.y + 10 - (playerRect.y + playerRect.height / 2)
        )

        if (dist < 25 + magnetRange) {
          collectible.collected = true
          playCollectSound()
          setScore(s => s + collectible.value)
        }
      }
    })

    // Update power-up timers
    if (shieldActive.current) {
      shieldTimeLeft.current -= deltaTime
      if (shieldTimeLeft.current <= 0) {
        shieldActive.current = false
      }
    }

    if (magnetActive.current) {
      magnetTimeLeft.current -= deltaTime
      if (magnetTimeLeft.current <= 0) {
        magnetActive.current = false
      }
    }

    // Update score
    setScore(s => s + Math.floor(speed.current * 0.1))

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, score, highScore, checkCollision, playCollectSound, playHitSound, playPowerUpSound])

  // ✅ FIX: Safe game loop start
  useEffect(() => {
    if (!mounted) return
    
    animationRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameLoop, mounted])

  // Scroll functions
  const scrollToGame = () => {
    gameRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle game clicks
  const handleGameClick = () => {
    if (gameState === 'menu') startGame()
    else if (gameState === 'playing') jump()
    else if (gameState === 'gameOver') restartGame()
  }

  // ✅ FIX: Show loading state during SSR
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <p className="text-cyan-300 text-lg">Loading synthwave experience...</p>
        </div>
      </div>
    )
  }

  // Rest of your component JSX remains exactly the same...
  return (
    <div className="min-h-[200vh] overflow-x-hidden">
      {/* Your existing JSX content here */}
      {/* 404 Hero Section */}
      <motion.section 
        ref={containerRef}
        style={{ 
          y: headerY, 
          opacity: headerOpacity,
          background: `
            radial-gradient(ellipse at top, rgba(255, 0, 255, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(0, 255, 255, 0.3) 0%, transparent 50%),
            linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%)
          `
        }}
        className="min-h-screen overflow-hidden relative"
      >
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          
          {/* 404 Title */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-8xl md:text-9xl font-black bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent"
          >
            404
          </motion.h1>

          {/* Synthwave Dinosaur */}
          <motion.div
            ref={dinoRef}
            className="relative cursor-pointer mb-8 w-48 h-48 md:w-64 md:h-64"
            style={{ rotateX, rotateY, scale }}
            onClick={handleDinoClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Dinosaur content */}
            <div className="w-full h-full bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 rounded-3xl border-4 border-white/30" />
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              SYSTEM ERROR: PAGE NOT FOUND
            </h2>
            <p className="text-cyan-300 text-lg max-w-md mx-auto leading-relaxed mb-4">
              The page you're looking for has been consumed by the retro void. 
              Click the dino to make it dance! ({clickCount}/5)
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <motion.a
              href="/"
              className="px-8 py-3 font-bold text-black bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 rounded-lg border-2 border-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5 inline mr-2" />
              RETURN HOME
            </motion.a>

            <motion.button
              onClick={scrollToGame}
              className="px-8 py-3 font-bold text-cyan-300 bg-transparent rounded-lg border-2 border-cyan-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="w-5 h-5 inline mr-2" />
              PLAY GAME
            </motion.button>

            <motion.button
              onClick={() => typeof window !== 'undefined' && window.history.back()}
              className="px-8 py-3 font-bold text-pink-300 bg-transparent rounded-lg border-2 border-pink-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              GO BACK
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p className="text-cyan-400 mb-4 text-sm font-mono">
              Scroll down to enter the synthwave dimension
            </p>
            <motion.button
              onClick={scrollToGame}
              className="p-3 rounded-full border border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-cyan-400" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Rest of your game section JSX... */}
      {/* Add all the remaining JSX from your original component here */}
    </div>
  )
}