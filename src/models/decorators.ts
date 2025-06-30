/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityOptions, Entity } from "typeorm";
import {
  EXCLUDE_FIELDS_KEY,
  FILLABLE_KEYS,
  FUNCTIONS_FORMATTED_FIELDS_KEY,
  GUARDED_KEYS,
  INCLUDE_FIELDS_KEY,
  METHODS_FORMATTED_FIELDS_KEY,
} from "./helper";
import { FieldKeyCondition, FunctionKeys, NonFunctionKeys } from "./types";
import { ModelUtils } from "./util";
import { Model } from "./main";

export type TableModelOptions = EntityOptions;

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function TableModel(name?: string, options?: TableModelOptions) {
  return Entity(name, options);
}

export function ExcludeField<M = any>(test?: FieldKeyCondition<M>) {
  return function (target: any, propertyKey: string) {
    let value: any = {};
    if (test) {
      value[propertyKey] = test;
    } else {
      value = propertyKey;
    }
    const excludeFields = Reflect.getMetadata(EXCLUDE_FIELDS_KEY, target) ?? [];
    excludeFields.push(value);
    ModelUtils.defineListMetadata(EXCLUDE_FIELDS_KEY, excludeFields, target);
  };
}

export function IncludeField<M = any>(test?: FieldKeyCondition<M>) {
  return function (target: any, propertyKey: string) {
    let value: any = {};
    if (test) {
      value[propertyKey] = test;
    } else {
      value = propertyKey;
    }
    const includeFields = Reflect.getMetadata(INCLUDE_FIELDS_KEY, target) ?? [];
    includeFields.push(value);
    ModelUtils.defineListMetadata(INCLUDE_FIELDS_KEY, includeFields, target);
  };
}

export function GuardedField<M = any>(test?: FieldKeyCondition<M>) {
  return function (target: any, propertyKey: string) {
    let value: any = {};
    if (test) {
      value[propertyKey] = test;
    } else {
      value = propertyKey;
    }
    const guardedFields = Reflect.getMetadata(GUARDED_KEYS, target) ?? [];
    guardedFields.push(value);
    ModelUtils.defineListMetadata(GUARDED_KEYS, guardedFields, target);
  };
}

export function FillableField<M = any>(test?: FieldKeyCondition<M>) {
  return function (target: any, propertyKey: string) {
    let value: any = {};
    if (test) {
      value[propertyKey] = test;
    } else {
      value = propertyKey;
    }
    const fillableFields = Reflect.getMetadata(FILLABLE_KEYS, target) ?? [];
    fillableFields.push(value);
    ModelUtils.defineListMetadata(FILLABLE_KEYS, fillableFields, target);
  };
}

// const methodName = formattedFields['someField'];
// const methodFn = instance[methodName].bind(instance);
// const result = methodFn();
type FieldType<M, K> = K extends any ? NonFunctionKeys<M> : K;
export function FormattedFieldMethod<
  M extends Model,
  K extends NonFunctionKeys<M>,
>(field: FieldType<M, K>) {
  return function (
    target: any,
    propertyKey: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    descriptor: TypedPropertyDescriptor<() => M[K]>
  ) {
    const formattedFields =
      Reflect.getMetadata(METHODS_FORMATTED_FIELDS_KEY, target) ?? {};

    formattedFields[field] = propertyKey;

    Reflect.defineMetadata(
      METHODS_FORMATTED_FIELDS_KEY,
      formattedFields,
      target
    );
  };
}

// export type ActionType<M, K extends NonFunctionKeys<M>> = (arg: M[K]) => M[K];

// export function FormattedField<M, K extends NonFunctionKeys<M>>(
//   action: ActionType<M, K>
// ) {
//   return function (target: any, propertyKey: string | symbol) {
//     const formattedFields =
//       Reflect.getMetadata(DECORATOR_METHODS_FOR_FORMATTED_KEY, target) ?? {};

//     formattedFields[propertyKey] = action;

//     Reflect.defineMetadata(
//       DECORATOR_METHODS_FOR_FORMATTED_KEY,
//       formattedFields,
//       target
//     );

//     console.log("Registered formatted field:", formattedFields);
//   };
// }

export type ActionType<M, K extends NonFunctionKeys<M>> = (arg: M[K]) => M[K];

// export type MethodNameType<M, K extends keyof M> = {
//   [A in keyof M]: M[A] extends (arg: M[K]) => M[K] ? A : never;
// }[keyof M];

export type MethodNameType<
  M,
  K extends keyof M,
  A extends keyof M,
> = M[A] extends (arg: M[K]) => M[K] ? A : M[K];

// export type MethodNameType<
//   M,
//   K extends keyof M,
//   A extends keyof M,
// > = M[A] extends (arg: M[K]) => infer R ? (R extends M[K] ? A : M[A]) : never;

// Overload 1: Accepts a formatting function
export function FormattedField<M, K extends NonFunctionKeys<M>>(
  action: ActionType<M, K>
): any;

// Overload 2: Accepts a method name that matches required signature
export function FormattedField<
  M,
  K extends NonFunctionKeys<M>,
  A extends FunctionKeys<M>,
>(methodName: MethodNameType<M, K, A>): any;

// Implementation
export function FormattedField<
  M,
  K extends NonFunctionKeys<M>,
  A extends FunctionKeys<M> = any,
>(actionOrMethod: ActionType<M, K> | MethodNameType<M, K, A>) {
  return function (target: any, propertyKey: string | symbol) {
    const KEY =
      typeof actionOrMethod == "string"
        ? METHODS_FORMATTED_FIELDS_KEY
        : FUNCTIONS_FORMATTED_FIELDS_KEY;
    const formattedFields = Reflect.getMetadata(KEY, target) ?? {};
    formattedFields[propertyKey] = actionOrMethod;

    Reflect.defineMetadata(KEY, formattedFields, target);
  };
}
