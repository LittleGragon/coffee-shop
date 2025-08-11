const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to fix import statements with missing commas
function fixImports(content) {
  // Fix imports with missing commas between multiple imports
  return content.replace(/import\s+\{\s*([A-Za-z0-9_]+)\s+([A-Za-z0-9_]+)(\s+[A-Za-z0-9_]+)*\s*\}/g, (match, first, second, rest) => {
    if (rest) {
      return `import { ${first}, ${second},${rest} }`;
    }
    return `import { ${first}, ${second} }`;
  });
}

// Function to fix jest.mock calls missing parentheses
function fixJestMock(content) {
  return content.replace(/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, (match, moduleName) => {
    return `jest.mock('${moduleName}', ()`;
  });
}

// Function to fix TypeScript syntax errors in service files
function fixTypeScriptSyntax(content) {
  // Fix missing colons in type declarations
  let fixed = content;
  
  // Fix Promise<Type> syntax
  fixed = fixed.replace(/Promise<([^>]+)\s+\|/g, 'Promise<$1 |');
  
  // Fix if conditions with missing parentheses
  fixed = fixed.replace(/if\s+\(([^)]+)\)\s+\{/g, (match, condition) => {
    if (condition.includes('>') && !condition.includes('>=')) {
      return match.replace('>', ' > ');
    }
    return match;
  });
  
  // Fix for loops with missing parentheses
  fixed = fixed.replace(/for\s+\(const\s+([a-zA-Z0-9_]+)\s+of\s+([a-zA-Z0-9_]+)\)\s+\{/g, 
    (match, item, items) => `for (const ${item} of ${items}) {`);
  
  // Fix type casting syntax
  fixed = fixed.replace(/\(([a-zA-Z0-9_]+)\s+as\s+([a-zA-Z0-9_]+)\)\.([a-zA-Z0-9_]+)/g, 
    (match, expr, type, prop) => `(${expr} as ${type}).${prop}`);
  
  return fixed;
}

// Function to process a file
function processFile(filePath) {
  try {
    console.log(`Processing ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    let fixed = content;
    fixed = fixImports(fixed);
    fixed = fixJestMock(fixed);
    fixed = fixTypeScriptSyntax(fixed);
    
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`Fixed ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to find and process files recursively
function processDirectory(dir, filePattern) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath, filePattern);
    } else if (filePattern.test(file)) {
      processFile(filePath);
    }
  }
}

// Fix specific files with known issues
function fixSpecificFiles() {
  // Fix orderService.ts
  const orderServicePath = path.join(__dirname, 'packages', 'api', 'src', 'services', 'orderService.ts');
  if (fs.existsSync(orderServicePath)) {
    let content = fs.readFileSync(orderServicePath, 'utf8');
    content = content.replace(/import \{ Order OrderItem \} from/g, 'import { Order, OrderItem } from');
    fs.writeFileSync(orderServicePath, content, 'utf8');
    console.log(`Fixed ${orderServicePath}`);
  }
  
  // Fix inventoryService.test.ts
  const inventoryServiceTestPath = path.join(__dirname, 'packages', 'api', 'src', '__tests__', 'services', 'inventoryService.test.ts');
  if (fs.existsSync(inventoryServiceTestPath)) {
    let content = fs.readFileSync(inventoryServiceTestPath, 'utf8');
    content = content.replace(/import \{ InventoryItem InventoryTransaction \} from/g, 'import { InventoryItem, InventoryTransaction } from');
    fs.writeFileSync(inventoryServiceTestPath, content, 'utf8');
    console.log(`Fixed ${inventoryServiceTestPath}`);
  }
  
  // Fix db.test.ts
  const dbTestPath = path.join(__dirname, 'packages', 'api', 'src', '__tests__', 'lib', 'db.test.ts');
  if (fs.existsSync(dbTestPath)) {
    let content = fs.readFileSync(dbTestPath, 'utf8');
    content = content.replace(/import \{ query executeQuery testConnection \} from/g, 'import { query, executeQuery, testConnection } from');
    content = content.replace(/jest\.mock\('pg' \(\)/g, "jest.mock('pg', ()");
    fs.writeFileSync(dbTestPath, content, 'utf8');
    console.log(`Fixed ${dbTestPath}`);
  }
}

// Main execution
console.log('Starting to fix test syntax errors...');

// Fix specific files with known issues
fixSpecificFiles();

// Process all test files in the api package
processDirectory(path.join(__dirname, 'packages', 'api', 'src'), /\.(ts|js)$/);

// Process all test files in the coffee-shop-ops package
processDirectory(path.join(__dirname, 'packages', 'coffee-shop-ops', 'src'), /\.(ts|js)$/);

console.log('Finished fixing test syntax errors.');