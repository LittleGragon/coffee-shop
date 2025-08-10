#!/usr/bin/env node

/**
 * This script fixes common linting issues automatically
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Fixing common linting issues...');

// Run Biome format to fix formatting issues
console.log('📝 Running Biome formatter...');
try {
  execSync('npx biome format --write ./src', { stdio: 'inherit' });
  console.log('✅ Formatting complete');
} catch (error) {
  console.error('❌ Formatting failed:', error.message);
}

// Fix common issues that Biome can't fix automatically
console.log('🔧 Fixing common issues...');

// Function to recursively process files
function processFiles(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      processFiles(filePath);
    } else if (stats.isFile() && /\.(ts|tsx|js|jsx)$/.test(file)) {
      fixIssuesInFile(filePath);
    }
  }
}

// Function to fix issues in a file
function fixIssuesInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix 1: Replace isNaN with Number.isNaN
  if (content.includes('isNaN(')) {
    content = content.replace(/\bisNaN\(/g, 'Number.isNaN(');
    modified = true;
  }
  
  // Fix 2: Replace string concatenation with template literals
  // This is a simple version that might not catch all cases
  const concatRegex = /['"]([^'"]*)['"]\s*\+\s*([^;,)]+)/g;
  if (concatRegex.test(content)) {
    content = content.replace(concatRegex, '`$1${$2}`');
    modified = true;
  }
  
  // Fix 3: Add 'type' to imports that are only used as types
  // This is a simplified approach and might need manual review
  const reactTypeImportRegex = /import\s+\*\s+as\s+React\s+from\s+['"]react['"];/g;
  if (reactTypeImportRegex.test(content)) {
    content = content.replace(reactTypeImportRegex, 'import type * as React from \'react\';');
    modified = true;
  }
  
  // Save changes if modified
  if (modified) {
    console.log(`📄 Fixed issues in ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

// Start processing files
processFiles(path.resolve('./src'));

console.log('✨ Done fixing common issues');
console.log('📋 Run npm run check:all to verify fixes');