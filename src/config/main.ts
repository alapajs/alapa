// Import all configuration modules
// import { serverConfig } from './server';
import { APIConfiguration } from "./api";
import { ApplicationCongratulation } from "./application";
import { AutConfiguration } from "./auth";
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
  server: ServerConfiguration;
  templateEngine: TemplateEngineConfiguration;
  database: DatabaseConfiguration;
  logger: LoggerConfiguration;
  email?: EmailConfiguration;
  jwt?: JWTConfiguration;
  session?: SessionConfiguration;
  security?: SecurityConfiguration;
  cache?: CacheConfiguration;
  queue?: QueueConfiguration;
  monitoring?: MonitoringConfiguration;
  middleware: MiddlewareConfiguration;
  storage?: StorageConfiguration;
  scheduler?: CacheConfiguration;
  auth: AutConfiguration;
  application: ApplicationCongratulation;
  api: APIConfiguration;
  encryption: EncryptionCongratulation;
}
