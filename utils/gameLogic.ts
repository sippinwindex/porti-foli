// utils/gameLogic.ts - Enhanced Real-Time Rock 'Em Sock 'Em Game Logic
export interface GameState {
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
}

export const initialState: GameState = {
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
};

// Enhanced damage calculation with combo system and blocking
export function calculateDamage(combo: number, isBlocking: boolean): number {
  const baseDamage = 15 + Math.random() * 10; // 15-25 base damage
  const comboMultiplier = 1 + (combo * 0.1); // 10% more damage per combo hit
  const blockReduction = isBlocking ? 0.3 : 1; // 70% damage reduction when blocking
  
  return Math.floor(baseDamage * comboMultiplier * blockReduction);
}

// Get difficulty-based AI settings
export function getDifficultySettings(difficulty: 'easy' | 'medium' | 'hard') {
  return {
    easy: { 
      reactionTime: 800, 
      blockChance: 0.2, 
      attackFrequency: 0.3,
      accuracy: 0.7,
      name: 'Easy',
      color: 'text-green-400'
    },
    medium: { 
      reactionTime: 600, 
      blockChance: 0.35, 
      attackFrequency: 0.5,
      accuracy: 0.8,
      name: 'Medium',
      color: 'text-yellow-400'
    },
    hard: { 
      reactionTime: 400, 
      blockChance: 0.5, 
      attackFrequency: 0.7,
      accuracy: 0.9,
      name: 'Hard',
      color: 'text-red-400'
    },
  }[difficulty];
}

// Player punch action
export function executePlayerPunch(state: GameState, timestamp: number): GameState {
  if (state.gameOver || !state.gameStarted || state.playerStamina < 20 || state.playerCooldown > 0) {
    return state;
  }

  const damage = calculateDamage(state.combo, state.npcBlocking);
  const newNpcHealth = Math.max(0, state.npcHealth - damage);
  const gameOver = newNpcHealth <= 0;
  const winner = gameOver ? 'player' : null;
  
  return {
    ...state,
    npcHealth: newNpcHealth,
    playerStamina: state.playerStamina - 20,
    playerAction: 'punch',
    lastPlayerAction: timestamp,
    playerCooldown: 400, // 400ms cooldown
    combo: state.combo + 1,
    npcAction: newNpcHealth > 0 ? (state.npcBlocking ? 'standing' : 'hit') : 'dead',
    lastNpcAction: newNpcHealth > 0 && !state.npcBlocking ? timestamp : state.lastNpcAction,
    gameOver,
    winner,
    playerScore: gameOver ? state.playerScore + 1 : state.playerScore,
  };
}

// Player block action
export function executePlayerBlock(state: GameState, timestamp: number, isBlocking: boolean): GameState {
  if (state.gameOver || !state.gameStarted) {
    return state;
  }

  if (isBlocking && state.playerStamina >= 0.5) {
    return {
      ...state,
      playerBlocking: true,
      playerAction: 'block',
      playerStamina: Math.max(0, state.playerStamina - 0.5),
      lastPlayerAction: timestamp,
    };
  } else {
    return {
      ...state,
      playerBlocking: false,
      playerAction: 'standing',
    };
  }
}

// NPC AI decision making
export function executeNpcAI(state: GameState, timestamp: number): GameState {
  if (state.gameOver || !state.gameStarted) {
    return state;
  }

  const difficulty = getDifficultySettings(state.difficulty);
  
  // Check if NPC can act based on reaction time
  if (timestamp - state.lastNpcAction < difficulty.reactionTime || state.npcCooldown > 0) {
    return state;
  }

  let newState = { ...state };
  
  // NPC decision making
  const shouldAttack = Math.random() < difficulty.attackFrequency;
  const shouldBlock = Math.random() < difficulty.blockChance;
  
  if (shouldAttack && newState.npcStamina >= 20) {
    const accuracy = Math.random() < difficulty.accuracy;
    if (accuracy) {
      const damage = calculateDamage(0, newState.playerBlocking);
      newState.playerHealth = Math.max(0, newState.playerHealth - damage);
      newState.npcStamina -= 20;
      newState.npcAction = 'punch';
      newState.lastNpcAction = timestamp;
      newState.npcCooldown = 500; // Slightly longer cooldown for NPC
      newState.combo = 0; // Reset player combo when hit

      if (!newState.playerBlocking) {
        newState.playerAction = 'hit';
        newState.lastPlayerAction = timestamp;
      }

      // Check if player is defeated
      if (newState.playerHealth <= 0) {
        newState.gameOver = true;
        newState.winner = 'npc';
        newState.playerAction = 'dead';
        newState.npcAction = 'winner';
        newState.npcScore += 1;
      }
    }
  } else if (shouldBlock && newState.npcStamina >= 10) {
    newState.npcBlocking = true;
    newState.npcAction = 'block';
    newState.npcStamina = Math.max(0, newState.npcStamina - 0.3);
    newState.lastNpcAction = timestamp;
  }

  return newState;
}

// Update game state each frame
export function updateGameState(state: GameState, timestamp: number, deltaTime: number): GameState {
  if (!state.gameStarted || state.gameOver) {
    return state;
  }

  let newState = { ...state };

  // Regenerate stamina over time
  const staminaRegenRate = 0.8; // Stamina per frame at 60fps
  if (newState.playerStamina < newState.maxStamina) {
    newState.playerStamina = Math.min(newState.maxStamina, newState.playerStamina + staminaRegenRate);
  }
  if (newState.npcStamina < newState.maxStamina) {
    newState.npcStamina = Math.min(newState.maxStamina, newState.npcStamina + (staminaRegenRate * 0.7));
  }

  // Update cooldowns
  if (newState.playerCooldown > 0) {
    newState.playerCooldown = Math.max(0, newState.playerCooldown - deltaTime);
  }
  if (newState.npcCooldown > 0) {
    newState.npcCooldown = Math.max(0, newState.npcCooldown - deltaTime);
  }

  // Reset actions after duration if not actively blocking
  if (timestamp - newState.lastPlayerAction > 300 && !newState.playerBlocking) {
    newState.playerAction = 'standing';
  }
  if (timestamp - newState.lastNpcAction > 300 && !newState.npcBlocking) {
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
  } else if (newState.npcHealth <= 0 && !newState.gameOver) {
    newState.gameOver = true;
    newState.winner = 'player';
    newState.playerAction = 'winner';
    newState.npcAction = 'dead';
    newState.playerScore += 1;
  }

  return newState;
}

// Start new game
export function startGame(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): GameState {
  return {
    ...initialState,
    gameStarted: true,
    difficulty,
  };
}

// Reset entire game
export function resetGame(): GameState {
  return initialState;
}

// Toggle sound
export function toggleSound(state: GameState): GameState {
  return {
    ...state,
    soundEnabled: !state.soundEnabled,
  };
}

// Change difficulty
export function changeDifficulty(state: GameState, difficulty: 'easy' | 'medium' | 'hard'): GameState {
  return {
    ...state,
    difficulty,
  };
}

// Get combo message for UI feedback
export function getComboMessage(combo: number): string {
  if (combo >= 10) return 'LEGENDARY!';
  if (combo >= 7) return 'AMAZING!';
  if (combo >= 5) return 'GREAT!';
  if (combo >= 3) return 'NICE!';
  return '';
}

// Calculate health percentage for health bars
export function getHealthPercentage(current: number, max: number): number {
  return Math.max(0, (current / max) * 100);
}

// Calculate stamina percentage for stamina bars
export function getStaminaPercentage(current: number, max: number): number {
  return Math.max(0, (current / max) * 100);
}