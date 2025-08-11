const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

// Path to the API routes directory
const API_ROUTES_DIR = path.resolve(__dirname, '../src/app/api');

// Function to fix .ts extensions in import paths
async function fixTsExtensions(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Replace .ts extensions in import paths
    const updatedContent = content.replace(
      /from\s+['"]([^'"]+)\.ts['"]/g,
      'from "$1"'
    );
    
    // Write back if changes were made
    if (updatedContent !== content) {
      await fs.writeFile(filePath, updatedContent);
      console.log(`✅ Fixed .ts extensions in: ${filePath}`);
    } else {
      console.log(`⏭️ No .ts extensions found in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing .ts extensions in ${filePath}:`, error);
  }
}

// Main function to process all API route files
async function main() {
  try {
    console.log('🔄 Fixing .ts extensions in import paths...');
    
    // Find all TypeScript files in the API routes directory
    const files = await glob(`${API_ROUTES_DIR}/**/*.ts`);
    
    // Process each file
    for (const file of files) {
      await fixTsExtensions(file);
    }
    
    console.log('✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
main();