/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from ".";
import { RouteChain } from "../interface/route-chain";
import { makeResourcefulRoute, ResourceOptions } from "./extension/resource";

export class ResourceRouteManager {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public resource(
    path: string,
    controller: any,
    option?: ResourceOptions
  ): RouteChain {
    makeResourcefulRoute(path, controller, this.router, option);
    return this.router.all("");
  }

  public restfulResource(
    path: string,
    controller: any,
    options?: ResourceOptions
  ): RouteChain {
    options = {
      createNames: false,
      namePrefix: "api",
      ...options,
      except: [...(options?.except || []), "create", "edit"],
    };
    return this.resource(path, controller, options); // Placeholder
  }

  public apiResource(
    path: string,
    controller: any,
    options?: ResourceOptions
  ): RouteChain {
    return this.restfulResource(path, controller, options);
  }

  public resources(
    resources: { [route: string]: any },
    options: ResourceOptions
  ): RouteChain {
    for (const [path, controller] of Object.entries(resources)) {
      this.resource(path, controller, options);
    }
    return this.router.all("");
  }

  public restfulResources(
    resources: { [route: string]: any },
    options: ResourceOptions
  ): RouteChain {
    options = {
      createNames: false,
      namePrefix: "api",
      ...options,
      except: [...(options?.except || []), "create", "edit"],
    };
    return this.resources(resources, options);
  }

  public apiResources(
    resources: { [route: string]: any },
    options: ResourceOptions
  ): RouteChain {
    return this.restfulResources(resources, options);
  }
}
