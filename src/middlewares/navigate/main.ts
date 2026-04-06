import { Request, Response } from "express";
export class Navigator {
  constructor(
    private req: Request,
    private res: Response
  ) {}

  redirect(url: string): this {
    this.req.session.save(() => {
      this.res.redirect(url);
    });
    return this; // Continue the chain
  }

  back(): this;
  back(type: string, message: string): this;
  back(type?: string, message?: string): this {
    const redirectUrl = this.req.get("referer") ?? "/";
    if (type && message) {
      this.with(type, message);
    }
    this.redirect(redirectUrl);
    return this; // Continue the chain
  }

  route(name: string): this;
  route(name: string, ...params: (string | number | object)[]): this {
    const route = `${this.req.protocol}://${this.req.get("host")}/${this.req.getRoute(name, ...params)}`;
    this.redirect(route);
    return this; // Continue the chain
  }

  with(type: string, message: string | string[]): this {
    this.req.flash(type, message);
    return this; // Continue the chain
  }

  withErrors(message: string | string[]): this {
    this.with("error", message);
    return this; // Continue the chain
  }

  withSuccess(message: string | string[]): this {
    this.with("success", message);
    return this; // Continue the chain
  }

  withInfo(message: string | string[]): this {
    this.with("info", message);
    return this; // Continue the chain
  }

  withWarn(message: string | string[]): this {
    this.with("warning", message);
    return this; // Continue the chain
  }

  // This is the final method that gets triggered after the entire chain.
}
