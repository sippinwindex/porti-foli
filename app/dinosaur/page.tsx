'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Zap, Shield, Star, Magnet } from 'lucide-react'

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

export default function ProfessionalSynthwaveRunner() {
  const gameRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  
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

  // Constants
  const GRAVITY = 0.7
  const JUMP_FORCE = -18
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
    } catch (error) { console.log('Audio not supported') }
  }, [soundEnabled])

  const playJumpSound = useCallback(() => playSound(440, 0.1, 'square'), [playSound])
  const playCollectSound = useCallback(() => playSound(880, 0.05, 'triangle'), [playSound])
  const playPowerUpSound = useCallback(() => playSound(660, 0.2, 'sine'), [playSound])
  const playHitSound = useCallback(() => playSound(164, 0.4, 'sawtooth'), [playSound])

  // Input handling
  const handleAction = useCallback(() => {
      if (gameState === 'menu') startGame()
      else if (gameState === 'playing' && !isJumping) jump()
      else if (gameState === 'gameOver') restartGame()
  }, [gameState, isJumping]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); handleAction() }
      if (e.code === 'ArrowDown') { e.preventDefault(); if(gameState === 'playing') setIsDucking(true) }
      if (e.code === 'KeyP') { if (gameState === 'playing') pauseGame(); else if (gameState === 'paused') resumeGame() }
  }, [gameState, handleAction]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') setIsDucking(false)
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    gameRef.current?.addEventListener('click', handleAction)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      gameRef.current?.removeEventListener('click', handleAction)
    }
  }, [handleKeyDown, handleKeyUp, handleAction])

  // Game actions
  const startGame = () => { initGame(); setGameState('playing') }
  const pauseGame = () => setGameState('paused')
  const resumeGame = () => { lastTimeRef.current = performance.now(); setGameState('playing') }
  const restartGame = () => { initGame(); setGameState('playing') }
  const jump = () => { if (!isJumping && playerY <= 0) { setIsJumping(true); setJumpVelocity(JUMP_FORCE); playJumpSound() } }

  // Collision detection
  const checkCollision = useCallback((rect1: any, rect2: any) => (
    rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y
  ), [])

  // Main game loop
  const gameLoop = useCallback((currentTime: number) => {
    if (gameState !== 'playing') { animationRef.current = requestAnimationFrame(gameLoop); return }
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

    // Visuals
    setBackgroundOffset(prev => (prev + currentSpeed * 0.5) % GAME_WIDTH)
    setGroundOffset(prev => (prev + currentSpeed * 2) % GAME_WIDTH)

    // Spawning Logic
    const lastObstacle = obstacles[obstacles.length - 1];
    const minSpawnDist = 150 + speed * 25; 
    if (!lastObstacle || (GAME_WIDTH - lastObstacle.x) > minSpawnDist) {
        if (Math.random() < 0.02) {
            const types: Obstacle['type'][] = ['cactus', 'rock', distance > 500 ? 'bird' : 'cactus'];
            const type = types[Math.floor(Math.random() * types.length)];
            setObstacles(prev => [...prev, {
                id: Date.now(), x: GAME_WIDTH + 10, type,
                height: type === 'bird' ? 30 : 40 + Math.random() * 20,
                width: type === 'bird' ? 40 : 20 + Math.random() * 20,
                flying: type === 'bird'
            }]);
        }
    }
    if (Math.random() < 0.002) setPowerUps(prev => [...prev, { id: Date.now(), x: GAME_WIDTH, y: 60 + Math.random() * 80, type: ['shield', 'magnet', 'star'][Math.floor(Math.random()*3)] as any, collected: false }])
    if (Math.random() < 0.03) setCollectibles(prev => [...prev, { id: Date.now(), x: GAME_WIDTH, y: 40 + Math.random() * 100, collected: false, value: 10 }])

    // Update positions
    setObstacles(prev => prev.map(o => ({ ...o, x: o.x - currentSpeed })).filter(o => o.x > -100))
    setPowerUps(prev => prev.map(p => ({ ...p, x: p.x - currentSpeed })).filter(p => p.x > -50))
    setCollectibles(prev => prev.map(c => ({ ...c, x: c.x - currentSpeed })).filter(c => c.x > -30))

    // Collision Detection
    const playerRect = { x: 100, y: GROUND_Y + playerY, width: PLAYER_WIDTH, height: isDucking ? PLAYER_HEIGHT / 2 : PLAYER_HEIGHT }
    if (!shieldActive) {
      obstacles.forEach(obstacle => {
        const obstacleRect = { x: obstacle.x, y: obstacle.flying ? GROUND_Y + 50 : GROUND_Y, width: obstacle.width, height: obstacle.height }
        if (checkCollision(playerRect, obstacleRect)) {
          playHitSound()
          setGameState('gameOver')
          if (score > highScore) { setHighScore(score); localStorage.setItem('synthwave-runner-high', score.toString()) }
        }
      })
    }
    const magnetDistance = magnetActive ? 120 : 0
    powerUps.filter(p => !p.collected).forEach(powerUp => {
      const dist = Math.hypot(powerUp.x - playerRect.x, powerUp.y - (playerRect.y + playerRect.height / 2))
      if (dist < 30 + magnetDistance) {
        powerUp.collected = true; playPowerUpSound()
        if (powerUp.type === 'shield') { setShieldActive(true); setShieldTimeLeft(5000) }
        if (powerUp.type === 'magnet') { setMagnetActive(true); setMagnetTimeLeft(8000) }
        if (powerUp.type === 'star') setScore(s => s + 500)
      }
    })
    collectibles.filter(c => !c.collected).forEach(collectible => {
        const dist = Math.hypot(collectible.x - playerRect.x, collectible.y - (playerRect.y + playerRect.height/2))
        if(dist < 20 + magnetDistance) {
            collectible.collected = true; playCollectSound(); setScore(s => s + collectible.value);
        }
    })
    
    // Update State
    setDistance(prev => prev + currentSpeed * 0.1)
    setScore(s => s + Math.floor(currentSpeed * 0.02))
    setSpeed(prev => Math.min(prev + 0.001 * normalizedDelta, 15))
    if (shieldActive) setShieldTimeLeft(prev => { const newTime = prev - deltaTime; if (newTime <= 0) { setShieldActive(false); return 0; } return newTime; })
    if (magnetActive) setMagnetTimeLeft(prev => { const newTime = prev - deltaTime; if (newTime <= 0) { setMagnetActive(false); return 0; } return newTime; })
    const dayPhase = Math.floor(distance / 1000) % 4
    setTimeOfDay(['night', 'sunrise', 'day', 'sunset'][dayPhase] as any)
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, speed, playerY, isDucking, obstacles, powerUps, collectibles, shieldActive, magnetActive, score, highScore, distance, checkCollision, playHitSound, playPowerUpSound, playCollectSound])

  useEffect(() => {
    lastTimeRef.current = 0
    animationRef.current = requestAnimationFrame(gameLoop)
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) }
  }, [gameLoop])
  
  const getBackgroundStyle = () => ({
    night: 'linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%)',
    sunrise: 'linear-gradient(180deg, #2d1b69 0%, #f7931e 70%, #ff6b35 100%)',
    day: 'linear-gradient(180deg, #87ceeb 0%, #98fb98 100%)',
    sunset: 'linear-gradient(180deg, #ff6b35 0%, #f7931e 30%, #2d1b69 100%)'
  }[timeOfDay])

  const renderPlayer = () => (
    <motion.div style={{ position: 'absolute', zIndex: 20, left: '100px', bottom: `${GROUND_Y + playerY}px`, width: `${PLAYER_WIDTH}px`, height: `${PLAYER_HEIGHT}px`, transformOrigin: 'bottom' }} animate={{ scaleY: isDucking ? 0.5 : 1 }} transition={{ duration: 0.1 }}>
      <div className={`relative w-full h-full`} style={{ filter: `${shieldActive ? 'drop-shadow(0 0 15px #00ff00)' : ''} ${magnetActive ? 'drop-shadow(0 0 15px #8000ff)' : ''} drop-shadow(0 0 10px rgba(255, 0, 255, 0.7))`}}>
        {shieldActive && <motion.div className="absolute -inset-1 border-4 border-green-400 rounded-full" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} />}
        {magnetActive && <motion.div className="absolute -inset-3 border-2 border-purple-400 rounded-full" animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />}
        <div className={`w-full h-full bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 rounded-lg border-2 border-white/30`} />
        <motion.div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white flex items-center justify-center space-x-0.5" animate={isJumping ? { y: -2 } : { y: 0 }}>
          <div className="w-1 h-1 bg-black rounded-full" />
          <div className="w-1 h-1 bg-black rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  )

  const renderGround = () => (
    <div className="absolute bottom-0 left-0 right-0 h-32 z-10">
      <div className="h-full" style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg width="60" height="128" viewBox="0 0 60 128" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M0 120h60" stroke="%2300ffff" stroke-width="2"/><path d="M0 118h60" stroke="%23ff00ff" stroke-width="1" stroke-dasharray="1 4"/></g></svg>')`, backgroundRepeat: 'repeat-x', width: `${GAME_WIDTH * 2}px`, transform: `translateX(-${groundOffset}px)`, position: 'absolute', bottom: 0, height: '100%' }} />
    </div>
  )

  const renderUI = () => (<>
      <div className="absolute top-4 left-4 z-30 text-white font-mono space-y-1">
        <p className="text-2xl drop-shadow-lg">{score.toLocaleString()}</p>
        <p className="text-sm opacity-80">HI: {highScore.toLocaleString()}</p>
        <p className="text-sm opacity-80">{Math.floor(distance)}m</p>
      </div>
      <div className="absolute top-4 right-4 z-30 space-y-2 flex flex-col items-end">
        {/* FIX: Replaced incorrect dynamic component syntax with a standard ternary operator */}
        <motion.button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 bg-black/30 rounded-full" whileHover={{ scale: 1.1 }}>
          {soundEnabled ? <Volume2 size={20} className="text-white" /> : <VolumeX size={20} className="text-white" />}
        </motion.button>
        {shieldActive && <div className="flex items-center gap-2 px-3 py-1 bg-green-900/50 border border-green-400 text-green-300 rounded-full text-sm"><Shield size={16} />{Math.ceil(shieldTimeLeft / 1000)}s</div>}
        {magnetActive && <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/50 border border-purple-400 text-purple-300 rounded-full text-sm"><Magnet size={16} />{Math.ceil(magnetTimeLeft / 1000)}s</div>}
      </div>
      <div className="absolute bottom-4 left-4 z-30 text-orange-400 font-mono text-sm flex items-center gap-2"><Zap size={16} />{speed.toFixed(1)}x</div>
  </>)

  const renderMenu = (state: 'menu' | 'paused' | 'gameOver') => {
    const menus = {
      menu: { title: "SYNTHWAVE RUNNER", cta: "START GAME", icon: Play },
      paused: { title: "PAUSED", cta: "RESUME", icon: Play },
      gameOver: { title: "GAME OVER", cta: "PLAY AGAIN", icon: RotateCcw }
    }
    const { title, cta, icon: Icon } = menus[state]

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <h1 className={`text-6xl font-bold bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent ${state === 'gameOver' && 'from-red-500 via-yellow-500 to-orange-500'}`}>{title}</h1>
          {state === 'menu' && <p className="text-cyan-300 text-lg">An endless runner with modern physics</p>}
          {state === 'gameOver' && <div className="text-white text-xl">Score: {score.toLocaleString()}</div>}
          <motion.button onClick={state === 'paused' ? resumeGame : state === 'menu' ? startGame : restartGame} className="flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-lg font-bold text-lg backdrop-blur-md" whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }} whileTap={{ scale: 0.95 }}><Icon size={24} />{cta}</motion.button>
          {state !== 'paused' && <motion.button onClick={() => { if(state === 'gameOver') initGame(); setGameState('menu') }} className="text-white/60 hover:text-white transition-colors">{state === 'gameOver' ? 'Back to Menu' : ' '}</motion.button>}
        </motion.div>
      </div>
    )
  }

  return (
    <div ref={gameRef} className="w-full h-screen overflow-hidden relative cursor-pointer select-none" style={{ background: getBackgroundStyle(), filter: 'contrast(1.1)' }}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(90deg, #ff00ff 1px, transparent 1px), linear-gradient(180deg, #00ffff 1px, transparent 1px)`, backgroundSize: '50px 50px', width: `${GAME_WIDTH*2}px`, transform: `translate(-${backgroundOffset}px, 0)` }} />
      <div className="relative w-full h-full">
        {gameState !== 'playing' && renderMenu(gameState)}
        {(gameState === 'playing' || gameState === 'paused') && renderUI()}
        {renderGround()}
        {renderPlayer()}
        {obstacles.map(o => <div key={o.id} className="absolute z-10" style={{left: `${o.x}px`, bottom: o.flying ? `${GROUND_Y + 60}px` : `${GROUND_Y}px`, width: `${o.width}px`, height: `${o.height}px`, filter: `drop-shadow(0 0 8px #000)`}}>{o.type === 'cactus' && (<div className="w-full h-full bg-gradient-to-t from-green-700 to-green-500 rounded-t-lg border-2 border-green-300" />)}{o.type === 'rock' && (<div className="w-full h-full bg-gradient-to-t from-gray-700 to-gray-500 rounded-lg border-2 border-gray-400" />)}{o.type === 'bird' && (<motion.div className="w-full h-full bg-gradient-to-t from-purple-700 to-purple-500 rounded-full border-2 border-purple-300" animate={{ y: [0, -15, 0] }} transition={{ duration: 1, repeat: Infinity }} />)}</div>)}
        {powerUps.map(p => p.collected ? null : <motion.div key={p.id} className="absolute z-20" style={{left: `${p.x}px`, bottom: `${p.y}px`, width: '30px', height: '30px'}} animate={{scale: [1, 1.2, 1], rotate: [0, 360]}} transition={{duration: 2, repeat: Infinity, ease: "easeInOut"}}><div className="w-full h-full bg-yellow-500 rounded-full border-2 border-white/50 flex items-center justify-center text-white">{p.type === 'shield' && <Shield size={16}/>}{p.type === 'magnet' && <Magnet size={16}/>}{p.type === 'star' && <Star size={16}/>}</div></motion.div>)}
        {collectibles.map(c => c.collected ? null : <motion.div key={c.id} className="absolute z-20" style={{left: `${c.x}px`, bottom: `${c.y}px`, width: '20px', height: '20px'}} animate={{rotate: [0, 360], scale: [0.8, 1.2, 0.8]}} transition={{duration: 1.5, repeat: Infinity, ease: "easeInOut"}}><Star className="w-full h-full text-yellow-400" fill="currentColor" /></motion.div>)}
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{ background: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)` }} />
    </div>
  )
}