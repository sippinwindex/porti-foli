import { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ProjectShowcase } from '@/components/ProjectShowcase'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of web development projects including React, Next.js, and full-stack applications.',
}

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