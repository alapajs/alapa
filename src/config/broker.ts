import { BrokerAdapter } from "../interface";

export interface BrokerConfiguration {
  /** Broker adapter class */
  adapter?: { new (): BrokerAdapter };
  /** Broker host */
  host?: string;
  /** Broker port */
  port?: number;
  /** Broker username */
  username?: string;
  /** Broker password */
  password?: string;
  /** Broker virtual host */
  virtualHost?: string;
  /** Enable or disable SSL */
  ssl?: boolean;
  /** Enable or disable broker */
  enabled?: boolean;
  /** Broker URL */
  url?: string;
  /** Broker protocol */
  protocol?: string;
  /** Broker headers */
  headers?: Record<string, string>;
  /** Broker options */
  options?: Record<string, any>;
  /** Broker connection options */
  connectionOptions?: Record<string, any>;
  /** Broker socket options */
  socketOptions?: Record<string, any>;
  /** Broker authentication */
  authentication?: Record<string, string>;
  /** Broker retry options */
  retry?: {
    /** Number of retries */
    retries: number;
    factor: number;
    maxTimeout: number;
  };
  /** Broker timeout */
  timeout?: number;
  /** Broker prefetch */
  prefetch?: number;
  /** Broker heartbeat */
  heartbeat?: number;
  /** Broker queue options */
  queueOptions?: Record<string, any>;
  /** Broker consumer options */
  consumerOptions?: Record<string, any>;
  /** Broker publisher options */
  publisherOptions?: Record<string, any>;
  /** Broker reply-to queue options */
  replyToQueueOptions?: Record<string, any>;
  /** Broker reply-to queue name */
  replyToQueueName?: string;
  /** Broker reply-to queue routing key */
  replyToQueueRoutingKey?: string;
  /** Broker reply-to queue correlation ID */
  replyToQueueCorrelationId?: string;
  /** Broker reply-to queue expiration */
  replyToQueueExpiration?: number;
  /** Broker reply-to queue TTL */
  replyToQueueTtl?: number;
  /** Broker reply-to queue dead-letter exchange */
  replyToQueueDeadLetterExchange?: string;
  /** Broker reply-to queue dead-letter routing key */
  replyToQueueDeadLetterRoutingKey?: string;
  /** Broker reply-to queue max length */
  replyToQueueMaxLength?: number;
  /** Broker reply-to queue max length bytes */
  replyToQueueMaxLengthBytes?: number;
  /** Broker reply-to queue message TTL */
  replyToQueueMessageTtl?: number;
}
