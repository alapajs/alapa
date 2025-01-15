import { BaseRouterInterface } from "./base";

/**
 * RouteChain
 *
 * The `RouteChain` interface extends the `BaseRouterInterface` and adds a method for setting the name of a route.
 * This allows for creating more flexible and chainable route definitions, enabling the assignment of a name to a route
 * that can be used for referencing the route within the application, such as for generating URLs or adding metadata.
 */
export interface RouteChain extends BaseRouterInterface {
  /**
   * name
   *
   * Assigns a name to the current route. Naming routes is helpful for referencing them in various parts of the application,
   * such as generating URLs or linking routes dynamically. Named routes are often used in applications with routing systems
   * that allow for easy URL generation and navigation.
   *
   * @param routeName - The name to be assigned to the route. This should be a unique string that identifies the route.
   *
   * @returns The current `RouteChain` instance for method chaining, allowing further configuration of the route.
   */
  name: (routeName: string) => RouteChain;
}
