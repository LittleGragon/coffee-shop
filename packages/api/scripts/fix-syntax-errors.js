const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Common syntax errors in test files
const fixers = [
  // Fix missing commas in import statements
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from/g,
    fix: (match, imports) => {
      // Add commas between imports if missing
      const fixedImports = imports
        .split(/\s+/)
        .filter(Boolean)
        .join(', ');
      return `import { ${fixedImports} } from`;
    }
  },
  // Fix missing commas in jest.mock calls
  {
    pattern: /jest\.mock\(['"]([^'"]+)['"]\s*(?:\(\))?\s*=>\s*\(\{([^}]*)\}\)\)/g,
    fix: (match, moduleName, props) => {
      // Fix the jest.mock syntax
      return `jest.mock('${moduleName}', () => ({${props}}))`;
    }
  },
  // Fix missing parentheses in describe and it blocks
  {
    pattern: /(describe|it)\s*\(\s*(['"`][^'"`]+['"`])\s*([^=](?!\s*=>\s*\{))/g,
    fix: (match, funcName, testName, rest) => {
      return `${funcName}(${testName}, () => ${rest}`;
    }
  },
  // Fix semicolons instead of commas in function blocks
  {
    pattern: /\)\s*{\s*([^}]*?)\s*};/g,
    fix: (match, content) => {
      return `) {\n  ${content}\n}`;
    }
  },
  // Fix missing commas between function parameters
  {
    pattern: /\(([^)]+)\)/g,
    fix: (match, params) => {
      if (params.includes(' ') && !params.includes(',') && !params.includes('=>')) {
        const fixedParams = params.split(/\s+/).join(', ');
        return `(${fixedParams})`;
      }
      return match;
    }
  }
];

async function processFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    let content = await readFileAsync(filePath, 'utf8');
    let modified = false;
    
    for (const fixer of fixers) {
      const newContent = content.replace(fixer.pattern, fixer.fix);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    if (modified) {
      await writeFileAsync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

async function findAndProcessFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let modifiedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      modifiedCount += await findAndProcessFiles(filePath);
    } else if (file.name.endsWith('.test.ts')) {
      const modified = await processFile(filePath);
      if (modified) modifiedCount++;
    }
  }
  
  return modifiedCount;
}

async function main() {
  const apiDir = path.join(__dirname, '../src');
  console.log(`Scanning directory: ${apiDir}`);
  
  const modifiedCount = await findAndProcessFiles(apiDir);
  console.log(`Modified ${modifiedCount} files`);
}

main().catch(console.error);