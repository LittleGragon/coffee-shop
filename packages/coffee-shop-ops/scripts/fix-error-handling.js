const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Directory containing API routes
const API_DIR = path.join(__dirname, '../src/app/api');

// Function to process a file
async function processFile(filePath) {
  // Skip test files and error.ts
  if (filePath.includes('__tests__') || filePath.includes('error.ts')) {
    return;
  }

  try {
    // Read the file content
    const content = await readFile(filePath, 'utf8');
    
    // Check if this is a route file
    if (!content.includes('export async function') || !content.includes('NextResponse')) {
      return;
    }

    console.log(`Processing: ${filePath}`);
    
    // Replace try-catch blocks with throw statements
    let updatedContent = content;
    
    // Replace error handling patterns
    updatedContent = updatedContent.replace(
      /if\s*\(\s*!\s*(\w+)\s*\)\s*{\s*(?:console\.error|console\.log)\([^;]*\);?\s*return\s+NextResponse\.json\(\s*{\s*(?:error|success\s*:\s*false)[^}]*}\s*,?\s*{\s*status\s*:\s*\d+\s*}\s*\);?\s*}/g,
      (match, variable) => {
        return `if (!${variable}) {\n    throw new ApiError(\`${variable} not found\`, 404);\n  }`;
      }
    );
    
    // If changes were made, write the updated content back to the file
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`No changes needed for: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to recursively process all files in a directory
async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')) {
      await processFile(fullPath);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('Starting to update API routes to throw errors...');
    await processDirectory(API_DIR);
    console.log('Finished updating API routes.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();