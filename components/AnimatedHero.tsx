'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Github, ExternalLink, Mail, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'

const roles = [
  'Full Stack Developer',
  'React Specialist',
  'Next.js Expert',
  'TypeScript Developer',
  'UI/UX Engineer'
]

export function AnimatedHero() {
  const [currentRole, setCurrentRole] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-accent/10 to-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Main Content */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100 }}
              className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-blue-600 p-1"
            >
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <span className="text-4xl font-bold bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent">
                  JF
                </span>
              </div>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Juan Fernandez
              </span>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 h-12 flex items-center justify-center">
              <motion.span
                key={currentRole}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
              >
                {roles[currentRole]}
              </motion.span>
            </div>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Passionate about creating exceptional digital experiences with modern technologies. 
            Specializing in React, Next.js, and building scalable web applications that make a difference.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 flex items-center gap-2"
              >
                View My Work
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-primary hover:text-primary-foreground flex items-center gap-2"
              >
                Get In Touch
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16"
          >
            {[
              { label: 'Years Experience', value: '5+' },
              { label: 'Projects Completed', value: '50+' },
              { label: 'Technologies Mastered', value: '20+' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={statsVariants}
                className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex justify-center gap-6 mb-12">
            {[
              { href: 'https://github.com/sippinwindex', icon: Github, label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', icon: () => (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              ), label: 'LinkedIn' },
              { href: 'https://x.com/FullyStackedUp', icon: () => (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              ), label: 'X (Twitter)' },
            ].map((social) => {
              const IconComponent = social.icon
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300"
                  aria-label={social.label}
                >
                  <IconComponent />
                </motion.a>
              )
            })}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}