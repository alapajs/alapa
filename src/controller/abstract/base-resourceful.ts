/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { Controller } from "..";
import { ParsedQs } from "qs";
import { ResourcefulOptions } from "../../core/routes";
import { ResourcefulMiddleware } from "../../core/routes/interface/resourceful";

/**
 * A callback type for handling HTTP requests in a resourceful controller.
 *
 * This type allows for various combinations of parameters:
 * - Two parameters: `(req: Request, res: Response)`.
 * - Three parameters: `(req: Request, res: Response, next: NextFunction)`.
 * - Three parameters with a status code: `(req: Request, res: Response, status: number)`.
 * - Four parameters: `(req: Request, res: Response, next: NextFunction, status: number)`.
 */
// interface routeCallback {
//   /**
//    * Handles a request with two parameters.
//    *
//    * @param req - The HTTP request object containing request details.
//    * @param res - The HTTP response object used to send a response.
//    */
//   (req: Request, res: Response): void; // Two parameters

//   /**
//    * Handles a request with three parameters, including the next middleware function.
//    *
//    * @param req - The HTTP request object containing request details.
//    * @param res - The HTTP response object used to send a response.
//    * @param next - The next middleware function in the stack, called to pass control to the next handler.
//    */
//   (req: Request, res: Response, next: NextFunction): void; // Three parameters with next

//   /**
//    * Handles a request with a status code.
//    *
//    * @param req - The HTTP request object containing request details.
//    * @param res - The HTTP response object used to send a response.
//    * @param status - The HTTP status code to be sent in the response.
//    */
//   (req: Request, res: Response, status: number): void; // Three parameters with status

//   /**
//    * Handles a request with both a next function and a status code.
//    *
//    * @param req - The HTTP request object containing request details.
//    * @param res - The HTTP response object used to send a response.
//    * @param next - The next middleware function in the stack.
//    * @param status - The HTTP status code to be sent in the response.
//    */
//   (req: Request, res: Response, next: NextFunction, status: number): void; // Four parameters with next and status
// }

export type RouteCallback = RequestHandler<
  {},
  any,
  any,
  ParsedQs,
  Record<string, any>
>;

/**
 * @abstract
 * The `ResourcefulController` class is an abstract base class designed to define
 * a set of common methods for resourceful controllers in an Express.js application.
 * It provides a skeleton for CRUD operations, and each method must be implemented by subclasses.
 */
export abstract class BaseResourcefulController extends Controller {
  /**
   *  {@link ResourceOptions} for this controller
   */
  public resourceOption?: ResourcefulOptions;

  abstract middleware?: ResourcefulMiddleware;

  /**
   * Handles the request to list all resources.
   *
   * @param req - The HTTP request object containing request details.
   * @param res - The HTTP response object used to send a response.
   * @param next - The next middleware function in the stack (optional).
   */
  abstract index: RouteCallback;

  /**
   * Handles the request to retrieve a specific resource by ID.
   *
   * @param req - The HTTP request object containing request details, including the resource ID.
   * @param res - The HTTP response object used to send a response.
   * @param next - The next middleware function in the stack (optional).
   */
  abstract show: RouteCallback;

  /**
   * Handles the request to store a newly created resource.
   *
   * @param req - The HTTP request object containing the new resource data.
   * @param res - The HTTP response object used to send a response.
   * @param next - The next middleware function in the stack (optional).
   */
  abstract store: RouteCallback;

  /**
   * Handles the request to update a specific resource.
   *
   * @param req - The HTTP request object containing the updated resource data.
   * @param res - The HTTP response object used to send a response.
   * @param next - The next middleware function in the stack (optional).
   */
  abstract update: RouteCallback;

  /**
   * Handles the request to delete a specific resource.
   *
   * @param req - The HTTP request object containing request details, including the resource ID.
   * @param res - The HTTP response object used to send a response.
   * @param next - The next middleware function in the stack (optional).
   */
  abstract destroy: RouteCallback;
}
