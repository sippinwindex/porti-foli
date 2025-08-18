'use client'

import { Suspense, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Linkedin, 
  Github, 
  ExternalLink, 
  Download, 
  ArrowRight, 
  Code, 
  Star, 
  GitBranch,
  Calendar,
  Play,
  Zap,
  Award,
  Users,
  TrendingUp,
  Globe,
  Menu,
  X
} from 'lucide-react'

// Import your components
import ThemeToggle from '@/components/ThemeToggle'
import Enhanced3DNavigation from '@/components/3D/Enhanced3DNavigation'
import Interactive3DHero from '@/components/3D/Interactive3DHero'
import FloatingCodeBlocks from '@/components/3D/FloatingCodeBlocks'
import LanguageVisualization from '@/components/3D/LanguageVisualization'
import ScrollTriggered3DSections from '@/components/3D/ScrollTriggered3DSections'
import ParticleField from '@/components/3D/ParticleField'

// Loading component with your theme
function PageLoading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-lux-black via-viva-magenta-900/20 to-lux-gold-900/20 flex items-center justify-center z-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-viva-magenta-500 border-t-transparent"></div>
        <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-2 border-lux-gold-400 opacity-30"></div>
        <div className="absolute inset-4 flex items-center justify-center">
          <Code className="w-8 h-8 text-viva-magenta-400 animate-pulse" />
        </div>
      </div>
      <motion.p 
        className="absolute bottom-20 text-lux-offwhite font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Initializing 3D Experience...
      </motion.p>
    </div>
  )
}

// Enhanced project data using your theme colors - Fixed to match component interfaces
const featuredProjects = [
  {
    id: 'portfolio-3d',
    title: '3D Portfolio Experience',
    name: '3D Portfolio Experience',
    description: 'Immersive portfolio showcasing cutting-edge web technologies with Three.js, dynamic animations, and real-time GitHub integration.',
    techStack: ['Next.js', 'Three.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    github: {
      stars: 42,
      forks: 12,
      url: 'https://github.com/sippinwindex/portfolio'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://portfolio.vercel.app'
    },
    deploymentScore: 98,
    featured: true
  },
  {
    id: 'gamegraft',
    title: 'GameGraft',
    name: 'GameGraft',
    description: 'Game discovery platform with real-time API integration, advanced filtering, and dynamic user interfaces.',
    techStack: ['React', 'Flask', 'PostgreSQL', 'RAWG API'],
    github: {
      stars: 28,
      forks: 8,
      url: 'https://github.com/sippinwindex/gamegraft'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://gamegraft.vercel.app'
    },
    deploymentScore: 95,
    featured: true
  },
  {
    id: 'squadup',
    title: 'SquadUp',
    name: 'SquadUp',
    description: 'Gaming collaboration platform with real-time features, live voting system using Server-Sent Events.',
    techStack: ['React', 'Flask', 'JWT', 'SQLAlchemy', 'SSE'],
    github: {
      stars: 35,
      forks: 15,
      url: 'https://github.com/sippinwindex/squadup'
    },
    vercel: {
      isLive: true,
      liveUrl: 'https://squadup.vercel.app'
    },
    deploymentScore: 92,
    featured: true
  }
]

// Portfolio stats
const portfolioStats = {
  totalProjects: featuredProjects.length,
  totalStars: featuredProjects.reduce((acc, p) => acc + (p.github?.stars || 0), 0),
  liveProjects: featuredProjects.filter(p => p.vercel?.isLive).length,
  recentActivity: {
    activeProjects: 3
  }
}

// Enhanced language data using your color scheme
const languageData = [
  {
    name: 'TypeScript',
    percentage: 35,
    color: '#3178C6',
    icon: '⚡',
    projects: 12,
    experience: 3,
    proficiency: 'Expert' as const,
    commits: 1250
  },
  {
    name: 'React',
    percentage: 28,
    color: '#BE3455', // Using your viva-magenta
    icon: '⚛️',
    projects: 15,
    experience: 4,
    proficiency: 'Expert' as const,
    commits: 1100
  },
  {
    name: 'Next.js',
    percentage: 22,
    color: '#121212', // Using your lux-black
    icon: '▲',
    projects: 8,
    experience: 2,
    proficiency: 'Advanced' as const,
    commits: 890
  },
  {
    name: 'Node.js',
    percentage: 18,
    color: '#98A869', // Using your lux-sage
    icon: '🟢',
    projects: 10,
    experience: 3,
    proficiency: 'Advanced' as const,
    commits: 750
  },
  {
    name: 'Python',
    percentage: 15,
    color: '#008080', // Using your lux-teal
    icon: '🐍',
    projects: 6,
    experience: 2,
    proficiency: 'Intermediate' as const,
    commits: 420
  },
  {
    name: 'Three.js',
    percentage: 12,
    color: '#D4AF37', // Using your lux-gold
    icon: '🎮',
    projects: 4,
    experience: 1,
    proficiency: 'Intermediate' as const,
    commits: 320
  }
]

// Tech stack for floating code blocks
const techStack = ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Three.js']

// Contact options
const contactOptions = [
  {
    icon: Mail,
    title: 'Email',
    description: 'jafernandez94@gmail.com',
    href: 'mailto:jafernandez94@gmail.com',
    color: 'from-viva-magenta-500 to-lux-gold-500'
  },
  {
    icon: Linkedin,
    title: 'LinkedIn',
    description: 'Connect professionally',
    href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
    color: 'from-viva-magenta-600 to-viva-magenta-700'
  },
  {
    icon: Github,
    title: 'GitHub',
    description: 'View my repositories',
    href: 'https://github.com/sippinwindex',
    color: 'from-lux-gray-700 to-lux-gray-900'
  }
]

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState('hero')

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Handle scroll-based section detection
    const handleScroll = () => {
      const sections = ['hero', 'code-showcase', 'about', 'languages', 'projects', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className="relative min-h-screen bg-lux-offwhite dark:bg-lux-black text-lux-gray-900 dark:text-lux-offwhite overflow-x-hidden">
      {/* Enhanced 3D Navigation */}
      <Enhanced3DNavigation />
      
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section with Interactive 3D Elements */}
      <section id="hero" className="relative min-h-screen">
        {/* Particle Field Background */}
        <ParticleField 
          particleCount={80}
          colorScheme="multi"
          animation="constellation"
          showConnections={true}
          interactive={true}
        />
        
        {/* Interactive 3D Hero */}
        <div className="relative z-10">
          <Interactive3DHero projects={featuredProjects} />
        </div>
      </section>

      {/* Floating Code Blocks Section */}
      <section id="code-showcase" className="relative min-h-screen hero-3d-container">
        <div className="hero-3d-background" />
        <div className="hero-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="hero-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`
              }}
            />
          ))}
        </div>
        
        <div className="hero-3d-content flex items-center justify-center min-h-screen">
          <div className="text-center mb-16 hero-floating-element">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6 hero-gradient-text"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Interactive Code Showcase
            </motion.h2>
            <motion.p 
              className="text-xl text-lux-gray-600 dark:text-lux-gray-400 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore my technology stack through interactive 3D code blocks
            </motion.p>
          </div>
          
          <FloatingCodeBlocks 
            techStack={techStack}
            isVisible={currentSection === 'code-showcase'}
            onBlockClick={(language) => {
              console.log(`Clicked on ${language}`)
            }}
          />
        </div>
      </section>

      {/* About Section with 3D Cards */}
      <section id="about" className="relative py-20 bg-gradient-to-br from-lux-offwhite via-viva-magenta-50/20 to-lux-gold-50/20 dark:from-lux-black dark:via-viva-magenta-900/10 dark:to-lux-gold-900/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-lux-gray-900 dark:text-lux-offwhite mb-8">
              About <span className="gradient-text">Me</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-lux-gray-700 dark:text-lux-gray-300 mb-6 leading-relaxed">
                Hi, I'm Juan A. Fernandez, a Full-Stack Developer based in Miami, Florida. 
                With a strong foundation in software development and UI/UX design, I blend 
                analytical precision from my background as a healthcare data analyst with 
                creative, user-centered design from UX research.
              </p>
              <p className="text-lg text-lux-gray-600 dark:text-lux-gray-400 leading-relaxed">
                I'm passionate about creating seamless digital experiences that prioritize 
                accessibility and performance. I have hands-on experience developing applications 
                that integrate real-time APIs, authentication systems, and dynamic interfaces.
              </p>
            </div>
          </motion.div>

          {/* Stats Cards using your theme */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: "Projects Built", value: "15+", icon: Code, color: "viva-magenta" },
              { label: "GitHub Stars", value: "105+", icon: Star, color: "lux-gold" },
              { label: "Years Experience", value: "5+", icon: Award, color: "lux-teal" },
              { label: "Happy Clients", value: "12+", icon: Users, color: "lux-sage" }
            ].map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  className="hero-3d-card p-6 text-center"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                      <IconComponent className={`w-8 h-8 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-lux-gray-900 dark:text-lux-offwhite mb-2">{stat.value}</div>
                  <div className="text-sm text-lux-gray-600 dark:text-lux-gray-400">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Language Visualization Section */}
      <section id="languages" className="relative">
        <div className="text-center py-16">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold text-lux-gray-900 dark:text-lux-offwhite mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Technology <span className="gradient-text">Mastery</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-lux-gray-600 dark:text-lux-gray-400 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Interactive visualization of my programming language proficiency and project usage
          </motion.p>
        </div>
        
        <LanguageVisualization 
          languages={languageData}
          showStats={true}
          interactive={true}
          layout="circle"
        />
      </section>

      {/* Projects Section with Scroll-Triggered 3D */}
      <section id="projects" className="relative">
        <ScrollTriggered3DSections 
          projects={featuredProjects}
          stats={portfolioStats}
        />
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 bg-gradient-to-br from-lux-gray-50 via-viva-magenta-50/20 to-lux-gold-50/20 dark:from-lux-gray-900 dark:via-viva-magenta-900/10 dark:to-lux-gold-900/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-lux-gray-900 dark:text-lux-offwhite mb-8">
              Let's Build Something <span className="gradient-text">Amazing</span>
            </h2>
            <p className="text-xl text-lux-gray-700 dark:text-lux-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Ready to bring your ideas to life? I'm available for freelance projects 
              and full-time opportunities. Let's create something extraordinary together.
            </p>
          </motion.div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactOptions.map((contact, index) => {
              const IconComponent = contact.icon
              return (
                <motion.a
                  key={contact.title}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : undefined}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="hero-3d-card p-8 text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${contact.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-lux-gray-900 dark:text-lux-offwhite mb-2 group-hover:text-viva-magenta-600 dark:group-hover:text-viva-magenta-400 transition-colors">
                    {contact.title}
                  </h3>
                  <p className="text-lux-gray-600 dark:text-lux-gray-400">
                    {contact.description}
                  </p>
                </motion.a>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <motion.a
              href="mailto:jafernandez94@gmail.com"
              className="hero-3d-button inline-flex items-center gap-3 px-12 py-6 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Start a Project</span>
              <ArrowRight className="w-6 h-6 relative z-10" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-lux-black dark:bg-lux-black text-center py-8">
        <div className="container mx-auto px-4">
          <p className="text-lux-gray-400">
            © 2025 Juan Fernandez. Built with Next.js, Three.js, and ❤️
          </p>
        </div>
      </footer>

      {/* Dino Game Button - Fixed Position */}
      <motion.a
        href="/dinosaur"
        className="fixed bottom-8 right-8 z-40 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        title="Play Synthwave Dino! 🎮"
      >
        <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </motion.a>
    </div>
  )
}