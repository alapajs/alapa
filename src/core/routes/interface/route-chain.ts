import { BaseRouterInterface } from "./base";

export interface RouteChain extends BaseRouterInterface {
  name: (routeName: string) => RouteChain;
}
