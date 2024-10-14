/* eslint-disable @typescript-eslint/no-explicit-any */
import session from "express-session";
import { SessionDatabase } from "../../data/model/session";
import { Encryption } from "../misc/encryption";

interface AppSessionStoreStoreOptions {
  req?: Request;
}

class AppSessionStore extends session.Store {
  options: AppSessionStoreStoreOptions;
  constructor() {
    super();
  }

  public async get(
    sid: string,
    callback: (err: any, session?: session.SessionData | null) => void
  ): Promise<void> {
    try {
      const session = await SessionDatabase.findOne({
        where: { id: sid },
      });
      if (session) {
        if (this.isExpired(session.expiredAt)) {
          await session.remove();
          callback(null, null);
        } else {
          callback(
            null,
            JSON.parse(Encryption.decrypt(session.data) ?? session.data)
          );
        }
      } else {
        callback(null, null);
      }
    } catch (err) {
      callback(err);
    }
  }

  private isExpired(expiredAt: number): boolean {
    return expiredAt < Date.now();
  }

  public async set(
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: any) => void
  ): Promise<void> {
    try {
      const session = new SessionDatabase();
      const data = JSON.stringify(sessionData);
      session.id = sid;
      session.data = Encryption.encrypt(data) ?? data;
      session.expiredAt = sessionData.cookie.expires
        ? new Date(sessionData.cookie.expires).getTime()
        : Date.now() +
          (sessionData.cookie.maxAge != undefined
            ? sessionData.cookie.maxAge
            : 0);

      await session.save();
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(err);
    }
  }

  public async destroy(
    sid: string,
    callback?: (err?: any) => void
  ): Promise<void> {
    try {
      const session = await SessionDatabase.findOneBy({
        id: sid,
      });
      session?.remove();
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(err);
    }
  }

  // Optional methods

  public async length(
    callback: (err: any, length: number) => void
  ): Promise<void> {
    try {
      const count = await SessionDatabase.count();
      callback(null, count);
    } catch (err) {
      callback(err, 0);
    }
  }

  public async clear(callback?: (err?: any) => void): Promise<void> {
    try {
      // await AppSession.clear();
      if (callback) callback(null);
    } catch (err) {
      if (callback) callback(err);
    }
  }

  public async touch(
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: any) => void
  ): Promise<void> {
    try {
      await this.set(sid, sessionData, callback);
    } catch (err) {
      if (callback) callback(err);
    }
  }

  public async all(
    callback: (
      err: any,
      obj?:
        | session.SessionData[]
        | { [sid: string]: session.SessionData }
        | null
    ) => void
  ): Promise<void> {
    try {
      const sessions = await SessionDatabase.find({
        take: 100,
      });
      const result: { [sid: string]: session.SessionData } = {};
      sessions.forEach((session) => {
        result[session.id] = JSON.parse(
          Encryption.decrypt(session.data) ?? session.data
        );
      });
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  }
}

export default AppSessionStore;
