'use client'

// app/page.tsx - Fixed with 'use client' directive
import { Suspense } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ScrollTriggered3DSections from '@/components/3D/ScrollTriggered3DSections'
import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, ExternalLink, Download, ArrowRight, Code, Palette, Database, Globe } from 'lucide-react'

// Enhanced loading component with better animation
function SectionLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 border-r-4 border-r-transparent"></div>
        <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-2 border-blue-300 opacity-30"></div>
      </div>
    </div>
  )
}

// Enhanced skill data with icons
const skills = [
  { name: 'React/Next.js', icon: Code, color: 'from-blue-500 to-cyan-500' },
  { name: 'TypeScript', icon: Code, color: 'from-blue-600 to-indigo-600' },
  { name: 'Python/Flask', icon: Database, color: 'from-green-500 to-emerald-500' },
  { name: 'PostgreSQL', icon: Database, color: 'from-blue-700 to-blue-800' },
  { name: 'Tailwind CSS', icon: Palette, color: 'from-cyan-500 to-blue-500' },
  { name: 'Three.js', icon: Globe, color: 'from-purple-500 to-pink-500' },
  { name: 'AWS/Azure', icon: Globe, color: 'from-orange-500 to-red-500' },
  { name: 'UI/UX Design', icon: Palette, color: 'from-pink-500 to-rose-500' }
]

// Enhanced project data
const projects = [
  {
    title: 'Portfolio Website',
    description: 'Modern 3D portfolio with Three.js, featuring interactive animations and real-time GitHub integration.',
    tech: ['Next.js', 'Three.js', 'TypeScript'],
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    delay: 0
  },
  {
    title: 'GameGraft',
    description: 'Game discovery app with real-time API integration and dynamic user interfaces.',
    tech: ['React', 'Flask', 'PostgreSQL'],
    gradient: 'from-green-500 via-teal-500 to-cyan-500',
    delay: 0.1
  },
  {
    title: 'SquadUp',
    description: 'Gaming collaboration app with real-time features and live voting system using SSE.',
    tech: ['React', 'Flask', 'JWT'],
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    delay: 0.2
  }
]

// Enhanced contact options
const contactOptions = [
  {
    icon: Mail,
    title: 'Email',
    description: 'jafernandez94@gmail.com',
    href: 'mailto:jafernandez94@gmail.com',
    color: 'from-blue-500 to-indigo-600',
    delay: 0
  },
  {
    icon: Linkedin,
    title: 'LinkedIn',
    description: 'Connect with me',
    href: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
    color: 'from-blue-600 to-blue-700',
    delay: 0.1
  },
  {
    icon: Github,
    title: 'GitHub',
    description: 'View my code',
    href: 'https://github.com/sippinwindex',
    color: 'from-gray-700 to-gray-900',
    delay: 0.2
  }
]

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Navigation */}
      <Navigation />
      
      {/* Main Content Container */}
      <div className="relative">
        {/* Hero Section - Enhanced with better layout */}
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 opacity-50"></div>
          
          <Suspense fallback={<SectionLoading />}>
            <ScrollTriggered3DSections />
          </Suspense>

          {/* Hero content overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Juan A. Fernandez
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Full-Stack Developer & UI/UX Designer
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Get In Touch
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/resume.pdf"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white rounded-full font-semibold border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* About Section - Enhanced with better visuals */}
        <section id="about" className="relative min-h-screen py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.h2 
                  variants={fadeInUp}
                  className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8"
                >
                  About Me
                </motion.h2>
                <motion.div 
                  variants={fadeInUp}
                  className="prose prose-lg dark:prose-invert max-w-4xl mx-auto"
                >
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Hi, I'm Juan A. Fernandez, a Full-Stack Developer based in Miami, Florida. 
                    With a strong foundation in software development and UI/UX design, I blend 
                    analytical precision from my background as a healthcare data analyst with 
                    creative, user-centered design from UX research.
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    I'm passionate about creating seamless digital experiences that prioritize 
                    accessibility and performance. I have hands-on experience developing applications 
                    that integrate real-time APIs, authentication systems, and dynamic interfaces.
                  </p>
                </motion.div>
              </motion.div>
                
              {/* Enhanced Skills Grid with icons and animations */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {skills.map((skill, index) => {
                  const IconComponent = skill.icon
                  return (
                    <motion.div
                      key={skill.name}
                      variants={{
                        initial: { opacity: 0, scale: 0.8, y: 20 },
                        animate: { opacity: 1, scale: 1, y: 0 }
                      }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      <div className="relative z-10">
                        <IconComponent className="w-8 h-8 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                          {skill.name}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section - Enhanced with better animations */}
        <section id="projects" className="relative min-h-screen py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-blue-900 dark:to-indigo-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                  Featured Projects
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Here are some of my recent projects showcasing my skills in full-stack development, 
                  UI/UX design, and modern web technologies.
                </p>
              </motion.div>

              {/* Enhanced Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: project.delay }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((tech) => (
                          <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-3 transition-all">
                        <span>View Project</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced View All Projects Button */}
              <div className="text-center">
                <motion.a
                  href="/projects"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-xl"
                >
                  View All Projects
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Enhanced with better layout */}
        <section id="contact" className="relative min-h-screen py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                  Let's Build Something Amazing
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Ready to bring your ideas to life? I'm available for freelance projects 
                  and full-time opportunities. Let's create something extraordinary together.
                </p>
              </motion.div>

              {/* Enhanced Contact Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {contactOptions.map((contact, index) => {
                  const IconComponent = contact.icon
                  return (
                    <motion.a
                      key={contact.title}
                      href={contact.href}
                      target={contact.href.startsWith('http') ? '_blank' : undefined}
                      rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: contact.delay }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-gray-200 dark:border-gray-600 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${contact.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      <div className="relative z-10 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
                            <IconComponent className="w-8 h-8 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {contact.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {contact.description}
                        </p>
                      </div>
                    </motion.a>
                  )
                })}
              </div>

              {/* Enhanced CTA Button */}
              <div className="text-center">
                <motion.a
                  href="mailto:jafernandez94@gmail.com"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center gap-2 px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-2xl"
                >
                  Start a Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}