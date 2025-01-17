/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";
import { RoutesNames } from "../names";
import { List } from "../../../interface/class/list";
import { Map } from "../../../interface/class/map";
import { IRouter } from "../interface/router";
import { RequestHandler } from "../interface/handler";

interface IRoutes {
  name: string;
  method: string;
  callbacks: any;
}

interface IRawRoutes extends IRoutes {
  path: string;
}

const RawRoutes: List<IRawRoutes> = new List<IRawRoutes>();

export const Routes: Map<string, IRoutes> = new Map<string, IRoutes>();

export const addToRouteList = (
  path: string,
  method: string,
  name: string,
  ...handlers: RequestHandler[] | Router[] | IRouter[]
) => {
  if (handlers.length == 0 || method.length == 0) {
    return;
  }
  const endpoints = new List<string>();
  handlers.map((handler) => {
    if (typeof handler === "function") {
      endpoints.push(handler.name);
    } else if (typeof handler === "object") {
      endpoints.push(handler.constructor.name);
    }
  });

  RawRoutes.push({
    callbacks: endpoints,
    path: path,
    method: method,
    name: name,
  });
};

export const updateRoutesWithNames = () => {
  RawRoutes.map((route) => {
    if (route.name != "" && RoutesNames[route.name]) {
      route.path = RoutesNames[route.name].trim();
      return route;
    }
    return route;
  });
};

export const updateRouteList = () => {
  updateRoutesWithNames();
  RawRoutes.forEach((route) => {
    if (route.path) {
      Routes.add(route.path, route);
    }
  });
};
