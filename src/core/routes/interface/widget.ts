// import {
//   BasicRequestHandler,
//   ErrorRequestHandler,
//   Middleware,
//   RequestHandler,
// } from "./handler";
// import { MethodList } from "./method";
// import { Request, Response } from "express";

// // Abstract class for defining a route action/widget
// export abstract class Widget {
//   // Route path, e.g., "/users/:id"
//   abstract path: string;

//   // HTTP method, e.g., "GET", "POST", etc.
//   abstract method: MethodList;

//   // Main request handler for this route
//   abstract handler: RequestHandler;

//   // Additional middleware to apply to the route
//   middleware: Middleware[] = [];

//   // Route parameters (e.g., "id" in "/users/:id")
//   params: string[] = [];

//   // Name for the route action (useful for debugging/logging)
//   name: string = "";

//   // Description of the route action (optional)
//   description: string = "";

//   // Flag indicating if authentication is required for this route
//   authRequired: boolean = false;

//   // Middleware to be executed before the main handler
//   middlewaresBefore: Middleware[] = [];

//   // Middleware to be executed after the main handler
//   middlewaresAfter: Middleware[] = [];

//   // Flag indicating if the route is public (no authentication required)
//   isPublic: boolean = true;

//   // Response format (e.g., "json", "html", etc.)
//   responseFormat: string = "json";

//   // Time-to-live for caching (in seconds)
//   cacheTTL: number = 0;

//   // Custom pre-handler function for additional logic before the main handler
//   preHandler?: Function;

//   // Constructor to initialize optional properties
//   constructor(
//     path: string,
//     method: MethodList,
//     handler: RequestHandler,
//     options: {
//       name?: string;
//       description?: string;
//       authRequired?: boolean;
//       isPublic?: boolean;
//       responseFormat?: string;
//       cacheTTL?: number;
//       preHandler?: Function;
//     } = {}
//   ) {
//     this.path = path;
//     this.method = method;
//     this.handler = handler;

//     if (options.name) this.name = options.name;
//     if (options.description) this.description = options.description;
//     if (options.authRequired !== undefined)
//       this.authRequired = options.authRequired;
//     if (options.isPublic !== undefined) this.isPublic = options.isPublic;
//     if (options.responseFormat) this.responseFormat = options.responseFormat;
//     if (options.cacheTTL) this.cacheTTL = options.cacheTTL;
//     if (options.preHandler) this.preHandler = options.preHandler;
//   }
// }

// class Test implements Widget {
//   params: string[] = [];
//   path: string = "test";
//   method: MethodList = "post";
//   handler(request: Request, response: Response) {
//     response.send("hello world");
//   }
// }
