/* eslint-disable @typescript-eslint/no-explicit-any */
import { BeforeInsert, Column, ColumnOptions } from "typeorm";
import { randomNumber } from "../mics";

type ShortDateType = "year" | "month" | "day" | "hour" | "minute" | "second";

export function ShortDateColumn(type: ShortDateType, options?: ColumnOptions) {
  return function (object: object, propertyName: string) {
    // Apply the @Column decorator
    Column({
      nullable: true,
      type: "numeric",
      default: 0,
      ...options,
    })(object, propertyName);

    // Define the beforeInsert hook
    const beforeInsertHook = function (this: any) {
      const date = new Date();
      if (!this[propertyName]) {
        if (type === "year") {
          this[propertyName] = date.getFullYear();
        } else if (type === "month") {
          this[propertyName] = date.getMonth() + 1;
        } else if (type === "day") {
          this[propertyName] = date.getDate();
        } else if (type === "hour") {
          this[propertyName] = date.getHours();
        } else if (type === "minute") {
          this[propertyName] = date.getMinutes();
        } else if (type === "second") {
          this[propertyName] = date.getSeconds();
        }
      }
    };

    // Generate a unique name for the beforeInsert hook
    const uniqueName = `beforeInsert${type}${randomNumber()}`;

    // Apply the @BeforeInsert hook
    BeforeInsert()(object, uniqueName);

    // Register the beforeInsert method on the prototype
    object.constructor.prototype[uniqueName] = beforeInsertHook;
  };
}
