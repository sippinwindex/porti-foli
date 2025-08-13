// pages/index.tsx - NEW 3D Homepage (replaces index.mdx)
import { GetStaticProps } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { getEnhancedProjects, getPortfolioStats } from '../lib/portfolio-integration'
import GitHubIntegration from '../components/GitHubIntegration'
import { motion } from 'framer-motion'
import type { EnhancedProject, PortfolioStats } from '../lib/portfolio-integration'

// Dynamic imports for 3D components to avoid SSR issues
const Interactive3DHero = dynamic(
  () => import('../components/3D/Interactive3DHero'),
  { 
    ssr: false,
    loading: () => <HeroSkeleton />
  }
)

const ScrollTriggered3DSections = dynamic(
  () => import('../components/3D/ScrollTriggered3DSections'),
  { 
    ssr: false,
    loading: () => <SectionSkeleton />
  }
)

interface HomePageProps {
  projects: EnhancedProject[]
  stats: PortfolioStats
}

// Loading components
function HeroSkeleton() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-64 h-8 bg-white/20 rounded animate-pulse mb-4 mx-auto" />
        <div className="w-96 h-6 bg-white/10 rounded animate-pulse mb-8 mx-auto" />
        <div className="flex space-x-4 justify-center">
          <div className="w-32 h-12 bg-white/20 rounded animate-pulse" />
          <div className="w-32 h-12 bg-white/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="min-h-screen bg-slate-900/50 flex items-center justify-center">
      <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto px-6">
        <div className="h-96 bg-white/10 rounded-xl animate-pulse" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white/10 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage({ projects, stats }: HomePageProps) {
  return (
    <main className="relative overflow-hidden">
      {/* 3D Interactive Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <Interactive3DHero projects={projects.slice(0, 8)} />
      </Suspense>

      {/* Scroll-Triggered 3D Sections */}
      <Suspense fallback={<SectionSkeleton />}>
        <ScrollTriggered3DSections projects={projects} stats={stats} />
      </Suspense>

      {/* Traditional GitHub Integration Section */}
      <section className="relative py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Live GitHub Integration
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real-time data from my GitHub repositories and Vercel deployments
            </p>
          </motion.div>

          <GitHubIntegration
            initialProjects={projects.filter(p => p.featured)}
            initialStats={stats}
            showStats={true}
            showDeploymentStatus={true}
            featured={true}
            limit={6}
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Let's Build Something Amazing
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Ready to bring your ideas to life with cutting-edge web technologies and immersive experiences?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl"
              >
                <span className="relative z-10">Get In Touch</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 border-2 border-white/30 rounded-lg text-white font-semibold backdrop-blur-md hover:bg-white/10 transition-all duration-300"
              >
                <span>View Resume</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [projects, stats] = await Promise.all([
      getEnhancedProjects(),
      getPortfolioStats()
    ])

    return {
      props: { projects, stats },
      revalidate: 3600,
    }
  } catch (error) {
    console.error('Error fetching data for homepage:', error)
    return {
      props: {
        projects: [],
        stats: {
          totalProjects: 0,
          featuredProjects: 0,
          liveProjects: 0,
          totalStars: 0,
          totalForks: 0,
          languageStats: {},
          categoryStats: {},
          deploymentStats: { successful: 0, failed: 0, building: 0, pending: 0 },
          recentActivity: {
            lastCommit: new Date().toISOString(),
            lastDeployment: new Date().toISOString(),
            activeProjects: 0,
          },
        },
      },
      revalidate: 60,
    }
  }
}

// pages/portfolio.tsx - Enhanced Projects Page  
import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { getEnhancedProjects } from '../lib/portfolio-integration'
import type { EnhancedProject } from '../lib/portfolio-integration'

const EnhancedProjectShowcase = dynamic(
  () => import('../components/EnhancedProjectShowcase'),
  { ssr: false }
)

interface PortfolioPageProps {
  projects: EnhancedProject[]
}

export default function PortfolioPage({ projects }: PortfolioPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            My Portfolio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore my complete portfolio with live GitHub and Vercel integration
          </p>
        </motion.div>

        <EnhancedProjectShowcase
          initialProjects={projects}
          showFilters={true}
          showSearch={true}
          showStats={true}
          defaultView="grid"
          featuredFirst={true}
        />
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const projects = await getEnhancedProjects()
    return {
      props: { projects },
      revalidate: 1800, // 30 minutes
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return {
      props: { projects: [] },
      revalidate: 60,
    }
  }
}

// pages/experience.tsx - Enhanced About Page
import { GetStaticProps } from 'next'
import { motion } from 'framer-motion'
import { getPortfolioStats } from '../lib/portfolio-integration'
import type { PortfolioStats } from '../lib/portfolio-integration'

interface ExperiencePageProps {
  stats: PortfolioStats
}

export default function ExperiencePage({ stats }: ExperiencePageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            My Experience
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Full-Stack Developer passionate about creating immersive digital experiences
          </p>
        </motion.div>

        {/* Live Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.totalProjects}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Projects Built</div>
          </div>
          <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {stats.totalStars}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">GitHub Stars</div>
          </div>
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stats.liveProjects}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Live Projects</div>
          </div>
          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {stats.recentActivity.activeProjects}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="prose prose-lg dark:prose-invert mx-auto"
        >
          <p className="text-lg leading-relaxed">
            I'm Juan Fernandez, a passionate Full-Stack Developer with expertise in modern web technologies 
            including React, Next.js, TypeScript, and Three.js. I specialize in creating immersive digital 
            experiences that combine cutting-edge technology with exceptional user experience.
          </p>

          <p className="text-lg leading-relaxed">
            My journey in software development has led me to work on diverse projects ranging from 
            healthcare dashboards to e-commerce platforms, always focusing on performance, accessibility, 
            and user engagement.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">What I Do</h2>
          <div className="grid md:grid-cols-2 gap-6 not-prose">
            {[
              'Full-Stack Web Development with React, Next.js, and Node.js',
              '3D Web Experiences using Three.js and WebGL',
              'Mobile-First Responsive Design',
              'API Development and Integration',
              'Performance Optimization and SEO',
              'Cloud Deployment with Vercel and AWS'
            ].map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-gray-700 dark:text-gray-300">{skill}</span>
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mt-12 mb-6">My Approach</h2>
          <p className="text-lg leading-relaxed">
            I believe in building applications that not only function flawlessly but also provide 
            memorable user experiences. My approach combines technical excellence with creative 
            problem-solving, ensuring every project delivers real value to users and businesses.
          </p>

          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Currently Working On</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Exploring the intersection of 3D web experiences and practical business applications, 
              with a focus on WebGL optimization and interactive storytelling through code.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const stats = await getPortfolioStats()
    return {
      props: { stats },
      revalidate: 3600,
    }
  } catch (error) {
    console.error('Error fetching stats for experience page:', error)
    return {
      props: {
        stats: {
          totalProjects: 0,
          featuredProjects: 0,
          liveProjects: 0,
          totalStars: 0,
          totalForks: 0,
          languageStats: {},
          categoryStats: {},
          deploymentStats: { successful: 0, failed: 0, building: 0, pending: 0 },
          recentActivity: {
            lastCommit: new Date().toISOString(),
            lastDeployment: new Date().toISOString(),
            activeProjects: 0,
          },
        },
      },
      revalidate: 60,
    }
  }
}