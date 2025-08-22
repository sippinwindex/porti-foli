import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import Navigation from '@/components/Navigation'
import ThemeWrapper from '@/components/ThemeWrapper'
import './globals.css'

// Enhanced font loading with proper configuration
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: false,
  fallback: ['Menlo', 'Monaco', 'monospace'],
})

export const metadata: Metadata = {
  title: {
    default: 'Juan Fernandez | Full-Stack Developer & 3D Web Specialist',
    template: '%s | Juan Fernandez'
  },
  description: 'Experienced Full-Stack Developer specializing in React, Next.js, Three.js, and immersive web experiences. Based in Miami, FL.',
  keywords: [
    'Full Stack Developer',
    'React Developer', 
    'Next.js',
    'TypeScript',
    'Three.js',
    'WebGL',
    'Miami Developer',
    'Frontend Developer',
    'Backend Developer',
    'JavaScript',
    'Python',
    'Flask',
    'PostgreSQL',
    'Juan Fernandez'
  ],
  authors: [{ name: 'Juan Fernandez', url: 'https://github.com/sippinwindex' }],
  creator: 'Juan Fernandez',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://juanfernandez.dev',
    title: 'Juan Fernandez | Full-Stack Developer & 3D Web Specialist',
    description: 'Experienced Full-Stack Developer crafting immersive digital experiences with cutting-edge web technologies.',
    siteName: 'Juan Fernandez Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juan Fernandez | Full-Stack Developer & 3D Web Specialist',
    description: 'Experienced Full-Stack Developer crafting immersive digital experiences with React, Next.js, Three.js, and modern web technologies.',
    creator: '@FullyStackedUp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://juanfernandez.dev'),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          rel="preload" 
          href="/fonts/Inter-roman.latin.var.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//vercel.live" />
      </head>
      <body 
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-x-hidden min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="portfolio-theme"
        >
          <ThemeWrapper>
            {/* Unified Portfolio Background */}
            <div className="unified-portfolio-background" />
            
            {/* Skip to main content for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gradient-to-r from-[#BE3455] to-[#D4AF37] text-white px-4 py-2 rounded-md z-[10001] transition-all font-medium"
            >
              Skip to main content
            </a>
            
            {/* Modern Navigation */}
            <Navigation />
            
            {/* Main Content with proper spacing */}
            <main 
              id="main-content" 
              className="relative z-10"
              style={{ paddingTop: 'var(--navbar-height, 4rem)' }}
            >
              {children}
            </main>
          </ThemeWrapper>
        </ThemeProvider>
        
        <Analytics />
      </body>
    </html>
  )
}