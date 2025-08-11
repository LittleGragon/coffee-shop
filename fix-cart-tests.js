const fs = require('fs');

// Fix cart store tests
const testPath = "packages/web/src/__tests__/stores/cart-store.test.ts";
let content = fs.readFileSync(testPath, 'utf8');

// Replace the first line to add React import
content = content.replace(
  "import { act, renderHook } from '@testing-library/react';",
  `import React from 'react';
import { act, renderHook } from '@testing-library/react';

// Create a wrapper to provide React context for hooks
const wrapper = ({ children }) => <React.Fragment>{children}</React.Fragment>;`
);

fs.writeFileSync(testPath, content);
console.log("Fixed cart store tests");
