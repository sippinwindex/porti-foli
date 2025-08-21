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

// Import from your separate game logic file
import { 
  GameState, 
  initialState, 
  executePlayerPunch,
  executePlayerBlock,
  executeNpcAI,
  updateGameState,
  startGame,
  resetGame,
  toggleSound,
  changeDifficulty,
  getDifficultySettings,
  getComboMessage,
  getHealthPercentage,
  getStaminaPercentage
} from '../utils/gameLogic'

// Import your CSS file
import '../styles/robot-fight.css'

// Sound effect simulation
const playSound = (soundType: string, enabled: boolean) => {
  if (!enabled) return
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    const createTone = (frequency: number, duration: number, volume: number = 0.1, type: OscillatorType = 'square') => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    }
    
    switch (soundType) {
      case 'punch':
        createTone(200, 0.15, 0.3)
        setTimeout(() => createTone(180, 0.1, 0.2), 50)
        break
      case 'hit':
        createTone(120, 0.25, 0.4)
        break
      case 'block':
        createTone(300, 0.1, 0.2, 'sine')
        break
      case 'combo':
        createTone(400, 0.2, 0.3, 'sine')
        break
      case 'victory':
        [440, 554, 659, 880].forEach((freq, i) => {
          setTimeout(() => createTone(freq, 0.3, 0.2, 'sine'), i * 200)
        })
        break
      case 'defeat':
        createTone(220, 0.8, 0.3)
        break
      case 'start':
        createTone(300, 0.2, 0.2)
        break
    }
  } catch (error) {
    console.log(`Sound: ${soundType}`)
  }
}

// Pixelated Robot Component using CSS classes
const PixelRobot: React.FC<{
  color: 'blue' | 'red';
  action: 'standing' | 'punch' | 'hit' | 'dead' | 'winner' | 'block';
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  isBlocking: boolean;
}> = ({ color, action, health, maxHealth, stamina, maxStamina, isBlocking }) => {
  const baseColor = color === 'blue' ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)';
  const lightColor = color === 'blue' ? 'rgb(147, 197, 253)' : 'rgb(252, 165, 165)';
  const darkColor = color === 'blue' ? 'rgb(29, 78, 216)' : 'rgb(185, 28, 28)';

  const healthPercentage = getHealthPercentage(health, maxHealth);
  const staminaPercentage = getStaminaPercentage(stamina, maxStamina);

  const getHealthClass = () => {
    if (healthPercentage > 60) return 'health-fill';
    if (healthPercentage > 30) return 'health-fill medium';
    return 'health-fill low';
  };

  const getEyeState = () => {
    if (action === 'dead') return 'X X';
    if (action === 'winner') return '^ ^';
    if (action === 'hit') return '> <';
    if (action === 'block') return '- -';
    return '• •';
  };

  return (
    <div className="robot-container">
      {/* Health Bar */}
      <div className="health-bar">
        <div 
          className={getHealthClass()}
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
      
      {/* Stamina Bar */}
      <div className="stamina-bar">
        <div 
          className="stamina-fill"
          style={{ width: `${staminaPercentage}%` }}
        />
      </div>

      {/* Robot */}
      <div className={`pixel-robot robot-${action}`}>
        {/* Shield Effect */}
        {isBlocking && <div className="shield-effect" />}

        {/* Robot Body */}
        <div 
          className="absolute inset-0 rounded-lg border-2 border-gray-800"
          style={{ 
            background: `linear-gradient(145deg, ${lightColor}, ${baseColor}, ${darkColor})`,
            boxShadow: `0 4px 12px ${baseColor}40, inset 0 2px 4px ${lightColor}60`,
            filter: action === 'dead' ? 'grayscale(80%)' : 'none'
          }}
        >
          {/* Head */}
          <div 
            className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-8 rounded border border-gray-700"
            style={{ backgroundColor: baseColor }}
          >
            {/* Eyes */}
            <div className="flex justify-center items-center h-full">
              <span className="text-xs font-bold text-white font-mono">
                {getEyeState()}
              </span>
            </div>
            
            {/* Antenna */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-2 bg-gray-600 rounded"></div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full border border-gray-700 animate-pulse"></div>
            </div>
          </div>

          {/* Body Details */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-8 h-8">
            <div 
              className="w-full h-6 border border-gray-700 rounded"
              style={{ backgroundColor: darkColor }}
            >
              <div className="flex justify-center items-center h-full">
                <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Arms */}
          <div className="absolute top-8 -left-3 w-6 h-4 rounded border border-gray-700"
               style={{ backgroundColor: baseColor }}>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded border border-gray-700"
                 style={{ backgroundColor: lightColor }}></div>
          </div>
          
          <div className="absolute top-8 -right-3 w-6 h-4 rounded border border-gray-700"
               style={{ backgroundColor: baseColor }}>
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded border border-gray-700"
                 style={{ backgroundColor: lightColor }}></div>
          </div>

          {/* Legs */}
          <div className="absolute bottom-1 left-1/4 w-3 h-6 rounded-b border border-gray-700"
               style={{ backgroundColor: baseColor }}></div>
          <div className="absolute bottom-1 right-1/4 w-3 h-6 rounded-b border border-gray-700"
               style={{ backgroundColor: baseColor }}></div>

          {/* Action Effects */}
          {action === 'punch' && (
            <div className="punch-effect">
              <Zap className="w-6 h-6" />
            </div>
          )}
          
          {action === 'winner' && (
            <div className="victory-crown">
              <Trophy className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>

      {/* Robot Stats */}
      <div className="mt-2 text-center">
        <div className={`font-mono text-sm font-bold ${color === 'blue' ? 'text-blue-400' : 'text-red-400'}`}>
          {color === 'blue' ? 'PLAYER' : 'CPU'}
        </div>
        <div className="text-xs text-gray-400">
          HP: {Math.ceil(health)}/{maxHealth}
        </div>
        <div className="text-xs text-gray-400">
          SP: {Math.ceil(stamina)}/{maxStamina}
        </div>
      </div>
    </div>
  );
};

const RockEmSockEm: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialState)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [touchStates, setTouchStates] = useState({ punch: false, block: false })
  const gameLoopRef = useRef<number>()
  const lastFrameRef = useRef<number>(0)
  const lastSoundRef = useRef<{ [key: string]: number }>({})

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      setPressedKeys(prev => new Set(prev).add(e.code.toLowerCase()))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault()
      setPressedKeys(prev => {
        const newSet = new Set(prev)
        newSet.delete(e.code.toLowerCase())
        return newSet
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Handle touch controls
  const handleTouchStart = useCallback((action: 'punch' | 'block') => {
    setTouchStates(prev => ({ ...prev, [action]: true }))
  }, [])

  const handleTouchEnd = useCallback((action: 'punch' | 'block') => {
    setTouchStates(prev => ({ ...prev, [action]: false }))
  }, [])

  // Play sound with cooldown to prevent spam
  const playSoundWithCooldown = useCallback((soundType: string, enabled: boolean, cooldown: number = 100) => {
    const now = Date.now()
    if (now - (lastSoundRef.current[soundType] || 0) > cooldown) {
      playSound(soundType, enabled)
      lastSoundRef.current[soundType] = now
    }
  }, [])

  // Main game loop
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

      if (deltaTime < 16) { // 60 FPS cap
        gameLoopRef.current = requestAnimationFrame(gameLoop)
        return
      }

      setGameState(prevState => {
        let newState = updateGameState(prevState, timestamp, deltaTime)

        // Handle player controls (keyboard + touch)
        const isPunching = pressedKeys.has('space') || touchStates.punch
        const isBlocking = pressedKeys.has('keyx') || touchStates.block

        if (isPunching && newState.playerStamina >= 20 && newState.playerCooldown <= 0) {
          const prevHealth = newState.npcHealth
          newState = executePlayerPunch(newState, timestamp)
          
          if (newState.npcHealth < prevHealth) {
            if (newState.npcBlocking) {
              playSoundWithCooldown('block', newState.soundEnabled, 200)
            } else {
              playSoundWithCooldown('punch', newState.soundEnabled, 200)
              playSoundWithCooldown('hit', newState.soundEnabled, 300)
            }
            
            if (newState.combo > 2 && newState.combo % 3 === 0) {
              playSoundWithCooldown('combo', newState.soundEnabled, 500)
            }
          }
        }

        if (isBlocking) {
          newState = executePlayerBlock(newState, timestamp, true)
        } else if (newState.playerBlocking) {
          newState = executePlayerBlock(newState, timestamp, false)
        }

        // Handle NPC AI
        const prevPlayerHealth = newState.playerHealth
        newState = executeNpcAI(newState, timestamp)
        
        if (newState.playerHealth < prevPlayerHealth) {
          if (newState.playerBlocking) {
            playSoundWithCooldown('block', newState.soundEnabled, 200)
          } else {
            playSoundWithCooldown('punch', newState.soundEnabled, 200)
            playSoundWithCooldown('hit', newState.soundEnabled, 300)
          }
        }

        // Handle game end sounds
        if (newState.gameOver && !prevState.gameOver) {
          setTimeout(() => {
            if (newState.winner === 'player') {
              playSoundWithCooldown('victory', newState.soundEnabled, 1000)
            } else {
              playSoundWithCooldown('defeat', newState.soundEnabled, 1000)
            }
          }, 500)
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
  }, [gameState.gameStarted, gameState.gameOver, pressedKeys, touchStates, playSoundWithCooldown])

  // Game control functions
  const handleStartGame = useCallback((difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    playSoundWithCooldown('start', gameState.soundEnabled)
    setGameState(startGame(difficulty))
  }, [gameState.soundEnabled, playSoundWithCooldown])

  const handleResetGame = useCallback(() => {
    setGameState(resetGame())
  }, [])

  const handleToggleSound = useCallback(() => {
    setGameState(toggleSound(gameState))
  }, [gameState])

  const handleDifficultyChange = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    setGameState(changeDifficulty(gameState, difficulty))
  }, [gameState])

  return (
    <div className="rock-em-sock-em-container">
      <div className="max-w-6xl mx-auto bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
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
            Dynamic Real-Time Combat System
          </p>
        </div>

        {/* Game Content */}
        <div className="p-8">
          {/* Difficulty Selector */}
          {!gameState.gameStarted && (
            <div className="flex justify-center gap-4 mb-8">
              {(['easy', 'medium', 'hard'] as const).map((diff) => {
                const info = getDifficultySettings(diff)
                return (
                  <button
                    key={diff}
                    className={`px-6 py-3 rounded-lg font-mono text-sm transition-all flex items-center gap-2 ${
                      gameState.difficulty === diff 
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => handleDifficultyChange(diff)}
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
            <div className="grid grid-cols-4 gap-4 mb-6 bg-gray-900/50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 font-mono flex items-center justify-center gap-1">
                  <Swords className="w-4 h-4" />
                  ROUND
                </div>
                <div className="text-2xl font-bold text-yellow-400">{gameState.playerScore + gameState.npcScore + 1}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 font-mono flex items-center justify-center gap-1">
                  <Trophy className="w-4 h-4" />
                  SCORE
                </div>
                <div className="text-2xl font-bold text-white">{gameState.playerScore} - {gameState.npcScore}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 font-mono flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4" />
                  COMBO
                </div>
                <div className="text-2xl font-bold text-orange-400">{gameState.combo}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 font-mono flex items-center justify-center gap-1">
                  <Target className="w-4 h-4" />
                  DIFFICULTY
                </div>
                <div className={`text-lg font-bold ${getDifficultySettings(gameState.difficulty).color}`}>
                  {getDifficultySettings(gameState.difficulty).name}
                </div>
              </div>
            </div>
          )}

          {/* Combo Message */}
          {gameState.combo > 2 && !gameState.gameOver && (
            <div className="combo-display">
              <div className="combo-text flex items-center justify-center gap-2">
                <Zap className="w-6 h-6" />
                {gameState.combo}x COMBO! {getComboMessage(gameState.combo)}
                <Zap className="w-6 h-6" />
              </div>
            </div>
          )}

          {/* Robots Arena */}
          <div className="arena">
            <div className="flex justify-center items-center gap-16">
              <PixelRobot 
                color="blue" 
                action={gameState.gameOver ? (gameState.winner === 'player' ? 'winner' : 'dead') : gameState.playerAction}
                health={gameState.playerHealth}
                maxHealth={gameState.maxHealth}
                stamina={gameState.playerStamina}
                maxStamina={gameState.maxStamina}
                isBlocking={gameState.playerBlocking}
              />

              <div className="text-center">
                <div className="text-6xl font-bold text-yellow-400 animate-pulse mb-4">VS</div>
                {gameState.gameStarted && !gameState.gameOver && (
                  <div className="text-sm font-mono text-gray-400 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-blue-400">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                      REAL-TIME COMBAT
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
              />
            </div>
          </div>

          {/* Touch Controls for Mobile */}
          {gameState.gameStarted && !gameState.gameOver && (
            <div className="touch-controls">
              <button
                className="touch-button punch"
                onTouchStart={() => handleTouchStart('punch')}
                onTouchEnd={() => handleTouchEnd('punch')}
                onMouseDown={() => handleTouchStart('punch')}
                onMouseUp={() => handleTouchEnd('punch')}
                onMouseLeave={() => handleTouchEnd('punch')}
                disabled={gameState.playerStamina < 20 || gameState.playerCooldown > 0}
              >
                <Zap className="w-8 h-8" />
              </button>
              
              <button
                className="touch-button block"
                onTouchStart={() => handleTouchStart('block')}
                onTouchEnd={() => handleTouchEnd('block')}
                onMouseDown={() => handleTouchStart('block')}
                onMouseUp={() => handleTouchEnd('block')}
                onMouseLeave={() => handleTouchEnd('block')}
                disabled={gameState.playerStamina < 10}
              >
                <Shield className="w-8 h-8" />
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState.gameOver && (
            <div className="text-center mb-8 p-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500">
              <div className={`text-5xl font-bold mb-4 flex items-center justify-center gap-4 ${
                gameState.winner === 'player' ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameState.winner === 'player' ? (
                  <>
                    <Trophy className="w-12 h-12" />
                    YOU WIN!
                    <Trophy className="w-12 h-12" />
                  </>
                ) : (
                  <>
                    <Skull className="w-12 h-12" />
                    GAME OVER
                    <Skull className="w-12 h-12" />
                  </>
                )}
              </div>
              <div className="text-xl text-gray-300 mb-4">
                Final Score: {gameState.playerScore} - {gameState.npcScore}
              </div>
              {gameState.combo > 5 && (
                <div className="text-lg text-yellow-400 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Best Combo: {gameState.combo} hits!
                </div>
              )}
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!gameState.gameStarted ? (
              <button 
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                onClick={() => handleStartGame(gameState.difficulty)}
              >
                <Play className="w-5 h-5" />
                START FIGHT
              </button>
            ) : gameState.gameOver ? (
              <>
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                  onClick={() => handleStartGame(gameState.difficulty)}
                >
                  <RotateCcw className="w-5 h-5" />
                  PLAY AGAIN
                </button>
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                  onClick={handleResetGame}
                >
                  <Home className="w-5 h-5" />
                  MAIN MENU
                </button>
              </>
            ) : (
              <button 
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                onClick={handleResetGame}
              >
                <Home className="w-5 h-5" />
                QUIT GAME
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="text-center mt-8">
            <div className="text-sm text-gray-400 max-w-2xl mx-auto bg-gray-900/30 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <strong>Controls:</strong>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div>Desktop: SPACE = Punch, X = Block</div>
                <div>Mobile: Touch buttons below arena</div>
                <div>Combos increase damage over time</div>
                <div>Blocking reduces damage by 70%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RockEmSockEm