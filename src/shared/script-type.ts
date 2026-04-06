/**
 * Type representing different script types in a Node.js environment.
 */
type ISCRIPT_TYPE = "javascript" | "typescript" | "unknown";

/**
 * Mapping of file extensions to corresponding script types.
 * This is used to determine the script type based on file extension.
 */
const fileExtensions: Record<string, ISCRIPT_TYPE> = {
  js: "javascript", // JavaScript file
  ts: "typescript", // TypeScript file
  cjs: "javascript", // CommonJS module
  mjs: "javascript", // ES module
  dts: "typescript", // TypeScript definition file
  jsx: "javascript", // JSX file (JavaScript with XML syntax)
  tsx: "typescript", // TypeScript with JSX
};

/**
 * Extracts the file extension from a given filename.
 * @param filename - The filename to extract the extension from.
 * @returns The file extension (lowercase) or "unknown" if no valid extension is found.
 */
const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "unknown";
};

/**
 * Determines the script type based on the file extension of the provided filename.
 * @param filename - The filename whose script type is to be determined.
 * @returns The script type corresponding to the file extension.
 */
const determineScriptType = (filename: string): ISCRIPT_TYPE => {
  const extension = getFileExtension(filename);
  return fileExtensions[extension] || "unknown"; // Default to "unknown" for unsupported extensions
};

// The current script's filename
const currentFile = __filename;

/**
 * The script type of the current file, determined at runtime.
 * It is set to the result of `determineScriptType` based on the current file's extension.
 */
export const SCRIPT_TYPE: ISCRIPT_TYPE = determineScriptType(currentFile);
