import { Schema } from "redis-om";

export const SessionRedisSchemas = new Schema("session", {
  id: { type: "string" },
  data: { type: "text" },
  expiredAt: { type: "number" },
});

export interface SessionRedisSchemasType {
  id: string;
  data: string;
  expiredAt: number;
}
