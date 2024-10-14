/* eslint-disable @typescript-eslint/no-explicit-any */
// import DatabaseConnection from "../../database/connections";
import { GlobalConfig } from "../../shared/globals";
import * as crypto from "crypto";
import { Request, Response } from "express";
import { HashPassword } from "../hashing";
import { AuthenticatableModel } from "../../data";
import { Logger } from "../../utils";
import { JWT } from "../../api";

export interface LoginResponse {
  success: boolean;
  message?: string;
  destination?: string;
}
export interface AttemptResponse<U = any> {
  success: boolean;
  reason?: string;
  errorMessage?: string;
  user?: U;
}

export interface ApiBaseAuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  expiresAt?: Date;
  error?: {
    message?: string;
    reasons?: string;
  };
}

type WhenCallback = <U = any>(user: U) => Promise<AttemptResponse<U>>;

export class Auth {
  static user: any = null;

  static async check(req: Request): Promise<boolean> {
    const user = this.user;
    return user.id == req.session.userId;
  }

  static async apiBasicAuth(
    username: string,
    password: string
  ): Promise<ApiBaseAuthResponse> {
    const attempt = await this.attempt(username, password);
    if (attempt.success) {
      const jwt = await JWT.generateToken({
        username,
        password,
      });
      return {
        success: true,
        token: jwt.token,
        user: attempt.user,
        expiresAt: jwt.expiresAt,
      };
    }
    return {
      success: false,
      error: {
        message: attempt.errorMessage,
        reasons: attempt.reason,
      },
    };
  }

  private static async getUserFromDB(username: string) {
    const authModel = new GlobalConfig.auth.authenticatableModel();
    if (authModel instanceof AuthenticatableModel) {
      const user = await GlobalConfig.auth.authenticatableModel
        .createQueryBuilder("user")
        .where(
          "user.email = :username OR user.phoneNumber = :username OR user.id = :username OR user.username = :username",
          { username }
        )
        .getOne();
      this.user = user;
      return user;
    } else {
      Logger.error("Model is not Authenticatable");
    }
    return null;
  }

  private static async authenticate(
    user: any,
    req: Request,
    res: Response,
    rememberMe: boolean = false
  ): Promise<string | boolean> {
    user = user || this.user;
    if (user) {
      this.user = user;
    }
    const loginToken = crypto.randomBytes(32).toString("hex");
    const cookieExpires = new Date(Date.now() + 360 * 24 * 60 * 60 * 1000); // One year
    // Set session and user properties
    req.session.userId = user.id;
    req.session.loginToken = loginToken;

    // Set secure cookies if rememberMe is true
    if (rememberMe) {
      res.cookie("user", user.id, {
        expires: cookieExpires,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.cookie("token", HashPassword.encrypt(user.password), {
        expires: cookieExpires,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
    }
    let afterLogin: string = "";
    if (req.query.next) {
      afterLogin = req.query.next.toString();
    } else {
      afterLogin = GlobalConfig.auth.dashboardUrl || "/dashboard";
      delete req.session.afterLogin;
    }

    return afterLogin;
  }

  static async withCookies(
    user: any,
    req: Request,
    res: Response
  ): Promise<LoginResponse> {
    user = user || this.user;
    const token = req.cookies["userToken"] as string;
    if (user && (await HashPassword.verify(token, user.password))) {
      const authenticate = await this.authenticate(user, req, res, true);
      if (authenticate !== false) {
        return {
          success: true,
          destination: authenticate as string,
        };
      }
    }
    return {
      success: false,
      message: "Invalid Cookies",
    };
  }

  static async attempt<U = any>(
    username: string,
    password: string,
    ...when: WhenCallback[]
  ): Promise<AttemptResponse<U>> {
    const user = await this.getUserFromDB(username);
    if (!user) {
      return {
        success: false,
        errorMessage: "User not found",
        user,
      };
    }
    for (const fun of when) {
      const callback = await fun(user);
      if (callback.success === false) {
        return callback;
      }
    }
    if (!password) {
      return { success: false, errorMessage: "Please enter a valid password." };
    }
    if (!(await HashPassword.verify(password, user.password))) {
      return { success: false, errorMessage: "Invalid username or password." };
    }
    if (!user.isActive) {
      return {
        success: false,
        errorMessage: "Your account is disabled, please contact the admin.",
      };
    }

    return { success: true, user: user as U };
  }

  public static login = async (
    user: any,
    req: Request,
    res: Response,
    rememberMe = false
  ): Promise<LoginResponse> => {
    const authenticate = await this.authenticate(user, req, res, rememberMe);
    if (authenticate !== false) {
      return {
        success: true,
        destination: authenticate as string,
      };
    }
    return {
      success: false,
    };
  };

  public static logout = (
    req: Request,
    res: Response,
    destroySession: boolean = true
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      delete req.session.afterLogin;
      delete req.session.loginToken;
      delete req.session.userId;
      delete req.session.user;
      Auth.user = null;
      req.authenticated = false;
      req.user = null;
      res.clearCookie("user");
      res.clearCookie("token");
      if (destroySession) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Failed to destroy session during logout", err);
            reject(false);
          } else {
            resolve(true);
          }
        });
      }
    });
  };

  public static get isAdmin(): boolean {
    // Logic to check if the authenticated user is an admin
    return Auth.user.username === "admin"; // Replace with actual admin check logic
  }
  public static get userRole(): string {
    // Logic to get the authenticated user's role
    return "admin"; // Replace with actual role check logic
  }
}
