import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Home, Volume2, VolumeX, RotateCcw, Trophy, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

// Game constants - adjusted for proper Google Dino-like physics
const GRAVITY = 0.8
const JUMP_FORCE = -16
const GROUND_Y = 50 // Distance from bottom of canvas
const PLAYER_WIDTH = 44
const PLAYER_HEIGHT = 47
const DUCK_HEIGHT = 26
const GAME_WIDTH = 800
const GAME_HEIGHT = 400
const BASE_SPEED = 8
const MAX_SPEED = 16

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
  const obstacleTimer = useRef(0)
  
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
    obstacleTimer.current = 0
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

  // Collision detection with proper hitboxes
  const checkCollision = useCallback((playerRect: any, obstacleRect: any) => {
    // Add small buffer to make collisions feel fair
    const buffer = 2
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
    
    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT)
    gradient.addColorStop(0, '#0a0015')
    gradient.addColorStop(0.5, '#1a0033')
    gradient.addColorStop(1, '#2d0052')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    
    // Draw animated grid background
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)'
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
    
    // Draw ground line
    const groundLineY = GAME_HEIGHT - GROUND_Y
    ctx.strokeStyle = '#00ffff'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, groundLineY)
    ctx.lineTo(GAME_WIDTH, groundLineY)
    ctx.stroke()
    
    // Draw moving ground pattern
    ctx.strokeStyle = '#ff00ff'
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
    
    // Player shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(playerX - 2, GAME_HEIGHT - GROUND_Y, PLAYER_WIDTH + 4, 4)
    
    // Shield effect
    if (shieldActive.current) {
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 3
      ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.01) * 0.3
      ctx.beginPath()
      ctx.arc(playerX + PLAYER_WIDTH/2, playerYPos + playerHeight/2, 35, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1
    }
    
    // Magnet effect
    if (magnetActive.current) {
      ctx.strokeStyle = '#8000ff'
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.4 + Math.sin(Date.now() * 0.008) * 0.2
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(playerX + PLAYER_WIDTH/2, playerYPos + playerHeight/2, 40 + i * 8, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
    
    // Player body (rectangle with rounded corners effect)
    const playerGradient = ctx.createLinearGradient(playerX, playerYPos, playerX + PLAYER_WIDTH, playerYPos + playerHeight)
    playerGradient.addColorStop(0, '#ff1493')
    playerGradient.addColorStop(0.5, '#9400d3')
    playerGradient.addColorStop(1, '#00ffff')
    ctx.fillStyle = playerGradient
    
    // Main body
    ctx.fillRect(playerX, playerYPos, PLAYER_WIDTH, playerHeight)
    
    // Player eyes (only if not ducking)
    if (!isDucking.current) {
      ctx.fillStyle = 'white'
      ctx.fillRect(playerX + 8, playerYPos + 8, 8, 8)
      ctx.fillRect(playerX + 24, playerYPos + 8, 8, 8)
      ctx.fillStyle = 'black'
      ctx.fillRect(playerX + 10, playerYPos + 10, 4, 4)
      ctx.fillRect(playerX + 26, playerYPos + 10, 4, 4)
    }
    
    // Player outline
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1
    ctx.strokeRect(playerX, playerYPos, PLAYER_WIDTH, playerHeight)
    
    // Draw obstacles
    obstacles.current.forEach(obstacle => {
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 1
      
      if (obstacle.type === 'cactus') {
        const gradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height)
        gradient.addColorStop(0, '#00ff00')
        gradient.addColorStop(1, '#008800')
        ctx.fillStyle = gradient
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        
        // Cactus spikes
        ctx.fillStyle = '#00aa00'
        for (let i = 5; i < obstacle.height - 5; i += 8) {
          ctx.fillRect(obstacle.x - 3, obstacle.y + i, 6, 4)
          ctx.fillRect(obstacle.x + obstacle.width - 3, obstacle.y + i, 6, 4)
        }
      } else if (obstacle.type === 'rock') {
        const gradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height)
        gradient.addColorStop(0, '#888888')
        gradient.addColorStop(1, '#444444')
        ctx.fillStyle = gradient
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      } else if (obstacle.type === 'bird') {
        // Flying obstacle
        const centerX = obstacle.x + obstacle.width / 2
        const centerY = obstacle.y + obstacle.height / 2
        const wingFlap = Math.sin(Date.now() * 0.01) * 5
        
        ctx.fillStyle = '#ff00ff'
        // Body
        ctx.fillRect(obstacle.x + 10, obstacle.y + 8, 15, 8)
        // Wings
        ctx.fillRect(obstacle.x + 5, centerY - 3 + wingFlap, 8, 3)
        ctx.fillRect(obstacle.x + 22, centerY - 3 - wingFlap, 8, 3)
        
        ctx.strokeStyle = 'white'
        ctx.strokeRect(obstacle.x + 10, obstacle.y + 8, 15, 8)
      }
    })
    
    // Draw power-ups
    powerUps.current.forEach(powerUp => {
      if (!powerUp.collected) {
        ctx.save()
        ctx.translate(powerUp.x + 15, powerUp.y + 15)
        ctx.rotate(Date.now() * 0.003)
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15)
        gradient.addColorStop(0, '#ffff00')
        gradient.addColorStop(1, '#ff8800')
        ctx.fillStyle = gradient
        ctx.fillRect(-15, -15, 30, 30)
        
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2
        ctx.strokeRect(-15, -15, 30, 30)
        
        ctx.fillStyle = 'black'
        ctx.font = 'bold 16px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        if (powerUp.type === 'shield') ctx.fillText('S', 0, 0)
        else if (powerUp.type === 'magnet') ctx.fillText('M', 0, 0)
        else if (powerUp.type === 'star') ctx.fillText('★', 0, 0)
        
        ctx.restore()
      }
    })
    
    // Draw collectibles
    collectibles.current.forEach(collectible => {
      if (!collectible.collected) {
        ctx.save()
        ctx.translate(collectible.x + 10, collectible.y + 10)
        ctx.rotate(Date.now() * 0.005)
        
        ctx.fillStyle = '#ffff00'
        ctx.font = 'bold 20px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1
        ctx.strokeText('★', 0, 0)
        ctx.fillText('★', 0, 0)
        
        ctx.restore()
      }
    })
    
    // Draw UI
    ctx.fillStyle = 'white'
    ctx.font = 'bold 24px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(score.toString().padStart(5, '0'), 20, 40)
    
    ctx.font = '14px monospace'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText(`HI: ${highScore.toString().padStart(5, '0')}`, 20, 60)
    ctx.fillText(`${Math.floor(distance.current)}m`, 20, 80)
    
    // Speed indicator
    ctx.fillStyle = '#ff8800'
    ctx.fillText(`${speed.current.toFixed(1)}x`, 20, 100)
    
    // Power-up indicators
    if (shieldActive.current) {
      ctx.fillStyle = '#00ff00'
      ctx.textAlign = 'right'
      ctx.fillText(`Shield: ${Math.ceil(shieldTimeLeft.current / 1000)}s`, GAME_WIDTH - 20, 40)
    }
    if (magnetActive.current) {
      ctx.fillStyle = '#8000ff'
      ctx.textAlign = 'right'
      ctx.fillText(`Magnet: ${Math.ceil(magnetTimeLeft.current / 1000)}s`, GAME_WIDTH - 20, 60)
    }
  }, [score, highScore])

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

    // Update game speed and distance
    distance.current += speed.current * 0.1
    speed.current = Math.min(BASE_SPEED + Math.floor(distance.current / 100) * 0.5, MAX_SPEED)
    
    // Update visual offsets
    backgroundOffset.current += speed.current * 0.5
    groundOffset.current += speed.current

    // Spawn obstacles with proper timing
    obstacleTimer.current += deltaTime
    const minObstacleDistance = 80 + (20 - speed.current) * 10 // Closer obstacles at higher speeds
    
    if (obstacleTimer.current > minObstacleDistance && (obstacles.current.length === 0 || 
        obstacles.current[obstacles.current.length - 1].x < GAME_WIDTH - 200)) {
      
      if (Math.random() < 0.7) { // 70% chance to spawn obstacle
        const types: ('cactus' | 'rock' | 'bird')[] = distance.current > 500 ? ['cactus', 'rock', 'bird'] : ['cactus', 'rock']
        const type = types[Math.floor(Math.random() * types.length)]
        
        let width = 25
        let height = 40
        let y = GAME_HEIGHT - GROUND_Y - height
        
        if (type === 'bird') {
          width = 35
          height = 24
          y = GAME_HEIGHT - GROUND_Y - height - 30 - Math.random() * 40 // Flying height variation
        } else if (type === 'cactus') {
          height = 35 + Math.random() * 15 // Height variation
          y = GAME_HEIGHT - GROUND_Y - height
        }
        
        obstacles.current.push({
          id: Date.now(),
          x: GAME_WIDTH,
          type,
          width,
          height,
          y
        })
        obstacleTimer.current = 0
      }
    }

    // Update obstacles
    obstacles.current = obstacles.current.filter(obstacle => {
      obstacle.x -= speed.current
      return obstacle.x > -100
    })

    // Spawn power-ups occasionally
    if (Math.random() < 0.001) { // Much rarer than before
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

    // Spawn collectibles
    if (Math.random() < 0.005) {
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
        gradient.addColorStop(0, '#ff1493')
        gradient.addColorStop(0.5, '#00ffff')
        gradient.addColorStop(1, '#ffff00')
        ctx.fillStyle = gradient
        ctx.fillText('SYNTHWAVE RUNNER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60)
        
        ctx.font = '20px monospace'
        ctx.fillStyle = 'white'
        ctx.fillText('Press SPACE or Click to Start', GAME_WIDTH / 2, GAME_HEIGHT / 2)
        ctx.fillText('↑ or SPACE: Jump  |  ↓: Duck', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40)
      } else if (gameState === 'gameOver') {
        ctx.font = 'bold 48px monospace'
        ctx.fillStyle = '#ff4444'
        ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60)
        
        ctx.font = '24px monospace'
        ctx.fillStyle = 'white'
        ctx.fillText(`Final Score: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10)
        
        if (score === highScore && score > 0) {
          ctx.fillStyle = '#ffff00'
          ctx.fillText('NEW HIGH SCORE!', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20)
        }
        
        ctx.font = '18px monospace'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fillText('Press SPACE or Click to Restart', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60)
      }
    }
  }, [gameState, draw, score, highScore])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent"
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
            className="text-xl text-gray-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            The ultimate retro endless runner experience
          </motion.p>
          <motion.div 
            className="flex justify-center gap-6 text-cyan-400 text-sm"
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
          <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl bg-black">
            <canvas
              ref={canvasRef}
              width={GAME_WIDTH}
              height={GAME_HEIGHT}
              className="w-full cursor-pointer block"
              style={{ 
                imageRendering: 'pixelated',
                filter: 'contrast(1.1) saturate(1.2)',
                boxShadow: '0 0 50px rgba(0, 255, 255, 0.3)'
              }}
            />
            
            {/* Retro scanlines overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent 0px,
                  rgba(0, 255, 255, 0.1) 1px,
                  transparent 2px
                )`
              }}
            />
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
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </motion.button>
          
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
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4 text-center">🎮 How to Play</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-pink-400 mb-3">Controls</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="bg-cyan-600 px-2 py-1 rounded text-xs font-mono">SPACE</span>
                    or click to jump
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-cyan-600 px-2 py-1 rounded text-xs font-mono">↓</span>
                    Hold to duck under flying obstacles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-cyan-600 px-2 py-1 rounded text-xs font-mono">ENTER</span>
                    Start game or restart after game over
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-pink-400 mb-3">Power-ups</h4>
                <ul className="space-y-2 text-gray-300">
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
            
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-pink-900/30 rounded-lg border border-cyan-500/20">
              <p className="text-center text-cyan-300">
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