/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A generic map class that maps keys of type K to values of type V.
 *
 * @template K - The type of keys (string, number, or symbol).
 * @template V - The type of values.
 */
export class Map<K extends string | number | symbol, V> {
  private items: { [key in K]: V } = {} as any;

  /**
   * Creates a new Map with optional initial key-value pairs.
   *
   * @param initialItems - An optional object of initial key-value pairs.
   */
  constructor(initialItems?: { [key in K]: V }) {
    if (initialItems) {
      this.items = { ...initialItems };
    }
  }

  /**
   * Adds a key-value pair to the map.
   *
   * @param key - The key to add.
   * @param value - The value associated with the key.
   */
  add(key: K, value: V): void {
    this.items[key] = value;
  }

  /**
   * Retrieves the value associated with the given key.
   *
   * @param key - The key whose value to retrieve.
   * @returns The value associated with the key, or undefined if the key does not exist.
   */
  get(key: K): V | undefined {
    return this.items[key];
  }

  /**
   * Removes a key-value pair from the map.
   *
   * @param key - The key to remove.
   * @returns True if the key was removed, false if the key was not found.
   */
  remove(key: K): boolean {
    if (key in this.items) {
      delete this.items[key];
      return true;
    }
    return false;
  }

  /**
   * Retrieves all keys in the map.
   *
   * @returns An array of keys.
   */
  keys(): K[] {
    return Object.keys(this.items) as K[];
  }

  /**
   * Retrieves all values in the map.
   *
   * @returns An array of values.
   */
  values(): V[] {
    return Object.values(this.items);
  }

  /**
   * Retrieves all key-value pairs in the map as an array of tuples.
   *
   * @returns An array of tuples where each tuple contains a key and its corresponding value.
   */
  getAll(): [K, V][] {
    return Object.entries(this.items) as [K, V][];
  }

  /**
   * Merges another map into this map.
   *
   * @param otherMap - The map or object to merge into this map.
   */
  addAll(otherMap: Map<K, V> | { [key in K]: V }): void {
    const entries =
      otherMap instanceof Map ? otherMap.getAll() : Object.entries(otherMap);
    for (const [key, value] of entries) {
      this.add(key as K, value as V); // Use `add` to ensure type safety
    }
  }
}
