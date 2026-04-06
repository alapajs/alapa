import { BaseResourcefulController } from "./base-resourceful";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ResourcefulController } from "./resourceful-controller";

/**
 * @abstract
 * The `RestfulResource` class serves as an abstract base class designed to define
 * a set of common methods for resourceful controllers in a  application.
 * It provides a skeleton for CRUD (Create, Read, Update, Delete) operations,
 * requiring each method to be implemented by subclasses.
 *
 * Note: The `create` and `edit` methods are intentionally excluded from {@link ResourcefulController}.
 */
export abstract class RestfulResource extends BaseResourcefulController {}

/**
 * @abstract
 * The `ApiResource` class is an alias for {@link RestfulResource}.
 *
 * This class inherits all methods and properties from `RestfulResource`,
 * allowing it to serve as a specialized version tailored for API use cases.
 */
export abstract class ApiResource extends RestfulResource {}
