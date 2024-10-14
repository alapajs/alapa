import { Router } from "express";
import { BaseRouterInterface } from "./base";

export interface IRouter extends BaseRouterInterface {
  toExpressRoutes: () => Router;
  getNames: () => { [key: string]: string };
}
