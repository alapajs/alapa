import { md5, randomNumber } from "../../utils";
import AppSessionStore from "./data-store";

export const sessionConfiguration = {
  secret: md5(randomNumber()),
  store: new AppSessionStore(),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
};
