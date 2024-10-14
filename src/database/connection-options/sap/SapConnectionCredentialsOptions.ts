/**
 * SAP Hana specific connection credential options.
 */
export interface SapConnectionCredentialsOptions {
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
     * Encrypt database connection
     */
    encrypt?: boolean;
    /**
     * Validate database certificate
     */
    sslValidateCertificate?: boolean;
    /**
     * Key for encrypted connection
     */
    key?: string;
    /**
     * Cert for encrypted connection
     */
    cert?: string;
    /**
     * Ca for encrypted connection
     */
    ca?: string;
}
