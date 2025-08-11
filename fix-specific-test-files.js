const fs = require('fs');
const path = require('path');

// Function to fix a specific file
function fixFile(filePath, fixes) {
  console.log(`Fixing ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const [search, replace] of fixes) {
    content = content.replace(search, replace);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${filePath}`);
}

// Fix specific files with known issues
const filesToFix = [
  // API package files
  {
    path: path.join(__dirname, 'packages', 'api', 'src', 'app', 'api', 'menu', '__tests__', 'route.test.ts'),
    fixes: [
      [/import \{ GET POST \} from/g, 'import { GET, POST } from'],
      [/import \{ NextRequest NextResponse \} from/g, 'import { NextRequest, NextResponse } from'],
      [/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, "jest.mock('$1', ()"],
      [/describe\(['"]([^'"]+)['"]\s+\(\)/g, "describe('$1', ()"]
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'api', 'src', 'app', 'api', 'member', '__tests__', 'route.test.ts'),
    fixes: [
      [/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, "jest.mock('$1', ()"]
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'api', 'src', 'app', 'api', 'member', 'top-up', '__tests__', 'route.test.ts'),
    fixes: [
      [/import \{ NextResponse NextRequest \} from/g, 'import { NextResponse, NextRequest } from'],
      [/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, "jest.mock('$1', ()"]
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'api', 'src', '__tests__', 'api', 'members', 'route.test.ts'),
    fixes: [
      [/import \{ GET POST PUT \} from/g, 'import { GET, POST, PUT } from']
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'api', 'src', '__tests__', 'api', 'orders', 'route.test.ts'),
    fixes: [
      [/import \{ GET POST \} from/g, 'import { GET, POST } from']
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'api', 'src', 'app', 'api', 'menu-items', '__tests__', 'route.test.ts'),
    fixes: [
      [/import \{ NextRequest NextResponse \} from/g, 'import { NextRequest, NextResponse } from'],
      [/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, "jest.mock('$1', ()"]
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'api', 'src', '__tests__', 'lib', 'db.test.ts'),
    fixes: [
      [/import \{ query executeQuery testConnection \} from/g, 'import { query, executeQuery, testConnection } from'],
      [/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, "jest.mock('$1', ()"]
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'api', 'src', 'app', 'api', 'cake-orders', '__tests__', 'route.test.ts'),
    fixes: [
      [/import \{ NextResponse NextRequest \} from/g, 'import { NextResponse, NextRequest } from'],
      [/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, "jest.mock('$1', ()"]
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'api', 'src', 'app', 'api', 'reservations', '__tests__', 'route.test.ts'),
    fixes: [
      [/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, "jest.mock('$1', ()"],
      [/describe\(['"]([^'"]+)['"]\s+\(\)/g, "describe('$1', ()"]
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'api', 'src', '__tests__', 'api', 'members', 'topup', 'route.test.ts'),
    fixes: [
      [/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, "jest.mock('$1', ()"]
    ]
  },
  
  // Coffee-shop-ops package files
  {
    path: path.join(__dirname, 'packages', 'coffee-shop-ops', 'src', '__tests__', 'api', 'inventory', 'route.test.ts'),
    fixes: [
      [/import \{ GET POST \} from/g, 'import { GET, POST } from']
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'coffee-shop-ops', 'src', '__tests__', 'api', 'menu', 'route.test.ts'),
    fixes: [
      [/import \{ GET POST \} from/g, 'import { GET, POST } from']
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'coffee-shop-ops', 'src', '__tests__', 'lib', 'db.test.ts'),
    fixes: [
      [/import \{ query executeQuery testConnection \} from/g, 'import { query, executeQuery, testConnection } from'],
      [/jest\.mock\(['"]([^'"]+)['"]\s+\(\)/g, "jest.mock('$1', ()"]
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'coffee-shop-ops', 'src', '__tests__', 'services', 'inventoryService.test.ts'),
    fixes: [
      [/import \{ InventoryItem InventoryTransaction \} from/g, 'import { InventoryItem, InventoryTransaction } from']
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'coffee-shop-ops', 'src', 'services', 'orderService.ts'),
    fixes: [
      [/import \{ Order OrderItem \} from/g, 'import { Order, OrderItem } from'],
      [/if \(conditions\.length > 0\) \{/g, 'if (conditions.length > 0) {'],
      [/for \(const item of orderItems\) \{/g, 'for (const item of orderItems) {'],
      [/\(error as Error\)\.message/g, '(error as Error).message'],
      [/Promise<\{status: string; count: number \}\[\]>/g, 'Promise<{status: string; count: number}[]>'],
      [/executeQuery<\{status: string; count: number \}>/g, 'executeQuery<{status: string; count: number}[]>']
    ]
  },
  {
    path: path.join(__dirname, 'packages', 'coffee-shop-ops', 'src', 'services', 'menuService.ts'),
    fixes: [
      [/if \(options\.isAvailable !== undefined\) \{/g, 'if (options.isAvailable !== undefined) {'],
      [/if \(conditions\.length > 0\) \{/g, 'if (conditions.length > 0) {']
    ]
  }
];

// Fix each file
for (const file of filesToFix) {
  fixFile(file.path, file.fixes);
}

console.log('Finished fixing specific test files.');