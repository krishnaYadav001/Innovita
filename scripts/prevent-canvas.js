// This script modifies package-lock.json to remove canvas dependencies
const fs = require('fs');
const path = require('path');

console.log('Running prevent-canvas script...');

try {
  // Check if package-lock.json exists
  const packageLockPath = path.join(process.cwd(), 'package-lock.json');
  if (fs.existsSync(packageLockPath)) {
    console.log('Found package-lock.json, removing canvas dependencies...');
    
    // Read the package-lock.json file
    const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
    
    // Remove canvas from dependencies
    if (packageLock.packages) {
      const keysToDelete = [];
      
      // Find all canvas-related packages
      for (const key in packageLock.packages) {
        if (key.includes('canvas') || 
            key.includes('node-canvas') || 
            key.includes('@mapbox/node-pre-gyp')) {
          keysToDelete.push(key);
        }
      }
      
      // Delete the found packages
      keysToDelete.forEach(key => {
        console.log(`Removing ${key} from package-lock.json`);
        delete packageLock.packages[key];
      });
      
      // Write the modified package-lock.json back to disk
      fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2));
      console.log('Successfully removed canvas dependencies from package-lock.json');
    }
  } else {
    console.log('package-lock.json not found, skipping');
  }
  
  // Create a .npmrc file to prevent canvas installation
  const npmrcPath = path.join(process.cwd(), '.npmrc');
  const npmrcContent = `
canvas=false
node-canvas=false
ignore-scripts=true
optional=false
`;
  
  fs.writeFileSync(npmrcPath, npmrcContent);
  console.log('Created .npmrc file to prevent canvas installation');
  
} catch (error) {
  console.error('Error in prevent-canvas script:', error);
  process.exit(1);
}

console.log('prevent-canvas script completed successfully');
