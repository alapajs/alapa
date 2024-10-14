export interface SchedulerCongratulation {
  timezone?: string; // Timezone for scheduled tasks
  cronJobs?: {
    // List of cron jobs
    [name: string]: string; // Cron job name and schedule (e.g., "backup" : "0 0 * * *")
  };
  maxConcurrency?: number; // Maximum concurrent jobs
}
