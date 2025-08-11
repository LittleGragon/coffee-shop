const fs = require('fs');

// Fix the API file to work in Jest environment
const apiPath = "packages/web/src/lib/api.ts";
let apiContent = fs.readFileSync(apiPath, 'utf8');

// Replace the problematic import.meta code
const fixedApiContent = apiContent.replace(
  `// In browser/Vite environment
else {
  try {
    // Safely check for import.meta
    if (typeof window !== "undefined") {
      // Direct access to import.meta if available
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";
        API_BASE_URL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL;
        // Environment variables loaded
      }
    }
  } catch (_e) {
    // Error accessing environment variables
  }
}`,
  `// In browser/Vite environment
else {
  try {
    // Safely check for environment variables
    if (typeof window !== "undefined") {
      // For Jest tests, USE_MOCK_DATA is already set to true above
      // For browser environment
      const env = typeof process !== 'undefined' && process.env 
        ? process.env 
        : (typeof window.__VITE_ENV !== 'undefined' ? window.__VITE_ENV : null);
      
      if (env) {
        USE_MOCK_DATA = env.VITE_USE_MOCK_DATA === "true";
        API_BASE_URL = env.VITE_API_BASE_URL || API_BASE_URL;
      }
    }
  } catch (_e) {
    // Error accessing environment variables
  }
}`
);

fs.writeFileSync(apiPath, fixedApiContent);
console.log("Fixed API file");
