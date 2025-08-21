import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
  GameState, 
  initialState, 
  playerPunch, 
  npcPunch, 
  resetToStanding,
  startGame,
  resetGame,
  toggleSound,
  changeDifficulty,
  getDifficultyInfo,
  getComboMessage,
  getHealthPercentage
} from '../utils/gameLogic'

// Sound effect simulation (you can replace with actual audio files)
const playSound = (soundType: string, enabled: boolean) => {
  if (!enabled) return
  
  // Create audio context for sound effects
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    const createBeep = (frequency: number, duration: number, volume: number = 0.1) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = 'square'
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    }
    
    switch (soundType) {
      case 'punch':
        createBeep(200, 0.1, 0.3)
        setTimeout(() => createBeep(150, 0.1, 0.2), 50)
        break
      case 'hit':
        createBeep(100, 0.2, 0.4)
        break
      case 'victory':
        // Victory fanfare
        [400, 500, 600, 800].forEach((freq, i) => {
          setTimeout(() => createBeep(freq, 0.3, 0.2), i * 150)
        })
        break
      case 'defeat':
        createBeep(150, 0.5, 0.3)
        setTimeout(() => createBeep(100, 0.5, 0.2), 200)
        break
      case 'start':
        createBeep(300, 0.2, 0.2)
        break
    }
  } catch (error) {
    // Fallback for browsers without Web Audio API
    console.log(`Sound: ${soundType}`)
  }
}

const RockEmSockEm: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialState)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Handle player punch - Fixed dependencies
  const handlePlayerPunch = useCallback(() => {
    if (isAnimating || !gameState.gameStarted || gameState.gameOver || !gameState.isPlayerTurn) {
      return
    }

    setIsAnimating(true)
    playSound('punch', gameState.soundEnabled)
    
    const newState = playerPunch(gameState)
    setGameState(newState)

    if (newState.npcHealth > 0) {
      playSound('hit', gameState.soundEnabled)
    }

    // Reset to standing after animation
    setTimeout(() => {
      setGameState(prevState => resetToStanding(prevState))
      setIsAnimating(false)
    }, 600)
  }, [gameState, isAnimating]) // Fixed: proper dependencies

  // Handle NPC turn - Fixed dependencies
  useEffect(() => {
    if (!gameState.isPlayerTurn && !gameState.gameOver && gameState.gameStarted && !isAnimating) {
      const difficultyInfo = getDifficultyInfo(gameState.difficulty)
      
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(true)
        playSound('punch', gameState.soundEnabled)
        
        const newState = npcPunch(gameState)
        setGameState(newState)

        if (newState.playerHealth > 0) {
          playSound('hit', gameState.soundEnabled)
        }

        // Reset to standing after animation
        setTimeout(() => {
          setGameState(prevState => resetToStanding(prevState))
          setIsAnimating(false)
        }, 700)
      }, difficultyInfo.npcDelay)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [
    gameState.isPlayerTurn, 
    gameState.gameOver, 
    gameState.gameStarted, 
    gameState.difficulty, 
    gameState.soundEnabled, 
    isAnimating
  ]) // Fixed: all necessary dependencies

  // Handle game end sounds - Fixed dependencies
  useEffect(() => {
    if (gameState.gameOver && gameState.winner) {
      setTimeout(() => {
        if (gameState.winner === 'player') {
          playSound('victory', gameState.soundEnabled)
        } else {
          playSound('defeat', gameState.soundEnabled)
        }
      }, 500)
    }
  }, [gameState.gameOver, gameState.winner, gameState.soundEnabled]) // Fixed: proper dependencies

  // Start new game - Fixed to use stable reference
  const handleStartGame = useCallback((difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    playSound('start', gameState.soundEnabled)
    setGameState(startGame(difficulty))
    setIsAnimating(false)
  }, [gameState.soundEnabled]) // Fixed: add soundEnabled dependency

  // Reset game - Stable callback
  const handleResetGame = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setGameState(resetGame())
    setIsAnimating(false)
  }, []) // No dependencies needed

  // Toggle sound - Stable callback
  const handleToggleSound = useCallback(() => {
    setGameState(toggleSound(gameState))
  }, [gameState]) // Fixed: add gameState dependency

  // Change difficulty - Stable callback
  const handleDifficultyChange = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    setGameState(changeDifficulty(gameState, difficulty))
  }, [gameState]) // Fixed: add gameState dependency

  // Get robot class names - Memoized for performance
  const getPlayerRobotClass = useCallback(() => {
    let classes = 'robot blue-robot '
    if (gameState.gameOver) {
      classes += gameState.winner === 'player' ? 'winner' : 'dead'
    } else {
      classes += gameState.playerAction
    }
    return classes
  }, [gameState.gameOver, gameState.winner, gameState.playerAction])

  const getNPCRobotClass = useCallback(() => {
    let classes = 'robot red-robot '
    if (gameState.gameOver) {
      classes += gameState.winner === 'npc' ? 'winner' : 'dead'
    } else {
      classes += gameState.npcAction
    }
    return classes
  }, [gameState.gameOver, gameState.winner, gameState.npcAction])

  // Game loop effect (suggested fix from your comment)
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      const interval = setInterval(() => {
        // Game loop logic here if needed
        // This could be used for animations, timers, etc.
      }, 16) // 60fps
      
      return () => clearInterval(interval)
    }
  }, [gameState.gameStarted, gameState.gameOver]) // Fixed: specific dependencies

  return (
    <div className="rock-em-sock-em-container p-6 max-w-2xl mx-auto relative">
      {/* Sound Toggle */}
      <button 
        className="sound-toggle"
        onClick={handleToggleSound}
        title={gameState.soundEnabled ? 'Mute' : 'Unmute'}
      >
        {gameState.soundEnabled ? '🔊' : '🔇'}
      </button>

      {/* Game Header */}
      <div className="game-header">
        <h1 className="game-title">ROCK EM SOCK EM ROBOTS</h1>
        <p className="text-sm text-gray-300 mb-4">
          Click your blue robot to punch! First to knockout wins!
        </p>
      </div>

      {/* Difficulty Selector */}
      {!gameState.gameStarted && (
        <div className="difficulty-selector">
          {(['easy', 'medium', 'hard'] as const).map((diff) => {
            const info = getDifficultyInfo(diff)
            return (
              <button
                key={diff}
                className={`difficulty-button ${gameState.difficulty === diff ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(diff)}
                title={info.description}
              >
                {info.name}
              </button>
            )
          })}
        </div>
      )}

      {/* Game Stats */}
      {gameState.gameStarted && (
        <div className="game-stats">
          <div className="stat-item">
            <div className="stat-label">ROUND</div>
            <div className="stat-value">{gameState.playerScore + gameState.npcScore + 1}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">WINS</div>
            <div className="stat-value">{gameState.playerScore} - {gameState.npcScore}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">DIFFICULTY</div>
            <div className={`stat-value text-xs ${getDifficultyInfo(gameState.difficulty).color}`}>
              {getDifficultyInfo(gameState.difficulty).name}
            </div>
          </div>
        </div>
      )}

      {/* Combo Counter */}
      {gameState.combo > 2 && !gameState.gameOver && (
        <div className="combo-counter">
          <div className="combo-text">
            {gameState.combo}x COMBO! {getComboMessage(gameState.combo)}
          </div>
        </div>
      )}

      {!gameState.gameOver ? (
        <div className="arena">
          {/* Health Bars */}
          <div className="health-bars">
            <div className="health-bar-container">
              <div className="health-label player-label">YOU</div>
              <div className="health-bar">
                <div 
                  className="health-fill player-health"
                  style={{ 
                    width: `${getHealthPercentage(gameState.playerHealth, gameState.maxHealth)}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="health-bar-container">
              <div className="health-label npc-label">CPU</div>
              <div className="health-bar">
                <div 
                  className="health-fill npc-health"
                  style={{ 
                    width: `${getHealthPercentage(gameState.npcHealth, gameState.maxHealth)}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Robots */}
          <div className="robots-container">
            <div 
              className={getPlayerRobotClass()}
              onClick={handlePlayerPunch}
              style={{
                cursor: gameState.gameStarted && gameState.isPlayerTurn && !isAnimating ? 'pointer' : 'default',
                opacity: !gameState.gameStarted ? 0.7 : 1
              }}
              title={gameState.gameStarted ? 'Click to punch!' : 'Start game to play'}
            />
            
            <div className="vs-divider">VS</div>
            
            <div className={getNPCRobotClass()} />
          </div>

          {/* Turn Indicator */}
          {gameState.gameStarted && (
            <div className="text-center mt-4">
              <div className="text-sm text-gray-300">
                {gameState.isPlayerTurn && !isAnimating ? (
                  <span className="text-blue-400 animate-pulse">Your Turn - Click to Punch!</span>
                ) : isAnimating ? (
                  <span className="text-yellow-400">Fighting...</span>
                ) : (
                  <span className="text-red-400">CPU is Turn...</span>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Screen */
        <div className="game-over-screen arena">
          <div className={`victory-message ${gameState.winner === 'player' ? 'victory-win' : 'victory-lose'}`}>
            {gameState.winner === 'player' ? 'YOU WIN!' : 'GAME OVER'}
          </div>
          
          <div className="robots-container justify-center mb-6">
            <div className={getPlayerRobotClass()} />
            <div className="vs-divider text-2xl">
              {gameState.winner === 'player' ? '🏆' : '💀'}
            </div>
            <div className={getNPCRobotClass()} />
          </div>

          <div className="text-center mb-6">
            <div className="text-lg text-gray-300 mb-2">
              Final Score: {gameState.playerScore} - {gameState.npcScore}
            </div>
            {gameState.combo > 5 && (
              <div className="text-sm text-yellow-400">
                Best Combo: {gameState.combo} hits!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="control-buttons">
        {!gameState.gameStarted ? (
          <button 
            className="game-button button-primary"
            onClick={() => handleStartGame(gameState.difficulty)}
          >
            START FIGHT
          </button>
        ) : gameState.gameOver ? (
          <>
            <button 
              className="game-button button-primary"
              onClick={() => handleStartGame(gameState.difficulty)}
            >
              PLAY AGAIN
            </button>
            <button 
              className="game-button button-secondary"
              onClick={handleResetGame}
            >
              MAIN MENU
            </button>
          </>
        ) : (
          <button 
            className="game-button button-danger"
            onClick={handleResetGame}
          >
            QUIT GAME
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center mt-6">
        <div className="text-xs text-gray-400 max-w-md mx-auto">
          💡 <strong>Tip:</strong> Build combos by landing consecutive hits! 
          Higher difficulty means faster, more accurate CPU opponents.
        </div>
      </div>
    </div>
  )
}

export default RockEmSockEm