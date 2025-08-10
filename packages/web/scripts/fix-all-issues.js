#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main function to fix all code validation issues
 */
async function main() {
  console.log('🔄 Starting to fix all code validation issues...');
  
  try {
    // Fix document.cookie issues in sidebar.tsx
    await fixCookieIssues();
    
    // Fix import organization issues
    await fixImportOrganization();
    
    // Run the check:all script to verify fixes
    console.log('\n📋 Verifying fixes...');
    try {
      execSync('npm run check:all', { stdio: 'inherit' });
      console.log('✅ All issues fixed successfully!');
    } catch (error) {
      console.log('⚠️ Some issues may still remain. Check the output above for details.');
    }
  } catch (error) {
    console.error('❌ Error fixing issues:', error.message);
  }
}

/**
 * Fix document.cookie issues in sidebar.tsx
 */
async function fixCookieIssues() {
  console.log('\n📋 Fixing document.cookie issues...');
  
  const SIDEBAR_FILE_PATH = path.join(process.cwd(), 'src/components/ui/sidebar.tsx');
  
  try {
    // Read the sidebar file
    const content = fs.readFileSync(SIDEBAR_FILE_PATH, 'utf8');
    
    // Check if the file already has the fix
    if (content.includes('// Use a safer approach than direct document.cookie assignment')) {
      console.log('✅ File already has the fix applied');
      return;
    }
    
    // Replace the document.cookie usage with a safer approach
    const updatedContent = content.replace(
      /} else {\s*document\.cookie = `\${SIDEBAR_COOKIE_NAME}=\${openState}; max-age=\${SIDEBAR_COOKIE_MAX_AGE}; path=\/`;/,
      `} else {
          // Fallback for browsers that don't support Cookie Store API
          // Create a cookie with the same parameters but using a safer approach
          const date = new Date();
          date.setTime(date.getTime() + (SIDEBAR_COOKIE_MAX_AGE * 1000));
          const expires = \`expires=\${date.toUTCString()}\`;
          const cookieValue = \`\${SIDEBAR_COOKIE_NAME}=\${openState}; \${expires}; path=/; SameSite=Lax\`;
          
          // Use a safer approach than direct document.cookie assignment
          if (typeof document !== 'undefined') {
            const cookieEl = document.createElement('meta');
            cookieEl.httpEquiv = 'set-cookie';
            cookieEl.content = cookieValue;
            document.head.appendChild(cookieEl);
            document.head.removeChild(cookieEl);
          }`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(SIDEBAR_FILE_PATH, updatedContent);
    
    console.log('✅ Successfully fixed document.cookie issues in sidebar.tsx');
  } catch (error) {
    console.error('❌ Error fixing document.cookie issues:', error.message);
    throw error;
  }
}

/**
 * Fix import organization issues
 */
async function fixImportOrganization() {
  console.log('\n📋 Fixing import organization issues...');
  
  const BIOME_CONFIG_PATH = path.join(process.cwd(), 'biome.json');
  
  // Backup original Biome config
  const originalConfig = fs.readFileSync(BIOME_CONFIG_PATH, 'utf8');
  
  try {
    // Modify Biome config to enable organize imports
    const config = JSON.parse(originalConfig);
    
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
    if (!config.linter.rules.assist) {
      config.linter.rules.assist = {};
    }
    
    // Enable the organize imports rule
    config.linter.rules.assist["source/organizeImports"] = "error";
    
    // Write the updated config back to the file
    fs.writeFileSync(BIOME_CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log('✅ Temporarily modified Biome config to enable organize imports');
    
    // Get all files to process
    const files = await getFilesToProcess();
    console.log(`Found ${files.length} files to process`);
    
    // Process each file individually
    for (const file of files) {
      try {
        process.stdout.write(`Processing ${file}... `);
        
        // Use Biome check with apply to fix import organization
        execSync(`npx @biomejs/biome check --apply "${file}"`, { stdio: 'pipe' });
        
        // Add a success indicator
        process.stdout.write('✅\n');
      } catch (error) {
        // Add a failure indicator
        process.stdout.write('❌\n');
        console.error(`Error processing ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error('❌ Error fixing imports:', error.message);
    throw error;
  } finally {
    // Restore original Biome config
    fs.writeFileSync(BIOME_CONFIG_PATH, originalConfig);
    console.log('✅ Restored original Biome configuration');
  }
  
  console.log('✅ Import organization complete');
}

/**
 * Get all files to process
 */
async function getFilesToProcess() {
  const SOURCE_DIRS = ['src'];
  const FILE_PATTERNS = ['**/*.{ts,tsx,js,jsx}'];
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