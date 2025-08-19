import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Juan Fernandez - Full Stack Developer',
    template: '%s | Juan Fernandez'
  },
  description: 'Full Stack Developer specializing in React, Next.js, and modern web technologies. Building innovative solutions and beautiful user experiences.',
  keywords: ['Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'Portfolio', 'Juan Fernandez'],
  authors: [{ name: 'Juan Fernandez' }],
  creator: 'Juan Fernandez',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Juan Fernandez - Full Stack Developer',
    description: 'Full Stack Developer specializing in React, Next.js, and modern web technologies.',
    siteName: 'Juan Fernandez Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Juan Fernandez - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juan Fernandez - Full Stack Developer',
    description: 'Full Stack Developer specializing in React, Next.js, and modern web technologies.',
    images: ['/og-image.png'],
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen bg-background">
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </ThemeProvider>
        
        {/* ✅ FIXED: Removed onLoad event handler that was causing serialization error */}
        <script 
          src="/js/navbar-fix.js"
          async
        />
        
        <Analytics />
      </body>
    </html>
  )
}