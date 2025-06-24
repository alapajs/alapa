/* eslint-disable @typescript-eslint/no-explicit-any */
import { GlobalConfig } from "../shared/globals";
import { empty, getClassName } from "../utils";
import "reflect-metadata";
import {
  CHANGED_ATTRIBUTE_META_KEY,
  FILLABLE_KEYS,
  GUARD_KEYS,
  ModelHelper,
  ORIGINAL_VALUE_KEY,
  REFLECT_META_MODEL_OBJECT,
} from "./helper";
import { Model } from "./main";
import { ModelCreateOption } from "./types";

export class ModelUtils {
  static isDirty<K extends keyof any>(
    modelUniqueId: string,
    attribute?: K | K[]
  ): boolean {
    const changedAttributes: string[] =
      Reflect.getOwnMetadata(
        CHANGED_ATTRIBUTE_META_KEY,
        REFLECT_META_MODEL_OBJECT,
        modelUniqueId
      ) ?? [];
    if (changedAttributes == undefined) return false;
    if (attribute == undefined) {
      return changedAttributes.length > 0;
    }

    if (empty(changedAttributes)) {
      return false;
    }

    if (Array.isArray(attribute)) {
      if (attribute.length === 0) {
        return changedAttributes.length > 0;
      }

      return changedAttributes.some((attr) =>
        (attribute as string[]).includes(attr as string)
      );
    }

    return changedAttributes.includes(attribute as string);
  }

  static trackChanges(key: any, oldValue: any, modelUniqueID: string) {
    if (ModelHelper.defaultHiddenFields.includes(key as string)) {
      return;
    }

    const changedAttributes: string[] =
      Reflect.getMetadata(
        CHANGED_ATTRIBUTE_META_KEY,
        REFLECT_META_MODEL_OBJECT,
        modelUniqueID
      ) ?? [];

    if (changedAttributes.includes(key as string)) {
      return;
    }

    changedAttributes.push(key.toString());
    Reflect.defineMetadata(
      CHANGED_ATTRIBUTE_META_KEY,
      changedAttributes,
      REFLECT_META_MODEL_OBJECT,
      modelUniqueID
    );

    //Save old Values
    const originalValuesChanged =
      Reflect.getMetadata(
        ORIGINAL_VALUE_KEY,
        REFLECT_META_MODEL_OBJECT,
        modelUniqueID
      ) ?? {};

    originalValuesChanged[key] = oldValue;
    Reflect.defineMetadata(
      ORIGINAL_VALUE_KEY,
      originalValuesChanged,
      REFLECT_META_MODEL_OBJECT,
      modelUniqueID
    );
  }

  static async create<M = any>(
    model: Model,
    attributes: Partial<M>,
    option?: ModelCreateOption
  ) {
    const preventSilentlyDiscardingAttributes =
      option?.preventSilentlyDiscardingAttributes ??
      GlobalConfig.model?.preventSilentlyDiscardingAttributes;
    if (!ModelHelper.usingFillableAndGuard(model)) {
      if (preventSilentlyDiscardingAttributes) {
        throw new Error(
          `Model (${getClassName(model)}) does not have fillable or guard attributes defined, you cannot use the create method without them.`
        );
      }
    }
    const rawFillable = Reflect.getMetadata(FILLABLE_KEYS, model) ?? [];
    const rawGuard = Reflect.getMetadata(GUARD_KEYS, model) ?? [];
    const fillable = ModelHelper.getConditionalFieldKey(rawFillable, model);
    const guard = ModelHelper.getConditionalFieldKey(rawGuard, model);

    for (const key in attributes) {
      const oldValue = (this as any)[key];
      if (oldValue == attributes[key]) continue;
      if (
        fillable.length > 0 &&
        !fillable.includes(key) &&
        !fillable.includes("*")
      ) {
        if (preventSilentlyDiscardingAttributes) {
          throw new Error(
            `Attribute "${key}" is not fillable and can only be set directly.`
          );
        }
        continue;
      }
      if (empty(fillable)) {
        if (guard.includes(key)) {
          if (preventSilentlyDiscardingAttributes) {
            throw new Error(
              `Attribute "${key}" is guarded and can only be set directly.`
            );
          }
          continue;
        }
      }

      (model as any)[key] = attributes[key];
    }

    if (option?.fillOnly == true) {
      return model;
    }
    return await model.save();
  }

  static defineListMetadata(
    key: any,
    value: any[],
    target: any,
    propertyKey?: symbol | string
  ) {
    value = [...new Set(value)];
    if (propertyKey) {
      return Reflect.defineMetadata(key, value, target, propertyKey);
    }
    return Reflect.defineMetadata(key, value, target);
  }
}
