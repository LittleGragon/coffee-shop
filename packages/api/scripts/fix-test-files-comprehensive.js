const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all test files
const testFiles = glob.sync('src/**/*.test.ts', { cwd: path.join(__dirname, '..') });

console.log(`Found ${testFiles.length} test files to check`);

let fixedFiles = 0;

testFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let modified = false;

  // Fix missing commas in import statements
  content = content.replace(/import\s*{([^}]*)}\s*from/g, (match, importList) => {
    // If there are spaces without commas between identifiers, add commas
    const fixedImportList = importList.replace(/(\w+)\s+(\w+)/g, '$1, $2');
    return `import {${fixedImportList}} from`;
  });

  // Fix missing commas in jest.mock statements
  content = content.replace(/jest\.mock\(['"]([^'"]+)['"]\s*\(\s*\)/g, (match, moduleName) => {
    return `jest.mock('${moduleName}', () =>`;
  });

  // Fix missing commas in object literals
  content = content.replace(/{\s*([^{}:]+):\s*([^{}:,]+)\s+([^{}:]+):/g, (match, key1, value1, key2) => {
    return `{ ${key1}: ${value1}, ${key2}:`;
  });

  // Fix missing commas in function calls
  content = content.replace(/\(\s*([^():,]+)\s+([^():,]+)\s*\)/g, (match, arg1, arg2) => {
    // Only replace if it's not already a proper function call with parentheses
    if (!arg1.includes('(') && !arg2.includes(')')) {
      return `(${arg1}, ${arg2})`;
    }
    return match;
  });

  // Fix describe statements
  content = content.replace(/describe\(['"]([^'"]+)['"]\s*\(\s*\)/g, (match, description) => {
    return `describe('${description}', () =>`;
  });

  // Fix it statements
  content = content.replace(/it\(['"]([^'"]+)['"]\s*\(\s*\)/g, (match, description) => {
    return `it('${description}', () =>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed file: ${file}`);
    fixedFiles++;
    modified = true;
  }
});

console.log(`Fixed ${fixedFiles} files`);