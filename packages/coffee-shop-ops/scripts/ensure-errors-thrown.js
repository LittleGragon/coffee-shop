#!/usr/bin/env node

/**
 * This script ensures that all API routes properly throw errors instead of just returning them.
 * It scans all API route files and updates the error handling pattern if needed.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Directory containing API routes
const API_DIR = path.join(__dirname, '../src/app/api');

// Function to recursively get all files in a directory
async function getAllFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getAllFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

// Function to update error handling in a file
async function updateErrorHandling(filePath) {
  try {
    // Skip the error.ts file itself
    if (filePath.endsWith('error.ts')) {
      return false;
    }

    // Only process TypeScript files
    if (!filePath.endsWith('.ts')) {
      return false;
    }

    const content = await readFile(filePath, 'utf8');
    
    // Check if this is a route file (contains export async function)
    if (!content.includes('export async function')) {
      return false;
    }

    console.log(`Processing: ${filePath}`);
    
    let updated = false;
    let newContent = content;

    // Pattern 1: Direct return of error without throwing
    // Example: if (error) { return handleRouteError(error); }
    const directReturnPattern = /if\s*\([^)]+\)\s*{\s*return\s+handleRouteError\([^)]+\);\s*}/g;
    if (directReturnPattern.test(newContent)) {
      newContent = newContent.replace(directReturnPattern, (match) => {
        const errorVar = match.match(/handleRouteError\(([^)]+)\)/)[1];
        return `if (${errorVar}) { throw ${errorVar}; }`;
      });
      updated = true;
    }

    // Pattern 2: Catch block that returns handleRouteError
    // Example: catch (error) { return handleRouteError(error); }
    const catchReturnPattern = /catch\s*\(([^)]+)\)\s*{\s*return\s+handleRouteError\([^)]+\);\s*}/g;
    
    // We don't want to change this pattern as it's the correct way to handle errors in API routes
    // The error should be caught at the route level and formatted with handleRouteError
    
    // Pattern 3: Error handling without throwing
    // Example: if (!name) { const error = new ApiError('Name is required', 400); return handleRouteError(error); }
    const errorWithoutThrowPattern = /new ApiError\([^)]+\);\s*return\s+handleRouteError/g;
    if (errorWithoutThrowPattern.test(newContent)) {
      newContent = newContent.replace(errorWithoutThrowPattern, (match) => {
        return match.replace('return handleRouteError', 'throw');
      });
      updated = true;
    }

    // If we made changes, write the file
    if (updated) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  try {
    const files = await getAllFiles(API_DIR);
    let updatedCount = 0;
    
    for (const file of files) {
      const updated = await updateErrorHandling(file);
      if (updated) {
        updatedCount++;
      }
    }
    
    console.log(`\nCompleted! Updated ${updatedCount} files.`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();