// components/DinoGameButton.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gamepad2, Rocket } from 'lucide-react'

export default function DinoGameButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: 2,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link href="/dinosaur" className="block">
        <motion.div
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -10, 10, -10, 0],
            transition: { duration: 0.5 }
          }}
          whileTap={{ scale: 0.9 }}
          className="group relative bg-gradient-to-r from-cyan-500 via-blue-500 to-magenta-500 hover:from-cyan-400 hover:via-blue-400 hover:to-magenta-400 text-white p-4 rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer"
          role="button"
          aria-label="Play Synthwave Dino Game"
        >
          <div className="relative flex items-center justify-center">
            <Rocket className="w-6 h-6 group-hover:animate-bounce" />
            <Gamepad2 className="w-3 h-3 absolute -top-1 -right-1 opacity-75" />
          </div>
          
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Play Synthwave Dino! 🎮
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>

          <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 animate-ping pointer-events-none"></div>
        </motion.div>
      </Link>
    </motion.div>
  )
}