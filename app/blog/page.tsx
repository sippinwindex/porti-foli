'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
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
  Loader,
  Search,
  X,
  AlertTriangle,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  Heart,
  MessageCircle,
  ArrowUp,
  ChevronDown
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

// Animated Background Particles Component for theme consistency
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
};

const BackgroundParticles = ({ theme = 'dark' }: { theme?: 'light' | 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.canvas.style.width = canvas.offsetWidth + 'px';
      ctx.canvas.style.height = canvas.offsetHeight + 'px';
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = 40;
      
      // Viva Magenta theme colors
      const colors = theme === 'light' 
        ? ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4']
        : ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#8e24aa', '#d81b60'];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
      
      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
          );

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (1 - distance / 100) * 0.15;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
      style={{ zIndex: 0 }}
    />
  );
};

// Loading Skeletons
function NavigationSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
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

// Enhanced types
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
  engagement?: {
    likes: number
    shares: number
    comments: number
  }
}

interface BlogStats {
  totalArticles: number
  articlesThisWeek: number
  averageReadTime: number
  topCategory: string
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

// Enhanced Search and Filters Component
function SearchAndFilters({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  sortBy, 
  setSortBy,
  filteredCount,
  totalCount,
  theme = 'dark'
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  sortBy: 'date' | 'popularity'
  setSortBy: (sort: 'date' | 'popularity') => void
  filteredCount: number
  totalCount: number
  theme?: 'light' | 'dark'
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const bgClass = theme === 'light' 
    ? 'bg-white/95 backdrop-blur-md border-gray-200/50' 
    : 'bg-gray-800/95 backdrop-blur-md border-gray-700/50';
  
  const inputBgClass = theme === 'light' ? 'bg-white dark:bg-gray-900' : 'bg-white dark:bg-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

  return (
    <motion.div 
      className="mb-12 max-w-6xl mx-auto"
      variants={itemVariants}
    >
      <div className={`${bgClass} rounded-2xl border shadow-lg overflow-hidden`}>
        
        {/* Main search bar */}
        <div className="p-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles by title, description, or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-12 py-4 ${inputBgClass} border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg`}
              aria-label="Search articles"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Advanced filters toggle */}
        <div className="px-6 pb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 text-sm ${subTextClass} hover:text-purple-600 dark:hover:text-purple-400 transition-colors`}
          >
            <Filter className="w-4 h-4" />
            Advanced Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expandable filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Category filter */}
                  <div>
                    <label className={`block text-sm font-medium ${textClass} mb-3`}>
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'AI', 'LLM', 'FullStack'].map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedCategory === category
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {category === 'all' ? 'All Categories' : category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort options */}
                  <div>
                    <label className={`block text-sm font-medium ${textClass} mb-3`}>
                      Sort By
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortBy('date')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          sortBy === 'date'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        Latest
                      </button>
                      <button
                        onClick={() => setSortBy('popularity')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          sortBy === 'popularity'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4" />
                        Popular
                      </button>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div>
                    <label className={`block text-sm font-medium ${textClass} mb-3`}>
                      Quick Actions
                    </label>
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('all')
                        setSortBy('date')
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results summary */}
        <div className="px-6 py-3 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className={subTextClass}>
              Showing <span className={`font-semibold ${textClass}`}>{filteredCount}</span> of{' '}
              <span className={`font-semibold ${textClass}`}>{totalCount}</span> articles
              {searchTerm && (
                <span className="ml-1">
                  for "<span className="font-medium text-purple-600 dark:text-purple-400">{searchTerm}</span>"
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="ml-1">
                  in <span className="font-medium text-purple-600 dark:text-purple-400">{selectedCategory}</span>
                </span>
              )}
            </span>
            
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced Article Card Component
function ArticleCard({ article, index, theme = 'dark' }: { article: DailyArticle; index: number; theme?: 'light' | 'dark' }) {
  const [isVisible, setIsVisible] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: "100px", amount: 0.1 })
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsVisible(true), index * 50)
      return () => clearTimeout(timer)
    }
  }, [isInView, index])

  const categoryConfig = useMemo(() => {
    const configs = {
      AI: { icon: Brain, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
      LLM: { icon: Cpu, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
      FullStack: { icon: Code, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50 dark:bg-green-900/20' }
    }
    return configs[article.category] || configs.FullStack
  }, [article.category])

  const estimateReadTime = useCallback((text: string): string => {
    const wordsPerMinute = 200
    const words = text.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }, [])

  const formatEngagement = useCallback((num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }, [])

  const bgClass = theme === 'light' 
    ? 'bg-white/95 backdrop-blur-sm border-gray-200 hover:border-purple-500/50' 
    : 'bg-gray-800/95 backdrop-blur-sm border-gray-700 hover:border-purple-500/50';
  
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const mutedTextClass = theme === 'light' ? 'text-gray-500' : 'text-gray-400';

  // Return enhanced loading skeleton if not visible yet
  if (!isVisible) {
    return (
      <div ref={cardRef} className={`h-auto ${bgClass} rounded-2xl overflow-hidden border animate-pulse`}>
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.article
      ref={cardRef}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -8 }}
      className="group relative"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
      role="article"
      aria-labelledby={`article-title-${article.id}`}
      aria-describedby={`article-desc-${article.id}`}
    >
      <div className={`${bgClass} rounded-2xl overflow-hidden border transition-all duration-500 shadow-lg hover:shadow-2xl h-full flex flex-col`}>
        
        {/* Category Badge and Meta */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${categoryConfig.color} text-white text-sm font-medium shadow-sm`}>
              <categoryConfig.icon className="w-4 h-4" />
              <span>{article.category}</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${mutedTextClass}`}>
              <Clock className="w-4 h-4" />
              <span>{article.readTime || estimateReadTime(article.description)}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Image with loading states */}
        {article.imageUrl && !imageError && (
          <div className="relative mx-6 mb-6 h-48 overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}
            <Image 
              src={article.imageUrl} 
              alt={article.title}
              fill
              className={`object-cover group-hover:scale-110 transition-all duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading={index < 3 ? "eager" : "lazy"}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
              priority={index < 3}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Category overlay */}
            <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium text-white ${categoryConfig.bgColor} backdrop-blur-sm border border-white/20`}>
              {article.source}
            </div>
          </div>
        )}
        
        <div className="p-6 pt-0 flex-1 flex flex-col">
          {/* Source and Date */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} ${subTextClass} text-xs rounded-md font-medium`}>
                {article.source}
              </span>
              {new Date(article.publishedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-md font-medium">
                  New
                </span>
              )}
            </div>
            <span className={`text-xs ${mutedTextClass}`}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          
          {/* Title */}
          <h3 
            id={`article-title-${article.id}`}
            className={`font-bold text-xl ${textClass} mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 leading-tight line-clamp-2`}
          >
            {article.title}
          </h3>
          
          {/* Description */}
          <p 
            id={`article-desc-${article.id}`}
            className={`${subTextClass} mb-4 leading-relaxed line-clamp-3 flex-1`}
          >
            {article.description}
          </p>

          {/* Engagement metrics */}
          {article.engagement && (
            <div className={`flex items-center gap-4 mb-4 text-sm ${mutedTextClass}`}>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{formatEngagement(article.engagement.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{formatEngagement(article.engagement.comments)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatEngagement(article.engagement.shares)}</span>
              </div>
            </div>
          )}
          
          {/* Read More Button */}
          <motion.a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 group/btn focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mt-auto"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            aria-label={`Read full article: ${article.title} on ${article.source}`}
          >
            Read Full Article 
            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            <span className="sr-only">(opens in new tab)</span>
          </motion.a>
        </div>
      </div>

      {/* Enhanced hover preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute -top-2 left-0 right-0 p-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} z-20 backdrop-blur-sm`}
            style={{ marginTop: '-1rem' }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryConfig.color}`}>
                <categoryConfig.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${subTextClass} line-clamp-2 mb-2`}>
                  {article.description}
                </p>
                <div className={`flex items-center justify-between text-xs ${mutedTextClass}`}>
                  <span>Published: {new Date(article.publishedAt).toLocaleDateString()}</span>
                  <span>{estimateReadTime(article.description)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

// Enhanced empty state component
function EmptyState({ 
  hasFilters, 
  onClearFilters, 
  onRetry,
  theme = 'dark'
}: { 
  hasFilters: boolean
  onClearFilters: () => void
  onRetry: () => void
  theme?: 'light' | 'dark'
}) {
  const bgClass = theme === 'light' 
    ? 'bg-white/95 backdrop-blur-sm border-gray-200' 
    : 'bg-gray-800/95 backdrop-blur-sm border-gray-700';
  
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-300';

  return (
    <motion.div 
      className="text-center py-20"
      variants={itemVariants}
    >
      <div className={`${bgClass} rounded-2xl p-12 border shadow-lg max-w-lg mx-auto`}>
        <div className="text-6xl mb-6">
          {hasFilters ? '🔍' : '📰'}
        </div>
        <h3 className={`text-2xl font-bold ${textClass} mb-4`}>
          {hasFilters ? 'No articles found' : 'No articles available'}
        </h3>
        <p className={`${subTextClass} mb-8`}>
          {hasFilters 
            ? 'Try adjusting your search criteria or browse all articles'
            : 'We\'re working on getting the latest tech articles. Please try refreshing in a moment.'
          }
        </p>
        <div className="flex gap-3 justify-center">
          {hasFilters ? (
            <>
              <button
                onClick={onClearFilters}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors duration-200"
              >
                Clear All Filters
              </button>
              <button
                onClick={onRetry}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-colors duration-200"
              >
                Refresh Articles
              </button>
            </>
          ) : (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced error display component
function ErrorDisplay({ 
  error, 
  retryCount, 
  isRetrying, 
  onRetry, 
  onUseCached,
  theme = 'dark'
}: {
  error: string
  retryCount: number
  isRetrying: boolean
  onRetry: () => void
  onUseCached: () => void
  theme?: 'light' | 'dark'
}) {
  return (
    <motion.div 
      className="max-w-2xl mx-auto mb-12"
      variants={itemVariants}
    >
      <div className="bg-amber-50/90 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center backdrop-blur-sm">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400 mr-3" />
          <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200">
            {retryCount > 0 ? 'Connection Issues' : 'Using Cached Articles'}
          </h3>
        </div>
        <p className="text-amber-700 dark:text-amber-300 mb-6">
          {error} {retryCount > 0 && `(Attempt ${retryCount}/3)`}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-lg font-medium transition-colors duration-200"
          >
            {isRetrying ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Try Again
              </>
            )}
          </button>
          {retryCount > 0 && (
            <button
              onClick={onUseCached}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Use Cached Content
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced progress loader
function ProgressiveLoader({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center gap-4 justify-center p-12">
      <div className="relative">
        <Loader className="w-12 h-12 animate-spin text-purple-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-purple-600">{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
          Loading latest articles...
        </p>
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

// Scroll to top component
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// Main Blog Page Component
export default function BlogPage() {
  // State management
  const [articles, setArticles] = useState<DailyArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date')
  
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  // Check if mobile and theme
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Listen for theme changes from navigation
    const handleThemeChange = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    }
    
    // Initial theme check
    handleThemeChange()
    
    // Listen for theme changes
    const observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      window.removeEventListener('resize', checkMobile)
      observer.disconnect()
    }
  }, [])

  // Fallback articles
  const getFallbackArticles = useCallback((): DailyArticle[] => [
    {
      id: 'fallback-1',
      title: 'The Future of AI Development: Trends and Innovations',
      description: 'Explore the latest breakthroughs in artificial intelligence, from advanced neural networks to practical applications transforming industries worldwide.',
      url: '#',
      source: 'Tech Insights',
      publishedAt: new Date().toISOString(),
      category: 'AI',
      readTime: '8 min read',
      engagement: { likes: 245, shares: 89, comments: 34 }
    },
    {
      id: 'fallback-2',
      title: 'Large Language Models: Beyond ChatGPT',
      description: 'Understanding the evolution of LLMs and their impact on various industries, from healthcare to creative writing and beyond.',
      url: '#',
      source: 'AI Weekly',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      category: 'LLM',
      readTime: '6 min read',
      engagement: { likes: 189, shares: 67, comments: 23 }
    },
    {
      id: 'fallback-3',
      title: 'Modern Full-Stack Development: Best Practices 2024',
      description: 'A comprehensive guide to building scalable web applications with modern frameworks, deployment strategies, and performance optimization.',
      url: '#',
      source: 'Dev Community',
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      category: 'FullStack',
      readTime: '10 min read',
      engagement: { likes: 156, shares: 45, comments: 18 }
    },
    {
      id: 'fallback-4',
      title: 'TypeScript Advanced Patterns for Enterprise Applications',
      description: 'Deep dive into advanced TypeScript patterns, generics, and architectural decisions for large-scale applications.',
      url: '#',
      source: 'TypeScript Today',
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      category: 'FullStack',
      readTime: '12 min read',
      engagement: { likes: 203, shares: 76, comments: 29 }
    },
    {
      id: 'fallback-5',
      title: 'Machine Learning Operations: MLOps Best Practices',
      description: 'Learn how to deploy, monitor, and maintain machine learning models in production environments with modern MLOps practices.',
      url: '#',
      source: 'ML Engineering',
      publishedAt: new Date(Date.now() - 345600000).toISOString(),
      category: 'AI',
      readTime: '9 min read',
      engagement: { likes: 178, shares: 52, comments: 21 }
    }
  ], [])

  // Enhanced fetch function with retry logic and progress
  const fetchDailyArticles = useCallback(async (showLoading = true, isRetry = false) => {
    if (showLoading) {
      setLoading(true)
      setLoadingProgress(0)
    }
    if (isRetry) setIsRetrying(true)
    setError(null)
    
    try {
      // Simulate progressive loading
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/daily-articles', {
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      clearInterval(progressInterval)
      setLoadingProgress(100)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setArticles(data.articles || [])
        setLastUpdated(new Date(data.timestamp))
        setRetryCount(0)
      } else {
        throw new Error(data.error || 'Failed to fetch articles')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error - please try again'
      setError(errorMessage)
      console.error('Failed to fetch articles:', err)
      
      // Set fallback articles
      setArticles(getFallbackArticles())
      
      // Auto-retry logic (max 3 attempts)
      if (retryCount < 3 && !isRetry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          fetchDailyArticles(false, true)
        }, 2000 * (retryCount + 1))
      }
    } finally {
      setTimeout(() => {
        setLoading(false)
        setIsRetrying(false)
        setLoadingProgress(0)
      }, 500)
    }
  }, [getFallbackArticles, retryCount])

  useEffect(() => {
    fetchDailyArticles()
  }, [fetchDailyArticles])

  // Enhanced filtering and sorting
  const filteredAndSortedArticles = useMemo(() => {
    const filtered = articles.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.source.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || 
        article.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })

    // Sort articles
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      } else {
        const aEngagement = (a.engagement?.likes || 0) + (a.engagement?.shares || 0)
        const bEngagement = (b.engagement?.likes || 0) + (b.engagement?.shares || 0)
        return bEngagement - aEngagement
      }
    })

    return filtered
  }, [articles, searchTerm, selectedCategory, sortBy])

  const handleRefresh = () => {
    fetchDailyArticles(false)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSortBy('date')
  }

  const handleUseCached = () => {
    setError(null)
    setRetryCount(0)
  }

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all'

  return (
    <div className={`relative min-h-screen transition-colors duration-300 overflow-x-hidden ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-white via-purple-50 to-pink-50' 
        : 'bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900'
    }`}>
      
      {/* Skip to content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      {/* Enhanced CSS for performance */}
      <style jsx global>{`
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

      <Navigation />

      {/* Animated Background - Theme Consistent */}
      {!isMobile && (
        <>
          {/* Fixed background particles */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <BackgroundParticles theme={theme} />
          </div>
          
          {/* Additional gradient overlays */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>
        </>
      )}

      <main id="main-content" ref={containerRef} className="relative z-10 pt-24">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Enhanced Hero Section */}
          <header className="text-center mb-16">
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 ${theme === 'light' ? 'bg-white/95' : 'bg-gray-800/95'} backdrop-blur-sm rounded-full border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} mb-6 shadow-sm`}
              whileHover={{ scale: 1.05 }}
              role="banner"
              aria-label="Blog status indicator"
            >
              <TrendingUp className="w-4 h-4 text-green-500" aria-hidden="true" />
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Daily Tech Curated
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6"
              variants={itemVariants}
            >
              Today's Tech Focus
            </motion.h1>
            
            <motion.p 
              className={`text-xl md:text-2xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-8 max-w-4xl mx-auto leading-relaxed`}
              variants={itemVariants}
              role="doc-subtitle"
            >
              Handpicked articles on AI, Large Language Models, and Full-Stack Development
            </motion.p>

            {/* Enhanced update info with ARIA labels */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-4"
              variants={itemVariants}
              role="contentinfo"
              aria-label="Article update information"
            >
              {lastUpdated && (
                <div 
                  className={`flex items-center gap-2 px-4 py-2 ${theme === 'light' ? 'bg-white/95' : 'bg-gray-800/95'} backdrop-blur-sm rounded-lg border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} shadow-sm`}
                  role="status"
                  aria-live="polite"
                >
                  <Calendar className="w-4 h-4 text-gray-500" aria-hidden="true" />
                  <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    <span className="sr-only">Last updated: </span>
                    Updated {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              )}
              
              <motion.button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={loading ? 'Refreshing articles...' : 'Refresh articles'}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                Refresh Articles
              </motion.button>
            </motion.div>
          </header>

          {/* Search and Filters */}
          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredCount={filteredAndSortedArticles.length}
            totalCount={articles.length}
            theme={theme}
          />

          {/* Error state */}
          {error && (
            <ErrorDisplay
              error={error}
              retryCount={retryCount}
              isRetrying={isRetrying}
              onRetry={handleRefresh}
              onUseCached={handleUseCached}
              theme={theme}
            />
          )}

          {/* Articles section */}
          <motion.section 
            variants={itemVariants}
            aria-labelledby="articles-heading"
          >
            <motion.h2 
              id="articles-heading"
              className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-8 flex items-center gap-3`}
              variants={itemVariants}
            >
              <Sparkles className="w-8 h-8 text-yellow-500" aria-hidden="true" />
              Latest Articles
              {filteredAndSortedArticles.length > 0 && (
                <span className={`text-lg font-normal ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  <span className="sr-only">Total: </span>
                  ({filteredAndSortedArticles.length} articles)
                </span>
              )}
            </motion.h2>
            
            {loading ? (
              <ProgressiveLoader progress={loadingProgress} />
            ) : filteredAndSortedArticles.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                variants={containerVariants}
                role="feed"
                aria-label="Article feed"
              >
                {filteredAndSortedArticles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} theme={theme} />
                ))}
              </motion.div>
            ) : (
              <EmptyState 
                hasFilters={hasActiveFilters}
                onClearFilters={handleClearFilters}
                onRetry={handleRefresh}
                theme={theme}
              />
            )}
          </motion.section>

          {/* Enhanced About section */}
          <motion.section 
            className="mt-20 text-center"
            variants={itemVariants}
            aria-labelledby="about-heading"
          >
            <div className={`${theme === 'light' ? 'bg-white/95' : 'bg-gray-800/95'} backdrop-blur-sm rounded-2xl p-8 border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} shadow-lg`}>
              <h2 id="about-heading" className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>
                About This Curation
              </h2>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-6 leading-relaxed max-w-4xl mx-auto`}>
                We carefully select high-quality articles daily, focusing on AI breakthroughs, Large Language Model innovations, 
                and Full-Stack Development best practices. Our automated curation process ensures you stay informed about 
                the latest trends and technologies shaping the future of software development.
              </p>
              <div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                role="list"
                aria-label="Article categories"
              >
                <div className="flex flex-col items-center gap-3 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl" role="listitem">
                  <Brain className="w-8 h-8 text-purple-500" aria-hidden="true" />
                  <div className="text-center">
                    <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>AI & Machine Learning</h3>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1`}>Latest AI research and applications</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl" role="listitem">
                  <Cpu className="w-8 h-8 text-blue-500" aria-hidden="true" />
                  <div className="text-center">
                    <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>Large Language Models</h3>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1`}>LLM developments and insights</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl" role="listitem">
                  <Code className="w-8 h-8 text-green-500" aria-hidden="true" />
                  <div className="text-center">
                    <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>Full-Stack Development</h3>
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1`}>Modern development practices</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  )
}