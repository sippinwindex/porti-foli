'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
// FIX: Import the IconName type
import { Icon, IconName } from './IconSystem';

const roles = [
  'Full Stack Developer',
  'UI/UX Designer', 
  'Problem Solver',
  'Tech Enthusiast'
];

// FIX: Apply the IconName type to the 'icon' property
const techStack: { name: string, icon: IconName, color: string }[] = [
  { name: 'React', icon: 'code', color: 'text-blue-500' },
  { name: 'Next.js', icon: 'globe', color: 'text-black dark:text-white' },
  { name: 'TypeScript', icon: 'code', color: 'text-blue-600' },
  { name: 'Node.js', icon: 'server', color: 'text-green-500' },
  { name: 'Database', icon: 'database', color: 'text-orange-500' },
  { name: 'Mobile', icon: 'smartphone', color: 'text-purple-500' },
];

export const HeroSection: React.FC = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-primary-50/50 to-accent-50/30 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800"
      style={{ y, opacity }}
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary-400/20 to-accent-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-accent-400/20 to-primary-400/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10 dark:opacity-5"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotate: [0, 360] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          >
            <div className={`w-${4 + i} h-${4 + i} bg-gradient-to-br from-primary-500 to-accent-500 ${i % 2 ? 'rounded-full' : 'rounded-lg'}`} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={slideInLeft} className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700">
                <Icon name="zap" size={16} className="mr-2" animate />
                Available for new opportunities
              </span>
            </motion.div>

            <motion.h1 variants={slideUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-900 dark:text-white leading-tight">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Juan Fernandez
              </span>
            </motion.h1>

            <motion.div variants={slideUp} className="mt-6 h-16 flex items-center justify-center lg:justify-start">
              <span className="text-xl sm:text-2xl text-dark-600 dark:text-dark-300 mr-3">
                A passionate
              </span>
              <motion.span
                key={currentRoleIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-xl sm:text-2xl font-semibold text-primary-600 dark:text-primary-400 min-w-[200px] text-left"
              >
                {roles[currentRoleIndex]}
              </motion.span>
            </motion.div>

            <motion.p variants={slideUp} className="mt-6 text-lg text-dark-600 dark:text-dark-300 max-w-2xl mx-auto lg:mx-0">
              I craft beautiful, functional, and user-centered digital experiences. 
              With expertise in modern web technologies, I transform ideas into 
              exceptional products that make a difference.
            </motion.p>

            <motion.div variants={slideUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <span>View My Work</span>
                <Icon name="arrow-right" size={20} className="ml-2" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center px-8 py-4 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-semibold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300">
                <Icon name="download" size={20} className="mr-2" />
                <span>Download CV</span>
              </motion.button>
            </motion.div>

            <motion.div variants={slideUp} className="mt-12">
              <p className="text-sm font-medium text-dark-500 dark:text-dark-400 mb-4 text-center lg:text-left">
                Technologies I work with
              </p>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm border border-dark-200/50 dark:border-dark-700/50 hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1, transition: { delay: index * 0.1 } }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2, y: -5, transition: { duration: 0.2 } }}
                    animate={{ y: [-10, 10, -10], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                  >
                    <Icon name={tech.icon} size={24} className={tech.color} animate />
                    <span className="text-xs font-medium text-dark-600 dark:text-dark-300">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" animate="visible" className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <motion.div
                className="w-80 h-80 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-2 shadow-2xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-dark-100 dark:bg-dark-800 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900 to-accent-900 flex items-center justify-center">
                    <Icon name="user" size={120} className="text-primary-400 dark:text-primary-600" />
                  </div>
                </div>
              </motion.div>
              
              {/* FIX: Apply the IconName type to this data array as well */}
              {[
                { icon: 'code', position: 'top-10 -right-4', color: 'text-blue-500' },
                { icon: 'palette', position: 'top-32 -left-8', color: 'text-purple-500' },
                { icon: 'zap', position: 'bottom-32 -right-8', color: 'text-yellow-500' },
                { icon: 'heart', position: 'bottom-10 -left-4', color: 'text-red-500' },
              ].map((item: { icon: IconName, position: string, color: string }, index) => (
                <motion.div
                  key={index}
                  className={`absolute ${item.position} w-16 h-16 rounded-full bg-white dark:bg-dark-800 shadow-lg flex items-center justify-center border border-dark-200 dark:border-dark-700`}
                  animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
                  transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <Icon name={item.icon} size={24} className={item.color} animate />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center space-y-2 text-dark-400 dark:text-dark-500">
          <span className="text-sm font-medium">Scroll down</span>
          <Icon name="chevron-down" size={20} />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;