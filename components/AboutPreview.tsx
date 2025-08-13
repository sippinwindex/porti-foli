'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon, TechIcon } from './IconSystem';

const skills = [
  {
    category: 'Frontend',
    technologies: [
      { name: 'React/Next.js', level: 95, icon: 'code' as const },
      { name: 'TypeScript', level: 90, icon: 'code' as const },
      { name: 'UI/UX Design', level: 85, icon: 'palette' as const },
      { name: 'Tailwind CSS', level: 92, icon: 'palette' as const },
    ]
  },
  {
    category: 'Backend',
    technologies: [
      { name: 'Node.js/Express', level: 88, icon: 'server' as const },
      { name: 'Database Design', level: 85, icon: 'database' as const },
      { name: 'API Development', level: 90, icon: 'globe' as const },
      { name: 'Cloud Services', level: 80, icon: 'server' as const },
    ]
  },
  {
    category: 'Mobile',
    technologies: [
      { name: 'React Native', level: 82, icon: 'smartphone' as const },
      { name: 'Mobile UI', level: 88, icon: 'smartphone' as const },
      { name: 'App Store', level: 75, icon: 'smartphone' as const },
    ]
  }
];

const stats = [
  { number: '50+', label: 'Projects Completed', icon: 'briefcase' as const },
  { number: '3+', label: 'Years Experience', icon: 'calendar' as const },
  { number: '20+', label: 'Happy Clients', icon: 'heart' as const },
  { number: '100%', label: 'Success Rate', icon: 'star' as const },
];

export const AboutPreview: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
    <section className="py-20 bg-gradient-to-br from-primary-50/50 via-white to-accent-50/30 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - About Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700">
                <Icon name="user" size={16} className="mr-2" />
                About Me
              </span>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-dark-900 dark:text-white mb-6"
            >
              Passionate about creating
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {' '}exceptional experiences
              </span>
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-dark-600 dark:text-dark-300 mb-8 leading-relaxed"
            >
              I'm a dedicated full-stack developer with a passion for creating beautiful, 
              functional, and user-centered digital experiences. With expertise in modern 
              web technologies and a keen eye for design, I transform complex problems 
              into elegant solutions.
            </motion.p>

            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
                What I bring to the table:
              </h3>
              <ul className="space-y-3">
                {[
                  'Full-stack development expertise',
                  'Modern UI/UX design principles',
                  'Performance optimization focus',
                  'Collaborative team approach',
                  'Continuous learning mindset'
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-center text-dark-600 dark:text-dark-300"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mr-3" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span>Learn More About Me</span>
                <Icon name="arrow-right" size={18} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Skills & Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-6 text-center lg:text-left">
                By the Numbers
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center p-6 rounded-2xl bg-white dark:bg-dark-800 shadow-lg border border-dark-200/50 dark:border-dark-700/50 hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="mb-3 flex justify-center">
                      <div className="p-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500">
                        <Icon name={stat.icon} size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-dark-900 dark:text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-dark-600 dark:text-dark-300 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skills Overview */}
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-6 text-center lg:text-left">
                Technical Skills
              </h3>
              <div className="space-y-6">
                {skills.map((skillGroup, groupIndex) => (
                  <motion.div
                    key={groupIndex}
                    variants={itemVariants}
                    className="p-6 rounded-2xl bg-white dark:bg-dark-800 shadow-lg border border-dark-200/50 dark:border-dark-700/50"
                  >
                    <h4 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center">
                      <TechIcon tech={skillGroup.technologies[0].icon} size={20} />
                      <span className="ml-2">{skillGroup.category}</span>
                    </h4>
                    <div className="space-y-3">
                      {skillGroup.technologies.map((tech, techIndex) => (
                        <div key={techIndex} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
                              {tech.name}
                            </span>
                            <span className="text-sm text-dark-500 dark:text-dark-400">
                              {tech.level}%
                            </span>
                          </div>
                          <div className="w-full bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${tech.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: techIndex * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;