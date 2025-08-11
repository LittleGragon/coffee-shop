const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

const { readFile, writeFile } = fs.promises;

// Path to the API routes directory
const API_ROUTES_DIR = path.resolve(__dirname, '../src/app/api');

// Function to get the relative path to error.ts from a file
function getRelativeErrorPath(filePath) {
  const fileDir = path.dirname(filePath);
  const errorPath = path.relative(fileDir, path.join(API_ROUTES_DIR, 'error.ts'));
  return errorPath.startsWith('.') ? errorPath : `./${errorPath}`;
}

// Function to update imports in a file
async function updateImports(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Skip files that don't have handleRouteError or handleApiError
    if (!content.includes('handleRouteError') && !content.includes('handleApiError')) {
      return;
    }
    
    // Get the correct relative path to error.ts
    const errorPath = getRelativeErrorPath(filePath);
    
    let updatedContent = content;
    
    // Case 1: File already has handleRouteError but needs import fixed
    if (content.includes('handleRouteError')) {
      updatedContent = updatedContent.replace(
        /import\s*{\s*handleRouteError\s*}\s*from\s*['"]([^'"]+)['"]/g,
        `import { handleRouteError } from '${errorPath}'`
      );
    }
    
    // Case 2: File has handleApiError but uses handleRouteError
    if (content.includes('handleApiError') && content.includes('handleRouteError')) {
      updatedContent = updatedContent.replace(
        /import\s*{\s*handleApiError,\s*ApiError\s*}\s*from\s*['"]@\/utils\/error-handler['"]/g,
        `import { ApiError } from '@/utils/error-handler';\nimport { handleRouteError } from '${errorPath}'`
      );
    }
    
    // Case 3: File has handleApiError but needs to switch to handleRouteError
    if (content.includes('handleApiError') && !content.includes('handleRouteError')) {
      updatedContent = updatedContent.replace(
        /import\s*{\s*handleApiError,\s*ApiError\s*}\s*from\s*['"]@\/utils\/error-handler['"]/g,
        `import { ApiError } from '@/utils/error-handler';\nimport { handleRouteError } from '${errorPath}'`
      );
      
      // Replace handleApiError with handleRouteError in the code
      updatedContent = updatedContent.replace(
        /handleApiError\(/g,
        'handleRouteError('
      );
    }
    
    // Write back if changes were made
    if (updatedContent !== content) {
      await writeFile(filePath, updatedContent);
      console.log(`✅ Updated imports in: ${filePath}`);
    } else {
      console.log(`⏭️ No import changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating imports in ${filePath}:`, error);
  }
}

// Main function to process all API route files
async function main() {
  try {
    console.log('🔄 Fixing import paths in API routes...');
    
    // Find all TypeScript files in the API routes directory
    const files = await glob(`${API_ROUTES_DIR}/**/*.ts`);
    
    // Process each file
    for (const file of files) {
      await updateImports(file);
    }
    
    console.log('✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
main();