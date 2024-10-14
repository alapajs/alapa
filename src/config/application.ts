export interface ApplicationCongratulation {
  // Application settings
  appUrl?: string; // Base URL of the application
  appName?: string; // Name of the application
  debugMode?: boolean; // Enable or disable debug mode
  timezone?: string; // Default timezone for the application
  locale?: string; // Default locale/language for the application
  fallbackLocale?: string; // Fallback locale if the default is unavailable
  maintenanceMode?: boolean; // Enable or disable maintenance mode
  allowCors?: boolean; // Enable CORS globally
  description?: string;
}
