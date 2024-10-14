import { BeforeInsert, PrimaryColumn as TypeormPrimaryColumn } from "typeorm";
import { md5, randomNumber } from "../mics";
import { v4 as uuidv4 } from "uuid";

export function PrimaryKeyColumn(isMd5: boolean = true) {
  return function (object: object, propertyName: string) {
    // Apply the @PrimaryColumn decorator
    TypeormPrimaryColumn()(object, propertyName);

    // Add a @BeforeInsert hook to generate the MD5 hash
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const beforeInsertHook = function (this: any) {
      if (!this[propertyName]) {
        if (isMd5) {
          this[propertyName] = md5(`${randomNumber()}${uuidv4()}`);
        } else {
          this[propertyName] = randomNumber(8);
        }
      }
    };

    // Apply the @BeforeInsert hook
    BeforeInsert()(object, "beforeInsert");

    // Register the beforeInsert method on the prototype
    object.constructor.prototype.beforeInsert = beforeInsertHook;
  };
}

// export const safeString = (value: any) => {};
