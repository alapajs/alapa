import { Request, Response, NextFunction } from "express";
import { GlobalConfig } from "../../shared/globals";
import { Logger } from "../../utils";
import { Auth } from "./main";

export async function LoginRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Initialize user properties
  res.locals.user = null;
  req.user = null;
  req.authenticated = false;

  // Check if there is a userId in session
  if (req.session.userId) {
    try {
      // Check if user is authenticated
      const user = (await Auth.check(req)) ? Auth.user : null;
      if (user) {
        res.locals.user = user;
        req.user = user;
        req.authenticated = true;

        // Validate session userId
        if (req.session.userId === user.id) {
          return next(); // Proceed to the next middleware
        } else {
          // Session token mismatch
          req.flash("info", "Invalid session. Please log in again.");
        }
      } else {
        // User not found, invalidate session
        req.flash("info", "Session expired. Please log in again.");
        await invalidateSession(req);
      }
    } catch (err: unknown) {
      Logger.error("Failed to fetch user data:", err);
      req.flash("error", "Internal server error.");
    }
  } else {
    // No session userId, user is not authenticated
    req.flash("info", "Please log in.");
  }

  // Redirect to login page
  const loginURL = GlobalConfig.auth.loginUrl || "/login";
  const url = req.originalUrl;
  res.redirect(`${loginURL}?next=${url}`);
}

async function invalidateSession(req: Request) {
  return new Promise<void>((resolve) => {
    req.session.destroy((err) => {
      if (err) {
        Logger.error("Failed to destroy session:", err);
      }
      resolve();
    });
  });
}
