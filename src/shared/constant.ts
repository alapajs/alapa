export const SUCCESS: string = "success";
export const ERROR: string = "error";
export const WARNING: string = "warning";
export const INFO: string = "info";
export const DEBUG: string = "debug";
export const ACTIVE: string = "active";

export const enum LOG_LEVEL {
  ERROR = 1,
  WARNING = 2,
  INFO = 3,
  DEBUG = 4,
  SUCCESS = 5,
}

export const enum STATUS {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  SUCCESS = "success",
}

export const EVN =
  process.env.NODE_ENV == "production" ||
  process.env.APP_ENV == "production" ||
  process.env.DEBUG == "false"
    ? "production"
    : "development";

/**
 * HTTP_METHODS
 *
 * Enum representing common HTTP methods and their corresponding use cases.
 * Each method is associated with an HTTP verb (e.g., GET, POST, PUT) and is used to define the type of operation
 * being performed when interacting with a web server. The methods in this enum are used to define routes and the
 * operations they support in web applications.
 *
 * The methods provide a standardized way of interacting with resources on the server, and they are fundamental
 * to RESTful APIs and other web application frameworks.
 */
export enum HTTP_METHODS {
  /**
   * GET
   *
   * Description: The GET method is used to retrieve data from a server. It is the most common HTTP method for fetching resources or data.
   * Use Case: Use GET when you need to fetch information, such as displaying a list of items, retrieving a single record, or accessing static resources like images or files.
   * Example: Fetching a list of users or retrieving a specific product by its ID.
   */
  get = "get",

  /**
   * POST
   *
   * Description: The POST method is used to send data to the server, often to create a new resource. It typically includes a body containing the data to be sent.
   * Use Case: Use POST when you need to create new data, such as submitting a form, uploading a file, or adding a new resource to the system.
   * Example: Creating a new user account or submitting a new comment.
   */
  post = "post",

  /**
   * PUT
   *
   * Description: The PUT method is used to update or replace an existing resource with new data. It usually involves sending a complete representation of the resource.
   * Use Case: Use PUT when you want to replace an entire resource. This method will overwrite the resource, and if the resource does not exist, it may create a new one.
   * Example: Updating an existing user's profile information or replacing the details of a product.
   */
  put = "put",

  /**
   * PATCH
   *
   * Description: The PATCH method is used to make partial updates to an existing resource. Unlike PUT, it only sends the changes rather than the entire resource.
   * Use Case: Use PATCH when you need to update only a part of a resource without altering the entire data. It's more efficient than PUT when you don't need to modify the entire resource.
   * Example: Updating a user's email address or changing a product's price.
   */
  patch = "patch",

  /**
   * DELETE
   *
   * Description: The DELETE method is used to remove a resource from the server.
   * Use Case: Use DELETE when you need to delete a resource, such as removing a record, deleting a file, or clearing user data.
   * Example: Deleting a user account or removing a product from the catalog.
   */
  delete = "delete",

  /**
   * HEAD
   *
   * Description: The HEAD method is similar to GET, but it only retrieves the headers of a resource without the actual content (body).
   * Use Case: Use HEAD when you need metadata about a resource, such as checking for the existence of a resource or checking headers like content type or modification date without retrieving the full content.
   * Example: Checking if a resource exists or verifying its last modified date without downloading it.
   */
  head = "head",

  /**
   * OPTIONS
   *
   * Description: The OPTIONS method is used to describe the communication options for the target resource, such as supported HTTP methods (e.g., GET, POST, PUT) and any required headers.
   * Use Case: Use OPTIONS to determine what HTTP methods are supported by a resource or to perform preflight checks in CORS (Cross-Origin Resource Sharing).
   * Example: Querying the allowed HTTP methods on a server or making a CORS preflight request.
   */
  options = "options",

  /**
   * ALL
   *
   * Description: The ALL method is a wildcard that matches all HTTP methods. This can be useful in scenarios where you need to handle multiple HTTP methods in a generic way.
   * Use Case: Use ALL when you want to provide a handler for all HTTP methods, allowing you to implement dynamic or flexible routing without specifying each method individually.
   * Example: A catch-all route that processes any HTTP method to log or perform actions for any request type.
   */
  all = "all",

  /**
   * USE
   *
   * Description: The USE method is a special method to indicate middleware that applies to all types of requests for a given route or globally.
   * Use Case: Use USE when you want to apply middleware functions to routes without specifying a specific HTTP verb.
   * Example: Using middleware to log requests or authenticate users before reaching specific routes.
   */
  use = "use",

  /**
   * VIEW
   *
   * Description: The VIEW method is used for rendering views in response to a request. It is often used in MVC frameworks for generating HTML pages.
   * Use Case: Use VIEW when you want to render a template or view in response to a request.
   * Example: Rendering a webpage with dynamic content like user profiles or search results.
   */
  view = "view",
}
