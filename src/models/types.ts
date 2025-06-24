/* eslint-disable @typescript-eslint/no-explicit-any */

import { Model } from "./main";

export interface includeAndExcludeFieldsOptions<M extends Model> {
  includes?: ConditionalFieldKey<M>[];
  excludes?: ConditionalFieldKey<M>[];
}

export type FieldKeyCondition<T = any> = boolean | ((self: T) => boolean);

export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type ModelFormattedField<M> = Partial<{
  [K in NonFunctionKeys<M>]: M[K] | ((model: M) => M[K]);
}>;

export type ClassKeyMapTypes<C> = {
  [K in keyof C]: C[K];
};

export type ConditionalFieldKey<M> =
  | NonFunctionKeys<M>
  | "*"
  | Partial<Record<NonFunctionKeys<M>, FieldKeyCondition<M>>>;

export interface ModelCreateOption {
  fillOnly?: boolean;
  preventSilentlyDiscardingAttributes?: boolean;
}

export type ModelGuardFields<M extends Model> = ConditionalFieldKey<M>;
export type ModelIncludeFields<M extends Model> = ConditionalFieldKey<M>;
export type ModelFillableFields<M extends Model> = ConditionalFieldKey<M>;
export type ModelExcludeFields<M extends Model> =
  | NonFunctionKeys<M>
  | Partial<Record<NonFunctionKeys<M>, FieldKeyCondition<M>>>;

export type ModelGuardFieldsMethod<M> = ConditionalFieldKey<M>;
export type ModelIncludeFieldsMethod<M> = ConditionalFieldKey<M>;
export type ModelFillableFieldsMethod<M> = ConditionalFieldKey<M>;
export type ModelExcludeFieldsMethod<M> =
  | NonFunctionKeys<M>
  | Partial<Record<NonFunctionKeys<M>, FieldKeyCondition<M>>>;
