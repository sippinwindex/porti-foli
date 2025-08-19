// Navbar Height Fix for Next.js App Router
// Place this file at: /public/js/navbar-fix.js

(function() {
    'use strict';
    
    console.log('🔧 Initializing navbar fix...');
    
    // Configuration for different screen sizes
    const NAVBAR_CONFIG = {
        desktop: { height: '5rem', maxWidth: Infinity },
        tablet: { height: '4rem', maxWidth: 1024 },
        mobile: { height: '3.5rem', maxWidth: 768 }
    };
    
    function getScreenType() {
        const width = window.innerWidth;
        if (width <= NAVBAR_CONFIG.mobile.maxWidth) return 'mobile';
        if (width <= NAVBAR_CONFIG.tablet.maxWidth) return 'tablet';
        return 'desktop';
    }
    
    function fixNavbarHeight() {
        // Find navbar using comprehensive selectors
        const navbarSelectors = [
            'nav',
            '.navbar',
            'header[role="navigation"]',
            '[data-navbar]',
            '.navigation',
            '#navbar',
            '#navigation',
            '[class*="nav"]',
            '[class*="header"]'
        ];
        
        let navbar = null;
        for (const selector of navbarSelectors) {
            navbar = document.querySelector(selector);
            if (navbar) {
                console.log(`📍 Found navbar using: ${selector}`);
                break;
            }
        }
        
        if (!navbar) {
            console.warn('⚠️ No navbar found. Retrying in 1 second...');
            setTimeout(fixNavbarHeight, 1000);
            return;
        }
        
        // Get appropriate height for current screen size
        const screenType = getScreenType();
        const height = NAVBAR_CONFIG[screenType].height;
        
        // Apply critical styles
        const criticalStyles = {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            width: '100%',
            height: height,
            minHeight: height,
            maxHeight: height,
            zIndex: '1000',
            overflow: 'visible',
            boxSizing: 'border-box'
        };
        
        // Apply styles to navbar
        Object.assign(navbar.style, criticalStyles);
        
        // Fix navbar container if it exists
        const container = navbar.querySelector('.container, .container-fluid, .navbar-container, .nav-container');
        if (container) {
            Object.assign(container.style, {
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '100%',
                overflow: 'visible'
            });
        }
        
        // Fix body padding to prevent content jumping
        document.body.style.paddingTop = height;
        
        // Ensure all clickable elements are accessible
        const clickableElements = navbar.querySelectorAll('a, button, [role="button"], [tabindex], input, select, textarea');
        clickableElements.forEach((element, index) => {
            element.style.position = 'relative';
            element.style.zIndex = '2';
            element.style.pointerEvents = 'auto';
            element.style.cursor = 'pointer';
            
            // Debug clickable elements
            if (window.location.search.includes('debug')) {
                element.style.outline = '1px solid lime';
                element.title = `Clickable element ${index + 1}`;
            }
        });
        
        // Fix mobile menu if it exists
        fixMobileMenu(navbar);
        
        console.log(`✅ Navbar fixed for ${screenType} (${height})`);
        
        // Set CSS custom property for other components
        document.documentElement.style.setProperty('--navbar-height', height);
        
        return true;
    }
    
    function fixMobileMenu(navbar) {
        // Find mobile toggle button
        const toggleSelectors = [
            '.navbar-toggler',
            '.mobile-toggle',
            '.hamburger',
            '[data-bs-toggle="collapse"]',
            '[data-toggle="collapse"]',
            '.menu-toggle',
            '[aria-expanded]'
        ];
        
        let toggleButton = null;
        for (const selector of toggleSelectors) {
            toggleButton = navbar.querySelector(selector);
            if (toggleButton) break;
        }
        
        if (!toggleButton) return;
        
        // Find mobile menu
        const menuSelectors = [
            '.navbar-collapse',
            '.navbar-nav',
            '.nav-menu',
            '.mobile-menu',
            '.collapse'
        ];
        
        let mobileMenu = null;
        for (const selector of menuSelectors) {
            mobileMenu = navbar.querySelector(selector) || document.querySelector(selector);
            if (mobileMenu) break;
        }
        
        if (!mobileMenu) return;
        
        // Ensure toggle button is clickable
        toggleButton.style.position = 'relative';
        toggleButton.style.zIndex = '3';
        toggleButton.style.pointerEvents = 'auto';
        
        console.log('📱 Mobile menu components found and fixed');
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Initialize when DOM is ready
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fixNavbarHeight);
        } else {
            fixNavbarHeight();
        }
        
        // Handle window resize
        window.addEventListener('resize', debounce(fixNavbarHeight, 150));
        
        // Handle Next.js route changes
        let currentPath = window.location.pathname;
        const checkRouteChange = () => {
            if (window.location.pathname !== currentPath) {
                currentPath = window.location.pathname;
                console.log('🔄 Route changed, fixing navbar...');
                setTimeout(fixNavbarHeight, 100);
            }
        };
        
        // Check for route changes every 500ms
        setInterval(checkRouteChange, 500);
        
        // Listen for browser navigation
        window.addEventListener('popstate', () => {
            setTimeout(fixNavbarHeight, 100);
        });
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            setTimeout(fixNavbarHeight, 50);
        });
        
        // Final safety check after everything loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                fixNavbarHeight();
                console.log('🏁 Final navbar check completed');
            }, 500);
        });
    }
    
    // Global utilities for debugging
    window.NavbarDebug = {
        fix: fixNavbarHeight,
        config: NAVBAR_CONFIG,
        getScreenType: getScreenType,
        findNavbar: () => {
            const selectors = ['nav', '.navbar', 'header[role="navigation"]'];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el) return el;
            }
            return null;
        }
    };
    
    // Auto-initialize
    initialize();
    
    console.log('🚀 Navbar fix script loaded and ready');
    
})();