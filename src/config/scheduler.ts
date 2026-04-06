export interface SchedulerCongratulation {
  /** Timezone for scheduled tasks */
  timezone?: string;
  /** List of cron jobs */
  cronJobs?: {
    /** Cron job name and schedule (e.g., "backup" : "0 0 * * *") */
    [name: string]: string;
  };
  /** Maximum concurrent jobs */
  maxConcurrency?: number;
}
