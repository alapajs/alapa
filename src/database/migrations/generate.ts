import { runCommand } from "./run-cmd";

export async function generateMigrations() {
  // Start the process
  const cmd =
    "npx typeorm migration:generate -d migration-runner/data-source.js  migrations/migration -o";

  await runCommand(cmd);
}
