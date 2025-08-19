// utils/math.ts - Mathematical utilities for portfolio animations and calculations

/**
 * Common mathematical constants
 */
export const MATH_CONSTANTS = {
  PI: Math.PI,
  TWO_PI: Math.PI * 2,
  HALF_PI: Math.PI / 2,
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI,
  GOLDEN_RATIO: 1.618033988749,
  EULER: Math.E,
} as const

/**
 * Linear interpolation between two values
 */
export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor
}

/**
 * Inverse linear interpolation - get the factor for a value between start and end
 */
export const invLerp = (start: number, end: number, value: number): number => {
  return (value - start) / (end - start)
}

/**
 * Remap a value from one range to another
 */
export const remap = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return lerp(outMin, outMax, invLerp(inMin, inMax, value))
}

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Smooth step function for easing
 */
export const smoothStep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/**
 * Smoother step function for more natural easing
 */
export const smootherStep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * t * (t * (t * 6 - 15) + 10)
}

/**
 * Convert degrees to radians
 */
export const degToRad = (degrees: number): number => {
  return degrees * MATH_CONSTANTS.DEG_TO_RAD
}

/**
 * Convert radians to degrees
 */
export const radToDeg = (radians: number): number => {
  return radians * MATH_CONSTANTS.RAD_TO_DEG
}

/**
 * Distance between two 2D points
 */
export const distance2D = (x1: number, y1: number, x2: number, y2: number): number => {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Distance between two 3D points
 */
export const distance3D = (
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number
): number => {
  const dx = x2 - x1
  const dy = y2 - y1
  const dz = z2 - z1
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Normalize a value to 0-1 range
 */
export const normalize = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min)
}

/**
 * Random number between min and max
 */
export const random = (min: number = 0, max: number = 1): number => {
  return Math.random() * (max - min) + min
}

/**
 * Random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Random boolean with optional probability
 */
export const randomBool = (probability: number = 0.5): boolean => {
  return Math.random() < probability
}

/**
 * Random element from array
 */
export const randomFromArray = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Ease functions for animations
 */
export const easing = {
  // Quadratic
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // Cubic
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeInOutCubic: (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Quartic
  easeInQuart: (t: number): number => t * t * t * t,
  easeOutQuart: (t: number): number => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number): number => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

  // Elastic
  easeInElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4)
  },
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  },

  // Bounce
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  }
} as const

/**
 * Vector2D class for 2D vector operations
 */
export class Vector2D {
  constructor(public x: number = 0, public y: number = 0) {}

  static from(obj: { x: number; y: number }): Vector2D {
    return new Vector2D(obj.x, obj.y)
  }

  clone(): Vector2D {
    return new Vector2D(this.x, this.y)
  }

  add(v: Vector2D): Vector2D {
    return new Vector2D(this.x + v.x, this.y + v.y)
  }

  subtract(v: Vector2D): Vector2D {
    return new Vector2D(this.x - v.x, this.y - v.y)
  }

  multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar)
  }

  divide(scalar: number): Vector2D {
    return new Vector2D(this.x / scalar, this.y / scalar)
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize(): Vector2D {
    const mag = this.magnitude()
    return mag > 0 ? this.divide(mag) : new Vector2D(0, 0)
  }

  dot(v: Vector2D): number {
    return this.x * v.x + this.y * v.y
  }

  angle(): number {
    return Math.atan2(this.y, this.x)
  }

  rotate(angle: number): Vector2D {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return new Vector2D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    )
  }

  distanceTo(v: Vector2D): number {
    return this.subtract(v).magnitude()
  }
}

/**
 * Vector3D class for 3D vector operations
 */
export class Vector3D {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

  static from(obj: { x: number; y: number; z: number }): Vector3D {
    return new Vector3D(obj.x, obj.y, obj.z)
  }

  clone(): Vector3D {
    return new Vector3D(this.x, this.y, this.z)
  }

  add(v: Vector3D): Vector3D {
    return new Vector3D(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  subtract(v: Vector3D): Vector3D {
    return new Vector3D(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  multiply(scalar: number): Vector3D {
    return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar)
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  normalize(): Vector3D {
    const mag = this.magnitude()
    return mag > 0 ? new Vector3D(this.x / mag, this.y / mag, this.z / mag) : new Vector3D(0, 0, 0)
  }

  cross(v: Vector3D): Vector3D {
    return new Vector3D(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    )
  }

  dot(v: Vector3D): number {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }
}

/**
 * Calculate statistics for GitHub data
 */
export const calculateStats = (numbers: number[]) => {
  if (numbers.length === 0) return { min: 0, max: 0, average: 0, median: 0, sum: 0 }

  const sorted = [...numbers].sort((a, b) => a - b)
  const sum = numbers.reduce((acc, val) => acc + val, 0)
  const average = sum / numbers.length
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)]

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    average: Math.round(average * 100) / 100,
    median: Math.round(median * 100) / 100,
    sum
  }
}

/**
 * Calculate percentage with safe division
 */
export const percentage = (value: number, total: number, decimals: number = 2): number => {
  if (total === 0) return 0
  return Math.round((value / total) * 100 * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Round to specified decimal places
 */
export const roundTo = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * Check if a number is within a range
 */
export const inRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * Wrap a number within a range (useful for angles)
 */
export const wrap = (value: number, min: number, max: number): number => {
  const range = max - min
  return ((value - min) % range + range) % range + min
}

/**
 * Spring physics calculation for smooth animations
 */
export const spring = (
  current: number,
  target: number,
  velocity: number,
  stiffness: number = 0.1,
  damping: number = 0.8
): { value: number; velocity: number } => {
  const force = (target - current) * stiffness
  velocity = (velocity + force) * damping
  const value = current + velocity

  return { value, velocity }
}

/**
 * Format large numbers with suffixes (K, M, B)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Generate a smooth noise value (simplified Perlin-like)
 */
export const noise = (x: number, y: number = 0): number => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return (n - Math.floor(n)) * 2 - 1
}

/**
 * Matrix operations for transformations
 */
export const matrix = {
  identity: (): number[][] => [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ],

  translation: (x: number, y: number): number[][] => [
    [1, 0, x],
    [0, 1, y],
    [0, 0, 1]
  ],

  rotation: (angle: number): number[][] => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return [
      [cos, -sin, 0],
      [sin, cos, 0],
      [0, 0, 1]
    ]
  },

  scale: (sx: number, sy: number = sx): number[][] => [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1]
  ]
}

export default {
  lerp,
  clamp,
  random,
  easing,
  Vector2D,
  Vector3D,
  calculateStats,
  formatNumber
}