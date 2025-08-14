'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Home, ArrowUp, Play, Pause, RotateCcw, Volume2, VolumeX, Zap, Shield, Star, Magnet } from 'lucide-react'

// Interfaces for game objects
interface Obstacle {
  id: number; x: number; type: 'cactus' | 'rock' | 'bird';
  height: number; width: number; flying?: boolean;
}
interface PowerUp {
  id: number; x: number; y: number; type: 'shield' | 'magnet' | 'star'; collected: boolean;
}
interface Collectible {
  id: number; x: number; y: number; collected: boolean; value: number;
}

export default function Enhanced404WithProfessionalGame() {
  const gameRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const keysPressed = useRef<Set<string>>(new Set())
  const { scrollYProgress } = useScroll()
  
  // Transform values for scroll animations
  const headerY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const gameY = useTransform(scrollYProgress, [0.3, 1], [100, 0])
  const gameOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1])
  
  // Game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('synthwave-runner-high') || '0')
    }
    return 0
  })
  const [distance, setDistance] = useState(0)
  const [speed, setSpeed] = useState(5)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Player state
  const [playerY, setPlayerY] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const [isDucking, setIsDucking] = useState(false)
  const [jumpVelocity, setJumpVelocity] = useState(0)
  
  // Game objects
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [powerUps, setPowerUps] = useState<PowerUp[]>([])
  const [collectibles, setCollectibles] = useState<Collectible[]>([])
  
  // Power-up states
  const [shieldActive, setShieldActive] = useState(false)
  const [magnetActive, setMagnetActive] = useState(false)
  const [shieldTimeLeft, setShieldTimeLeft] = useState(0)
  const [magnetTimeLeft, setMagnetTimeLeft] = useState(0)
  
  // Visual states
  const [backgroundOffset, setBackgroundOffset] = useState(0)
  const [groundOffset, setGroundOffset] = useState(0)
  const [timeOfDay, setTimeOfDay] = useState<'night' | 'sunrise' | 'day' | 'sunset'>('night')

  // Constants
  const GRAVITY = 0.8
  const JUMP_FORCE = -16
  const GROUND_Y = 120
  const PLAYER_WIDTH = 48
  const PLAYER_HEIGHT = 48
  const GAME_WIDTH = 800

  // Initialize game
  const initGame = useCallback(() => {
    setScore(0)
    setDistance(0)
    setSpeed(5)
    setPlayerY(0)
    setIsJumping(false)
    setIsDucking(false)
    setJumpVelocity(0)
    setObstacles([])
    setPowerUps([])
    setCollectibles([])
    setShieldActive(false)
    setMagnetActive(false)
    setShieldTimeLeft(0)
    setMagnetTimeLeft(0)
    setBackgroundOffset(0)
    setGroundOffset(0)
    setTimeOfDay('night')
  }, [])

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
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) { 
      console.log('Audio not supported') 
    }
  }, [soundEnabled])

  const playJumpSound = useCallback(() => playSound(440, 0.1, 'square'), [playSound])
  const playCollectSound = useCallback(() => playSound(880, 0.05, 'triangle'), [playSound])
  const playPowerUpSound = useCallback(() => playSound(660, 0.2, 'sine'), [playSound])
  const playHitSound = useCallback(() => playSound(164, 0.4, 'sawtooth'), [playSound])

  // Game actions
  const startGame = useCallback(() => { 
    initGame()
    setGameState('playing')
    lastTimeRef.current = 0 // Reset timing
  }, [initGame])

  const pauseGame = useCallback(() => setGameState('paused'), [])
  
  const resumeGame = useCallback(() => { 
    lastTimeRef.current = 0 // Reset timing when resuming
    setGameState('playing') 
  }, [])
  
  const restartGame = useCallback(() => { 
    initGame()
    setGameState('playing')
    lastTimeRef.current = 0 // Reset timing
  }, [initGame])
  
  const jump = useCallback(() => { 
    if (!isJumping && playerY <= 5) { // Small tolerance for ground detection
      setIsJumping(true)
      setJumpVelocity(JUMP_FORCE)
      playJumpSound()
    } 
  }, [isJumping, playerY, playJumpSound])

  // Input handling with improved key management
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault()
    keysPressed.current.add(e.code)
    
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      if (gameState === 'menu') {
        startGame()
      } else if (gameState === 'playing') {
        jump()
      } else if (gameState === 'gameOver') {
        restartGame()
      }
    }
    
    if (e.code === 'KeyP') {
      if (gameState === 'playing') {
        pauseGame()
      } else if (gameState === 'paused') {
        resumeGame()
      }
    }
  }, [gameState, startGame, jump, restartGame, pauseGame, resumeGame])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.code)
  }, [])

  const handleClick = useCallback(() => {
    if (gameState === 'menu') {
      startGame()
    } else if (gameState === 'playing') {
      jump()
    } else if (gameState === 'gameOver') {
      restartGame()
    }
  }, [gameState, startGame, jump, restartGame])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    const currentGameRef = gameRef.current
    currentGameRef?.addEventListener('click', handleClick)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      currentGameRef?.removeEventListener('click', handleClick)
    }
  }, [handleKeyDown, handleKeyUp, handleClick])

  // Collision detection
  const checkCollision = useCallback((rect1: any, rect2: any) => (
    rect1.x < rect2.x + rect2.width && 
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height && 
    rect1.y + rect1.height > rect2.y
  ), [])

  // Main game loop - FIXED VERSION
  const gameLoop = useCallback((currentTime: number) => {
    if (gameState !== 'playing') { 
      if (gameState === 'menu' || gameState === 'paused' || gameState === 'gameOver') {
        animationRef.current = requestAnimationFrame(gameLoop)
      }
      return 
    }

    // Initialize timing on first frame
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = currentTime
      animationRef.current = requestAnimationFrame(gameLoop)
      return
    }

    const deltaTime = Math.min(currentTime - lastTimeRef.current, 50) // Cap delta time to prevent large jumps
    lastTimeRef.current = currentTime
    
    const normalizedDelta = deltaTime / 16.67 // 60fps normalization

    // Handle ducking input
    const isDuckingNow = keysPressed.current.has('ArrowDown')
    setIsDucking(isDuckingNow)

    // Player Physics - Update velocity and position
    setJumpVelocity(prev => {
      const newVel = prev + GRAVITY * normalizedDelta
      return newVel
    })
    
    setPlayerY(prev => {
      const newY = prev + jumpVelocity * normalizedDelta
      if (newY <= 0) { 
        setIsJumping(false)
        setJumpVelocity(0)
        return 0 
      }
      return newY
    })

    const currentSpeed = speed * normalizedDelta

    // Update visual offsets
    setBackgroundOffset(prev => (prev + currentSpeed * 0.5) % GAME_WIDTH)
    setGroundOffset(prev => (prev + currentSpeed * 2) % GAME_WIDTH)

    // Obstacle spawning - simplified and more reliable
    setObstacles(prev => {
      let newObstacles = [...prev]
      
      // Spawn new obstacles
      const lastObstacle = newObstacles[newObstacles.length - 1]
      const minSpawnDistance = 200
      const shouldSpawn = !lastObstacle || (GAME_WIDTH - lastObstacle.x) > minSpawnDistance
      
      if (shouldSpawn && Math.random() < 0.015) {
        const obstacleTypes: Obstacle['type'][] = distance > 500 ? ['cactus', 'rock', 'bird'] : ['cactus', 'rock']
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]
        
        newObstacles.push({
          id: Date.now() + Math.random(),
          x: GAME_WIDTH + 20,
          type,
          height: type === 'bird' ? 32 : 45,
          width: type === 'bird' ? 35 : 25,
          flying: type === 'bird'
        })
      }
      
      // Move obstacles and remove off-screen ones
      return newObstacles
        .map(o => ({ ...o, x: o.x - currentSpeed }))
        .filter(o => o.x > -100)
    })

    // Power-up spawning and movement
    setPowerUps(prev => {
      let newPowerUps = [...prev]
      
      if (Math.random() < 0.003) {
        const types: PowerUp['type'][] = ['shield', 'magnet', 'star']
        newPowerUps.push({
          id: Date.now() + Math.random(),
          x: GAME_WIDTH,
          y: 60 + Math.random() * 80,
          type: types[Math.floor(Math.random() * types.length)],
          collected: false
        })
      }
      
      return newPowerUps
        .map(p => ({ ...p, x: p.x - currentSpeed }))
        .filter(p => p.x > -50)
    })

    // Collectible spawning and movement
    setCollectibles(prev => {
      let newCollectibles = [...prev]
      
      if (Math.random() < 0.02) {
        newCollectibles.push({
          id: Date.now() + Math.random(),
          x: GAME_WIDTH,
          y: 40 + Math.random() * 100,
          collected: false,
          value: 10
        })
      }
      
      return newCollectibles
        .map(c => ({ ...c, x: c.x - currentSpeed }))
        .filter(c => c.x > -30)
    })

    // Collision detection
    const playerRect = { 
      x: 100, 
      y: GROUND_Y + playerY, 
      width: PLAYER_WIDTH, 
      height: isDuckingNow ? PLAYER_HEIGHT / 2 : PLAYER_HEIGHT 
    }

    // Check obstacle collisions
    if (!shieldActive) {
      obstacles.forEach(obstacle => {
        const obstacleRect = { 
          x: obstacle.x, 
          y: obstacle.flying ? GROUND_Y + 50 : GROUND_Y, 
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
      })
    }

    // Check power-up collisions
    const magnetDistance = magnetActive ? 80 : 0
    powerUps.forEach(powerUp => {
      if (!powerUp.collected) {
        const dist = Math.hypot(
          powerUp.x - (playerRect.x + playerRect.width / 2), 
          powerUp.y - (playerRect.y + playerRect.height / 2)
        )
        
        if (dist < 30 + magnetDistance) {
          powerUp.collected = true
          playPowerUpSound()
          
          if (powerUp.type === 'shield') { 
            setShieldActive(true)
            setShieldTimeLeft(5000) 
          }
          if (powerUp.type === 'magnet') { 
            setMagnetActive(true)
            setMagnetTimeLeft(8000) 
          }
          if (powerUp.type === 'star') {
            setScore(s => s + 500)
          }
        }
      }
    })

    // Check collectible collisions
    collectibles.forEach(collectible => {
      if (!collectible.collected) {
        const dist = Math.hypot(
          collectible.x - (playerRect.x + playerRect.width / 2), 
          collectible.y - (playerRect.y + playerRect.height / 2)
        )
        
        if (dist < 25 + magnetDistance) {
          collectible.collected = true
          playCollectSound()
          setScore(s => s + collectible.value)
        }
      }
    })
    
    // Update game state
    setDistance(prev => prev + currentSpeed * 0.1)
    setScore(s => s + Math.floor(currentSpeed * 0.02))
    setSpeed(prev => Math.min(prev + 0.002 * normalizedDelta, 12))
    
    // Update power-up timers
    if (shieldActive) {
      setShieldTimeLeft(prev => {
        const newTime = prev - deltaTime
        if (newTime <= 0) { 
          setShieldActive(false)
          return 0
        } 
        return newTime
      })
    }
    
    if (magnetActive) {
      setMagnetTimeLeft(prev => {
        const newTime = prev - deltaTime
        if (newTime <= 0) { 
          setMagnetActive(false)
          return 0
        } 
        return newTime
      })
    }

    // Update time of day
    const dayPhase = Math.floor(distance / 1000) % 4
    setTimeOfDay(['night', 'sunrise', 'day', 'sunset'][dayPhase] as any)
    
    // Continue game loop
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, speed, playerY, jumpVelocity, obstacles, powerUps, collectibles, shieldActive, magnetActive, score, highScore, distance, checkCollision, playHitSound, playPowerUpSound, playCollectSound])

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
  
  const getBackgroundStyle = () => ({
    night: 'linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%)',
    sunrise: 'linear-gradient(180deg, #2d1b69 0%, #f7931e 70%, #ff6b35 100%)',
    day: 'linear-gradient(180deg, #87ceeb 0%, #98fb98 100%)',
    sunset: 'linear-gradient(180deg, #ff6b35 0%, #f7931e 30%, #2d1b69 100%)'
  }[timeOfDay])

  const renderPlayer = () => (
    <motion.div 
      style={{ 
        position: 'absolute', 
        zIndex: 20, 
        left: '100px', 
        bottom: `${GROUND_Y + playerY}px`, 
        width: `${PLAYER_WIDTH}px`, 
        height: `${PLAYER_HEIGHT}px`, 
        transformOrigin: 'bottom' 
      }} 
      animate={{ scaleY: isDucking ? 0.5 : 1 }} 
      transition={{ duration: 0.1 }}
    >
      <div className="relative w-full h-full" style={{ 
        filter: `${shieldActive ? 'drop-shadow(0 0 15px #00ff00)' : ''} ${magnetActive ? 'drop-shadow(0 0 15px #8000ff)' : ''} drop-shadow(0 0 10px rgba(255, 0, 255, 0.7))` 
      }}>
        {shieldActive && (
          <motion.div 
            className="absolute -inset-1 border-4 border-green-400 rounded-full" 
            animate={{ opacity: [0.5, 1, 0.5] }} 
            transition={{ duration: 1, repeat: Infinity }} 
          />
        )}
        {magnetActive && (
          <motion.div 
            className="absolute -inset-3 border-2 border-purple-400 rounded-full" 
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity }} 
          />
        )}
        <div className="w-full h-full bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 rounded-lg border-2 border-white/30" />
        <motion.div 
          className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white flex items-center justify-center space-x-0.5" 
          animate={isJumping ? { y: -2 } : { y: 0 }}
        >
          <div className="w-1 h-1 bg-black rounded-full" />
          <div className="w-1 h-1 bg-black rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  )

  const renderGround = () => (
    <div className="absolute bottom-0 left-0 right-0 h-32 z-10">
      <div 
        className="h-full" 
        style={{ 
          backgroundImage: `url('data:image/svg+xml;utf8,<svg width="60" height="128" viewBox="0 0 60 128" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 120h60" stroke="%2300ffff" stroke-width="2"/><path d="M0 118h60" stroke="%23ff00ff" stroke-width="1" stroke-dasharray="1 4"/></g></svg>')`, 
          backgroundRepeat: 'repeat-x', 
          width: `${GAME_WIDTH * 2}px`, 
          transform: `translateX(-${groundOffset}px)`, 
          position: 'absolute', 
          bottom: 0, 
          height: '100%' 
        }} 
      />
    </div>
  )

  const renderUI = () => (
    <>
      <div className="absolute top-4 left-4 z-30 text-white font-mono space-y-1">
        <p className="text-2xl drop-shadow-lg">{score.toLocaleString()}</p>
        <p className="text-sm opacity-80">HI: {highScore.toLocaleString()}</p>
        <p className="text-sm opacity-80">{Math.floor(distance)}m</p>
      </div>
      <div className="absolute top-4 right-4 z-30 space-y-2 flex flex-col items-end">
        <motion.button 
          onClick={() => setSoundEnabled(!soundEnabled)} 
          className="p-2 bg-black/30 rounded-full" 
          whileHover={{ scale: 1.1 }}
        >
          {soundEnabled ? <Volume2 size={20} className="text-white" /> : <VolumeX size={20} className="text-white" />}
        </motion.button>
        {shieldActive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-900/50 border border-green-400 text-green-300 rounded-full text-sm">
            <Shield size={16} />
            {Math.ceil(shieldTimeLeft / 1000)}s
          </div>
        )}
        {magnetActive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/50 border border-purple-400 text-purple-300 rounded-full text-sm">
            <Magnet size={16} />
            {Math.ceil(magnetTimeLeft / 1000)}s
          </div>
        )}
      </div>
      <div className="absolute bottom-4 left-4 z-30 text-orange-400 font-mono text-sm flex items-center gap-2">
        <Zap size={16} />
        {speed.toFixed(1)}x
      </div>
    </>
  )

  const renderMenu = (state: 'menu' | 'paused' | 'gameOver') => {
    const menus = {
      menu: { title: "SYNTHWAVE RUNNER", cta: "START GAME", icon: Play },
      paused: { title: "PAUSED", cta: "RESUME", icon: Play },
      gameOver: { title: "GAME OVER", cta: "PLAY AGAIN", icon: RotateCcw }
    }
    const { title, cta, icon: Icon } = menus[state]

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center space-y-6"
        >
          <h1 className={`text-6xl font-bold bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent ${state === 'gameOver' && 'from-red-500 via-yellow-500 to-orange-500'}`}>
            {title}
          </h1>
          {state === 'menu' && <p className="text-cyan-300 text-lg">An endless runner with modern physics</p>}
          {state === 'gameOver' && <div className="text-white text-xl">Score: {score.toLocaleString()}</div>}
          <motion.button 
            onClick={state === 'paused' ? resumeGame : state === 'menu' ? startGame : restartGame} 
            className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-lg font-bold text-lg backdrop-blur-md" 
            whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }} 
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={24} />
            {cta}
          </motion.button>
          {state !== 'paused' && (
            <motion.button 
              onClick={() => { 
                if(state === 'gameOver') initGame()
                setGameState('menu') 
              }} 
              className="text-white/60 hover:text-white transition-colors"
            >
              {state === 'gameOver' ? 'Back to Menu' : ' '}
            </motion.button>
          )}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[200vh] bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white overflow-x-hidden">
      {/* Enhanced 404 Hero Section */}
      <motion.section 
        style={{ y: headerY, opacity: headerOpacity }}
        className="min-h-screen flex flex-col items-center justify-center relative px-4"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-pink-500/20 to-yellow-500/20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Main 404 Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative z-10"
        >
          {/* 404 Title */}
          <motion.h1
            className="text-8xl md:text-9xl font-bold mb-6 relative"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          >
            <span className="bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 bg-clip-text text-transparent">
              404
            </span>
          </motion.h1>

          {/* Error Message */}
          <motion.p
            className="text-2xl md:text-3xl mb-4 text-gray-300 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Oops! Page Not Found
          </motion.p>

          <motion.p
            className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            The page you're looking for has wandered off into the digital wilderness. 
            But hey, why not take a break and play our professional synthwave runner?
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <button
              onClick={() => window.location.href = '/'}
              className="btn-3d group relative overflow-hidden px-8 py-4 text-lg font-semibold"
            >
              <Home className="w-5 h-5 mr-2 inline" />
              Go Home
            </button>

            <button
              onClick={scrollToGame}
              className="btn-secondary group relative overflow-hidden px-8 py-4 text-lg font-semibold border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Play Synthwave Runner
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
              </span>
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p className="text-gray-400 mb-4 text-sm">Scroll down to play</p>
            <motion.button
              onClick={scrollToGame}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors group"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-pink-500/30 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: typeof window !== 'undefined' ? window.innerHeight : 800,
              }}
              animate={{
                y: -100,
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* Professional Synthwave Runner Game Section */}
      <motion.section
        ref={gameRef}
        style={{ y: gameY, opacity: gameOpacity }}
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <Play className="w-12 h-12 text-cyan-500" />
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent">
              Synthwave Runner
            </h2>
            <Zap className="w-12 h-12 text-yellow-500" />
          </div>
          <p className="text-lg text-gray-400">
            Professional endless runner with power-ups, physics, and synthwave aesthetics!
          </p>
        </motion.div>

        {/* Game Container */}
        <motion.div
          className="w-full max-w-4xl h-[600px] relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div 
            className="w-full h-full overflow-hidden relative cursor-pointer select-none rounded-2xl border-2 border-white/20" 
            style={{ background: getBackgroundStyle(), filter: 'contrast(1.1)' }}
          >
            <div 
              className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: `linear-gradient(90deg, #ff00ff 1px, transparent 1px), linear-gradient(180deg, #00ffff 1px, transparent 1px)`, 
                backgroundSize: '50px 50px', 
                width: `${GAME_WIDTH*2}px`, 
                transform: `translate(-${backgroundOffset}px, 0)` 
              }} 
            />
            <div className="relative w-full h-full">
              {gameState !== 'playing' && renderMenu(gameState)}
              {(gameState === 'playing' || gameState === 'paused') && renderUI()}
              {renderGround()}
              {renderPlayer()}
              
              {/* Render Obstacles */}
              {obstacles.map(o => (
                <div 
                  key={o.id} 
                  className="absolute z-10" 
                  style={{
                    left: `${o.x}px`, 
                    bottom: o.flying ? `${GROUND_Y + 60}px` : `${GROUND_Y}px`, 
                    width: `${o.width}px`, 
                    height: `${o.height}px`, 
                    filter: `drop-shadow(0 0 8px #000)`
                  }}
                >
                  {o.type === 'cactus' && (
                    <div className="w-full h-full bg-gradient-to-t from-green-700 to-green-500 rounded-t-lg border-2 border-green-300" />
                  )}
                  {o.type === 'rock' && (
                    <div className="w-full h-full bg-gradient-to-t from-gray-700 to-gray-500 rounded-lg border-2 border-gray-400" />
                  )}
                  {o.type === 'bird' && (
                    <motion.div 
                      className="w-full h-full bg-gradient-to-t from-purple-700 to-purple-500 rounded-full border-2 border-purple-300" 
                      animate={{ y: [0, -15, 0] }} 
                      transition={{ duration: 1, repeat: Infinity }} 
                    />
                  )}
                </div>
              ))}
              
              {/* Render Power-ups */}
              {powerUps.map(p => p.collected ? null : (
                <motion.div 
                  key={p.id} 
                  className="absolute z-20" 
                  style={{
                    left: `${p.x}px`, 
                    bottom: `${p.y}px`, 
                    width: '30px', 
                    height: '30px'
                  }} 
                  animate={{
                    scale: [1, 1.2, 1], 
                    rotate: [0, 360]
                  }} 
                  transition={{
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-full h-full bg-yellow-500 rounded-full border-2 border-white/50 flex items-center justify-center text-white">
                    {p.type === 'shield' && <Shield size={16}/>}
                    {p.type === 'magnet' && <Magnet size={16}/>}
                    {p.type === 'star' && <Star size={16}/>}
                  </div>
                </motion.div>
              ))}
              
              {/* Render Collectibles */}
              {collectibles.map(c => c.collected ? null : (
                <motion.div 
                  key={c.id} 
                  className="absolute z-20" 
                  style={{
                    left: `${c.x}px`, 
                    bottom: `${c.y}px`, 
                    width: '20px', 
                    height: '20px'
                  }} 
                  animate={{
                    rotate: [0, 360], 
                    scale: [0.8, 1.2, 0.8]
                  }} 
                  transition={{
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                >
                  <Star className="w-full h-full text-yellow-400" fill="currentColor" />
                </motion.div>
              ))}
            </div>
            <div 
              className="absolute inset-0 pointer-events-none opacity-5" 
              style={{ 
                background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)` 
              }} 
            />
          </div>
        </motion.div>

        {/* Game Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <button
            onClick={handleClick}
            disabled={gameState === 'paused'}
            className="btn-secondary px-6 py-3 disabled:opacity-50"
          >
            {gameState === 'menu' ? 'Start Game' : gameState === 'playing' ? 'Jump (Space)' : 'Play Again'}
          </button>
          
          <button
            onClick={() => setGameState('menu')}
            className="btn-ghost px-6 py-3 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={scrollToTop}
            className="btn-ghost px-6 py-3 flex items-center gap-2"
          >
            <ArrowUp className="w-4 h-4" />
            Back to Top
          </button>
        </div>

        {/* Instructions */}
        <motion.div
          className="text-center mt-8 text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>SPACE: Jump | DOWN: Duck | P: Pause | Collect power-ups and avoid obstacles!</p>
        </motion.div>
      </motion.section>

      {/* Custom CSS */}
      <style jsx>{`
        .btn-3d {
          background: linear-gradient(135deg, #ec4899, #f59e0b);
          color: white;
          border: none;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .btn-3d:hover {
          transform: translateY(-2px) scale(1.05);
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
          transform: translateY(-2px) scale(1.05);
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