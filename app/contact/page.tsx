'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  Github, 
  Linkedin, 
  Send, 
  Loader, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Clock,
  Globe,
  Twitter,
  Calendar,
  Phone,
  MessageSquare,
  Star,
  Users,
  Coffee,
  Code2,
  Briefcase,
  Heart,
  Zap,
  Shield,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Download
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

// Loading Skeletons using your theme
function NavigationSkeleton() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-32 h-8 loading-skeleton-enhanced rounded animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-8 loading-skeleton-enhanced rounded animate-pulse" />
          ))}
        </div>
      </div>
    </nav>
  )
}

function FooterSkeleton() {
  return (
    <footer className="bg-lux-black py-8">
      <div className="container mx-auto px-4">
        <div className="w-64 h-4 bg-lux-gray rounded mx-auto animate-pulse" />
      </div>
    </footer>
  )
}

// Enhanced Page Loading Component using your theme
function PageLoading() {
  return (
    <div className="fixed inset-0 bg-gradient-hero flex items-center justify-center z-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-viva-magenta-500 border-t-transparent"></div>
        <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-2 border-lux-gold-400 opacity-30"></div>
        <div className="absolute inset-4 flex items-center justify-center">
          <Mail className="w-8 h-8 text-viva-magenta-400 animate-pulse" />
        </div>
      </div>
      <motion.p 
        className="absolute bottom-20 text-lux-gray-300 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading Contact Page...
      </motion.p>
    </div>
  )
}

// Enhanced form types
interface FormData {
  name: string
  email: string
  company?: string
  phone?: string
  subject: string
  message: string
  projectType: 'web-dev' | 'mobile-app' | 'ai-ml' | 'consulting' | 'other'
  budget: 'under-5k' | '5k-15k' | '15k-50k' | '50k-plus' | 'not-sure'
  timeline: 'asap' | '1-month' | '3-months' | '6-months' | 'flexible'
  preferredContact: 'email' | 'phone' | 'video-call'
}

interface FormErrors {
  [key: string]: string
}

interface ContactMethod {
  id: string
  icon: React.ElementType
  label: string
  value: string
  href: string
  description: string
  gradientClass: string
  available: boolean
  responseTime?: string
}

// Animation variants using your theme
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

// Enhanced Contact Methods using your theme
function ContactMethodCard({ method, index, onCopy }: { 
  method: ContactMethod
  index: number
  onCopy: (text: string) => void 
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      variants={itemVariants}
      className="card-3d-enhanced group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={method.href}
        target={method.href.startsWith('http') ? '_blank' : '_self'}
        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block h-full transform-gpu hover-3d"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${method.gradientClass} shadow-luxury`}>
            <method.icon className="w-6 h-6 text-white" />
          </div>
          
          {method.available && (
            <div className="status-indicator-enhanced live">
              Available
            </div>
          )}
        </div>

        <h3 className="font-semibold text-lux-gray-900 dark:text-lux-offwhite mb-2">
          {method.label}
        </h3>
        
        <p className="text-sm text-lux-gray-600 dark:text-lux-gray-400 mb-3">
          {method.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-viva-magenta-600 dark:text-viva-magenta-400">
            {method.value}
          </span>
          
          {method.responseTime && (
            <span className="tech-badge-enhanced">
              {method.responseTime}
            </span>
          )}
        </div>

        {/* Copy button for email using your theme */}
        {method.id === 'email' && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onCopy(method.value)
            }}
            className="absolute top-4 right-4 p-2 rounded-lg bg-lux-gray-100 dark:bg-lux-gray-700 opacity-0 group-hover:opacity-100 hover-scale focus-ring-viva"
            title="Copy email"
          >
            <Copy className="w-4 h-4 text-lux-gray-600 dark:text-lux-gray-400" />
          </button>
        )}
      </a>
    </motion.div>
  )
}

// Enhanced Stats Section using your theme
function StatsSection() {
  const stats = [
    { icon: Star, label: 'Client Satisfaction', value: '100%', color: 'text-lux-gold-500' },
    { icon: Users, label: 'Projects Completed', value: '50+', color: 'text-viva-magenta-500' },
    { icon: Coffee, label: 'Cups of Coffee', value: '∞', color: 'text-lux-sage-500' },
    { icon: Code2, label: 'Lines of Code', value: '100K+', color: 'text-lux-teal-500' },
  ]

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
      variants={containerVariants}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          className="card-enhanced text-center glow-effect-enhanced"
        >
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-gradient-to-br from-viva-magenta-100 to-lux-gold-100 dark:from-viva-magenta-900/30 dark:to-lux-gold-900/30 rounded-full">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
          <div className="text-2xl font-bold gradient-text-luxury mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-lux-gray-600 dark:text-lux-gray-400">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Enhanced FAQ Section using your theme
function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqs = [
    {
      question: "What's your typical response time?",
      answer: "I usually respond to emails within 24 hours during business days. For urgent matters, feel free to mention it in the subject line."
    },
    {
      question: "Do you work with startups?",
      answer: "Absolutely! I love working with startups and early-stage companies. I offer flexible pricing and can adapt to different budget constraints."
    },
    {
      question: "What technologies do you specialize in?",
      answer: "I specialize in React, Next.js, TypeScript, Node.js, Python, and various AI/ML frameworks. I'm always learning new technologies based on project needs."
    },
    {
      question: "Do you offer ongoing support?",
      answer: "Yes, I provide maintenance and support packages for all projects. We can discuss the specific needs during our initial consultation."
    },
    {
      question: "Can you help with project planning?",
      answer: "Definitely! I can help with technical architecture, project scoping, timeline estimation, and technology selection to ensure project success."
    }
  ]

  return (
    <motion.div
      className="mb-16"
      variants={containerVariants}
    >
      <motion.h3 
        className="text-2xl font-bold text-center mb-8 gradient-text-luxury"
        variants={itemVariants}
      >
        Frequently Asked Questions
      </motion.h3>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glass-card rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="w-full p-6 text-left flex items-center justify-between hover-lift focus-ring-viva"
            >
              <span className="font-medium text-lux-gray-900 dark:text-lux-offwhite">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openFAQ === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5 text-viva-magenta-500" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openFAQ === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-lux-gray-600 dark:text-lux-gray-300">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Enhanced Form Component using your theme
function ContactForm({ onSubmit, isSubmitting, submitStatus }: {
  onSubmit: (data: FormData) => Promise<void>
  isSubmitting: boolean
  submitStatus: 'idle' | 'success' | 'error'
}) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    projectType: 'web-dev',
    budget: 'not-sure',
    timeline: 'flexible',
    preferredContact: 'email'
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }
      if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    }

    if (step === 2) {
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required'
      } else if (formData.message.length < 10) {
        newErrors.message = 'Message must be at least 10 characters'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(currentStep)) {
      await onSubmit(formData)
      if (submitStatus === 'success') {
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
          projectType: 'web-dev',
          budget: 'not-sure',
          timeline: 'flexible',
          preferredContact: 'email'
        })
        setCurrentStep(1)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="glass-card rounded-2xl p-8 shadow-luxury">
      {/* Progress indicator using your theme */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold gradient-text-luxury">
          Send a Message
        </h3>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index + 1 <= currentStep
                  ? 'bg-gradient-to-r from-viva-magenta-500 to-lux-gold-500'
                  : 'bg-lux-gray-300 dark:bg-lux-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Success/Error Messages using your theme */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-lux-sage-50 dark:bg-lux-sage-900/20 border border-lux-sage-200 dark:border-lux-sage-800 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-lux-sage-600 dark:text-lux-sage-400" />
            <span className="text-lux-sage-800 dark:text-lux-sage-200">Message sent successfully! I'll get back to you soon.</span>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">Failed to send message. Please try again or contact me directly.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-lux-gray-700 dark:text-lux-gray-300">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input focus-ring-viva ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-lux-gray-700 dark:text-lux-gray-300">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input focus-ring-viva ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2 text-lux-gray-700 dark:text-lux-gray-300">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input focus-ring-viva"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 text-lux-gray-700 dark:text-lux-gray-300">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input focus-ring-viva"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 text-lux-gray-700 dark:text-lux-gray-300">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`input focus-ring-viva ${
                    errors.subject ? 'border-red-500' : ''
                  }`}
                  placeholder="What's this about?"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
              </div>
            </motion.div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-lux-gray-700 dark:text-lux-gray-300">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`textarea focus-ring-viva ${
                    errors.message ? 'border-red-500' : ''
                  }`}
                  placeholder="Tell me about your project or just say hello! Include any specific requirements, goals, or questions you have."
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium mb-2 text-lux-gray-700 dark:text-lux-gray-300">
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="input focus-ring-viva"
                >
                  <option value="web-dev">Web Development</option>
                  <option value="mobile-app">Mobile App</option>
                  <option value="ai-ml">AI/ML Project</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Step 3: Project Preferences */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium mb-2 text-lux-gray-700 dark:text-lux-gray-300">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="input focus-ring-viva"
                  >
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-15k">$5,000 - $15,000</option>
                    <option value="15k-50k">$15,000 - $50,000</option>
                    <option value="50k-plus">$50,000+</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium mb-2 text-lux-gray-700 dark:text-lux-gray-300">
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="input focus-ring-viva"
                  >
                    <option value="asap">ASAP</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="3-months">Within 3 months</option>
                    <option value="6-months">Within 6 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-lux-gray-700 dark:text-lux-gray-300">
                  Preferred Contact Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'email', label: 'Email', icon: Mail },
                    { value: 'phone', label: 'Phone', icon: Phone },
                    { value: 'video-call', label: 'Video Call', icon: MessageSquare }
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover-scale ${
                        formData.preferredContact === method.value
                          ? 'border-viva-magenta-500 bg-viva-magenta-50 dark:bg-viva-magenta-900/20 text-viva-magenta-700 dark:text-viva-magenta-300'
                          : 'border-lux-gray-300 dark:border-lux-gray-600 hover:border-lux-gray-400 dark:hover:border-lux-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredContact"
                        value={method.value}
                        checked={formData.preferredContact === method.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <method.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons using your theme */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <motion.button
                type="button"
                onClick={handleNext}
                className="btn-viva-enhanced"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="btn-viva-enhanced"
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
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

// Main Contact Page Component using your theme
export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [copiedEmail, setCopiedEmail] = useState(false)

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

  // Contact methods using your theme
  const contactMethods: ContactMethod[] = [
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      value: 'stormblazdesign@gmail.com',
      href: 'mailto:stormblazdesign@gmail.com',
      description: 'Send me an email for detailed discussions',
      gradientClass: 'from-viva-magenta-500 to-viva-magenta-600',
      available: true,
      responseTime: '< 24h'
    },
    {
      id: 'github',
      icon: Github,
      label: 'GitHub',
      value: 'github.com/sippinwindex',
      href: 'https://github.com/sippinwindex',
      description: 'Check out my latest projects and code',
      gradientClass: 'from-lux-gray-700 to-lux-gray-800',
      available: true
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Professional Profile',
      href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
      description: 'Connect with me professionally',
      gradientClass: 'from-lux-teal-600 to-lux-teal-700',
      available: true,
      responseTime: '< 48h'
    },
    {
      id: 'twitter',
      icon: Twitter,
      label: 'Twitter',
      value: '@juan_dev',
      href: 'https://twitter.com/juan_dev',
      description: 'Follow for tech updates and insights',
      gradientClass: 'from-lux-sage-400 to-lux-sage-500',
      available: true
    }
  ]

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate API call - replace with your actual endpoint
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For now, just simulate success
      console.log('Form submitted:', formData)
      setSubmitStatus('success')
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Copy email to clipboard
  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <div className="relative min-h-screen bg-gradient-hero transition-colors duration-300 overflow-x-hidden">
      
      {/* Skip to content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 btn-viva-enhanced z-50"
      >
        Skip to main content
      </a>

      <Navigation />

      {/* Particle Field Background - Only on desktop */}
      {!isMobile && (
        <div className="fixed inset-0 z-0">
          <ParticleField 
            particleCount={25}
            colorScheme="viva-magenta"
            animation="float"
            interactive={false}
            speed={0.2}
          />
        </div>
      )}

      {/* Animated background elements using your theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-viva-magenta-400/10 to-lux-gold-400/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-lux-teal-400/10 to-lux-sage-400/10 rounded-full blur-3xl"
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

      <main id="main-content" ref={containerRef} className="relative z-10 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Enhanced Header using your theme */}
          <motion.header
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-gray-200/50 dark:border-gray-700/50 mb-6"
              variants={itemVariants}
            >
              <Zap className="w-4 h-4 text-viva-magenta-500" />
              <span className="text-sm font-medium text-lux-gray-700 dark:text-lux-gray-300">
                Let's Build Something Amazing
              </span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              variants={itemVariants}
            >
              Get In{' '}
              <span className="gradient-text-luxury">
                Touch
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-lux-gray-600 dark:text-lux-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Have a project in mind or just want to chat? I'd love to hear from you. 
              Let's discuss how we can bring your ideas to life.
            </motion.p>

            {/* Copy email notification using your theme */}
            <AnimatePresence>
              {copiedEmail && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed top-20 right-4 bg-lux-sage-500 text-white px-4 py-2 rounded-lg shadow-luxury flex items-center gap-2 z-50"
                >
                  <Check className="w-4 h-4" />
                  Email copied to clipboard!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>

          {/* Stats Section using your theme */}
          <StatsSection />

          {/* Contact Methods Grid using your theme */}
          <motion.section
            className="mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 gradient-text-luxury"
              variants={itemVariants}
            >
              Multiple Ways to Connect
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactMethods.map((method, index) => (
                <ContactMethodCard
                  key={method.id}
                  method={method}
                  index={index}
                  onCopy={handleCopyEmail}
                />
              ))}
            </div>
          </motion.section>

          {/* Main Contact Section using your theme */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            
            {/* Enhanced Contact Info using your theme */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.div
                className="glass-card rounded-2xl p-8 shadow-luxury h-full"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-viva-magenta-100 to-lux-gold-100 dark:from-viva-magenta-900/30 dark:to-lux-gold-900/30 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-viva-magenta-600 dark:text-viva-magenta-400" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text-luxury">
                    Let's Connect
                  </h2>
                </div>

                <p className="text-lux-gray-600 dark:text-lux-gray-300 mb-8 text-lg leading-relaxed">
                  I'm always open to discussing new opportunities, interesting projects, 
                  or just having a chat about technology and development. Whether you're 
                  a startup looking to build your MVP or an established company seeking 
                  to enhance your digital presence, I'd love to help.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-lux-sage-100 to-lux-sage-200 dark:from-lux-sage-900/30 dark:to-lux-sage-800/30 rounded-lg">
                      <Clock className="w-5 h-5 text-lux-sage-600 dark:text-lux-sage-400" />
                    </div>
                    <div>
                      <div className="font-medium text-lux-gray-900 dark:text-lux-offwhite">Response Time</div>
                      <div className="text-sm text-lux-gray-600 dark:text-lux-gray-400">Usually within 24 hours</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-lux-teal-100 to-lux-teal-200 dark:from-lux-teal-900/30 dark:to-lux-teal-800/30 rounded-lg">
                      <Globe className="w-5 h-5 text-lux-teal-600 dark:text-lux-teal-400" />
                    </div>
                    <div>
                      <div className="font-medium text-lux-gray-900 dark:text-lux-offwhite">Location</div>
                      <div className="text-sm text-lux-gray-600 dark:text-lux-gray-400">Miami Gardens, Florida, US</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-lux-gold-100 to-lux-gold-200 dark:from-lux-gold-900/30 dark:to-lux-gold-800/30 rounded-lg">
                      <Briefcase className="w-5 h-5 text-lux-gold-600 dark:text-lux-gold-400" />
                    </div>
                    <div>
                      <div className="font-medium text-lux-gray-900 dark:text-lux-offwhite">Availability</div>
                      <div className="text-sm text-lux-gray-600 dark:text-lux-gray-400">Open for new projects</div>
                    </div>
                  </div>
                </div>

                {/* Quick action buttons using your theme */}
                <div className="flex gap-3 mt-8">
                  <motion.a
                    href="mailto:stormblazdesign@gmail.com"
                    className="btn-viva-enhanced"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail className="w-4 h-4" />
                    Quick Email
                  </motion.a>
                  
                  <motion.a
                    href="/resume.pdf"
                    download
                    className="btn-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    Resume
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Contact Form using your theme */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <ContactForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitStatus={submitStatus}
              />
            </motion.div>
          </div>

          {/* FAQ Section using your theme */}
          <FAQSection />

          {/* Call to Action using your theme */}
          <motion.section
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              className="bg-gradient-luxury rounded-2xl p-12 text-white shadow-luxury"
              variants={itemVariants}
            >
              <h3 className="text-3xl font-bold mb-4">
                Ready to Start Your Project?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Don't hesitate to reach out. The best projects start with a simple conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="mailto:stormblazdesign@gmail.com"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-viva-magenta-600 rounded-lg font-semibold hover:bg-lux-offwhite transition-colors duration-200 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-5 h-5" />
                  Send Email
                </motion.a>
                <motion.a
                  href="https://calendly.com/juan-fernandez"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-viva-magenta-600 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Call
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  )
}