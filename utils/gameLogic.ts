// utils/gameLogic.ts - Enhanced Rock 'Em Sock 'Em Game Logic
export interface GameState {
  playerHealth: number;
  npcHealth: number;
  maxHealth: number;
  isPlayerTurn: boolean;
  gameOver: boolean;
  winner: 'player' | 'npc' | null;
  playerAction: 'standing' | 'punch' | 'hit' | 'dead' | 'winner';
  npcAction: 'standing' | 'punch' | 'hit' | 'dead' | 'winner';
  gameStarted: boolean;
  combo: number;
  playerScore: number;
  npcScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  soundEnabled: boolean;
}

export const initialState: GameState = {
  playerHealth: 5,
  npcHealth: 5,
  maxHealth: 5,
  isPlayerTurn: true,
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
};

// Enhanced damage calculation with combo system
export function calculateDamage(baseHealth: number, combo: number): number {
  const baseDamage = 1;
  const comboBonus = Math.floor(combo / 3) * 0.5; // Bonus damage every 3 hits
  return Math.min(baseHealth, baseDamage + comboBonus);
}

// Enhanced player punch with combo system
export function playerPunch(state: GameState): GameState {
  if (state.gameOver || !state.isPlayerTurn || !state.gameStarted) {
    return state;
  }

  const damage = calculateDamage(state.npcHealth, state.combo);
  const newNpcHealth = Math.max(0, state.npcHealth - damage);
  const gameOver = newNpcHealth <= 0;
  const winner = gameOver ? 'player' : null;
  const newCombo = state.combo + 1;

  return {
    ...state,
    npcHealth: newNpcHealth,
    isPlayerTurn: false,
    gameOver,
    winner,
    playerAction: 'punch',
    npcAction: newNpcHealth > 0 ? 'hit' : 'dead',
    combo: gameOver ? 0 : newCombo,
    playerScore: gameOver ? state.playerScore + 1 : state.playerScore,
  };
}

// Enhanced NPC punch with difficulty-based AI
export function npcPunch(state: GameState): GameState {
  if (state.gameOver || !state.gameStarted) {
    return state;
  }

  // Difficulty-based reaction time and accuracy
  const difficultySettings = {
    easy: { damage: 0.8, accuracy: 0.7 },
    medium: { damage: 1, accuracy: 0.85 },
    hard: { damage: 1.2, accuracy: 0.95 }
  };

  const settings = difficultySettings[state.difficulty];
  const damage = Math.random() < settings.accuracy ? Math.ceil(settings.damage) : 0;
  
  if (damage === 0) {
    // NPC missed
    return {
      ...state,
      isPlayerTurn: true,
      playerAction: 'standing',
      npcAction: 'standing',
      combo: 0, // Reset combo on NPC miss
    };
  }

  const newPlayerHealth = Math.max(0, state.playerHealth - damage);
  const gameOver = newPlayerHealth <= 0;
  const winner = gameOver ? 'npc' : null;

  return {
    ...state,
    playerHealth: newPlayerHealth,
    isPlayerTurn: true,
    gameOver,
    winner,
    playerAction: newPlayerHealth > 0 ? 'hit' : 'dead',
    npcAction: 'punch',
    combo: 0, // Reset combo when player gets hit
    npcScore: gameOver ? state.npcScore + 1 : state.npcScore,
  };
}

// Start new game
export function startGame(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): GameState {
  return {
    ...initialState,
    gameStarted: true,
    difficulty,
  };
}

// Reset to standing positions after animations
export function resetToStanding(state: GameState): GameState {
  return {
    ...state,
    playerAction: 'standing',
    npcAction: 'standing',
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

// Get difficulty settings for UI display
export function getDifficultyInfo(difficulty: 'easy' | 'medium' | 'hard') {
  const info = {
    easy: {
      name: 'Easy',
      description: 'NPC is slower and less accurate',
      color: 'text-green-400',
      npcDelay: 1500,
    },
    medium: {
      name: 'Medium',
      description: 'Balanced gameplay',
      color: 'text-yellow-400',
      npcDelay: 1200,
    },
    hard: {
      name: 'Hard',
      description: 'NPC is faster and more aggressive',
      color: 'text-red-400',
      npcDelay: 800,
    },
  };
  
  return info[difficulty];
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