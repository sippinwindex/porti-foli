'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Icon, TechIcon } from './IconSystem';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gallery: string[];
  technologies: string[];
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

interface ProjectCaseStudyProps {
  project: Project;
}

export const ProjectCaseStudy: React.FC<ProjectCaseStudyProps> = ({ project }) => {
  const [selectedImage, setSelectedImage] = useState(0);

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

  const getStatusColor = (status: