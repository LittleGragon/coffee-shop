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
    
    // Replace try-catch blocks that return error responses
    let updatedContent = content;
    
    // Pattern: try { ... } catch (error) { ... return NextResponse.json(...error...) }
    const tryCatchPattern = /try\s*{[\s\S]*?}\s*catch\s*\((error|err|e)\)\s*{[\s\S]*?console\.error\([^;]*\);?\s*return\s+NextResponse\.json\(\s*{[\s\S]*?}\s*,?\s*{[\s\S]*?}\s*\);?\s*}/g;
    
    updatedContent = updatedContent.replace(tryCatchPattern, (match) => {
      // Extract the try block content
      const tryContent = match.match(/try\s*{([\s\S]*?)}\s*catch/)[1];
      
      // Return only the try block content without the try keyword and braces
      return tryContent.trim();
    });
    
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