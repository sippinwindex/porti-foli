'use client'

'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft, RotateCcw, Heart, Zap, ChevronDown, Play, Pause, Volume2, VolumeX, Shield, Star, Magnet } from 'lucide-react'

// Game interfaces
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

  // Game constants
  const GRAVITY = 0.7
  const JUMP_FORCE = -18
  const GROUND_Y = 120
  const PLAYER_WIDTH = 48
  const PLAYER_HEIGHT = 48
  const GAME_WIDTH = 800

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

  // Handle mouse movement for 404 page
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

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (containerRef.current && touch) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = touch.clientX - rect.left - rect.width / 2
        const y = touch.clientY - rect.top - rect.height / 2
        
        setMousePosition({ x, y })
        mouseX.set(x * 0.1)
        mouseY.set(y * 0.1)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [mouseX, mouseY])

  // Handle dinosaur clicks
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

  // Game initialization
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
    } catch (error) { console.log('Audio not supported') }
  }, [soundEnabled])

  const playJumpSound = useCallback(() => playSound(440, 0.1, 'square'), [playSound])
  const playCollectSound = useCallback(() => playSound(880, 0.05, 'triangle'), [playSound])
  const playPowerUpSound = useCallback(() => playSound(660, 0.2, 'sine'), [playSound])
  const playHitSound = useCallback(() => playSound(164, 0.4, 'sawtooth'), [playSound])

  // Game actions
  const startGame = useCallback(() => { initGame(); setGameState('playing') }, [initGame])
  const pauseGame = useCallback(() => setGameState('paused'), [])
  const resumeGame = useCallback(() => { lastTimeRef.current = performance.now(); setGameState('playing') }, [])
  const restartGame = useCallback(() => { initGame(); setGameState('playing') }, [initGame])
  const jump = useCallback(() => { 
    if (!isJumping && playerY <= 0) { 
      setIsJumping(true); 
      setJumpVelocity(JUMP_FORCE); 
      playJumpSound() 
    } 
  }, [isJumping, playerY, playJumpSound])

  // Game input handling
  const handleGameAction = useCallback(() => {
    if (gameState === 'menu') startGame()
    else if (gameState === 'playing' && !isJumping) jump()
    else if (gameState === 'gameOver') restartGame()
  }, [gameState, isJumping, startGame, jump, restartGame])

  // Collision detection
  const checkCollision = useCallback((rect1: any, rect2: any) => (
    rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y
  ), [])

  // Game loop - simplified version
  const gameLoop = useCallback((currentTime: number) => {
    if (gameState !== 'playing') { 
      animationRef.current = requestAnimationFrame(gameLoop); 
      return 
    }
    if (lastTimeRef.current === 0) lastTimeRef.current = currentTime
    const deltaTime = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime
    const normalizedDelta = deltaTime / 16.67

    // Player Physics
    setJumpVelocity(prev => prev + GRAVITY * normalizedDelta)
    setPlayerY(prev => {
      const newY = prev + jumpVelocity * normalizedDelta
      if (newY <= 0) { setIsJumping(false); setJumpVelocity(0); return 0 }
      return newY
    })

    const currentSpeed = speed * normalizedDelta
    setBackgroundOffset(prev => (prev + currentSpeed * 0.5) % GAME_WIDTH)
    setGroundOffset(prev => (prev + currentSpeed * 2) % GAME_WIDTH)

    // Simple obstacle spawning
    if (Math.random() < 0.01) {
      setObstacles(prev => [...prev, {
        id: Date.now(), 
        x: GAME_WIDTH, 
        type: 'cactus',
        height: 40,
        width: 20,
        flying: false
      }])
    }

    // Update positions
    setObstacles(prev => prev.map(o => ({ ...o, x: o.x - currentSpeed })).filter(o => o.x > -100))
    
    // Basic collision
    const playerRect = { x: 100, y: GROUND_Y + playerY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }
    obstacles.forEach(obstacle => {
      const obstacleRect = { x: obstacle.x, y: GROUND_Y, width: obstacle.width, height: obstacle.height }
      if (checkCollision(playerRect, obstacleRect)) {
        playHitSound()
        setGameState('gameOver')
        if (score > highScore) { 
          setHighScore(score)
          if (typeof window !== 'undefined') {
            localStorage.setItem('synthwave-runner-high', score.toString()) 
          }
        }
      }
    })

    setScore(s => s + Math.floor(currentSpeed * 0.1))
    setDistance(prev => prev + currentSpeed * 0.1)
    setSpeed(prev => Math.min(prev + 0.001 * normalizedDelta, 12))
    
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, speed, playerY, obstacles, score, highScore, checkCollision, playHitSound, jumpVelocity])

  useEffect(() => {
    lastTimeRef.current = 0
    animationRef.current = requestAnimationFrame(gameLoop)
    return () => { 
      if (animationRef.current) cancelAnimationFrame(animationRef.current) 
    }
  }, [gameLoop])

  // Retro grid background component
  const GridBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            linear-gradient(90deg, #ff00ff 1px, transparent 1px),
            linear-gradient(180deg, #00ffff 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(600px) rotateX(45deg)',
          transformOrigin: 'bottom center'
        }}
      />
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`vertical-${i}`}
          className="absolute w-px bg-gradient-to-b from-cyan-500 via-magenta-500 to-transparent"
          style={{
            left: `${i * 5}%`,
            height: '100%',
            filter: 'brightness(0.8)'
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-2"
        animate={{
          y: ['0%', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )

  // Floating retro particles
  const RetroParticles = () => (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        >
          <div 
            className="w-2 h-2 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full"
            style={{
              filter: 'drop-shadow(0 0 8px currentColor)',
              imageRendering: 'pixelated'
            }}
          />
        </motion.div>
      ))}
    </div>
  )

  // Glitch text effect
  const GlitchText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative z-10"
        animate={{
          textShadow: [
            '0 0 10px #ff00ff, 0 0 20px #00ffff, 0 0 30px #ffff00',
            '0 0 15px #00ffff, 0 0 25px #ff00ff, 0 0 35px #ffff00',
            '0 0 10px #ff00ff, 0 0 20px #00ffff, 0 0 30px #ffff00'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 text-red-500 opacity-70"
        animate={{
          x: [-2, 2, -1, 1, 0],
          y: [0, -1, 1, 0, 1]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 text-cyan-500 opacity-70"
        animate={{
          x: [2, -2, 1, -1, 0],
          y: [1, 0, -1, 0, -1]
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {children}
      </motion.div>
    </div>
  )

  const getGameBackgroundStyle = () => ({
    night: 'linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%)',
    sunrise: 'linear-gradient(180deg, #2d1b69 0%, #f7931e 70%, #ff6b35 100%)',
    day: 'linear-gradient(180deg, #87ceeb 0%, #98fb98 100%)',
    sunset: 'linear-gradient(180deg, #ff6b35 0%, #f7931e 30%, #2d1b69 100%)'
  }[timeOfDay])

  const renderGamePlayer = () => (
    <motion.div 
      style={{ 
        position: 'absolute', 
        zIndex: 20, 
        left: '100px', 
        bottom: `${GROUND_Y + playerY}px`, 
        width: `${PLAYER_WIDTH}px`, 
        height: `${PLAYER_HEIGHT}px` 
      }}
    >
      <div className="w-full h-full bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 rounded-lg border-2 border-white/30" />
    </motion.div>
  )

  return (
    <div className="min-h-[200vh] overflow-x-hidden">
      {/* Enhanced 404 Hero Section */}
      <motion.section 
        ref={containerRef}
        style={{ 
          y: headerY, 
          opacity: headerOpacity,
          background: `
            radial-gradient(ellipse at top, rgba(255, 0, 255, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(0, 255, 255, 0.3) 0%, transparent 50%),
            linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%)
          `,
          filter: 'contrast(1.2) saturate(1.5)',
          imageRendering: 'pixelated'
        }}
        className="min-h-screen overflow-hidden relative"
      >
        {/* Retro Grid Background */}
        <GridBackground />
        
        {/* Retro Particles */}
        <RetroParticles />
        
        {/* Scanline Effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 255, 0.1) 2px,
                rgba(0, 255, 255, 0.1) 4px
              )
            `
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          
          {/* Glitch 404 Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center mb-8"
          >
            <GlitchText className="text-8xl md:text-9xl font-black bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent">
              404
            </GlitchText>
          </motion.div>

          {/* Synthwave Dinosaur - Your exact implementation */}
          <motion.div
            ref={dinoRef}
            className="relative cursor-pointer mb-8"
            style={{
              rotateX,
              rotateY,
              scale,
              transformStyle: 'preserve-3d'
            }}
            onClick={handleDinoClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Your complete dinosaur implementation */}
            <motion.div
              className="relative w-48 h-48 md:w-64 md:h-64"
              animate={isDancing ? {
                rotate: [0, 10, -10, 5, -5, 0],
                scale: [1, 1.1, 0.9, 1.05, 0.95, 1]
              } : {}}
              transition={{
                duration: 0.6,
                repeat: isDancing ? Infinity : 0
              }}
              style={{
                filter: `
                  contrast(1.3) 
                  saturate(2) 
                  hue-rotate(${mousePosition.x * 0.2}deg) 
                  drop-shadow(0 0 20px rgba(255, 0, 255, 0.7))
                  drop-shadow(0 0 30px rgba(0, 255, 255, 0.5))
                `,
                imageRendering: 'pixelated'
              }}
            >
              {/* Main Body */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 rounded-3xl border-4 border-white/30">
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `
                      repeating-conic-gradient(
                        from 0deg at 50% 50%,
                        #ff00ff 0deg 90deg,
                        #00ffff 90deg 180deg,
                        #ffff00 180deg 270deg,
                        #ff00ff 270deg 360deg
                      )
                    `,
                    backgroundSize: '8px 8px'
                  }}
                />
              </div>

              {/* Head */}
              <motion.div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-cyan-400 via-pink-500 to-yellow-400 rounded-full border-4 border-white/40"
                animate={isHovered ? { y: [-2, 2, -2] } : {}}
                transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                style={{
                  filter: 'drop-shadow(0 0 15px rgba(255, 0, 255, 0.8))'
                }}
              >
                {/* Eyes with Mouse Tracking */}
                <motion.div 
                  className="absolute top-3 left-2 w-3 h-3 bg-white rounded-full"
                  animate={{
                    x: mousePosition.x * 0.01,
                    y: mousePosition.y * 0.01
                  }}
                >
                  <div className="w-2 h-2 bg-black rounded-full mt-0.5 ml-0.5" />
                </motion.div>
                <motion.div 
                  className="absolute top-3 right-2 w-3 h-3 bg-white rounded-full"
                  animate={{
                    x: mousePosition.x * 0.01,
                    y: mousePosition.y * 0.01
                  }}
                >
                  <div className="w-2 h-2 bg-black rounded-full mt-0.5 ml-0.5" />
                </motion.div>

                {/* Blush - Neon Style */}
                <div className="absolute top-6 left-0 w-2 h-2 bg-pink-500 rounded-full opacity-80" 
                     style={{ filter: 'blur(1px) drop-shadow(0 0 4px #ff00ff)' }} />
                <div className="absolute top-6 right-0 w-2 h-2 bg-pink-500 rounded-full opacity-80" 
                     style={{ filter: 'blur(1px) drop-shadow(0 0 4px #ff00ff)' }} />

                {/* Smile */}
                <motion.div 
                  className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-white rounded-full"
                  animate={isDancing ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3, repeat: isDancing ? Infinity : 0 }}
                />
              </motion.div>

              {/* Arms */}
              <motion.div 
                className="absolute top-12 left-2 w-4 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"
                animate={isDancing ? { rotate: [0, 45, -45, 0] } : { rotate: [0, 10, 0] }}
                transition={{ duration: isDancing ? 0.4 : 2, repeat: Infinity }}
                style={{ filter: 'drop-shadow(0 0 8px #ff00ff)' }}
              />
              <motion.div 
                className="absolute top-12 right-2 w-4 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"
                animate={isDancing ? { rotate: [0, -45, 45, 0] } : { rotate: [0, -10, 0] }}
                transition={{ duration: isDancing ? 0.4 : 2, repeat: Infinity, delay: 0.1 }}
                style={{ filter: 'drop-shadow(0 0 8px #ff00ff)' }}
              />

              {/* Legs */}
              <motion.div 
                className="absolute bottom-0 left-4 w-3 h-6 bg-gradient-to-b from-pink-500 to-yellow-500 rounded-full"
                animate={isDancing ? { scaleY: [1, 0.8, 1] } : {}}
                transition={{ duration: 0.3, repeat: isDancing ? Infinity : 0 }}
                style={{ filter: 'drop-shadow(0 0 6px #00ffff)' }}
              />
              <motion.div 
                className="absolute bottom-0 right-4 w-3 h-6 bg-gradient-to-b from-pink-500 to-yellow-500 rounded-full"
                animate={isDancing ? { scaleY: [1, 0.8, 1] } : {}}
                transition={{ duration: 0.3, repeat: isDancing ? Infinity : 0, delay: 0.15 }}
                style={{ filter: 'drop-shadow(0 0 6px #00ffff)' }}
              />

              {/* Tail */}
              <motion.div 
                className="absolute bottom-16 right-0 w-2 h-8 bg-gradient-to-t from-cyan-500 to-pink-500 rounded-full transform rotate-45"
                animate={{ rotate: [35, 55, 35] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ filter: 'drop-shadow(0 0 8px #ffff00)' }}
              />

              {/* Dance Hearts */}
              {isDancing && Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`heart-${i}`}
                  className="absolute"
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 100],
                    y: [0, -50],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity
                  }}
                  style={{
                    left: '50%',
                    top: '20%',
                  }}
                >
                  <Heart 
                    className="w-4 h-4 text-pink-500" 
                    style={{ 
                      filter: 'drop-shadow(0 0 8px #ff00ff) drop-shadow(0 0 12px #00ffff)',
                      fill: 'currentColor'
                    }} 
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Neon Glow Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                background: `
                  linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff) border-box
                `,
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                filter: 'blur(2px)'
              }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360]
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 4, repeat: Infinity, ease: "linear" }
              }}
            />
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center mb-8"
          >
            <GlitchText className="text-2xl md:text-3xl font-bold text-white mb-4">
              SYSTEM ERROR: PAGE NOT FOUND
            </GlitchText>
            <motion.p 
              className="text-cyan-300 text-lg max-w-md mx-auto leading-relaxed mb-4"
              style={{
                filter: 'drop-shadow(0 0 4px #00ffff)',
                fontFamily: 'monospace'
              }}
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              The page you're looking for has been consumed by the retro void. 
              Click the dino to make it dance! ({clickCount}/5)
            </motion.p>
            <motion.p 
              className="text-pink-400 text-base"
              style={{
                filter: 'drop-shadow(0 0 4px #ff00ff)',
                fontFamily: 'monospace'
              }}
            >
              Scroll down to play the synthwave runner game!
            </motion.p>
          </motion.div>

          {/* Retro Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Link href="/">
              <motion.button
                className="group relative px-8 py-3 font-bold text-black bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 rounded-lg overflow-hidden border-2 border-white/30 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.7))',
                  imageRendering: 'pixelated'
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  RETURN HOME
                </span>
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-pink-500 to-cyan-400"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>

            <motion.button
              onClick={scrollToGame}
              className="group relative px-8 py-3 font-bold text-cyan-300 bg-transparent rounded-lg border-2 border-cyan-500 overflow-hidden transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.5))'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                PLAY GAME
              </span>
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              onClick={() => window.history.back()}
              className="group relative px-8 py-3 font-bold text-pink-300 bg-transparent rounded-lg border-2 border-pink-500 overflow-hidden transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.5))'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                GO BACK
              </span>
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-yellow-500/20"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p 
              className="text-cyan-400 mb-4 text-sm font-mono"
              style={{ filter: 'drop-shadow(0 0 4px #00ffff)' }}
            >
              Scroll down to enter the synthwave dimension
            </p>
            <motion.button
              onClick={scrollToGame}
              className="p-3 rounded-full border border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors group"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))'
              }}
            >
              <ChevronDown className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
            </motion.button>
          </motion.div>

          {/* Retro Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          >
            <p 
              className="text-pink-400 text-sm font-mono flex items-center gap-2"
              style={{ filter: 'drop-shadow(0 0 4px #ff00ff)' }}
            >
              Made with <Heart className="w-4 h-4 fill-current" /> and synthwave vibes
            </p>
          </motion.div>
        </div>

        {/* Static/TV Effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            background: `
              repeating-linear-gradient(
                0deg,
                transparent 0px,
                rgba(255, 255, 255, 0.1) 1px,
                transparent 2px
              )
            `,
            animation: 'static 0.1s infinite'
          }}
        />
      </motion.section>

      {/* Synthwave Runner Game Section */}
      <motion.section
        ref={gameRef}
        style={{ 
          y: gameY, 
          opacity: gameOpacity,
          background: getGameBackgroundStyle(),
          filter: 'contrast(1.1)'
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
          className="w-full max-w-4xl h-[600px] relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div 
            className="w-full h-full overflow-hidden relative cursor-pointer select-none rounded-2xl border-2 border-cyan-500/50" 
            onClick={handleGameAction}
            style={{ 
              background: getGameBackgroundStyle(),
              filter: 'contrast(1.1)',
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
                transform: `translate(-${backgroundOffset}px, 0)` 
              }} 
            />

            {/* Game UI */}
            <div className="absolute top-4 left-4 z-30 text-white font-mono space-y-1">
              <p className="text-2xl drop-shadow-lg">{score.toLocaleString()}</p>
              <p className="text-sm opacity-80">HI: {highScore.toLocaleString()}</p>
              <p className="text-sm opacity-80">{Math.floor(distance)}m</p>
            </div>

            <div className="absolute top-4 right-4 z-30">
              <motion.button 
                onClick={() => setSoundEnabled(!soundEnabled)} 
                className="p-2 bg-black/30 rounded-full border border-cyan-500/50" 
                whileHover={{ scale: 1.1 }}
              >
                {soundEnabled ? <Volume2 size={20} className="text-cyan-400" /> : <VolumeX size={20} className="text-gray-400" />}
              </motion.button>
            </div>

            {/* Game Ground */}
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

            {/* Game Player */}
            {renderGamePlayer()}

            {/* Game Obstacles */}
            {obstacles.map(o => (
              <div 
                key={o.id} 
                className="absolute z-10" 
                style={{
                  left: `${o.x}px`, 
                  bottom: `${GROUND_Y}px`, 
                  width: `${o.width}px`, 
                  height: `${o.height}px`, 
                  filter: `drop-shadow(0 0 8px #ff00ff)`
                }}
              >
                <div className="w-full h-full bg-gradient-to-t from-red-700 to-red-500 rounded-t-lg border-2 border-red-300" />
              </div>
            ))}

            {/* Game Menu Overlay */}
            {gameState !== 'playing' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/60 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-center space-y-6"
                >
                  <h1 className={`text-6xl font-bold bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent ${gameState === 'gameOver' && 'from-red-500 via-yellow-500 to-orange-500'}`}>
                    {gameState === 'menu' ? 'SYNTHWAVE RUNNER' : gameState === 'paused' ? 'PAUSED' : 'GAME OVER'}
                  </h1>
                  {gameState === 'menu' && <p className="text-cyan-300 text-lg">An endless runner with synthwave aesthetics</p>}
                  {gameState === 'gameOver' && <div className="text-white text-xl">Score: {score.toLocaleString()}</div>}
                  <motion.button 
                    onClick={gameState === 'paused' ? resumeGame : gameState === 'menu' ? startGame : restartGame} 
                    className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-lg font-bold text-lg backdrop-blur-md" 
                    whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={24} />
                    {gameState === 'paused' ? 'RESUME' : gameState === 'menu' ? 'START GAME' : 'PLAY AGAIN'}
                  </motion.button>
                </motion.div>
              </div>
            )}

            {/* Scanlines */}
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
            onClick={handleGameAction}
            disabled={gameState === 'paused'}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-lg disabled:opacity-50 hover:scale-105 transition-all"
          >
            {gameState === 'menu' ? 'Start Game' : gameState === 'playing' ? 'Jump (Space)' : 'Play Again'}
          </button>
          
          <button
            onClick={() => setGameState('menu')}
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
          className="text-center mt-8 text-cyan-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="font-mono">SPACE: Jump | Click: Jump | Avoid the red obstacles!</p>
        </motion.div>
      </motion.section>

      <style jsx>{`
        @keyframes static {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  )
}