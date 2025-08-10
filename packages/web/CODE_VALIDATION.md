# Code Validation Setup

This project uses [Biome](https://biomejs.dev/) for code formatting and linting. Biome is a high-performance Rust-based formatter and linter that helps maintain code quality and consistency.

## Setup

The following tools are configured for code validation:

1. **Biome** - For formatting and linting
2. **ESLint** - For additional linting rules not covered by Biome
3. **Husky** - For pre-commit hooks
4. **lint-staged** - For running linters on staged files

## Configuration Files

- `biome.json` - Biome configuration
- `.eslintrc.json` - ESLint configuration
- `.lintstagedrc.json` - lint-staged configuration
- `.husky/pre-commit` - Pre-commit hook

## Available Scripts

```bash
# Format code using Biome
npm run format

# Lint code using Biome
npm run lint

# Run all checks (format and lint)
npm run check:all

# Automatically fix common issues
npm run fix
```

## Common Issues and How to Fix Them

### Biome Linting Issues

1. **Unused Variables**
   - Fix: Remove the unused variable or prefix it with an underscore (_) if intentional
   - Example: `const unusedVar = 'test'` → `const _unusedVar = 'test'`

2. **Console Statements**
   - Fix: Remove console statements or replace with proper logging
   - Example: `console.log('message')` → Use a logger or remove

3. **Template Literals**
   - Fix: Use template literals instead of string concatenation
   - Example: `'string' + variable` → `` `string${variable}` ``

4. **Import Types**
   - Fix: Use `import type` for type-only imports
   - Example: `import * as React from 'react'` → `import type * as React from 'react'`

5. **Global isNaN**
   - Fix: Use `Number.isNaN()` instead of global `isNaN()`
   - Example: `isNaN(value)` → `Number.isNaN(value)`

6. **Unused Imports**
   - Fix: Remove unused imports
   - Example: `import { used, unused } from 'module'` → `import { used } from 'module'`

### Formatting Issues

Biome will automatically fix formatting issues when you run:

```bash
npm run format
```

## Pre-commit Hook

The pre-commit hook will run lint-staged, which will:

1. Format staged files using Biome
2. Lint staged files using Biome

If any issues are found, the commit will be blocked until they are fixed.

## VS Code Integration

VS Code settings are configured to:

1. Format on save using Biome
2. Show linting errors in the editor

## CI/CD Integration

GitHub Actions workflow is configured to run code validation on pull requests and pushes to the main branch.