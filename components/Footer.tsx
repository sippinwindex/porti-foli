'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart, Coffee, ArrowUp, ExternalLink } from 'lucide-react'

// Enhanced social links with your actual information
const socialLinks = [
  { 
    name: 'GitHub', 
    href: 'https://github.com/sippinwindex', 
    icon: Github,
    color: 'hover:text-gray-600 dark:hover:text-gray-300',
    description: 'View my repositories'
  },
  { 
    name: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/', 
    icon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: 'hover:text-blue-600 dark:hover:text-blue-400',
    description: 'Connect professionally'
  },
  { 
    name: 'X (Twitter)', 
    href: 'https://x.com/FullyStackedUp', 
    icon: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: 'hover:text-gray-800 dark:hover:text-gray-300',
    description: 'Follow on X'
  },
  { 
    name: 'Email', 
    href: 'mailto:jafernandez94@gmail.com?subject=Let\'s work together&body=Hi Juan, I\'d like to discuss a project with you.', 
    icon: Mail,
    color: 'hover:text-pink-600 dark:hover:text-pink-400',
    description: 'Send me an email'
  },
]

// Enhanced navigation links
const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Experience', href: '/experience' },
  { name: 'Contact', href: '/contact' },
]

// Enhanced resources links
const resourceLinks = [
  { name: 'Resume', href: 'https://flowcv.com/resume/moac4k9d8767', external: true },
  { name: 'Blog', href: '/blog' },
  { name: 'Uses', href: '/uses' },
  { name: 'Colophon', href: '/colophon' },
]

function Footer() {
  const currentYear = new Date().getFullYear()
  const shouldReduceMotion = useReducedMotion()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'auto' : 'smooth'
    })
  }

  return (
    <footer className="relative bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300">
      {/* Enhanced background effects - only in dark mode */}
      <div className="absolute inset-0 opacity-0 dark:opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Enhanced Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-pink-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05, rotate: shouldReduceMotion ? 0 : 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <span className="text-white font-bold text-lg">JF</span>
              </motion.div>
              <div>
                <h3 className="font-bold text-2xl bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">Juan Fernandez</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Full-Stack Developer & 3D Web Specialist</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              Passionate about creating exceptional digital experiences with modern technologies. 
              Specializing in React, Next.js, Three.js, and immersive web development.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Available for new projects
              </span>
              <span>📍 Miami, Florida</span>
              <span>🌐 Remote & Local</span>
            </div>
          </motion.div>

          {/* Enhanced Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              {quickLinks.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors duration-300 group flex items-center gap-2"
                  whileHover={{ x: shouldReduceMotion ? 0 : 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-pink-500 transition-colors duration-300"></span>
                  {item.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Enhanced Resources */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Resources</h3>
            <nav className="flex flex-col space-y-3">
              {resourceLinks.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300 group flex items-center gap-2"
                  whileHover={{ x: shouldReduceMotion ? 0 : 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-yellow-500 transition-colors duration-300"></span>
                  {item.name}
                  {item.external && <ExternalLink className="w-3 h-3 opacity-60" />}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        </div>

        {/* Enhanced Social Links Section */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 dark:border-gray-800 pt-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Let's Connect</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Always open to interesting conversations and opportunities</p>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => {
                const IconComponent = link.icon
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 ${link.color} transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md`}
                    whileHover={{ 
                      scale: shouldReduceMotion ? 1 : 1.1, 
                      y: shouldReduceMotion ? 0 : -5 
                    }}
                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                    aria-label={link.name}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0.1 : 0.4, 
                      delay: shouldReduceMotion ? 0 : index * 0.1 
                    }}
                    viewport={{ once: true }}
                  >
                    <IconComponent />
                    
                    {/* Enhanced tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {link.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-500 dark:text-gray-500">
            <p className="flex items-center gap-2">
              © {currentYear} Juan Fernandez. Made with{' '}
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              {' '}using Next.js, Three.js, and{' '}
              <Coffee className="w-4 h-4 text-amber-600" />
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Designed for performance, accessibility, and exceptional user experience
            </p>
            <motion.button
              onClick={scrollToTop}
              className="p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-pink-500 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              whileHover={{ 
                scale: shouldReduceMotion ? 1 : 1.1,
                y: shouldReduceMotion ? 0 : -2
              }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Tech Stack Badge */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, delay: shouldReduceMotion ? 0 : 0.5 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-600 dark:text-gray-600">
            {['Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion', 'Vercel'].map((tech, index) => (
              <motion.span
                key={tech}
                className="px-2 py-1 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ 
                  duration: shouldReduceMotion ? 0.1 : 0.3, 
                  delay: shouldReduceMotion ? 0 : index * 0.05 
                }}
                viewport={{ once: true }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer