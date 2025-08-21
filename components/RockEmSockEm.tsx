// components/EnhancedRockEmSockEm.tsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
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
  Lightbulb,
  Pause,
  Settings,
  Award
} from 'lucide-react'

// Enhanced Game State Interface with better performance tracking
interface GameState {
  playerHealth: number;
  npcHealth: number;
  maxHealth: number;
  gameOver: boolean;
  winner: 'player' | 'npc' | null;
  playerAction: 'standing' | 'punch' | 'hit' | 'dead' | 'winner' | 'block';
  npcAction: 'standing' | 'punch' | 'hit' | 'dead' | 'winner' | 'block';
  gameStarted: boolean;
  gamePaused: boolean;
  combo: number;
  maxCombo: number;
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
  roundTime: number;
  stunned: boolean;
  stunnedTime: number;
  perfectHits: number;
  blockedAttacks: number;
  frameRate: number;
  inputLag: number;
}

interface GameProps {
  isVisible?: boolean;
  onGameStart?: () => void;
  onGameEnd?: (winner: 'player' | 'npc', stats: any) => void;
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
  gamePaused: false,
  combo: 0,
  maxCombo: 0,
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
  roundTime: 0,
  stunned: false,
  stunnedTime: 0,
  perfectHits: 0,
  blockedAttacks: 0,
  frameRate: 60,
  inputLag: 0,
};

// Optimized sound system with Web Audio API pooling
class SoundManager {
  private audioContext: AudioContext | null = null;
  private soundCache: Map<string, AudioBuffer> = new Map();
  private gainNode: GainNode | null = null;
  private enabled: boolean = true;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3;
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (this.gainNode) {
      this.gainNode.gain.value = enabled ? 0.3 : 0;
    }
  }

  private createTone(frequency: number, duration: number, volume: number = 0.15, type: OscillatorType = 'square') {
    if (!this.enabled || !this.audioContext || !this.gainNode) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.gainNode);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Sound playback error:', error);
    }
  }

  playSound(soundType: string) {
    if (!this.enabled) return;

    switch (soundType) {
      case 'punch':
        this.createTone(200, 0.08, 0.25);
        break;
      case 'hit':
        this.createTone(150, 0.12, 0.3);
        break;
      case 'block':
        this.createTone(350, 0.06, 0.2, 'sine');
        break;
      case 'combo':
        this.createTone(500, 0.1, 0.25, 'sine');
        break;
      case 'victory':
        [440, 554, 659, 880].forEach((freq, i) => {
          setTimeout(() => this.createTone(freq, 0.2, 0.15, 'sine'), i * 100);
        });
        break;
      case 'defeat':
        this.createTone(180, 0.6, 0.25);
        break;
      case 'start':
        this.createTone(330, 0.15, 0.2);
        break;
      case 'stun':
        this.createTone(80, 0.4, 0.2);
        break;
      case 'perfect':
        this.createTone(660, 0.15, 0.3, 'sine');
        break;
    }
  }
}

// Enhanced Robot Component with better performance
const PixelRobot: React.FC<{
  color: 'blue' | 'red';
  action: 'standing' | 'punch' | 'hit' | 'dead' | 'winner' | 'block';
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  isBlocking: boolean;
  stunned: boolean;
  combo?: number;
}> = React.memo(({ color, action, health, maxHealth, stamina, maxStamina, isBlocking, stunned, combo = 0 }) => {
  const baseColor = color === 'blue' ? '#3b82f6' : '#ef4444';
  const lightColor = color === 'blue' ? '#93c5fd' : '#fca5a5';
  const darkColor = color === 'blue' ? '#1d4ed8' : '#b91c1c';

  const healthPercentage = Math.max(0, (health / maxHealth) * 100);
  const staminaPercentage = Math.max(0, (stamina / maxStamina) * 100);

  const getHealthBarColor = () => {
    if (healthPercentage > 60) return 'from-green-500 to-green-600';
    if (healthPercentage > 30) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getEyeState = () => {
    if (stunned) return '@ @';
    if (action === 'dead') return 'X X';
    if (action === 'winner') return '^ ^';
    if (action === 'hit') return '> <';
    if (action === 'block') return '- -';
    if (action === 'punch') return '• •';
    return '• •';
  };

  const getRobotTransform = () => {
    let transform = 'scale(1) translate(0, 0) rotate(0deg)';
    
    if (stunned) transform = 'scale(1) translate(0, -4px) rotate(0deg)';
    else if (action === 'punch') transform = 'scale(1.1) translate(6px, 0) rotate(0deg)';
    else if (action === 'hit') transform = 'scale(0.9) translate(-8px, 0) rotate(-2deg)';
    else if (action === 'block') transform = 'scale(0.95) translate(0, 0) rotate(0deg)';
    else if (action === 'dead') transform = 'scale(0.7) translate(0, 8px) rotate(-15deg)';
    else if (action === 'winner') transform = 'scale(1.15) translate(0, -2px) rotate(0deg)';
    
    return transform;
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Enhanced Health Bar */}
      <div className="relative w-24 h-3 bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${getHealthBarColor()} transition-all duration-300 ease-out relative`}
          style={{ width: `${healthPercentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
      
      {/* Enhanced Stamina Bar */}
      <div className="w-24 h-2 bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-200 ease-out"
          style={{ width: `${staminaPercentage}%` }}
        />
      </div>

      {/* Combo indicator for player */}
      {color === 'blue' && combo > 2 && (
        <div className="text-xs font-bold text-yellow-400 animate-pulse">
          {combo}x COMBO!
        </div>
      )}

      {/* Enhanced Robot with better styling */}
      <div className="relative">
        {/* Shield Effect */}
        {isBlocking && (
          <div className="absolute -inset-2 border-3 border-yellow-400 rounded-xl animate-pulse bg-yellow-400/20" />
        )}

        {/* Stun effect */}
        {stunned && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl animate-spin">
            ⭐
          </div>
        )}

        {/* Robot Body */}
        <div 
          className="relative w-24 h-24 rounded-lg border-2 border-gray-700 transition-all duration-200 ease-out"
          style={{ 
            background: `linear-gradient(145deg, ${lightColor}, ${baseColor}, ${darkColor})`,
            transform: getRobotTransform(),
            filter: action === 'dead' ? 'grayscale(80%) brightness(0.5)' : 'none',
            boxShadow: action === 'winner' ? `0 0 20px ${baseColor}` : `0 4px 8px rgba(0,0,0,0.3)`
          }}
        >
          {/* Head */}
          <div 
            className="absolute top-2 left-1/2 transform -translate-x-1/2 w-14 h-8 rounded-md border border-gray-600"
            style={{ backgroundColor: baseColor }}
          >
            {/* Eyes */}
            <div className="flex justify-center items-center h-full">
              <span className="text-sm font-bold text-white font-mono">
                {getEyeState()}
              </span>
            </div>
            
            {/* Antenna */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-2 bg-gray-500" />
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Body Core */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-8 h-6">
            <div 
              className="w-full h-full border border-gray-600 rounded"
              style={{ backgroundColor: darkColor }}
            >
              <div className="flex justify-center items-center h-full">
                <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Arms with better positioning */}
          <div className="absolute top-10 -left-3 w-5 h-4 rounded border border-gray-600"
               style={{ backgroundColor: baseColor }}>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded border border-gray-600"
                 style={{ backgroundColor: lightColor }} />
          </div>
          
          <div className="absolute top-10 -right-3 w-5 h-4 rounded border border-gray-600"
               style={{ backgroundColor: baseColor }}>
            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded border border-gray-600"
                 style={{ backgroundColor: lightColor }} />
          </div>

          {/* Legs */}
          <div className="absolute bottom-2 left-1/3 w-3 h-5 rounded-b border border-gray-600"
               style={{ backgroundColor: baseColor }} />
          <div className="absolute bottom-2 right-1/3 w-3 h-5 rounded-b border border-gray-600"
               style={{ backgroundColor: baseColor }} />

          {/* Action Effects */}
          {action === 'punch' && (
            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-yellow-400 animate-ping">
              <Zap className="w-6 h-6" />
            </div>
          )}
          
          {action === 'winner' && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-bounce">
              <Trophy className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>

      {/* Robot Stats */}
      <div className="text-center">
        <div className={`font-mono text-sm font-bold ${color === 'blue' ? 'text-blue-400' : 'text-red-400'}`}>
          {color === 'blue' ? 'PLAYER' : 'CPU'}
        </div>
        <div className="text-xs text-gray-400">
          HP: {Math.ceil(health)}/{maxHealth}
        </div>
        <div className="text-xs text-gray-500">
          SP: {Math.ceil(stamina)}/{maxStamina}
        </div>
      </div>
    </div>
  );
});

PixelRobot.displayName = 'PixelRobot';

const EnhancedRockEmSockEm: React.FC<GameProps> = ({ 
  isVisible = true, 
  onGameStart, 
  onGameEnd 
}) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [inputState, setInputState] = useState({ punch: false, block: false });
  const [showSettings, setShowSettings] = useState(false);
  
  // Performance tracking refs
  const gameLoopRef = useRef<number>();
  const lastFrameRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsTimerRef = useRef<number>(0);
  const inputTimingRef = useRef<number>(0);
  
  // Sound manager
  const soundManagerRef = useRef<SoundManager>(new SoundManager());

  // Memoized difficulty settings
  const difficultySettings = useMemo(() => ({
    easy: { 
      reactionTime: 1200, 
      blockChance: 0.15, 
      attackFrequency: 0.2,
      accuracy: 0.6,
      name: 'Rookie',
      color: 'text-green-400',
      description: 'Perfect for beginners'
    },
    medium: { 
      reactionTime: 800, 
      blockChance: 0.3, 
      attackFrequency: 0.4,
      accuracy: 0.75,
      name: 'Fighter',
      color: 'text-yellow-400',
      description: 'Balanced challenge'
    },
    hard: { 
      reactionTime: 500, 
      blockChance: 0.45, 
      attackFrequency: 0.6,
      accuracy: 0.9,
      name: 'Champion',
      color: 'text-red-400',
      description: 'Ultimate challenge'
    },
  }), []);

  // Enhanced input handling with timing tracking
  const handleInput = useCallback((action: 'punch' | 'block', pressed: boolean) => {
    const inputTime = performance.now();
    setGameState(prev => ({
      ...prev,
      inputLag: inputTime - inputTimingRef.current
    }));
    inputTimingRef.current = inputTime;
    
    setInputState(prev => ({ ...prev, [action]: pressed }));
  }, []);

  // Enhanced keyboard controls
  useEffect(() => {
    if (!isVisible || !gameState.gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      e.preventDefault();
      
      if (e.code === 'Space') handleInput('punch', true);
      if (e.code === 'KeyX' || e.code === 'KeyS') handleInput('block', true);
      if (e.code === 'KeyP') togglePause();
      if (e.code === 'KeyR' && gameState.gameOver) handleResetGame();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.code === 'Space') handleInput('punch', false);
      if (e.code === 'KeyX' || e.code === 'KeyS') handleInput('block', false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isVisible, gameState.gameStarted, gameState.gameOver, handleInput]);

  // Enhanced damage calculation
  const calculateDamage = useCallback((combo: number, isBlocking: boolean, isPerfect: boolean = false): number => {
    const baseDamage = 15 + Math.random() * 10;
    const comboMultiplier = 1 + (combo * 0.08);
    const blockReduction = isBlocking ? 0.2 : 1;
    const perfectMultiplier = isPerfect ? 1.5 : 1;
    const difficultyMultiplier = gameState.difficulty === 'hard' ? 1.1 : gameState.difficulty === 'easy' ? 0.9 : 1;
    
    return Math.floor(baseDamage * comboMultiplier * blockReduction * perfectMultiplier * difficultyMultiplier);
  }, [gameState.difficulty]);

  // Pause/Resume functionality
  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, gamePaused: !prev.gamePaused }));
  }, []);

  // Main game loop with performance optimization
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameOver || gameState.gamePaused || !isVisible) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastFrameRef.current;
      lastFrameRef.current = timestamp;

      // FPS tracking
      frameCountRef.current++;
      if (timestamp - fpsTimerRef.current >= 1000) {
        const fps = frameCountRef.current;
        setGameState(prev => ({ ...prev, frameRate: fps }));
        frameCountRef.current = 0;
        fpsTimerRef.current = timestamp;
      }

      // Target 60 FPS with adaptive timing
      if (deltaTime < 16.67) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      setGameState(prevState => {
        let newState = { ...prevState };
        
        // Update round time
        newState.roundTime += deltaTime;

        // Handle stun recovery
        if (newState.stunned) {
          newState.stunnedTime -= deltaTime;
          if (newState.stunnedTime <= 0) {
            newState.stunned = false;
            newState.stunnedTime = 0;
          }
        }

        // Enhanced stamina regeneration
        const staminaRegenRate = 1.5;
        if (newState.playerStamina < newState.maxStamina) {
          newState.playerStamina = Math.min(newState.maxStamina, newState.playerStamina + staminaRegenRate);
        }
        if (newState.npcStamina < newState.maxStamina) {
          newState.npcStamina = Math.min(newState.maxStamina, newState.npcStamina + (staminaRegenRate * 0.8));
        }

        // Update cooldowns
        if (newState.playerCooldown > 0) {
          newState.playerCooldown = Math.max(0, newState.playerCooldown - deltaTime);
        }
        if (newState.npcCooldown > 0) {
          newState.npcCooldown = Math.max(0, newState.npcCooldown - deltaTime);
        }

        // Enhanced player input handling
        if (inputState.punch && newState.playerStamina >= 20 && newState.playerCooldown <= 0 && !newState.stunned) {
          const isPerfect = Math.random() < 0.1; // 10% chance for perfect hit
          const damage = calculateDamage(newState.combo, newState.npcBlocking, isPerfect);
          const prevNpcHealth = newState.npcHealth;
          
          newState.npcHealth = Math.max(0, newState.npcHealth - damage);
          newState.playerStamina -= 20;
          newState.playerAction = 'punch';
          newState.lastPlayerAction = timestamp;
          newState.playerCooldown = 300;
          
          if (newState.npcHealth < prevNpcHealth) {
            newState.combo += 1;
            newState.maxCombo = Math.max(newState.maxCombo, newState.combo);
            
            if (isPerfect) {
              newState.perfectHits += 1;
              soundManagerRef.current.playSound('perfect');
            }
            
            if (newState.npcBlocking) {
              newState.blockedAttacks += 1;
              soundManagerRef.current.playSound('block');
            } else {
              soundManagerRef.current.playSound('punch');
              soundManagerRef.current.playSound('hit');
              newState.npcAction = 'hit';
              newState.lastNpcAction = timestamp;
              
              // Enhanced stun mechanic
              if (newState.combo >= 6 && Math.random() < 0.25) {
                newState.stunned = true;
                newState.stunnedTime = 1500;
                soundManagerRef.current.playSound('stun');
              }
            }
            
            if (newState.combo > 2 && newState.combo % 3 === 0) {
              soundManagerRef.current.playSound('combo');
            }
          }
        }

        // Enhanced blocking
        if (inputState.block && newState.playerStamina >= 0.5 && !newState.stunned) {
          newState.playerBlocking = true;
          newState.playerAction = 'block';
          newState.playerStamina = Math.max(0, newState.playerStamina - 0.3);
        } else if (!inputState.block) {
          newState.playerBlocking = false;
          if (newState.playerAction === 'block') {
            newState.playerAction = 'standing';
          }
        }

        // Enhanced NPC AI
        const difficulty = difficultySettings[newState.difficulty];
        if (timestamp - newState.lastNpcAction > difficulty.reactionTime && newState.npcCooldown <= 0 && !newState.stunned) {
          const shouldAttack = Math.random() < difficulty.attackFrequency;
          const shouldBlock = Math.random() < difficulty.blockChance;

          if (shouldAttack && newState.npcStamina >= 20) {
            const accuracy = Math.random() < difficulty.accuracy;
            if (accuracy) {
              const damage = calculateDamage(0, newState.playerBlocking);
              const prevPlayerHealth = newState.playerHealth;
              
              newState.playerHealth = Math.max(0, newState.playerHealth - damage);
              newState.npcStamina -= 20;
              newState.npcAction = 'punch';
              newState.lastNpcAction = timestamp;
              newState.npcCooldown = 400;
              newState.combo = 0;

              if (newState.playerHealth < prevPlayerHealth) {
                if (newState.playerBlocking) {
                  soundManagerRef.current.playSound('block');
                } else {
                  soundManagerRef.current.playSound('punch');
                  soundManagerRef.current.playSound('hit');
                  newState.playerAction = 'hit';
                  newState.lastPlayerAction = timestamp;
                }
              }
            }
          } else if (shouldBlock && newState.npcStamina >= 10) {
            newState.npcBlocking = true;
            newState.npcAction = 'block';
            newState.npcStamina = Math.max(0, newState.npcStamina - 0.2);
            newState.lastNpcAction = timestamp;
          }
        }

        // Reset actions
        if (timestamp - newState.lastPlayerAction > 250 && !newState.playerBlocking && newState.playerAction !== 'standing') {
          newState.playerAction = 'standing';
        }
        if (timestamp - newState.lastNpcAction > 250 && !newState.npcBlocking && newState.npcAction !== 'standing') {
          newState.npcAction = 'standing';
          newState.npcBlocking = false;
        }

        // Check win conditions
        if (newState.playerHealth <= 0 && !newState.gameOver) {
          newState.gameOver = true;
          newState.winner = 'npc';
          newState.playerAction = 'dead';
          newState.npcAction = 'winner';
          newState.npcScore += 1;
          setTimeout(() => {
            soundManagerRef.current.playSound('defeat');
            onGameEnd?.('npc', {
              maxCombo: newState.maxCombo,
              perfectHits: newState.perfectHits,
              blockedAttacks: newState.blockedAttacks,
              roundTime: newState.roundTime
            });
          }, 300);
        } else if (newState.npcHealth <= 0 && !newState.gameOver) {
          newState.gameOver = true;
          newState.winner = 'player';
          newState.playerAction = 'winner';
          newState.npcAction = 'dead';
          newState.playerScore += 1;
          setTimeout(() => {
            soundManagerRef.current.playSound('victory');
            onGameEnd?.('player', {
              maxCombo: newState.maxCombo,
              perfectHits: newState.perfectHits,
              blockedAttacks: newState.blockedAttacks,
              roundTime: newState.roundTime
            });
          }, 300);
        }

        return newState;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.gameStarted, gameState.gameOver, gameState.gamePaused, isVisible, inputState, calculateDamage, difficultySettings, onGameEnd]);

  // Game control functions
  const handleStartGame = useCallback((difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    soundManagerRef.current.playSound('start');
    setGameState({ 
      ...initialState, 
      gameStarted: true, 
      difficulty, 
      soundEnabled: gameState.soundEnabled 
    });
    onGameStart?.();
  }, [gameState.soundEnabled, onGameStart]);

  const handleResetGame = useCallback(() => {
    setGameState({ ...initialState, soundEnabled: gameState.soundEnabled });
  }, [gameState.soundEnabled]);

  const handleToggleSound = useCallback(() => {
    const newSoundState = !gameState.soundEnabled;
    soundManagerRef.current.setEnabled(newSoundState);
    setGameState(prev => ({ ...prev, soundEnabled: newSoundState }));
  }, [gameState.soundEnabled]);

  const getComboMessage = (combo: number): string => {
    if (combo >= 15) return 'GODLIKE!';
    if (combo >= 12) return 'UNSTOPPABLE!';
    if (combo >= 10) return 'LEGENDARY!';
    if (combo >= 7) return 'AMAZING!';
    if (combo >= 5) return 'GREAT!';
    if (combo >= 3) return 'NICE!';
    return '';
  };

  // Performance indicator component
  const PerformanceIndicator = () => (
    <div className="text-xs text-gray-500 font-mono">
      FPS: {gameState.frameRate} | Lag: {gameState.inputLag.toFixed(1)}ms
    </div>
  );

  return (
    <div className="relative w-full bg-gradient-to-br from-gray-900 via-purple-900/80 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
      {/* Header with enhanced controls */}
      <div className="bg-gradient-to-r from-purple-800/90 to-pink-800/90 p-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-mono tracking-wider">
              ROCK 'EM SOCK 'EM ROBOTS
            </h1>
            <p className="text-purple-200 text-sm">Enhanced Real-Time Combat System</p>
          </div>
          
          <div className="flex items-center gap-2">
            {gameState.gameStarted && !gameState.gameOver && (
              <button 
                className="p-2 hover:scale-110 transition-transform bg-black/20 rounded-lg"
                onClick={togglePause}
                title={gameState.gamePaused ? 'Resume' : 'Pause'}
              >
                {gameState.gamePaused ? 
                  <Play className="w-5 h-5 text-white" /> : 
                  <Pause className="w-5 h-5 text-white" />
                }
              </button>
            )}
            
            <button 
              className="p-2 hover:scale-110 transition-transform bg-black/20 rounded-lg"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            
            <button 
              className="p-2 hover:scale-110 transition-transform bg-black/20 rounded-lg"
              onClick={handleToggleSound}
              title={gameState.soundEnabled ? 'Mute' : 'Unmute'}
            >
              {gameState.soundEnabled ? 
                <Volume2 className="w-5 h-5 text-white" /> : 
                <VolumeX className="w-5 h-5 text-white" />
              }
            </button>
          </div>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-600 p-4 z-10">
            <div className="flex items-center justify-between text-white text-sm">
              <PerformanceIndicator />
              <span>Input Lag: {gameState.inputLag < 16 ? 'Good' : 'High'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Game Content */}
      <div className="p-4 md:p-6">
        {/* Pause overlay */}
        {gameState.gamePaused && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center text-white">
              <Pause className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">GAME PAUSED</h2>
              <p className="text-gray-300 mb-4">Press P to resume</p>
              <button
                onClick={togglePause}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
              >
                Resume Game
              </button>
            </div>
          </div>
        )}

        {/* Difficulty Selector */}
        {!gameState.gameStarted && (
          <div className="text-center mb-6">
            <h3 className="text-white text-xl mb-4 font-bold">Choose Your Challenge</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {(['easy', 'medium', 'hard'] as const).map((diff) => {
                const info = difficultySettings[diff];
                return (
                  <button
                    key={diff}
                    className={`p-4 rounded-lg font-mono text-sm transition-all border-2 ${
                      gameState.difficulty === diff 
                        ? 'bg-purple-600 border-purple-400 text-white shadow-lg scale-105' 
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setGameState(prev => ({ ...prev, difficulty: diff }))}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="w-5 h-5" />
                      <span className={`font-bold ${info.color}`}>{info.name}</span>
                    </div>
                    <div className="text-xs opacity-75">{info.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Game Stats */}
        {gameState.gameStarted && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 bg-gray-900/70 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-xs text-gray-400 font-mono flex items-center justify-center gap-1">
                <Swords className="w-3 h-3" />
                ROUND
              </div>
              <div className="text-lg font-bold text-yellow-400">{gameState.playerScore + gameState.npcScore + 1}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 font-mono flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3" />
                SCORE
              </div>
              <div className="text-lg font-bold text-white">{gameState.playerScore} - {gameState.npcScore}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 font-mono flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" />
                COMBO
              </div>
              <div className="text-lg font-bold text-orange-400">{gameState.combo}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 font-mono flex items-center justify-center gap-1">
                <Award className="w-3 h-3" />
                PERFECT
              </div>
              <div className="text-lg font-bold text-green-400">{gameState.perfectHits}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 font-mono flex items-center justify-center gap-1">
                <Target className="w-3 h-3" />
                DIFFICULTY
              </div>
              <div className={`text-sm font-bold ${difficultySettings[gameState.difficulty].color}`}>
                {difficultySettings[gameState.difficulty].name}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Combo Message */}
        {gameState.combo > 2 && !gameState.gameOver && (
          <div className="text-center mb-4">
            <div className="text-xl md:text-2xl font-bold text-yellow-400 animate-pulse flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 md:w-6 md:h-6" />
              {gameState.combo}x COMBO! {getComboMessage(gameState.combo)}
              <Zap className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            {gameState.perfectHits > 0 && (
              <div className="text-sm text-green-400 mt-1">
                Perfect Hits: {gameState.perfectHits}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Robots Arena */}
        <div className="bg-gray-900/70 rounded-xl p-4 md:p-6 mb-4 backdrop-blur-sm border border-gray-700/50">
          <div className="flex justify-center items-center gap-8 md:gap-16">
            <PixelRobot 
              color="blue" 
              action={gameState.gameOver ? (gameState.winner === 'player' ? 'winner' : 'dead') : gameState.playerAction}
              health={gameState.playerHealth}
              maxHealth={gameState.maxHealth}
              stamina={gameState.playerStamina}
              maxStamina={gameState.maxStamina}
              isBlocking={gameState.playerBlocking}
              stunned={gameState.stunned}
              combo={gameState.combo}
            />

            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 animate-pulse mb-2">VS</div>
              {gameState.gameStarted && !gameState.gameOver && (
                <div className="text-xs font-mono text-gray-400 space-y-1">
                  <div className="text-blue-400 flex items-center justify-center gap-1">
                    <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                    REAL-TIME
                  </div>
                  {gameState.roundTime > 0 && (
                    <div className="text-gray-500">
                      {(gameState.roundTime / 1000).toFixed(1)}s
                    </div>
                  )}
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

        {/* Enhanced Touch Controls */}
        {gameState.gameStarted && !gameState.gameOver && !gameState.gamePaused && (
          <div className="flex justify-center gap-4 md:gap-8 mb-4">
            <button
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-3 flex items-center justify-center transition-all transform active:scale-95 ${
                inputState.punch 
                  ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/50' 
                  : 'bg-red-600/80 border-red-500 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30'
              } ${gameState.playerStamina < 20 || gameState.playerCooldown > 0 || gameState.stunned ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onMouseDown={() => handleInput('punch', true)}
              onMouseUp={() => handleInput('punch', false)}
              onMouseLeave={() => handleInput('punch', false)}
              onTouchStart={(e) => { e.preventDefault(); handleInput('punch', true); }}
              onTouchEnd={(e) => { e.preventDefault(); handleInput('punch', false); }}
              disabled={gameState.playerStamina < 20 || gameState.playerCooldown > 0 || gameState.stunned}
            >
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </button>
            
            <button
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-3 flex items-center justify-center transition-all transform active:scale-95 ${
                inputState.block 
                  ? 'bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-500/50' 
                  : 'bg-yellow-600/80 border-yellow-500 hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-500/30'
              } ${gameState.playerStamina < 5 || gameState.stunned ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onMouseDown={() => handleInput('block', true)}
              onMouseUp={() => handleInput('block', false)}
              onMouseLeave={() => handleInput('block', false)}
              onTouchStart={(e) => { e.preventDefault(); handleInput('block', true); }}
              onTouchEnd={(e) => { e.preventDefault(); handleInput('block', false); }}
              disabled={gameState.playerStamina < 5 || gameState.stunned}
            >
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </button>
          </div>
        )}

        {/* Enhanced Game Over Screen */}
        {gameState.gameOver && (
          <div className="text-center mb-6 p-6 bg-gradient-to-r from-purple-900/70 to-pink-900/70 rounded-xl border border-purple-500/50 backdrop-blur-sm">
            <div className={`text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-4 ${
              gameState.winner === 'player' ? 'text-green-400' : 'text-red-400'
            }`}>
              {gameState.winner === 'player' ? (
                <>
                  <Trophy className="w-8 h-8 md:w-10 md:h-10" />
                  VICTORY!
                  <Trophy className="w-8 h-8 md:w-10 md:h-10" />
                </>
              ) : (
                <>
                  <Skull className="w-8 h-8 md:w-10 md:h-10" />
                  DEFEAT
                  <Skull className="w-8 h-8 md:w-10 md:h-10" />
                </>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <div className="text-gray-400">Final Score</div>
                <div className="text-white font-bold">{gameState.playerScore} - {gameState.npcScore}</div>
              </div>
              <div>
                <div className="text-gray-400">Max Combo</div>
                <div className="text-yellow-400 font-bold">{gameState.maxCombo}</div>
              </div>
              <div>
                <div className="text-gray-400">Perfect Hits</div>
                <div className="text-green-400 font-bold">{gameState.perfectHits}</div>
              </div>
              <div>
                <div className="text-gray-400">Time</div>
                <div className="text-blue-400 font-bold">{(gameState.roundTime / 1000).toFixed(1)}s</div>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
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

        {/* Enhanced Instructions */}
        <div className="text-center mt-6">
          <div className="text-sm text-gray-400 max-w-2xl mx-auto bg-gray-900/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <strong className="text-white">Enhanced Controls & Features:</strong>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <div><kbd className="bg-gray-700 px-1 rounded">SPACE</kbd> = Punch (20 stamina)</div>
                <div><kbd className="bg-gray-700 px-1 rounded">X/S</kbd> = Block (reduces damage)</div>
                <div><kbd className="bg-gray-700 px-1 rounded">P</kbd> = Pause/Resume</div>
              </div>
              <div className="space-y-1">
                <div>• High combos can stun enemies</div>
                <div>• Perfect hits deal 1.5x damage</div>
                <div>• Real-time performance tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRockEmSockEm;