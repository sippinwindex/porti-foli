'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gamepad2, Zap, Star } from 'lucide-react'

export default function DinoGameButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{
        duration: 0.8,
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
            scale: 1.15,
            rotate: [0, -10, 10, -5, 5, 0],
            transition: { duration: 0.6 }
          }}
          whileTap={{ scale: 0.9 }}
          className="group relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white p-4 rounded-full shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 cursor-pointer overflow-hidden"
          role="button"
          aria-label="Play Synthwave Dino Game"
        >
          {/* Animated background pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-yellow-500/20"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Main icon container */}
          <div className="relative flex items-center justify-center w-14 h-14">
            {/* Primary game controller icon */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Gamepad2 className="w-8 h-8 group-hover:animate-pulse" />
            </motion.div>
            
            {/* Small accent icons */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ 
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-4 h-4 text-yellow-300" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-1 -left-1"
              animate={{ 
                scale: [0.5, 1, 0.5],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <Star className="w-3 h-3 text-pink-300" />
            </motion.div>
          </div>
          
          {/* Tooltip */}
          <motion.div
            className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900/90 backdrop-blur-sm text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-white/20"
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Play Synthwave Runner!</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
          </motion.div>
          
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Inner sparkle effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-400/20 opacity-0 group-hover:opacity-100"
            animate={{ 
              scale: [1, 1.5],
              opacity: [0.2, 0]
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}