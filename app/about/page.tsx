// Enhanced About Page - Consistent with Navigation Theme System
'use client'

import { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { 
  Code2, 
  Palette, 
  Database, 
  Cloud, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Rocket,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Download,
  ExternalLink,
  Loader,
  ArrowRight,
  Star,
  GitBranch,
  Award,
  Users,
  Calendar,
  Heart,
  Coffee
} from 'lucide-react'

// Enhanced Dynamic imports with better error handling
const Navigation = dynamic(
  () => import('@/components/Navigation').catch(() => {
    console.warn('Failed to load Navigation, using fallback')
    return { default: () => <NavigationSkeleton /> }
  }),
  { 
    ssr: false,
    loading: () => <NavigationSkeleton />
  }
)

const Footer = dynamic(
  () => import('@/components/Footer').catch(() => {
    console.warn('Failed to load Footer, using fallback')  
    return { default: () => <FooterSkeleton /> }
  }),
  { 
    ssr: false,
    loading: () => <FooterSkeleton />
  }
)

// Enhanced Loading Skeletons that match your theme
function NavigationSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] h-20 bg-lux-offwhite/80 dark:bg-lux-black/80 backdrop-blur-md border-b border-lux-gray-200/50 dark:border-lux-gray-700/50">
      <div className="container mx-auto h-full flex justify-between items-center px-4">
        <div className="w-32 h-8 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-8 bg-lux-gray-200 dark:bg-lux-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </nav>
  )
}

function FooterSkeleton() {
  return (
    <footer className="bg-lux-black dark:bg-lux-gray-900 py-16 relative mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-48 h-6 bg-lux-gray-700 rounded animate-pulse" />
            <div className="w-32 h-4 bg-lux-gray-700 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="w-32 h-6 bg-lux-gray-700 rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-24 h-4 bg-lux-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-28 h-6 bg-lux-gray-700 rounded animate-pulse" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 bg-lux-gray-700 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Enhanced Page Loading Component with your theme
function PageLoading() {
  const [loadingText, setLoadingText] = useState('Loading About Page...')
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const messages = [
      'Loading About Page...',
      'Preparing Interactive Elements...',
      'Setting up Animations...',
      'Almost Ready...'
    ]
    
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % messages.length
      setLoadingText(messages[index])
      setProgress((index + 1) * 25)
    }, 600)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-lux-offwhite via-viva-magenta-50/20 to-lux-gold-50/20 dark:from-lux-black dark:via-viva-magenta-900/10 dark:to-lux-gold-900/10 flex items-center justify-center z-[9999]">
      <div className="relative text-center max-w-md mx-auto px-4">
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-viva-magenta border-t-transparent mx-auto"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-2 border-lux-gold opacity-30 mx-auto"></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <Code2 className="w-8 h-8 text-viva-magenta animate-pulse" />
          </div>
        </div>
        
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lux-gray-900 dark:text-lux-offwhite font-medium text-lg">{loadingText}</p>
          <div className="w-full h-2 bg-lux-gray-200 dark:bg-lux-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-viva-magenta to-lux-gold rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-lux-gray-600 dark:text-lux-gray-400 text-sm">{progress}% Complete</p>
        </motion.div>
      </div>
    </div>
  )
}

// Enhanced Animation variants with your theme
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

// Enhanced 3D Card Component with proper theme integration
function Card3D({ 
  children, 
  className = "", 
  delay = 0,
  enableEffects = true 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
  enableEffects?: boolean;
}) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || shouldReduceMotion || !enableEffects) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rotateXValue = (e.clientY - centerY) / 20
    const rotateYValue = (centerX - e.clientX) / 20
    
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }
  
  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }
  
  return (
    <motion.div
      className={`perspective-1000 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={cardVariants}
      transition={{ delay }}
    >
      <motion.div
        className="transform-gpu transition-transform duration-300 ease-out preserve-3d"
        style={{
          rotateX: (isMobile || shouldReduceMotion || !enableEffects) ? 0 : rotateX,
          rotateY: (isMobile || shouldReduceMotion || !enableEffects) ? 0 : rotateY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ 
          scale: shouldReduceMotion ? 1 : (isMobile ? 1.01 : 1.02) 
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Enhanced Skill Badge Component with your theme
function SkillBadge({ 
  icon: Icon, 
  skill, 
  level,
  color = "viva-magenta" 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  skill: string; 
  level: string;
  color?: string;
}) {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      className="group relative"
      whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg border border-lux-gray-200/50 dark:border-lux-gray-700/50 hover:border-viva-magenta/50 transition-all duration-300">
        <Icon className="w-4 h-4 text-viva-magenta" />
        <span className="text-sm font-medium text-lux-gray-700 dark:text-lux-gray-300">{skill}</span>
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-lux-black text-lux-offwhite text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {level}
      </div>
    </motion.div>
  )
}

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [sectionsInView, setSectionsInView] = useState(new Set<string>())
  
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const shouldReduceMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4])

  // Check if mobile and set up intersection observer
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Enhanced loading with proper timing
  useEffect(() => {
    const minLoadTime = shouldReduceMotion ? 500 : 1000
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, minLoadTime)
    return () => clearTimeout(timer)
  }, [shouldReduceMotion])

  // Enhanced section observer
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'experience', 'education', 'projects', 'cta']
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setSectionsInView(prev => new Set(prev).add(entry.target.id))
          }
        })
      },
      { 
        threshold: 0.1,
        rootMargin: '100px 0px'
      }
    )

    const timeoutId = setTimeout(() => {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId)
        if (element && observerRef.current) {
          observerRef.current.observe(element)
        }
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Enhanced skills data with your theme colors
  const skills = useMemo(() => ({
    frontend: [
      { icon: Code2, skill: "React/Next.js", level: "Expert", color: "primary" },
      { icon: Code2, skill: "TypeScript", level: "Advanced", color: "viva-magenta" },
      { icon: Palette, skill: "Tailwind CSS", level: "Expert", color: "lux-teal" },
      { icon: Sparkles, skill: "Framer Motion", level: "Advanced", color: "lux-gold" },
      { icon: Code2, skill: "Three.js", level: "Intermediate", color: "lux-sage" }
    ],
    backend: [
      { icon: Database, skill: "Flask/Python", level: "Advanced", color: "lux-sage" },
      { icon: Database, skill: "Node.js", level: "Intermediate", color: "lux-teal" },
      { icon: Database, skill: "PostgreSQL", level: "Advanced", color: "primary" },
      { icon: Code2, skill: "RESTful APIs", level: "Expert", color: "viva-magenta" },
      { icon: Database, skill: "MongoDB", level: "Intermediate", color: "lux-brown" }
    ],
    tools: [
      { icon: Cloud, skill: "AWS", level: "Intermediate", color: "lux-gold" },
      { icon: Cloud, skill: "Docker", level: "Intermediate", color: "primary" },
      { icon: Code2, skill: "Git/GitHub", level: "Expert", color: "lux-gray" },
      { icon: Palette, skill: "Figma", level: "Expert", color: "viva-magenta" },
      { icon: Code2, skill: "Vercel", level: "Advanced", color: "lux-teal" }
    ]
  }), [])

  // Enhanced contact options
  const contactOptions = useMemo(() => [
    {
      icon: Mail,
      title: 'Email',
      description: 'jafernandez94@gmail.com',
      href: 'mailto:jafernandez94@gmail.com',
      color: 'from-viva-magenta to-lux-gold'
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      description: 'Connect professionally',
      href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
      color: 'from-primary-600 to-primary-700'
    },
    {
      icon: Github,
      title: 'GitHub',
      description: 'View my repositories',
      href: 'https://github.com/sippinwindex',
      color: 'from-lux-gray-700 to-lux-gray-900'
    },
    {
      icon: Download,
      title: 'Resume',
      description: 'Download my CV',
      href: 'https://flowcv.com/resume/moac4k9d8767',
      color: 'from-lux-teal to-lux-sage'
    }
  ], [])

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className="relative min-h-screen bg-lux-offwhite dark:bg-lux-black text-lux-gray-900 dark:text-lux-offwhite transition-colors duration-300 overflow-x-hidden">
      {/* Navigation - Let it handle its own theme toggle */}
      <div className="relative z-[1000]">
        <Suspense fallback={<NavigationSkeleton />}>
          <Navigation />
        </Suspense>
      </div>

      {/* Enhanced Background Elements */}
      {!isMobile && !shouldReduceMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-viva-magenta/20 rounded-full blur-3xl"
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
            className="absolute bottom-20 right-10 w-96 h-96 bg-lux-gold/20 rounded-full blur-3xl"
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
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lux-teal/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-20">
        <div ref={containerRef} className="relative">
          <motion.div 
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
            style={{ y, opacity }}
          >
            <motion.div
              className="max-w-6xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Enhanced Hero Section */}
              <section id="hero">
                <motion.div 
                  className="text-center mb-20"
                  variants={itemVariants}
                >
                  <motion.div
                    className="relative inline-block mb-8"
                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-viva-magenta to-lux-gold p-1">
                      <div className="w-full h-full rounded-full bg-lux-offwhite dark:bg-lux-black flex items-center justify-center">
                        <span className="text-4xl font-bold gradient-text">JF</span>
                      </div>
                    </div>
                    {!isMobile && !shouldReduceMotion && (
                      <motion.div
                        className="absolute -inset-4 bg-gradient-to-r from-viva-magenta to-lux-gold rounded-full blur opacity-30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </motion.div>
                  
                  <motion.h1 
                    className="hero-title text-5xl md:text-6xl font-bold gradient-text mb-6"
                    variants={itemVariants}
                  >
                    Juan A. Fernandez
                  </motion.h1>
                  
                  <motion.p 
                    className="text-xl md:text-2xl text-lux-gray-600 dark:text-lux-gray-400 mb-8 max-w-3xl mx-auto"
                    variants={itemVariants}
                  >
                    Full-Stack Developer blending analytical precision with creative UI/UX design
                  </motion.p>

                  <motion.div 
                    className="flex flex-wrap justify-center gap-4 mb-8"
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full border border-lux-gray-200 dark:border-lux-gray-700">
                      <MapPin className="w-4 h-4 text-viva-magenta" />
                      <span className="text-lux-gray-700 dark:text-lux-gray-300">Miami, Florida</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full border border-lux-gray-200 dark:border-lux-gray-700">
                      <Briefcase className="w-4 h-4 text-lux-teal" />
                      <span className="text-lux-gray-700 dark:text-lux-gray-300">Available for hire</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex flex-col sm:flex-row justify-center gap-4"
                    variants={itemVariants}
                  >
                    <motion.a
                      href="https://flowcv.com/resume/moac4k9d8767"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 px-6 py-3"
                      whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                    <motion.a
                      href="mailto:jafernandez94@gmail.com?subject=Let's work together&body=Hi Juan, I'd like to discuss a project with you."
                      className="btn-secondary inline-flex items-center gap-2 px-6 py-3"
                      whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                    >
                      <Mail className="w-4 h-4" />
                      Get in Touch
                    </motion.a>
                  </motion.div>
                </motion.div>
              </section>

              {/* Enhanced About Section */}
              <section id="about">
                <Card3D className="mb-16" delay={0.2}>
                  <div className="glass-card p-8 rounded-2xl border border-lux-gray-200/50 dark:border-lux-gray-700/50 shadow-xl">
                    <motion.h2 
                      className="text-3xl font-bold text-lux-gray-900 dark:text-lux-offwhite mb-6"
                      variants={itemVariants}
                    >
                      About Me
                    </motion.h2>
                    <motion.div 
                      className="prose prose-lg dark:prose-invert max-w-none text-lux-gray-600 dark:text-lux-gray-300 space-y-4"
                      variants={itemVariants}
                    >
                      <p>
                        Hi, I'm Juan A. Fernandez, a Full-Stack Developer based in Miami, Florida. With a strong foundation in software development and UI/UX design, I blend analytical precision from my background as a healthcare data analyst with creative, user-centered design from UX research. I'm passionate about creating seamless digital experiences that prioritize accessibility and performance.
                      </p>
                      
                      <p>
                        My journey began in UX/UI design and research, evolving into full-stack development through dedicated certifications and practical projects. I recently graduated from 4Geeks Academy's Full-Stack Development program in July 2025, where I honed my skills in modern web technologies. Currently, I'm actively pursuing courses in Large Language Models (LLM) and AI to obtain specialized certifications.
                      </p>
                    </motion.div>
                  </div>
                </Card3D>
              </section>

              {/* Enhanced Skills Section */}
              <section id="skills">
                <motion.div 
                  className="mb-16"
                  variants={itemVariants}
                >
                  <motion.h2 
                    className="text-3xl font-bold text-center text-lux-gray-900 dark:text-lux-offwhite mb-12"
                    variants={itemVariants}
                  >
                    Technical Expertise
                  </motion.h2>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    <Card3D delay={0.1}>
                      <div className="glass-card p-6 rounded-xl border border-lux-gray-200/50 dark:border-lux-gray-700/50 h-full">
                        <h3 className="text-xl font-semibold text-lux-gray-900 dark:text-lux-offwhite mb-4 flex items-center gap-2">
                          <Code2 className="w-5 h-5 text-viva-magenta" />
                          Frontend
                        </h3>
                        <div className="space-y-3">
                          {skills.frontend.map((item, index) => (
                            <SkillBadge key={index} {...item} />
                          ))}
                        </div>
                      </div>
                    </Card3D>

                    <Card3D delay={0.2}>
                      <div className="glass-card p-6 rounded-xl border border-lux-gray-200/50 dark:border-lux-gray-700/50 h-full">
                        <h3 className="text-xl font-semibold text-lux-gray-900 dark:text-lux-offwhite mb-4 flex items-center gap-2">
                          <Database className="w-5 h-5 text-lux-teal" />
                          Backend
                        </h3>
                        <div className="space-y-3">
                          {skills.backend.map((item, index) => (
                            <SkillBadge key={index} {...item} />
                          ))}
                        </div>
                      </div>
                    </Card3D>

                    <Card3D delay={0.3}>
                      <div className="glass-card p-6 rounded-xl border border-lux-gray-200/50 dark:border-lux-gray-700/50 h-full">
                        <h3 className="text-xl font-semibold text-lux-gray-900 dark:text-lux-offwhite mb-4 flex items-center gap-2">
                          <Cloud className="w-5 h-5 text-lux-gold" />
                          Tools & DevOps
                        </h3>
                        <div className="space-y-3">
                          {skills.tools.map((item, index) => (
                            <SkillBadge key={index} {...item} />
                          ))}
                        </div>
                      </div>
                    </Card3D>
                  </div>
                </motion.div>
              </section>

              {/* Enhanced Experience & Education */}
              <section id="experience">
                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                  <Card3D delay={0.1}>
                    <div className="glass-card p-6 rounded-xl border border-lux-gray-200/50 dark:border-lux-gray-700/50 h-full">
                      <h3 className="text-2xl font-semibold text-lux-gray-900 dark:text-lux-offwhite mb-6 flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-viva-magenta" />
                        Experience
                      </h3>
                      <div className="space-y-6">
                        <div className="border-l-4 border-viva-magenta pl-4">
                          <h4 className="font-semibold text-lux-gray-900 dark:text-lux-offwhite">Full-Stack Instructor Assistant (TA)</h4>
                          <p className="text-viva-magenta font-medium">4Geeks Academy • Present</p>
                          <p className="text-lux-gray-600 dark:text-lux-gray-400 text-sm mt-2">
                            Supporting full-stack students with debugging, mentorship, and code reviews using React, Flask, and PostgreSQL.
                          </p>
                        </div>
                        <div className="border-l-4 border-lux-teal pl-4">
                          <h4 className="font-semibold text-lux-gray-900 dark:text-lux-offwhite">Healthcare Data Analyst</h4>
                          <p className="text-lux-teal font-medium">Group 1001 • 2022 – 2025</p>
                        </div>
                        <div className="border-l-4 border-lux-gold pl-4">
                          <h4 className="font-semibold text-lux-gray-900 dark:text-lux-offwhite">UX/UI Researcher</h4>
                          <p className="text-lux-gold font-medium">What Is Hot • 2017 – 2019</p>
                          <p className="text-lux-gray-600 dark:text-lux-gray-400 text-sm mt-2">
                            Drove 32% increase in user engagement through data-driven UX design and A/B testing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card3D>

                  <Card3D delay={0.2}>
                    <div className="glass-card p-6 rounded-xl border border-lux-gray-200/50 dark:border-lux-gray-700/50 h-full">
                      <h3 className="text-2xl font-semibold text-lux-gray-900 dark:text-lux-offwhite mb-6 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-lux-teal" />
                        Education
                      </h3>
                      <div className="space-y-6">
                        <div className="border-l-4 border-viva-magenta pl-4">
                          <h4 className="font-semibold text-lux-gray-900 dark:text-lux-offwhite">Full-Stack Development Certification</h4>
                          <p className="text-viva-magenta font-medium">4Geeks Academy • 2025</p>
                          <p className="text-lux-gray-600 dark:text-lux-gray-400 text-sm mt-2">
                            Comprehensive program covering React, Flask, PostgreSQL, and modern development practices.
                          </p>
                        </div>
                        <div className="border-l-4 border-lux-gold pl-4">
                          <h4 className="font-semibold text-lux-gray-900 dark:text-lux-offwhite">UX/UI Certification</h4>
                          <p className="text-lux-gold font-medium">Thinkful • 2021 – 2022</p>
                          <p className="text-lux-gray-600 dark:text-lux-gray-400 text-sm mt-2">
                            User-centered design, usability testing, and accessibility principles.
                          </p>
                        </div>
                        <div className="border-l-4 border-lux-teal pl-4">
                          <h4 className="font-semibold text-lux-gray-900 dark:text-lux-offwhite">Upcoming Certifications</h4>
                          <p className="text-lux-teal font-medium">Azure & AWS • 2025</p>
                          <p className="text-lux-gray-600 dark:text-lux-gray-400 text-sm mt-2">
                            Cloud computing and DevOps specializations in progress.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </div>
              </section>

              {/* Enhanced Featured Projects */}
              <section id="projects">
                <Card3D className="mb-16" delay={0.3}>
                  <div className="glass-card p-8 rounded-2xl border border-lux-gray-200/50 dark:border-lux-gray-700/50">
                    <h2 className="text-3xl font-bold text-lux-gray-900 dark:text-lux-offwhite mb-8 flex items-center gap-2">
                      <Rocket className="w-8 h-8 text-viva-magenta" />
                      Featured Projects
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div 
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-viva-magenta to-lux-gold p-6 text-lux-offwhite"
                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <h3 className="text-xl font-semibold mb-2">GameGraft</h3>
                        <p className="text-lux-offwhite/80 mb-4">Game Discovery App with real-time API integration</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-2 py-1 bg-white/20 rounded-md text-xs">React.js</span>
                          <span className="px-2 py-1 bg-white/20 rounded-md text-xs">Flask</span>
                          <span className="px-2 py-1 bg-white/20 rounded-md text-xs">PostgreSQL</span>
                        </div>
                        <motion.button
                          className="flex items-center gap-2 text-sm font-medium hover:underline"
                          whileHover={{ x: shouldReduceMotion ? 0 : 5 }}
                        >
                          View Project <ExternalLink className="w-4 h-4" />
                        </motion.button>
                      </motion.div>

                      <motion.div 
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-lux-teal to-lux-sage p-6 text-lux-offwhite"
                        whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <h3 className="text-xl font-semibold mb-2">SquadUp</h3>
                        <p className="text-lux-offwhite/80 mb-4">Gaming Collaboration App with real-time features</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-2 py-1 bg-white/20 rounded-md text-xs">React</span>
                          <span className="px-2 py-1 bg-white/20 rounded-md text-xs">Flask</span>
                          <span className="px-2 py-1 bg-white/20 rounded-md text-xs">JWT</span>
                        </div>
                        <motion.button
                          className="flex items-center gap-2 text-sm font-medium hover:underline"
                          whileHover={{ x: shouldReduceMotion ? 0 : 5 }}
                        >
                          View Project <ExternalLink className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </Card3D>
              </section>

              {/* Enhanced CTA Section */}
              <section id="cta">
                <motion.div 
                  className="text-center"
                  variants={itemVariants}
                >
                  <Card3D delay={0.4}>
                    <div className="bg-gradient-to-r from-viva-magenta to-lux-gold rounded-2xl p-8 text-lux-offwhite">
                      <h2 className="text-3xl font-bold mb-4">Let's Build Something Amazing</h2>
                      <p className="text-xl text-lux-offwhite/80 mb-8 max-w-2xl mx-auto">
                        Ready to bring your ideas to life? I'm available for freelance projects and full-time opportunities.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                        {contactOptions.map((option, index) => {
                          const IconComponent = option.icon
                          return (
                            <motion.a
                              key={option.title}
                              href={option.href}
                              target={option.title !== 'Email' ? '_blank' : undefined}
                              rel={option.title !== 'Email' ? 'noopener noreferrer' : undefined}
                              className="flex items-center gap-2 px-6 py-3 bg-lux-offwhite/20 backdrop-blur-sm border border-lux-offwhite/30 text-lux-offwhite rounded-lg font-semibold hover:bg-lux-offwhite/30 transition-colors duration-200"
                              whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                              whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                            >
                              <IconComponent className="w-4 h-4" />
                              {option.title}
                            </motion.a>
                          )
                        })}
                      </div>
                    </div>
                  </Card3D>
                </motion.div>
              </section>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Enhanced Footer with proper spacing */}
      <div className="relative z-10">
        <Suspense fallback={<FooterSkeleton />}>
          <Footer />
        </Suspense>
      </div>
    </div>
  )
}