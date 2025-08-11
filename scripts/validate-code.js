#!/usr/bin/env node

/**
 * This script runs code validation for all packages in the monorepo.
 * It's used in the pre-push git hook to ensure code quality before pushing to the repository.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the packages to validate
const packages = ['api', 'coffee-shop-ops', 'web'];

// Define the validation commands for each package
const validationCommands = {
  'api': ['npm run lint', 'npm run test'],
  'coffee-shop-ops': ['npm run lint', 'npm run test'],
  'web': ['npm run lint', 'npm run check:all', 'npm run test']
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Function to run a command and return success/failure
function runCommand(command, cwd) {
  try {
    console.log(`${colors.blue}Running: ${command}${colors.reset}`);
    execSync(command, { 
      cwd, 
      stdio: 'inherit' // Show output in real-time
    });
    return true;
  } catch (error) {
    console.error(`${colors.red}Command failed: ${command}${colors.reset}`);
    return false;
  }
}

// Main function to validate all packages
async function validatePackages() {
  console.log(`${colors.cyan}=== Starting code validation for all packages ===${colors.reset}`);
  
  let allPassed = true;
  
  for (const pkg of packages) {
    const packagePath = path.join(__dirname, '..', 'packages', pkg);
    
    // Check if package directory exists
    if (!fs.existsSync(packagePath)) {
      console.log(`${colors.yellow}Package ${pkg} not found, skipping...${colors.reset}`);
      continue;
    }
    
    console.log(`\n${colors.magenta}=== Validating package: ${pkg} ===${colors.reset}`);
    
    // Run all validation commands for the package
    const commands = validationCommands[pkg] || [];
    for (const command of commands) {
      const success = runCommand(command, packagePath);
      if (!success) {
        allPassed = false;
        console.error(`${colors.red}Validation failed for package: ${pkg}${colors.reset}`);
        // Continue with other commands for this package
      }
    }
    
    console.log(`${colors.green}Finished validating package: ${pkg}${colors.reset}`);
  }
  
  if (allPassed) {
    console.log(`\n${colors.green}=== All validations passed! ===${colors.reset}`);
    return 0;
  } else {
    console.error(`\n${colors.red}=== Some validations failed! Please fix the issues before pushing. ===${colors.reset}`);
    return 1;
  }
}

// Run the validation
validatePackages()
  .then(exitCode => {
    process.exit(exitCode);
  })
  .catch(error => {
    console.error(`${colors.red}Error during validation:${colors.reset}`, error);
    process.exit(1);
  });