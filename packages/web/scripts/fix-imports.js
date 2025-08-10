#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BIOME_CONFIG_PATH = path.join(process.cwd(), 'biome.json');
const SOURCE_DIRS = ['src'];
const FILE_PATTERNS = ['**/*.{ts,tsx,js,jsx}'];

/**
 * Main function to fix import organization issues
 */
async function main() {
  console.log('🔄 Fixing import organization issues...');
  
  // Backup original Biome config
  const originalConfig = fs.readFileSync(BIOME_CONFIG_PATH, 'utf8');
  
  try {
    // Modify Biome config to enable organize imports
    updateBiomeConfig();
    console.log('✅ Temporarily modified Biome config to enable organize imports');
    
    // Get all files to process
    const filesToProcess = getFilesToProcess();
    console.log(`Found ${filesToProcess.length} files to process`);
    
    // Process each file individually
    for (const file of filesToProcess) {
      try {
        console.log(`Processing ${file}...`);
        
        // Use Biome check with apply-unsafe to fix import organization
        execSync(`npx @biomejs/biome check --apply-unsafe "${file}"`, { stdio: 'inherit' });
        
        // Add a success indicator
        process.stdout.write(' ✅\n');
      } catch (error) {
        // Add a failure indicator
        process.stdout.write(' ❌\n');
        console.error(`Error processing ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error('❌ Error fixing imports:', error.message);
  } finally {
    // Restore original Biome config
    fs.writeFileSync(BIOME_CONFIG_PATH, originalConfig);
    console.log('✅ Restored original Biome configuration');
  }
  
  console.log('✅ Import organization complete');
}

/**
 * Update Biome config to enable organize imports
 */
function updateBiomeConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(BIOME_CONFIG_PATH, 'utf8'));
    
    // Add or update the linter configuration
    if (!config.linter) {
      config.linter = {};
    }
    
    if (!config.linter.enabled) {
      config.linter.enabled = true;
    }
    
    // Ensure rules exist
    if (!config.linter.rules) {
      config.linter.rules = {};
    }
    
    // Enable the organize imports rule
    if (!config.linter.rules.a11y) {
      config.linter.rules.a11y = {};
    }
    
    if (!config.linter.rules.suspicious) {
      config.linter.rules.suspicious = {};
    }
    
    if (!config.linter.rules.complexity) {
      config.linter.rules.complexity = {};
    }
    
    if (!config.linter.rules.style) {
      config.linter.rules.style = {};
    }
    
    if (!config.linter.rules.assist) {
      config.linter.rules.assist = {};
    }
    
    // Enable the organize imports rule
    config.linter.rules.assist["source/organizeImports"] = "error";
    
    // Write the updated config back to the file
    fs.writeFileSync(BIOME_CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (error) {
    throw new Error(`Failed to update Biome config: ${error.message}`);
  }
}

/**
 * Get all files to process
 */
function getFilesToProcess() {
  const files = [];
  
  for (const sourceDir of SOURCE_DIRS) {
    for (const pattern of FILE_PATTERNS) {
      const matches = glob.sync(path.join(sourceDir, pattern), { cwd: process.cwd() });
      files.push(...matches);
    }
  }
  
  return files;
}

// Run the main function
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});