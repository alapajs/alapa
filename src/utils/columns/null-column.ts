import { Column, ColumnOptions } from "typeorm";

export function NullColumn(options?: ColumnOptions) {
  return function (object: object, propertyName: string) {
    Column({
      nullable: true,
      ...options,
    })(object, propertyName);
  };
}
