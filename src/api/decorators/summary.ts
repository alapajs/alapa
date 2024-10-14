export function OpenApiSummary() {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(target, propertyKey, descriptor.value); // property instead of propertyKey
    //   Reflect.defineMetadata(ROUTE_KEY, route, target, propertyKey);
    //   Reflect.defineMetadata(METHOD_KEY, method, target, propertyKey);
    //   console.log(target, propertyKey); // property instead of propertyKey
    //   temporalCollections["objects"].push(propertyKey);
    //   if (!temporalCollections["routes"]) {
    //     temporalCollections["routes"] = {};
    //   }
    //   temporalCollections["routes"][propertyKey] = route;
    //   if (!temporalCollections["methods"]) {
    //     temporalCollections["methods"] = {};
    //   }
    //   temporalCollections["methods"][propertyKey] = method;
  };
}
