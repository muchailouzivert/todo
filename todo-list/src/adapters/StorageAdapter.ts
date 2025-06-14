/**
 * @file Defines the interface for a generic storage adapter (Adapter Pattern).
 */

/**
 * Interface for a generic storage adapter. This abstraction allows the application
 * to interact with different storage mechanisms (e.g., localStorage, IndexedDB, a backend API)
 * without coupling the business logic to a specific implementation.
 */
export interface StorageAdapter {
  /**
   * Retrieves an item from the storage by its key.
   * @param {string} key - The key of the item to retrieve.
   * @returns {string | null} The value of the item, or null if the item is not found.
   */
  getItem(key: string): string | null;
  /**
   * Stores an item in the storage with a given key and value.
   * @param {string} key - The key of the item to store.
   * @param {string} value - The value to store.
   */
  setItem(key: string, value: string): void;
  /**
   * Removes an item from the storage by its key.
   * @param {string} key - The key of the item to remove.
   */
  removeItem(key: string): void;
} 