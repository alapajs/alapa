import { BaseResourcefulController, RouteCallback } from "./base-resourceful";

/**
 * @abstract
 * The `ResourcefulController` class is an abstract base class designed to define
 * a set of common methods for resourceful controllers in an Express.js application.
 * It provides a skeleton for CRUD operations, and each method must be implemented by subclasses.
 */
export abstract class ResourcefulController extends BaseResourcefulController {
  /**
   * Handles the request to display a form for creating a new resource.
   *
   * @param req - The HTTP request object containing request details.
   * @param res - The HTTP response object used to send a response.
   * @param next - The next middleware function in the stack (optional).
   */
  abstract create: RouteCallback;

  /**
   * Handles the request to display a form for editing a specific resource.
   *
   * @param req - The HTTP request object containing request details, including the resource ID.
   * @param res - The HTTP response object used to send a response.
   * @param next - The next middleware function in the stack (optional).
   */
  abstract edit: RouteCallback;
}
