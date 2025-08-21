import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  Volume2, 
  VolumeX, 
  Trophy, 
  Skull, 
  Zap, 
  Target, 
  Shield, 
  Swords,
  RotateCcw,
  Home,
  Play,
  Lightbulb
} from 'lucide-react'

// Enhanced Game State Interface
interface GameState {
  playerHealth: number;
  npcHealth: number;
  maxHealth: number;
  gameOver: boolean;
  winner: 'player' | 'npc' | null;
  playerAction: 'standing' | 'punch' | 'hit' | 'dead' | 'winner' | 'block';
  npcAction: 'standing' | 'punch' | 'hit' | 'dead' | 'winner' | 'block';
  gameStarted: boolean;
  combo: number;
  playerScore: number;
  npcScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  soundEnabled: boolean;
  playerStamina: number;
  npcStamina: number;
  maxStamina: number;
  playerBlocking: boolean;
  npcBlocking: boolean;
  lastPlayerAction: number;
  lastNpcAction: number;
  playerCooldown: number;
  npcCooldown: number;
  inputBuffer: string[];
  npcPattern: string[];
  npcPatternIndex: number;
  roundTime: number;
  stunned: boolean;
  stunnedTime: number;
}

const initialState: GameState = {
  playerHealth: 100,
  npcHealth: 100,
  maxHealth: 100,
  gameOver: false,
  winner: null,
  playerAction: 'standing',
  npcAction: 'standing',
  gameStarted: false,
  combo: 0,
  playerScore: 0,
  npcScore: 0,
  difficulty: 'medium',
  soundEnabled: true,
  playerStamina: 100,
  npcStamina: 100,
  maxStamina: 100,
  playerBlocking: false,
  npcBlocking: false,
  lastPlayerAction: 0,
  lastNpcAction: 0,
  playerCooldown: 0,
  npcCooldown: 0,
  inputBuffer: [],
  npcPattern: [],
  npcPatternIndex: 0,
  roundTime: 0,
  stunned: false,
  stunnedTime: 0,
};

// Improved sound system with better timing
const playSound = (soundType: string, enabled: boolean) => {
  if (!enabled) return
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    const createTone = (frequency: number, duration: number, volume: number = 0.15, type: OscillatorType = 'square') => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.005)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    }
    
    switch (soundType) {
      case 'punch':
        createTone(180, 0.08, 0.25)
        break
      case 'hit':
        createTone(120, 0.15, 0.3)
        break
      case 'block':
        createTone(320, 0.06, 0.2, 'sine')
        break
      case 'combo':
        createTone(440, 0.12, 0.25, 'sine')
        break
      case 'victory':
        [440, 554, 659, 880].forEach((freq, i) => {
          setTimeout(() => createTone(freq, 0.2, 0.15, 'sine'), i * 150)
        })
        break
      case 'defeat':
        createTone(220, 0.5, 0.2)
        break
      case 'start':
        createTone(330, 0.15, 0.2)
        break
      case 'stun':
        createTone(100, 0.3, 0.2)
        break
    }
  } catch (error) {
    console.log(`Sound: ${soundType}`)
  }
}

// Enhanced Robot Component with better animations
const PixelRobot: React.FC<{
  color: 'blue' | 'red';
  action: 'standing' | 'punch' | 'hit' | 'dead' | 'winner' | 'block';
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  isBlocking: boolean;
  stunned: boolean;
}> = ({ color, action, health, maxHealth, stamina, maxStamina, isBlocking, stunned }) => {
  const baseColor = color === 'blue' ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)';
  const lightColor = color === 'blue' ? 'rgb(147, 197, 253)' : 'rgb(252, 165, 165)';
  const darkColor = color === 'blue' ? 'rgb(29, 78, 216)' : 'rgb(185, 28, 28)';

  const healthPercentage = Math.max(0, (health / maxHealth) * 100);
  const staminaPercentage = Math.max(0, (stamina / maxStamina) * 100);

  const getHealthClass = () => {
    if (healthPercentage > 60) return 'bg-green-500';
    if (healthPercentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getEyeState = () => {
    if (stunned) return '@ @';
    if (action === 'dead') return 'X X';
    if (action === 'winner') return '^ ^';
    if (action === 'hit') return '> <';
    if (action === 'block') return '- -';
    return '• •';
  };

  const getRobotClass = () => {
    let classes = 'pixel-robot transition-all duration-150 ease-out';
    if (stunned) classes += ' animate-bounce';
    else if (action === 'punch') classes += ' scale-110 translate-x-2';
    else if (action === 'hit') classes += ' scale-90 -translate-x-3';
    else if (action === 'block') classes += ' scale-95';
    else if (action === 'dead') classes += ' scale-75 rotate-12 opacity-40';
    else if (action === 'winner') classes += ' scale-110 animate-pulse';
    else classes += ' hover:scale-105';
    
    return classes;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Health Bar */}
      <div className="w-20 h-2 bg-gray-700 rounded-full border border-gray-600 overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ease-out ${getHealthClass()}`}
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
      
      {/* Stamina Bar */}
      <div className="w-20 h-1 bg-gray-700 rounded-full border border-gray-600 overflow-hidden">
        <div 
          className="h-full bg-blue-400 transition-all duration-200 ease-out"
          style={{ width: `${staminaPercentage}%` }}
        />
      </div>

      {/* Robot */}
      <div className={getRobotClass()}>
        {/* Shield Effect */}
        {isBlocking && (
          <div className="absolute -inset-1 border-2 border-yellow-400 rounded-lg animate-pulse bg-yellow-400/10" />
        )}

        {/* Robot Body */}
        <div 
          className="relative w-20 h-20 rounded-lg border-2 border-gray-800 shadow-lg"
          style={{ 
            background: `linear-gradient(145deg, ${lightColor}, ${baseColor}, ${darkColor})`,
            filter: action === 'dead' ? 'grayscale(80%)' : 'none'
          }}
        >
          {/* Head */}
          <div 
            className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 rounded border border-gray-700"
            style={{ backgroundColor: baseColor }}
          >
            {/* Eyes */}
            <div className="flex justify-center items-center h-full">
              <span className="text-xs font-bold text-white font-mono">
                {getEyeState()}
              </span>
            </div>
            
            {/* Antenna */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="w-0.5 h-1 bg-gray-600"></div>
              <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Body Core */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-6">
            <div 
              className="w-full h-4 border border-gray-700 rounded"
              style={{ backgroundColor: darkColor }}
            >
              <div className="flex justify-center items-center h-full">
                <div className="w-0.5 h-0.5 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Arms */}
          <div className="absolute top-7 -left-2 w-4 h-3 rounded border border-gray-700"
               style={{ backgroundColor: baseColor }}>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded border border-gray-700"
                 style={{ backgroundColor: lightColor }}></div>
          </div>
          
          <div className="absolute top-7 -right-2 w-4 h-3 rounded border border-gray-700"
               style={{ backgroundColor: baseColor }}>
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded border border-gray-700"
                 style={{ backgroundColor: lightColor }}></div>
          </div>

          {/* Legs */}
          <div className="absolute bottom-1 left-1/4 w-2 h-4 rounded-b border border-gray-700"
               style={{ backgroundColor: baseColor }}></div>
          <div className="absolute bottom-1 right-1/4 w-2 h-4 rounded-b border border-gray-700"
               style={{ backgroundColor: baseColor }}></div>

          {/* Action Effects */}
          {action === 'punch' && (
            <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-yellow-400 animate-ping">
              <Zap className="w-4 h-4" />
            </div>
          )}
          
          {action === 'winner' && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-bounce">
              <Trophy className="w-4 h-4" />
            </div>
          )}

          {stunned && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-purple-400 animate-spin">
              ⭐
            </div>
          )}
        </div>
      </div>

      {/* Robot Stats */}
      <div className="text-center">
        <div className={`font-mono text-xs font-bold ${color === 'blue' ? 'text-blue-400' : 'text-red-400'}`}>
          {color === 'blue' ? 'PLAYER' : 'CPU'}
        </div>
        <div className="text-xs text-gray-400">
          HP: {Math.ceil(health)}/{maxHealth}
        </div>
      </div>
    </div>
  );
};

const ImprovedRockEmSockEm: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialState)
  const [inputState, setInputState] = useState({ punch: false, block: false })
  const gameLoopRef = useRef<number>()
  const lastFrameRef = useRef<number>(0)
  const soundCooldownRef = useRef<{ [key: string]: number }>({})

  // Input handling with immediate response
  const handleInput = useCallback((action: 'punch' | 'block', pressed: boolean) => {
    setInputState(prev => ({ ...prev, [action]: pressed }))
  }, [])

  // Enhanced keyboard controls with better responsiveness
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.code === 'Space') handleInput('punch', true)
      if (e.code === 'KeyX') handleInput('block', true)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.code === 'Space') handleInput('punch', false)
      if (e.code === 'KeyX') handleInput('block', false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleInput])

  // Sound with better cooldown management
  const playSoundWithCooldown = useCallback((soundType: string, cooldown: number = 50) => {
    const now = Date.now()
    if (now - (soundCooldownRef.current[soundType] || 0) > cooldown) {
      playSound(soundType, gameState.soundEnabled)
      soundCooldownRef.current[soundType] = now
    }
  }, [gameState.soundEnabled])

  // Enhanced game logic functions
  const calculateDamage = useCallback((combo: number, isBlocking: boolean, difficulty: string): number => {
    const baseDamage = 12 + Math.random() * 8 // 12-20 base damage
    const comboMultiplier = 1 + (combo * 0.12) // 12% more damage per combo
    const blockReduction = isBlocking ? 0.25 : 1 // 75% damage reduction when blocking
    const difficultyMultiplier = difficulty === 'hard' ? 1.2 : difficulty === 'easy' ? 0.8 : 1
    
    return Math.floor(baseDamage * comboMultiplier * blockReduction * difficultyMultiplier)
  }, [])

  const getDifficultySettings = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    return {
      easy: { 
        reactionTime: 1000, 
        blockChance: 0.15, 
        attackFrequency: 0.25,
        accuracy: 0.6,
        name: 'Easy',
        color: 'text-green-400'
      },
      medium: { 
        reactionTime: 700, 
        blockChance: 0.3, 
        attackFrequency: 0.4,
        accuracy: 0.75,
        name: 'Medium',
        color: 'text-yellow-400'
      },
      hard: { 
        reactionTime: 500, 
        blockChance: 0.45, 
        attackFrequency: 0.6,
        accuracy: 0.85,
        name: 'Hard',
        color: 'text-red-400'
      },
    }[difficulty]
  }, [])

  // Main game loop with improved timing
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      return
    }

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastFrameRef.current
      lastFrameRef.current = timestamp

      if (deltaTime < 8) { // ~120 FPS cap for smoother feel
        gameLoopRef.current = requestAnimationFrame(gameLoop)
        return
      }

      setGameState(prevState => {
        let newState = { ...prevState }
        
        // Update round time
        newState.roundTime += deltaTime

        // Handle stun recovery
        if (newState.stunned) {
          newState.stunnedTime -= deltaTime
          if (newState.stunnedTime <= 0) {
            newState.stunned = false
            newState.stunnedTime = 0
          }
        }

        // Regenerate stamina faster
        const staminaRegenRate = 1.2
        if (newState.playerStamina < newState.maxStamina) {
          newState.playerStamina = Math.min(newState.maxStamina, newState.playerStamina + staminaRegenRate)
        }
        if (newState.npcStamina < newState.maxStamina) {
          newState.npcStamina = Math.min(newState.maxStamina, newState.npcStamina + (staminaRegenRate * 0.8))
        }

        // Update cooldowns
        if (newState.playerCooldown > 0) {
          newState.playerCooldown = Math.max(0, newState.playerCooldown - deltaTime)
        }
        if (newState.npcCooldown > 0) {
          newState.npcCooldown = Math.max(0, newState.npcCooldown - deltaTime)
        }

        // Handle player input immediately
        if (inputState.punch && newState.playerStamina >= 15 && newState.playerCooldown <= 0 && !newState.stunned) {
          const prevNpcHealth = newState.npcHealth
          const damage = calculateDamage(newState.combo, newState.npcBlocking, newState.difficulty)
          newState.npcHealth = Math.max(0, newState.npcHealth - damage)
          newState.playerStamina -= 15
          newState.playerAction = 'punch'
          newState.lastPlayerAction = timestamp
          newState.playerCooldown = 200 // Faster cooldown
          
          if (newState.npcHealth < prevNpcHealth) {
            newState.combo += 1
            
            if (newState.npcBlocking) {
              playSoundWithCooldown('block', 100)
            } else {
              playSoundWithCooldown('punch', 100)
              playSoundWithCooldown('hit', 150)
              newState.npcAction = 'hit'
              newState.lastNpcAction = timestamp
              
              // Stun chance on high combo
              if (newState.combo >= 5 && Math.random() < 0.3) {
                newState.stunned = true
                newState.stunnedTime = 1000
                playSoundWithCooldown('stun', 500)
              }
            }
            
            if (newState.combo > 2 && newState.combo % 3 === 0) {
              playSoundWithCooldown('combo', 300)
            }
          }
        }

        if (inputState.block && newState.playerStamina >= 0.3 && !newState.stunned) {
          newState.playerBlocking = true
          newState.playerAction = 'block'
          newState.playerStamina = Math.max(0, newState.playerStamina - 0.3)
        } else if (!inputState.block) {
          newState.playerBlocking = false
          if (newState.playerAction === 'block') {
            newState.playerAction = 'standing'
          }
        }

        // Enhanced NPC AI
        const difficulty = getDifficultySettings(newState.difficulty)
        if (timestamp - newState.lastNpcAction > difficulty.reactionTime && newState.npcCooldown <= 0 && !newState.stunned) {
          const shouldAttack = Math.random() < difficulty.attackFrequency
          const shouldBlock = Math.random() < difficulty.blockChance

          if (shouldAttack && newState.npcStamina >= 15) {
            const accuracy = Math.random() < difficulty.accuracy
            if (accuracy) {
              const prevPlayerHealth = newState.playerHealth
              const damage = calculateDamage(0, newState.playerBlocking, newState.difficulty)
              newState.playerHealth = Math.max(0, newState.playerHealth - damage)
              newState.npcStamina -= 15
              newState.npcAction = 'punch'
              newState.lastNpcAction = timestamp
              newState.npcCooldown = 350
              newState.combo = 0 // Reset player combo

              if (newState.playerHealth < prevPlayerHealth) {
                if (newState.playerBlocking) {
                  playSoundWithCooldown('block', 100)
                } else {
                  playSoundWithCooldown('punch', 100)
                  playSoundWithCooldown('hit', 150)
                  newState.playerAction = 'hit'
                  newState.lastPlayerAction = timestamp
                }
              }
            }
          } else if (shouldBlock && newState.npcStamina >= 10) {
            newState.npcBlocking = true
            newState.npcAction = 'block'
            newState.npcStamina = Math.max(0, newState.npcStamina - 0.2)
            newState.lastNpcAction = timestamp
          }
        }

        // Reset actions after shorter duration
        if (timestamp - newState.lastPlayerAction > 200 && !newState.playerBlocking && newState.playerAction !== 'standing') {
          newState.playerAction = 'standing'
        }
        if (timestamp - newState.lastNpcAction > 200 && !newState.npcBlocking && newState.npcAction !== 'standing') {
          newState.npcAction = 'standing'
          newState.npcBlocking = false
        }

        // Check win conditions
        if (newState.playerHealth <= 0 && !newState.gameOver) {
          newState.gameOver = true
          newState.winner = 'npc'
          newState.playerAction = 'dead'
          newState.npcAction = 'winner'
          newState.npcScore += 1
          setTimeout(() => playSoundWithCooldown('defeat', 1000), 300)
        } else if (newState.npcHealth <= 0 && !newState.gameOver) {
          newState.gameOver = true
          newState.winner = 'player'
          newState.playerAction = 'winner'
          newState.npcAction = 'dead'
          newState.playerScore += 1
          setTimeout(() => playSoundWithCooldown('victory', 1000), 300)
        }

        return newState
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState.gameStarted, gameState.gameOver, inputState, playSoundWithCooldown, calculateDamage, getDifficultySettings])

  // Game control functions
  const handleStartGame = useCallback((difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    playSoundWithCooldown('start', 200)
    setGameState({ ...initialState, gameStarted: true, difficulty, soundEnabled: gameState.soundEnabled })
  }, [gameState.soundEnabled, playSoundWithCooldown])

  const handleResetGame = useCallback(() => {
    setGameState({ ...initialState, soundEnabled: gameState.soundEnabled })
  }, [gameState.soundEnabled])

  const handleToggleSound = useCallback(() => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))
  }, [])

  const getComboMessage = (combo: number): string => {
    if (combo >= 10) return 'LEGENDARY!';
    if (combo >= 7) return 'AMAZING!';
    if (combo >= 5) return 'GREAT!';
    if (combo >= 3) return 'NICE!';
    return '';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-pink-800 p-6 text-center relative">
          <button 
            className="absolute top-4 right-4 p-2 hover:scale-110 transition-transform bg-black/20 rounded-lg"
            onClick={handleToggleSound}
            title={gameState.soundEnabled ? 'Mute' : 'Unmute'}
          >
            {gameState.soundEnabled ? 
              <Volume2 className="w-6 h-6 text-white" /> : 
              <VolumeX className="w-6 h-6 text-white" />
            }
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-2 font-mono tracking-wider">
            ROCK 'EM SOCK 'EM ROBOTS
          </h1>
          <p className="text-purple-200">
            Enhanced Real-Time Combat System
          </p>
        </div>

        {/* Game Content */}
        <div className="p-6">
          {/* Difficulty Selector */}
          {!gameState.gameStarted && (
            <div className="flex justify-center gap-4 mb-6">
              {(['easy', 'medium', 'hard'] as const).map((diff) => {
                const info = getDifficultySettings(diff)
                return (
                  <button
                    key={diff}
                    className={`px-4 py-2 rounded-lg font-mono text-sm transition-all flex items-center gap-2 ${
                      gameState.difficulty === diff 
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setGameState(prev => ({ ...prev, difficulty: diff }))}
                  >
                    <Target className="w-4 h-4" />
                    {info.name}
                  </button>
                )
              })}
            </div>
          )}

          {/* Game Stats */}
          {gameState.gameStarted && (
            <div className="grid grid-cols-4 gap-4 mb-4 bg-gray-900/50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 font-mono flex items-center justify-center gap-1">
                  <Swords className="w-4 h-4" />
                  ROUND
                </div>
                <div className="text-xl font-bold text-yellow-400">{gameState.playerScore + gameState.npcScore + 1}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 font-mono flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4" />
                  SCORE
                </div>
                <div className="text-xl font-bold text-white">{gameState.playerScore} - {gameState.npcScore}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 font-mono flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4" />
                  COMBO
                </div>
                <div className="text-xl font-bold text-orange-400">{gameState.combo}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 font-mono flex items-center justify-center gap-1">
                  <Target className="w-4 h-4" />
                  DIFFICULTY
                </div>
                <div className={`text-sm font-bold ${getDifficultySettings(gameState.difficulty).color}`}>
                  {getDifficultySettings(gameState.difficulty).name}
                </div>
              </div>
            </div>
          )}

          {/* Combo Message */}
          {gameState.combo > 2 && !gameState.gameOver && (
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-yellow-400 animate-pulse flex items-center justify-center gap-2">
                <Zap className="w-6 h-6" />
                {gameState.combo}x COMBO! {getComboMessage(gameState.combo)}
                <Zap className="w-6 h-6" />
              </div>
            </div>
          )}

          {/* Robots Arena */}
          <div className="bg-gray-900/50 rounded-xl p-6 mb-4">
            <div className="flex justify-center items-center gap-12">
              <PixelRobot 
                color="blue" 
                action={gameState.gameOver ? (gameState.winner === 'player' ? 'winner' : 'dead') : gameState.playerAction}
                health={gameState.playerHealth}
                maxHealth={gameState.maxHealth}
                stamina={gameState.playerStamina}
                maxStamina={gameState.maxStamina}
                isBlocking={gameState.playerBlocking}
                stunned={gameState.stunned}
              />

              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 animate-pulse mb-2">VS</div>
                {gameState.gameStarted && !gameState.gameOver && (
                  <div className="text-xs font-mono text-gray-400">
                    <div className="text-blue-400 flex items-center justify-center gap-1">
                      <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></span>
                      REAL-TIME
                    </div>
                  </div>
                )}
              </div>

              <PixelRobot 
                color="red" 
                action={gameState.gameOver ? (gameState.winner === 'npc' ? 'winner' : 'dead') : gameState.npcAction}
                health={gameState.npcHealth}
                maxHealth={gameState.maxHealth}
                stamina={gameState.npcStamina}
                maxStamina={gameState.maxStamina}
                isBlocking={gameState.npcBlocking}
                stunned={false}
              />
            </div>
          </div>

          {/* Touch Controls */}
          {gameState.gameStarted && !gameState.gameOver && (
            <div className="flex justify-center gap-6 mb-4">
              <button
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                  inputState.punch 
                    ? 'bg-red-500 border-red-400 scale-95' 
                    : 'bg-red-600/80 border-red-500 hover:bg-red-500 active:scale-95'
                } ${gameState.playerStamina < 15 || gameState.playerCooldown > 0 ? 'opacity-50' : ''}`}
                onMouseDown={() => handleInput('punch', true)}
                onMouseUp={() => handleInput('punch', false)}
                onMouseLeave={() => handleInput('punch', false)}
                onTouchStart={() => handleInput('punch', true)}
                onTouchEnd={() => handleInput('punch', false)}
                disabled={gameState.playerStamina < 15 || gameState.playerCooldown > 0 || gameState.stunned}
              >
                <Zap className="w-6 h-6 text-white" />
              </button>
              
              <button
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                  inputState.block 
                    ? 'bg-yellow-500 border-yellow-400 scale-95' 
                    : 'bg-yellow-600/80 border-yellow-500 hover:bg-yellow-500 active:scale-95'
                } ${gameState.playerStamina < 10 ? 'opacity-50' : ''}`}
                onMouseDown={() => handleInput('block', true)}
                onMouseUp={() => handleInput('block', false)}
                onMouseLeave={() => handleInput('block', false)}
                onTouchStart={() => handleInput('block', true)}
                onTouchEnd={() => handleInput('block', false)}
                disabled={gameState.playerStamina < 10 || gameState.stunned}
              >
                <Shield className="w-6 h-6 text-white" />
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState.gameOver && (
            <div className="text-center mb-6 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500">
              <div className={`text-4xl font-bold mb-4 flex items-center justify-center gap-4 ${
                gameState.winner === 'player' ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameState.winner === 'player' ? (
                  <>
                    <Trophy className="w-10 h-10" />
                    YOU WIN!
                    <Trophy className="w-10 h-10" />
                  </>
                ) : (
                  <>
                    <Skull className="w-10 h-10" />
                    GAME OVER
                    <Skull className="w-10 h-10" />
                  </>
                )}
              </div>
              <div className="text-lg text-gray-300 mb-2">
                Final Score: {gameState.playerScore} - {gameState.npcScore}
              </div>
              {gameState.combo > 5 && (
                <div className="text-md text-yellow-400 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  Best Combo: {gameState.combo} hits!
                </div>
              )}
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!gameState.gameStarted ? (
              <button 
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                onClick={() => handleStartGame(gameState.difficulty)}
              >
                <Play className="w-5 h-5" />
                START FIGHT
              </button>
            ) : gameState.gameOver ? (
              <>
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                  onClick={() => handleStartGame(gameState.difficulty)}
                >
                  <RotateCcw className="w-4 h-4" />
                  PLAY AGAIN
                </button>
                <button 
                  className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                  onClick={handleResetGame}
                >
                  <Home className="w-4 h-4" />
                  MAIN MENU
                </button>
              </>
            ) : (
              <button 
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                onClick={handleResetGame}
              >
                <Home className="w-4 h-4" />
                QUIT GAME
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center mt-6">
            <div className="text-sm text-gray-400 max-w-xl mx-auto bg-gray-900/30 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <strong>Enhanced Controls:</strong>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                <div>SPACE = Punch (15 stamina)</div>
                <div>X = Block (reduced damage)</div>
                <div>High combos can stun enemies</div>
                <div>Faster stamina regeneration</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImprovedRockEmSockEm