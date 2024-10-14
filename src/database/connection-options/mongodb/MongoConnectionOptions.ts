/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReadPreference } from "typeorm/driver/mongodb/typings";
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
/**
 * MongoDB specific connection options.
 * Synced with http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
 */
export interface MongoConnectionOptions extends BaseDataSourceOptions {
  /**
   * Database type.
   */
  type: "mongodb";
  /**
   * Connection url where perform connection to.
   */
  url?: string;
  /**
   * Database host.
   */
  host?: string;
  /**
   * Database host replica set.
   */
  hostReplicaSet?: string;
  /**
   * Database host port.
   */
  port?: number;
  /**
   * Database username.
   */
  username?: string;
  /**
   * Database password.
   */
  password?: string;
  /**
   * Database name to connect to.
   */
  database?: string;
  /**
   * Specifies whether to force dispatch all operations to the specified host. Default: false
   */
  directConnection?: boolean;
  /**
   * The driver object
   * This defaults to require("mongodb")
   */
  driver?: any;
  /**
   * Use ssl connection (needs to have a mongod server with ssl support). Default: false
   */
  ssl?: boolean;
  /**
   * Validate mongod server certificate against ca (needs to have a mongod server with ssl support, 2.4 or higher).
   * Default: true
   */
  sslValidate?: boolean;
  /**
   * Array of valid certificates either as Buffers or Strings
   * (needs to have a mongod server with ssl support, 2.4 or higher).
   */
  sslCA?: string | Buffer;
  /**
   * String or buffer containing the certificate we wish to present
   * (needs to have a mongod server with ssl support, 2.4 or higher)
   */
  sslCert?: string | Buffer;
  /**
   * String or buffer containing the certificate private key we wish to present
   * (needs to have a mongod server with ssl support, 2.4 or higher)
   */
  sslKey?: string;
  /**
   * String or buffer containing the certificate password
   * (needs to have a mongod server with ssl support, 2.4 or higher)
   */
  sslPass?: string | Buffer;
  /**
   * SSL Certificate revocation list binary buffer
   * (needs to have a mongod server with ssl support, 2.4 or higher)
   */
  sslCRL?: string | Buffer;
  /**
   * Reconnect on error. Default: true
   */
  autoReconnect?: boolean;
  /**
   * TCP Socket NoDelay option. Default: true
   */
  noDelay?: boolean;
  /**
   * The number of milliseconds to wait before initiating keepAlive on the TCP socket. Default: 30000
   */
  keepAlive?: number;
  /**
   * TCP Connection timeout setting. Default: 30000
   */
  connectTimeoutMS?: number;
  /**
   * Version of IP stack. Can be 4, 6.
   * If undefined, will attempt to connect with IPv6, and will fall back to IPv4 on failure
   */
  family?: number;
  /**
   * TCP Socket timeout setting. Default: 360000
   */
  socketTimeoutMS?: number;
  /**
   * Server attempt to reconnect #times. Default 30
   */
  reconnectTries?: number;
  /**
   * Server will wait #milliseconds between retries. Default 1000
   */
  reconnectInterval?: number;
  /**
   * Control if high availability monitoring runs for Replicaset or Mongos proxies. Default true
   */
  ha?: boolean;
  /**
   * The High availability period for replicaset inquiry. Default: 10000
   */
  haInterval?: number;
  /**
   * The name of the replicaset to connect to
   */
  replicaSet?: string;
  /**
   * Sets the range of servers to pick when using NEAREST (lowest ping ms + the latency fence, ex: range of 1 to (1 + 15) ms).
   * Default: 15
   */
  acceptableLatencyMS?: number;
  /**
   * Sets the range of servers to pick when using NEAREST (lowest ping ms + the latency fence, ex: range of 1 to (1 + 15) ms).
   * Default: 15
   */
  secondaryAcceptableLatencyMS?: number;
  /**
   * Sets if the driver should connect even if no primary is available. Default: false
   */
  connectWithNoPrimary?: boolean;
  /**
   * If the database authentication is dependent on another databaseName.
   */
  authSource?: string;
  /**
   * The write concern.
   */
  w?: string | number;
  /**
   * The write concern timeout value.
   */
  wtimeout?: number;
  /**
   * Specify a journal write concern. Default: false
   */
  j?: boolean;
  /**
   * Force server to assign _id values instead of driver. Default: false
   */
  forceServerObjectId?: boolean;
  /**
   * Serialize functions on any object. Default: false
   */
  serializeFunctions?: boolean;
  /**
   * Specify if the BSON serializer should ignore undefined fields. Default: false
   */
  ignoreUndefined?: boolean;
  /**
   * Return document results as raw BSON buffers. Default: false
   */
  raw?: boolean;
  /**
   * Promotes Long values to number if they fit inside the 53 bits resolution. Default: true
   */
  promoteLongs?: boolean;
  /**
   * Promotes Binary BSON values to native Node Buffers. Default: false
   */
  promoteBuffers?: boolean;
  /**
   * Promotes BSON values to native types where possible, set to false to only receive wrapper types. Default: true
   */
  promoteValues?: boolean;
  /**
   * Enable the wrapping of the callback in the current domain, disabled by default to avoid perf hit. Default: false
   */
  domainsEnabled?: boolean;
  /**
   * Sets a cap on how many operations the driver will buffer up before giving up on getting a working connection,
   * default is -1 which is unlimited.
   */
  bufferMaxEntries?: number;
  /**
   * The preferred read preference (ReadPreference.PRIMARY, ReadPreference.PRIMARY_PREFERRED, ReadPreference.SECONDARY,
   * ReadPreference.SECONDARY_PREFERRED, ReadPreference.NEAREST).
   */
  readPreference?: ReadPreference | string;
  /**
   * A primary key factory object for generation of custom _id keys.
   */
  pkFactory?: any;
  /**
   * A Promise library class the application wishes to use such as Bluebird, must be ES6 compatible.
   */
  promiseLibrary?: any;
  /**
   * Specify a read concern for the collection. (only MongoDB 3.2 or higher supported).
   */
  readConcern?: any;
  /**
   * Specify a maxStalenessSeconds value for secondary reads, minimum is 90 seconds
   */
  maxStalenessSeconds?: number;
  /**
   * Specify the log level used by the driver logger (error/warn/info/debug).
   */
  loggerLevel?: "error" | "warn" | "info" | "debug";
  /**
   * Ensure we check server identify during SSL, set to false to disable checking. Only works for Node 0.12.x or higher. You can pass in a boolean or your own checkServerIdentity override function
   * Default: true
   */
  checkServerIdentity?: boolean | Function;
  /**
   * Validate MongoClient passed in options for correctness. Default: false
   */
  validateOptions?: boolean | any;
  /**
   * The name of the application that created this MongoClient instance. MongoDB 3.4 and newer will print this value in the server log upon establishing each connection. It is also recorded in the slow query log and profile collections
   */
  appname?: string;
  /**
   * Sets the authentication mechanism that MongoDB will use to authenticate the connection
   */
  authMechanism?: string;
  /**
   * Type of compression to use: snappy or zlib
   */
  compression?: any;
  /**
   * Specify a file sync write concern. Default: false
   */
  fsync?: boolean;
  /**
   * Read preference tags
   */
  readPreferenceTags?: any[];
  /**
   * The number of retries for a tailable cursor. Default: 5
   */
  numberOfRetries?: number;
  /**
   * Enable auto reconnecting for single server instances. Default: true
   */
  auto_reconnect?: boolean;
  /**
   * Enable command monitoring for this client. Default: false
   */
  monitorCommands?: boolean;
  /**
   * If present, the connection pool will be initialized with minSize connections, and will never dip below minSize connections
   */
  minSize?: number;
  /**
   * Determines whether or not to use the new url parser. Default: false
   */
  useNewUrlParser?: boolean;
  /**
   * Determines whether or not to use the new Server Discovery and Monitoring engine. Default: false
   * https://github.com/mongodb/node-mongodb-native/releases/tag/v3.2.1
   */
  useUnifiedTopology?: boolean;
  /**
   * Automatic Client-Side Field Level Encryption configuration.
   */
  autoEncryption?: any;
  /**
   * Enables or disables the ability to retry writes upon encountering transient network errors.
   */
  retryWrites?: boolean;
}
