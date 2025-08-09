# Coffee Shop Operations - Testing Documentation

This directory contains comprehensive test suites for the Coffee Shop Operations (coffee-shop-ops) package, which handles the administrative and operational aspects of the coffee shop.

## Test Structure

### Database Tests (`lib/db.test.ts`)
- Database connection and query execution testing
- Error handling and connection pooling
- Transaction management verification

### Service Layer Tests (`services/`)
- **MenuService Tests** (`menuService.test.ts`): Complete CRUD operations for menu items
- **InventoryService Tests** (`inventoryService.test.ts`): Inventory management and transaction handling

### API Route Tests (`api/`)
- **Menu API Tests** (`menu/route.test.ts`): Menu item management endpoints
- **Inventory API Tests** (`inventory/route.test.ts`): Inventory management endpoints

## Running Tests

### Install Dependencies
```bash
cd packages/coffee-shop-ops
npm install
```

### Run Tests
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
```

## Test Configuration

- **Jest Config**: `jest.config.js` - Next.js Jest configuration with Node environment
- **Test Setup**: `jest.setup.js` - Database mocking and test utilities
- **Environment**: Node.js environment for API testing
- **Mocking**: Database queries, Next.js request/response objects

## Test Coverage

### Database Layer ✅
- Connection pooling and query execution
- Error handling and connection management
- Transaction support and rollback scenarios

### Service Layer ✅
- **Menu Service**:
  - CRUD operations (Create, Read, Update, Delete)
  - Filtering by category and availability
  - Availability toggling
  - Category management
  - Error handling and validation

- **Inventory Service**:
  - CRUD operations for inventory items
  - Stock level management and low stock detection
  - Inventory transaction recording (restock, usage, waste)
  - Transaction rollback on errors
  - Category and supplier management

### API Layer ✅
- **Menu API** (`/api/menu`):
  - GET: Retrieve menu items with filtering
  - POST: Create new menu items with validation
  - Error handling and status codes

- **Inventory API** (`/api/inventory`):
  - GET: Retrieve inventory items with filtering
  - POST: Create new inventory items with validation
  - Required field validation
  - Error handling and status codes

## Key Features Tested

### Menu Management
- ✅ Menu item creation, retrieval, updating, deletion
- ✅ Category-based filtering
- ✅ Availability management
- ✅ Price and description handling
- ✅ Image URL management

### Inventory Management
- ✅ Inventory item CRUD operations
- ✅ Stock level tracking (current vs minimum)
- ✅ Low stock detection and alerts
- ✅ Supplier and cost management
- ✅ Expiry date tracking
- ✅ Transaction recording (restock, usage, waste, adjustments)
- ✅ Automatic stock updates with transactions

### API Endpoints
- ✅ Request validation and error responses
- ✅ Query parameter handling
- ✅ JSON request/response processing
- ✅ HTTP status code accuracy
- ✅ Service layer integration

## Test Data Models

### Menu Item
```typescript
{
  id: string
  name: string
  price: number
  category: string
  description?: string
  image_url?: string
  is_available: boolean
  created_at: Date
  updated_at: Date
}
```

### Inventory Item
```typescript
{
  id: string
  name: string
  sku: string
  category: string
  current_stock: number
  minimum_stock: number
  unit: string
  cost_per_unit: number
  supplier?: string
  last_restock_date?: Date
  expiry_date?: Date
  created_at: Date
  updated_at: Date
}
```

### Inventory Transaction
```typescript
{
  id: string
  inventory_item_id: string
  type: 'restock' | 'usage' | 'waste' | 'adjustment'
  quantity: number
  unit_cost?: number
  total_cost?: number
  reason?: string
  reference_id?: string
  created_by: string
  created_at: Date
}
```

## Testing Patterns

### 1. Service Layer Testing
```typescript
// Mock database queries
jest.mock('@/lib/db')
const mockExecuteQuery = executeQuery as jest.MockedFunction<typeof executeQuery>

// Test service methods
it('should create menu item', async () => {
  mockExecuteQuery.mockResolvedValue([mockMenuItem])
  const result = await menuService.addItem(itemData)
  expect(result).toEqual(mockMenuItem)
})
```

### 2. API Route Testing
```typescript
// Mock service layer
jest.mock('@/services/menuService')
const mockMenuService = menuService as jest.Mocked<typeof menuService>

// Test API endpoints
it('should return menu items', async () => {
  mockMenuService.getAllItems.mockResolvedValue(mockItems)
  const request = createMockNextRequest('http://localhost:3000/api/menu')
  const response = await GET(request)
  expect(response.status).toBe(200)
})
```

### 3. Database Transaction Testing
```typescript
// Mock database client for transactions
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
}

global.pool = {
  connect: jest.fn().mockResolvedValue(mockClient),
} as any

// Test transaction rollback
it('should rollback on error', async () => {
  mockClient.query.mockRejectedValueOnce(new Error('Transaction failed'))
  await expect(service.recordTransaction(data)).rejects.toThrow()
  expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK')
})
```

## Error Scenarios Tested

### Database Errors
- Connection failures
- Query execution errors
- Transaction rollback scenarios
- Client release on errors

### Validation Errors
- Missing required fields
- Invalid data types
- Business rule violations
- Constraint violations

### Service Errors
- Item not found scenarios
- Duplicate key violations
- Stock level inconsistencies
- Transaction conflicts

### API Errors
- Invalid JSON payloads
- Missing request parameters
- Service layer failures
- HTTP status code accuracy

## Mock Utilities

### Global Test Helpers
```typescript
// Create mock Next.js request
global.createMockNextRequest = (url, options = {}) => {
  const request = new global.Request(url, options)
  request.nextUrl = {
    searchParams: new URLSearchParams(new URL(url).search),
  }
  return request
}

// Mock database responses
global.mockDbResponse = (data) => {
  const { executeQuery } = require('@/lib/db')
  executeQuery.mockResolvedValue(data)
}

// Mock database errors
global.mockDbError = (error) => {
  const { executeQuery } = require('@/lib/db')
  executeQuery.mockRejectedValue(error)
}
```

## Best Practices

1. **Isolation**: Each test is independent with proper setup/teardown
2. **Mocking**: External dependencies are properly mocked
3. **Coverage**: Both success and error scenarios are tested
4. **Validation**: Input validation and business rules are verified
5. **Transactions**: Database transactions are properly tested
6. **Error Handling**: All error paths are covered

## Integration with Other Packages

The coffee-shop-ops package integrates with:
- **API Package**: Shared database and menu item synchronization
- **Web Package**: Administrative interface for operations management
- **Database**: Shared PostgreSQL database with proper schema management

## Continuous Integration

Tests are designed for CI/CD environments:
- No real database connections (all mocked)
- Deterministic test data
- Proper cleanup between tests
- Environment variable handling
- Headless execution support

## Future Enhancements

- [ ] Integration tests with real database (test environment)
- [ ] Performance testing for bulk operations
- [ ] API rate limiting tests
- [ ] File upload testing for menu item images
- [ ] Audit trail testing for inventory changes
- [ ] Notification system testing for low stock alerts