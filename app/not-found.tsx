'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft, RotateCcw, Heart, Zap } from 'lucide-react'

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const dinoRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [clickCount, setClickCount] = useState(0)
  const [isDancing, setIsDancing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Motion values for smooth mouse following
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Spring animations for natural movement
  const dinoX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const dinoY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  
  // Transform mouse position to rotation
  const rotateX = useTransform(dinoY, [-300, 300], [15, -15])
  const rotateY = useTransform(dinoX, [-300, 300], [-25, 25])
  const scale = useTransform(dinoX, [-300, 300], [0.8, 1.2])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        
        setMousePosition({ x, y })
        mouseX.set(x * 0.1)
        mouseY.set(y * 0.1)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (containerRef.current && touch) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = touch.clientX - rect.left - rect.width / 2
        const y = touch.clientY - rect.top - rect.height / 2
        
        setMousePosition({ x, y })
        mouseX.set(x * 0.1)
        mouseY.set(y * 0.1)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [mouseX, mouseY])

  // Handle dinosaur clicks
  const handleDinoClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    
    if (newCount >= 5) {
      setIsDancing(true)
      setTimeout(() => {
        setIsDancing(false)
        setClickCount(0)
      }, 3000)
    }
  }

  // Retro grid background
  const GridBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Perspective Grid */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            linear-gradient(90deg, #ff00ff 1px, transparent 1px),
            linear-gradient(180deg, #00ffff 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(600px) rotateX(45deg)',
          transformOrigin: 'bottom center'
        }}
      />
      
      {/* Vertical Lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`vertical-${i}`}
          className="absolute w-px bg-gradient-to-b from-cyan-500 via-magenta-500 to-transparent"
          style={{
            left: `${i * 5}%`,
            height: '100%',
            filter: 'brightness(0.8)'
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
      
      {/* Horizontal Scanning Lines */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-2"
        animate={{
          y: ['0%', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )

  // Floating retro particles
  const RetroParticles = () => (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        >
          <div 
            className="w-2 h-2 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full"
            style={{
              filter: 'drop-shadow(0 0 8px currentColor)',
              imageRendering: 'pixelated'
            }}
          />
        </motion.div>
      ))}
    </div>
  )

  // Glitch text effect
  const GlitchText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative z-10"
        animate={{
          textShadow: [
            '0 0 10px #ff00ff, 0 0 20px #00ffff, 0 0 30px #ffff00',
            '0 0 15px #00ffff, 0 0 25px #ff00ff, 0 0 35px #ffff00',
            '0 0 10px #ff00ff, 0 0 20px #00ffff, 0 0 30px #ffff00'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
      
      {/* Glitch layers */}
      <motion.div
        className="absolute inset-0 text-red-500 opacity-70"
        animate={{
          x: [-2, 2, -1, 1, 0],
          y: [0, -1, 1, 0, 1]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {children}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 text-cyan-500 opacity-70"
        animate={{
          x: [2, -2, 1, -1, 0],
          y: [1, 0, -1, 0, -1]
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        {children}
      </motion.div>
    </div>
  )

  return (
    <div 
      ref={containerRef}
      className="min-h-screen overflow-hidden relative"
      style={{
        background: `
          radial-gradient(ellipse at top, rgba(255, 0, 255, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(0, 255, 255, 0.3) 0%, transparent 50%),
          linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%)
        `,
        filter: 'contrast(1.2) saturate(1.5)',
        imageRendering: 'pixelated'
      }}
    >
      {/* Retro Grid Background */}
      <GridBackground />
      
      {/* Retro Particles */}
      <RetroParticles />
      
      {/* Scanline Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 255, 0.1) 2px,
              rgba(0, 255, 255, 0.1) 4px
            )
          `
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        
        {/* Glitch 404 Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-8"
        >
          <GlitchText className="text-8xl md:text-9xl font-black bg-gradient-to-r from-pink-500 via-cyan-500 to-yellow-500 bg-clip-text text-transparent">
            404
          </GlitchText>
        </motion.div>

        {/* Synthwave Dinosaur */}
        <motion.div
          ref={dinoRef}
          className="relative cursor-pointer mb-8"
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: 'preserve-3d'
          }}
          onClick={handleDinoClick}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Dinosaur Body with Synthwave Filter */}
          <motion.div
            className="relative w-48 h-48 md:w-64 md:h-64"
            animate={isDancing ? {
              rotate: [0, 10, -10, 5, -5, 0],
              scale: [1, 1.1, 0.9, 1.05, 0.95, 1]
            } : {}}
            transition={{
              duration: 0.6,
              repeat: isDancing ? Infinity : 0
            }}
            style={{
              filter: `
                contrast(1.3) 
                saturate(2) 
                hue-rotate(${mousePosition.x * 0.2}deg) 
                drop-shadow(0 0 20px rgba(255, 0, 255, 0.7))
                drop-shadow(0 0 30px rgba(0, 255, 255, 0.5))
              `,
              imageRendering: 'pixelated'
            }}
          >
            {/* Main Body */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 rounded-3xl border-4 border-white/30">
              {/* Pixel Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `
                    repeating-conic-gradient(
                      from 0deg at 50% 50%,
                      #ff00ff 0deg 90deg,
                      #00ffff 90deg 180deg,
                      #ffff00 180deg 270deg,
                      #ff00ff 270deg 360deg
                    )
                  `,
                  backgroundSize: '8px 8px'
                }}
              />
            </div>

            {/* Head */}
            <motion.div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-cyan-400 via-pink-500 to-yellow-400 rounded-full border-4 border-white/40"
              animate={isHovered ? { y: [-2, 2, -2] } : {}}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
              style={{
                filter: 'drop-shadow(0 0 15px rgba(255, 0, 255, 0.8))'
              }}
            >
              {/* Eyes with Mouse Tracking */}
              <motion.div 
                className="absolute top-3 left-2 w-3 h-3 bg-white rounded-full"
                animate={{
                  x: mousePosition.x * 0.01,
                  y: mousePosition.y * 0.01
                }}
              >
                <div className="w-2 h-2 bg-black rounded-full mt-0.5 ml-0.5" />
              </motion.div>
              <motion.div 
                className="absolute top-3 right-2 w-3 h-3 bg-white rounded-full"
                animate={{
                  x: mousePosition.x * 0.01,
                  y: mousePosition.y * 0.01
                }}
              >
                <div className="w-2 h-2 bg-black rounded-full mt-0.5 ml-0.5" />
              </motion.div>

              {/* Blush - Neon Style */}
              <div className="absolute top-6 left-0 w-2 h-2 bg-pink-500 rounded-full opacity-80" 
                   style={{ filter: 'blur(1px) drop-shadow(0 0 4px #ff00ff)' }} />
              <div className="absolute top-6 right-0 w-2 h-2 bg-pink-500 rounded-full opacity-80" 
                   style={{ filter: 'blur(1px) drop-shadow(0 0 4px #ff00ff)' }} />

              {/* Smile */}
              <motion.div 
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-white rounded-full"
                animate={isDancing ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3, repeat: isDancing ? Infinity : 0 }}
              />
            </motion.div>

            {/* Arms */}
            <motion.div 
              className="absolute top-12 left-2 w-4 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"
              animate={isDancing ? { rotate: [0, 45, -45, 0] } : { rotate: [0, 10, 0] }}
              transition={{ duration: isDancing ? 0.4 : 2, repeat: Infinity }}
              style={{ filter: 'drop-shadow(0 0 8px #ff00ff)' }}
            />
            <motion.div 
              className="absolute top-12 right-2 w-4 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full"
              animate={isDancing ? { rotate: [0, -45, 45, 0] } : { rotate: [0, -10, 0] }}
              transition={{ duration: isDancing ? 0.4 : 2, repeat: Infinity, delay: 0.1 }}
              style={{ filter: 'drop-shadow(0 0 8px #ff00ff)' }}
            />

            {/* Legs */}
            <motion.div 
              className="absolute bottom-0 left-4 w-3 h-6 bg-gradient-to-b from-pink-500 to-yellow-500 rounded-full"
              animate={isDancing ? { scaleY: [1, 0.8, 1] } : {}}
              transition={{ duration: 0.3, repeat: isDancing ? Infinity : 0 }}
              style={{ filter: 'drop-shadow(0 0 6px #00ffff)' }}
            />
            <motion.div 
              className="absolute bottom-0 right-4 w-3 h-6 bg-gradient-to-b from-pink-500 to-yellow-500 rounded-full"
              animate={isDancing ? { scaleY: [1, 0.8, 1] } : {}}
              transition={{ duration: 0.3, repeat: isDancing ? Infinity : 0, delay: 0.15 }}
              style={{ filter: 'drop-shadow(0 0 6px #00ffff)' }}
            />

            {/* Tail */}
            <motion.div 
              className="absolute bottom-16 right-0 w-2 h-8 bg-gradient-to-t from-cyan-500 to-pink-500 rounded-full transform rotate-45"
              animate={{ rotate: [35, 55, 35] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ filter: 'drop-shadow(0 0 8px #ffff00)' }}
            />

            {/* Dance Hearts */}
            {isDancing && Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`heart-${i}`}
                className="absolute"
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, -50],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity
                }}
                style={{
                  left: '50%',
                  top: '20%',
                }}
              >
                <Heart 
                  className="w-4 h-4 text-pink-500" 
                  style={{ 
                    filter: 'drop-shadow(0 0 8px #ff00ff) drop-shadow(0 0 12px #00ffff)',
                    fill: 'currentColor'
                  }} 
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Neon Glow Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              background: `
                linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff) border-box
              `,
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              filter: 'blur(2px)'
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 4, repeat: Infinity, ease: "linear" }
            }}
          />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center mb-8"
        >
          <GlitchText className="text-2xl md:text-3xl font-bold text-white mb-4">
            SYSTEM ERROR: PAGE NOT FOUND
          </GlitchText>
          <motion.p 
            className="text-cyan-300 text-lg max-w-md mx-auto leading-relaxed"
            style={{
              filter: 'drop-shadow(0 0 4px #00ffff)',
              fontFamily: 'monospace'
            }}
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            The page you're looking for has been consumed by the retro void. 
            Click the dino to make it dance! ({clickCount}/5)
          </motion.p>
        </motion.div>

        {/* Retro Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/">
            <motion.button
              className="group relative px-8 py-3 font-bold text-black bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-500 rounded-lg overflow-hidden border-2 border-white/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.7))',
                imageRendering: 'pixelated'
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Home className="w-5 h-5" />
                RETURN HOME
              </span>
              
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-pink-500 to-cyan-400"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>

          <motion.button
            onClick={() => window.history.back()}
            className="group relative px-8 py-3 font-bold text-cyan-300 bg-transparent rounded-lg border-2 border-cyan-500 overflow-hidden transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.5))'
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              GO BACK
            </span>
            
            {/* Hover Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>

        {/* Retro Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <p 
            className="text-pink-400 text-sm font-mono flex items-center gap-2"
            style={{ filter: 'drop-shadow(0 0 4px #ff00ff)' }}
          >
            Made with <Heart className="w-4 h-4 fill-current" /> and synthwave vibes
          </p>
        </motion.div>
      </div>

      {/* Static/TV Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 2px
            )
          `,
          animation: 'static 0.1s infinite'
        }}
      />

      <style jsx>{`
        @keyframes static {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  )
}