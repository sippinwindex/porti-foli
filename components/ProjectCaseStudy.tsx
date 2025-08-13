'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Icon, TechIcon } from './IconSystem';

// FIX: Define the specific type for technology icon names based on the error.
type TechName = "code" | "palette" | "smartphone" | "globe" | "database" | "server";

// Interface for a single project
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gallery: string[];
  // FIX: Use the specific TechName type for the technologies array.
  technologies: TechName[];
  features: string[];
  challenge: string;
  solution: string;
  results: string[];
  github?: string;
  demo?: string;
  status: 'completed' | 'in-progress' | 'planned';
  duration: string;
  role: string;
  client: string;
  year: string;
}

// Props for the component
interface ProjectCaseStudyProps {
  project: Project;
}

export const ProjectCaseStudy: React.FC<ProjectCaseStudyProps> = ({ project }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Animation variants for Framer Motion
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

  const getStatusColor = (status: 'completed' | 'in-progress' | 'planned'): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'planned':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-16"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="text-center mb-16">
        <span className={`inline-block px-3 py-1 mb-4 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{project.title}</h1>
        <p className="text-xl text-dark-300 max-w-3xl mx-auto">{project.subtitle}</p>
      </motion.header>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-12">
          <motion.div variants={itemVariants}>
            <Image
              src={project.gallery[selectedImage]}
              alt={`${project.title} screenshot ${selectedImage + 1}`}
              width={1600}
              height={900}
              className="rounded-xl border border-dark-700 shadow-2xl"
            />
            <div className="flex justify-center gap-4 mt-4">
              {project.gallery.map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(index)}>
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={60}
                    className={`rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedImage === index ? 'ring-2 ring-primary-500' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4 text-white">About the Project</h2>
            <p className="text-dark-300 leading-relaxed">{project.description}</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Technical Sheet</h2>
            <div className="flex flex-wrap gap-4">
              {project.technologies.map(tech => (
                <TechIcon key={tech} tech={tech} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Challenge</h2>
            <p className="text-dark-300 leading-relaxed">{project.challenge}</p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Solution</h2>
            <p className="text-dark-300 leading-relaxed">{project.solution}</p>
          </motion.div>
        </div>

        {/* Right Column - Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          <motion.div variants={itemVariants} className="p-6 bg-dark-800/50 border border-dark-700 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Project Info</h3>
            <ul className="space-y-3 text-dark-300">
              <li className="flex justify-between"><span>Client:</span> <span className="font-medium text-white">{project.client}</span></li>
              <li className="flex justify-between"><span>Year:</span> <span className="font-medium text-white">{project.year}</span></li>
              <li className="flex justify-between"><span>Role:</span> <span className="font-medium text-white">{project.role}</span></li>
              <li className="flex justify-between"><span>Duration:</span> <span className="font-medium text-white">{project.duration}</span></li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants} className="p-6 bg-dark-800/50 border border-dark-700 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-white">Key Features</h3>
            <ul className="space-y-3">
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon name="check" className="text-green-500 mt-1 flex-shrink-0" size={16} />
                  <span className="text-dark-300">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            {project.demo && (
              <Link href={project.demo} passHref legacyBehavior>
                <a target="_blank" className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                  <Icon name="globe" size={18} />
                  Live Demo
                </a>
              </Link>
            )}
            {project.github && (
              <Link href={project.github} passHref legacyBehavior>
                <a target="_blank" className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors">
                  <Icon name="github" size={18} />
                  View Code
                </a>
              </Link>
            )}
          </motion.div>
        </aside>
      </div>
    </motion.div>
  );
};