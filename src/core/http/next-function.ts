/* eslint-disable @typescript-eslint/no-empty-object-type */
import { NextFunction as ExpressNextFunction } from "express";

// Define your custom interface extending Express Request
export interface NextFunction extends ExpressNextFunction {}
