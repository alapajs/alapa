/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from ".";
import { ControllerClass } from "../interface/controller";
import { ResourcefulOptions } from "../interface/resourceful";
import { RouteChain } from "../interface/route-chain";
import { ResourcefulRoute } from "./extension/resource";
import { RouterUtils } from "./utils";

export class ResourceRouteManager {
  private router: Router;
  private utils: RouterUtils;
  constructor(router: Router) {
    this.router = router;
    this.utils = new RouterUtils(router);
  }

  public resource(
    path: string,
    controller: ControllerClass,
    option?: ResourcefulOptions
  ): RouteChain {
    new ResourcefulRoute(path, controller, this.router, option);
    return this.utils.addFakeMethod();
  }

  public restfulResource(
    path: string,
    controller: ControllerClass,
    options?: ResourcefulOptions
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
    controller: ControllerClass,
    options?: ResourcefulOptions
  ): RouteChain {
    return this.restfulResource(path, controller, options);
  }

  public resources(
    resources: { [route: string]: any },
    options: ResourcefulOptions
  ): RouteChain {
    for (const [path, controller] of Object.entries(resources)) {
      this.resource(path, controller, options);
    }
    return this.utils.addFakeMethod();
  }

  public restfulResources(
    resources: { [route: string]: ControllerClass },
    options: ResourcefulOptions
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
    resources: { [route: string]: ControllerClass },
    options: ResourcefulOptions
  ): RouteChain {
    return this.restfulResources(resources, options);
  }
}
