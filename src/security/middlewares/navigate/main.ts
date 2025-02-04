import { Request, Response } from "express";
import { NavigatorChain } from "./interface"; // Assuming you have the NavigatorChain interface

export const navigatorChainFunction = (
  req: Request,
  res: Response
): NavigatorChain => {
  const chain: NavigatorChain = {
    redirect: (url: string): NavigatorChain => {
      res.redirect(url);
      return chain; // Ensures chainability
    },

    back: (type?: string, message?: string) => {
      const redirectUrl = req.get("referer") ?? "/";
      if (type && message) {
        req.flash(type, message);
      }
      res.redirect(redirectUrl);
      return chain; // Ensures chainability
    },

    route: (
      name: string,
      ...params: (string | number | object)[]
    ): NavigatorChain => {
      const route = `${req.protocol}://${req.get("host")}/${req.getRoute(name, ...params)}`;
      res.redirect(route);
      return chain; // Ensures chainability
    },

    with: (type: string, message: string | string[]): NavigatorChain => {
      req.flash(type, message);
      return chain; // Ensures chainability
    },

    withErrors: (message: string | string[]): NavigatorChain => {
      return chain.with("error", message);
    },

    withSuccess: (message: string | string[]): NavigatorChain => {
      return chain.with("success", message);
    },

    withInfo: (message: string | string[]): NavigatorChain => {
      return chain.with("info", message);
    },

    withWarn: (message: string | string[]): NavigatorChain => {
      return chain.with("warning", message);
    },
  };

  return chain;
};
