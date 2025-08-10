#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SIDEBAR_FILE_PATH = path.join(process.cwd(), 'src/components/ui/sidebar.tsx');

/**
 * Main function to fix document.cookie issues
 */
async function main() {
  console.log('🔄 Fixing document.cookie issues in sidebar.tsx...');
  
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
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});