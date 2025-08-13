import { Metadata } from 'next'
// FIX: Changed to default imports for Navigation and Footer
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Juan Fernandez - Full Stack Developer passionate about creating exceptional digital experiences.',
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">About Me</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                Hi, I'm Juan Fernandez, a passionate Full Stack Developer with over 5 years of experience 
                creating exceptional digital experiences. I specialize in modern web technologies including 
                React, Next.js, TypeScript, and Node.js.
              </p>
              
              <p>
                My journey in software development started with a curiosity about how things work on the web. 
                This curiosity has grown into a deep passion for building scalable, user-friendly applications 
                that solve real-world problems.
              </p>

              <h2>Technical Skills</h2>
              <ul>
                <li><strong>Frontend:</strong> React, Next.js, TypeScript, Tailwind CSS, Framer Motion</li>
                <li><strong>Backend:</strong> Node.js, Express, PostgreSQL, MongoDB</li>
                <li><strong>DevOps:</strong> Docker, AWS, Vercel, GitHub Actions</li>
                <li><strong>Tools:</strong> Git, VS Code, Figma, Linear</li>
              </ul>

              <h2>What I Do</h2>
              <p>
                I focus on creating seamless user experiences by bridging the gap between design and 
                development. Whether it's building a complex web application or optimizing performance, 
                I approach every project with attention to detail and a commitment to quality.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}