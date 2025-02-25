/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";

class FlashHandler {
  req: Request;
  constructor(req: Request) {
    this.req = req;
  }

  // Method to get flash messages by type, or all messages if no type is provided
  getMessages(type?: string): { [key: string]: string[] } | string[] {
    if (!this.req.session.flash) {
      this.req.session.flash = {};
    }
    let messages: { [key: string]: string[] } | string[] = [];

    // If type is provided, return messages for that type
    if (type) {
      messages = this.req.session.flash[type] || [];
    } else {
      // If no type is provided, return all flash messages
      messages = this.req.session.flash;
    }
    if (type) {
      delete this.req.session.flash[type];
    } else {
      this.req.session.flash = {};
    }
    return messages;
  }

  // Method to add a single message to the default "message" type
  addMessage(message: string): string[] {
    if (!this.req.session.flash) {
      this.req.session.flash = {};
    }
    this.req.session.flash["message"] = this.req.session.flash["message"] || [];
    this.req.session.flash["message"].push(message);
    return this.req.session.flash["message"];
  }

  // Method to add a message or an array of messages by type
  add(type: string, message: string | string[]): number {
    if (!this.req.session.flash) {
      this.req.session.flash = {};
    }
    this.req.session.flash[type] = this.req.session.flash[type] || [];
    if (Array.isArray(message)) {
      this.req.session.flash[type].push(...message);
    } else {
      this.req.session.flash[type].push(message);
    }
    return this.req.session.flash[type].length;
  }

  // Method to add a formatted message with placeholders
  addFormatted(type: string, format: string, ...args: any[]): number {
    if (!this.req.session.flash) {
      this.req.session.flash = {};
    }
    this.req.session.flash[type] = this.req.session.flash[type] || [];
    const formattedMessage = format.replace(
      /{(\d+)}/g,
      (match, index) => args[index]
    );
    this.req.session.flash[type].push(formattedMessage);
    return this.req.session.flash[type].length;
  }

  // The 'flash' method that handles different use cases
  flash(
    type?: string | string[],
    format?: string | string[],
    ...args: any[]
  ): any {
    if (!this.req.session.flash) {
      this.req.session.flash = {};
    }
    // Case 1: If only a type is provided, return messages for that type
    if (typeof type === "string" && !format) {
      return this.getMessages(type);
    }

    // Case 2: If only a message or array of messages is provided, add them to the default "message" type
    if (typeof type === "string" && Array.isArray(format)) {
      return this.add(type, format);
    }

    // Case 3: If a type and message are provided, add the message to the specified type
    if (typeof type === "string" && typeof format === "string") {
      return this.addFormatted(type, format, ...args);
    }

    // Case 4: If no arguments are provided, return all flash messages
    if (!type && !format) {
      return this.getMessages();
    }

    return null;
  }
}

export const flash = (req: Request, res: Response, next: NextFunction) => {
  const flashHandler = new FlashHandler(req);
  req.flash = flashHandler.flash.bind(flashHandler);
  next();
};

export const deleteFlash = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.session.flash = {};
  next();
};
