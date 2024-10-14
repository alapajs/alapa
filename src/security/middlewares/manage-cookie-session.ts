/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response, Request } from "express";
import { SessionDatabase } from "../../data/model";
import { Encryption } from "../misc/encryption";
import { Logger } from "../../utils";

export const manageCookiesSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.cookies["app-session"]) {
      const id = Encryption.decrypt(req.cookies["app-session"]);
      const session = await SessionDatabase.findOneBy({
        id: id ?? req.cookies["app-session"],
      });

      if (session) {
        if (id != req.sessionID) {
          await session.remove();
        } else if (session.expiredAt < Date.now()) {
          await session.remove();
        }
      }
    }
    SessionDatabase.createQueryBuilder()
      .delete()
      .where("expiredAt < :now", { now: Date.now() })
      .execute()
      .catch((err: any) => Logger.error(err));
    const cookieExpires = new Date(60 * 60 * 60 * 24 * 360000 + Date.now()); //one year
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    res.cookie("-session", Encryption.encrypt(req.sessionID)),
      {
        expires: cookieExpires,
        httpOnly: true,
      };
  } catch (e: unknown) {
    console.log(e);
  }
  next();
};
