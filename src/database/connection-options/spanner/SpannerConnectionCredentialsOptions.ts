/**
 * Spanner specific connection credential options.
 */
export interface SpannerConnectionCredentialsOptions {
    /**
     * Connection url where perform connection to.
     */
    instanceId?: string;
    /**
     * Database host.
     */
    projectId?: string;
    /**
     * Database host port.
     */
    databaseId?: string;
}
