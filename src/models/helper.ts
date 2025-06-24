/* eslint-disable @typescript-eslint/no-explicit-any */
import { empty } from "../utils";
import { Model } from "./main";
import "reflect-metadata";
export const CHANGED_ATTRIBUTE_META_KEY = Symbol("changedAttributes");
export const ORIGINAL_VALUE_KEY = Symbol("originalValuesChanged");
export const FILLABLE_KEYS = Symbol("fillable");
export const GUARD_KEYS = Symbol("guard");
export const EXCLUDE_FIELDS_KEY = Symbol("excludeFields");
export const INCLUDE_FIELDS_KEY = Symbol("includeFields");
export const REFLECT_META_MODEL_OBJECT = new Date(0);
export const MODEL_UNIQUE_ID = Symbol("Model:Instance:UniqueID");
export const DECORATOR_METHODS_FOR_FORMATTED_KEY = Symbol(
  "decorator:method:formatted:fields"
);
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
    const guard = Reflect.getMetadata(GUARD_KEYS, model) ?? [];
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
    try {
      return model.toClient();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return model;
    }
  }
}
