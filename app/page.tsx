'use client'

import Navigation from '@/components/Navigation'
import DinoGameButton from '@/components/DinoGameButton'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Download, ArrowRight, Code, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="pt-16"> {/* Add padding-top to account for fixed navigation */}
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-viva-magenta-600 via-lux-gold-500 to-viva-magenta-600 bg-clip-text text-transparent">
                    Juan Fernandez
                  </span>
                </h1>
                <h2 className="text-2xl md:text-3xl text-muted-foreground mb-8">
                  Full Stack Developer & Digital Innovator
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Crafting exceptional digital experiences with React, Next.js, and modern web technologies. 
                  Passionate about clean code, user experience, and innovative solutions.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/projects"
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Code className="w-5 h-5" />
                    View My Work
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-8 py-4 border-2 border-viva-magenta-500 text-viva-magenta-600 dark:text-viva-magenta-400 rounded-lg font-semibold hover:bg-viva-magenta-50 dark:hover:bg-viva-magenta-900/20 transition-all duration-300"
                  >
                    Let's Connect
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Preview Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">About Me</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  With over 5 years of experience in full-stack development, I specialize in creating 
                  scalable web applications that deliver exceptional user experiences. I'm passionate 
                  about modern technologies and always eager to tackle new challenges.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 glass rounded-xl border border-border"
                >
                  <Code className="w-12 h-12 mx-auto mb-4 text-viva-magenta-600" />
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Frontend</h3>
                  <p className="text-muted-foreground">React, Next.js, TypeScript, Tailwind CSS</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center p-6 glass rounded-xl border border-border"
                >
                  <Zap className="w-12 h-12 mx-auto mb-4 text-viva-magenta-600" />
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Backend</h3>
                  <p className="text-muted-foreground">Node.js, PostgreSQL, MongoDB, APIs</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center p-6 glass rounded-xl border border-border"
                >
                  <Users className="w-12 h-12 mx-auto mb-4 text-viva-magenta-600" />
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Collaboration</h3>
                  <p className="text-muted-foreground">Git, Docker, Agile, Code Reviews</p>
                </motion.div>
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Learn More About Me
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Featured Projects</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A selection of projects that showcase my skills in full-stack development, 
                  fetched live from GitHub and Vercel.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {/* Project cards will be populated by your existing hooks */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="glass rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-border"
                >
                  <div className="h-48 bg-gradient-to-br from-viva-magenta-500/20 to-lux-gold-500/20 flex items-center justify-center">
                    <Code className="w-16 h-16 text-viva-magenta-400" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Portfolio Website</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Modern portfolio website built with Next.js 14, TypeScript, and Framer Motion
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-viva-magenta-100 dark:bg-viva-magenta-900/30 text-viva-magenta-700 dark:text-viva-magenta-300 text-xs rounded">Next.js</span>
                      <span className="px-2 py-1 bg-viva-magenta-100 dark:bg-viva-magenta-900/30 text-viva-magenta-700 dark:text-viva-magenta-300 text-xs rounded">TypeScript</span>
                      <span className="px-2 py-1 bg-viva-magenta-100 dark:bg-viva-magenta-900/30 text-viva-magenta-700 dark:text-viva-magenta-300 text-xs rounded">Tailwind</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <a href="#" className="p-2 bg-muted rounded-full hover:bg-muted/80">
                          <Github className="w-4 h-4" />
                        </a>
                        <a href="#" className="p-2 bg-muted rounded-full hover:bg-muted/80">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Placeholder for more projects */}
                <div className="md:col-span-2 lg:col-span-2 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">More projects loading from GitHub...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-viva-magenta-600 mx-auto"></div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Ready to Work Together?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  I'm always interested in new opportunities and exciting projects. 
                  Let's discuss how we can bring your ideas to life.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-viva-magenta-600 to-lux-gold-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Get In Touch
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-4 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Fixed Footer */}
      <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-viva-magenta-600 to-lux-gold-600 flex items-center justify-center font-bold text-white text-sm">
                JF
              </div>
              <span className="font-bold text-foreground">Juan Fernandez</span>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/sippinwindex"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-viva-magenta-50 dark:hover:bg-viva-magenta-900/20 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/juan-fernandez-fullstack/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-viva-magenta-50 dark:hover:bg-viva-magenta-900/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Juan Fernandez. Full Stack Developer passionate about creating exceptional digital experiences.</p>
          </div>
        </div>
      </footer>

      <DinoGameButton />
    </>
  )
}