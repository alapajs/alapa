/**
 * Oracle specific connection credential options.
 */
export interface OracleConnectionCredentialsOptions {
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
     * Connection SID.
     */
    sid?: string;
    /**
     * Connection Service Name.
     */
    serviceName?: string;
    /**
     * Embedded TNS Connection String
     */
    connectString?: string;
}
