/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { EntitySubscriberInterface } from "typeorm";
/**
 * `ModelSubscriberInterface` is a semantic extension of TypeORM's `EntitySubscriberInterface`,
 * used to define lifecycle event subscribers for entities (also referred to as "models" in some domains).
 *
 * This interface allows developers to hook into various model-related events such as insertions.
 *
 * @template Model - The model that this subscriber listens to. Defaults to `any`,
 *                   but it's recommended to pass a concrete type for better type safety.
 *
 * @example
 * ```ts
 * import { EventSubscriber, InsertEvent } from "alapa";
 * import { User } from "../entities/User";
 *
 * @EventSubscriber()
 * export class UserSubscriber implements ModelSubscriberInterface<User> {
 *   listenTo() {
 *     return User;
 *   }
 *
 *   beforeInsert(event: InsertEvent<User>) {
 *     console.log("Before user insertion:", event.entity);
 *   }
 * }
 * ```
 *
 * @see {@link EntitySubscriberInterface} for full list of available lifecycle hooks.
 */
export interface ModelSubscriberInterface<Model = any>
  extends EntitySubscriberInterface<Model> {}
