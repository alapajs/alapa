export interface ApplicationCongratulation {
  /** Base URL of the application */
  appUrl?: string;
  /** Name of the application */
  appName?: string;
  /** Enable or disable debug mode */
  debugMode?: boolean;
  /** Default timezone for the application */
  timezone?: string;
  /** Default locale/language for the application */
  locale?: string;
  /** Fallback locale if the default is unavailable */
  fallbackLocale?: string;
  /** Enable or disable maintenance mode */
  maintenanceMode?: boolean;
  /** Enable CORS globally */
  allowCors?: boolean;
  /** Description of the application */
  description?: string;
}
