import { Navigation } from '@/components/Navigation'
import { AnimatedHero } from '@/components/AnimatedHero'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <AnimatedHero />
      </main>
      <Footer />
    </>
  )
}