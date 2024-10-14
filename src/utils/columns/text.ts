import { Column, ColumnOptions } from "typeorm";

export type TextColumnType = "text" | "longtext" | "shorttext" | "tinytext";

export function TextColumn(
  type: TextColumnType = "text",
  options?: ColumnOptions
) {
  return function (object: object, propertyName: string) {
    const databaseType = process.env.DATABASE_TYPES;
    if (databaseType === "postgres") {
      if (type === "text") {
        //change type
      }
    }
    Column({
      nullable: true,
      type: type,
      default: "",
      ...options,
    })(object, propertyName);
  };
}
