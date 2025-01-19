/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import { LOG_LEVEL } from "../shared/constant";
import { logToFile } from "./mics";
import { LogMessageType } from "./types";

type LogSettings = {
  noFile?: boolean;
  noColor?: boolean;
  noConsole?: boolean;
};

const colors = {
  DEBUG: "\x1b[37m", // white
  INFO: "\x1b[34m", // blue
  WARNING: "\x1b[33m", // yellow
  ERROR: "\x1b[31m", // red
  SUCCESS: "\x1b[32m", // green
  RESET: "\x1b[0m", // reset to default color
};

const LoggerFunction = (
  level: LOG_LEVEL,
  type: LogMessageType,
  settings?: LogSettings,
  ...message: any[]
) => {
  const logLevel: LOG_LEVEL = LOG_LEVEL.SUCCESS;
  if (level > logLevel) return;

  // Define color codes for each log level
  const levelColors: { [key in LOG_LEVEL]: string } = {
    [LOG_LEVEL.DEBUG]: colors.DEBUG,
    [LOG_LEVEL.INFO]: colors.INFO,
    [LOG_LEVEL.WARNING]: colors.WARNING,
    [LOG_LEVEL.ERROR]: colors.ERROR,
    [LOG_LEVEL.SUCCESS]: colors.SUCCESS,
  };
  for (const i in message) {
    message[i] =
      typeof message[i] === "object" ? JSON.stringify(message[i]) : message[i];
  }

  if (settings?.noConsole !== true) {
    const logMessage = settings?.noColor
      ? `[${type.toUpperCase()}] ${message.join(" ")}`
      : `${levelColors[level]}[${type.toUpperCase()}] ${message.join(" ")}${
          colors.RESET
        }`;

    if (level >= LOG_LEVEL.DEBUG) {
      console.debug(logMessage);
    } else if (level >= LOG_LEVEL.INFO) {
      console.info(logMessage);
    } else if (level >= LOG_LEVEL.WARNING) {
      console.warn(logMessage);
    } else if (level >= LOG_LEVEL.ERROR) {
      console.error(logMessage);
    } else if (level >= LOG_LEVEL.SUCCESS) {
      console.log(logMessage);
    }
  }

  if (settings?.noFile !== true) {
    for (const msg of message) {
      const formattedMessage = `${msg}`;

      logToFile(
        formattedMessage,
        type,
        path.resolve("logs", "application.log")
      );
    }
  }
};

export class Logger {
  static log(...message: any[]) {
    LoggerFunction(LOG_LEVEL.DEBUG, "debug", undefined, ...message);
  }

  static error(...message: any[]) {
    LoggerFunction(LOG_LEVEL.ERROR, "error", undefined, ...message);
    return new Error(message.join("\n"));
  }

  static warn(...message: any[]) {
    LoggerFunction(LOG_LEVEL.WARNING, "warn", undefined, ...message);
  }

  static info(...message: any[]) {
    LoggerFunction(LOG_LEVEL.INFO, "info", undefined, ...message);
  }

  static debug(...message: any[]) {
    LoggerFunction(LOG_LEVEL.DEBUG, "debug", undefined, ...message);
  }

  static success(...message: any[]) {
    LoggerFunction(LOG_LEVEL.SUCCESS, "success", { noFile: true }, ...message);
  }

  static throw(...message: any[]): Error {
    LoggerFunction(
      LOG_LEVEL.ERROR,
      "error",
      {
        noConsole: true,
      },
      ...message
    );
    return new Error(message.join("\n"));
  }
}
