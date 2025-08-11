#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Path to API routes
const API_ROUTES_DIR = path.join(__dirname, '../src/app/api');

// Function to get the relative path to the error.ts file
function getRelativeErrorPath(filePath) {
  // Get the relative path from the file to the API directory
  const apiDirPath = path.resolve(API_ROUTES_DIR);
  const fileDir = path.dirname(path.resolve(filePath));
  
  // Count how many levels deep the file is from the API directory
  const relativePath = path.relative(fileDir, apiDirPath);
  
  // If the file is in the API directory, use './error'
  if (relativePath === '') {
    return './error';
  }
  
  // Otherwise, construct the path with the appropriate number of '../'
  return path.join(relativePath, 'error');
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

// Function to recursively process directories
async function processDirectory(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')) {
      await updateImports(fullPath);
    }
  }
}

// Main function
async function main() {
  console.log('🔄 Fixing import paths in coffee-shop-ops API routes...');
  await processDirectory(API_ROUTES_DIR);
  console.log('✨ Done!');
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});