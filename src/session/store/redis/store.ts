/* eslint-disable @typescript-eslint/no-explicit-any */
import session from "express-session";
import { Encryption } from "../../../security/misc/encryption";
import { EntityId, Repository } from "redis-om";
import { SessionRedisSchemas } from "./schema";
import { createClient } from "redis";
import { AnyObject } from "../../../interface/object";
import { GlobalConfig } from "../../../shared/globals";

interface AppSessionStoreStoreOptions {
  req?: Request;
}

export class RedisSessionStore extends session.Store {
  options: AppSessionStoreStoreOptions;
  private redis: any = null;
  private repository: Repository;
  private async createConnection() {
    const config = GlobalConfig!.session;
    const redisConfig = config!.redisConfig;
    let url = redisConfig?.url;
    if (!url) {
      let auth = "";
      if (redisConfig?.user && redisConfig.password) {
        auth = `${redisConfig.user}:${redisConfig.password}@`;
      }
      const host = redisConfig?.host ?? "localhost";
      const port = redisConfig?.port || 6379;
      url = `redis://${auth}${host}:${port}`;
    }
    if (!this.redis) {
      this.redis = createClient({
        url: url,
      });
      this.redis.on("error", (err: any) => {
        this.redis = null;
        console.log("Redis Client Error", err);
      });
      await this.redis.connect();
      this.repository = new Repository(SessionRedisSchemas, this.redis);
    }
    this.createIndex();
  }
  async createIndex() {
    try {
      await this.repository.createIndex();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Logger.error(e);
    }
  }
  constructor() {
    super();
    this.createConnection();
  }

  public async get(
    sid: string,
    callback: (err: any, session?: session.SessionData | null) => void
  ): Promise<void> {
    try {
      const session = await this.repository
        .search()
        .where("id")
        .equal(sid)
        .returnFirst();
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
      const data = JSON.stringify(sessionData);
      const encryptedData = Encryption.encrypt(data) ?? data;
      const session: AnyObject = {};
      session.id = sid;
      session.data = encryptedData;
      session.expiredAt = sessionData.cookie.expires
        ? new Date(sessionData.cookie.expires).getTime()
        : Date.now() +
          (sessionData.cookie.maxAge != undefined
            ? sessionData.cookie.maxAge
            : 0);

      const savedSession = await this.repository.save(session);
      await this.repository.expireAt(
        savedSession[EntityId as any],
        new Date(session.expiredAt)
      );

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
      const ids = await this.repository
        .search()
        .where("id")
        .equal(sid)
        .allIds();
      await this.repository.remove(ids);
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
      const count = await this.repository.search().count();
      callback(null, count);
    } catch (err) {
      callback(err, 0);
    }
  }

  public async clear(callback?: (err?: any) => void): Promise<void> {
    try {
      const ids = await this.repository.search().allIds();
      await this.repository.remove(ids);
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
      const sessions = await this.repository.search().return.all();
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
