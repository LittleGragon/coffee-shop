# Testing Documentation

This directory contains comprehensive test suites for both the API and Web packages of the Coffee Shop Buddy application.

## Test Structure

### API Package Tests (`packages/api/src/__tests__/`)

- **Database Tests** (`lib/db.test.ts`): Tests database connection, query execution, and error handling
- **Members API Tests** (`api/members/route.test.ts`): Tests member CRUD operations, validation, and error scenarios
- **Orders API Tests** (`api/orders/route.test.ts`): Tests order creation, retrieval, and validation
- **Top-up Tests** (`api/members/topup/route.test.ts`): Tests balance top-up functionality with transaction management

### Web Package Tests (`packages/web/src/__tests__/`)

- **Store Tests** (`stores/cart-store.test.ts`): Tests Zustand cart state management
- **API Client Tests** (`lib/api.test.ts`): Tests API client with proper mocking and error handling
- **Component Tests** (`pages/`): Tests for key page components
  - `menu-page.test.tsx`: Menu display, filtering, and cart interactions
  - `checkout-page.test.tsx`: Order placement, member login, and payment processing
  - `membership-page.test.tsx`: Member dashboard, registration, and order history
- **Integration Tests** (`integration/order-flow.test.tsx`): End-to-end user flow testing

## Running Tests

### API Tests

```bash
cd packages/api
npm test                    # Run all tests
npm test -- --watch       # Run tests in watch mode
npm test -- --coverage    # Run tests with coverage report
```

### Web Tests

```bash
cd packages/web
npm test                    # Run all tests
npm test:watch             # Run tests in watch mode
npm test:coverage          # Run tests with coverage report
```

### Run All Tests

From the root directory:

```bash
# Install dependencies for both packages
cd packages/api && npm install
cd ../web && npm install

# Run API tests
cd ../api && npm test

# Run Web tests
cd ../web && npm test
```

## Test Configuration

### API Package

- **Jest Config**: `packages/api/jest.config.js`
- **Test Setup**: `packages/api/jest.setup.js`
- **Environment**: Node.js with jsdom for DOM testing
- **Mocking**: Database queries, API responses

### Web Package

- **Jest Config**: `packages/web/jest.config.js`
- **Test Setup**: `packages/web/jest.setup.js`
- **Environment**: jsdom for React component testing
- **Mocking**: Next.js router, fetch API, localStorage

## Test Coverage

The test suites provide comprehensive coverage for:

### API Coverage
- ✅ Database connection and query execution
- ✅ Member CRUD operations (Create, Read, Update)
- ✅ Order management and processing
- ✅ Balance top-up with transaction handling
- ✅ Error handling and validation
- ✅ HTTP status codes and response formats

### Web Coverage
- ✅ Cart state management (add, remove, update, clear)
- ✅ API client methods with error handling
- ✅ Component rendering and user interactions
- ✅ Form validation and submission
- ✅ Member authentication and registration
- ✅ Order placement and payment processing
- ✅ Integration testing for complete user flows

## Key Testing Patterns

### 1. Mocking External Dependencies

```typescript
// Mock API calls
jest.mock('../../lib/api')
const mockApi = api as jest.Mocked<typeof api>

// Mock Zustand store
jest.mock('../../stores/cart-store')
const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>
```

### 2. Database Query Mocking

```typescript
// Mock database queries
const mockQuery = jest.fn()
jest.mock('../../lib/db', () => ({
  query: mockQuery
}))
```

### 3. Component Testing with User Events

```typescript
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()
await user.type(input, 'test value')
await user.click(button)
```

### 4. Async Testing with waitFor

```typescript
await waitFor(() => {
  expect(screen.getByText('Expected text')).toBeInTheDocument()
})
```

## Test Data

### Mock Menu Items
```typescript
const mockMenuItems = [
  {
    id: '1',
    name: 'Americano',
    price: 25,
    category: 'Coffee',
    available: true
  }
]
```

### Mock Member Data
```typescript
const mockMember = {
  id: 'member_123',
  name: 'John Doe',
  phone: '1234567890',
  balance: 100
}
```

### Mock Order Data
```typescript
const mockOrder = {
  id: 'order_123',
  memberId: 'member_123',
  total: 50,
  status: 'completed',
  items: [...]
}
```

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: External dependencies are properly mocked to ensure test reliability
3. **Cleanup**: Test state is reset between tests using `beforeEach` hooks
4. **Assertions**: Tests include meaningful assertions that verify expected behavior
5. **Error Scenarios**: Both success and failure cases are tested
6. **User-Centric**: Component tests focus on user interactions rather than implementation details

## Troubleshooting

### Common Issues

1. **Mock not working**: Ensure mocks are declared before imports
2. **Async test failures**: Use `waitFor` for async operations
3. **Component not rendering**: Check if all required props are provided
4. **Store state issues**: Reset store state in `beforeEach` hooks

### Debug Tips

```typescript
// Debug component output
screen.debug()

// Check what's in the document
console.log(screen.getByRole('button').textContent)

// Wait for async operations
await waitFor(() => expect(mockApi.someMethod).toHaveBeenCalled())
```

## Continuous Integration

These tests are designed to run in CI/CD environments. Ensure:

1. All dependencies are installed
2. Database is properly mocked (no real DB connections in tests)
3. Environment variables are set if needed
4. Tests run in headless mode for CI

## Future Enhancements

- [ ] Visual regression testing with Storybook
- [ ] E2E testing with Playwright or Cypress
- [ ] Performance testing for API endpoints
- [ ] Accessibility testing with jest-axe
- [ ] Snapshot testing for component consistency