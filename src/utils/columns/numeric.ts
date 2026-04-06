import { Column, ColumnOptions } from "typeorm";

export function NumericColumn(options?: ColumnOptions) {
  return function (object: object, propertyName: string) {
    Column({
      nullable: true,
      type: "numeric",
      default: 0,
      ...options,
    })(object, propertyName);
  };
}
