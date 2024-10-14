/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * MySQL specific connection credential options.
 *
 * @see https://github.com/mysqljs/mysql#connection-options
 */
export interface MysqlConnectionCredentialsOptions {
  /**
   * Connection url where perform connection to.
   */
  url?: string;
  /**
   * Database host.
   */
  host?: string;
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
   * Object with ssl parameters or a string containing name of ssl profile.
   */
  ssl?: any;
  /**
   * Database socket path
   */
  socketPath?: string;
}
