/**
 * 🚀 SSR SAFE ANIMATION PERFORMANCE MANAGER
 * Intelligent system to manage complex animations based on device capabilities
 */

class AnimationPerformanceManager {
  constructor() {
    this.isInitialized = false;
    this.performanceLevel = 'high';
    this.animationEnabled = true;
    this.intersectionObserver = null;
    this.animatedElements = new WeakSet();
    this.rafId = null;
    this.mounted = false; // ✅ SSR safety flag
    
    // Performance thresholds
    this.thresholds = {
      fps: {
        high: 55,
        medium: 30,
        low: 15
      },
      memory: {
        high: 4000, // MB
        medium: 2000,
        low: 1000
      }
    };
    
    // ✅ SSR SAFE: Only initialize on client-side
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
      } else {
        // ✅ DELAY initialization to next tick for SSR safety
        setTimeout(() => this.init(), 0);
      }
    }
  }

  /**
   * Initialize the performance management system
   */
  init() {
    // ✅ SSR SAFE: Guard against server-side execution
    if (typeof window === 'undefined' || this.isInitialized) return;
    
    this.mounted = true;
    console.log('🚀 Initializing Animation Performance Manager');
    
    try {
      // Detect device capabilities
      this.detectDeviceCapabilities();
      
      // Set up performance monitoring
      this.setupPerformanceMonitoring();
      
      // Initialize intersection observer for scroll animations
      this.setupIntersectionObserver();
      
      // Set up dynamic quality adjustment
      this.setupDynamicQualityControl();
      
      // Apply initial settings
      this.applyPerformanceSettings();
      
      // Set up cleanup on page unload
      this.setupCleanup();
      
      this.isInitialized = true;
      console.log(`✅ Animation system initialized with ${this.performanceLevel} quality`);
    } catch (error) {
      console.warn('⚠️ Animation manager initialization failed:', error);
      // ✅ GRACEFUL FALLBACK
      this.performanceLevel = 'medium';
      this.isInitialized = true;
    }
  }

  /**
   * Detect device capabilities and set appropriate performance level
   */
  detectDeviceCapabilities() {
    // ✅ SSR SAFE: Return defaults if not on client
    if (typeof window === 'undefined' || !this.mounted) {
      this.capabilities = {
        cores: 4,
        memory: 4,
        connection: '4g',
        saveData: false,
        gpu: 'unknown',
        reducedMotion: false,
        reducedData: false,
        pixelRatio: 1,
        screenSize: 1920 * 1080
      };
      this.performanceLevel = 'medium';
      return;
    }

    const capabilities = {
      // Hardware detection
      cores: navigator.hardwareConcurrency || 4,
      memory: navigator.deviceMemory || 4,
      
      // Network detection
      connection: navigator.connection?.effectiveType || '4g',
      saveData: navigator.connection?.saveData || false,
      
      // Browser capabilities
      gpu: this.detectGPUCapabilities(),
      
      // User preferences - ✅ SAFE with try-catch
      reducedMotion: this.safeMatchMedia('(prefers-reduced-motion: reduce)'),
      reducedData: this.safeMatchMedia('(prefers-reduced-data: reduce)'),
      
      // Screen properties
      pixelRatio: window.devicePixelRatio || 1,
      screenSize: window.screen ? window.screen.width * window.screen.height : 1920 * 1080
    };

    console.log('📊 Device capabilities:', capabilities);

    // Determine performance level based on capabilities
    this.performanceLevel = this.calculatePerformanceLevel(capabilities);
    
    // Store capabilities for later use
    this.capabilities = capabilities;
  }

  /**
   * ✅ SSR SAFE: Safe media query matching
   */
  safeMatchMedia(query) {
    try {
      return window.matchMedia(query).matches;
    } catch (error) {
      console.warn('Media query not supported:', query);
      return false;
    }
  }

  /**
   * Detect GPU capabilities
   */
  detectGPUCapabilities() {
    // ✅ SSR SAFE: Return fallback if not available
    if (typeof window === 'undefined') return 'unknown';
    
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) return 'none';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo ? 
        gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 
        gl.getParameter(gl.RENDERER);
      
      // Simple GPU tier detection
      if (renderer.includes('Intel')) return 'integrated';
      if (renderer.includes('NVIDIA') || renderer.includes('AMD')) return 'dedicated';
      
      return 'unknown';
    } catch (e) {
      return 'none';
    }
  }

  /**
   * Calculate appropriate performance level
   */
  calculatePerformanceLevel(capabilities) {
    let score = 0;
    
    // CPU score (0-3)
    if (capabilities.cores >= 8) score += 3;
    else if (capabilities.cores >= 4) score += 2;
    else if (capabilities.cores >= 2) score += 1;
    
    // Memory score (0-3)
    if (capabilities.memory >= 8) score += 3;
    else if (capabilities.memory >= 4) score += 2;
    else if (capabilities.memory >= 2) score += 1;
    
    // GPU score (0-2)
    if (capabilities.gpu === 'dedicated') score += 2;
    else if (capabilities.gpu === 'integrated') score += 1;
    
    // Network penalty
    if (capabilities.saveData || capabilities.connection === 'slow-2g') score -= 2;
    else if (capabilities.connection === '2g' || capabilities.connection === '3g') score -= 1;
    
    // User preference overrides
    if (capabilities.reducedMotion || capabilities.reducedData) return 'low';
    
    // Determine level based on score
    if (score >= 6) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  /**
   * Set up performance monitoring
   */
  setupPerformanceMonitoring() {
    // ✅ SSR SAFE: Check for PerformanceObserver
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      // Monitor FPS
      this.setupFPSMonitoring();
      
      // Monitor memory usage
      this.setupMemoryMonitoring();
      
      // Monitor long tasks
      this.setupLongTaskMonitoring();
    } catch (error) {
      console.warn('Performance monitoring setup failed:', error);
    }
  }

  /**
   * Monitor FPS and adjust quality accordingly
   */
  setupFPSMonitoring() {
    // ✅ SSR SAFE: Guard against server execution
    if (typeof window === 'undefined' || !this.mounted) return;
    
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsSum = 0;
    let measurements = 0;

    const measureFPS = (currentTime) => {
      if (!this.mounted) return; // ✅ Stop if component unmounted
      
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        fpsSum += fps;
        measurements++;
        frameCount = 0;
        lastTime = currentTime;
        
        // Adjust quality based on average FPS over last 5 seconds
        if (measurements >= 5) {
          const avgFPS = fpsSum / measurements;
          this.adjustQualityBasedOnFPS(avgFPS);
          fpsSum = 0;
          measurements = 0;
        }
      }
      
      this.rafId = requestAnimationFrame(measureFPS);
    };

    this.rafId = requestAnimationFrame(measureFPS);
  }

  /**
   * Monitor memory usage
   */
  setupMemoryMonitoring() {
    // ✅ SSR SAFE: Check for performance.memory
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memoryCheck = () => {
      if (!this.mounted) return; // ✅ Stop if unmounted
      
      try {
        const memory = performance.memory;
        const usedMB = memory.usedJSHeapSize / (1024 * 1024);
        
        if (usedMB > this.thresholds.memory[this.performanceLevel]) {
          this.downgradePerformance('memory');
        }
      } catch (error) {
        console.warn('Memory monitoring failed:', error);
      }
    };

    setInterval(memoryCheck, 5000);
  }

  /**
   * Monitor long tasks that block the main thread
   */
  setupLongTaskMonitoring() {
    // ✅ SSR SAFE: Try-catch around observer creation
    if (typeof window === 'undefined') return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        if (!this.mounted) return; // ✅ Stop if unmounted
        
        const longTasks = list.getEntries();
        if (longTasks.length > 2) { // Multiple long tasks detected
          this.downgradePerformance('longtasks');
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('Long task monitoring not supported');
    }
  }

  /**
   * Adjust animation quality based on FPS
   */
  adjustQualityBasedOnFPS(fps) {
    const { high, medium, low } = this.thresholds.fps;
    
    if (fps < low && this.performanceLevel !== 'low') {
      this.downgradePerformance('fps');
    } else if (fps > high && this.performanceLevel === 'medium') {
      this.upgradePerformance('fps');
    }
  }

  /**
   * Downgrade performance level
   */
  downgradePerformance(reason) {
    const oldLevel = this.performanceLevel;
    
    if (this.performanceLevel === 'high') {
      this.performanceLevel = 'medium';
    } else if (this.performanceLevel === 'medium') {
      this.performanceLevel = 'low';
    }
    
    if (oldLevel !== this.performanceLevel) {
      console.warn(`⬇️ Performance downgraded to ${this.performanceLevel} due to ${reason}`);
      this.applyPerformanceSettings();
    }
  }

  /**
   * Upgrade performance level
   */
  upgradePerformance(reason) {
    const oldLevel = this.performanceLevel;
    
    if (this.performanceLevel === 'medium') {
      this.performanceLevel = 'high';
    }
    
    if (oldLevel !== this.performanceLevel) {
      console.log(`⬆️ Performance upgraded to ${this.performanceLevel} due to ${reason}`);
      this.applyPerformanceSettings();
    }
  }

  /**
   * Apply performance settings to the document
   */
  applyPerformanceSettings() {
    // ✅ SSR SAFE: Only run on client
    if (typeof window === 'undefined' || !this.mounted) return;
    
    try {
      const root = document.documentElement;
      
      // Set data attribute for CSS targeting
      root.setAttribute('data-animation-quality', this.performanceLevel);
      
      // Set CSS custom properties
      const settings = this.getPerformanceSettings();
      
      Object.entries(settings).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      
      // Apply JavaScript-specific optimizations
      this.applyJavaScriptOptimizations();
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('animationQualityChanged', {
        detail: { level: this.performanceLevel, settings }
      }));
    } catch (error) {
      console.warn('Failed to apply performance settings:', error);
    }
  }

  /**
   * Get performance settings for current level
   */
  getPerformanceSettings() {
    const settings = {
      low: {
        '--animation-enabled': '0',
        '--filter-blur-light': 'none',
        '--filter-blur-medium': 'none',
        '--filter-blur-heavy': 'none',
        '--gradient-size': '100% 100%',
        '--animation-normal': '0.1s',
        '--animation-slow': '0.2s'
      },
      medium: {
        '--animation-enabled': '1',
        '--filter-blur-light': 'blur(2px)',
        '--filter-blur-medium': 'blur(4px)',
        '--filter-blur-heavy': 'blur(8px)',
        '--gradient-size': '200% 200%',
        '--animation-normal': '0.2s',
        '--animation-slow': '0.3s'
      },
      high: {
        '--animation-enabled': '1',
        '--filter-blur-light': 'blur(2px)',
        '--filter-blur-medium': 'blur(8px)',
        '--filter-blur-heavy': 'blur(16px)',
        '--gradient-size': '400% 400%',
        '--animation-normal': '0.3s',
        '--animation-slow': '0.6s'
      }
    };

    return settings[this.performanceLevel] || settings.medium;
  }

  /**
   * Apply JavaScript-specific optimizations
   */
  applyJavaScriptOptimizations() {
    if (typeof window === 'undefined' || !this.mounted) return;
    
    try {
      // Disable expensive features based on performance level
      if (this.performanceLevel === 'low') {
        this.disableExpensiveFeatures();
      } else {
        this.enableOptimizedFeatures();
      }
    } catch (error) {
      console.warn('JavaScript optimization failed:', error);
    }
  }

  /**
   * Disable expensive features for low-end devices
   */
  disableExpensiveFeatures() {
    if (typeof window === 'undefined') return;
    
    try {
      // Disable particle systems
      const particles = document.querySelectorAll('.particle-field-container');
      particles.forEach(particle => {
        particle.style.display = 'none';
      });
      
      // Disable complex animations
      const complexAnimations = document.querySelectorAll('.breathing-glow, .shimmer-effect');
      complexAnimations.forEach(el => {
        el.classList.add('animation-disabled');
      });
    } catch (error) {
      console.warn('Failed to disable expensive features:', error);
    }
  }

  /**
   * Enable optimized features for capable devices
   */
  enableOptimizedFeatures() {
    if (typeof window === 'undefined') return;
    
    try {
      // Re-enable particle systems with lower density
      const particles = document.querySelectorAll('.particle-field-container');
      particles.forEach(particle => {
        particle.style.display = '';
        if (this.performanceLevel === 'medium') {
          particle.style.opacity = '0.3';
        }
      });
    } catch (error) {
      console.warn('Failed to enable optimized features:', error);
    }
  }

  /**
   * Set up intersection observer for scroll animations
   */
  setupIntersectionObserver() {
    // ✅ SSR SAFE: Only run on client with IntersectionObserver support
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    
    try {
      const options = {
        root: null,
        rootMargin: '50px',
        threshold: this.performanceLevel === 'low' ? 0.5 : 0.1
      };

      this.intersectionObserver = new IntersectionObserver((entries) => {
        if (!this.mounted) return; // ✅ Stop if unmounted
        
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            this.triggerScrollAnimation(entry.target);
            this.animatedElements.add(entry.target);
          }
        });
      }, options);

      // Observe elements that should animate on scroll
      this.observeScrollAnimationElements();
    } catch (error) {
      console.warn('Intersection observer setup failed:', error);
    }
  }

  /**
   * Observe elements for scroll animations
   */
  observeScrollAnimationElements() {
    if (typeof window === 'undefined' || !this.intersectionObserver) return;
    
    try {
      const selectors = [
        '.scroll-reveal',
        '.fade-up-on-scroll',
        '.slide-in-left',
        '.scale-in',
        '.animate-on-scroll'
      ];

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          this.intersectionObserver.observe(el);
        });
      });
    } catch (error) {
      console.warn('Failed to observe scroll animation elements:', error);
    }
  }

  /**
   * Trigger scroll animation for an element
   */
  triggerScrollAnimation(element) {
    if (!element || typeof window === 'undefined') return;
    
    try {
      // Add appropriate animation class
      if (element.classList.contains('scroll-reveal')) {
        element.classList.add('is-visible');
      }
      
      if (element.classList.contains('fade-up-on-scroll') ||
          element.classList.contains('slide-in-left') ||
          element.classList.contains('scale-in')) {
        element.classList.add('animate');
      }
      
      // Clean up will-change after animation
      const animationDuration = parseFloat(getComputedStyle(element).animationDuration) * 1000;
      if (animationDuration) {
        setTimeout(() => {
          element.style.willChange = 'auto';
          element.classList.add('animation-complete');
        }, animationDuration);
      }
    } catch (error) {
      console.warn('Failed to trigger scroll animation:', error);
    }
  }

  /**
   * Set up dynamic quality control based on user interactions
   */
  setupDynamicQualityControl() {
    if (typeof window === 'undefined') return;
    
    try {
      // Battery API monitoring
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          const checkBattery = () => {
            if (!this.mounted) return; // ✅ Stop if unmounted
            
            if (battery.level < 0.2 && !battery.charging) {
              this.performanceLevel = 'low';
              this.applyPerformanceSettings();
            }
          };
          
          battery.addEventListener('levelchange', checkBattery);
          battery.addEventListener('chargingchange', checkBattery);
          checkBattery();
        }).catch(error => {
          console.warn('Battery API not available:', error);
        });
      }

      // Network change monitoring
      if ('connection' in navigator) {
        navigator.connection.addEventListener('change', () => {
          if (!this.mounted) return; // ✅ Stop if unmounted
          
          const connection = navigator.connection;
          if (connection.saveData || connection.effectiveType === 'slow-2g') {
            this.performanceLevel = 'low';
            this.applyPerformanceSettings();
          }
        });
      }

      // Page visibility API - pause animations when tab is hidden
      document.addEventListener('visibilitychange', () => {
        if (!this.mounted) return; // ✅ Stop if unmounted
        
        if (document.hidden) {
          this.pauseAnimations();
        } else {
          this.resumeAnimations();
        }
      });
    } catch (error) {
      console.warn('Dynamic quality control setup failed:', error);
    }
  }

  /**
   * Pause animations when page is not visible
   */
  pauseAnimations() {
    if (typeof window === 'undefined' || !this.mounted) return;
    
    try {
      document.documentElement.style.setProperty('--animation-enabled', '0');
      
      // Cancel RAF loop
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    } catch (error) {
      console.warn('Failed to pause animations:', error);
    }
  }

  /**
   * Resume animations when page becomes visible
   */
  resumeAnimations() {
    if (typeof window === 'undefined' || !this.mounted) return;
    
    try {
      const settings = this.getPerformanceSettings();
      document.documentElement.style.setProperty('--animation-enabled', settings['--animation-enabled']);
      
      // Restart FPS monitoring
      this.setupFPSMonitoring();
    } catch (error) {
      console.warn('Failed to resume animations:', error);
    }
  }

  /**
   * Public method to manually adjust animation quality
   */
  setAnimationQuality(level) {
    if (['low', 'medium', 'high'].includes(level)) {
      this.performanceLevel = level;
      this.applyPerformanceSettings();
      console.log(`🎛️ Animation quality manually set to ${level}`);
    }
  }

  /**
   * Public method to check if animations are enabled
   */
  areAnimationsEnabled() {
    return this.performanceLevel !== 'low' && !this.capabilities?.reducedMotion;
  }

  /**
   * Public method to add new elements for scroll animation
   */
  observeElement(element) {
    if (this.intersectionObserver && element && this.mounted) {
      this.intersectionObserver.observe(element);
    }
  }

  /**
   * Clean up resources
   */
  setupCleanup() {
    if (typeof window === 'undefined') return;
    
    const cleanup = () => {
      this.mounted = false; // ✅ Mark as unmounted
      
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
      }
    };

    window.addEventListener('beforeunload', cleanup);
    
    // ✅ Also cleanup on page navigation for SPA
    if ('navigation' in window) {
      window.navigation.addEventListener('navigate', cleanup);
    }
  }

  /**
   * Get current performance stats
   */
  getPerformanceStats() {
    const memoryUsage = typeof window !== 'undefined' && 'memory' in performance ? 
      (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + ' MB' : 
      'unknown';

    return {
      level: this.performanceLevel,
      capabilities: this.capabilities || {},
      animationsEnabled: this.areAnimationsEnabled(),
      memoryUsage,
      mounted: this.mounted
    };
  }
}

// ✅ SSR SAFE: Only initialize on client-side
let animationManager;
if (typeof window !== 'undefined') {
  animationManager = new AnimationPerformanceManager();
  
  // Export for global access
  window.AnimationPerformanceManager = animationManager;
  
  // Utility functions for easy access
  window.setAnimationQuality = (level) => animationManager?.setAnimationQuality(level);
  window.getAnimationStats = () => animationManager?.getPerformanceStats();
}

export default AnimationPerformanceManager;