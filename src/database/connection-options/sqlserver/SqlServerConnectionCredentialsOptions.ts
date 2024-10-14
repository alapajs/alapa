import { DefaultAuthentication } from "./authentication/DefaultAuthentication";
import { AzureActiveDirectoryAccessTokenAuthentication } from "./authentication/AzureActiveDirectoryAccessTokenAuthentication";
import { AzureActiveDirectoryDefaultAuthentication } from "./authentication/AzureActiveDirectoryDefaultAuthentication";
import { AzureActiveDirectoryMsiAppServiceAuthentication } from "./authentication/AzureActiveDirectoryMsiAppServiceAuthentication";
import { AzureActiveDirectoryMsiVmAuthentication } from "./authentication/AzureActiveDirectoryMsiVmAuthentication";
import { AzureActiveDirectoryPasswordAuthentication } from "./authentication/AzureActiveDirectoryPasswordAuthentication";
import { AzureActiveDirectoryServicePrincipalSecret } from "./authentication/AzureActiveDirectoryServicePrincipalSecret";
import { NtlmAuthentication } from "./authentication/NtlmAuthentication";
export type SqlServerConnectionCredentialsAuthenticationOptions = DefaultAuthentication | NtlmAuthentication | AzureActiveDirectoryAccessTokenAuthentication | AzureActiveDirectoryDefaultAuthentication | AzureActiveDirectoryMsiAppServiceAuthentication | AzureActiveDirectoryMsiVmAuthentication | AzureActiveDirectoryPasswordAuthentication | AzureActiveDirectoryServicePrincipalSecret;
/**
 * SqlServer specific connection credential options.
 */
export interface SqlServerConnectionCredentialsOptions {
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
     * Database name to connect to.
     */
    database?: string;
    /**
     * Database username.
     */
    username?: string;
    /**
     * Database password.
     */
    password?: string;
    /**
     * Authentication settings
     * It overrides username and password, when passed.
     */
    authentication?: SqlServerConnectionCredentialsAuthenticationOptions;
    /**
     * Once you set domain, driver will connect to SQL Server using domain login.
     * @see SqlServerConnectionCredentialsOptions.authentication
     * @see NtlmAuthentication
     * @deprecated
     */
    domain?: string;
}
