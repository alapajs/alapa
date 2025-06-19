/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "../main";

export function modelDirtyProxy<T extends Model>(
  instance: T,
  callBack?: (key: keyof T, oldValue: any) => void
): T {
  return new Proxy(instance, {
    set(target, prop, value, receiver) {
      const key = prop.toString();
      if (
        typeof prop === "string" &&
        Object.prototype.hasOwnProperty.call(target, key)
      ) {
        const oldValue = (target as any)[key];

        if (oldValue != value) {
          // Optional callback
          if (callBack) {
            callBack(key as keyof T, oldValue);
          }
        }
      }

      return Reflect.set(target, prop, value, receiver);
    },
  });
}
