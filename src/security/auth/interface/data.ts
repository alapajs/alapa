/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Represents the authentication data for API requests.
 * Includes Bearer tokens, Basic tokens, and JWT payloads for API authentication.
 */
interface ApiAuthData {
  /**
   * The Bearer token used for API authentication.
   * Typically used for OAuth2 and API authorization.
   */
  bearerToken?: string;

  /**
   * The Basic token used for Basic Authentication.
   * This is a Base64-encoded string that contains the username and password.
   */
  basicToken?: string;

  /**
   * The JWT payload data.
   * Contains user-specific information such as the user ID (`sub`), expiration (`exp`), and issued time (`iat`).
   */
  jwtPayload?: {
    sub: string; // User ID or subject (e.g., user identifier)
    exp: number; // Expiration time (Unix timestamp)
    iat: number; // Issued at time (Unix timestamp)
    [key: string]: any; // Additional custom claims (e.g., roles or permissions)
  };

  /**
   * Clears the authentication data (Bearer token, Basic token, and JWT payload).
   * This can be used to log the user out or refresh the tokens.
   */
  clearAuthData(): void;

  /**
   * Refreshes the authentication token (for example, by requesting a new Bearer token).
   * This is often required when the token has expired or is nearing expiration.
   */
  refreshToken(): Promise<void>;
}

/**
 * Represents the user authentication data specific to the website.
 * This may include session tokens, user ID, roles, and the authentication status.
 */
interface UserAuthData {
  /**
   * The session token used for user authentication.
   * This could be a session ID, an authentication cookie, or any other token that tracks the user's login state.
   */
  sessionToken?: string;

  /**
   * The user ID of the authenticated user.
   * This could represent a unique identifier for the user in the system.
   */
  userId?: string;

  /**
   * A list of roles or permissions assigned to the user.
   * This is useful for role-based access control (RBAC) and can define the user's access rights within the system.
   */
  roles?: string[];

  /**
   * A flag indicating whether the user is authenticated or logged in.
   * This is typically true if the user has a valid session or token.
   */
  isAuthenticated?: boolean;

  /**
   * Clears the user-specific authentication data.
   * This can be used for logging out the user and invalidating their session.
   */
  clearUserAuth(): void;
}

/**
 * Combines API and user authentication data.
 * This interface provides a unified structure for managing both the API authentication and user session data.
 */
export interface AuthData {
  /**
   * API authentication data.
   * This includes Bearer tokens, Basic tokens, and JWT payloads used for API access.
   */
  api: ApiAuthData;

  /**
   * User authentication data for website login.
   * This contains session information, roles, and user ID for managing the user's authentication state.
   */
  user: UserAuthData;
}
