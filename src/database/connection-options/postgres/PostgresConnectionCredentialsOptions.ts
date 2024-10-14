
import { TlsOptions } from "tls";
/**
 * Postgres specific connection credential options.
 */
export interface PostgresConnectionCredentialsOptions {
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
    password?: string | (() => string) | (() => Promise<string>);
    /**
     * Database name to connect to.
     */
    database?: string;
    /**
     * Object with ssl parameters
     */
    ssl?: boolean | TlsOptions;
    /**
     * sets the application_name var to help db administrators identify
     * the service using this connection. Defaults to 'undefined'
     */
    applicationName?: string;
}
