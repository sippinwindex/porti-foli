// Global type definitions for the portfolio application

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // GitHub Configuration
      GITHUB_TOKEN: string;
      GITHUB_USERNAME: string;
      NEXT_PUBLIC_GITHUB_USERNAME: string;
      
      // Vercel Configuration
      VERCEL_TOKEN?: string;
      VERCEL_TEAM_ID?: string;
      
      // Site Configuration
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_SITE_NAME?: string;
      NEXT_PUBLIC_SITE_DESCRIPTION?: string;
      
      // Email Configuration
      EMAIL_FROM: string;
      EMAIL_TO: string;
      RESEND_API_KEY?: string;
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASS?: string;
      
      // Analytics
      NEXT_PUBLIC_GA_ID?: string;
      NEXT_PUBLIC_PLAUSIBLE_DOMAIN?: string;
      
      // Database (if needed)
      DATABASE_URL?: string;
      
      // Cache and Redis
      REDIS_URL?: string;
      REDIS_TOKEN?: string;
      
      // Third-party APIs
      OPENAI_API_KEY?: string;
      ANTHROPIC_API_KEY?: string;
      
      // Development
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
    }
  }

  interface Window {
    // Analytics
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    plausible?: (...args: any[]) => void;
    
    // Three.js and WebGL
    WebGLRenderingContext: WebGLRenderingContext;
    WebGL2RenderingContext: WebGL2RenderingContext;
    
    // Audio Context for game sounds
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
    
    // File System API (for reading uploaded files)
    fs?: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<string | Uint8Array>;
    };
    
    // Clipboard API
    ClipboardItem: typeof ClipboardItem;
    
    // Web Share API
    navigator: Navigator & {
      share?: (data: ShareData) => Promise<void>;
      canShare?: (data: ShareData) => boolean;
    };
    
    // Service Worker
    workbox?: any;
    
    // Development tools
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
    __NEXT_DATA__?: any;
  }
}

// Three.js and 3D model types
declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.gltf' {
  const src: string;
  export default src;
}

declare module '*.fbx' {
  const src: string;
  export default src;
}

declare module '*.obj' {
  const src: string;
  export default src;
}

declare module '*.dae' {
  const src: string;
  export default src;
}

// Image types
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

// Video types
declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.mov' {
  const src: string;
  export default src;
}

// Audio types
declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}

declare module '*.ogg' {
  const src: string;
  export default src;
}

// Font types
declare module '*.woff' {
  const src: string;
  export default src;
}

declare module '*.woff2' {
  const src: string;
  export default src;
}

declare module '*.ttf' {
  const src: string;
  export default src;
}

declare module '*.otf' {
  const src: string;
  export default src;
}

// Lottie animations
declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.lottie' {
  const value: any;
  export default value;
}

// CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.styl' {
  const classes: { [key: string]: string };
  export default classes;
}

// Shader files
declare module '*.glsl' {
  const src: string;
  export default src;
}

declare module '*.vert' {
  const src: string;
  export default src;
}

declare module '*.frag' {
  const src: string;
  export default src;
}

// Data files
declare module '*.csv' {
  const src: string;
  export default src;
}

declare module '*.tsv' {
  const src: string;
  export default src;
}

declare module '*.yaml' {
  const value: any;
  export default value;
}

declare module '*.yml' {
  const value: any;
  export default value;
}

declare module '*.toml' {
  const value: any;
  export default value;
}

// Framer Motion variants with enhanced typing
type AnimationVariants = {
  initial: any;
  animate: any;
  exit?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  whileInView?: any;
  whileFocus?: any;
  whileDrag?: any;
};

// Enhanced utility types
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Required<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// Deep utility types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Array and Object utilities
type NonEmptyArray<T> = [T, ...T[]];

type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type ValuesOf<T> = T[keyof T];

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

// Function utilities
type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

// React component utilities
type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

type ElementType<T extends React.ComponentType<any>> = T extends React.ComponentType<infer P>
  ? P extends { as?: infer U }
    ? U
    : never
  : never;

// API response utilities
type APISuccess<T = any> = {
  success: true;
  data: T;
  error?: never;
};

type APIError = {
  success: false;
  data?: never;
  error: string;
  code?: string;
};

type APIResponse<T = any> = APISuccess<T> | APIError;

// Theme utilities
type ThemeMode = 'light' | 'dark' | 'system';

type ColorScheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  destructive: string;
  success: string;
  warning: string;
  info: string;
};

// Animation and motion utilities
type EasingFunction = 
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'circIn'
  | 'circOut'
  | 'circInOut'
  | 'backIn'
  | 'backOut'
  | 'backInOut'
  | 'anticipate'
  | [number, number, number, number];

type SpringConfig = {
  type: 'spring';
  stiffness?: number;
  damping?: number;
  mass?: number;
  restSpeed?: number;
  restDelta?: number;
};

type TweenConfig = {
  type?: 'tween';
  duration?: number;
  ease?: EasingFunction;
  times?: number[];
  repeat?: number;
  repeatType?: 'loop' | 'reverse' | 'mirror';
  repeatDelay?: number;
  delay?: number;
};

type TransitionConfig = SpringConfig | TweenConfig;

// Game and interaction utilities
type Vector2D = {
  x: number;
  y: number;
};

type Vector3D = {
  x: number;
  y: number;
  z: number;
};

type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type GameEntityState = 'idle' | 'active' | 'destroyed' | 'disabled';

// Error handling utilities
type Result<T, E = Error> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };

type Maybe<T> = T | null | undefined;

type Either<L, R> = 
  | { left: L; right?: never }
  | { left?: never; right: R };

// Brand types for better type safety
type Brand<T, K> = T & { __brand: K };

type UserId = Brand<string, 'UserId'>;
type ProjectId = Brand<string, 'ProjectId'>;
type RepositoryId = Brand<number, 'RepositoryId'>;
type DeploymentId = Brand<string, 'DeploymentId'>;

// Date utilities
type DateString = Brand<string, 'DateString'>; // ISO date string
type Timestamp = Brand<number, 'Timestamp'>; // Unix timestamp

// URL utilities
type URLString = Brand<string, 'URLString'>;
type EmailString = Brand<string, 'EmailString'>;

export {};