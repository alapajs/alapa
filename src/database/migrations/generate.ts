import { spawn } from "node:child_process";
import { Logger } from "../../utils";

export function generateMigrations() {
  // Start the process
  const cmd = spawn("npx", [
    "typeorm-ts-node-commonjs",
    "migration:generate",
    "-d",
    "migration-runner/data-source.ts",
    "migrations/migration",
  ]);

  // Handle stdout data
  cmd.stdout.on("data", (data) => {
    Logger.info(`stdout: ${data}`);
  });

  // Handle stderr data (error case)
  cmd.stderr.on("data", (data) => {
    Logger.error(`stderr: ${data}`);
  });

  // Handle the close event when the process terminates
  cmd.on("close", (code) => {
    if (code === 0) {
      Logger.success(`Migration executed successfully with exit code ${code}`);
    } else {
      Logger.error(
        `Error executing migration. Process exited with code ${code}`
      );
      // Optionally, throw an error or handle the exit condition based on your application needs
    }
  });

  // Handle any process errors
  cmd.on("error", (err) => {
    Logger.error(`Failed to start process: ${err.message}`);
    // Handle error: You can throw, return, or gracefully handle the error
  });

  // Optional: Handle a timeout (e.g., if the process runs too long)
  const timeout = setTimeout(() => {
    Logger.error("Migration process timed out");
    cmd.kill(); // Kill the child process if it exceeds the timeout
  }, 30000); // 30 seconds timeout (adjust as needed)

  // Clear the timeout when the process completes successfully or if it's closed for any reason
  cmd.on("close", () => {
    clearTimeout(timeout);
  });

  // Optional: Handle SIGINT (Ctrl+C) or other terminations
  process.on("SIGINT", () => {
    Logger.log("Process interrupted. Killing the migration process...");
    cmd.kill(); // Kill the child process on interruption
    process.exit(1); // Exit the current process with failure status
  });
}
