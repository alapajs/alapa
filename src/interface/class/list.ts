/**
 * A generic list class that extends the TypeScript Array class,
 * allowing storage of items of type V in an array-like structure.
 *
 * @template V - The type of items in the list.
 */
export class List<V> extends Array<V> {
  /**
   * Creates a new List with optional initial items.
   *
   * @param initialItems - An optional array of initial items.
   */
  constructor(...initialItems: V[]) {
    super(...initialItems);
  }

  /**
   * Removes an item from the list by element.
   *
   * @param element - The element to remove.
   * @returns The updated list after removal.
   */
  remove(element: V): List<V> {
    const index = this.findIndex((item) => item === element);
    if (index !== -1) {
      // Check if the index is valid and remove the item
      this.splice(index, 1);
    }
    return this; // Return the updated list
  }

  /**
   * Clears all items from the list.
   */
  clear(): void {
    this.length = 0;
  }
}
