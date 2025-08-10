# Coffee Shop Buddy API Specification

## API First Approach

This project follows the API First approach, where API specifications are defined before implementation. This ensures consistency between client and server code, improves documentation, and enables parallel development.

## Shared API Types

The `src/api-types.ts` file contains TypeScript interfaces that define the contract between frontend and backend. These types should be used by both client and server implementations.

## Benefits of API First

1. **Consistency**: Ensures client and server have the same understanding of request/response formats
2. **Type Safety**: Provides compile-time checking of API interactions
3. **Documentation**: Serves as living documentation for the API
4. **Parallel Development**: Frontend and backend teams can work independently based on the agreed contract

## Using the API Types

### In Client Code

```typescript
import { CreateOrderRequest, Order } from '../../shared/src/api-types';

// Create a strongly-typed order request
const orderPayload: CreateOrderRequest = {
  user_id: null,
  total_amount: 15.50,
  status: 'pending',
  order_type: 'takeout',
  customer_name: 'John Doe',
  items: [
    {
      menu_item_id: 'c1',
      quantity: 2,
      price_at_time: 3.50
    }
  ]
};

// Send the request
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderPayload)
});

// Parse the response with correct typing
const result = await response.json() as Order;
```

### In Server Code

```typescript
import { CreateOrderRequest, Order } from '../../shared/src/api-types';

// Parse and validate the request body
const orderData = req.body as CreateOrderRequest;

// Validate required fields
if (!orderData.customer_name || !orderData.items || orderData.items.length === 0) {
  return res.status(400).json({ error: 'Order data and at least one order item are required' });
}

// Process the order...

// Return a properly typed response
const orderResponse: Order = {
  id: generatedId,
  user_id: orderData.user_id,
  total_amount: orderData.total_amount,
  status: 'pending',
  order_type: orderData.order_type,
  customer_name: orderData.customer_name,
  notes: orderData.notes,
  payment_method: orderData.payment_method,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

return res.status(201).json(orderResponse);
```

## API Client

For convenience, a typed API client is provided in `packages/web/src/lib/api-client.ts`. This client handles request/response formatting and error handling.

Example usage:

```typescript
import { apiClient } from '../lib/api-client';

// Create an order
try {
  const order = await apiClient.orders.create({
    user_id: null,
    total_amount: 15.50,
    status: 'pending',
    order_type: 'takeout',
    customer_name: 'John Doe',
    items: [
      {
        menu_item_id: 'c1',
        quantity: 2,
        price_at_time: 3.50
      }
    ]
  });
  
  console.log('Order created:', order.id);
} catch (error) {
  console.error('Failed to create order:', error.message);
}