/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityTarget, ObjectLiteral } from "typeorm";
import { DatabaseConnection } from "../database/connections";
import { empty } from "../utils";
import { Model } from "./main";
import "reflect-metadata";
export const CHANGED_ATTRIBUTE_META_KEY = Symbol("changedAttributes");
export const ORIGINAL_VALUE_KEY = Symbol("originalValuesChanged");
export const FILLABLE_KEYS = Symbol("fillableFields");
export const GUARDED_KEYS = Symbol("guardedFields");
export const EXCLUDE_FIELDS_KEY = Symbol("excludeFields");
export const INCLUDE_FIELDS_KEY = Symbol("includeFields");
export const REFLECT_META_MODEL_OBJECT = new Date(0);
export const MODEL_UNIQUE_ID = Symbol("Model:Instance:UniqueID");
export const FUNCTIONS_FORMATTED_FIELDS_KEY = Symbol("formattedFields");
export const METHODS_FORMATTED_FIELDS_KEY = Symbol("method:formatted:fields");
export const MODEL_KEYS = Symbol("model-key");
export class ModelHelper {
  static defaultHiddenFields: string[] = [
    "newEntity",
    "excludedAttributes",
    "originalValuesChanged",
    "changedAttributes",
    "fillable",
    "guard",
    "includeFields",
    "excludeFields",
    "hiddenFields",
    "devHiddenFields",
    "formattedFields",
  ];

  static getConditionalFieldKey(rawKeys: any[], model: Model): string[] {
    try {
      if (empty(rawKeys)) {
        return [];
      }
      const keys: string[] = [];

      for (const field of rawKeys) {
        if (typeof field == "string") {
          keys.push(field);
        }
        if (typeof field == "object") {
          const [key, condition] = Object.entries(field)[0];

          if (typeof condition === "function" ? condition(model) : condition) {
            keys.push(key);
          }
        }
      }
      return keys;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // console.log(e);
      return [];
    }
  }

  static deleteMetalsAfterLoad(modelUniqueId: string) {
    Reflect.deleteMetadata(
      CHANGED_ATTRIBUTE_META_KEY,
      REFLECT_META_MODEL_OBJECT,
      modelUniqueId
    );
    Reflect.deleteMetadata(
      ORIGINAL_VALUE_KEY,
      REFLECT_META_MODEL_OBJECT,
      modelUniqueId
    );
  }

  static usingFillableAndGuard(model: Model) {
    const fillable = Reflect.getMetadata(FILLABLE_KEYS, model) ?? [];
    const guard = Reflect.getMetadata(GUARDED_KEYS, model) ?? [];
    return !empty(fillable) || !empty(guard);
  }

  static skipIncludeExclude(key: any): boolean {
    let result = false;
    const fields: any[] = [];
    for (const field of fields) {
      if (key.startsWith(field) || key == field) {
        result = true;
      }
    }
    return result;
  }

  static toClient(model: any) {
    if (!(model instanceof Model)) return model;
    if (!(typeof model.toClient === "function")) return model;
    const includes = model.getExcludeFields();
    const excludes = model.getIncludeFields();
    if (empty(includes) && empty(excludes)) {
      return model;
    }
    try {
      // return model.toClient();
      return model;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.log(e);
      return model;
    }
  }

  static getSafeRepo<T extends ObjectLiteral>(model: EntityTarget<T>) {
    if (DatabaseConnection.options.type === "mongodb") {
      return DatabaseConnection.getMongoRepository(model);
      // Use MongoDB-specific operations here
    } else {
      return DatabaseConnection.getRepository(model);
      // Use regular SQL-style repository
    }
  }
}
