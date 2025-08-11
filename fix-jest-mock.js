const fs = require('fs');
const path = require('path');

// Function to fix jest.mock calls missing parentheses
function fixJestMock(content) {
  // Fix jest.mock syntax
  let fixed = content;
  
  // Fix jest.mock('module' () => {}) pattern
  fixed = fixed.replace(/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, "jest.mock('$1', ()");
  
  // Fix describe('description' () => {}) pattern
  fixed = fixed.replace(/describe\(['"]([^'"]+)['"]\s+\(\)/g, "describe('$1', ()");
  
  // Fix it('description' () => {}) pattern
  fixed = fixed.replace(/it\(['"]([^'"]+)['"]\s+\(\)/g, "it('$1', ()");
  
  // Fix beforeEach(() => {}) pattern
  fixed = fixed.replace(/beforeEach\s+\(\)/g, "beforeEach(()");
  
  // Fix afterEach(() => {}) pattern
  fixed = fixed.replace(/afterEach\s+\(\)/g, "afterEach(()");
  
  return fixed;
}

// Function to process a file
function processFile(filePath) {
  try {
    console.log(`Processing ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    let fixed = fixJestMock(content);
    
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`Fixed ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to find and process test files recursively
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.test.ts') || file.endsWith('.test.js')) {
      processFile(filePath);
    }
  }
}

// Main execution
console.log('Starting to fix Jest mock syntax...');

// Process all test files in the api package
processDirectory(path.join(__dirname, 'packages', 'api'));

// Process all test files in the coffee-shop-ops package
processDirectory(path.join(__dirname, 'packages', 'coffee-shop-ops'));

console.log('Finished fixing Jest mock syntax.');