import { shuffle } from "./string";
import crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { LogMessageType } from "./types";
export const autoMd5 = () => {
  return md5(Math.random().toString() + Date.now().toString());
};

export const randomNumber = (len: number = 0) => {
  let number: number | string = shuffle(
    (Math.random() + Date.now()).toString().replace(".", "")
  );
  if (len > 0) number = number.toString().substring(0, len);
  return number.toString();
};

export const md5 = function (data: string) {
  return crypto.createHash("md5").update(data).digest("hex").toString();
};

/**
 * Logs a message to a specified text file.
 * @param message - The message to log.
 * @param filePath - The path to the text file where the message should be logged.
 */

export function logToFile(
  message: string,
  type: LogMessageType = "info",
  filePath?: string
): void {
  const date = new Date();
  const logDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
  const logMessage = `[${logDate}] [${type.toUpperCase()}] ${message}\n`;

  if (!filePath) filePath = path.resolve("logs", ".log");

  // Ensure the directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Append the message to the file
  fs.appendFile(filePath, logMessage, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
  });
}

export const toAbsolutePath = (...paths: string[]) => path.resolve(...paths);

export const escapeRegex = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
