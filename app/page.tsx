'use client'

import React, { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import DinoGameButton from '@/components/DinoGameButton'
import Interactive3DHero from '@/components/3D/Interactive3DHero'
import ScrollTriggered3DSections from '@/components/3D/ScrollTriggered3DSections'
import FloatingCodeBlocks from '@/components/3D/FloatingCodeBlocks'
import LanguageVisualization from '@/components/3D/LanguageVisualization'
import ParticleField from '@/components/3D/ParticleField'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Code, Zap, Palette, Github, Star, Rocket, Calendar, Mail, ArrowRight, Download, Globe, Users, Activity } from 'lucide-react'
import usePortfolioData from '@/hooks/usePortfolioData'

export default function HomePage() {
  const { projects, stats, loading } = usePortfolioData()
  const [currentSection, setCurrentSection] = useState('hero')
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  
  // Transform projects data for Interactive3DHero component
  const heroProjects = projects.length > 0 
    ? projects.slice(0, 1).map(project => ({
        id: project.id,
        title: project.name,
        description: project.description,
        techStack: project.techStack,
        featured: project.featured,
        github: {
          stars: project.github?.stars || 0,
          forks: project.github?.forks || 0,
          url: project.github?.url || project.githubUrl
        },
        vercel: {
          isLive: project.vercel?.isLive || false,
          liveUrl: project.vercel?.liveUrl || project.liveUrl
        }
      }))
    : [
        {
          id: 'portfolio',
          title: 'Portfolio Website',
          description: 'Modern 3D portfolio with live GitHub integration, interactive animations, and cutting-edge web technologies',
          techStack: ['Next.js', 'Three.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
          featured: true,
          github: { stars: 25, forks: 8, url: 'https://github.com/sippinwindex' },
          vercel: { isLive: true, liveUrl: 'https://juanfernandez.dev' }
        }
      ]

  // Tech stack for floating code blocks
  const techStack = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Three.js']

  // Track scroll position for section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const sections = ['hero', 'code-showcase', 'about', 'languages', 'projects', 'contact']
      const sectionHeight = window.innerHeight
      const currentIndex = Math.min(Math.floor(scrolled / sectionHeight), sections.length - 1)
      setCurrentSection(sections[currentIndex])
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll function for navigation
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <Navigation />
      
      {/* Particle Field Background */}
      <div className="fixed inset-0 z-0">
        <ParticleField 
          particleCount={80}
          colorScheme="viva-magenta"
          animation="constellation"
          interactive={true}
          showConnections={true}
          mouseInfluence={120}
          speed={1}
        />
      </div>

      <main className="relative z-10">
        {/* Enhanced 3D Hero Section */}
        <section id="hero" className="relative min-h-screen overflow-hidden">
          <motion.div
            className="absolute inset-0 hero-3d"
            style={{ y: backgroundY }}
          >
            {/* Dynamic gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-lux-black via-viva-magenta-900/20 to-lux-gold-900/20" />
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 20%, rgba(190, 52, 85, 0.15) 0%, transparent 50%),
                                 radial-gradient(circle at 70% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)`
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
              }}
              transition={{ duration: 20, repeat: Infinity }}
            />
          </motion.div>
          <Interactive3DHero projects={heroProjects} />
        </section>

        {/* Floating Code Blocks Section */}
        <section id="code-showcase" className="relative h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="absolute inset-0"
          >
            <FloatingCodeBlocks 
              techStack={techStack}
              isVisible={true}
              onBlockClick={(language) => {
                console.log(`Exploring ${language} technology...`)
                // Could trigger modal or navigation
              }}
            />
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center glass-hero rounded-2xl p-8 max-w-2xl mx-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-3d">
                Technologies I Master
              </h2>
              <p className="text-lg text-lux-gray-600 dark:text-lux-gray-300">
                Interactive showcase of the cutting-edge technologies I use to build extraordinary digital experiences
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Preview Section with Enhanced 3D Animations */}
        <section id="about" className="py-20 bg-gradient-to-br from-lux-offwhite via-viva-magenta-50/10 to-lux-gold-50/10 dark:from-lux-black dark:via-viva-magenta-900/5 dark:to-lux-gold-900/5 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-viva-magenta-400/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 40 - 20, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-viva-magenta-50 dark:bg-viva-magenta-900/30 text-viva-magenta-700 dark:text-viva-magenta-300 rounded-full border border-viva-magenta-200 dark:border-viva-magenta-700 mb-6"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-medium">Available for new opportunities</span>
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  About{' '}
                  <span className="bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-600 bg-clip-text text-transparent">
                    Me
                  </span>
                </h2>
                <p className="text-xl text-lux-gray-600 dark:text-lux-gray-300 max-w-3xl mx-auto leading-relaxed">
                  With over 5 years of experience in full-stack development, I specialize in creating 
                  scalable web applications with cutting-edge 3D technologies and immersive user experiences.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {[
                  {
                    icon: Rocket,
                    title: 'Frontend Excellence',
                    description: 'React, Next.js, TypeScript, Three.js, Framer Motion',
                    color: 'from-viva-magenta-500 to-viva-magenta-700',
                    delay: 0.1
                  },
                  {
                    icon: Zap,
                    title: 'Backend Mastery',
                    description: 'Node.js, PostgreSQL, MongoDB, GraphQL APIs',
                    color: 'from-lux-teal-500 to-lux-teal-700',
                    delay: 0.2
                  },
                  {
                    icon: Palette,
                    title: '3D & Animation',
                    description: 'Three.js, WebGL, GSAP, Interactive Experiences',
                    color: 'from-lux-gold-500 to-lux-gold-700',
                    delay: 0.3
                  }
                ].map((skill, index) => (
                  <motion.div
                    key={skill.title}
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ duration: 0.8, delay: skill.delay }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      z: 50
                    }}
                    className="group card-3d relative overflow-hidden preserve-3d"
                  >
                    <div className="relative p-8 glass-card border border-lux-gray-200/50 dark:border-lux-gray-700/50 rounded-2xl h-full">
                      {/* Animated Background Gradient */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                        animate={{
                          background: [
                            `linear-gradient(45deg, ${skill.color.split(' ')[1]} 0%, transparent 100%)`,
                            `linear-gradient(225deg, ${skill.color.split(' ')[1]} 0%, transparent 100%)`,
                            `linear-gradient(45deg, ${skill.color.split(' ')[1]} 0%, transparent 100%)`
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      
                      <motion.div 
                        className="relative z-10 text-center"
                        animate={{ 
                          y: [0, -5, 0],
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          delay: index * 0.5,
                          ease: "easeInOut"
                        }}
                      >
                        <motion.div 
                          className="flex justify-center mb-4"
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                        >
                          <skill.icon className="w-12 h-12 text-viva-magenta-600 dark:text-viva-magenta-400" />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-4 text-lux-gray-900 dark:text-lux-gray-50">{skill.title}</h3>
                        <p className="text-lux-gray-600 dark:text-lux-gray-400 leading-relaxed">{skill.description}</p>
                      </motion.div>

                      {/* Floating particles */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-viva-magenta-400/30 rounded-full"
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`,
                            }}
                            animate={{
                              y: [0, -20, 0],
                              opacity: [0.3, 0.8, 0.3],
                              scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 3 + Math.random() * 2,
                              repeat: Infinity,
                              delay: Math.random() * 2,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>

                      {/* Scan line effect */}
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-viva-magenta-500 to-transparent opacity-0 group-hover:opacity-100"
                        animate={{
                          top: ['0%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Live Stats Section */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
                >
                  {[
                    { label: 'Projects Built', value: stats.totalProjects, icon: Code, color: 'viva-magenta' },
                    { label: 'GitHub Stars', value: stats.totalStars, icon: Star, color: 'lux-gold' },
                    { label: 'Live Applications', value: stats.liveProjects, icon: Globe, color: 'lux-teal' },
                    { label: 'Years Experience', value: '5+', icon: Calendar, color: 'lux-sage' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-6 glass-card rounded-xl border border-lux-gray-200/50 dark:border-lux-gray-700/50 group"
                      whileHover={{ scale: 1.05, y: -5 }}
                      initial={{ scale: 0, rotateY: -180 }}
                      whileInView={{ scale: 1, rotateY: 0 }}
                      transition={{ 
                        delay: index * 0.1, 
                        type: "spring", 
                        stiffness: 300,
                        duration: 0.6
                      }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className="flex justify-center mb-3"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          delay: index * 0.2
                        }}
                      >
                        <stat.icon className="w-8 h-8 text-viva-magenta-600 dark:text-viva-magenta-400" />
                      </motion.div>
                      <motion.div 
                        className="text-3xl font-bold text-lux-gray-900 dark:text-lux-gray-50 mb-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        viewport={{ once: true }}
                      >
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </motion.div>
                      <div className="text-sm text-lux-gray-600 dark:text-lux-gray-400">{stat.label}</div>
                      
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-viva-magenta-500/10 to-lux-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1 }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <motion.button
                    onClick={() => scrollToSection('projects')}
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform-gpu"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Discover My Journey</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Language Visualization Section */}
        <section id="languages" className="relative h-screen">
          <LanguageVisualization 
            showStats={true}
            interactive={true}
            layout="circle"
          />
        </section>

        {/* Projects Section with 3D Effects */}
        <ScrollTriggered3DSections 
          projects={projects} 
          stats={{
            totalProjects: stats?.totalProjects || 25,
            totalStars: stats?.totalStars || 150,
            liveProjects: stats?.liveProjects || 12,
            recentActivity: {
              activeProjects: stats?.recentActivity?.activeProjects || 8
            }
          }} 
        />

        {/* Enhanced CTA Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-viva-magenta-900/10 via-lux-black/50 to-lux-gold-900/10 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-viva-magenta-500/5 to-lux-gold-500/5" />
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(190, 52, 85, 0.1) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)`
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
              }}
              transition={{ duration: 20, repeat: Infinity }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  Ready to{' '}
                  <span className="bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-600 bg-clip-text text-transparent">
                    Collaborate?
                  </span>
                </h2>
                <p className="text-xl text-lux-gray-600 dark:text-lux-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                  I'm always excited about new opportunities and innovative projects. 
                  Let's create something extraordinary together with cutting-edge technology.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <motion.button
                    onClick={() => scrollToSection('contact')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Get In Touch</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-lux-gold-600 to-viva-magenta-600"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                  
                  <motion.a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-8 py-4 glass-card border border-lux-gray-300 dark:border-lux-gray-600 text-lux-gray-900 dark:text-lux-gray-50 font-semibold rounded-xl hover:border-viva-magenta-400 dark:hover:border-viva-magenta-600 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.div>
                    Download Resume
                  </motion.a>
                </div>

                {/* Social Links with 3D Effects */}
                <motion.div 
                  className="flex justify-center gap-6 mt-12"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  {[
                    { href: "https://github.com/sippinwindex", icon: Github, label: "GitHub" },
                    { href: "https://www.linkedin.com/in/juan-fernandez-fullstack/", icon: Users, label: "LinkedIn" },
                    { href: "mailto:stormblazdesign@gmail.com", icon: Mail, label: "Email" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 glass-card rounded-xl border border-lux-gray-200 dark:border-lux-gray-700 hover:border-viva-magenta-300 dark:hover:border-viva-magenta-700 transition-all duration-300 group"
                      whileHover={{ scale: 1.1, y: -5, rotateY: 10 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className="flex justify-center"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        <social.icon className="w-6 h-6 text-lux-gray-600 dark:text-lux-gray-400 group-hover:text-viva-magenta-600 dark:group-hover:text-viva-magenta-400 transition-colors" />
                      </motion.div>
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <DinoGameButton />
    </>
  )
}