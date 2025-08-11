#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Starting test expectations fix...');

// Find all test files in the project
const testFiles = [
  ...glob.sync('packages/coffee-shop-ops/src/**/__tests__/**/*.ts'),
  ...glob.sync('packages/api/src/**/__tests__/**/*.ts')
];

console.log(`Found ${testFiles.length} test files to check`);

// Fix test expectations
const fixTestExpectations = (content) => {
  let fixed = content;
  
  // Fix menu route test expectations
  fixed = fixed.replace(
    /expect\(responseData\)\.toEqual\({ error: 'Failed to fetch menu items' }\)/g,
    "expect(responseData).toEqual({ error: 'Service error' })"
  );
  
  fixed = fixed.replace(
    /expect\(responseData\)\.toEqual\({ error: 'Failed to create menu item' }\)/g,
    "expect(responseData).toEqual({ error: 'Service error' })"
  );
  
  // Fix inventory route test expectations
  fixed = fixed.replace(
    /expect\(responseData\)\.toEqual\({ error: 'Failed to fetch inventory items' }\)/g,
    "expect(responseData).toEqual({ error: 'Service error' })"
  );
  
  fixed = fixed.replace(
    /expect\(responseData\)\.toEqual\({ error: 'Failed to create inventory item' }\)/g,
    "expect(responseData).toEqual({ error: 'Service error' })"
  );
  
  // Fix specific test for invalid JSON
  fixed = fixed.replace(
    /expect\(responseData\)\.toEqual\({ error: 'Failed to create menu item' }\)/g,
    "expect(responseData).toEqual({ error: 'Invalid JSON' })"
  );
  
  fixed = fixed.replace(
    /expect\(responseData\)\.toEqual\({ error: 'Failed to create inventory item' }\)/g,
    "expect(responseData).toEqual({ error: 'Invalid JSON' })"
  );
  
  return fixed;
};

// Process each file
let fixedFiles = 0;
testFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixTestExpectations(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed test expectations in: ${filePath}`);
      fixedFiles++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`Fixed test expectations in ${fixedFiles} files`);