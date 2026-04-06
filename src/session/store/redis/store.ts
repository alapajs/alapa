/* eslint-disable @typescript-eslint/no-explicit-any */
import session from "express-session";
import { Encryption } from "../../../security/misc/encryption";
import { createClient, RedisClientType } from "redis";
import { GlobalConfig } from "../../../shared/globals";
import { toNumber } from "lodash";

interface AppSessionStoreStoreOptions {
  req?: Request;
}

interface StoredSession {
  id: string;
  data: string; // Encrypted string
  expiredAt: number; // Timestamp in ms
}

export class RedisSessionStore extends session.Store {
  private client?: RedisClientType;
  private readonly prefix =
    process.env.REDIS_SESSION_KEY_PREFIX || "alapa:sess:";

  constructor(private options: AppSessionStoreStoreOptions = {}) {
    super();
    this.createConnection();
  }

  private async createConnection(): Promise<void> {
    if (this.client) return;

    const config = GlobalConfig?.session;
    const redisConfig = config?.redisConfig;
    let url = redisConfig?.url;

    if (!url) {
      const auth =
        redisConfig?.user && redisConfig?.password
          ? `${redisConfig.user}:${redisConfig.password}@`
          : "";
      const host = redisConfig?.host ?? "localhost";
      const port = redisConfig?.port || 6379;
      url = `redis://${auth}${host}:${port}`;
    }

    this.client = createClient({
      url,
      database: toNumber(process.env.REDIS_SESSION_DD || 0),
    });
    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
      this.client = undefined;
    });

    await this.client.connect();
  }

  private getKey(sid: string): string {
    return `${this.prefix}${sid}`;
  }

  private isExpired(expiredAt: number): boolean {
    return expiredAt < Date.now();
  }

  public async get(
    sid: string,
    callback: (err: any, session?: session.SessionData | null) => void
  ): Promise<void> {
    try {
      const raw = await this.client?.get(this.getKey(sid));
      if (!raw) return callback(null, null);

      const stored: StoredSession = JSON.parse(raw);

      if (this.isExpired(stored.expiredAt)) {
        await this.client?.del(this.getKey(sid));
        return callback(null, null);
      }

      const decrypted = Encryption.decrypt(stored.data) ?? stored.data;
      callback(null, JSON.parse(decrypted));
    } catch (err) {
      callback(err);
    }
  }

  public async set(
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: any) => void
  ): Promise<void> {
    try {
      const data = JSON.stringify(sessionData);
      const encryptedData = Encryption.encrypt(data) ?? data;
      const expiredAt = sessionData.cookie.expires
        ? new Date(sessionData.cookie.expires).getTime()
        : Date.now() + (sessionData.cookie.maxAge || 86400000);

      const ttlSeconds = Math.floor((expiredAt - Date.now()) / 1000);

      const stored: StoredSession = {
        id: sid,
        data: encryptedData,
        expiredAt,
      };

      await this.client?.set(this.getKey(sid), JSON.stringify(stored), {
        EX: ttlSeconds > 0 ? ttlSeconds : 86400,
      });

      callback?.(null);
    } catch (err) {
      callback?.(err);
    }
  }

  public async destroy(
    sid: string,
    callback?: (err?: any) => void
  ): Promise<void> {
    try {
      await this.client?.del(this.getKey(sid));
      callback?.(null);
    } catch (err) {
      callback?.(err);
    }
  }

  public async length(
    callback: (err: any, length: number) => void
  ): Promise<void> {
    try {
      const keys = await this.client?.keys(`${this.prefix}*`);
      callback(null, keys?.length || 0);
    } catch (err) {
      callback(err, 0);
    }
  }

  public async clear(callback?: (err?: any) => void): Promise<void> {
    try {
      const keys = await this.client?.keys(`${this.prefix}*`);
      if (keys && keys.length > 0) {
        await this.client?.del(keys);
      }
      callback?.(null);
    } catch (err) {
      callback?.(err);
    }
  }

  public async touch(
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: any) => void
  ): Promise<void> {
    try {
      const key = this.getKey(sid);
      const ttl = Math.floor((sessionData.cookie.maxAge || 86400000) / 1000); // default 1 day
      await this.client?.expire(key, ttl);
      callback?.(null);
    } catch (err) {
      callback?.(err);
    }
  }

  public async all(
    callback: (
      err: any,
      obj?: { [sid: string]: session.SessionData } | null
    ) => void
  ): Promise<void> {
    try {
      const keys = await this.client?.keys(`${this.prefix}*`);
      if (!keys || keys.length === 0) return callback(null, null);

      const result: { [sid: string]: session.SessionData } = {};
      for (const key of keys) {
        const raw = await this.client?.get(key);
        if (!raw) continue;

        const stored: StoredSession = JSON.parse(raw);
        const decrypted = Encryption.decrypt(stored.data) ?? stored.data;
        result[stored.id] = JSON.parse(decrypted);
      }

      callback(null, result);
    } catch (err) {
      callback(err);
    }
  }
}
