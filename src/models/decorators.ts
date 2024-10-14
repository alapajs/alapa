import { EntityOptions, Entity } from "typeorm";

export type TableModelOptions = EntityOptions;

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function TableModel(name?: string, options?: TableModelOptions) {
  return Entity(name, options);
}
