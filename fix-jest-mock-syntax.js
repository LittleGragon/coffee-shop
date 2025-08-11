const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to fix jest.mock calls missing parentheses
function fixJestMock(content) {
  // Fix jest.mock syntax
  let fixed = content.replace(/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, (match, moduleName) => {
    return `jest.mock('${moduleName}', ()`;
  });
  
  // Fix describe calls missing parentheses
  fixed = fixed.replace(/describe\(['"]([^'"]+)['"]\s+\(\)/g, (match, description) => {
    return `describe('${description}', ()`;
  });
  
  return fixed;
}

// Function to fix import statements with missing commas
function fixImports(content) {
  // Fix imports with missing commas between multiple imports
  return content.replace(/import\s+\{\s*([A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)(\s+[A-Za-z0-9_]+)*\s*\}/g, (match, first, second, rest) => {
    if (rest) {
      const items = [first, second, ...rest.trim().split(/\s+/)];
      return `import { ${items.join(', ')} }`;
    }
    return `import { ${first}, ${second} }`;
  });
}

// Function to process a file
function processFile(filePath) {
  try {
    console.log(`Processing ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    let fixed = content;
    fixed = fixImports(fixed);
    fixed = fixJestMock(fixed);
    
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
console.log('Starting to fix Jest mock syntax errors...');

// Process all test files in the api package
processDirectory(path.join(__dirname, 'packages', 'api'));

// Process all test files in the coffee-shop-ops package
processDirectory(path.join(__dirname, 'packages', 'coffee-shop-ops'));

console.log('Finished fixing Jest mock syntax errors.');