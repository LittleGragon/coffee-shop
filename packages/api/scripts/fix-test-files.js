#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix a test file
function fixTestFile(filePath) {
  try {
    console.log(`Reading file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Fix common syntax errors in test files
    let fixedContent = content
      // Fix double commas in imports
      .replace(/import\s*{([^}]*),\s*,\s*([^}]*)}/g, 'import {$1, $2}')
      // Fix commas in function declarations
      .replace(/\)\s*,\s*\(\s*\)/g, ') => ()')
      .replace(/\)\s*,\s*async\s*\(\s*\)/g, ') => async ()');
    
    // Write the fixed content back to the file
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`Fixed test file: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error(`Error fixing test file ${filePath}: ${error.message}`);
    return false;
  }
}

// Function to fix the menu test file
function fixMenuTestFile() {
  const filePath = path.join(__dirname, '../src/app/api/menu/__tests__/route.test.ts');
  return fixTestFile(filePath);
}

// Function to fix all test files in a directory recursively
function fixAllTestFiles(directory) {
  try {
    const files = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        // Recursively process subdirectories
        fixAllTestFiles(fullPath);
      } else if (file.name.endsWith('.test.ts') || file.name.endsWith('.test.js')) {
        // Fix test files
        fixTestFile(fullPath);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error processing directory ${directory}: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  // Fix specific test files that we know have issues
  const menuFixed = fixMenuTestFile();
  
  if (menuFixed) {
    console.log('Successfully fixed menu test file');
  } else {
    console.error('Failed to fix menu test file');
  }
  
  // Fix all test files in the API routes directory
  const apiRoutesDir = path.join(__dirname, '../src/app/api');
  const allFixed = fixAllTestFiles(apiRoutesDir);
  
  if (allFixed) {
    console.log('Successfully fixed all test files in API routes directory');
  } else {
    console.error('Failed to fix all test files in API routes directory');
  }
}

// Execute the main function
main();