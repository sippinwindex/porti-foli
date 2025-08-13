// Global type definitions for the portfolio application

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_TOKEN: string;
      GITHUB_USERNAME: string;
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_GITHUB_USERNAME: string;
      EMAIL_FROM: string;
      EMAIL_TO: string;
      RESEND_API_KEY?: string;
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASS?: string;
    }
  }

  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Three.js and GLTF types
declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.gltf' {
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

// Lottie animations
declare module '*.json' {
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

// Framer Motion variants
type AnimationVariants = {
  initial: any;
  animate: any;
  exit?: any;
  transition?: any;
};

// Common utility types
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

export {};