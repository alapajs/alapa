// Import all configuration modules
// import { serverConfig } from './server';
import { APIConfiguration } from "./api";
import { ApplicationCongratulation } from "./application";
import { AutConfiguration } from "./auth";
import { BrokerConfiguration } from "./broker";
import { CacheConfiguration } from "./cache";
import { DatabaseConfiguration } from "./database";
import { EmailConfiguration } from "./email";
import { EncryptionCongratulation } from "./encryption";
import { JWTConfiguration } from "./jwt";
import { LoggerConfiguration } from "./logger";
import { MiddlewareConfiguration } from "./middleware";
import { MonitoringConfiguration } from "./monitoring";
import { QueueConfiguration } from "./queue";
import { SecurityConfiguration } from "./security";
import { ServerConfiguration } from "./server";
import { SessionConfiguration } from "./session";
import { StorageConfiguration } from "./storage";
import { TemplateEngineConfiguration } from "./template-engine";

export interface Configuration {
  /** Server configuration */
  server: ServerConfiguration;
  /** Template engine configuration */
  templateEngine: TemplateEngineConfiguration;
  /** Database configuration */
  database: DatabaseConfiguration;
  /** Logger configuration */
  logger: LoggerConfiguration;
  /** Email configuration */
  email?: EmailConfiguration;
  /** JWT configuration */
  jwt?: JWTConfiguration;
  /** Session configuration */
  session?: SessionConfiguration;
  /** Security configuration */
  security?: SecurityConfiguration;
  /** Cache configuration */
  cache?: CacheConfiguration;
  /** Queue configuration */
  queue?: QueueConfiguration;
  /** Monitoring configuration */
  monitoring?: MonitoringConfiguration;
  /** Middleware configuration */
  middleware: MiddlewareConfiguration;
  /** Storage configuration */
  storage?: StorageConfiguration;
  /** Scheduler configuration */
  scheduler?: CacheConfiguration;
  /** Auth configuration */
  auth: AutConfiguration;
  /** Application configuration */
  application: ApplicationCongratulation;
  /** API configuration */
  api: APIConfiguration;
  /** Encryption configuration */
  encryption: EncryptionCongratulation;
  /** Broker configuration */
  broker?: BrokerConfiguration;
}
