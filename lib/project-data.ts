// lib/project-data.ts
import { ProjectMetadata, CaseStudy, Skill, SocialLink, ContactMethod } from '@/types'

// Project metadata for GitHub integration
export const projectMetadata: Record<string, ProjectMetadata> = {
  'healthcare-dashboard': {
    featured: true,
    order: 1,
    customDescription: 'AI-powered healthcare dashboard for real-time patient monitoring with predictive analytics and interactive visualizations.',
    caseStudy: {
      problem: 'Healthcare professionals needed real-time patient data visualization and predictive analytics to make informed decisions quickly during critical situations.',
      solution: 'Built a comprehensive dashboard with React, Flask, and TensorFlow that processes real-time data streams and provides predictive insights with intuitive visualizations.',
      impact: 'Reduced patient monitoring response time by 40% and improved early disease detection accuracy by 25%, potentially saving lives through faster intervention.',
      process: [
        {
          phase: 'Research & Discovery',
          duration: '2 weeks',
          description: 'Understanding healthcare workflows and user needs',
          activities: [
            'Conducted interviews with 15 healthcare professionals',
            'Analyzed existing data systems and workflows',
            'Identified key pain points and requirements',
            'Researched HIPAA compliance requirements',
            'Studied competitor solutions and best practices'
          ],
          deliverables: ['User research report', 'Requirements document', 'Compliance checklist']
        },
        {
          phase: 'Architecture & Planning',
          duration: '1 week',
          description: 'Designing system architecture and technical approach',
          activities: [
            'Designed system architecture for real-time data processing',
            'Created API specifications for system integrations',
            'Planned machine learning model architecture',
            'Established security and compliance framework',
            'Created detailed project timeline and milestones'
          ],
          deliverables: ['Technical architecture document', 'API specifications', 'Security framework']
        },
        {
          phase: 'MVP Development',
          duration: '6 weeks',
          description: 'Building core functionality and user interface',
          activities: [
            'Built core dashboard with essential patient metrics',
            'Implemented real-time data pipeline with WebSockets',
            'Developed initial predictive models with TensorFlow',
            'Created responsive UI components with React',
            'Integrated with existing hospital systems via APIs'
          ],
          deliverables: ['Working MVP', 'API integrations', 'Initial ML models']
        },
        {
          phase: 'Testing & Iteration',
          duration: '3 weeks',
          description: 'Ensuring quality, security, and user satisfaction',
          activities: [
            'Conducted user testing with medical staff',
            'Performed security audits and compliance checks',
            'Optimized performance for large datasets',
            'Refined UI based on user feedback',
            'Load tested real-time data processing'
          ],
          deliverables: ['Test results', 'Security audit report', 'Performance optimizations']
        },
        {
          phase: 'Deployment & Training',
          duration: '2 weeks',
          description: 'Production deployment and user adoption',
          activities: [
            'Deployed to production environment with monitoring',
            'Trained medical staff on new system features',
            'Monitored system performance and user adoption',
            'Gathered feedback for future improvements',
            'Created documentation and support materials'
          ],
          deliverables: ['Production deployment', 'User training materials', 'Support documentation']
        }
      ],
      technical: {
        architecture: {
          frontend: ['React 18', 'TypeScript', 'TailwindCSS', 'D3.js', 'Framer Motion', 'React Query'],
          backend: ['Flask', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'SQLAlchemy'],
          database: ['PostgreSQL', 'Redis', 'InfluxDB for time-series data'],
          infrastructure: ['AWS EC2', 'RDS', 'ElastiCache', 'CloudWatch', 'Docker', 'Nginx'],
          tools: ['Git', 'Jest', 'Pytest', 'Docker Compose', 'GitHub Actions'],
          apis: ['HL7 FHIR', 'Epic MyChart API', 'Cerner API', 'Custom WebSocket API']
        },
        challenges: [
          {
            challenge: 'Real-time Data Processing at Scale',
            solution: 'Implemented WebSocket connections with Redis pub/sub for instant data updates across all connected clients, with automatic failover and connection recovery.',
            impact: 'Achieved sub-second latency for critical alerts',
            learnings: ['WebSocket scaling patterns', 'Redis clustering', 'Connection management']
          },
          {
            challenge: 'HIPAA Compliance and Security',
            solution: 'Built comprehensive audit logging, role-based access control, and end-to-end encryption for all patient data with automated compliance monitoring.',
            impact: 'Achieved full HIPAA compliance certification',
            learnings: ['Healthcare data regulations', 'Security architecture', 'Compliance automation']
          },
          {
            challenge: 'Performance with Large Medical Datasets',
            solution: 'Optimized queries with proper indexing, implemented data pagination and virtualization, and used Redis for caching frequently accessed patient data.',
            impact: 'Reduced query times from 5+ seconds to under 200ms',
            learnings: ['Database optimization', 'Caching strategies', 'Data virtualization']
          }
        ],
        decisions: [
          {
            decision: 'React with TypeScript for Frontend',
            reasoning: 'Strong typing essential for medical data integrity, excellent ecosystem for data visualization',
            alternatives: ['Vue.js', 'Angular', 'Svelte'],
            outcome: 'Reduced bugs by 60% and improved developer productivity'
          },
          {
            decision: 'Flask + FastAPI Hybrid Backend',
            reasoning: 'Flask for rapid prototyping, FastAPI for high-performance APIs with automatic documentation',
            alternatives: ['Django', 'Node.js', 'Ruby on Rails'],
            outcome: 'Achieved 10x better API performance while maintaining development speed'
          }
        ]
      },
      results: {
        metrics: [
          {
            label: 'Response Time Reduction',
            value: '40%',
            description: 'Faster identification and response to patient condition changes',
            type: 'percentage'
          },
          {
            label: 'Early Detection Accuracy',
            value: '25%',
            description: 'Improvement in predicting potential complications before they occur',
            type: 'percentage'
          },
          {
            label: 'Data Aggregation Time',
            value: '95%',
            description: 'Reduction in time spent manually collecting patient data',
            type: 'percentage'
          },
          {
            label: 'User Satisfaction',
            value: '4.8/5',
            description: 'Average rating from healthcare professionals using the system',
            type: 'number'
          },
          {
            label: 'Mobile Usage',
            value: '60%',
            description: 'Of daily interactions happen on mobile devices during rounds',
            type: 'percentage'
          },
          {
            label: 'Alert False Positive Rate',
            value: '85%',
            description: 'Reduction in false alerts through improved ML algorithms',
            type: 'percentage'
          }
        ],
        feedback: [
          {
            quote: "This dashboard has transformed how we monitor our patients. The predictive alerts have helped us prevent several potential complications.",
            author: "Dr. Sarah Johnson",
            role: "Chief of Internal Medicine",
            company: "Regional Medical Center"
          },
          {
            quote: "The mobile interface is incredible. I can check on my patients between surgeries and get all the information I need instantly.",
            author: "Dr. Michael Chen",
            role: "Cardiac Surgeon",
            company: "Regional Medical Center"
          },
          {
            quote: "The real-time data visualization gives us insights we never had before. It's like having X-ray vision into patient health trends.",
            author: "Nurse Manager Lisa Rodriguez",
            role: "ICU Nurse Manager",
            company: "Regional Medical Center"
          }
        ],
        achievements: [
          'Deployed across 3 hospital departments serving 200+ medical staff',
          'Processed over 1 million patient data points daily',
          'Achieved 99.9% uptime during critical care periods',
          'Received healthcare innovation award from regional medical association',
          'Featured in Healthcare Technology Magazine as "Innovation of the Year"'
        ],
        impact: 'The dashboard significantly improved patient outcomes by enabling faster response times and more accurate predictions, ultimately contributing to better healthcare delivery and potentially saving lives.'
      },
      nextSteps: [
        'Integration with additional medical devices and IoT sensors',
        'Advanced AI models for drug interaction and allergy checking',
        'Telemedicine features for remote patient monitoring',
        'Expansion to other hospital departments and specialties',
        'Mobile app development for on-the-go access',
        'Integration with wearable devices for continuous monitoring'
      ]
    },
    images: [
      '/images/projects/healthcare/dashboard-main.jpg',
      '/images/projects/healthcare/analytics-view.jpg',
      '/images/projects/healthcare/mobile-interface.jpg',
      '/images/projects/healthcare/alerts-system.jpg'
    ],
    liveUrl: 'https://healthcare-dashboard.vercel.app',
    category: 'data',
    status: 'completed',
    client: 'Regional Medical Center',
    teamSize: 5,
    role: 'Lead Full-Stack Developer & Data Engineer',
    tags: ['Healthcare', 'AI/ML', 'Real-time', 'HIPAA', 'Critical Systems'],
    highlights: [
      'First healthcare AI system deployed in the region',
      'Zero security incidents in 18 months of operation',
      'Featured in 3 medical technology publications'
    ]
  },

  'ecommerce-suite': {
    featured: true,
    order: 2,
    customDescription: 'Full-stack e-commerce platform with AI-powered recommendations, inventory management, and advanced analytics.',
    caseStudy: {
      problem: 'Small to medium businesses needed an affordable, feature-rich e-commerce solution with modern UX, analytics, and growth capabilities.',
      solution: 'Developed a complete platform with Next.js featuring personalized recommendations, inventory forecasting, optimized checkout, and comprehensive analytics.',
      impact: 'Reduced cart abandonment by 22%, increased average order value by 18%, and improved customer retention by 35% across all client implementations.',
      process: [
        {
          phase: 'Market Research & Planning',
          duration: '2 weeks',
          description: 'Understanding e-commerce market needs and competitive landscape',
          activities: [
            'Analyzed 50+ existing e-commerce platforms',
            'Surveyed 100+ small business owners about pain points',
            'Studied conversion optimization best practices',
            'Researched payment processing and security requirements',
            'Defined MVP features and roadmap'
          ]
        },
        {
          phase: 'Design & Architecture',
          duration: '3 weeks',
          description: 'Creating user-centered design and scalable architecture',
          activities: [
            'Created user personas and journey maps',
            'Designed responsive UI/UX with Figma',
            'Architected microservices backend structure',
            'Planned database schema and API design',
            'Established CI/CD pipeline and deployment strategy'
          ]
        },
        {
          phase: 'Core Development',
          duration: '8 weeks',
          description: 'Building essential e-commerce functionality',
          activities: [
            'Developed product catalog and search functionality',
            'Implemented shopping cart and checkout process',
            'Built user authentication and profile management',
            'Created admin dashboard for store management',
            'Integrated payment processing with Stripe'
          ]
        },
        {
          phase: 'AI Integration & Optimization',
          duration: '4 weeks',
          description: 'Adding intelligent features and performance optimization',
          activities: [
            'Implemented AI-powered product recommendations',
            'Built inventory forecasting algorithms',
            'Added advanced analytics and reporting',
            'Optimized performance and SEO',
            'Implemented A/B testing framework'
          ]
        },
        {
          phase: 'Testing & Launch',
          duration: '3 weeks',
          description: 'Quality assurance and market deployment',
          activities: [
            'Conducted comprehensive testing across devices',
            'Performed security audits and penetration testing',
            'Beta tested with 10 pilot businesses',
            'Launched public version with marketing site',
            'Provided onboarding and support documentation'
          ]
        }
      ],
      technical: {
        architecture: {
          frontend: ['Next.js 14', 'React 18', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'React Hook Form'],
          backend: ['Node.js', 'Express', 'Prisma ORM', 'GraphQL', 'Redis', 'Bull Queue'],
          database: ['PostgreSQL', 'Redis', 'Elasticsearch'],
          infrastructure: ['Vercel', 'AWS S3', 'CloudFront', 'AWS Lambda', 'GitHub Actions'],
          tools: ['Stripe', 'SendGrid', 'Algolia', 'Sentry', 'Mixpanel'],
          apis: ['Stripe API', 'SendGrid API', 'Algolia Search', 'Google Analytics', 'Social Media APIs']
        },
        challenges: [
          {
            challenge: 'Payment Processing Security and PCI Compliance',
            solution: 'Implemented Stripe for secure payment processing with tokenization, never storing sensitive card data, and achieving PCI DSS compliance.',
            impact: 'Zero payment security incidents and full regulatory compliance'
          },
          {
            challenge: 'Real-time Inventory Management Across Multiple Sales Channels',
            solution: 'Built event-driven architecture with Redis pub/sub for real-time inventory updates and conflict resolution algorithms.',
            impact: 'Eliminated overselling and improved inventory accuracy to 99.9%'
          },
          {
            challenge: 'AI Recommendation Performance at Scale',
            solution: 'Implemented collaborative filtering with matrix factorization and real-time model updates using Apache Kafka streams.',
            impact: 'Achieved sub-50ms recommendation response times even with 100k+ products'
          }
        ],
        decisions: [
          {
            decision: 'Next.js with Server-Side Rendering',
            reasoning: 'Optimal SEO for product pages, excellent performance, and built-in API routes',
            alternatives: ['React SPA', 'Vue.js', 'Angular'],
            outcome: '40% improvement in SEO rankings and 25% faster page loads'
          }
        ]
      },
      results: {
        metrics: [
          {
            label: 'Cart Abandonment Reduction',
            value: '22%',
            description: 'Improvement in checkout completion rates through UX optimization',
            type: 'percentage'
          },
          {
            label: 'Average Order Value Increase',
            value: '18%',
            description: 'Growth through AI-powered product recommendations',
            type: 'percentage'
          },
          {
            label: 'Customer Retention Improvement',
            value: '35%',
            description: 'Better user experience leading to repeat purchases',
            type: 'percentage'
          },
          {
            label: 'Page Load Speed',
            value: '1.2s',
            description: 'Average time to interactive on product pages',
            type: 'time'
          },
          {
            label: 'Mobile Conversion Rate',
            value: '8.5%',
            description: 'Mobile checkout completion rate (industry average: 2.5%)',
            type: 'percentage'
          }
        ],
        feedback: [
          {
            quote: "This platform transformed our online business. Sales increased 300% in the first quarter after switching.",
            author: "Maria Santos",
            role: "Founder",
            company: "Artisan Jewelry Co."
          },
          {
            quote: "The AI recommendations are incredibly accurate. Our customers are discovering products they love and spending more per order.",
            author: "James Wright",
            role: "E-commerce Manager",
            company: "Outdoor Gear Plus"
          }
        ],
        achievements: [
          'Deployed for 25+ businesses with combined $2M+ monthly revenue',
          'Featured in E-commerce Weekly as "Platform to Watch"',
          'Achieved 99.99% uptime during Black Friday peak traffic',
          'Won "Best New E-commerce Solution" at Tech Innovation Awards'
        ],
        impact: 'Empowered small businesses to compete with enterprise-level e-commerce capabilities, resulting in significant revenue growth and improved customer experiences.'
      }
    },
    images: [
      '/images/projects/ecommerce/storefront.jpg',
      '/images/projects/ecommerce/admin-dashboard.jpg',
      '/images/projects/ecommerce/mobile-checkout.jpg',
      '/images/projects/ecommerce/analytics.jpg'
    ],
    liveUrl: 'https://ecommerce-suite.vercel.app',
    category: 'fullstack',
    status: 'completed',
    teamSize: 4,
    role: 'Lead Full-Stack Developer',
    tags: ['E-commerce', 'AI/ML', 'Payment Processing', 'Analytics', 'Mobile-First'],
    highlights: [
      'Processed $2M+ in transactions with zero payment issues',
      'AI recommendations increased revenue by 18% on average',
      'Mobile-first design achieved 8.5% conversion rate'
    ]
  },

  'financial-risk-tool': {
    featured: false,
    order: 3,
    customDescription: 'Real-time financial risk analysis tool with customizable dashboards, scenario modeling, and advanced analytics.',
    caseStudy: {
      problem: 'Financial analysts needed a comprehensive tool for real-time market analysis with scenario modeling capabilities and risk assessment.',
      solution: 'Created a web application with Python backend, React frontend, and WebSocket connections for live data feeds with advanced risk modeling.',
      impact: 'Improved risk assessment speed by 60% and enabled real-time decision making for portfolio management worth $50M+ in assets.',
      process: [
        {
          phase: 'Financial Requirements Analysis',
          duration: '1 week',
          description: 'Understanding financial analysis workflows and regulatory requirements',
          activities: [
            'Interviewed portfolio managers and risk analysts',
            'Studied existing risk models and calculation methods',
            'Researched regulatory compliance requirements (SEC, FINRA)',
            'Analyzed real-time data feed requirements',
            'Defined performance and accuracy benchmarks'
          ]
        },
        {
          phase: 'Algorithm Development',
          duration: '2 weeks',
          description: 'Building core financial models and risk calculation engines',
          activities: [
            'Implemented Value at Risk (VaR) calculations',
            'Built Monte Carlo simulation engine',
            'Created correlation analysis algorithms',
            'Developed stress testing scenarios',
            'Integrated with market data APIs'
          ]
        },
        {
          phase: 'Real-time System Development',
          duration: '4 weeks',
          description: 'Building scalable real-time data processing and visualization',
          activities: [
            'Implemented WebSocket-based real-time data feeds',
            'Built responsive dashboard with React and D3.js',
            'Created customizable chart and analysis widgets',
            'Developed alert system for risk threshold breaches',
            'Implemented user preference and portfolio management'
          ]
        }
      ],
      technical: {
        architecture: {
          frontend: ['React', 'TypeScript', 'D3.js', 'Chart.js', 'Material-UI', 'Socket.io Client'],
          backend: ['Python', 'FastAPI', 'Pandas', 'NumPy', 'SciPy', 'Redis', 'Celery'],
          database: ['PostgreSQL', 'Redis', 'TimescaleDB'],
          infrastructure: ['AWS EC2', 'AWS Lambda', 'AWS RDS', 'CloudWatch', 'Docker'],
          tools: ['Alpha Vantage API', 'Yahoo Finance API', 'Bloomberg API', 'WebSocket']
        },
        challenges: [
          {
            challenge: 'Real-time Financial Data Synchronization',
            solution: 'Implemented WebSocket connections with automatic reconnection and data buffering to handle market data feeds from multiple sources.',
            impact: 'Achieved 99.9% data accuracy with sub-100ms latency'
          },
          {
            challenge: 'Complex Financial Calculations at Scale',
            solution: 'Optimized Monte Carlo simulations using NumPy vectorization and parallel processing with Celery workers.',
            impact: 'Reduced calculation time from minutes to seconds for large portfolios'
          }
        ],
        decisions: [
          {
            decision: 'Python with FastAPI for Financial Calculations',
            reasoning: 'Rich financial libraries, excellent performance for mathematical operations, and strong typing',
            alternatives: ['R', 'MATLAB', 'Java'],
            outcome: 'Achieved required performance while maintaining code readability'
          }
        ]
      },
      results: {
        metrics: [
          {
            label: 'Risk Assessment Speed',
            value: '60%',
            description: 'Faster risk calculation and analysis compared to previous tools',
            type: 'percentage'
          },
          {
            label: 'Data Accuracy',
            value: '99.9%',
            description: 'Accuracy of real-time market data synchronization',
            type: 'percentage'
          },
          {
            label: 'Assets Under Analysis',
            value: '$50M+',
            description: 'Total portfolio value analyzed using the platform',
            type: 'currency'
          },
          {
            label: 'Calculation Speed',
            value: '10x',
            description: 'Improvement in Monte Carlo simulation performance',
            type: 'number'
          }
        ],
        feedback: [
          {
            quote: "This tool has revolutionized our risk analysis process. We can now make data-driven decisions in real-time.",
            author: "David Kim",
            role: "Senior Portfolio Manager",
            company: "Capital Investment Group"
          }
        ],
        achievements: [
          'Successfully analyzed $50M+ in portfolio assets',
          'Achieved 99.9% uptime during market hours',
          'Reduced risk calculation time from hours to minutes'
        ],
        impact: 'Enabled faster, more accurate risk assessment for financial portfolios, leading to better investment decisions and reduced portfolio risk.'
      }
    },
    images: [
      '/images/projects/financial/dashboard.jpg',
      '/images/projects/financial/risk-analysis.jpg',
      '/images/projects/financial/portfolio-view.jpg'
    ],
    liveUrl: 'https://financial-risk-tool.vercel.app',
    category: 'data',
    status: 'completed',
    teamSize: 2,
    role: 'Full-Stack Developer',
    tags: ['FinTech', 'Real-time Data', 'Risk Analysis', 'Python', 'Financial Modeling'],
    highlights: [
      'Analyzed $50M+ in assets with 99.9% accuracy',
      '10x performance improvement in calculations',
      'Zero downtime during critical trading hours'
    ]
  }
}

// Skills and technologies
export const skills: Skill[] = [
  // Frontend
  { name: 'React', category: 'frontend', level: 5, years: 4, icon: 'code', certified: true },
  { name: 'Next.js', category: 'frontend', level: 5, years: 3, icon: 'code' },
  { name: 'TypeScript', category: 'frontend', level: 5, years: 4, icon: 'code' },
  { name: 'JavaScript', category: 'frontend', level: 5, years: 6, icon: 'code' },
  { name: 'HTML5/CSS3', category: 'frontend', level: 5, years: 6, icon: 'code' },
  { name: 'Tailwind CSS', category: 'frontend', level: 5, years: 3, icon: 'design' },
  { name: 'Framer Motion', category: 'frontend', level: 4, years: 2, icon: 'design' },
  { name: 'D3.js', category: 'frontend', level: 4, years: 2, icon: 'code' },

  // Backend
  { name: 'Node.js', category: 'backend', level: 5, years: 4, icon: 'server' },
  { name: 'Python', category: 'backend', level: 5, years: 5, icon: 'code' },
  { name: 'Flask', category: 'backend', level: 4, years: 3, icon: 'server' },
  { name: 'FastAPI', category: 'backend', level: 4, years: 2, icon: 'server' },
  { name: 'Express.js', category: 'backend', level: 4, years: 3, icon: 'server' },
  { name: 'PostgreSQL', category: 'backend', level: 4, years: 4, icon: 'database' },
  { name: 'MongoDB', category: 'backend', level: 4, years: 3, icon: 'database' },
  { name: 'Redis', category: 'backend', level: 4, years: 2, icon: 'database' },

  // Tools & Platforms
  { name: 'Git', category: 'tools', level: 5, years: 6, icon: 'git-branch' },
  { name: 'Docker', category: 'tools', level: 4, years: 3, icon: 'package' },
  { name: 'AWS', category: 'tools', level: 4, years: 3, icon: 'cloud' },
  { name: 'Vercel', category: 'tools', level: 5, years: 3, icon: 'cloud' },
  { name: 'GitHub Actions', category: 'tools', level: 4, years: 2, icon: 'tools' },

  // Design
  { name: 'Figma', category: 'design', level: 4, years: 3, icon: 'design' },
  { name: 'UI/UX Design', category: 'design', level: 4, years: 4, icon: 'palette' },
  { name: 'Responsive Design', category: 'design', level: 5, years: 5, icon: 'mobile' },

  // Soft Skills
  { name: 'Problem Solving', category: 'soft', level: 5, years: 6, icon: 'lightbulb' },
  { name: 'Team Collaboration', category: 'soft', level: 5, years: 5, icon: 'users' },
  { name: 'Project Management', category: 'soft', level: 4, years: 3, icon: 'briefcase' },
  { name: 'Communication', category: 'soft', level: 5, years: 6, icon: 'message-circle' },
]

// Social media links
export const socialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/sippinwindex',
    icon: 'github',
    color: 'hover:text-gray-700 dark:hover:text-gray-300'
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
    icon: 'linkedin',
    color: 'hover:text-blue-600 dark:hover:text-blue-400'
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/sippinwindex',
    icon: 'twitter',
    color: 'hover:text-sky-500 dark:hover:text-sky-400'
  },
  {
    platform: 'Email',
    url: 'mailto:juan@juanfernandez.dev',
    icon: 'mail',
    color: 'hover:text-viva-magenta-600 dark:hover:text-viva-magenta-400'
  }
]

// Contact methods
export const contactMethods: ContactMethod[] = [
  {
    type: 'email',
    label: 'Email',
    value: 'juan@juanfernandez.dev',
    icon: 'mail',
    description: 'Best for project inquiries and collaboration',
    primary: true
  },
  {
    type: 'calendar',
    label: 'Schedule a Call',
    value: 'https://calendly.com/juan-fernandez',
    icon: 'calendar',
    description: '30-minute consultation to discuss your project'
  },
  {
    type: 'phone',
    label: 'Phone',
    value: '+1 (555) 123-4567',
    icon: 'phone',
    description: 'Available Monday-Friday, 9 AM - 6 PM EST'
  },
  {
    type: 'social',
    label: 'LinkedIn',
    value: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
    icon: 'linkedin',
    description: 'Connect for professional networking'
  }
]

// SEO configuration
export const seoConfig = {
  title: 'Juan A. Fernandez - Full-Stack Developer',
  description: 'Full-Stack Developer specializing in React, Next.js, and modern web technologies. Creating elegant solutions with exceptional user experiences.',
  keywords: [
    'Juan Fernandez',
    'Full-Stack Developer',
    'React Developer',
    'Next.js',
    'TypeScript',
    'Frontend Developer',
    'Backend Developer',
    'Web Development',
    'Miami Developer',
    'Software Engineer',
    'JavaScript',
    'Python',
    'UI/UX Design'
  ],
  author: 'Juan A. Fernandez',
  siteUrl: 'https://juanfernandez.dev',
  ogImage: '/images/og-image.jpg',
  twitterHandle: '@sippinwindex',
  linkedinProfile: 'https://www.linkedin.com/in/juan-fernandez-fullstack/',
  githubProfile: 'https://github.com/sippinwindex'
}