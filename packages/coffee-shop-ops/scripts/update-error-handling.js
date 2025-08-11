const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Directory containing API routes
const API_DIR = path.join(__dirname, '../src/app/api');

// Function to process a file
async function processFile(filePath) {
  // Skip test files and error.ts
  if (filePath.includes('__tests__') || filePath.includes('error.ts')) {
    return;
  }

  try {
    // Read the file content
    const content = await readFile(filePath, 'utf8');
    
    // Check if this is a route file
    if (!content.includes('export async function') || !content.includes('NextResponse')) {
      return;
    }

    console.log(`Processing: ${filePath}`);
    
    // Remove try-catch blocks and replace with direct code
    let updatedContent = content;
    
    // Check if the file already imports ApiError
    const hasApiErrorImport = content.includes('import { ApiError }') || content.includes('import {ApiError}');
    
    // Add ApiError import if needed
    if (!hasApiErrorImport && content.includes('try {')) {
      if (content.includes('import { NextResponse }')) {
        updatedContent = updatedContent.replace(
          'import { NextResponse }',
          'import { NextResponse } from \'next/server\';\nimport { ApiError } from \'@/utils/error-handler\';'
        );
      } else if (content.includes('import {NextResponse}')) {
        updatedContent = updatedContent.replace(
          'import {NextResponse}',
          'import {NextResponse} from \'next/server\';\nimport { ApiError } from \'@/utils/error-handler\';'
        );
      } else if (content.includes('import { NextRequest, NextResponse }')) {
        updatedContent = updatedContent.replace(
          'import { NextRequest, NextResponse }',
          'import { NextRequest, NextResponse } from \'next/server\';\nimport { ApiError } from \'@/utils/error-handler\';'
        );
      }
    }
    
    // Pattern 1: Replace try-catch blocks with direct code
    const tryCatchPattern = /try\s*{([\s\S]*?)}\s*catch\s*\((error|err|e)\)\s*{[\s\S]*?console\.error\([^;]*\);?\s*return\s+NextResponse\.json\(\s*{[\s\S]*?}\s*,?\s*{[\s\S]*?}\s*\);?\s*}/g;
    
    updatedContent = updatedContent.replace(tryCatchPattern, (match, tryContent) => {
      return tryContent.trim();
    });
    
    // Also handle try-catch blocks that use handleRouteError
    const handleRouteErrorPattern = /try\s*{([\s\S]*?)}\s*catch\s*\((error|err|e)\)\s*{[\s\S]*?return\s+handleRouteError\([^;]*\);?\s*}/g;
    
    updatedContent = updatedContent.replace(handleRouteErrorPattern, (match, tryContent) => {
      return tryContent.trim();
    });
    
    // Pattern 2: Replace error checks that return error responses with throws
    updatedContent = updatedContent.replace(
      /if\s*\(\s*!\s*(\w+)\s*\)\s*{\s*(?:console\.error|console\.log)\([^;]*\);?\s*return\s+NextResponse\.json\(\s*{\s*(?:error|success\s*:\s*false)[^}]*}\s*,?\s*{\s*status\s*:\s*(\d+)\s*}\s*\);?\s*}/g,
      (match, variable, status) => {
        return `if (!${variable}) {\n    throw new ApiError(\`${variable} not found\`, ${status || 404});\n  }`;
      }
    );
    
    // Pattern 3: Replace error checks without status code
    updatedContent = updatedContent.replace(
      /if\s*\(\s*!\s*(\w+)\s*\)\s*{\s*(?:console\.error|console\.log)\([^;]*\);?\s*return\s+NextResponse\.json\(\s*{\s*(?:error|success\s*:\s*false)[^}]*}\s*\);?\s*}/g,
      (match, variable) => {
        return `if (!${variable}) {\n    throw new ApiError(\`${variable} not found\`, 404);\n  }`;
      }
    );
    
    // If changes were made, write the updated content back to the file
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`No changes needed for: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to recursively process all files in a directory
async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')) {
      await processFile(fullPath);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('Starting to update API routes to throw errors...');
    await processDirectory(API_DIR);
    console.log('Finished updating API routes.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();