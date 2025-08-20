import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Home, Volume2, VolumeX, RotateCcw, Trophy, Target, Zap, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

// Game constants - adjusted for proper Google Dino-like physics
const GRAVITY = 0.8
const JUMP_FORCE = -16
const GROUND_Y = 50 // Distance from bottom of canvas
const PLAYER_WIDTH = 44
const PLAYER_HEIGHT = 47
const DUCK_HEIGHT = 26
const GAME_WIDTH = 800
const GAME_HEIGHT = 400
const BASE_SPEED = 6 // Reduced starting speed
const MAX_SPEED = 12 // Reduced max speed for better progression

interface Obstacle {
  id: number
  x: number
  type: 'cactus' | 'rock' | 'bird'
  width: number
  height: number
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

export default function SynthwaveRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  
  // Theme hook
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('synthwave-runner-high') || '0')
    }
    return 0
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Theme mount effect
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const isDark = mounted ? resolvedTheme === 'dark' : true
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }
  
  // Player state - using refs for smooth animation
  const playerY = useRef(GROUND_Y)
  const velocity = useRef(0)
  const isJumping = useRef(false)
  const isDucking = useRef(false)
  
  // Game objects
  const obstacles = useRef<Obstacle[]>([])
  const powerUps = useRef<PowerUp[]>([])
  const collectibles = useRef<Collectible[]>([])
  const speed = useRef(BASE_SPEED)
  const distance = useRef(0)
  const obstacleTimer = useRef(0) // Reset obstacle timer
  const lastObstacleX = useRef(GAME_WIDTH)
  
  // Power-up states
  const shieldActive = useRef(false)
  const shieldTimeLeft = useRef(0)
  const magnetActive = useRef(false)
  const magnetTimeLeft = useRef(0)
  
  // Visual offsets
  const backgroundOffset = useRef(0)
  const groundOffset = useRef(0)

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

  const playJumpSound = useCallback(() => playSound(440, 0.1, 'square'), [playSound])
  const playCollectSound = useCallback(() => playSound(880, 0.05, 'triangle'), [playSound])
  const playPowerUpSound = useCallback(() => playSound(660, 0.2, 'sine'), [playSound])
  const playHitSound = useCallback(() => playSound(164, 0.4, 'sawtooth'), [playSound])

  // Initialize game
  const initGame = useCallback(() => {
    setScore(0)
    playerY.current = GROUND_Y
    velocity.current = 0
    isJumping.current = false
    isDucking.current = false
    obstacles.current = []
    powerUps.current = []
    collectibles.current = []
    speed.current = BASE_SPEED
    distance.current = 0
    obstacleTimer.current = 0 // Reset obstacle timer
    lastObstacleX.current = GAME_WIDTH
    shieldActive.current = false
    shieldTimeLeft.current = 0
    magnetActive.current = false
    magnetTimeLeft.current = 0
    backgroundOffset.current = 0
    groundOffset.current = 0
    lastTimeRef.current = 0
  }, [])

  // Game controls
  const jump = useCallback(() => {
    if (playerY.current >= GROUND_Y - 2) { // Only jump when on ground
      velocity.current = JUMP_FORCE
      isJumping.current = true
      playJumpSound()
    }
  }, [playJumpSound])

  const startDucking = useCallback(() => {
    isDucking.current = true
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

    const handleClick = () => {
      if (gameState === 'playing') {
        jump()
      } else if (gameState === 'menu') {
        startGame()
      } else if (gameState === 'gameOver') {
        restartGame()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('click', handleClick)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (canvas) {
        canvas.removeEventListener('click', handleClick)
      }
    }
  }, [gameState, jump, startDucking, stopDucking, startGame, restartGame])

  // Improved collision detection with more forgiving hitboxes
  const checkCollision = useCallback((playerRect: any, obstacleRect: any) => {
    // More generous buffer for fairer gameplay
    const buffer = 4
    return (
      playerRect.x + buffer < obstacleRect.x + obstacleRect.width &&
      playerRect.x + playerRect.width - buffer > obstacleRect.x &&
      playerRect.y + buffer < obstacleRect.y + obstacleRect.height &&
      playerRect.y + playerRect.height - buffer > obstacleRect.y
    )
  }, [])

  // Drawing function
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    
    // Draw background gradient with theme awareness
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT)
    if (isDark) {
      gradient.addColorStop(0, '#121212') // lux-black
      gradient.addColorStop(0.3, '#1a1a1a')
      gradient.addColorStop(0.7, '#2a2a2a')
      gradient.addColorStop(1, '#0f0f0f')
    } else {
      gradient.addColorStop(0, '#FAFAFA') // lux-offwhite
      gradient.addColorStop(0.3, '#f0f0f0')
      gradient.addColorStop(0.7, '#e0e0e0')
      gradient.addColorStop(1, '#d0d0d0')
    }
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    
    // Draw animated grid background with theme colors
    ctx.strokeStyle = isDark ? 'rgba(190, 52, 85, 0.15)' : 'rgba(190, 52, 85, 0.25)' // viva-magenta with theme opacity
    ctx.lineWidth = 1
    for (let i = 0; i < GAME_WIDTH + 50; i += 50) {
      const x = (i - backgroundOffset.current % 50)
      if (x >= -50 && x <= GAME_WIDTH) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, GAME_HEIGHT)
        ctx.stroke()
      }
    }
    
    // Draw ground line with luxury gold
    const groundLineY = GAME_HEIGHT - GROUND_Y
    ctx.strokeStyle = '#D4AF37' // lux-gold
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, groundLineY)
    ctx.lineTo(GAME_WIDTH, groundLineY)
    ctx.stroke()
    
    // Draw moving ground pattern with viva-magenta
    ctx.strokeStyle = '#BE3455' // viva-magenta
    ctx.lineWidth = 1
    ctx.setLineDash([10, 10])
    for (let i = 0; i < GAME_WIDTH + 40; i += 40) {
      const x = (i - groundOffset.current) % (GAME_WIDTH + 40)
      if (x >= -40 && x <= GAME_WIDTH) {
        ctx.beginPath()
        ctx.moveTo(x, groundLineY + 5)
        ctx.lineTo(x + 20, groundLineY + 5)
        ctx.stroke()
      }
    }
    ctx.setLineDash([])
    
    // Calculate player position
    const playerHeight = isDucking.current ? DUCK_HEIGHT : PLAYER_HEIGHT
    const playerYPos = GAME_HEIGHT - GROUND_Y - playerHeight - playerY.current + GROUND_Y
    const playerX = 80
    
    // Player shadow with theme awareness
    ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(playerX - 2, GAME_HEIGHT - GROUND_Y, PLAYER_WIDTH + 4, 4)
    
    // Shield effect with theme colors
    if (shieldActive.current) {
      ctx.strokeStyle = '#98A869' // lux-sage for shield
      ctx.lineWidth = 3
      ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.01) * 0.3
      ctx.beginPath()
      ctx.arc(playerX + PLAYER_WIDTH/2, playerYPos + playerHeight/2, 35, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1
    }
    
    // Magnet effect with theme colors
    if (magnetActive.current) {
      ctx.strokeStyle = '#008080' // lux-teal for magnet
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.4 + Math.sin(Date.now() * 0.008) * 0.2
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(playerX + PLAYER_WIDTH/2, playerYPos + playerHeight/2, 40 + i * 8, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
    
    // Player body with your luxury gradient
    const playerGradient = ctx.createLinearGradient(playerX, playerYPos, playerX + PLAYER_WIDTH, playerYPos + playerHeight)
    playerGradient.addColorStop(0, '#BE3455') // viva-magenta
    playerGradient.addColorStop(0.5, '#D4AF37') // lux-gold
    playerGradient.addColorStop(1, '#008080') // lux-teal
    ctx.fillStyle = playerGradient
    
    // Main body
    ctx.fillRect(playerX, playerYPos, PLAYER_WIDTH, playerHeight)
    
    // Player eyes (only if not ducking)
    if (!isDucking.current) {
      ctx.fillStyle = 'white'
      ctx.fillRect(playerX + 8, playerYPos + 8, 8, 8)
      ctx.fillRect(playerX + 24, playerYPos + 8, 8, 8)
      ctx.fillStyle = isDark ? 'black' : '#121212'
      ctx.fillRect(playerX + 10, playerYPos + 10, 4, 4)
      ctx.fillRect(playerX + 26, playerYPos + 10, 4, 4)
    }
    
    // Player outline
    ctx.strokeStyle = isDark ? 'white' : '#121212'
    ctx.lineWidth = 1
    ctx.strokeRect(playerX, playerYPos, PLAYER_WIDTH, playerHeight)
    
    // Draw obstacles with theme awareness
    obstacles.current.forEach(obstacle => {
      ctx.strokeStyle = isDark ? 'white' : '#121212'
      ctx.lineWidth = 1
      
      if (obstacle.type === 'cactus') {
        const gradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height)
        gradient.addColorStop(0, '#98A869') // lux-sage
        gradient.addColorStop(1, '#6B7E4A') // darker sage
        ctx.fillStyle = gradient
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        
        // Cactus spikes
        ctx.fillStyle = '#7A8C5A'
        for (let i = 5; i < obstacle.height - 5; i += 8) {
          ctx.fillRect(obstacle.x - 3, obstacle.y + i, 6, 4)
          ctx.fillRect(obstacle.x + obstacle.width - 3, obstacle.y + i, 6, 4)
        }
      } else if (obstacle.type === 'rock') {
        const gradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height)
        gradient.addColorStop(0, '#4A2C2A') // lux-brown
        gradient.addColorStop(1, '#2A1A1A') // darker brown
        ctx.fillStyle = gradient
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      } else if (obstacle.type === 'bird') {
        // Flying obstacle with viva-magenta
        const centerX = obstacle.x + obstacle.width / 2
        const centerY = obstacle.y + obstacle.height / 2
        const wingFlap = Math.sin(Date.now() * 0.01) * 5
        
        ctx.fillStyle = '#BE3455' // viva-magenta
        // Body
        ctx.fillRect(obstacle.x + 10, obstacle.y + 8, 15, 8)
        // Wings
        ctx.fillRect(obstacle.x + 5, centerY - 3 + wingFlap, 8, 3)
        ctx.fillRect(obstacle.x + 22, centerY - 3 - wingFlap, 8, 3)
        
        ctx.strokeStyle = isDark ? 'white' : '#121212'
        ctx.strokeRect(obstacle.x + 10, obstacle.y + 8, 15, 8)
      }
    })
    
    // Draw power-ups with theme colors
    powerUps.current.forEach(powerUp => {
      if (!powerUp.collected) {
        ctx.save()
        ctx.translate(powerUp.x + 15, powerUp.y + 15)
        ctx.rotate(Date.now() * 0.003)
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15)
        gradient.addColorStop(0, '#D4AF37') // lux-gold
        gradient.addColorStop(1, '#BE3455') // viva-magenta
        ctx.fillStyle = gradient
        ctx.fillRect(-15, -15, 30, 30)
        
        ctx.strokeStyle = isDark ? 'white' : '#121212'
        ctx.lineWidth = 2
        ctx.strokeRect(-15, -15, 30, 30)
        
        ctx.fillStyle = 'white'
        ctx.font = 'bold 16px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        if (powerUp.type === 'shield') ctx.fillText('S', 0, 0)
        else if (powerUp.type === 'magnet') ctx.fillText('M', 0, 0)
        else if (powerUp.type === 'star') ctx.fillText('★', 0, 0)
        
        ctx.restore()
      }
    })
    
    // Draw collectibles with theme colors
    collectibles.current.forEach(collectible => {
      if (!collectible.collected) {
        ctx.save()
        ctx.translate(collectible.x + 10, collectible.y + 10)
        ctx.rotate(Date.now() * 0.005)
        
        ctx.fillStyle = '#D4AF37' // lux-gold
        ctx.font = 'bold 20px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.strokeStyle = '#4A2C2A' // lux-brown for outline
        ctx.lineWidth = 1
        ctx.strokeText('★', 0, 0)
        ctx.fillText('★', 0, 0)
        
        ctx.restore()
      }
    })
    
    // Draw UI with theme awareness
    ctx.fillStyle = isDark ? 'white' : '#121212'
    ctx.font = 'bold 24px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(score.toString().padStart(5, '0'), 20, 40)
    
    ctx.font = '14px monospace'
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(18, 18, 18, 0.7)'
    ctx.fillText(`HI: ${highScore.toString().padStart(5, '0')}`, 20, 60)
    ctx.fillText(`${Math.floor(distance.current)}m`, 20, 80)
    
    // Speed indicator
    ctx.fillStyle = '#BE3455'
    ctx.fillText(`${speed.current.toFixed(1)}x`, 20, 100)
    
    // Power-up indicators
    if (shieldActive.current) {
      ctx.fillStyle = '#98A869'
      ctx.textAlign = 'right'
      ctx.fillText(`Shield: ${Math.ceil(shieldTimeLeft.current / 1000)}s`, GAME_WIDTH - 20, 40)
    }
    if (magnetActive.current) {
      ctx.fillStyle = '#008080'
      ctx.textAlign = 'right'
      ctx.fillText(`Magnet: ${Math.ceil(magnetTimeLeft.current / 1000)}s`, GAME_WIDTH - 20, 60)
    }
  }, [score, highScore, isDark])

  // Game loop
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
    lastTimeRef.current = currentTime

    // Update player physics
    if (isJumping.current || playerY.current > GROUND_Y) {
      velocity.current += GRAVITY
      playerY.current -= velocity.current
      
      // Land on ground
      if (playerY.current <= GROUND_Y) {
        playerY.current = GROUND_Y
        velocity.current = 0
        isJumping.current = false
      }
    }

    // Update game speed with Google Dino-style progression
    distance.current += speed.current * 0.1
    
    // More gradual speed increase like Google Dino
    // Speed increases every 100 distance units, but at a slower rate
    const speedIncreaseInterval = 100
    const speedIncreaseAmount = 0.2 // Much smaller increments
    const targetSpeed = BASE_SPEED + Math.floor(distance.current / speedIncreaseInterval) * speedIncreaseAmount
    
    // Cap the maximum speed at a reasonable level
    speed.current = Math.min(targetSpeed, BASE_SPEED + 4) // Max speed is BASE_SPEED + 4
    
    // Update visual offsets
    backgroundOffset.current += speed.current * 0.5
    groundOffset.current += speed.current

    // Google Dino-style obstacle spawning with proper difficulty curve
    const baseSpawnRate = 1200 // Base time between obstacles (ms) - much more generous
    const speedMultiplier = Math.max(0.3, 1 - (distance.current / 2000)) // Reduce time between obstacles as distance increases
    const currentSpawnRate = baseSpawnRate * speedMultiplier
    
    // Track time since last obstacle
    obstacleTimer.current += deltaTime
    
    // Only spawn if enough time has passed and we don't have too many obstacles
    if (obstacleTimer.current >= currentSpawnRate && obstacles.current.length < 3) {
      
      // Progressive spawn chance - starts lower, increases gradually
      const baseChance = 0.7 + (distance.current / 5000) * 0.3 // 70% to 100% over 5000m
      
      if (Math.random() < Math.min(baseChance, 1.0)) {
        
        // Obstacle type progression
        const canSpawnBirds = distance.current > 1000
        let selectedType: 'cactus' | 'rock' | 'bird'
        
        if (!canSpawnBirds) {
          // Early game: only ground obstacles, favor smaller ones
          selectedType = Math.random() < 0.6 ? 'cactus' : 'rock'
        } else {
          // Late game: mix of all types, but still favor ground obstacles
          const rand = Math.random()
          if (rand < 0.5) {
            selectedType = 'cactus'
          } else if (rand < 0.8) {
            selectedType = 'rock'
          } else {
            selectedType = 'bird'
          }
        }
        
        // Standardized obstacle dimensions for fair gameplay
        let width = 25
        let height = 35
        let y = GAME_HEIGHT - GROUND_Y - height
        
        if (selectedType === 'bird') {
          width = 35
          height = 20
          // Birds at fixed, duck-able heights
          const birdHeights = [65, 80] // All heights allow ducking
          const selectedHeight = birdHeights[Math.floor(Math.random() * birdHeights.length)]
          y = GAME_HEIGHT - GROUND_Y - selectedHeight
        } else if (selectedType === 'cactus') {
          // Standardized cactus heights - all jumpable
          const cactusHeights = [30, 35, 40] // All heights are jumpable with standard jump
          height = cactusHeights[Math.floor(Math.random() * cactusHeights.length)]
          width = 20 + Math.random() * 8 // Slight width variation
          y = GAME_HEIGHT - GROUND_Y - height
        } else if (selectedType === 'rock') {
          // Standardized rock heights - all jumpable
          const rockHeights = [25, 30, 35] // All heights are jumpable
          height = rockHeights[Math.floor(Math.random() * rockHeights.length)]
          width = 25 + Math.random() * 8 // Slight width variation
          y = GAME_HEIGHT - GROUND_Y - height
        }
        
        const newObstacle = {
          id: Date.now(),
          x: GAME_WIDTH + 50, // Spawn further off screen for fairness
          type: selectedType,
          width,
          height,
          y
        }
        
        obstacles.current.push(newObstacle)
        obstacleTimer.current = 0 // Reset timer
        
        // Add some randomness to prevent predictable patterns
        const randomDelay = Math.random() * 200 // 0-200ms additional delay
        obstacleTimer.current = -randomDelay
      } else {
        // If we don't spawn, reset timer with a shorter delay for next chance
        obstacleTimer.current = currentSpawnRate * 0.3
      }
    }

    // Update obstacles
    obstacles.current = obstacles.current.filter(obstacle => {
      obstacle.x -= speed.current
      return obstacle.x > -100
    })

    // Spawn power-ups less frequently for balanced gameplay
    if (Math.random() < 0.0005) { // Much rarer than before
      const types: PowerUp['type'][] = ['shield', 'magnet', 'star']
      powerUps.current.push({
        id: Date.now(),
        x: GAME_WIDTH + 50,
        y: GAME_HEIGHT - GROUND_Y - 100 - Math.random() * 80,
        type: types[Math.floor(Math.random() * types.length)],
        collected: false
      })
    }

    // Update power-ups
    powerUps.current = powerUps.current.filter(powerUp => {
      powerUp.x -= speed.current
      return powerUp.x > -50
    })

    // Spawn collectibles more moderately
    if (Math.random() < 0.002) { // Balanced frequency
      collectibles.current.push({
        id: Date.now(),
        x: GAME_WIDTH + 30,
        y: GAME_HEIGHT - GROUND_Y - 80 - Math.random() * 60,
        collected: false,
        value: 10
      })
    }

    // Update collectibles
    collectibles.current = collectibles.current.filter(collectible => {
      collectible.x -= speed.current
      return collectible.x > -30
    })

    // Check collisions with proper hitboxes
    const playerHeight = isDucking.current ? DUCK_HEIGHT : PLAYER_HEIGHT
    const playerRect = {
      x: 80,
      y: GAME_HEIGHT - GROUND_Y - playerHeight - playerY.current + GROUND_Y,
      width: PLAYER_WIDTH,
      height: playerHeight
    }

    // Check obstacle collisions
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
    const magnetRange = magnetActive.current ? 60 : 0
    powerUps.current.forEach(powerUp => {
      if (!powerUp.collected) {
        const dist = Math.hypot(
          powerUp.x + 15 - (playerRect.x + playerRect.width / 2),
          powerUp.y + 15 - (playerRect.y + playerRect.height / 2)
        )
        
        if (dist < 25 + magnetRange) {
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
        
        if (dist < 20 + magnetRange) {
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

    // Update score based on distance
    setScore(s => s + Math.floor(speed.current / 4))

    // Draw everything
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      draw(ctx)
    }

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, score, highScore, checkCollision, draw, playCollectSound, playHitSound, playPowerUpSound])

  // Start game loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameLoop])

  // Draw menu/game over screen
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && (gameState === 'menu' || gameState === 'gameOver' || gameState === 'paused')) {
      // Draw the current state of the game first
      draw(ctx)
      
      // Then draw the overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
      
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      if (gameState === 'menu') {
        ctx.font = 'bold 48px monospace'
        const gradient = ctx.createLinearGradient(0, GAME_HEIGHT / 2 - 60, GAME_WIDTH, GAME_HEIGHT / 2 - 60)
        gradient.addColorStop(0, '#BE3455')
        gradient.addColorStop(0.5, '#D4AF37')
        gradient.addColorStop(1, '#008080')
        ctx.fillStyle = gradient
        ctx.fillText('SYNTHWAVE RUNNER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60)
        
        ctx.font = '20px monospace'
        ctx.fillStyle = isDark ? 'white' : '#121212'
        ctx.fillText('Press SPACE or Click to Start', GAME_WIDTH / 2, GAME_HEIGHT / 2)
        ctx.fillText('↑ or SPACE: Jump  |  ↓: Duck', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40)
      } else if (gameState === 'gameOver') {
        ctx.font = 'bold 48px monospace'
        ctx.fillStyle = '#BE3455'
        ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60)
        
        ctx.font = '24px monospace'
        ctx.fillStyle = isDark ? 'white' : '#121212'
        ctx.fillText(`Final Score: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10)
        
        if (score === highScore && score > 0) {
          ctx.fillStyle = '#D4AF37'
          ctx.fillText('NEW HIGH SCORE!', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20)
        }
        
        ctx.font = '18px monospace'
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(18, 18, 18, 0.8)'
        ctx.fillText('Press SPACE or Click to Restart', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60)
      }
    }
  }, [gameState, draw, score, highScore])

  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 ${
      isDark 
        ? 'bg-gradient-to-b from-lux-black via-lux-gray-900 to-lux-black' 
        : 'bg-gradient-to-b from-lux-offwhite via-gray-100 to-gray-200'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className={`text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-viva-magenta via-lux-gold to-lux-teal bg-clip-text text-transparent`}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            🎮 SYNTHWAVE RUNNER
          </motion.h1>
          <motion.p 
            className={`text-xl mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            The ultimate retro endless runner experience
          </motion.p>
          <motion.div 
            className={`flex justify-center gap-6 text-sm ${isDark ? 'text-cyan-400' : 'text-viva-magenta'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <span className="flex items-center gap-1">
              <Target size={16} />
              High Score: {highScore.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Zap size={16} />
              Canvas Powered
            </span>
          </motion.div>
        </motion.div>

        {/* Game Container */}
        <motion.div 
          className="relative mx-auto mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ maxWidth: '800px' }}
        >
          {/* Outer glow container */}
          <div className="relative p-1 bg-gradient-to-r from-viva-magenta via-lux-gold to-lux-teal rounded-3xl">
            {/* Glass container */}
            <div className="relative glass-card rounded-2xl overflow-hidden border border-white/20 shadow-luxury-lg bg-gradient-to-br from-lux-gray-900/95 to-lux-black/95">
              <canvas
                ref={canvasRef}
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                className="w-full cursor-pointer block"
                style={{ 
                  imageRendering: 'pixelated',
                  background: 'transparent'
                }}
              />
              
              {/* Subtle overlay with your theme colors */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                  background: `repeating-linear-gradient(
                    0deg,
                    transparent 0px,
                    rgba(190, 52, 85, 0.1) 1px,
                    transparent 2px
                  )`
                }}
              />
              
              {/* Corner accents */}
              <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-viva-magenta/50 rounded-tl-lg"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-lux-gold/50 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-lux-teal/50 rounded-bl-lg"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-lux-sage/50 rounded-br-lg"></div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex flex-wrap gap-4 justify-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-lg ${
              soundEnabled 
                ? 'bg-gradient-to-r from-viva-magenta to-lux-gold hover:from-viva-magenta/80 hover:to-lux-gold/80' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </motion.button>

          {/* Theme Toggle */}
          {mounted && (
            <motion.button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg ${
                isDark 
                  ? 'bg-gradient-to-r from-lux-teal to-lux-sage text-white hover:from-lux-teal/80 hover:to-lux-sage/80' 
                  : 'bg-gradient-to-r from-lux-brown to-lux-gray text-white hover:from-lux-brown/80 hover:to-lux-gray/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </motion.button>
          )}
          
          <motion.button
            onClick={() => {
              initGame()
              setGameState('menu')
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={20} />
            Reset Game
          </motion.button>

          <motion.a
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={20} />
            Back to Portfolio
          </motion.a>
        </motion.div>

        {/* Instructions */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className={`${isDark ? 'bg-black/30' : 'bg-white/30'} backdrop-blur-sm rounded-xl p-6 border ${isDark ? 'border-cyan-500/30' : 'border-viva-magenta/30'}`}>
            <h3 className={`text-2xl font-bold mb-4 text-center ${isDark ? 'text-cyan-400' : 'text-viva-magenta'}`}>🎮 How to Play</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-pink-400' : 'text-lux-gold'}`}>Controls</h4>
                <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${isDark ? 'bg-cyan-600' : 'bg-viva-magenta text-white'}`}>SPACE</span>
                    or click to jump
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${isDark ? 'bg-cyan-600' : 'bg-viva-magenta text-white'}`}>↓</span>
                    Hold to duck under flying obstacles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${isDark ? 'bg-cyan-600' : 'bg-viva-magenta text-white'}`}>ENTER</span>
                    Start game or restart after game over
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-pink-400' : 'text-lux-gold'}`}>Power-ups</h4>
                <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li className="flex items-center gap-2">
                    <span className="bg-green-600 px-2 py-1 rounded text-xs font-mono">S</span>
                    Shield - Temporary invincibility (5s)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-600 px-2 py-1 rounded text-xs font-mono">M</span>
                    Magnet - Attracts collectibles (8s)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-yellow-600 px-2 py-1 rounded text-xs font-mono">★</span>
                    Star - Instant 500 bonus points
                  </li>
                </ul>
              </div>
            </div>
            
            <div className={`mt-6 p-4 rounded-lg border ${
              isDark 
                ? 'bg-gradient-to-r from-cyan-900/30 to-pink-900/30 border-cyan-500/20' 
                : 'bg-gradient-to-r from-viva-magenta/10 to-lux-gold/10 border-viva-magenta/20'
            }`}>
              <p className={`text-center ${isDark ? 'text-cyan-300' : 'text-lux-brown'}`}>
                <strong>Objective:</strong> Jump and duck to avoid obstacles while collecting power-ups and stars. 
                The game speeds up as you progress. How far can you run in the synthwave void?
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}