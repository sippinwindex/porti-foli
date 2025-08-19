'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { Mail, Github, Linkedin, Send, Loader, CheckCircle, AlertCircle } from 'lucide-react'

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

// Page Loading Component
function PageLoading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center z-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-500 border-t-transparent"></div>
        <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-2 border-purple-400 opacity-30"></div>
        <div className="absolute inset-4 flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>
      </div>
      <motion.p 
        className="absolute bottom-20 text-gray-600 dark:text-gray-300 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading Contact Page...
      </motion.p>
    </div>
  )
}

// Form types
interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call - replace with your actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For now, just simulate success
      console.log('Form submitted:', formData)
      setSubmitStatus('success')
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
      setErrors({})
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input changes with debouncing for validation
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }, [errors])

  if (isLoading) {
    return <PageLoading />
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

      {/* Particle Field Background - Only on desktop */}
      {!isMobile && (
        <div className="fixed inset-0 z-0">
          <ParticleField 
            particleCount={30}
            colorScheme="cyberpunk"
            animation="float"
            interactive={false}
            speed={0.3}
          />
        </div>
      )}

      <main ref={containerRef} className="relative z-10 pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <motion.div
              className="text-center mb-16"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6"
                variants={itemVariants}
              >
                Get In <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">Touch</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                variants={itemVariants}
              >
                Have a project in mind or just want to chat? I'd love to hear from you.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Contact Info */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <motion.h2 
                  className="text-2xl font-semibold mb-6"
                  variants={itemVariants}
                >
                  Let's Connect
                </motion.h2>
                <motion.p 
                  className="text-gray-600 dark:text-gray-300 mb-8"
                  variants={itemVariants}
                >
                  I'm always open to discussing new opportunities, interesting projects, 
                  or just having a chat about technology and development.
                </motion.p>

                <div className="space-y-4">
                  <motion.a
                    href="mailto:stormblazdesign@gmail.com"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Email</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">stormblazdesign@gmail.com</div>
                    </div>
                  </motion.a>
                  
                  <motion.a
                    href="https://github.com/sippinwindex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">GitHub</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">github.com/sippinwindex</div>
                    </div>
                  </motion.a>
                  
                  <motion.a
                    href="https://www.linkedin.com/in/juan-fernandez-fullstack/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">LinkedIn</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Professional Profile</div>
                    </div>
                  </motion.a>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <motion.div
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl"
                  variants={itemVariants}
                >
                  <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                    Send a Message
                  </h3>

                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-green-800 dark:text-green-200">Message sent successfully!</span>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="text-red-800 dark:text-red-200">Failed to send message. Please try again.</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          errors.name 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                          errors.subject 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all duration-200 ${
                          errors.message 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Tell me about your project or just say hello!"
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-all duration-200"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Lazy loaded Footer */}
      <Footer />
    </div>
  )
}