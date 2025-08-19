// scripts/verify-navbar-pages.js
// Run this script to verify all navbar pages exist and work properly

const fs = require('fs');
const path = require('path');

// Define your expected navbar routes based on your app
const expectedRoutes = [
  { path: '/', file: 'app/page.tsx', name: 'Home' },
  { path: '/about', file: 'app/about/page.tsx', name: 'About' },
  { path: '/projects', file: 'app/projects/page.tsx', name: 'Projects' },
  { path: '/blog', file: 'app/blog/page.tsx', name: 'Blog' },
  { path: '/dino-game', file: 'app/dino-game/page.tsx', name: 'Dino Game' },
  { path: '/contact', file: 'app/contact/page.tsx', name: 'Contact' },
];

// Helper functions
function checkPageExists(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  return fs.existsSync(fullPath);
}

function checkDefaultExport(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for default export patterns
    const hasDefaultExport = 
      content.includes('export default') || 
      content.includes('export { default }') ||
      content.match(/export\s*\{\s*\w+\s+as\s+default\s*\}/);
    
    return hasDefaultExport;
  } catch (error) {
    return false;
  }
}

function checkForErrors(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Common error patterns
    const errorPatterns = [
      /import.*from\s+['"]\.\//g, // Relative imports that might be wrong
      /useClient\s*\(\)/g, // Wrong use client pattern
      /useState.*=.*undefined/g, // Undefined state
      /\berror\b.*=.*new Error/gi, // Error objects
    ];
    
    const errors = [];
    errorPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        errors.push({
          pattern: pattern.toString(),
          matches: matches.length
        });
      }
    });
    
    return errors;
  } catch (error) {
    return [{ pattern: 'File read error', matches: 1 }];
  }
}

function verifyNavbarPages() {
  console.log('🔍 Verifying Navbar Pages...\n');
  
  let allValid = true;
  const results = [];

  expectedRoutes.forEach(route => {
    const exists = checkPageExists(route.file);
    const hasExport = exists ? checkDefaultExport(route.file) : false;
    const errors = exists ? checkForErrors(route.file) : [];
    
    const status = {
      route: route.path,
      name: route.name,
      file: route.file,
      exists,
      hasDefaultExport: hasExport,
      errors: errors,
      valid: exists && hasExport && errors.length === 0
    };
    
    results.push(status);
    
    if (!status.valid) {
      allValid = false;
    }
    
    // Console output with emojis
    const icon = status.valid ? '✅' : '❌';
    const exportIcon = status.hasDefaultExport ? '📤' : '❌';
    const fileIcon = status.exists ? '📄' : '🚫';
    const errorIcon = status.errors.length === 0 ? '✨' : '⚠️';
    
    console.log(`${icon} ${route.name} (${route.path})`);
    console.log(`   ${fileIcon} File: ${route.file} ${status.exists ? 'EXISTS' : 'MISSING'}`);
    console.log(`   ${exportIcon} Export: ${status.hasDefaultExport ? 'VALID' : 'MISSING DEFAULT EXPORT'}`);
    console.log(`   ${errorIcon} Errors: ${status.errors.length === 0 ? 'NONE' : status.errors.length + ' FOUND'}`);
    
    if (status.errors.length > 0) {
      console.log(`       Issues: ${status.errors.map(e => e.pattern).join(', ')}`);
    }
    console.log('');
  });
  
  // Summary
  console.log('📋 SUMMARY:');
  console.log(`   Total Routes: ${expectedRoutes.length}`);
  console.log(`   Valid Routes: ${results.filter(r => r.valid).length}`);
  console.log(`   Invalid Routes: ${results.filter(r => !r.valid).length}`);
  
  if (allValid) {
    console.log('\n🎉 All navbar pages are properly configured!');
  } else {
    console.log('\n⚠️  Some navbar pages need attention:');
    results.filter(r => !r.valid).forEach(route => {
      console.log(`   - ${route.name}: ${!route.exists ? 'File missing' : !route.hasDefaultExport ? 'No default export' : 'Has errors'}`);
    });
    
    console.log('\n🛠️  FIXES NEEDED:');
    console.log('1. Update Navigation component routes to match existing pages');
    console.log('2. Ensure all pages have proper default exports');
    console.log('3. Fix any syntax/import errors in page files');
    console.log('4. Replace Navigation.tsx with the fixed version provided');
  }
  
  // Check Navigation.tsx specifically
  console.log('\n🧭 NAVIGATION COMPONENT CHECK:');
  const navExists = checkPageExists('components/Navigation.tsx');
  const navHasExport = navExists ? checkDefaultExport('components/Navigation.tsx') : false;
  
  console.log(`   📄 Navigation.tsx: ${navExists ? 'EXISTS' : 'MISSING'}`);
  console.log(`   📤 Default Export: ${navHasExport ? 'VALID' : 'MISSING'}`);
  
  if (navExists) {
    try {
      const navContent = fs.readFileSync(path.join(process.cwd(), 'components/Navigation.tsx'), 'utf8');
      const routeMatches = navContent.match(/href:\s*['"][^'"]+['"]/g) || [];
      console.log(`   🔗 Routes found: ${routeMatches.length}`);
      console.log(`   📍 Routes: ${routeMatches.map(r => r.replace(/href:\s*['"]|['"]/g, '')).join(', ')}`);
    } catch (err) {
      console.log('   ⚠️  Could not analyze Navigation.tsx routes');
    }
  }
  
  return { allValid, results };
}

// Run the verification
if (require.main === module) {
  const result = verifyNavbarPages();
  
  // Exit with error code if issues found
  process.exit(result.allValid ? 0 : 1);
}

module.exports = { verifyNavbarPages, expectedRoutes };