// Custom build script for Vercel that avoids canvas installation
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting custom Vercel build script...');

// Run the prevent-canvas script first
require('./prevent-canvas');

// Create a temporary package.json without problematic dependencies
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Make a backup of the original package.json
  fs.writeFileSync(
    path.join(process.cwd(), 'package.json.backup'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Remove any problematic dependencies
  const problematicDeps = ['canvas', 'image-js', 'node-canvas'];
  
  if (packageJson.dependencies) {
    problematicDeps.forEach(dep => {
      if (packageJson.dependencies[dep]) {
        console.log(`Removing ${dep} from dependencies`);
        delete packageJson.dependencies[dep];
      }
    });
  }
  
  if (packageJson.devDependencies) {
    problematicDeps.forEach(dep => {
      if (packageJson.devDependencies[dep]) {
        console.log(`Removing ${dep} from devDependencies`);
        delete packageJson.devDependencies[dep];
      }
    });
  }
  
  // Write the modified package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Created clean package.json without problematic dependencies');
  
  // Run the Next.js build
  console.log('Running Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  
  // Restore the original package.json
  fs.copyFileSync(
    path.join(process.cwd(), 'package.json.backup'),
    packageJsonPath
  );
  fs.unlinkSync(path.join(process.cwd(), 'package.json.backup'));
  console.log('Restored original package.json');
  
  console.log('Custom build completed successfully');
} catch (error) {
  console.error('Error in custom build script:', error);
  process.exit(1);
}
