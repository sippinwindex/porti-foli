// scripts/verify-navbar-pages.js
// Run this script to verify all navbar pages exist and export properly

const fs = require('fs');
const path = require('path');

// Define your expected navbar routes
const expectedRoutes = [
  { path: '/', file: 'app/page.tsx', name: 'Home' },
  { path: '/about', file: 'app/about/page.tsx', name: 'About' },
  { path: '/projects', file: 'app/projects/page.tsx', name: 'Projects' },
  { path: '/contact', file: 'app/contact/page.tsx', name: 'Contact' },
  { path: '/blog', file: 'app/blog/page.tsx', name: 'Blog' },
  { path: '/dino-game', file: 'app/dino-game/page.tsx', name: 'Dino Game' },
  // Add any other routes your navbar uses
];

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

function verifyNavbarPages() {
  console.log('🔍 Verifying Navbar Pages...\n');
  
  let allValid = true;
  const results = [];

  expectedRoutes.forEach(route => {
    const exists = checkPageExists(route.file);
    const hasExport = exists ? checkDefaultExport(route.file) : false;
    
    const status = {
      route: route.path,
      name: route.name,
      file: route.file,
      exists,
      hasDefaultExport: hasExport,
      valid: exists && hasExport
    };
    
    results.push(status);
    
    if (!status.valid) {
      allValid = false;
    }
    
    // Console output with emojis
    const icon = status.valid ? '✅' : '❌';
    const exportIcon = status.hasDefaultExport ? '📤' : '❌';
    const fileIcon = status.exists ? '📄' : '🚫';
    
    console.log(`${icon} ${route.name} (${route.path})`);
    console.log(`   ${fileIcon} File: ${route.file} ${status.exists ? 'EXISTS' : 'MISSING'}`);
    console.log(`   ${exportIcon} Export: ${status.hasDefaultExport ? 'VALID' : 'MISSING DEFAULT EXPORT'}`);
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
      console.log(`   - ${route.name}: ${!route.exists ? 'File missing' : 'No default export'}`);
    });
  }
  
  return { allValid, results };
}

// Run the verification
if (require.main === module) {
  verifyNavbarPages();
}

module.exports = { verifyNavbarPages, expectedRoutes };