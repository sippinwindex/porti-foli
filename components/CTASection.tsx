'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from './IconSystem';

export const CTASection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-accent-300/20 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Geometric Shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          >
            <div className={`w-4 h-4 bg-white ${i % 2 ? 'rounded-full' : 'rotate-45'}`} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30 backdrop-blur-sm">
              <Icon name="zap" size={16} className="mr-2" />
              Ready to collaborate?
            </span>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Let's build something
            <br />
            <span className="bg-gradient-to-r from-accent-300 to-white bg-clip-text text-transparent">
              amazing together
            </span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            I'm always excited to work on new projects and collaborate with 
            talented people. Whether you need a complete solution or want to 
            discuss an idea, let's connect!
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/95"
              >
                <Icon name="mail" size={20} className="mr-2" />
                <span>Start a Project</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                <Icon name="eye" size={20} className="mr-2" />
                <span>View My Work</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-white/80 mb-4 text-sm">
              Or reach out directly:
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white/90">
              <motion.a
                href="mailto:jafernandez94@gmail.com"
                className="flex items-center hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                <Icon name="mail" size={18} className="mr-2" />
                <span>jafernandez94@gmail.com</span>
              </motion.a>
              
              <div className="hidden sm:block w-px h-4 bg-white/30" />
              
              <motion.a
                href="https://www.linkedin.com/in/juan-fernandez-fullstack/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                <Icon name="linkedin" size={18} className="mr-2" />
                <span>LinkedIn</span>
              </motion.a>
              
              <div className="hidden sm:block w-px h-4 bg-white/30" />
              
              <motion.a
                href="https://github.com/sippinwindex"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                <Icon name="github" size={18} className="mr-2" />
                <span>GitHub</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Response Time Badge */}
          <motion.div 
            variants={itemVariants}
            className="mt-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm">
              <Icon name="clock" size={16} className="mr-2" />
              <span>Typically responds within 24 hours</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;