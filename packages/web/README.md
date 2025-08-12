# Coffee Shop Buddy Web

This is the web frontend for the Coffee Shop Buddy application, a comprehensive solution for managing coffee shop operations.

## Features

- Menu browsing and ordering
- Member management and loyalty program
- Reservation system
- Cake customization orders
- Inventory management

## API Integration

The web package is now configured to work seamlessly with the API package. API requests from the web application are proxied to the API server.

See [API_INTEGRATION.md](./API_INTEGRATION.md) for details on how the API integration works.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- API server running (from packages/api)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your settings.

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

## Development

- `src/` - Frontend React application
- `vite.config.ts` - Configuration for Vite, including API proxy settings

## Testing

```bash
npm test
```

## License

This project is proprietary and confidential.
