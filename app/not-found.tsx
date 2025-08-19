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
  const [highScore, setHighScore] = useState<number>(() => {
    return typeof window !== 'undefined' ? parseInt(localStorage.getItem('synthwave-runner-high') || '0') : 0
  })
  const [soundEnabled, setSoundEnabled] = useState(true)

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
  // ✅ FIXED: Convert JUMP_FORCE to a ref instead of const to avoid dependency issues
  const JUMP_FORCE = useRef(-16)

  const GROUND_Y = 120
  const PLAYER_X = 100
  const PLAYER_WIDTH = 48
  const PLAYER_HEIGHT = 48
  const GAME_WIDTH = 800
  const GAME_HEIGHT = 400

  // Mouse movement tracking for 404 page
  useEffect(() => {
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
  }, [mouseX, mouseY])

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

  // Sound effects
  const playSound = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
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
  }, [soundEnabled])

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

  // ✅ FIXED: Access JUMP_FORCE via ref to avoid dependency issues
  const jump = useCallback(() => {
    if (!isJumping.current && playerY.current <= 5) {
      velocity.current = JUMP_FORCE.current // ✅ Access via ref
      isJumping.current = true
      playJumpSound()
    }
  }, [playJumpSound]) // ✅ Only include playJumpSound dependency

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

  // Input handling
  useEffect(() => {
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
  }, [gameState, jump, startDucking, stopDucking, startGame, restartGame])

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

  // Start game loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameLoop])

  // Scroll functions
  const scrollToGame = () => {
    gameRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle game clicks
  const handleGameClick = () => {
    if (gameState === 'menu') startGame()
    else if (gameState === 'playing') jump()
    else if (gameState === 'gameOver') restartGame()
  }

  // Rest of the component remains the same...
  return (
    <div className="min-h-[200vh] overflow-x-hidden">
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
              onClick={() => window.history.back()}
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

      {/* Synthwave Runner Game Section */}
      <motion.section
        ref={gameRef}
        style={{ 
          y: gameY, 
          opacity: gameOpacity,
          background: 'linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%)'
        }}
        className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      >
        {/* Game Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent">
            🎮 SYNTHWAVE RUNNER
          </h2>
          <p className="text-lg text-cyan-300">
            Professional endless runner in the neon void!
          </p>
        </motion.div>

        {/* Game Container */}
        <motion.div
          className="w-full max-w-4xl relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div 
            className="w-full h-96 overflow-hidden relative cursor-pointer select-none rounded-2xl border-2 border-cyan-500/50" 
            onClick={handleGameClick}
            style={{ 
              background: 'linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%)',
              boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)'
            }}
          >
            {/* Game Grid Background */}
            <div 
              className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: `linear-gradient(90deg, #ff00ff 1px, transparent 1px), linear-gradient(180deg, #00ffff 1px, transparent 1px)`, 
                backgroundSize: '50px 50px', 
                width: `${GAME_WIDTH*2}px`, 
                transform: `translate(-${backgroundOffset.current}px, 0)` 
              }} 
            />

            {/* Game UI */}
            <div className="absolute top-4 left-4 z-30 text-white font-mono space-y-1">
              <p className="text-2xl drop-shadow-lg">{score.toLocaleString()}</p>
              <p className="text-sm opacity-80">HI: {highScore.toLocaleString()}</p>
              <p className="text-sm opacity-80">{Math.floor(distance.current)}m</p>
            </div>

            <div className="absolute top-4 right-4 z-30 flex gap-2">
              <motion.button 
                onClick={(e) => {
                  e.stopPropagation()
                  setSoundEnabled(!soundEnabled)
                }} 
                className="p-2 bg-black/30 rounded-full border border-cyan-500/50" 
                whileHover={{ scale: 1.1 }}
              >
                {soundEnabled ? <Volume2 size={20} className="text-cyan-400" /> : <VolumeX size={20} className="text-gray-400" />}
              </motion.button>

              {/* Power-up indicators */}
              {shieldActive.current && (
                <div className="p-2 bg-green-500/20 rounded-full border border-green-500">
                  <div className="text-green-400 text-xs">{Math.ceil(shieldTimeLeft.current / 1000)}s</div>
                </div>
              )}
              {magnetActive.current && (
                <div className="p-2 bg-purple-500/20 rounded-full border border-purple-500">
                  <div className="text-purple-400 text-xs">{Math.ceil(magnetTimeLeft.current / 1000)}s</div>
                </div>
              )}
            </div>

            {/* Game Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-32 z-10">
              <div 
                className="h-full" 
                style={{ 
                  backgroundImage: `url('data:image/svg+xml;utf8,<svg width="60" height="128" viewBox="0 0 60 128" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 120h60" stroke="%2300ffff" stroke-width="2"/><path d="M0 118h60" stroke="%23ff00ff" stroke-width="1" stroke-dasharray="1 4"/></g></svg>')`, 
                  backgroundRepeat: 'repeat-x', 
                  width: `${GAME_WIDTH * 2}px`, 
                  transform: `translateX(-${groundOffset.current}px)`, 
                  position: 'absolute', 
                  bottom: 0, 
                  height: '100%' 
                }} 
              />
            </div>

            {/* Game Player */}
            <div 
              style={{ 
                position: 'absolute', 
                zIndex: 20, 
                left: `${PLAYER_X}px`, 
                bottom: `${GROUND_Y + playerY.current}px`, 
                width: `${PLAYER_WIDTH}px`, 
                height: `${isDucking.current ? PLAYER_HEIGHT / 2 : PLAYER_HEIGHT}px`,
                transition: 'height 0.1s ease'
              }}
            >
              {/* Shield effect */}
              {shieldActive.current && (
                <div className="absolute inset-0 -m-2 rounded-full border-2 border-green-400 animate-pulse" />
              )}
              
              {/* Magnet effect */}
              {magnetActive.current && (
                <div className="absolute inset-0 -m-4 rounded-full border-2 border-purple-400 animate-pulse opacity-60" />
              )}
              
              <div className="w-full h-full bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 rounded-lg border-2 border-white/30" />
            </div>

            {/* Game Obstacles */}
            {obstacles.current.map(o => (
              <div 
                key={o.id} 
                className="absolute z-10" 
                style={{
                  left: `${o.x}px`, 
                  bottom: `${GAME_HEIGHT - o.y - o.height}px`, 
                  width: `${o.width}px`, 
                  height: `${o.height}px`,
                  filter: `drop-shadow(0 0 8px #ff00ff)`
                }}
              >
                {o.type === 'cactus' && (
                  <div className="w-full h-full bg-gradient-to-t from-green-700 to-green-500 rounded-t-lg border-2 border-green-300" />
                )}
                {o.type === 'rock' && (
                  <div className="w-full h-full bg-gradient-to-t from-gray-700 to-gray-500 rounded border-2 border-gray-300" />
                )}
                {o.type === 'bird' && (
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-yellow-500 rounded-full border-2 border-yellow-300" />
                )}
              </div>
            ))}

            {/* Power-ups */}
            {powerUps.current.filter(p => !p.collected).map(p => (
              <motion.div 
                key={p.id} 
                className="absolute z-15" 
                style={{
                  left: `${p.x}px`, 
                  bottom: `${GAME_HEIGHT - p.y - 30}px`, 
                  width: '30px', 
                  height: '30px'
                }}
                animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded border-2 border-yellow-300 flex items-center justify-center text-white font-bold">
                  {p.type === 'shield' && '🛡'}
                  {p.type === 'magnet' && '🧲'}
                  {p.type === 'star' && '⭐'}
                </div>
              </motion.div>
            ))}

            {/* Collectibles */}
            {collectibles.current.filter(c => !c.collected).map(c => (
              <motion.div 
                key={c.id} 
                className="absolute z-15" 
                style={{
                  left: `${c.x}px`, 
                  bottom: `${GAME_HEIGHT - c.y - 20}px`, 
                  width: '20px', 
                  height: '20px'
                }}
                animate={{ rotate: 360, y: [-5, 5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-full h-full bg-yellow-400 rounded-full border border-yellow-300 flex items-center justify-center text-xs">
                  ★
                </div>
              </motion.div>
            ))}

            {/* Game Menu Overlay */}
            {gameState !== 'playing' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/60 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-center space-y-6"
                >
                  <h1 className={`text-6xl font-bold bg-gradient-to-r ${gameState === 'gameOver' ? 'from-red-500 via-yellow-500 to-orange-500' : 'from-pink-500 via-cyan-500 to-yellow-500'} bg-clip-text text-transparent`}>
                    {gameState === 'menu' ? 'SYNTHWAVE RUNNER' : gameState === 'paused' ? 'PAUSED' : 'GAME OVER'}
                  </h1>
                  {gameState === 'menu' && <p className="text-cyan-300 text-lg">Click or press Space to jump!</p>}
                  {gameState === 'gameOver' && (
                    <div className="text-white text-xl space-y-2">
                      <div>Score: {score.toLocaleString()}</div>
                      {score > highScore && <div className="text-yellow-400">NEW HIGH SCORE!</div>}
                    </div>
                  )}
                  <motion.button 
                    onClick={gameState === 'menu' ? startGame : restartGame} 
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

            {/* Scanlines */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10" 
              style={{ 
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)` 
              }} 
            />
          </div>
        </motion.div>

        {/* Game Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <button
            onClick={handleGameClick}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-lg hover:scale-105 transition-all"
          >
            {gameState === 'menu' ? 'Start Game' : gameState === 'playing' ? 'Jump' : 'Play Again'}
          </button>
          
          <button
            onClick={() => {
              initGame()
              setGameState('menu')
            }}
            className="px-6 py-3 bg-transparent border-2 border-cyan-500 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-500/10 hover:scale-105 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={scrollToTop}
            className="px-6 py-3 bg-transparent border-2 border-pink-500 text-pink-400 font-semibold rounded-lg hover:bg-pink-500/10 hover:scale-105 transition-all flex items-center gap-2"
          >
            <ChevronDown className="w-4 h-4 rotate-180" />
            Back to Top
          </button>
        </div>

        {/* Instructions */}
        <motion.div
          className="text-center mt-8 text-cyan-400 space-y-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="font-mono">SPACE or Click: Jump | Arrow Down: Duck | Avoid obstacles!</p>
          <p className="font-mono text-sm">Collect power-ups: 🛡 Shield | 🧲 Magnet | ⭐ Bonus Points</p>
        </motion.div>
      </motion.section>
    </div>
  )
}