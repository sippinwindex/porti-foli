'use client'

import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
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
  ExternalLink
} from 'lucide-react'

// Animation variants
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

// 3D Card Component
function Card3D({ children, className = "", delay = 0 }) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rotateXValue = (e.clientY - centerY) / 10
    const rotateYValue = (centerX - e.clientX) / 10
    
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
        className="transform-gpu transition-transform duration-200 ease-out"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Skill Badge Component
function SkillBadge({ icon: Icon, skill, level }) {
  return (
    <motion.div
      className="group relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 dark:bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300">
        <Icon className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill}</span>
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {level}
      </div>
    </motion.div>
  )
}

export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4])

  const skills = {
    frontend: [
      { icon: Code2, skill: "React/Next.js", level: "Expert" },
      { icon: Code2, skill: "TypeScript", level: "Advanced" },
      { icon: Palette, skill: "Tailwind CSS", level: "Expert" },
      { icon: Sparkles, skill: "Framer Motion", level: "Advanced" },
      { icon: Code2, skill: "Three.js", level: "Intermediate" }
    ],
    backend: [
      { icon: Database, skill: "Flask/Python", level: "Advanced" },
      { icon: Database, skill: "Node.js", level: "Intermediate" },
      { icon: Database, skill: "PostgreSQL", level: "Advanced" },
      { icon: Code2, skill: "RESTful APIs", level: "Expert" },
      { icon: Database, skill: "MongoDB", level: "Intermediate" }
    ],
    tools: [
      { icon: Cloud, skill: "AWS", level: "Intermediate" },
      { icon: Cloud, skill: "Docker", level: "Intermediate" },
      { icon: Code2, skill: "Git/GitHub", level: "Expert" },
      { icon: Palette, skill: "Figma", level: "Expert" },
      { icon: Code2, skill: "Vercel", level: "Advanced" }
    ]
  }

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
        {/* Animated Background Elements */}
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

        <div ref={containerRef} className="relative z-10 pt-24">
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
              {/* Hero Section */}
              <motion.div 
                className="text-center mb-20"
                variants={itemVariants}
              >
                <motion.div
                  className="relative inline-block mb-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">JF</span>
                    </div>
                  </div>
                  <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
                
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6"
                  variants={itemVariants}
                >
                  Juan A. Fernandez
                </motion.h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
                  variants={itemVariants}
                >
                  Full-Stack Developer blending analytical precision with creative UI/UX design
                </motion.p>

                <motion.div 
                  className="flex flex-wrap justify-center gap-4 mb-8"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Miami, Florida</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
                    <Briefcase className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Available for hire</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex justify-center gap-4"
                  variants={itemVariants}
                >
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="w-4 h-4" />
                    Get in Touch
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* About Section */}
              <Card3D className="mb-16" delay={0.2}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
                  <motion.h2 
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
                    variants={itemVariants}
                  >
                    About Me
                  </motion.h2>
                  <motion.div 
                    className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4"
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

              {/* Skills Section */}
              <motion.div 
                className="mb-16"
                variants={itemVariants}
              >
                <motion.h2 
                  className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
                  variants={itemVariants}
                >
                  Technical Expertise
                </motion.h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <Card3D delay={0.1}>
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-blue-500" />
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
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-green-500" />
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
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-purple-500" />
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

              {/* Experience & Education */}
              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                <Card3D delay={0.1}>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-blue-500" />
                      Experience
                    </h3>
                    <div className="space-y-6">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Full-Stack Instructor Assistant (TA)</h4>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">4Geeks Academy • Present</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                          Supporting full-stack students with debugging, mentorship, and code reviews using React, Flask, and PostgreSQL.
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Healthcare Data Analyst</h4>
                        <p className="text-green-600 dark:text-green-400 font-medium">Group 1001 • 2022 – 2025</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">UX/UI Researcher</h4>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">What Is Hot • 2017 – 2019</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                          Drove 32% increase in user engagement through data-driven UX design and A/B testing.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card3D>

                <Card3D delay={0.2}>
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <GraduationCap className="w-6 h-6 text-green-500" />
                      Education
                    </h3>
                    <div className="space-y-6">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Full-Stack Development Certification</h4>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">4Geeks Academy • 2025</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                          Comprehensive program covering React, Flask, PostgreSQL, and modern development practices.
                        </p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">UX/UI Certification</h4>
                        <p className="text-purple-600 dark:text-purple-400 font-medium">Thinkful • 2021 – 2022</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                          User-centered design, usability testing, and accessibility principles.
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Upcoming Certifications</h4>
                        <p className="text-green-600 dark:text-green-400 font-medium">Azure & AWS • 2025</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                          Cloud computing and DevOps specializations in progress.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </div>

              {/* Featured Projects */}
              <Card3D className="mb-16" delay={0.3}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                    <Rocket className="w-8 h-8 text-blue-500" />
                    Featured Projects
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div 
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">GameGraft</h3>
                      <p className="text-blue-100 mb-4">Game Discovery App with real-time API integration</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-white/20 rounded-md text-xs">React.js</span>
                        <span className="px-2 py-1 bg-white/20 rounded-md text-xs">Flask</span>
                        <span className="px-2 py-1 bg-white/20 rounded-md text-xs">PostgreSQL</span>
                      </div>
                      <motion.button
                        className="flex items-center gap-2 text-sm font-medium hover:underline"
                        whileHover={{ x: 5 }}
                      >
                        View Project <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    </motion.div>

                    <motion.div 
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-teal-600 p-6 text-white"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <h3 className="text-xl font-semibold mb-2">SquadUp</h3>
                      <p className="text-green-100 mb-4">Gaming Collaboration App with real-time features</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-white/20 rounded-md text-xs">React</span>
                        <span className="px-2 py-1 bg-white/20 rounded-md text-xs">Flask</span>
                        <span className="px-2 py-1 bg-white/20 rounded-md text-xs">JWT</span>
                      </div>
                      <motion.button
                        className="flex items-center gap-2 text-sm font-medium hover:underline"
                        whileHover={{ x: 5 }}
                      >
                        View Project <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </Card3D>

              {/* CTA Section */}
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <Card3D delay={0.4}>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">Let's Build Something Amazing</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                      Ready to bring your ideas to life? I'm available for freelance projects and full-time opportunities.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <motion.button
                        className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Mail className="w-4 h-4" />
                        Start a Project
                      </motion.button>
                      <motion.button
                        className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-4 h-4" />
                        View GitHub
                      </motion.button>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}