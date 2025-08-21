// Simplified Navbar Fix Script for Next.js App Router
// Place this file at: /public/js/navbar-fix.js

(function() {
    'use strict';
    
    console.log('🔧 Initializing simplified navbar fix...');
    
    // Simple configuration
    const NAVBAR_HEIGHT = '4rem';
    const NAVBAR_Z_INDEX = '50';
    
    let initialized = false;
    let observer = null;
    
    function ensureNavbarPosition() {
        // Don't run if already initialized or if we're in development mode
        if (initialized) {
            return;
        }
        
        try {
            // Find the navbar using simple selector
            const navbar = document.querySelector('nav');
            
            if (!navbar) {
                console.log('📍 Navbar not found, will retry...');
                return false;
            }
            
            console.log('📍 Found navbar, applying fixes...');
            
            // Get current computed styles
            const currentStyle = window.getComputedStyle(navbar);
            
            // Only apply fixes if needed
            if (currentStyle.position !== 'fixed' || 
                currentStyle.top !== '0px' || 
                currentStyle.zIndex < NAVBAR_Z_INDEX) {
                
                // Apply essential styles with !important to override
                const essentialStyles = `
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    height: ${NAVBAR_HEIGHT} !important;
                    z-index: ${NAVBAR_Z_INDEX} !important;
                    box-sizing: border-box !important;
                `;
                
                navbar.style.cssText = essentialStyles + navbar.style.cssText;
                
                console.log('✅ Navbar positioning fixed');
            } else {
                console.log('✅ Navbar already properly positioned');
            }
            
            // Ensure body has proper top padding
            const body = document.body;
            if (!body.style.paddingTop || body.style.paddingTop === '0px') {
                body.style.paddingTop = NAVBAR_HEIGHT;
                console.log('✅ Body padding applied');
            }
            
            // Set CSS custom property for consistency
            document.documentElement.style.setProperty('--navbar-height', NAVBAR_HEIGHT);
            
            initialized = true;
            return true;
            
        } catch (error) {
            console.error('❌ Error in navbar fix:', error);
            return false;
        }
    }
    
    function initializeWithRetry() {
        // Try immediate fix
        if (ensureNavbarPosition()) {
            return;
        }
        
        // If not successful, set up observer for DOM changes
        if (!observer) {
            observer = new MutationObserver((mutations) => {
                let shouldCheck = false;
                
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check if any added nodes contain a nav element
                        for (let node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.tagName === 'NAV' || node.querySelector('nav')) {
                                    shouldCheck = true;
                                    break;
                                }
                            }
                        }
                    }
                });
                
                if (shouldCheck && ensureNavbarPosition()) {
                    observer.disconnect();
                    observer = null;
                }
            });
            
            // Start observing
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            console.log('👀 Observer set up to watch for navbar');
        }
        
        // Also try with a simple timeout as fallback
        setTimeout(() => {
            if (!initialized && ensureNavbarPosition()) {
                if (observer) {
                    observer.disconnect();
                    observer = null;
                }
            }
        }, 1000);
    }
    
    function handleRouteChange() {
        // Reset initialization flag on route changes
        initialized = false;
        setTimeout(() => {
            initializeWithRetry();
        }, 100);
    }
    
    // Initialize based on current DOM state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWithRetry);
    } else {
        initializeWithRetry();
    }
    
    // Handle Next.js route changes
    let currentPath = window.location.pathname;
    setInterval(() => {
        if (window.location.pathname !== currentPath) {
            currentPath = window.location.pathname;
            console.log('🔄 Route changed, checking navbar...');
            handleRouteChange();
        }
    }, 1000);
    
    // Handle browser navigation
    window.addEventListener('popstate', handleRouteChange);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (initialized) {
            ensureNavbarPosition();
        }
    });
    
    // Final check after everything loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!initialized) {
                console.log('🔄 Final navbar check...');
                initializeWithRetry();
            }
        }, 500);
    });
    
    // Global debug utilities
    window.NavbarFix = {
        status: () => ({
            initialized,
            navbarFound: !!document.querySelector('nav'),
            currentHeight: document.documentElement.style.getPropertyValue('--navbar-height'),
            bodyPadding: document.body.style.paddingTop
        }),
        force: () => {
            initialized = false;
            initializeWithRetry();
        },
        reset: () => {
            initialized = false;
            const navbar = document.querySelector('nav');
            if (navbar) {
                navbar.style.cssText = '';
            }
            document.body.style.paddingTop = '';
            console.log('🔄 Navbar reset complete');
        }
    };
    
    console.log('🚀 Simplified navbar fix script loaded');
    
})();