#!/usr/bin/env node

/**
 * This script updates the error handling in all API routes to ensure errors are properly thrown.
 * It replaces direct error returns with throws and ensures consistent error handling patterns.
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

    // Pattern 1: Using handleApiError instead of handleRouteError
    if (newContent.includes('handleApiError') && !newContent.includes('import { handleRouteError }')) {
      newContent = newContent.replace(/import\s*{\s*handleApiError\s*}/g, 'import { handleRouteError } from "../error"');
      newContent = newContent.replace(/handleApiError/g, 'handleRouteError');
      updated = true;
    }

    // Pattern 2: Direct error creation without throwing
    // Example: if (!name) { return handleRouteError(new ApiError('Name is required', 400)); }
    const directErrorPattern = /if\s*\([^)]+\)\s*{\s*return\s+handleRouteError\(new ApiError\([^)]+\)\);\s*}/g;
    if (directErrorPattern.test(newContent)) {
      newContent = newContent.replace(directErrorPattern, (match) => {
        const errorArgs = match.match(/new ApiError\(([^)]+)\)/)[1];
        return `if (${match.match(/if\s*\(([^)]+)\)/)[1]}) { throw new ApiError(${errorArgs}); }`;
      });
      updated = true;
    }

    // Pattern 3: Validation errors without throwing
    // Example: if (!name) { const error = new ApiError('Name is required', 400); return handleRouteError(error); }
    const validationErrorPattern = /const\s+error\s*=\s*new ApiError\([^)]+\);\s*return\s+handleRouteError\(error\);/g;
    if (validationErrorPattern.test(newContent)) {
      newContent = newContent.replace(validationErrorPattern, (match) => {
        const errorArgs = match.match(/new ApiError\(([^)]+)\)/)[1];
        return `throw new ApiError(${errorArgs});`;
      });
      updated = true;
    }

    // Pattern 4: Missing try/catch blocks
    // This is more complex and would require parsing the function structure
    // For now, we'll focus on the simpler patterns

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