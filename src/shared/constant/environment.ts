const jsFiles = ["js"];
const tsFiles = ["ts"];
const getExt = (filename: string) => {
  const parts = filename.split(".");
  return parts[parts.length - 1];
};
const currentFile = __filename;
/**
 * Determines the runtime environment of the current file based on its extension.
 *
 * `RUNTIME_ENVIRONMENT` is a string literal type that can be:
 * - "javascript"  → if the file extension matches any in the `jsFiles` list,
 * - "typescript"  → if the file extension matches any in the `tsFiles` list,
 * - "unknown"     → if the extension is not recognized as either JavaScript or TypeScript.
 *
 * This value helps the system make environment-specific decisions,
 * such as applying language-specific processing or tooling.
 */
export const RUNTIME_ENVIRONMENT: "javascript" | "typescript" | "unknown" =
  jsFiles.includes(getExt(currentFile))
    ? "javascript"
    : tsFiles.includes(getExt(currentFile))
      ? "typescript"
      : "unknown";

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
