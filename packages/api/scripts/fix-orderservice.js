const fs = require('fs');
const path = require('path');

// Fix the orderService.ts file
const orderServicePath = path.join(__dirname, '../src/services/orderService.ts');
let orderServiceContent = fs.readFileSync(orderServicePath, 'utf8');

// Fix the syntax error in the console.error statement (missing comma)
orderServiceContent = orderServiceContent.replace(
  "console.error('Error creating order:' error);",
  "console.error('Error creating order:', error);"
);

fs.writeFileSync(orderServicePath, orderServiceContent);
console.log('Fixed orderService.ts file');