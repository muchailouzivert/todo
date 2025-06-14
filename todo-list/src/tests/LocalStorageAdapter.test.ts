import { LocalStorageAdapter } from '../adapters/LocalStorageAdapter';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;
  const MOCK_STORAGE: { [key: string]: string } = {};

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => MOCK_STORAGE[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          MOCK_STORAGE[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete MOCK_STORAGE[key];
        }),
        clear: jest.fn(() => {
          for (const key in MOCK_STORAGE) {
            delete MOCK_STORAGE[key];
          }
        }),
      },
      writable: true,
    });
  });

  beforeEach(() => {
    adapter = new LocalStorageAdapter();
    window.localStorage.clear(); // Clear mock storage before each test
    jest.clearAllMocks(); // Clear mock calls
  });

  test('should get an item from localStorage', () => {
    const key = 'testKey';
    const value = 'testValue';
    MOCK_STORAGE[key] = value; // Manually set in mock storage

    const retrievedValue = adapter.getItem(key);
    expect(retrievedValue).toBe(value);
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem).toHaveBeenCalledWith(key);
  });

  test('should return null if item does not exist', () => {
    const key = 'nonExistentKey';
    const retrievedValue = adapter.getItem(key);
    expect(retrievedValue).toBeNull();
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem).toHaveBeenCalledWith(key);
  });

  test('should set an item in localStorage', () => {
    const key = 'anotherKey';
    const value = 'anotherValue';

    adapter.setItem(key, value);
    expect(MOCK_STORAGE[key]).toBe(value); // Check mock storage directly
    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(key, value);
  });

  test('should remove an item from localStorage', () => {
    const key = 'itemToRemove';
    MOCK_STORAGE[key] = 'someValue';
    expect(MOCK_STORAGE[key]).toBeDefined();

    adapter.removeItem(key);
    expect(MOCK_STORAGE[key]).toBeUndefined();
    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith(key);
  });

  test('should handle setting empty value', () => {
    const key = 'emptyValueKey';
    adapter.setItem(key, '');
    expect(MOCK_STORAGE[key]).toBe('');
  });
}); 