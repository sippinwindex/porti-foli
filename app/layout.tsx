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
  preload: false, // Only preload if used immediately
  fallback: ['Menlo', 'Monaco', 'monospace'],
})

// Enhanced metadata with your complete brand identity
export const metadata: Metadata = {
  title: {
    default: 'Juan Fernandez | Full-Stack Developer & 3D Web Specialist',
    template: '%s | Juan Fernandez'
  },
  description: 'Experienced Full-Stack Developer specializing in React, Next.js, Three.js, and immersive web experiences. Based in Miami, FL. Available for freelance and full-time opportunities.',
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
    'UX/UI Design',
    'Portfolio',
    'Juan Fernandez',
    'Full-Stack',
    '3D Web Development',
    'Interactive Design',
    'Modern Web Technologies'
  ],
  authors: [{ name: 'Juan Fernandez', url: 'https://github.com/sippinwindex' }],
  creator: 'Juan Fernandez',
  publisher: 'Juan Fernandez',
  category: 'Technology',
  classification: 'Portfolio',
  
  // Enhanced OpenGraph with your brand
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://juanfernandez.dev',
    title: 'Juan Fernandez | Full-Stack Developer & 3D Web Specialist',
    description: 'Experienced Full-Stack Developer crafting immersive digital experiences with cutting-edge web technologies. Specializing in React, Next.js, Three.js, and modern development practices.',
    siteName: 'Juan Fernandez Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Juan Fernandez - Full-Stack Developer Portfolio',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'Juan Fernandez - Full-Stack Developer',
        type: 'image/png',
      },
    ],
  },
  
  // Enhanced Twitter/X metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Juan Fernandez | Full-Stack Developer & 3D Web Specialist',
    description: 'Experienced Full-Stack Developer crafting immersive digital experiences with React, Next.js, Three.js, and modern web technologies.',
    images: ['/og-image.png'],
    creator: '@FullyStackedUp',
    site: '@FullyStackedUp',
  },
  
  // Enhanced robots configuration
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Enhanced icons and manifest
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-16x16.png',
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  
  manifest: '/site.webmanifest',
  
  // Enhanced metadata base
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://juanfernandez.dev'),
  
  // Additional SEO enhancements
  alternates: {
    canonical: '/',
  },
  
  // Verification for search engines
  verification: {
    google: 'your-google-verification-code',
    other: {
      me: ['mailto:jafernandez94@gmail.com', 'https://github.com/sippinwindex'],
    },
  },
  
  // Enhanced application info
  applicationName: 'Juan Fernandez Portfolio',
  referrer: 'origin-when-cross-origin',
}

// Enhanced viewport export (Next.js 14+ requirement)
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
        {/* Only preload critical fonts that are used immediately */}
        <link 
          rel="preload" 
          href="/fonts/Inter-roman.latin.var.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//vercel.live" />
        
        {/* Enhanced structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Juan Fernandez',
              jobTitle: 'Full-Stack Developer',
              description: 'Experienced Full-Stack Developer specializing in React, Next.js, Three.js, and immersive web experiences.',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://juanfernandez.dev',
              image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://juanfernandez.dev'}/og-image.png`,
              sameAs: [
                'https://github.com/sippinwindex',
                'https://www.linkedin.com/in/juan-fernandez-fullstack/',
                'https://twitter.com/FullyStackedUp',
              ],
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Miami',
                addressRegion: 'FL',
                addressCountry: 'US',
              },
              knowsAbout: [
                'React',
                'Next.js',
                'TypeScript',
                'Three.js',
                'WebGL',
                'Python',
                'Flask',
                'PostgreSQL',
                'Full-Stack Development',
                'UI/UX Design',
              ],
            }),
          }}
        />
      </head>
      <body 
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-viva-magenta text-white px-4 py-2 rounded-md z-[10001] transition-all"
            >
              Skip to main content
            </a>
            
            {/* Navigation */}
            <Navigation />
            
            {/* Main Content */}
            <main id="main-content" className="relative z-10">
              {children}
            </main>
          </ThemeWrapper>
        </ThemeProvider>
        
        {/* Analytics */}
        <Analytics />
      </body>
    </html>
  )
}