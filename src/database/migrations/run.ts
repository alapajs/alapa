import { runCommand } from "./cmd";

export async function runMigrations() {
  // Start the process
  const cmd = "npx typeorm migration:run -d migration-runner/data-source.js";

  await runCommand(cmd);
}
