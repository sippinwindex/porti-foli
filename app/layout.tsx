import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import './animations/animation-manager.js';
import './globals.css'

// Enhanced font loading with your theme system
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
  preload: true,
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
    url: process.env.NEXT_PUBLIC_SITE_URL,
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
        url: '/og-image-square.png', // Add a square version for social media
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
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  
  manifest: '/site.webmanifest',
  
  // Enhanced metadata base
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://juanfernandez.dev'),
  
  // Additional SEO enhancements
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES', // Add if you plan to support Spanish
    },
  },
  
  // Verification for search engines (add your actual verification codes)
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      me: ['mailto:jafernandez94@gmail.com', 'https://github.com/sippinwindex'],
    },
  },
  
  // Enhanced application info
  applicationName: 'Juan Fernandez Portfolio',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
  
  // Enhanced viewport configuration
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
  
  // Archive links if you have them
  archives: ['/sitemap.xml'],
}

// Enhanced viewport export (recommended by Next.js 14+)
export const viewport = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/Inter-roman.latin.var.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossOrigin="" />
        
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
              url: process.env.NEXT_PUBLIC_SITE_URL,
              image: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`,
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
              worksFor: {
                '@type': 'Organization',
                name: '4Geeks Academy',
                url: 'https://4geeksacademy.com',
              },
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen bg-lux-offwhite dark:bg-lux-black text-lux-gray-900 dark:text-lux-offwhite">
            {/* Skip to main content for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-viva-magenta text-lux-offwhite px-4 py-2 rounded-md z-[10001]"
            >
              Skip to main content
            </a>
            
            <main id="main-content" className="relative z-10">
              {children}
            </main>
          </div>
        </ThemeProvider>
        
        {/* Enhanced navbar fix script */}
        <script 
          src="/js/navbar-fix.js"
          async
          defer
        />
        
        {/* Analytics */}
        <Analytics />
        
        {/* Service Worker registration for PWA (optional) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}