/* eslint-disable @typescript-eslint/no-explicit-any */
import { shuffle } from "./string";
import crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { LogMessageType } from "./types";
import yaml from "yaml";
import { Logger } from "./logger";
export const randomMd5 = () => {
  return md5(Math.random().toString() + Date.now().toString());
};

export const randomNumber = (len: number = 0) => {
  let number: number | string = shuffle(
    (Math.random() + Date.now()).toString().replace(".", "")
  );
  if (len > 0) number = number.toString().substring(0, len);
  return number.toString();
};

export const md5 = function (data: string) {
  return crypto.createHash("md5").update(data).digest("hex").toString();
};

/**
 * Logs a message to a specified text file.
 * @param message - The message to log.
 * @param filePath - The path to the text file where the message should be logged.
 */

export function logToFile(
  message: string,
  type: LogMessageType = "info",
  filePath?: string
): void {
  const date = new Date();
  const logDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
  const logMessage = `[${logDate}] [${type.toUpperCase()}] ${message}\n`;

  if (!filePath) filePath = path.resolve("logs", ".log");

  // Ensure the directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Append the message to the file
  fs.appendFile(filePath, logMessage, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
  });
}

export const toAbsolutePath = (...paths: string[]) => path.resolve(...paths);

export const escapeRegex = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const loadYaml = (filePath: string) => {
  try {
    const content = fs.readFileSync(path.resolve(filePath), "utf8");
    const doc = yaml.parse(content);
    return doc;
  } catch (e) {
    Logger.error(e);
    return null;
  }
};

/**
 * A utility function that converts a given value to a number, removing any non-numeric characters except for a decimal point.
 * It handles cases with multiple decimal points, null, undefined, or empty strings, and returns 0 in those cases.
 *
 * @param {any} value - The input value to be converted to a number.
 * @returns {number} - The numeric value derived from the input, or 0 if the input is invalid.
 *
 * @example
 * // Returns 123456.78
 * NumberOnly('123abc456.78xyz');
 *
 * @example
 * // Returns 12.3456
 * NumberOnly('12.34.56');
 *
 * @example
 * // Returns 0
 * NumberOnly('abc');
 *
 * @example
 * // Returns 0
 * NumberOnly(null);
 *
 * @example
 * // Returns 0
 * NumberOnly('');
 */
export function NumberOnly(value: any): number {
  // Handle cases where value is null, undefined, or an empty string
  if (value === null || value === undefined || value === "") return 0;

  // Convert the value to a string and remove any characters that are not digits or a decimal point
  let sanitizedValue = value
    .toString()
    .trim()
    .replace(/[^0-9.]/g, "");

  // Check if there are multiple decimal points in the sanitized value
  const decimalCount = sanitizedValue.split(".").length - 1;

  // If there are more than one decimal point, remove all extra decimals
  if (decimalCount > 1) {
    // Keep only the first decimal point, remove subsequent ones
    sanitizedValue =
      sanitizedValue.substring(0, sanitizedValue.indexOf(".") + 1) +
      sanitizedValue
        .substring(sanitizedValue.indexOf(".") + 1)
        .replace(".", "");
  }

  // Convert the sanitized value to a number
  const result = Number(sanitizedValue);

  // If the result is NaN (invalid number), return 0
  return isNaN(result) ? 0 : result;
}

export const toNumberOnly = NumberOnly;

export function isClass(obj: any) {
  const isCtorClass =
    obj.constructor && obj.constructor.toString().substring(0, 5) === "class";
  if (obj.prototype === undefined) {
    return isCtorClass;
  }
  const isPrototypeCtorClass =
    obj.prototype.constructor &&
    obj.prototype.constructor.toString &&
    obj.prototype.constructor.toString().substring(0, 5) === "class";
  return isCtorClass || isPrototypeCtorClass;
}

export function normalizeURLPath(url: string): string {
  url = url.replaceAll("//", "/").replace(/\/$/, "");
  return url.toLowerCase();
}

export function getClassName(target: any): string {
  const classConstructor = target.constructor;
  if (classConstructor.name !== "Function") {
    return classConstructor.name;
  } else {
    return target.name;
  }
}
