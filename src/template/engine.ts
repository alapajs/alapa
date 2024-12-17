/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyObject } from "../interface/object";
import { renderFile } from "./extension/render/main"; // Assuming this function exists

export function alapaEngine(
  view: string,
  options: AnyObject,
  callback: (err: Error | null, html: string) => void
): void {
  try {
    const context = { ...options };
    const result = renderFile(view, context);
    callback(null, result);
  } catch (error) {
    callback(error as any, "");
  }
}
