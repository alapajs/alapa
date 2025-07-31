import { runCommand } from "./run-cmd";

export async function generateMigrations() {
  // Start the process
  const cmd =
    "npx typeorm-ts-node-commonjs migration:generate -d migration-runner/data-source.ts  migrations/migration";

  await runCommand(cmd);
}
