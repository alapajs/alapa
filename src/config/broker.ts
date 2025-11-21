import { BrokerAdapter } from "../interface";

export interface BrokerConfiguration {
  adapter?: { new (): BrokerAdapter };
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  virtualHost?: string;
  ssl?: boolean;
  enabled?: boolean;
  url?: string;
  protocol?: string;
  headers?: Record<string, string>;
  options?: Record<string, any>;
  connectionOptions?: Record<string, any>;
  socketOptions?: Record<string, any>;
  authentication?: Record<string, string>;
  retry?: {
    retries: number;
    factor: number;
    maxTimeout: number;
  };
  timeout?: number;
  prefetch?: number;
  heartbeat?: number;
  queueOptions?: Record<string, any>;
  consumerOptions?: Record<string, any>;
  publisherOptions?: Record<string, any>;
  replyToQueueOptions?: Record<string, any>;
  replyToQueueName?: string;
  replyToQueueRoutingKey?: string;
  replyToQueueCorrelationId?: string;
  replyToQueueExpiration?: number;
  replyToQueueTtl?: number;
  replyToQueueDeadLetterExchange?: string;
  replyToQueueDeadLetterRoutingKey?: string;
  replyToQueueMaxLength?: number;
  replyToQueueMaxLengthBytes?: number;
  replyToQueueMessageTtl?: number;
}
