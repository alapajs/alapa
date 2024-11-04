/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDataSourceOptions } from "../BaseDataSourceOptions";
import { ReplicationMode } from "typeorm/driver/types/ReplicationMode";
import { SqlServerConnectionCredentialsOptions } from "./SqlServerConnectionCredentialsOptions";
/**
 * Microsoft Sql Server specific connection options.
 */
export interface SqlServerConnectionOptions
  extends BaseDataSourceOptions,
    SqlServerConnectionCredentialsOptions {
  /**
   * Database type.
   */
  type: "mssql";
  /**
   * Connection timeout in ms (default: 15000).
   */
  connectionTimeout?: number;
  /**
   * Request timeout in ms (default: 15000). NOTE: msnodesqlv8 driver doesn't support timeouts < 1 second.
   */
  requestTimeout?: number;
  /**
   * Stream recordsets/rows instead of returning them all at once as an argument of callback (default: false).
   * You can also enable streaming for each request independently (request.stream = true).
   * Always set to true if you plan to work with large amount of rows.
   */
  stream?: boolean;
  /**
   * Database schema.
   */
  schema?: string;
  /**
   * The driver object
   * This defaults to `require("mssql")`
   */
  driver?: any;
  /**
   * An optional object/dictionary with the any of the properties
   */
  pool?: {
    /**
     * Maximum number of resources to create at any given time. (default=1)
     */
    max?: number;
    /**
     * Minimum number of resources to keep in pool at any given time. If this is set >= max, the pool will silently
     * set the min to equal max. (default=0)
     */
    min?: number;
    /**
     * Maximum number of queued requests allowed, additional acquire calls will be callback with an err in a future
     * cycle of the event loop.
     */
    maxWaitingClients?: number;
    /**
     * Max milliseconds an acquire call will wait for a resource before timing out. (default no limit), if supplied should non-zero positive integer.
     */
    acquireTimeoutMillis?: number;
    /**
     * If true the oldest resources will be first to be allocated. If false the most recently released resources will
     * be the first to be allocated. This in effect turns the pool's behaviour from a queue into a stack. boolean,
     * (default true)
     */
    fifo?: boolean;
    /**
     * Int between 1 and x - if set, borrowers can specify their relative priority in the queue if no resources
     * are available. see example. (default 1)
     */
    priorityRange?: number;
    /**
     * How often to run eviction checks. Default: 0 (does not run).
     */
    evictionRunIntervalMillis?: number;
    /**
     * Number of resources to check each eviction run. Default: 3.
     */
    numTestsPerRun?: number;
    /**
     * Amount of time an object may sit idle in the pool before it is eligible for eviction by the idle object
     * evictor (if any), with the extra condition that at least "min idle" object instances remain in the pool.
     * Default -1 (nothing can get evicted)
     */
    softIdleTimeoutMillis?: number;
    /**
     * The minimum amount of time that an object may sit idle in the pool before it is eligible for eviction due
     * to idle time. Supercedes softIdleTimeoutMillis Default: 30000
     */
    idleTimeoutMillis?: number;
    errorHandler?: (err: any) => any;
  };
  /**
   * Extra options
   */
  options?: {
    /**
     * The named instance to connect to
     */
    instanceName?: string;
    /**
     * By default, if the database requestion by options.database cannot be accessed, the connection will fail with
     * an error. However, if options.fallbackToDefaultDb is set to true, then the user's default database will
     * be used instead (Default: false).
     */
    fallbackToDefaultDb?: boolean;
    /**
     * If true, SET ANSI_NULL_DFLT_ON ON will be set in the initial sql. This means new columns will be nullable by
     * default. See the T-SQL documentation for more details. (Default: true).
     */
    enableAnsiNullDefault?: boolean;
    /**
     * The number of milliseconds before the attempt to connect is considered failed (default: 15000).
     */
    connectTimeout?: number;
    /**
     * The number of milliseconds before the cancel (abort) of a request is considered failed (default: 5000).
     */
    cancelTimeout?: number;
    /**
     * The size of TDS packets (subject to negotiation with the server). Should be a power of 2. (default: 4096).
     */
    packetSize?: number;
    /**
     * A boolean determining whether to pass time values in UTC or local time. (default: false).
     */
    useUTC?: boolean;
    /**
     * A boolean determining whether to rollback a transaction automatically if any error is encountered during
     * the given transaction's execution. This sets the value for SET XACT_ABORT during the initial SQL phase
     * of a connection (documentation).
     */
    abortTransactionOnError?: boolean;
    /**
     * A string indicating which network interface (ip address) to use when connecting to SQL Server.
     */
    localAddress?: string;
    /**
     * A boolean determining whether to return rows as arrays or key-value collections. (default: false).
     */
    useColumnNames?: boolean;
    /**
     * A boolean, controlling whether the column names returned will have the first letter converted to lower case
     * (true) or not. This value is ignored if you provide a columnNameReplacer. (default: false).
     */
    camelCaseColumns?: boolean;
    /**
     * A boolean, controlling whatever to disable RETURNING / OUTPUT statements.
     */
    disableOutputReturning?: boolean;
    /**
     * A boolean, controlling whether MssqlParameter types char, varchar, and text are converted to their unicode equivalents, nchar, nvarchar, and ntext.
     * (default: false, meaning that char/varchar/text parameters will be converted to nchar/nvarchar/ntext)
     */
    disableAsciiToUnicodeParamConversion?: boolean;
    /**
     * Debug options
     */
    debug?: {
      /**
       * A boolean, controlling whether debug events will be emitted with text describing packet details
       * (default: false).
       */
      packet?: boolean;
      /**
       * A boolean, controlling whether debug events will be emitted with text describing packet data details
       * (default: false).
       */
      data?: boolean;
      /**
       * A boolean, controlling whether debug events will be emitted with text describing packet payload details
       * (default: false).
       */
      payload?: boolean;
      /**
       * A boolean, controlling whether debug events will be emitted with text describing token stream tokens
       * (default: false).
       */
      token?: boolean;
    };
    /**
     * The default isolation level that transactions will be run with. The isolation levels are available
     * from require('tedious').ISOLATION_LEVEL. (default: READ_COMMITTED).
     */
    isolation?:
      | "READ_UNCOMMITTED"
      | "READ_COMMITTED"
      | "REPEATABLE_READ"
      | "SERIALIZABLE"
      | "SNAPSHOT";
    /**
     * The default isolation level for new connections. All out-of-transaction queries are executed with this
     * setting. The isolation levels are available from require('tedious').ISOLATION_LEVEL .
     */
    connectionIsolationLevel?:
      | "READ_UNCOMMITTED"
      | "READ_COMMITTED"
      | "REPEATABLE_READ"
      | "SERIALIZABLE"
      | "SNAPSHOT";
    /**
     * A boolean, determining whether the connection will request read only access from a SQL Server
     * Availability Group. For more information, see here. (default: false).
     */
    readOnlyIntent?: boolean;
    /**
     * A boolean determining whether or not the connection will be encrypted. Set to true if you're on
     * Windows Azure. (default: true).
     */
    encrypt?: boolean;
    /**
     * When encryption is used, an object may be supplied that will be used for the first argument when calling
     * tls.createSecurePair (default: {}).
     */
    cryptoCredentialsDetails?: any;
    /**
     * A boolean, that when true will expose received rows in Requests' done* events. See done, doneInProc and
     * doneProc. (default: false)
     * Caution: If many row are received, enabling this option could result in excessive memory usage.
     */
    rowCollectionOnDone?: boolean;
    /**
     * A boolean, that when true will expose received rows in Requests' completion callback. See new Request. (default: false)
     * Caution: If many row are received, enabling this option could result in excessive memory usage.
     */
    rowCollectionOnRequestCompletion?: boolean;
    /**
     * The version of TDS to use. If server doesn't support specified version, negotiated version is used instead.
     * The versions are available from require('tedious').TDS_VERSION. (default: 7_4).
     */
    tdsVersion?: string;
    /**
     * A boolean, that when true will abort a query when an overflow or divide-by-zero error occurs during query execution.
     */
    enableArithAbort?: boolean;
    /**
     * Application name used for identifying a specific application in profiling, logging or tracing tools of SQL Server.
     * (default: node-mssql)
     */
    appName?: string;
    /**
     * A boolean, controlling whether encryption occurs if there is no verifiable server certificate.
     * (default: false)
     */
    trustServerCertificate?: boolean;
  };
  /**
   * Replication setup.
   */
  replication?: {
    /**
     * Master server used by orm to perform writes.
     */
    master: SqlServerConnectionCredentialsOptions;
    /**
     * List of read-from severs (slaves).
     */
    slaves: SqlServerConnectionCredentialsOptions[];
    /**
     * Default connection pool to use for SELECT queries
     * @default "slave"
     */
    defaultMode?: ReplicationMode;
  };
  poolSize?: never;
}