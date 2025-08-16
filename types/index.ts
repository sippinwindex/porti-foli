// types/index.ts
// Re-export all portfolio types
export * from './portfolio'
export * from './github'
export * from './vercel'

// Global types that might be used across the application
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
  offset?: number
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterOptions {
  [key: string]: any
}

export interface CacheOptions {
  duration: number
  key: string
  tags?: string[]
}

export interface WebhookPayload<T = any> {
  event: string
  timestamp: string
  data: T
  source: 'github' | 'vercel' | 'manual'
}

// Common error types
export interface ApplicationError {
  code: string
  message: string
  details?: any
  stack?: string
  timestamp: string
}

// Theme and UI types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: string
  external?: boolean
  children?: NavigationItem[]
}

// SEO and metadata types
export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedAt?: string
  modifiedAt?: string
}

// Analytics types
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: string
  userId?: string
  sessionId?: string
}

export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

// Form and validation types
export interface FormField<T = any> {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'number'
  value: T
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: Array<{ label: string; value: any }>
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
    custom?: (value: T) => string | null
  }
  error?: string
}

export interface FormState {
  fields: Record<string, FormField>
  isValid: boolean
  isSubmitting: boolean
  errors: Record<string, string>
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  id?: string
  'data-testid'?: string
}

export interface LoadingState {
  isLoading: boolean
  message?: string
  progress?: number
}

export interface ErrorState {
  hasError: boolean
  error?: ApplicationError
  retry?: () => void
}

// Animation and motion types
export interface AnimationConfig {
  duration: number
  delay?: number
  easing?: string
  repeat?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate'
}

export interface MotionProps {
  initial?: any
  animate?: any
  exit?: any
  transition?: AnimationConfig
  whileHover?: any
  whileTap?: any
  whileInView?: any
}

// 3D and interactive types
export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Quaternion {
  x: number
  y: number
  z: number
  w: number
}

export interface Transform3D {
  position: Vector3
  rotation: Quaternion
  scale: Vector3
}

export interface InteractiveElement {
  id: string
  position: Vector3
  clickable: boolean
  hoverable: boolean
  animated: boolean
  onClick?: () => void
  onHover?: () => void
}

// Game and interaction types (for dino game)
export interface GameState {
  state: 'menu' | 'playing' | 'paused' | 'gameOver'
  score: number
  highScore: number
  level: number
  lives: number
}

export interface GameObject {
  id: string
  x: number
  y: number
  width: number
  height: number
  velocity: Vector3
  active: boolean
  type: string
}

export interface InputState {
  keys: Record<string, boolean>
  mouse: {
    x: number
    y: number
    buttons: Record<number, boolean>
  }
  touch: {
    active: boolean
    x: number
    y: number
  }
}