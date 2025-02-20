import { Request, Response, NextFunction } from "express";
import { renderFile } from "../../template/extension/render/main";
import { GlobalConfig } from "../../shared/globals";
import { AnyObject } from "../../interface";

export const renderTemplate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.render = (view: string, options?: AnyObject) => {
    const templateEngineFileExtension =
      GlobalConfig.templateEngine.fileExtensions;
    //  console.log(viewList);
    try {
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

      const context = { ...res.locals, ...options };
      const result = renderFile(view, context);
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };
  next();
};
