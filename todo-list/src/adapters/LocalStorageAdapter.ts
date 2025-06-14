/**
 * @file Implements the StorageAdapter interface using the browser's localStorage.
 */

import { StorageAdapter } from './StorageAdapter';

/**
 * `LocalStorageAdapter` provides a concrete implementation of the `StorageAdapter` interface,
 * enabling the application to store and retrieve data persistently using the browser's `localStorage`.
 * This class serves as an adapter, making the `localStorage` API compatible with the generic `StorageAdapter` interface.
 */
export class LocalStorageAdapter implements StorageAdapter {
  /**
   * Retrieves an item from `localStorage` by its key.
   * @param {string} key - The key of the item to retrieve.
   * @returns {string | null} The value of the item, or `null` if the item is not found in `localStorage`.
   */
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Stores an item in `localStorage` with a given key and value.
   * @param {string} key - The key of the item to store.
   * @param {string} value - The string value to store.
   */
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Removes an item from `localStorage` by its key.
   * @param {string} key - The key of the item to remove.
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
} 