// theme.config.js - Enhanced and integrated with your CSS system
export default {
  footer: (
    <small style={{ display: 'block', marginTop: '8rem' }}>
      <time>{new Date().getFullYear()}</time> © Juan A. Fernandez.
      <a href="/feed.xml" className="ml-4 text-viva-magenta-600 hover:text-viva-magenta-700 transition-colors duration-200">RSS</a>
      <style jsx>{`
        a {
          float: right;
        }
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </small>
  ),
  head: ({ title, meta }) => (
    <>
      {meta.description && (
        <meta name="description" content={meta.description} />
      )}
      {meta.tag && <meta name="keywords" content={meta.tag} />}
      {meta.author && <meta name="author" content={meta.author} />}
      
      {/* Enhanced SEO with your brand colors */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#BE3455" />
      <meta name="color-scheme" content="dark light" />
      
      {/* Open Graph with enhanced branding */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Juan Fernandez - Full Stack Developer" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter with enhanced meta */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:creator" content="@juanfernandez" />
      
      {/* Enhanced Fonts - Your existing setup */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Performance hints */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      
      {/* Enhanced favicon system */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Enhanced PWA support */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Critical CSS for enhanced loading and theme integration */}
      <style jsx global>{`
        /* Critical CSS variables - Your brand colors */
        :root {
          --viva-magenta: #BE3455;
          --lux-gold: #D4AF37;
          --lux-sage: #98A869;
          --lux-teal: #008080;
          --lux-brown: #4A2C2A;
          --lux-gray: #A0A0A0;
          --lux-black: #121212;
          --lux-offwhite: #FAFAFA;
          
          /* RGB variants for Tailwind integration */
          --viva-magenta-rgb: 190, 52, 85;
          --lux-gold-rgb: 212, 175, 55;
          --lux-teal-rgb: 0, 128, 128;
        }
        
        /* Enhanced body loading state */
        body {
          font-family: 'Inter var', 'Inter', system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          color: white;
          transition: background-color 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), color 0.3s ease;
          overflow-x: hidden;
        }
        
        /* Enhanced scroll behavior */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 5rem;
          overflow-x: hidden;
        }
        
        /* Enhanced focus styles */
        :focus-visible {
          outline: 2px solid var(--viva-magenta);
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        /* Enhanced selection */
        ::selection {
          background-color: var(--viva-magenta);
          color: white;
        }
        
        ::-moz-selection {
          background-color: var(--viva-magenta);
          color: white;
        }
        
        /* Enhanced scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, var(--viva-magenta), var(--lux-gold));
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #a82d4a, #ca8a04);
        }
        
        /* Enhanced loading states */
        .loading-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, var(--lux-black) 0%, #1e293b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.5s ease;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(190, 52, 85, 0.3);
          border-top: 3px solid var(--viva-magenta);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Enhanced reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
          
          html {
            scroll-behavior: auto;
          }
          
          body {
            transition: none !important;
          }
        }
        
        /* Enhanced mobile optimizations */
        @media (max-width: 768px) {
          body {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }
        
        /* Enhanced container for components */
        .nextra-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        @media (min-width: 768px) {
          .nextra-container {
            padding: 0 2rem;
          }
        }
        
        /* Enhanced glass effects for theme integration */
        .glass {
          backdrop-filter: blur(16px) saturate(180%);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .dark .glass {
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        /* Enhanced article styling */
        article {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem;
          margin: 2rem 0;
        }
        
        /* Enhanced navigation */
        nav a {
          color: rgba(255, 255, 255, 0.8);
          transition: color 0.2s ease;
        }
        
        nav a:hover {
          color: var(--viva-magenta);
        }
      `}</style>
    </>
  ),
  
  readMore: 'Read More →',
  postFooter: null,
  darkMode: true, // Enable dark mode toggle
  
  // Enhanced navigation with your brand colors and hover effects
  navs: [
    {
      url: 'https://github.com/sippinwindex',
      name: 'GitHub',
      // Add custom styling that integrates with your theme
      newWindow: true
    },
    {
      url: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
      name: 'LinkedIn',
      newWindow: true
    },
    {
      url: 'mailto:stormblazdesign@gmail.com',
      name: 'Contact'
    }
  ],
  
  // Enhanced logo integration with your brand
  logo: (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-viva-magenta-500 to-lux-gold-500 flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-sm">JF</span>
      </div>
      <span className="font-semibold text-gray-900 dark:text-gray-50">
        Juan Fernandez
      </span>
    </div>
  ),
  
  // Enhanced primary hue that matches your viva-magenta
  primaryHue: {
    dark: 340, // Viva Magenta hue value
    light: 340
  },
  
  // Enhanced date formatting
  dateFormatter: (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    }).format(new Date(date))
  },
  
  // Enhanced edit link
  docsRepositoryBase: 'https://github.com/sippinwindex/portfolio/tree/main',
  
  // Enhanced project link
  project: {
    link: 'https://github.com/sippinwindex/portfolio',
    icon: (
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="text-gray-600 dark:text-gray-400 hover:text-viva-magenta-500 transition-colors"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  },
  
  // Enhanced sidebar configuration
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  
  // Enhanced table of contents
  toc: {
    backToTop: true,
  },
  
  // Enhanced feedback integration
  feedback: {
    content: 'Question? Give me feedback →',
    labels: 'feedback',
    useLink: () => 'https://github.com/sippinwindex/portfolio/discussions/new?category=feedback'
  },
  
  // Enhanced banner (optional)
  banner: {
    key: 'portfolio-2024',
    text: (
      <div className="flex items-center gap-2">
        <span>🚀</span>
        <span>Welcome to my enhanced 3D portfolio!</span>
        <a 
          href="/about" 
          className="text-viva-magenta-300 hover:text-viva-magenta-200 underline ml-2 transition-colors"
        >
          Learn more →
        </a>
      </div>
    ),
    dismissible: true,
  },
  
  // Enhanced search configuration (if using search)
  search: {
    placeholder: 'Search articles...',
    loading: 'Searching...',
    emptyResult: 'No results found.',
  },
  
  // Enhanced git timestamp
  gitTimestamp: ({ timestamp }) => (
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
      Last updated: {timestamp.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </div>
  ),
}