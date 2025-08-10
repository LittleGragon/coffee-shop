#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main function to fix import organization issues
 */
async function main() {
  console.log('🔄 Fixing import organization issues using Biome format...');
  
  const BIOME_CONFIG_PATH = path.join(process.cwd(), 'biome.json');
  
  // Backup original Biome config
  const originalConfig = fs.readFileSync(BIOME_CONFIG_PATH, 'utf8');
  
  try {
    // Modify Biome config to enable organize imports
    const config = JSON.parse(originalConfig);
    
    // Add organize imports configuration
    if (!config.organizeImports) {
      config.organizeImports = {
        enabled: true
      };
    } else {
      config.organizeImports.enabled = true;
    }
    
    // Write the updated config back to the file
    fs.writeFileSync(BIOME_CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log('✅ Temporarily modified Biome config to enable organize imports');
    
    // Run Biome format on all files
    console.log('🔄 Running Biome format on all files...');
    try {
      execSync('npx @biomejs/biome format --write "src/**/*.{ts,tsx,js,jsx}"', { stdio: 'inherit' });
      console.log('✅ Successfully formatted all files');
    } catch (error) {
      console.error('❌ Error formatting files:', error.message);
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

// Run the main function
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});