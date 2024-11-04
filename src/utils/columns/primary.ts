import {
  BeforeInsert,
  PrimaryGeneratedColumn,
  PrimaryColumn as TPrimaryColumn,
} from "typeorm";
import { md5, randomNumber } from "../mics";
import { v4 as uuidv4 } from "uuid";
import { PrimaryGeneratedColumnNumericOptions } from "typeorm/decorator/options/PrimaryGeneratedColumnNumericOptions";
import { PrimaryGeneratedColumnUUIDOptions } from "typeorm/decorator/options/PrimaryGeneratedColumnUUIDOptions";
import { PrimaryGeneratedColumnIdentityOptions } from "typeorm/decorator/options/PrimaryGeneratedColumnIdentityOptions";

type PrimaryKeyType = "md5" | "increment" | "uuid" | "identity";

export function PrimaryColumn(
  type?: PrimaryKeyType | "increment" | "uuid",
  options?:
    | PrimaryGeneratedColumnNumericOptions
    | PrimaryGeneratedColumnUUIDOptions
    | PrimaryGeneratedColumnIdentityOptions
) {
  return function (object: object, propertyName: string) {
    if (type === "increment") {
      // Use PrimaryGeneratedColumn with increment strategy
      PrimaryGeneratedColumn("increment", options)(object, propertyName);
      return; // No need for a BeforeInsert hook
    }

    if (type === "uuid") {
      // Use PrimaryGeneratedColumn with UUID strategy
      PrimaryGeneratedColumn("uuid", options)(object, propertyName);
      return; // No need for a BeforeInsert hook
    }

    // Apply the @PrimaryColumn decorator for other types
    TPrimaryColumn()(object, propertyName);

    // Add a @BeforeInsert hook to generate the key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const beforeInsertHook = function (this: any) {
      if (!this[propertyName]) {
        if (type === "md5") {
          this[propertyName] = md5(`${randomNumber()}${uuidv4()}`);
        } else {
          this[propertyName] = randomNumber(8); // Fallback if no type matches
        }
      }
    };

    // Apply the @BeforeInsert hook
    BeforeInsert()(object, "beforeInsert");

    // Register the beforeInsert method on the prototype
    object.constructor.prototype.beforeInsert = beforeInsertHook;
  };
}
