/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseEntity } from "typeorm";
import {
  ModelExcludeFields,
  ModelExcludeFieldsMethod,
  ModelFillableFields,
  ModelFillableFieldsMethod,
  ModelFormattedField,
  ModelGuardFields,
  ModelGuardFieldsMethod,
  ModelIncludeFields,
  ModelIncludeFieldsMethod,
} from "./types";
import {
  EXCLUDE_FIELDS_KEY,
  FILLABLE_KEYS,
  GUARD_KEYS,
  INCLUDE_FIELDS_KEY,
} from "./helper";
import { ModelUtils } from "./util";
import { empty } from "../utils";

export abstract class BaseModel extends BaseEntity {
  protected fillableFields: ModelFillableFields<any>[];
  protected includeFields: ModelIncludeFields<any>[];
  protected excludeFields: ModelExcludeFields<any>[];
  protected guardFields: ModelGuardFields<any>[];
  protected formattedFields: ModelFormattedField<any>;

  updateIncludeFields(
    fields: ModelIncludeFieldsMethod<this>[],
    override: boolean = false
  ) {
    let includeFields = this.getMetadata(INCLUDE_FIELDS_KEY) ?? [];
    if (override) {
      includeFields = fields;
    } else if (!empty(fields)) {
      includeFields = [...includeFields, ...fields];
    }

    ModelUtils.defineListMetadata(INCLUDE_FIELDS_KEY, includeFields, this);
  }

  updateFillableFields(
    fields: ModelFillableFieldsMethod<this>[],
    override: boolean = false
  ) {
    let fillableFields = this.getMetadata(FILLABLE_KEYS) ?? [];
    if (override) {
      fillableFields = fields;
    } else if (!empty(fields)) {
      fillableFields = [...fillableFields, ...fields];
    }
    ModelUtils.defineListMetadata(FILLABLE_KEYS, fillableFields, this);
  }

  updateGuardFields(
    fields: ModelGuardFieldsMethod<this>[],
    override: boolean = false
  ) {
    let guardFields = this.getMetadata(GUARD_KEYS) ?? [];
    if (override) {
      guardFields = fields;
    } else if (!empty(fields)) {
      guardFields = [...guardFields, ...fields];
    }

    ModelUtils.defineListMetadata(GUARD_KEYS, guardFields, this);
  }

  updateExcludeFields(
    fields: ModelExcludeFieldsMethod<this>[],
    override: boolean = false
  ) {
    let excludeFields = this.getMetadata(EXCLUDE_FIELDS_KEY) ?? [];
    if (override) {
      excludeFields = fields;
    } else if (!empty(fields)) {
      excludeFields = [...excludeFields, ...fields];
    }

    ModelUtils.defineListMetadata(EXCLUDE_FIELDS_KEY, excludeFields, this);
  }

  getGuardFields(): ModelIncludeFieldsMethod<this> {
    return this.getMetadata(GUARD_KEYS) ?? [];
  }

  getFillableField(): ModelFillableFieldsMethod<this> {
    return this.getMetadata(FILLABLE_KEYS);
  }

  getIncludeFields(): ModelIncludeFieldsMethod<this>[] {
    return this.getMetadata(INCLUDE_FIELDS_KEY) ?? [];
  }

  getExcludeFields(): ModelExcludeFieldsMethod<this>[] {
    return this.getMetadata(EXCLUDE_FIELDS_KEY) || [];
  }

  private getMetadata(key: any, propertyKey?: symbol | string) {
    if (propertyKey) {
      return Reflect.getMetadata(key, this, propertyKey);
    }
    return Reflect.getMetadata(key, this);
  }
}
