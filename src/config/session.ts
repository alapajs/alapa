/* eslint-disable @typescript-eslint/no-explicit-any */
import { CookieOptions } from "express-session";
import { Request } from "express";
export interface SessionConfiguration {
  expiresIn?: number;
  /**
   * This is the secret used to sign the session cookie. This can be either a string for a single secret, or an array of multiple secrets.
   * If an array of secrets is provided, **only the first element will be used to sign** the session ID cookie,
   *   while **all the elements will be considered when verifying the signature** in requests.
   * The secret itself should be not easily parsed by a human and would best be a random set of characters
   *
   * Best practices may include:
   * - The use of environment variables to store the secret, ensuring the secret itself does not exist in your repository.
   * - Periodic updates of the secret, while ensuring the previous secret is in the array.
   *
   * Using a secret that cannot be guessed will reduce the ability to hijack a session to only guessing the session ID (as determined by the `genid` option).
   *
   * Changing the secret value will invalidate all existing sessions.
   * In order to rotate the secret without invalidating sessions, provide an array of secrets,
   *   with the new secret as first element of the array, and including previous secrets as the later elements.
   */
  secret: string | string[];

  /**
   * Function to call to generate a new session ID. Provide a function that returns a string that will be used as a session ID.
   * The function is given the request as the first argument if you want to use some value attached to it when generating the ID.
   *
   * The default value is a function which uses the uid-safe library to generate IDs.
   * Be careful to generate unique IDs so your sessions do not conflict.
   */
  genid?(req: Request): string;

  /**
   * The name of the session ID cookie to set in the response (and read from in the request).
   * The default value is 'connect.sid'.
   *
   * Note if you have multiple apps running on the same hostname (this is just the name, i.e. `localhost` or `127.0.0.1`; different schemes and ports do not name a different hostname),
   *   then you need to separate the session cookies from each other.
   * The simplest method is to simply set different names per app.
   */
  name?: string | undefined;

  /**
   * The session store instance, defaults to a new `MemoryStore` instance.
   * @see MemoryStore
   */
  store?: any | undefined;

  /**
   * Settings object for the session ID cookie.
   * @see CookieOptions
   */
  cookie?: CookieOptions | undefined;

  /**
   * Force the session identifier cookie to be set on every response. The expiration is reset to the original `maxAge`, resetting the expiration countdown.
   * The default value is `false`.
   *
   * With this enabled, the session identifier cookie will expire in `maxAge` *since the last response was sent* instead of in `maxAge` *since the session was last modified by the server*.
   * This is typically used in conjuction with short, non-session-length `maxAge` values to provide a quick timeout of the session data
   *   with reduced potential of it occurring during on going server interactions.
   *
   * Note that when this option is set to `true` but the `saveUninitialized` option is set to `false`, the cookie will not be set on a response with an uninitialized session.
   * This option only modifies the behavior when an existing session was loaded for the request.
   *
   * @see saveUninitialized
   */
  rolling?: boolean | undefined;

  /**
   * Forces the session to be saved back to the session store, even if the session was never modified during the request.
   * Depending on your store this may be necessary, but it can also create race conditions where a client makes two parallel requests to your server
   *   and changes made to the session in one request may get overwritten when the other request ends, even if it made no changes (this behavior also depends on what store you're using).
   *
   * The default value is `true`, but using the default has been deprecated, as the default will change in the future.
   * Please research into this setting and choose what is appropriate to your use-case. Typically, you'll want `false`.
   *
   * How do I know if this is necessary for my store? The best way to know is to check with your store if it implements the `touch` method.
   * If it does, then you can safely set `resave: false`.
   * If it does not implement the `touch` method and your store sets an expiration date on stored sessions, then you likely need `resave: true`.
   */
  resave?: boolean | undefined;

  /**
   * Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header).
   * The default value is undefined.
   *
   * - `true`: The `X-Forwarded-Proto` header will be used.
   * - `false`: All headers are ignored and the connection is considered secure only if there is a direct TLS/SSL connection.
   * - `undefined`: Uses the "trust proxy" setting from express
   */
  proxy?: boolean | undefined;

  /**
   * Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
   * Choosing `false` is useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie.
   * Choosing `false` will also help with race conditions where a client makes multiple parallel requests without a session.
   *
   * The default value is `true`, but using the default has been deprecated, as the default will change in the future.
   * Please research into this setting and choose what is appropriate to your use-case.
   *
   * **If you are using `express-session` in conjunction with PassportJS:**
   * Passport will add an empty Passport object to the session for use after a user is authenticated, which will be treated as a modification to the session, causing it to be saved.
   * This has been fixed in PassportJS 0.3.0.
   */
  saveUninitialized?: boolean | undefined;

  /**
   * Control the result of unsetting req.session (through delete, setting to null, etc.).
   * - `destroy`: The session will be destroyed (deleted) when the response ends.
   * - `keep`: The session in the store will be kept, but modifications made during the request are ignored and not saved.
   * @default 'keep'
   */
  unset?: "destroy" | "keep" | undefined;
  redisConfig?: {
    // Redis configuration for session storage
    host?: string;
    port?: number;
    password?: string;
    user?: string;
    url?: string;
  };
  databaseConfig?: {
    tableName: string;
  };
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none"; // SameSite attribute for cookies
}
