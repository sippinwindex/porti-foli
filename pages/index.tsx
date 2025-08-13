// pages/index.tsx - NEW 3D Homepage
import { GetStaticProps } from 'next'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { getEnhancedProjects, getPortfolioStats } from '../lib/portfolio-integration'
// import GitHubIntegration from '../components/GitHubIntegration' // We will define a placeholder below
import { motion } from 'framer-motion'
import type { EnhancedProject, PortfolioStats } from '../lib/portfolio-integration'

// --- FIX: Placeholder for the GitHubIntegration component ---
// You should move this interface and component definition to '/components/GitHubIntegration.tsx'

interface GitHubIntegrationProps {
  initialProjects: EnhancedProject[];
  initialStats: PortfolioStats;
  showStats: boolean;
  showDeploymentStatus: boolean;
  featured: boolean;
  limit: number;
}

// This is a temporary placeholder to make the page type-check correctly.
// Replace the content with your actual component logic in the correct file.
const GitHubIntegration = ({ initialProjects, initialStats, limit }: GitHubIntegrationProps) => {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Projects</h3>
      <ul>
        {initialProjects.slice(0, limit).map(project => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
      <h3 className="text-2xl font-bold mt-8 mb-4">Stats</h3>
      <p>Total Stars: {initialStats.totalStars}</p>
      <p>Total Projects: {initialStats.totalProjects}</p>
    </div>
  );
};
// --- End of Placeholder ---


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
  const heroProjects = projects.slice(0, 8).map(p => ({
    ...p,
    title: p.name,
  }));

  return (
    <main className="relative overflow-hidden">
      {/* 3D Interactive Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <Interactive3DHero projects={heroProjects} />
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

          {/* This component call is now type-safe because of the placeholder above */}
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

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
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