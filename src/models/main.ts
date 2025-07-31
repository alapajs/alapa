/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BaseEntity,
  // BeforeInsert,
  // BeforeUpdate,
} from "typeorm";
import {
  EXCLUDE_FIELDS_KEY,
  FILLABLE_KEYS,
  FUNCTIONS_FORMATTED_FIELDS_KEY,
  GUARDED_KEYS,
  INCLUDE_FIELDS_KEY,
  METHODS_FORMATTED_FIELDS_KEY,
  MODEL_UNIQUE_ID,
  ModelHelper,
  ORIGINAL_VALUE_KEY,
  REFLECT_META_MODEL_OBJECT,
} from "./helper";

import { empty, getClassName, isFunction, randomMd5 } from "../utils";
import { modelDirtyProxy } from "./proxy/dirty";
import { GlobalConfig } from "../shared/globals";
import { ModelUtils } from "./util";
import {
  includeAndExcludeFieldsOptions,
  ModelCreateOption,
  ModelIncludeFieldsMethod,
  NonFunctionKeys,
} from "./types";
import { BaseModel } from "./base";

export abstract class Model extends BaseModel {
  constructor() {
    super();
    (this as any)[MODEL_UNIQUE_ID] = randomMd5();
    return this.applyProxy();
  }

  // private changedAttributes: string[] = [];
  // private originalValuesChanged: AnyObject = {};
  private freshEntity?: boolean = true;

  abstract id: any;

  static queryBuilder(alias: string) {
    // `this` here refers to the constructor of the class (e.g., Model or its subclasses)
    return BaseEntity.getRepository().createQueryBuilder(alias);
  }

  private updateFillableAndGuard() {
    if (!empty(this.fillableFields)) {
      Reflect.defineMetadata(FILLABLE_KEYS, this.fillableFields, this);
    }
    if (empty(this.guardedFields)) {
      Reflect.defineMetadata(GUARDED_KEYS, this.guardedFields, this);
    }
  }

  isClean(): boolean;
  isClean<K extends keyof this>(attribute: K): boolean;
  isClean<K extends keyof this>(attribute: K[]): boolean;

  isClean<K extends keyof this>(attribute?: K | K[]): boolean {
    return !this.isDirty(attribute as any);
  }

  isDirty(): boolean;
  isDirty<K extends keyof this>(attribute: K): boolean;
  isDirty<K extends keyof this>(attribute: K[]): boolean;

  isDirty<K extends keyof this>(attribute?: K | K[]): boolean {
    const modelUniqueID = (this as any)[MODEL_UNIQUE_ID];
    return ModelUtils.isDirty(modelUniqueID, attribute);
  }

  protected setIncludeFields(): ModelIncludeFieldsMethod<any>[] {
    return [];
  }

  protected setExcludeFields(): ModelIncludeFieldsMethod<any>[] {
    return [];
  }

  getOriginalValues(): this;
  getOriginalValues<M extends this, K extends NonFunctionKeys<M>>(
    attribute: K
  ): M[K];
  getOriginalValues<M extends this, K extends NonFunctionKeys<M>>(
    attributes: K[]
  ): { [P in K]: M[P] };
  getOriginalValues<M extends this, K extends NonFunctionKeys<M>>(
    ...attributes: K[]
  ): { [P in K]: M[P] };
  getOriginalValues<K extends keyof this>(
    ...attribute: K[]
  ): this | this[K] | Pick<this, K> {
    const modelUniqueID = (this as any)[MODEL_UNIQUE_ID];
    let originalValuesChanged =
      Reflect.getOwnMetadata(
        ORIGINAL_VALUE_KEY,
        REFLECT_META_MODEL_OBJECT,
        modelUniqueID
      ) ?? {};
    originalValuesChanged = { ...this, ...originalValuesChanged };
    if (attribute.length == 1 && typeof attribute[0] == "string") {
      return originalValuesChanged[attribute[0]];
    }

    if (Array.isArray(attribute) || Array.isArray(attribute[0])) {
      let data: K[] = attribute;
      if (Array.isArray(attribute[0])) {
        data = attribute[0];
      }
      const values = {} as Pick<this, K>;
      for (const attr of new Set(data)) {
        values[attr] = originalValuesChanged[attr];
      }
      return values;
    }

    return originalValuesChanged;
  }

  private resetChanges() {
    delete this.freshEntity;
    const modelUniqueID = (this as any)[MODEL_UNIQUE_ID];
    ModelHelper.deleteMetalsAfterLoad(modelUniqueID);
  }

  private applyProxy() {
    return modelDirtyProxy(this, this.trackChanges.bind(this));
  }

  private trackChanges(key: keyof this, oldValue: any) {
    if (this.freshEntity === true) return;
    const modelUniqueID = (this as any)[MODEL_UNIQUE_ID];
    ModelUtils.trackChanges(key, oldValue, modelUniqueID);
  }

  applyHiddenFields() {
    for (const field of ModelHelper.defaultHiddenFields) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(field)) {
        delete (this as any)[field];
      }
    }
  }
  private buildIncludeAndExcludeField() {
    // const modelUniqueID = (this as any)[MODEL_UNIQUE_ID];
    let includeFields = Reflect.getMetadata(INCLUDE_FIELDS_KEY, this) ?? [];
    let excludeFields = Reflect.getMetadata(EXCLUDE_FIELDS_KEY, this) ?? [];

    if (!empty(this.includeFields)) {
      includeFields = [...includeFields, ...this.includeFields];
    }
    if (!empty(this.excludeFields)) {
      excludeFields = [...excludeFields, ...this.excludeFields];
    }

    if (isFunction(this.setIncludeFields)) {
      includeFields = [...includeFields, ...(this.setIncludeFields() ?? [])];
    }

    if (isFunction(this.setExcludeFields)) {
      excludeFields = [...excludeFields, ...(this.setExcludeFields() ?? [])];
    }
    ModelUtils.defineListMetadata(INCLUDE_FIELDS_KEY, includeFields, this);
    ModelUtils.defineListMetadata(EXCLUDE_FIELDS_KEY, excludeFields, this);
  }

  private applyIncludeAndExcludeField(
    options?: includeAndExcludeFieldsOptions<this>
  ) {
    const rawIncludeFields =
      options?.includes ?? Reflect.getMetadata(INCLUDE_FIELDS_KEY, this) ?? [];
    const rawExcludeFields =
      options?.excludes ?? Reflect.getMetadata(EXCLUDE_FIELDS_KEY, this) ?? [];

    if (empty(rawExcludeFields) && empty(rawIncludeFields)) {
      throw new Error(
        `Model (${getClassName(this)}) does not have includeFields or excludeFields 
           attributes defined, you cannot use the toClient, toJSON, toAPI, sanitize,
            and serialize methods without them.`.replace(/\n\s*/g, " ")
      );
    }

    const includeFields =
      ModelHelper.getConditionalFieldKey(rawIncludeFields, this) ?? [];
    const excludeFields =
      ModelHelper.getConditionalFieldKey(rawExcludeFields, this) ?? [];

    const result: Partial<this> = {};

    if (!empty(includeFields)) {
      if (includeFields.includes("*")) return this;
      for (const field of includeFields) {
        if (isFunction(this[field as keyof this])) continue;
        if (ModelHelper.skipIncludeExclude(field)) continue;
        result[field as keyof this] = ModelHelper.toClient(
          this[field as keyof this]
        );
      }
    } else if (!empty(excludeFields)) {
      for (const key in this) {
        if (
          excludeFields.includes(key) ||
          // ModelHelper.skipIncludeExclude(key)||
          isFunction(this[key as keyof this])
        ) {
          continue;
        }
        result[key] = ModelHelper.toClient(this[key]);
      }
    } else {
      for (const key in this) {
        result[key] = ModelHelper.toClient(this[key]);
      }
    }
    return result;
  }

  toClient(options?: includeAndExcludeFieldsOptions<this>): Partial<this> {
    return this.applyIncludeAndExcludeField(options);
  }

  toAPI(options?: includeAndExcludeFieldsOptions<this>): Partial<this> {
    return this.applyIncludeAndExcludeField(options);
  }

  toJSON(options?: includeAndExcludeFieldsOptions<this>): Partial<this> {
    return this.applyIncludeAndExcludeField(options);
  }
  sanitize(options?: includeAndExcludeFieldsOptions<this>): Partial<this> {
    return this.applyIncludeAndExcludeField(options);
  }
  serialize(options?: includeAndExcludeFieldsOptions<this>): Partial<this> {
    return this.applyIncludeAndExcludeField(options);
  }

  async create(attributes: Partial<this>, option?: ModelCreateOption) {
    return await ModelUtils.create(this, attributes, option);
  }
  async fill(attributes: Partial<this>, option?: ModelCreateOption) {
    const preventSilentlyDiscardingAttributes =
      option?.preventSilentlyDiscardingAttributes ??
      GlobalConfig.database?.preventSilentlyDiscardingAttributes;
    if (!ModelHelper.usingFillableAndGuard(this)) {
      if (preventSilentlyDiscardingAttributes) {
        throw new Error(
          `Model (${getClassName(this)}) does not have fillable or guard attributes defined, you cannot use the fill method without them.`
        );
      }
    }
    option = { fillOnly: true, ...option };
    return this.create(attributes, option);
  }

  private buildFormattedFields() {
    const functionFormattedFields =
      Reflect.getMetadata(FUNCTIONS_FORMATTED_FIELDS_KEY, this) ?? {};
    const methodsFormattedFields =
      Reflect.getMetadata(METHODS_FORMATTED_FIELDS_KEY, this) ?? {};

    for (const key in this.formattedFields) {
      const value = this.formattedFields[key];
      if (typeof value === "function") {
        this[key as keyof this] = value(this);
      } else {
        this[key as keyof this] = value as any;
      }
    }

    for (const key in functionFormattedFields) {
      const action = functionFormattedFields[key];
      const result = action((this as any)[key]);
      (this as any)[key] = result;
    }

    for (const key in methodsFormattedFields) {
      const method = methodsFormattedFields[key];
      const methodFn = (this as any)[method].bind(this);
      const result = methodFn();
      (this as any)[key] = result;
    }
  }

  // @BeforeInsert()
  // private async beforeInsert() {}

  // @BeforeUpdate()
  // private async beforeUpdate() {}

  @AfterLoad()
  private async _afterLoad() {
    this.updateFillableAndGuard();
    this.buildIncludeAndExcludeField();
    this.buildFormattedFields();
    this.applyHiddenFields();

    this.resetChanges();
  }

  @AfterUpdate()
  private async _afterUpdate() {
    this.resetChanges();
  }

  @AfterInsert()
  private async _afterInsert() {
    this.resetChanges();
  }
}
