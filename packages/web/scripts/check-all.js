#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define paths
const srcDir = join(__dirname, '..', 'src');

console.log('🔍 Running Biome checks on all files...');

try {
  // Run Biome lint
  console.log('\n📋 Running linter...');
  execSync(`npx biome lint ${srcDir}`, { stdio: 'inherit' });
  
  // Run Biome check
  console.log('\n🔎 Running code checks...');
  execSync(`npx biome check ${srcDir}`, { stdio: 'inherit' });
  
  console.log('\n✅ All checks passed!');
} catch (error) {
  console.error('\n❌ Checks failed. Please fix the issues above.');
  process.exit(1);
}