'use client'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Github, ExternalLink, Calendar, Code, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// FIX: Define a type for the project structure to ensure type safety
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  status: string;
  startDate: string;
  endDate?: string;
  category: string;
  challenges: string[];
  learnings: string[];
  metrics: { label: string; value: string }[];
}

// Mock project data - typed for consistency
const projects: Record<string, Project> = {
  'ecommerce-suite': {
    id: 'ecommerce-suite',
    title: 'E-Commerce Suite',
    description: 'Full-stack e-commerce platform with React, Node.js, and Stripe integration.',
    longDescription: 'A comprehensive e-commerce solution featuring user authentication, product management, shopping cart, payment processing, and admin dashboard. Built with modern technologies and best practices for scalability and performance.',
    image: '/projects/ecommerce.jpg',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'TypeScript'],
    githubUrl: 'https://github.com/sippinwindex/ecommerce-suite',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    featured: true,
    status: 'completed',
    startDate: '2024-01-15',
    endDate: '2024-03-20',
    category: 'fullstack',
    challenges: [
      'Implementing secure payment processing with Stripe',
      'Building a scalable product catalog system',
      'Creating an intuitive admin dashboard'
    ],
    learnings: [
      'Advanced React patterns and state management',
      'Payment gateway integration best practices',
      'Database optimization for e-commerce'
    ],
    metrics: [
      { label: 'Page Load Time', value: '< 2s' },
      { label: 'Test Coverage', value: '95%' },
      { label: 'Performance Score', value: '98/100' }
    ]
  },
  'portfolio-website': {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'Modern portfolio website built with Next.js 14, TypeScript, and Framer Motion.',
    longDescription: 'A responsive portfolio website showcasing projects and skills with smooth animations, dark mode support, and optimized performance. Features dynamic GitHub integration and modern design patterns.',
    image: '/projects/portfolio.jpg',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/sippinwindex/portfolio',
    liveUrl: 'https://juan-fernandez.dev',
    featured: true,
    status: 'completed',
    startDate: '2024-03-01',
    category: 'web',
    challenges: [
      'Creating smooth animations without performance impact',
      'Implementing dynamic theme switching',
      'Optimizing for Core Web Vitals'
    ],
    learnings: [
      'Advanced Framer Motion techniques',
      'Next.js 14 App Router patterns',
      'Performance optimization strategies'
    ],
    metrics: [
      { label: 'Lighthouse Score', value: '100/100' },
      { label: 'Core Web Vitals', value: 'Passed' },
      { label: 'Accessibility', value: '100/100' }
    ]
  }
}

type Props = {
  params: { slug: string }
}

export default function ProjectPage({ params }: Props) {
  const [mounted, setMounted] = useState(false)
  const project = projects[params.slug]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!project) {
    notFound()
  }

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 dark:bg-gray-800"></div>
          <div className="pt-16 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-lux-offwhite to-lux-gray-100 dark:from-lux-black dark:to-lux-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'completed' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {project.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-lux-gray-900 dark:text-lux-offwhite">
                {project.title}
              </h1>
              <p className="text-xl text-lux-gray-600 dark:text-lux-gray-300 mb-8 max-w-2xl mx-auto">
                {project.description}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-lux-gray-300 dark:border-lux-gray-700 rounded-lg hover:bg-lux-gray-100 dark:hover:bg-lux-gray-800 transition-colors text-lux-gray-900 dark:text-lux-offwhite"
                >
                  <Github className="w-5 h-5" />
                  View Code
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-viva-magenta text-lux-offwhite rounded-lg hover:bg-viva-magenta/90 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Live Demo
                </a>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-lux-gray-200 dark:bg-lux-gray-800 text-lux-gray-700 dark:text-lux-gray-300 text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-16 bg-lux-offwhite dark:bg-lux-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {/* Project Info */}
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-semibold mb-4 text-lux-gray-900 dark:text-lux-offwhite">
                    About This Project
                  </h2>
                  <p className="text-lux-gray-600 dark:text-lux-gray-300 mb-6 leading-relaxed">
                    {project.longDescription}
                  </p>

                  {project.challenges && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-lux-gray-900 dark:text-lux-offwhite">
                        Key Challenges
                      </h3>
                      <ul className="space-y-2">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-viva-magenta mt-1 flex-shrink-0" />
                            <span className="text-lux-gray-600 dark:text-lux-gray-300">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.learnings && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-lux-gray-900 dark:text-lux-offwhite">
                        Key Learnings
                      </h3>
                      <ul className="space-y-2">
                        {project.learnings.map((learning, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Code className="w-4 h-4 text-viva-magenta mt-1 flex-shrink-0" />
                            <span className="text-lux-gray-600 dark:text-lux-gray-300">{learning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Project Stats */}
                  <div className="bg-lux-offwhite dark:bg-lux-gray-800 border border-lux-gray-300 dark:border-lux-gray-700 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 text-lux-gray-900 dark:text-lux-offwhite">
                      Project Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-lux-gray-500 dark:text-lux-gray-400" />
                        <span className="text-lux-gray-600 dark:text-lux-gray-300">
                          {new Date(project.startDate).toLocaleDateString()}
                          {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-lux-gray-500 dark:text-lux-gray-400" />
                        <span className="text-lux-gray-600 dark:text-lux-gray-300">Solo Project</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Code className="w-4 h-4 text-lux-gray-500 dark:text-lux-gray-400" />
                        <span className="text-lux-gray-600 dark:text-lux-gray-300 capitalize">{project.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  {project.metrics && (
                    <div className="bg-lux-offwhite dark:bg-lux-gray-800 border border-lux-gray-300 dark:border-lux-gray-700 rounded-lg p-6">
                      <h3 className="font-semibold mb-4 text-lux-gray-900 dark:text-lux-offwhite">
                        Performance
                      </h3>
                      <div className="space-y-3">
                        {project.metrics.map((metric, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-lux-gray-600 dark:text-lux-gray-300">{metric.label}</span>
                            <span className="text-sm font-medium text-lux-gray-900 dark:text-lux-offwhite">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Back to Projects */}
              <div className="text-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-lux-gray-300 dark:border-lux-gray-700 rounded-lg hover:bg-lux-gray-100 dark:hover:bg-lux-gray-800 transition-colors text-lux-gray-900 dark:text-lux-offwhite"
                >
                  ← Back to Projects
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({
    slug,
  }))
}