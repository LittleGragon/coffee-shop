const fs = require('fs');
const path = require('path');

// Paths to orderService.ts files
const apiOrderServicePath = path.join(__dirname, 'packages', 'api', 'src', 'services', 'orderService.ts');
const opsOrderServicePath = path.join(__dirname, 'packages', 'coffee-shop-ops', 'src', 'services', 'orderService.ts');

function fixOrderService(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  console.log(`Fixing ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix import statement
  content = content.replace(/import \{ Order OrderItem \} from/g, 'import { Order, OrderItem } from');
  
  // Fix if conditions
  content = content.replace(/if \(conditions\.length > 0\) \{/g, 'if (conditions.length > 0) {');
  
  // Fix type annotations
  content = content.replace(/async getOrderById\(id: string\): Promise<Order \| null>/g, 
                           'async getOrderById(id: string): Promise<Order | null>');
  
  content = content.replace(/async getOrderItems\(orderId: string\): Promise<OrderItem\[\]>/g, 
                           'async getOrderItems(orderId: string): Promise<OrderItem[]>');
  
  // Fix for loops
  content = content.replace(/for \(const item of orderItems\) \{/g, 'for (const item of orderItems) {');
  
  // Fix error casting
  content = content.replace(/\(error as Error\)\.message/g, '(error as Error).message');
  
  // Fix other type annotations
  content = content.replace(/async getOrdersByStatus\(status: string\): Promise<Order\[\]>/g, 
                           'async getOrdersByStatus(status: string): Promise<Order[]>');
  
  content = content.replace(/async getUserOrders\(userId: string\): Promise<Order\[\]>/g, 
                           'async getUserOrders(userId: string): Promise<Order[]>');
  
  // Fix complex type annotation
  content = content.replace(/async getOrderCountByStatus\(\): Promise<\{status: string; count: number \}\[\]>/g, 
                           'async getOrderCountByStatus(): Promise<{status: string; count: number}[]>');
  
  // Fix executeQuery syntax
  content = content.replace(/return executeQuery<\{status: string; count: number \}>/g, 
                           'return executeQuery<{status: string; count: number}[]>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${filePath}`);
}

// Fix both orderService.ts files
fixOrderService(apiOrderServicePath);
fixOrderService(opsOrderServicePath);

console.log('Finished fixing orderService.ts files.');