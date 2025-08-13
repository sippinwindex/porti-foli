'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Calendar, Code, Zap } from 'lucide-react'
import Link from 'next/link'

// Mock project data - you'll replace this with real data later
const projects = [
  {
    id: 'ecommerce-suite',
    title: 'E-Commerce Suite',
    description: 'Full-stack e-commerce platform with React, Node.js, and Stripe integration.',
    longDescription: 'A comprehensive e-commerce solution featuring user authentication, product management, shopping cart, payment processing, and admin dashboard.',
    image: '/projects/ecommerce.jpg',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'TypeScript'],
    githubUrl: 'https://github.com/sippinwindex/ecommerce-suite',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    featured: true,
    status: 'completed',
    startDate: '2024-01-15',
    category: 'fullstack',
  },
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'Modern portfolio website built with Next.js 14, TypeScript, and Framer Motion.',
    longDescription: 'A responsive portfolio website showcasing projects and skills with smooth animations and dark mode support.',
    image: '/projects/portfolio.jpg',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/sippinwindex/portfolio',
    liveUrl: 'https://juan-fernandez.dev',
    featured: true,
    status: 'completed',
    startDate: '2024-03-01',
    category: 'web',
  },
  {
    id: 'task-manager',
    title: 'Task Manager App',
    description: 'Collaborative task management application with real-time updates.',
    longDescription: 'A productivity app with drag-and-drop functionality, real-time collaboration, and team management features.',
    image: '/projects/taskmanager.jpg',
    tags: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
    githubUrl: 'https://github.com/sippinwindex/task-manager',
    liveUrl: 'https://taskmanager-demo.vercel.app',
    featured: false,
    status: 'completed',
    startDate: '2023-11-20',
    category: 'fullstack',
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    description: 'Beautiful weather dashboard with location-based forecasts and interactive maps.',
    longDescription: 'A responsive weather application featuring current conditions, 7-day forecasts, and interactive weather maps.',
    image: '/projects/weather.jpg',
    tags: ['React', 'OpenWeather API', 'Mapbox', 'Chart.js'],
    githubUrl: 'https://github.com/sippinwindex/weather-dashboard',
    liveUrl: 'https://weather-dashboard-demo.vercel.app',
    featured: false,
    status: 'completed',
    startDate: '2023-09-10',
    category: 'web',
  },
]

const categories = ['all', 'web', 'fullstack', 'mobile', 'api']

export function ProjectShowcase() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
      >
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Project Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center">
              {/* Placeholder for project image */}
              <div className="text-6xl opacity-50">
                {project.category === 'fullstack' ? <Zap /> : <Code />}
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'completed' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {project.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>

              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Project Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(project.startDate).getFullYear()}
                </div>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                    +{project.tags.length - 4}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Code
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found in this category.</p>
        </div>
      )}
    </div>
  )
}