import { Map } from "./map";

/**
 * A generic dictionary class that maps keys of type K to values of type V.
 * It extends the Map class to utilize its functionality.
 *
 * @template K - The type of keys (string, number, or symbol).
 * @template V - The type of values.
 */
export class Dictionary<K extends string | number | symbol, V> extends Map<
  K,
  V
> {
  /**
   * Creates a new Dictionary with optional initial key-value pairs.
   *
   * @param initialItems - An optional object of initial key-value pairs.
   */
  constructor(initialItems?: { [key in K]: V }) {
    super(initialItems); // Call the parent constructor
  }
}
