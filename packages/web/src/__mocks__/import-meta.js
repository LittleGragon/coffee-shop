// Mock for import.meta in Jest tests
const importMeta = {
  env: {
    VITE_USE_MOCK_DATA: 'true',
    VITE_API_BASE_URL: 'http://localhost:3001/api'
  }
};

export default importMeta;