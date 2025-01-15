import { ControllerClass, ControllerOptions } from "../interface/controller";
import { RouteChain } from "../interface";
import { Router } from ".";
import { ControllerRoutes } from "./extension/controller";

export class ControllerHandler {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }
  public controller(
    path: string | ControllerClass,
    controller?: ControllerClass | ControllerOptions,
    option?: ControllerOptions | ControllerClass
  ): RouteChain {
    new ControllerRoutes(this.router, path, controller, option);
    return this.router.all("");
  }
}
