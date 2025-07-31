import { runCommand } from "./run-cmd";

export async function runMigrations() {
  // Start the process
  const cmd =
    "npx typeorm-ts-node-commonjs migration:run -d migration-runner/data-source.ts";

  await runCommand(cmd);
}
