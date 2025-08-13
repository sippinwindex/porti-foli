import React from 'react';
import { 
  Moon, Sun, Menu, X, Github, Linkedin, Mail, ExternalLink,
  ArrowRight, ArrowUp, Download, Code, Palette, Smartphone,
  Globe, Database, Server, Cpu, Zap, Star, Eye, GitFork,
  MapPin, Calendar, Clock, User, Heart, MessageCircle,
  Play, Pause, Volume2, VolumeX, Settings, Search,
  Home, Briefcase, Contact, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Plus, Minus, Check, AlertCircle,
  Info, AlertTriangle, XCircle, CheckCircle, Loader, Twitter
} from 'lucide-react';

export type IconName = 
  | 'moon' | 'sun' | 'menu' | 'x' | 'github' | 'linkedin' | 'mail' | 'twitter'
  | 'external-link' | 'arrow-right' | 'arrow-up' | 'download'
  | 'code' | 'palette' | 'smartphone' | 'globe' | 'database' 
  | 'server' | 'cpu' | 'zap' | 'star' | 'eye' | 'git-fork'
  | 'map-pin' | 'calendar' | 'clock' | 'user' | 'heart' 
  | 'message-circle' | 'play' | 'pause' | 'volume-on' | 'volume-off'
  | 'settings' | 'search' | 'home' | 'about' | 'briefcase' 
  | 'contact' | 'chevron-down' | 'chevron-up' | 'chevron-left'
  | 'chevron-right' | 'plus' | 'minus' | 'check' | 'alert'
  | 'info' | 'warning' | 'error' | 'success' | 'loading';

const iconMap = {
  moon: Moon,
  sun: Sun,
  menu: Menu,
  x: X,
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  twitter: Twitter,
  'external-link': ExternalLink,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  download: Download,
  code: Code,
  palette: Palette,
  smartphone: Smartphone,
  globe: Globe,
  database: Database,
  server: Server,
  cpu: Cpu,
  zap: Zap,
  star: Star,
  eye: Eye,
  'git-fork': GitFork,
  'map-pin': MapPin,
  calendar: Calendar,
  clock: Clock,
  user: User,
  heart: Heart,
  'message-circle': MessageCircle,
  play: Play,
  pause: Pause,
  'volume-on': Volume2,
  'volume-off': VolumeX,
  settings: Settings,
  search: Search,
  home: Home,
  about: User,
  briefcase: Briefcase,
  contact: Mail,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  plus: Plus,
  minus: Minus,
  check: Check,
  alert: AlertCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
  loading: Loader
};

interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  animate?: boolean;
  color?: 'primary' | 'accent' | 'muted' | 'current';
  variant?: 'default' | 'outline' | 'ghost' | 'glow';
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  className = '', 
  animate = false,
  color = 'current',
  variant = 'default'
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const colorClasses = {
    primary: 'text-primary-600 dark:text-primary-400',
    accent: 'text-accent-600 dark:text-accent-400', 
    muted: 'text-dark-400 dark:text-dark-500',
    current: 'text-current'
  };

  const variantClasses = {
    default: '',
    outline: 'stroke-2',
    ghost: 'opacity-60 hover:opacity-100',
    glow: 'drop-shadow-lg filter'
  };

  const animationClasses = animate ? 'transition-all duration-300 ease-in-out' : '';
  
  const specialAnimations = {
    loading: 'animate-spin',
    heart: 'hover:animate-pulse hover:text-red-500',
    star: 'hover:animate-pulse hover:text-yellow-500',
    zap: 'hover:animate-bounce'
  };

  const specialAnimation = animate && specialAnimations[name] ? specialAnimations[name] : '';

  return (
    <IconComponent 
      size={size}
      className={`
        ${colorClasses[color]}
        ${variantClasses[variant]}
        ${animationClasses}
        ${specialAnimation}
        ${className}
      `.trim()}
    />
  );
};

// Pre-built icon combinations for common use cases
export const SocialIcon: React.FC<{ 
  platform: 'github' | 'linkedin' | 'mail' | 'twitter';
  size?: number;
  className?: string;
}> = ({ platform, size = 20, className = '' }) => (
  <Icon 
    name={platform} 
    size={size} 
    className={`hover:text-primary-500 transition-colors duration-200 ${className}`}
    animate
  />
);

export const NavigationIcon: React.FC<{
  name: 'home' | 'about' | 'briefcase' | 'contact';
  isActive?: boolean;
  size?: number;
  className?: string;
}> = ({ name, isActive = false, size = 20, className = '' }) => (
  <Icon
    name={name}
    size={size}
    className={`
      transition-all duration-200
      ${isActive 
        ? 'text-primary-600 dark:text-primary-400' 
        : 'text-dark-600 dark:text-dark-400 hover:text-primary-500'
      }
      ${className}
    `.trim()}
    animate
  />
);

export const TechIcon: React.FC<{
  tech: 'code' | 'palette' | 'smartphone' | 'globe' | 'database' | 'server';
  size?: number;
  className?: string;
}> = ({ tech, size = 24, className = '' }) => (
  <Icon
    name={tech}
    size={size}
    variant="glow"
    className={`text-accent-500 hover:text-accent-400 transition-colors duration-300 ${className}`}
    animate
  />
);

export default Icon;