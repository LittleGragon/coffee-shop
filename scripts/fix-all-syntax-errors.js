#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Starting comprehensive syntax error fix...');

// Find all TypeScript files in the project
const tsFiles = [
  ...glob.sync('packages/api/src/**/*.ts'),
  ...glob.sync('packages/coffee-shop-ops/src/**/*.ts')
];

console.log(`Found ${tsFiles.length} TypeScript files to check`);

// Common syntax errors to fix
const fixSyntaxErrors = (content) => {
  let fixed = content;
  
  // Fix jest.mock syntax errors
  fixed = fixed.replace(/jest\.mock\('([^']+)'\s+\(\)\s+=>/g, "jest.mock('$1', () =>");
  
  // Fix import statements with missing commas
  fixed = fixed.replace(/import\s+{\s*([^}]+?)\s+}\s+from/g, (match, importList) => {
    const fixedImports = importList
      .replace(/\s+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .join(', ');
    return `import { ${fixedImports} } from`;
  });
  
  // Fix missing commas in function parameters
  fixed = fixed.replace(/\(([^)]+?)\s+([a-zA-Z0-9_]+)\)/g, (match, param1, param2) => {
    if (!param1.includes(',')) {
      return `(${param1}, ${param2})`;
    }
    return match;
  });
  
  // Fix missing commas in object literals
  fixed = fixed.replace(/\{\s*([a-zA-Z0-9_]+):\s*([^,}]+)\s+([a-zA-Z0-9_]+):/g, '{$1: $2, $3:');
  
  // Fix missing commas in console.error calls
  fixed = fixed.replace(/console\.error\('([^']+)'\s+([a-zA-Z0-9_]+)\)/g, "console.error('$1', $2)");
  
  // Fix missing commas in function calls
  fixed = fixed.replace(/\(([^,)]+)\s+([a-zA-Z0-9_]+)\)/g, (match, arg1, arg2) => {
    // Skip if this is a function declaration
    if (match.includes('=>') || match.includes('function')) {
      return match;
    }
    return `(${arg1}, ${arg2})`;
  });
  
  // Fix missing commas in describe/it blocks
  fixed = fixed.replace(/describe\('([^']+)'\s+\(\)/g, "describe('$1', ()");
  fixed = fixed.replace(/it\('([^']+)'\s+\(\)/g, "it('$1', ()");
  fixed = fixed.replace(/test\('([^']+)'\s+\(\)/g, "test('$1', ()");
  
  // Fix async function declarations
  fixed = fixed.replace(/async\s+\(\)\s+=>/g, "async () =>");
  
  return fixed;
};

// Process each file
let fixedFiles = 0;
tsFiles.forEach(filePath => {
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
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      // Fix missing comma in console.error call
      const fixedContent = content.replace(/console\.error\('API Error:'\s+error\)/g, "console.error('API Error:', error)");
      
      if (content !== fixedContent) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`Fixed error handling in: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

// Fix specific error in orderService.ts
const serviceFiles = glob.sync('packages/**/src/services/**/*.ts');

serviceFiles.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      // Fix missing comma in console.error call
      const fixedContent = content.replace(/console\.error\('([^']+)'\s+([a-zA-Z0-9_]+)\)/g, "console.error('$1', $2)");
      
      if (content !== fixedContent) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`Fixed error handling in: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log('Syntax error fixing completed!');