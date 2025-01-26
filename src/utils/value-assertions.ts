/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Checks if the value is "active" based on specific matching values.
 *
 * @param value - The value to check.
 * @param expectedValues - Additional expected values to check against.
 * @returns `true` if the value is considered active, `false` otherwise.
 */
export const isActive = (value: any, ...expectedValues: any[]): boolean => {
  const activeValues: (string | number | boolean)[] = [
    "active",
    "yes",
    "true",
    1,
    true,
    "current",
    "selected",
    "checked",
  ];

  // Check if the value matches any of the expected values
  if (expectedValues.includes(value)) return true;

  // Check if the value is in the list of active values
  return activeValues.includes(String(value));
};

export const active = isActive;

/**
 * Checks if the value is empty. This includes null, undefined, empty strings,
 * empty arrays, and empty objects.
 *
 * @param value - The value to check.
 * @returns `true` if the value is empty, `false` otherwise.
 */
export const empty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  return false;
};

export const isEmpty = empty;

/**
 * Checks if the value is neither `undefined` nor `null`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is set, `false` otherwise.
 */
export const isSet = (value: any): boolean => {
  return value !== undefined && value !== null;
};

/**
 * Checks if the value is of type boolean.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a boolean, `false` otherwise.
 */
export const isBoolean = (value: any): boolean => {
  return typeof value === "boolean";
};

/**
 * Checks if the value is of type string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a string, `false` otherwise.
 */
export const isString = (value: any): boolean => {
  return typeof value === "string";
};

/**
 * Checks if the value is a finite number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a finite number, `false` otherwise.
 */
export const isNumber = (value: any): boolean => {
  return typeof value === "number" && Number.isFinite(value);
};

/**
 * Checks if the value is an object (and not an array or null).
 *
 * @param value - The value to check.
 * @returns `true` if the value is an object, `false` otherwise.
 */
export const isObject = (value: any): boolean => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

/**
 * Checks if the value is an array.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an array, `false` otherwise.
 */
export const isArray = (value: any): boolean => {
  return Array.isArray(value);
};

/**
 * Checks if the value is a function.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a function, `false` otherwise.
 */
export const isFunction = (value: any): boolean => {
  return typeof value === "function";
};

/**
 * Checks if the value is a valid Date object.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a Date object, `false` otherwise.
 */
export const isDate = (value: any): boolean => {
  return value instanceof Date && !isNaN(value.getTime());
};

/**
 * Checks if the value is a regular expression.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a RegExp, `false` otherwise.
 */
export const isRegExp = (value: any): boolean => {
  return value instanceof RegExp;
};

/**
 * Checks if the value is `null`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is null, `false` otherwise.
 */
export const isNull = (value: any): boolean => {
  return value === null;
};

/**
 * Checks if the value is `undefined`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is undefined, `false` otherwise.
 */
export const isUndefined = (value: any): boolean => {
  return value === undefined;
};

/**
 * Checks if the value is an integer.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an integer, `false` otherwise.
 */
export const isInteger = (value: any): boolean => {
  return Number.isInteger(value);
};

/**
 * Checks if the value is a plain object (not an array, date, or other built-in objects).
 *
 * @param value - The value to check.
 * @returns `true` if the value is a plain object, `false` otherwise.
 */
export const isPlainObject = (value: any): boolean => {
  return value && typeof value === "object" && value.constructor === Object;
};

/**
 * Checks if the value is a valid Promise (i.e., it has a `then` method).
 *
 * @param value - The value to check.
 * @returns `true` if the value is a Promise, `false` otherwise.
 */
export const isPromise = (value: any): boolean => {
  return value && typeof value === "object" && typeof value.then === "function";
};

/**
 * Checks if the value is a Symbol.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a Symbol, `false` otherwise.
 */
export const isSymbol = (value: any): boolean => {
  return typeof value === "symbol";
};

/**
 * Checks if the value is a BigInt.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a BigInt, `false` otherwise.
 */
export const isBigInt = (value: any): boolean => {
  return typeof value === "bigint";
};

/**
 * Checks if the value is a Map.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a Map, `false` otherwise.
 */
export const isMap = (value: any): boolean => {
  return value instanceof Map;
};

/**
 * Checks if the value is a Set.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a Set, `false` otherwise.
 */
export const isSetType = (value: any): boolean => {
  return value instanceof Set;
};

/**
 * Checks if the value is an instance of Error.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an Error, `false` otherwise.
 */
export const isError = (value: any): boolean => {
  return value instanceof Error;
};

/**
 * Checks if the value is a valid URL string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a valid URL, `false` otherwise.
 */
export const isURL = (value: any): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if the value is a valid JSON string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a valid JSON string, `false` otherwise.
 */
export const isValidJSON = (value: any): boolean => {
  if (typeof value !== "string") return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};
