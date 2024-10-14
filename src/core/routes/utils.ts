import { getRouteByName } from "./names";

export const url = getRouteByName;
export const route = getRouteByName;

import { StringObject } from "../../interface/object";
import { updateRoutesWithNames } from "./handlers/list";
import { IRouter } from "./interface/router";
import { RoutesNames } from "./names";
export function adjustNameWithPrefix(prefix: string, ...routes: IRouter[]) {
  for (const route of routes) {
    const routeNames: StringObject = route.getNames();
    for (const key in routeNames) {
      routeNames[key] = `${prefix}/${routeNames[key]}`
        .replace("//", "/")
        .replace(/\/$/, "");
      RoutesNames[key] = routeNames[key];
    }
  }
  updateRoutesWithNames();
}
