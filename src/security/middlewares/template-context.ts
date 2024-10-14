import { md5, randomNumber } from "../../utils/mics";
import { formatDate } from "../../utils/date";
import { oldRequest } from "../../utils/templates";
import { Request, Response, NextFunction } from "express";
import { getStaticUrl } from "../../utils/templates/functions/static";
import { Logger } from "../../utils";
import { getRouteByName } from "../../core/routes";
import { GlobalConfig } from "../../shared/globals";
import { AnyObject } from "../../interface/object";

export async function templateContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.csrf = `<input type="hidden" name="_csrf" value="${req.csrfToken()}">`;
  res.locals.csrfToken = req.csrfToken();
  req.user = "";
  res.locals.request = req;
  res.locals.req = req;
  res.locals.md5 = md5;
  res.locals.Logger = Logger;
  res.locals.appConfigurations = GlobalConfig;
  res.locals.randomNumber = randomNumber;
  res.locals.formatDate = formatDate;
  res.locals.url = (name: string, ...param: (string | number | AnyObject)[]) =>
    `${req.protocol}://${req.get("host")}/${getRouteByName(name, ...param)}`;
  res.locals.route = res.locals.url;
  res.locals.static = (filePath: string) => getStaticUrl(filePath, req);
  res.locals.old = (value?: string, defaultValue?: unknown) =>
    oldRequest(req, value, defaultValue);
  next();
}
