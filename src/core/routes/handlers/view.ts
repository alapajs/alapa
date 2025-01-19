/* eslint-disable @typescript-eslint/no-unused-vars */
import { IRouter } from "../interface";
import { Request, Response } from "../../http";
import { AnyObject } from "../../../interface";
import { GlobalConfig } from "../../../shared/globals";
import { TemplateEngine } from "../../../utils";

export class ViewHandler {
  private view: string;
  private context?: AnyObject;
  constructor(private router: IRouter) {}
  private handler(req: Request, res: Response) {
    return res.render(this.view, this.context);
  }
  add(path: string, view: string, context?: AnyObject) {
    // const viewPath = GlobalConfig.view.dir || "views";
    // const file = path.resolve(viewPath,view)
    this.view = view;
    this.context = context;
    return this.router.get(path, this.handler.bind(this));
  }
}
