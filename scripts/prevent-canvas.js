// This script aggressively removes canvas and image-js dependencies
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running prevent-canvas script...');

try {
  // Create a more aggressive .npmrc file
  const npmrcPath = path.join(process.cwd(), '.npmrc');
  const npmrcContent = `
# Prevent canvas installation
canvas=false
node-canvas=false
image-js=false
ignore-scripts=true
optional=false
fund=false
audit=false
`;

  fs.writeFileSync(npmrcPath, npmrcContent);
  console.log('Created .npmrc file to prevent canvas installation');

  // Create a node_modules/.hooks directory if it doesn't exist
  const hooksDir = path.join(process.cwd(), 'node_modules', '.hooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  // Create a preinstall hook to prevent canvas installation
  const preinstallHookPath = path.join(hooksDir, 'preinstall');
  const preinstallHookContent = `#!/bin/sh
echo "Preventing canvas installation"
exit 0
`;

  fs.writeFileSync(preinstallHookPath, preinstallHookContent);
  fs.chmodSync(preinstallHookPath, '755');
  console.log('Created preinstall hook to prevent canvas installation');

  // Check if package-lock.json exists and remove problematic dependencies
  const packageLockPath = path.join(process.cwd(), 'package-lock.json');
  if (fs.existsSync(packageLockPath)) {
    console.log('Found package-lock.json, removing problematic dependencies...');

    try {
      // Read the package-lock.json file
      const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));

      // Remove problematic dependencies
      if (packageLock.packages) {
        const problematicKeywords = [
          'canvas', 'node-canvas', '@mapbox/node-pre-gyp', 'image-js',
          'node-gyp', 'gyp', 'pre-gyp', 'nan'
        ];

        const keysToDelete = [];

        // Find all problematic packages
        for (const key in packageLock.packages) {
          if (problematicKeywords.some(keyword => key.includes(keyword))) {
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
        console.log('Successfully removed problematic dependencies from package-lock.json');
      }
    } catch (lockError) {
      console.error('Error processing package-lock.json:', lockError);
      // Continue even if there's an error with package-lock.json
    }
  } else {
    console.log('package-lock.json not found, skipping');
  }

  console.log('prevent-canvas script completed successfully');
} catch (error) {
  console.error('Error in prevent-canvas script:', error);
  process.exit(1);
}
