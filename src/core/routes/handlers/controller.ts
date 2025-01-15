import {
  ControllerClass,
  ControllerOptions,
  IControllerHandler,
} from "../interface/controller";
import { RouteChain } from "../interface";
import { Router } from ".";
import { ControllerRoutes } from "./extension/controller";
import { isClass } from "../../../utils";
export class ControllerHandler implements IControllerHandler {
  private router: Router;

  addRout(router: Router) {
    this.router = router;
  }
  controller(
    path: string,
    controller: ControllerClass,
    option?: ControllerOptions
  ): RouteChain;

  // The second method overload
  controller(
    controller: ControllerClass,
    option: ControllerOptions
  ): RouteChain;

  // The third method overload
  controller(controller: ControllerClass): RouteChain;

  public controller(
    pathOrController: string | ControllerClass,
    controller?: ControllerClass | ControllerOptions,
    option?: ControllerOptions | ControllerClass
  ): RouteChain {
    if (typeof pathOrController === "string") {
      // Handling the first overload: controller(path: string, controller: ControllerClass, option?: ControllerOptions)
      // pathOrController is the path, controller is passed as the second parameter
      if (!controller) {
        throw new Error("Controller must be provided when path is specified.");
      }
      // Return the RouteChain for this overload
      new ControllerRoutes(this.router, pathOrController, controller, option);
    } else {
      // Handling the second and third overloads
      if (!isClass(pathOrController)) {
        throw new Error("Controller must be provided.");
      }
      // Handle the second overload: controller(controller: ControllerClass, option: ControllerOptions)
      if (option) {
        new ControllerRoutes(this.router, controller, option);
      }
      // Handle the third overload: controller(controller: ControllerClass)
      new ControllerRoutes(this.router, pathOrController);
    }

    return this.router.all("");
  }
}
