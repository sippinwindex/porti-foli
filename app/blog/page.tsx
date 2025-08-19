'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { 
  Brain, 
  Code, 
  Cpu, 
  ExternalLink, 
  Clock, 
  RefreshCw,
  Sparkles,
  Calendar,
  TrendingUp,
  Star,
  Loader
} from 'lucide-react'

// Lazy load heavy components
const Navigation = dynamic(
  () => import('@/components/Navigation'),
  { 
    ssr: false,
    loading: () => <NavigationSkeleton />
  }
)

const Footer = dynamic(
  () => import('@/components/Footer'),
  { 
    ssr: false,
    loading: () => <FooterSkeleton />
  }
)

const ParticleField = dynamic(
  () => import('@/components/3D/ParticleField'),
  { 
    ssr: false,
    loading: () => null
  }
)

// Loading Skeletons
function NavigationSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4 bg-slate-50/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-32 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </nav>
  )
}

function FooterSkeleton() {
  return (
    <footer className="bg-gray-900 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="w-64 h-4 bg-gray-700 rounded mx-auto animate-pulse" />
      </div>
    </footer>
  )
}

// Simplified types for our focused content
interface DailyArticle {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  imageUrl?: string
  category: 'AI' | 'LLM' | 'FullStack'
  readTime?: string
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

// Optimized Article Card Component
function ArticleCard({ article, index }: { article: DailyArticle; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [imageError, setImageError] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "100px" })
  
  useEffect(() => {
    if (isInView) {
      setIsVisible(true)
    }
  }, [isInView])

  const getCategoryIcon = (category: string) => {
    const icons = {
      AI: Brain,
      LLM: Cpu,
      FullStack: Code
    }
    return icons[category] || Code
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      AI: 'from-purple-500 to-pink-500',
      LLM: 'from-blue-500 to-cyan-500',
      FullStack: 'from-green-500 to-emerald-500'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const Icon = getCategoryIcon(article.category)

  if (!isVisible) {
    return (
      <div ref={cardRef} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
    )
  }

  return (
    <motion.article
      ref={cardRef}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-500 shadow-lg hover:shadow-2xl">
        {/* Category Badge */}
        <div className="relative p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getCategoryColor(article.category)} text-white text-sm font-medium`}>
              <Icon className="w-4 h-4" />
              <span>{article.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{article.readTime || '5 min read'}</span>
            </div>
          </div>
        </div>

        {/* Article Image - ✅ FIX: Replaced <img> with Next.js <Image /> */}
        {article.imageUrl && !imageError && (
          <div className="relative mx-6 mb-6 h-48 overflow-hidden rounded-xl">
            <Image 
              src={article.imageUrl} 
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        
        <div className="p-6 pt-0">
          {/* Source and Date */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md font-medium">
              {article.source}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight line-clamp-2">
            {article.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed line-clamp-3">
            {article.description}
          </p>
          
          {/* Read More Button */}
          <motion.a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 group/btn"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            Read Full Article 
            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </motion.a>
        </div>
      </div>
    </motion.article>
  )
}

// Loading Skeleton for articles
function ArticleSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
      </div>
    </div>
  )
}

export default function BlogPage() {
  const [articles, setArticles] = useState<DailyArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // ✅ FIX: Fallback articles with empty dependency array (no reactive values)
  const getFallbackArticles = useCallback((): DailyArticle[] => [
    {
      id: 'fallback-1',
      title: 'Exploring the Future of AI Development',
      description: 'A comprehensive look at the latest trends in artificial intelligence and machine learning technologies.',
      url: '#',
      source: 'Tech Insights',
      publishedAt: new Date().toISOString(),
      category: 'AI',
      readTime: '8 min read'
    },
    {
      id: 'fallback-2',
      title: 'Large Language Models: What\'s Next?',
      description: 'Understanding the evolution of LLMs and their impact on various industries.',
      url: '#',
      source: 'AI Weekly',
      publishedAt: new Date().toISOString(),
      category: 'LLM',
      readTime: '6 min read'
    },
    {
      id: 'fallback-3',
      title: 'Modern Full-Stack Development Practices',
      description: 'Best practices for building scalable web applications with modern frameworks.',
      url: '#',
      source: 'Dev Community',
      publishedAt: new Date().toISOString(),
      category: 'FullStack',
      readTime: '10 min read'
    }
  ], []) // ✅ Empty array - fallback articles don't depend on reactive values

  // ✅ FIX: Include getFallbackArticles in fetchDailyArticles dependencies
  const fetchDailyArticles = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/daily-articles')
      const data = await response.json()
      
      if (data.success) {
        setArticles(data.articles || [])
        setLastUpdated(new Date(data.timestamp))
      } else {
        setError(data.error || 'Failed to fetch articles')
        // Set fallback articles
        setArticles(getFallbackArticles())
      }
    } catch (err) {
      setError('Network error - please try again')
      console.error('Failed to fetch articles:', err)
      // Set fallback articles
      setArticles(getFallbackArticles())
    } finally {
      setLoading(false)
    }
  }, [getFallbackArticles]) // ✅ Include getFallbackArticles dependency

  // ✅ Include fetchDailyArticles dependency
  useEffect(() => {
    fetchDailyArticles()
  }, [fetchDailyArticles])

  const handleRefresh = () => {
    fetchDailyArticles(false) // Don't show full loading state for manual refresh
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300 overflow-x-hidden">
      <style jsx global>{`
        /* Performance optimizations */
        * {
          -webkit-backface-visibility: hidden;
          -moz-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        main {
          isolation: isolate;
        }
        
        section {
          position: relative;
          contain: layout style paint;
          will-change: auto;
        }
        
        @media (max-width: 768px) {
          .hero-particles,
          .hero-3d-background::before {
            display: none;
          }
          
          .glass-card {
            backdrop-filter: blur(8px);
          }
        }
      `}</style>

      {/* Lazy loaded Navigation */}
      <Navigation />

      {/* Animated Background - Only on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
      )}

      <div ref={containerRef} className="relative z-10 pt-24">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Tech Curated</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6"
              variants={itemVariants}
            >
              Today's Tech Focus
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Handpicked articles on AI, Large Language Models, and Full-Stack Development
            </motion.p>

            {/* Update Info & Refresh */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-4"
              variants={itemVariants}
            >
              {lastUpdated && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Updated {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              )}
              
              <motion.button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Articles
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div 
              className="max-w-2xl mx-auto mb-12"
              variants={itemVariants}
            >
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Using Cached Articles
                </h3>
                <p className="text-red-600 dark:text-red-300 text-sm">
                  {error} - Showing fallback content.
                </p>
              </div>
            </motion.div>
          )}

          {/* Articles Grid */}
          <motion.section variants={itemVariants}>
            <motion.h2 
              className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3"
              variants={itemVariants}
            >
              <Sparkles className="w-8 h-8 text-yellow-500" />
              Latest Articles
              {articles.length > 0 && (
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  ({articles.length} articles)
                </span>
              )}
            </motion.h2>
            
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <ArticleSkeleton key={i} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                variants={containerVariants}
              >
                {articles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-16"
                variants={itemVariants}
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-200 dark:border-gray-700">
                  <div className="text-6xl mb-6">📰</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    No articles available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    We're working on getting the latest tech articles. Please try refreshing in a moment.
                  </p>
                  <button
                    onClick={() => fetchDailyArticles()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </motion.section>

          {/* Info Section */}
          <motion.div 
            className="mt-16 text-center"
            variants={itemVariants}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About This Curation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We carefully select 3-5 high-quality articles daily focused on AI, Large Language Models, and Full-Stack Development. 
                Articles are automatically updated to keep you informed of the latest trends and technologies.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span>AI & Machine Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span>Large Language Models</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-500" />
                  <span>Full-Stack Development</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Lazy loaded Footer */}
      <Footer />
    </div>
  )
}