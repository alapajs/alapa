import { Middleware } from "./handler";

/**
 * Defines the custom verb names for resourceful routes.
 * Used to configure the route actions like index, create, show, etc.
 */
export interface ResourcefulVerb {
  /**
   * Name for the index route, typically used to retrieve a list of resources.
   */
  index?: string;

  /**
   * Name for the create route, typically used to display a form for creating a new resource.
   */
  create?: string;

  /**
   * Name for the store route, typically used to handle the submission of a new resource.
   */
  store?: string;

  /**
   * Name for the show route, typically used to retrieve and display a specific resource.
   */
  show?: string;

  /**
   * Name for the edit route, typically used to display a form for editing an existing resource.
   */
  edit?: string;

  /**
   * Name for the update route, typically used to handle the submission of changes to an existing resource.
   */
  update?: string;

  /**
   * Name for the delete route, typically used to remove a specific resource.
   */
  destroy?: string;
}

/**
 * Middleware functions for resourceful routes.
 * Middleware can be executed before or after the route handler.
 */
export interface ResourcefulMiddleware {
  /**
   * Middleware function to be executed before the index action.
   */
  index?: Middleware | Middleware[];

  /**
   * Middleware function to be executed before the create action.
   */
  create?: Middleware | Middleware[];

  /**
   * Middleware function to be executed before the store action.
   */
  store?: Middleware | Middleware[];

  /**
   * Middleware function to be executed before the show action.
   */
  show?: Middleware | Middleware[];

  /**
   * Middleware function to be executed before the edit action.
   */
  edit?: Middleware | Middleware[];

  /**
   * Middleware function to be executed before the update action.
   */
  update?: Middleware | Middleware[];

  /**
   * Middleware function to be executed before the destroy action.
   */
  destroy?: Middleware | Middleware[];

  /**
   * Middleware function to be executed before all actions.
   * Executed before any route handler is invoked.
   */
  before?: Middleware | Middleware[];
  /**
   * Middleware function to be executed after all actions.
   * Executed after a route handler has been invoked.
   */
  after?: Middleware | Middleware[];
}

/**
 * Default verb names used for resourceful routes.
 * This provides default names for the various routes if no custom names are provided.
 */
export const defaultVerb: ResourcefulVerb = {
  index: "index",
  create: "create",
  store: "store",
  show: "show",
  edit: "edit",
  update: "update",
  destroy: "destroy",
};

/**
 * Options for configuring resourceful routes.
 * Allows customization of route names, inclusion/exclusion of routes, and middleware handling.
 */
export interface ResourcefulOptions {
  /**
   * Whether to change route names to use the provided verb names.
   * Default is true.
   */
  changeNamesWithVerbs?: boolean;

  /**
   * Whether to create route names for create actions.
   * Default is true.
   */
  createNames?: boolean;

  /**
   * A prefix to be added to route names.
   */
  namePrefix?: string;

  /**
   * Specify which routes to include.
   * Can be a single route name or an array of route names.
   */
  only?: string[] | string;

  /**
   * Specify which routes to exclude.
   * Can be a single route name or an array of route names.
   */
  except?: string[] | string;

  /**
   * Custom verb names to use for the resourceful routes.
   */
  verb?: ResourcefulVerb;

  /**
   * Middleware functions to be executed for resourceful routes.
   */
  middleware?: ResourcefulMiddleware;
  /**
   * Whether to merge a single route middleware with the `before` middleware.
   * If `false`, the middleware for each action will be executed separately (default behavior).
   * If `true`, the middleware for the action will be combined with the `before` middleware, executed together.
   * Default is `false`.
   */
  mergeMiddleware?: boolean; // Defaults to false
}

/**
 * Enum representing the different resourceful actions for a controller.
 *
 * This enum is used to define the standard CRUD operations (and their variants)
 * for a resource in a RESTful API. It helps ensure consistency across your
 * routes and actions by using predefined string constants rather than magic strings.
 *
 * Each action corresponds to a typical HTTP operation:
 *
 * - `INDEX`: Represents listing all resources (e.g., `GET /`).
 * - `CREATE`: Represents showing the form to create a new resource (e.g., `GET /create`).
 * - `STORE`: Represents the action of creating a new resource (e.g., `POST /`).
 * - `SHOW`: Represents viewing a single resource by its ID (e.g., `GET /:id`).
 * - `EDIT`: Represents showing the form to edit an existing resource (e.g., `GET /:id/edit`).
 * - `UPDATE`: Represents updating an existing resource (e.g., `PUT /:id` or `PATCH /:id`).
 * - `DESTROY`: Represents deleting a resource (e.g., `DELETE /:id`).
 *
 * By using this enum, you can maintain consistency and avoid errors due to hardcoding action names as strings.
 */
export enum ResourceActionEnum {
  /**
   * `INDEX` action represents listing all resources of a given type.
   *
   * Typically used for displaying a collection of resources (e.g., `GET /resources`).
   * This is where you would retrieve a paginated or filtered list of resources.
   *
   * **Use Case**:
   * - Displaying a list of all blog posts.
   * - Fetching all users from a user management system.
   */
  INDEX = "index",

  /**
   * `CREATE` action represents showing the form or interface to create a new resource.
   *
   * This is commonly used for rendering a form where the user can input data to create a new resource.
   * This action usually maps to a `GET` request to show a creation interface, such as a form or template.
   *
   * **Use Case**:
   * - Displaying the "New Post" form on a blog platform.
   * - Showing the "Add New User" form in an admin panel.
   */
  CREATE = "create",

  /**
   * `STORE` action represents creating a new resource from the submitted data.
   *
   * This action handles the actual process of storing the newly created resource to a database.
   * It is typically associated with a `POST` request to store the resource.
   *
   * **Use Case**:
   * - Saving a new blog post to the database after submitting the form.
   * - Storing a new user after filling out the registration form.
   */
  STORE = "store",

  /**
   * `SHOW` action represents displaying a single resource by its ID.
   *
   * This is used for retrieving and displaying a specific resource's details, often identified by its `id`.
   * Typically corresponds to a `GET` request with a parameter (e.g., `GET /:id`).
   *
   * **Use Case**:
   * - Viewing the details of a single blog post.
   * - Fetching and displaying a user's profile information.
   */
  SHOW = "show",

  /**
   * `EDIT` action represents showing the form or interface to edit an existing resource.
   *
   * This is typically used for displaying an edit form where the user can update an existing resource.
   * It corresponds to a `GET` request with the resource ID to fetch and pre-fill the form with current data.
   *
   * **Use Case**:
   * - Showing the "Edit Post" form on a blog platform with pre-filled content.
   * - Displaying the "Edit User" form in an admin panel for updating user information.
   */
  EDIT = "edit",

  /**
   * `UPDATE` action represents the process of updating an existing resource.
   *
   * This action is used for applying changes to a resource. It typically maps to a `PUT` or `PATCH` request
   * to update the resource on the server with the new data.
   *
   * **Use Case**:
   * - Updating the content of a blog post after editing it.
   * - Changing a user's password or email address.
   */
  UPDATE = "update",

  /**
   * `DESTROY` action represents deleting a resource.
   *
   * This is used for removing a resource permanently. Typically maps to a `DELETE` request, where the
   * resource is identified by its `id`.
   *
   * **Use Case**:
   * - Deleting a blog post after an admin or the author decides to remove it.
   * - Removing a user from the system (e.g., "Delete User" functionality).
   */
  DESTROY = "destroy",
}
