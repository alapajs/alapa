// broker.interface.ts
export interface BrokerMessage<T = any> {
  /** The message payload */
  data: T;

  /** Optional metadata (headers, timestamp, etc.) */
  metadata?: Record<string, any>;

  /** Acknowledge successful processing (for at-least-once delivery) */
  ack?: () => void;

  /** Reject or requeue a message if processing fails */
  nack?: (err?: any) => void;
}

export interface BrokerSubscription {
  /** The topic or queue name subscribed to */
  topic: string;

  /** Cancel or stop listening to the topic */
  unsubscribe: () => Promise<void>;
}

export abstract class BrokerAdapter<T = any> {
  /**
   * Establish a connection to the broker.
   * Should handle reconnection logic internally if supported.
   */
  abstract connect(): Promise<void>;

  /**
   * Gracefully close all connections and clean up resources.
   */
  abstract disconnect(): Promise<void>;

  /**
   * Publish a message to a specific topic, exchange, or channel.
   *
   * @param topic - The target topic, queue, or exchange name.
   * @param message - The message payload to send.
   * @param options - Additional publishing options (headers, key, etc.)
   */
  abstract publish(
    topic: string,
    message: T,
    options?: Record<string, any>
  ): Promise<void>;

  /**
   * Subscribe to a topic or queue and process messages with a handler.
   *
   * @param topic - The topic or queue to subscribe to.
   * @param handler - Callback for incoming messages.
   * @returns A subscription object with an unsubscribe method.
   */
  abstract subscribe(
    topic: string,
    handler: (message: BrokerMessage<T>) => Promise<void> | void
  ): Promise<BrokerSubscription>;

  /**
   * Unsubscribe from a given topic or queue.
   * Optionally used for graceful shutdown or dynamic subscription management.
   *
   * @param topic - The topic or queue to unsubscribe from.
   */
  abstract unsubscribe(topic: string): Promise<void>;

  /**
   * Optional: Send a request message and wait for a correlated reply.
   * Useful for RPC-style messaging patterns.
   *
   * @param topic - The request topic.
   * @param payload - The data to send.
   * @param timeout - Maximum time (ms) to wait for a response.
   * @returns The response payload.
   */
  abstract request<R = any>(
    topic: string,
    payload: T,
    timeout?: number
  ): Promise<R>;

  /**
   * Optional: Whether the broker is currently connected.
   */
  abstract isConnected(): boolean;

  abstract readonly adapterName: string;
}
