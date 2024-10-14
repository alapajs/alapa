import { AnyObject, StringObject } from "../../interface/object";

export const RoutesNames: StringObject = {};

export const getRouteByName = (
  name: string,
  ...params: (string | number | AnyObject)[]
): string => {
  const route = RoutesNames[name.trim().toLowerCase()];
  if (route === "") return "/";

  if (route === undefined || route === null) {
    throw new Error(
      `Route name '${name}' not found, the available urls names are ${JSON.stringify(
        RoutesNames
      )}`
    );
  }

  let url = route;
  const routeList = route.split("/");
  const paramsCount = routeList.filter((routeSegment) =>
    routeSegment.startsWith(":")
  ).length;

  if (params.length !== paramsCount) {
    throw new Error(
      `Route '${name}' expects ${paramsCount} parameters, received ${params.length}`
    );
  }

  params.forEach((param) => {
    const paramPlaceholder = routeList.find((segment) =>
      segment.startsWith(":")
    );
    if (paramPlaceholder) {
      url = url.replace(paramPlaceholder, param.toString());
    }
  });
  url = url
    .split("/")
    .filter((urlSegment) => urlSegment.trim().length > 0)
    .join("/");
  return url;
};
