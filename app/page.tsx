'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import DinoGameButton from '@/components/DinoGameButton'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Download, ArrowRight, Code, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
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
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Code className="w-5 h-5" />
                    View My Work
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-8 py-4 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
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
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
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
                  className="text-center p-6 bg-card border border-border rounded-xl"
                >
                  <Code className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Frontend</h3>
                  <p className="text-muted-foreground">React, Next.js, TypeScript, Tailwind CSS</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-card border border-border rounded-xl"
                >
                  <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Backend</h3>
                  <p className="text-muted-foreground">Node.js, PostgreSQL, MongoDB, APIs</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center p-6 bg-card border border-border rounded-xl"
                >
                  <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Projects</h2>
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
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Code className="w-16 h-16 text-primary/40" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Portfolio Website</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Modern portfolio website built with Next.js 14, TypeScript, and Framer Motion
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Next.js</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">TypeScript</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Tailwind</span>
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
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
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work Together?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  I'm always interested in new opportunities and exciting projects. 
                  Let's discuss how we can bring your ideas to life.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
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
      <Footer />
      <DinoGameButton />
    </>
  )
}