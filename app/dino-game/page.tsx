'use client'

// Go up from 'dino-game' to 'app', then up from 'app' to the root, then find 'components'
import DinoGame from '../../components/DinoGamePage'

export default function DinoGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white flex flex-col items-center justify-center p-4">
      <DinoGame />
    </div>
  )
}