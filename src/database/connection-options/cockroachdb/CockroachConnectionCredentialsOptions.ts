
import { TlsOptions } from "tls";
/**
 * Cockroachdb specific connection credential options.
 */
export interface CockroachConnectionCredentialsOptions {
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
     * Object with ssl parameters
     */
    ssl?: boolean | TlsOptions;
}
