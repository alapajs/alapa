/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyObject } from "../interface/object";
import { GlobalConfig } from "../shared/globals";
import { renderFile } from "./extension/render/main"; // Assuming this function exists

export function alapaEngine(
  view: string,
  options?: AnyObject | { (err: Error, html: string): void },
  callback?: (err: Error | null, html: string) => void
): void {
  //  console.log(viewList);
  try {
    const templateEngineFileExtension =
      GlobalConfig.templateEngine.fileExtensions;
    const commonFileExtension = ["html"];
    if (Array.isArray(templateEngineFileExtension)) {
      commonFileExtension.push(...templateEngineFileExtension);
    } else {
      commonFileExtension.push(
        ...(templateEngineFileExtension || "").split(",")
      );
    }
    const viewList = view.split(".");
    if (viewList.length > 1) {
      const ext = viewList[viewList.length - 1];
      viewList.splice(viewList.length - 1, 1);
      let extSeparator = ".";
      if (!commonFileExtension.includes(ext)) {
        extSeparator = "/";
      }
      view = `${viewList.join("/")}${extSeparator}${ext}`;
      view = view.replaceAll("//", "/");
    }

    const context = { ...options };
    const result = renderFile(view, context);
    callback!(null, result);
  } catch (error) {
    callback!(error as any, "");
  }
}
