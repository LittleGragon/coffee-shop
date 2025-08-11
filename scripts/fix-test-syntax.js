#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all test files in the project
const testFiles = [
  ...glob.sync('packages/api/src/**/__tests__/**/*.ts'),
  ...glob.sync('packages/api/src/app/api/**/__tests__/**/*.ts')
];

console.log(`Found ${testFiles.length} test files to check`);

// Common syntax errors to fix
const fixSyntaxErrors = (content) => {
  // Fix jest.mock syntax errors
  content = content.replace(/jest\.mock\('([^']+)'\s+\(\)\s+=>/g, "jest.mock('$1', () =>");
  
  // Fix import statements with missing commas
  content = content.replace(/import\s+{\s*([^}]+?)\s+}\s+from/g, (match, importList) => {
    const fixedImports = importList
      .replace(/\s+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .join(', ');
    return `import { ${fixedImports} } from`;
  });
  
  // Fix missing commas in function parameters
  content = content.replace(/\(([^)]+?)\s+([a-zA-Z0-9_]+)\)/g, (match, param1, param2) => {
    if (!param1.includes(',')) {
      return `(${param1}, ${param2})`;
    }
    return match;
  });
  
  // Fix missing commas in object literals
  content = content.replace(/\{\s*([a-zA-Z0-9_]+):\s*([^,}]+)\s+([a-zA-Z0-9_]+):/g, '{$1: $2, $3:');
  
  return content;
};

// Process each file
let fixedFiles = 0;
testFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixSyntaxErrors(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed syntax in: ${filePath}`);
      fixedFiles++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`Fixed syntax errors in ${fixedFiles} files`);

// Fix specific error in error.ts files
const errorFiles = [
  'packages/api/src/app/api/error.ts',
  'packages/coffee-shop-ops/src/app/api/error.ts'
];

errorFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Fix missing comma in console.error call
    const fixedContent = content.replace(/console\.error\('API Error:'\s+error\)/g, "console.error('API Error:', error)");
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed error handling in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

// Fix specific error in orderService.ts
const orderServiceFiles = [
  'packages/api/src/services/orderService.ts',
  'packages/coffee-shop-ops/src/services/orderService.ts'
];

orderServiceFiles.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      // Fix missing comma in console.error call
      const fixedContent = content.replace(/console\.error\('Error creating order:'\s+error\)/g, "console.error('Error creating order:', error)");
      
      if (content !== fixedContent) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`Fixed error handling in: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});