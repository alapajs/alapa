import session from "express-session";
import { GlobalConfig } from "../shared/globals";
import "reflect-metadata";
import { container } from "tsyringe";

export const sessionConfiguration = (): session.SessionOptions => {
  const config = GlobalConfig.session;
  const store = container.resolve<session.Store | undefined>(
    config!.store || session.MemoryStore
  );

  return {
    secret: config!.secret,
    store: store,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  };
};
