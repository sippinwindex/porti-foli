'use client'

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, Github, Filter, Grid, List } from 'lucide-react'

// Mock Data for the showcase
const projects = [
  {
    id: 'ecommerce-suite',
    title: 'E-Commerce Suite',
    description: 'Full-stack e-commerce platform with React, Node.js, and Stripe integration.',
    image: '/projects/ecommerce.jpg',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'TypeScript'],
    githubUrl: 'https://github.com/sippinwindex/ecommerce-suite',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    featured: true
  },
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'Modern portfolio website built with Next.js 14, TypeScript, and Framer Motion.',
    image: '/projects/portfolio.jpg',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/sippinwindex/portfolio',
    liveUrl: 'https://juan-fernandez.dev',
    featured: true
  },
  {
    id: 'dino-game',
    title: 'Synthwave Dino Game',
    description: 'A retro-style endless runner game with a synthwave aesthetic, built with React.',
    image: '/projects/dino-game.jpg',
    tags: ['React', 'TypeScript', 'Framer Motion', 'Web Audio API'],
    githubUrl: 'https://github.com/sippinwindex/portfolio',
    liveUrl: '/dinosaur',
    featured: false
  },
]

const allTags = ['All', 'React', 'Next.js', 'Node.js', 'TypeScript', 'Framer Motion', 'Web Audio API']

// Define the showcase component here
function ProjectShowcase() {
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [activeTag, setActiveTag] = useState('All')
  const [viewMode, setViewMode] = useState('grid')

  const handleTagClick = (tag: string) => {
    setActiveTag(tag)
    if (tag === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => project.tags.includes(tag)))
    }
  }

  return (
    <div>
      {/* Filters and View Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
          <Filter className="w-5 h-5 mr-2 text-muted-foreground" />
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Projects Grid/List */}
      <motion.div
        layout
        className={`grid gap-8 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group ${
                viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative ${viewMode === 'list' ? 'sm:w-1/3' : 'h-56'}`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-muted rounded-full hover:bg-muted/80"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-muted rounded-full hover:bg-muted/80"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// Define the main page component
export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold mb-4">My Projects</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A collection of projects that showcase my skills in full-stack development, 
                UI/UX design, and modern web technologies.
              </p>
            </div>
            <ProjectShowcase />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}