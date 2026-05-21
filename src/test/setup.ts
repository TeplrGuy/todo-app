import '@testing-library/jest-dom';

// Mock Tauri API
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

// Mock crypto.randomUUID for consistent test IDs
let uuidCounter = 0;
Object.defineProperty(globalThis.crypto, 'randomUUID', {
  value: () => `test-uuid-${++uuidCounter}`,
  configurable: true,
});

beforeEach(() => {
  uuidCounter = 0;
  localStorage.clear();
});
