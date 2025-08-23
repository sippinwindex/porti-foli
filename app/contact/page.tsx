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
const Footer = dynamic(
  () => import('@/components/Footer'),
  { 
    ssr: false,
    loading: () => null
  }
)

const ParticleField = dynamic(
  () => import('@/components/3D/ParticleField'),
  { 
    ssr: false,
    loading: () => null
  }
)

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
  available: boolean
  responseTime?: string
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

// ✅ FIXED: Contact Method Card with proper theme support
function ContactMethodCard({ method, index, onCopy }: { 
  method: ContactMethod
  index: number
  onCopy: (text: string) => void 
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      variants={itemVariants}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={method.href}
        target={method.href.startsWith('http') ? '_blank' : '_self'}
        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="block h-full p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-viva-magenta dark:hover:border-viva-magenta transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl group-hover:-translate-y-1"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-viva-magenta to-lux-gold shadow-lg">
            <method.icon className="w-6 h-6 text-white" />
          </div>
          
          {method.available && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 dark:text-green-400 text-xs font-medium">Available</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {method.label}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {method.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-viva-magenta">
            {method.value}
          </span>
          
          {method.responseTime && (
            <span className="px-2 py-1 rounded-full bg-viva-magenta/10 text-viva-magenta text-xs font-medium border border-viva-magenta/20">
              {method.responseTime}
            </span>
          )}
        </div>

        {/* Copy button for email */}
        {method.id === 'email' && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onCopy(method.value)
            }}
            className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 opacity-0 group-hover:opacity-100 hover:scale-105 transition-all duration-200"
            title="Copy email"
          >
            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </a>
    </motion.div>
  )
}

// ✅ FIXED: Stats Section with proper theme support
function StatsSection() {
  const stats = [
    { icon: Star, label: 'Client Satisfaction', value: '100%' },
    { icon: Users, label: 'Projects Completed', value: '50+' },
    { icon: Coffee, label: 'Cups of Coffee', value: '∞' },
    { icon: Code2, label: 'Lines of Code', value: '100K+' },
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
          className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-viva-magenta dark:hover:border-viva-magenta transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-gradient-to-br from-viva-magenta/10 to-lux-gold/10 rounded-full border border-viva-magenta/20">
              <stat.icon className="w-6 h-6 text-viva-magenta" />
            </div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-viva-magenta to-lux-gold bg-clip-text text-transparent mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ✅ FIXED: FAQ Section with proper theme support
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
        className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-viva-magenta to-lux-gold bg-clip-text text-transparent"
        variants={itemVariants}
      >
        Frequently Asked Questions
      </motion.h3>
      
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openFAQ === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5 text-viva-magenta" />
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
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
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

// ✅ FIXED: Contact Form with proper theme support
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-viva-magenta to-lux-gold bg-clip-text text-transparent">
          Send a Message
        </h3>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index + 1 <= currentStep
                  ? 'bg-gradient-to-r from-viva-magenta to-lux-gold'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200">Message sent successfully! I'll get back to you soon.</span>
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
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 ${
                      errors.name 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-viva-magenta focus:ring-viva-magenta'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                    className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-viva-magenta focus:ring-viva-magenta'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-viva-magenta focus:ring-viva-magenta transition-colors duration-200"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-viva-magenta focus:ring-viva-magenta transition-colors duration-200"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
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
                  className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 ${
                    errors.subject 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-viva-magenta focus:ring-viva-magenta'
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
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 resize-none ${
                    errors.message 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-viva-magenta focus:ring-viva-magenta'
                  }`}
                  placeholder="Tell me about your project or just say hello! Include any specific requirements, goals, or questions you have."
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Project Type
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-viva-magenta focus:ring-viva-magenta transition-colors duration-200"
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
                  <label htmlFor="budget" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-viva-magenta focus:ring-viva-magenta transition-colors duration-200"
                  >
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-15k">$5,000 - $15,000</option>
                    <option value="15k-50k">$15,000 - $50,000</option>
                    <option value="50k-plus">$50,000+</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-viva-magenta focus:ring-viva-magenta transition-colors duration-200"
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
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
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
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                        formData.preferredContact === method.value
                          ? 'border-viva-magenta bg-viva-magenta/10 text-viva-magenta'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <motion.button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-viva-magenta to-lux-gold text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-viva-magenta to-lux-gold text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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

// ✅ FIXED: Main Contact Page Component with proper theme support
export default function ContactPage() {
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

  // Contact methods
  const contactMethods: ContactMethod[] = [
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      value: 'jafernandez94@gmail.com',
      href: 'mailto:jafernandez94@gmail.com',
      description: 'Send me an email for detailed discussions',
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
      available: true
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Professional Profile',
      href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
      description: 'Connect with me professionally',
      available: true,
      responseTime: '< 48h'
    },
    {
      id: 'twitter',
      icon: Twitter,
      label: 'Twitter',
      value: '@FullyStackedUp',
      href: 'https://x.com/FullyStackedUp',
      description: 'Follow for tech updates and insights',
      available: true
    }
  ]

  // Handle form submission using Web3Forms
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '3029abe4-7a5f-4668-ae7b-6e05f51b35f6',
          name: formData.name,
          email: formData.email,
          subject: `Portfolio Contact: ${formData.subject}`,
          message: `
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || 'Not provided'}
Phone: ${formData.phone || 'Not provided'}
Project Type: ${formData.projectType}
Budget: ${formData.budget}
Timeline: ${formData.timeline}
Preferred Contact: ${formData.preferredContact}

Message:
${formData.message}
          `.trim(),
          // Additional fields for better organization
          company: formData.company,
          phone: formData.phone,
          project_type: formData.projectType,
          budget: formData.budget,
          timeline: formData.timeline,
          preferred_contact: formData.preferredContact
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus('success')
      } else {
        throw new Error(result.message || 'Form submission failed')
      }

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

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
      
      {/* Skip to content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-viva-magenta text-white px-4 py-2 rounded-lg z-50 font-medium"
      >
        Skip to main content
      </a>

      {/* ✅ FIXED: Particle Field Background with correct props */}
      {!isMobile && (
        <div className="fixed inset-0 z-0">
          <ParticleField 
            particleCount={25}
            colorScheme="light-mode"
            animation="constellation"
            interactive={false}
            speed={0.2}
          />
        </div>
      )}

      <main id="main-content" ref={containerRef} className="relative z-10 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* ✅ FIXED: Header with proper theme support */}
          <motion.header
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 mb-6"
              variants={itemVariants}
            >
              <Zap className="w-4 h-4 text-viva-magenta" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Let's Build Something Amazing
              </span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-gray-100"
              variants={itemVariants}
            >
              Get In{' '}
              <span className="bg-gradient-to-r from-viva-magenta to-lux-gold bg-clip-text text-transparent">
                Touch
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Have a project in mind or just want to chat? I'd love to hear from you. 
              Let's discuss how we can bring your ideas to life.
            </motion.p>

            {/* Copy email notification */}
            <AnimatePresence>
              {copiedEmail && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
                >
                  <Check className="w-4 h-4" />
                  Email copied to clipboard!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>

          {/* Stats Section */}
          <StatsSection />

          {/* Contact Methods Grid */}
          <motion.section
            className="mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-viva-magenta to-lux-gold bg-clip-text text-transparent"
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

          {/* Main Contact Section */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            
            {/* ✅ FIXED: Contact Info with proper theme support */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg h-full"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-viva-magenta/10 to-lux-gold/10 rounded-xl border border-viva-magenta/20">
                    <MessageSquare className="w-6 h-6 text-viva-magenta" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-viva-magenta to-lux-gold bg-clip-text text-transparent">
                    Let's Connect
                  </h2>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                  I'm always open to discussing new opportunities, interesting projects, 
                  or just having a chat about technology and development. Whether you're 
                  a startup looking to build your MVP or an established company seeking 
                  to enhance your digital presence, I'd love to help.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Response Time</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Usually within 24 hours</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg">
                      <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Location</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Miami Gardens, Florida, US</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg">
                      <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Availability</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Open for new projects</div>
                    </div>
                  </div>
                </div>

                {/* Quick action buttons */}
                <div className="flex gap-3 mt-8">
                  <motion.a
                    href="mailto:jafernandez94@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-viva-magenta to-lux-gold text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail className="w-4 h-4" />
                    Quick Email
                  </motion.a>
                  
                  <motion.a
                    href="https://flowcv.com/resume/ga77jnpdjre2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-viva-magenta border-2 border-viva-magenta rounded-lg font-medium hover:bg-viva-magenta/10 dark:hover:bg-viva-magenta/10 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    Resume
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
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

          {/* FAQ Section */}
          <FAQSection />

          {/* ✅ FIXED: Call to Action with proper theme support */}
          <motion.section
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              className="bg-gradient-to-r from-viva-magenta to-lux-gold rounded-2xl p-12 text-white shadow-lg"
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
                  href="mailto:jafernandez94@gmail.com"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-viva-magenta rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg"
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
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-viva-magenta transition-colors duration-200"
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