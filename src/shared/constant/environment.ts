/* eslint-disable @typescript-eslint/no-explicit-any */
export const getExt = (filename: string) => {
  const parts = filename.split(".");
  return parts[parts.length - 1];
};
/**
 * Checks whether the current runtime is `ts-node`.
 *
 * `isTsNode` is a boolean flag that indicates if the program
 * is running under `ts-node` by checking for an internal symbol
 * set by `ts-node` during registration.
 *
 * This is the most reliable way to detect if the code is executed
 * through `ts-node` rather than plain Node.js.
 */
const isTsNode = !!(process as any)[Symbol.for("ts-node.register.instance")];

/**
 * Determines the runtime environment of the current file based on whether it is running under `ts-node`.
 *
 * `RUNTIME_ENVIRONMENT` is a string literal type with two possible values:
 * - `"typescript"` → if the code is running under `ts-node` (i.e., a TypeScript runtime),
 * - `"javascript"` → if the code is running under plain Node.js (JavaScript runtime).
 *
 * This value helps the system make environment-specific decisions,
 * such as enabling TypeScript-specific tooling or JavaScript optimizations.
 *
 * The detection relies on the `isTsNode` boolean flag, which checks for an internal
 * `ts-node` symbol in the process environment.
 */
export const RUNTIME_ENVIRONMENT: "javascript" | "typescript" = isTsNode
  ? "typescript"
  : "javascript";

/**
 * Determines the application's execution environment: "production" or "development".
 *
 * `ENV` is set to:
 * - "production" if any of the following conditions are true:
 *    - `process.env.NODE_ENV === "production"`
 *    - `process.env.APP_ENV === "production"`
 *    - `process.env.DEBUG === "false"`
 * - "development" if none of the above conditions are met.
 *
 * This is typically used to toggle behavior such as debugging output,
 * logging levels, or enabling/disabling developer tools.
 */
export const ENV: "production" | "development" =
  process.env.NODE_ENV == "production" ||
  process.env.APP_ENV == "production" ||
  process.env.DEBUG == "false"
    ? "production"
    : "development";
